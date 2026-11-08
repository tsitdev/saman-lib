import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { SamanDeskCore } from '../src/core'
import { type OutgoingMessage, type SamanDeskConfig } from '../src/core/types'

class TestCore extends SamanDeskCore {
  messages: OutgoingMessage[] = []

  protected override sendMessage(message: OutgoingMessage) {
    this.messages.push(message)
  }
}

const instances: TestCore[] = []
const message = (action: string, data?: unknown, id?: number) => ({
  from: 'SamanDesk',
  action,
  data,
  id,
})

function create(config: Partial<SamanDeskConfig> = {}) {
  const core = new TestCore({ workspaceID: 'workspace', ...config })
  instances.push(core)
  return core
}

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  instances.splice(0).forEach((core) => core.destroy())
  vi.useRealTimers()
})

describe('configuration and destinations', () => {
  it.each([
    {},
    { workspaceID: '' },
    { workspaceID: '   ' },
    { workspaceID: 'null' },
    { workspaceID: 'undefined' },
    { workspaceID: 123 },
    { verifiedToken: '' },
    { verifiedToken: '   ' },
    { verifiedToken: 'null' },
    { workspaceID: 'workspace', onReady: true },
    { workspaceID: 'workspace', language: '' },
    { workspaceID: 'workspace', theme: { color: 'not-a-color' } },
    { workspaceID: 'workspace', theme: { darkMode: 'system' } },
    { workspaceID: 'workspace', handshakeTimeoutMs: 0 },
    { workspaceID: 'workspace', handshakeTimeoutMs: NaN },
    { workspaceID: 'workspace', handshakeTimeoutMs: 2147483648 },
    { workspaceID: 'workspace', siteUrl: 'javascript:alert(1)' },
    { workspaceID: 'workspace', siteUrl: 'https://user:password@example.com' },
    { workspaceID: 'workspace', siteUrl: 'https://example.com/?token=secret' },
    { workspaceID: 'workspace', siteUrl: 'https://example.com/#fragment' },
  ])('rejects invalid configuration: %j', (config) => {
    expect(() => new TestCore(config as SamanDeskConfig)).toThrow(
      expect.objectContaining({ code: 'INVALID_CONFIG' }),
    )
  })

  it('normalizes the base URL and credentials and prefers verified login', () => {
    const core = create({
      siteUrl: 'https://support.example.com/base///',
      workspaceID: ' workspace ',
      verifiedToken: ' input/token + ',
    })
    expect(core.getInitialUrl()).toBe(
      'https://support.example.com/base/setup-interoperation/input%2Ftoken%20%2B',
    )
    core.handleIncomingMessage(message('setToken', { token: ' session/token + ' }))
    expect(core.getOpenUrl()).toBe(
      'https://support.example.com/base/department-selection?token=session%2Ftoken%20%2B',
    )
    expect(core.getOpenUrl('conversation/123')).toBe(
      'https://support.example.com/base/conversation/123',
    )
  })

  it.each([
    'https://attacker.example.com/conversation',
    '//attacker.example.com/conversation',
    'http://samandesk.com/conversation',
    'https://samandesk.com:8443/conversation',
    'https://user:secret@samandesk.com/conversation',
    'javascript:alert(1)',
  ])('rejects an unsafe or cross-origin destination: %s', (link) => {
    expect(() => create().getOpenUrl(link)).toThrow(
      expect.objectContaining({ code: 'INVALID_LINK' }),
    )
  })
})

