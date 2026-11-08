// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { createSamanDeskWeb, type SamanDeskConfig } from '../src'

type Support = ReturnType<typeof createSamanDeskWeb>
const instances: Support[] = []
const origin = 'https://samandesk.com'

function create(config: Partial<SamanDeskConfig> = {}, options: Parameters<typeof createSamanDeskWeb>[1] = {}) {
  const onReady = vi.fn()
  const onClose = vi.fn()
  const onError = vi.fn()
  const api = createSamanDeskWeb({ workspaceID: 'workspace', onReady, onClose, onError, ...config }, options)
  instances.push(api)
  const frame = document.querySelector<HTMLIFrameElement>('iframe:last-of-type')!
  const send = (action: string, data?: unknown, source: MessageEventSource | null = frame.contentWindow, eventOrigin = origin) => {
    window.dispatchEvent(new MessageEvent('message', {
      source, origin: eventOrigin, data: { from: 'SamanDesk', action, data },
    }))
  }
  return { api, frame, send, onReady, onClose, onError }
}

function createPopup() {
  const popup = {
    closed: false,
    location: { href: 'about:blank' },
    focus: vi.fn(),
    close: vi.fn(() => { popup.closed = true }),
  }
  vi.spyOn(window, 'open').mockReturnValue(popup as unknown as Window)
  return popup
}

beforeEach(() => {
  vi.useFakeTimers()
  // The remote app is a message boundary. Keep a real iframe window without
  // allowing tests to navigate to the production service.
  const createElement = document.createElement.bind(document)
  vi.spyOn(document, 'createElement').mockImplementation(((tagName: string, options?: ElementCreationOptions) => {
    const element = createElement(tagName, options)
    if (tagName === 'iframe') element.setAttribute('srcdoc', '<!doctype html><html></html>')
    return element
  }) as typeof document.createElement)
})

afterEach(() => {
  instances.splice(0).forEach(api => api.destroy())
  document.body.replaceChildren()
  vi.useRealTimers()
})

describe('web integration', () => {
  it('shows guest login and fulfills the last pending open after a token arrives', () => {
    const { api, frame, send } = create()
    expect(frame.src).toBe(origin + '/guest-login/workspace')
    expect(frame.getAttribute('aria-hidden')).toBe('false')
    api.open('/first')
    api.open('/last')
    send('setToken', { token: 'session' })
    expect(frame.src).toBe(origin + '/last')
    expect(frame.getAttribute('aria-hidden')).toBe('false')
  })

  it('keeps verified login hidden until the session is ready', () => {
    const { api, frame, send } = create({ verifiedToken: 'input' })
    api.open()
    expect(frame.getAttribute('aria-hidden')).toBe('true')
    send('setToken', { token: 'session' })
    expect(frame.src).toBe(origin + '/department-selection?token=session')
    expect(frame.getAttribute('aria-hidden')).toBe('false')
  })

  it('accepts messages only from the correct iframe and origin', () => {
    const { send, onReady } = create()
    send('setToken', { token: 'wrong-origin' }, undefined, 'https://attacker.example.com')
    send('setToken', { token: 'wrong-source' }, window)
    send('setToken', { token: 'null-source' }, null)
    expect(onReady).not.toHaveBeenCalled()
    send('setToken', { token: 'valid' })
    expect(onReady).toHaveBeenCalledWith('valid')
  })

  it('isolates multiple widgets on the same page', () => {
    const first = create()
    const second = create()
    first.send('setToken', { token: 'first' })
    expect(first.onReady).toHaveBeenCalledWith('first')
    expect(second.onReady).not.toHaveBeenCalled()
    second.send('setToken', { token: 'second' })
    expect(second.onReady).toHaveBeenCalledWith('second')
  })

  it('cancels a pending open without cancelling iframe login', () => {
    const { api, frame, send, onReady, onClose } = create()
    api.open()
    api.close()
    api.close()
    send('setToken', { token: 'session' })
    expect(onReady).toHaveBeenCalledWith('session')
    expect(onClose).toHaveBeenCalledOnce()
    expect(frame.getAttribute('aria-hidden')).toBe('true')
    expect(frame.src).toContain('/guest-login/')
    api.open()
    expect(frame.getAttribute('aria-hidden')).toBe('false')
  })

  it('does not navigate again when opening the same active destination', () => {
    const { api, frame, send } = create()
    send('setToken', { token: 'session' })
    api.open()
    const setSource = vi.spyOn(frame, 'src', 'set')
    api.close()
    api.open()
    expect(setSource).not.toHaveBeenCalled()
  })

  it('uses a fresh iframe on retry and ignores the old attempt', () => {
    const { api, frame, send, onReady, onError } = create()
    const oldSource = frame.contentWindow
    const oldError = frame.onerror
    api.retry()
    const nextFrame = document.querySelector('iframe')!
    expect(nextFrame).not.toBe(frame)
    send('setToken', { token: 'stale' }, oldSource)
    oldError?.call(frame, new Event('error'))
    expect(onReady).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
    send('setToken', { token: 'fresh' }, nextFrame.contentWindow)
    expect(onReady).toHaveBeenCalledWith('fresh')
  })

  it('hides on timeout and ignores later messages from a failed attempt', () => {
    const { frame, send, onError, onReady } = create({ handshakeTimeoutMs: 100 })
    vi.advanceTimersByTime(100)
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: 'HANDSHAKE_TIMEOUT' }))
    expect(frame.getAttribute('aria-hidden')).toBe('true')
    send('setToken', { token: 'late' })
    expect(onReady).not.toHaveBeenCalled()
  })

  it('handles a close message and a click on the backdrop', () => {
    const { api, frame, send, onClose } = create()
    send('close')
    expect(frame.getAttribute('aria-hidden')).toBe('true')
    api.open()
    document.querySelector('div')!.click()
    expect(frame.getAttribute('aria-hidden')).toBe('true')
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('removes DOM, listeners and timers when destroyed', () => {
    const { api, send, onClose, onReady, onError } = create()
    api.destroy()
    api.destroy()
    vi.advanceTimersByTime(60000)
    send('setToken', { token: 'late' })
    expect(document.body.children).toHaveLength(0)
    expect(onClose).toHaveBeenCalledOnce()
    expect(onReady).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
    expect(() => api.open()).toThrow(expect.objectContaining({ code: 'DESTROYED' }))
    expect(() => api.openPopup()).toThrow(expect.objectContaining({ code: 'DESTROYED' }))
    expect(() => api.retry()).toThrow(expect.objectContaining({ code: 'DESTROYED' }))
  })
})