describe('authentication lifecycle', () => {
  it('delivers each new session once and in the documented order', () => {
    const calls: string[] = []
    const core = create({
      onReady: (token) => calls.push('ready:' + token),
      onTokenChange: (token) => calls.push('token:' + token),
    })
    core.startHandshake()
    core.handleIncomingMessage(message('setToken', { token: 'first' }))
    core.handleIncomingMessage(JSON.stringify(message('setToken', { token: 'first' })))
    core.handleIncomingMessage(message('setToken', { token: 'second' }))
    expect(calls).toEqual(['ready:first', 'token:first', 'ready:second', 'token:second'])
    expect(core.isReady).toBe(true)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('allows the user time to complete guest login after the form becomes ready', () => {
    const onError = vi.fn()
    const onGuestReady = vi.fn()
    const core = create({ onError, onGuestReady, handshakeTimeoutMs: 100 })
    core.startHandshake()
    core.handleIncomingMessage(message('setGuestReadyEvent'))
    vi.advanceTimersByTime(1000)
    expect(onGuestReady).toHaveBeenCalledOnce()
    expect(onError).not.toHaveBeenCalled()
    expect(core.isReady).toBe(false)
    core.handleIncomingMessage(message('setToken', { token: 'session' }))
    expect(core.isReady).toBe(true)
  })

  it('does not accept a guest-ready event as completion of verified login', () => {
    const onError = vi.fn()
    const core = create({ verifiedToken: 'verified', handshakeTimeoutMs: 100, onError })
    core.startHandshake()
    core.handleIncomingMessage(message('setGuestReadyEvent'))
    vi.advanceTimersByTime(100)
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: 'HANDSHAKE_TIMEOUT' }))
  })

  it('reports a timeout once and ignores late tokens until a new attempt starts', () => {
    const onError = vi.fn()
    const onReady = vi.fn()
    const core = create({ handshakeTimeoutMs: 100, onError, onReady })
    core.startHandshake()
    vi.advanceTimersByTime(1000)
    core.handleIncomingMessage(message('setToken', { token: 'too-late' }))
    expect(onError).toHaveBeenCalledOnce()
    expect(onReady).not.toHaveBeenCalled()
    core.startHandshake()
    core.handleIncomingMessage(message('setToken', { token: 'fresh-session' }))
    expect(onReady).toHaveBeenCalledWith('fresh-session')
    expect(core.hasFailed).toBe(false)
  })

  it.each(['', ' ', 'null', 'undefined', 42, null])(
    'rejects an invalid session token: %j',
    (token) => {
      const onError = vi.fn()
      const core = create({ onError })
      core.startHandshake()
      core.handleIncomingMessage(message('setToken', { token }))
      expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: 'INVALID_MESSAGE' }))
      expect(core.isReady).toBe(false)
    },
  )

  it('ignores malformed messages and messages with an unrelated sender', () => {
    const onReady = vi.fn()
    const onError = vi.fn()
    const core = create({ onReady, onError })
    for (const data of [
      'not-json',
      null,
      123,
      {},
      { from: 'other', action: 'setToken', data: { token: 'stolen' } },
    ]) {
      core.handleIncomingMessage(data)
    }
    expect(onReady).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
  })

  it('responds to configuration requests without leaking credentials', () => {
    const core = create({ verifiedToken: 'secret', theme: { color: 'teal' }, language: 'en' })
    core.handleIncomingMessage(message('getConfig', undefined, 7))
    core.handleIncomingMessage(message('getConfig', undefined, NaN))
    expect(core.messages).toEqual([
      {
        from: 'SamanDesk',
        action: 'getConfig',
        id: 7,
        data: { color: 'teal', theme: 'light', language: 'en' },
      },
    ])
  })

  it('reports callback exceptions without losing a valid session', () => {
    const onError = vi.fn()
    const core = create({
      onReady: () => {
        throw new Error('host callback failed')
      },
      onError,
    })
    core.handleIncomingMessage(message('setToken', { token: 'session' }))
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: 'CALLBACK_ERROR' }))
    expect(core.isReady).toBe(true)
  })

  it('stops notifications when onReady destroys the instance', () => {
    const onTokenChange = vi.fn()
    const core = create({ onReady: () => core.destroy(), onTokenChange })
    core.startHandshake()
    core.handleIncomingMessage(message('setToken', { token: 'session' }))
    expect(onTokenChange).not.toHaveBeenCalled()
    expect(core.isReady).toBe(false)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('cancels timers and ignores all later messages after destruction', () => {
    const onReady = vi.fn()
    const onError = vi.fn()
    const core = create({ onReady, onError })
    core.startHandshake()
    core.destroy()
    vi.advanceTimersByTime(60000)
    core.handleIncomingMessage(message('setToken', { token: 'late' }))
    expect(onReady).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
    expect(core.getInitialUrl()).toBe('https://samandesk.com/guest-login/workspace')
  })
})