describe('standalone windows', () => {
  it('does not start polling if onOpen destroys the widget', () => {
    createPopup()
    const { api } = create({ onOpen: () => api.destroy() }, { mode: 'popup' })
    const startPolling = vi.spyOn(globalThis, 'setInterval')
    api.openPopup()
    expect(document.body.children).toHaveLength(0)
    expect(startPolling).not.toHaveBeenCalled()
  })

  it('does not start polling if onOpen immediately closes the popup', () => {
    const popup = createPopup()
    const { api } = create({ onOpen: () => api.close() }, { mode: 'popup' })
    const startPolling = vi.spyOn(globalThis, 'setInterval')
    api.openPopup()
    expect(popup.close).toHaveBeenCalledOnce()
    expect(startPolling).not.toHaveBeenCalled()
  })

  it('requests a user gesture without opening a popup during construction', async () => {
    const open = vi.spyOn(window, 'open')
    const { onError } = create({}, { mode: 'popup' })
    await Promise.resolve()
    expect(open).not.toHaveBeenCalled()
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: 'POPUP_REQUIRED' }))
  })

  it('preserves the active iframe and session when the browser blocks a popup', () => {
    vi.spyOn(window, 'open').mockReturnValue(null)
    const { api, frame, send, onError } = create()
    send('setToken', { token: 'session' })
    api.open()
    const destination = frame.src
    api.openPopup()
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: 'POPUP_BLOCKED' }))
    expect(frame.src).toBe(destination)
    expect(frame.getAttribute('aria-hidden')).toBe('false')
    api.open()
    expect(frame.src).toBe(destination)
  })

  it('keeps login and chat in the popup and preserves a ready session on reopen', () => {
    const popup = createPopup()
    const { api, frame, send, onReady } = create({}, { mode: 'popup' })
    api.openPopup()
    expect(popup.location.href).toBe(origin + '/guest-login/workspace')
    expect(frame.src).toBe('about:blank')
    send('setToken', { token: 'ignored' }, frame.contentWindow)
    expect(onReady).not.toHaveBeenCalled()
    send('setToken', { token: 'session' }, popup as unknown as Window)
    expect(popup.location.href).toBe(origin + '/department-selection?token=session')
    api.open()
    expect(window.open).toHaveBeenCalledOnce()
    api.close()
    expect(popup.close).toHaveBeenCalledOnce()

    const nextPopup = createPopup()
    api.open()
    expect(nextPopup.location.href).toBe(origin + '/department-selection?token=session')
  })

  it('detects a popup closed by the user and stops polling', () => {
    const popup = createPopup()
    const { api, onClose } = create({}, { mode: 'popup' })
    api.openPopup()
    popup.closed = true
    vi.advanceTimersByTime(500)
    expect(onClose).toHaveBeenCalledOnce()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('falls back to a popup when a cross-origin portal blocks top-window access', () => {
    const top = {
      addEventListener: () => { throw new DOMException('Access denied', 'SecurityError') },
    }
    vi.spyOn(window, 'top', 'get').mockReturnValue(top as unknown as Window)
    const popup = createPopup()
    const { api } = create()
    api.open()
    expect(popup.location.href).toBe(origin + '/guest-login/workspace')
  })
})
