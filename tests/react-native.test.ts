import { afterEach, beforeEach, describe, expect, it, vi } from 'vite-plus/test'
import { runInNewContext } from 'node:vm'
import { createSamanDeskReactNative } from '../src'
import type { SamanDeskConfig } from '../src'

type Support = ReturnType<typeof createSamanDeskReactNative>
const instances: Support[] = []

function create(config: Partial<SamanDeskConfig> = {}) {
  const onStateChange = vi.fn()
  const injectJavaScript = vi.fn()
  const onError = vi.fn()
  const onReady = vi.fn()
  const onClose = vi.fn()
  const api = createSamanDeskReactNative(
    { workspaceID: 'workspace', onError, onReady, onClose, ...config },
    { onStateChange, injectJavaScript },
  )
  instances.push(api)
  const send = (action: string, data?: unknown, url = 'https://samandesk.com/') => {
    api.getWebViewProps().onMessage({
      nativeEvent: { url, data: JSON.stringify({ from: 'SamanDesk', action, data, id: 1 }) },
    })
  }
  return { api, send, onStateChange, injectJavaScript, onError, onReady, onClose }
}

beforeEach(() => vi.useFakeTimers())
afterEach(() => {
  instances.splice(0).forEach((api) => api.destroy())
  vi.useRealTimers()
})

describe('React Native integration', () => {
  it('exposes the initial guest state without firing a state callback', () => {
    const { api, onStateChange } = create()
    expect(api.getState()).toEqual({
      source: { uri: 'https://samandesk.com/guest-login/workspace' },
      visible: true,
    })
    expect(onStateChange).not.toHaveBeenCalled()
  })

  it('keeps verified login hidden and fulfills a pending open after receiving a token', () => {
    const { api, send } = create({ verifiedToken: 'input' })
    api.open()
    expect(api.getState().visible).toBe(false)
    send('setToken', { token: 'session +' })
    expect(api.getState()).toEqual({
      source: { uri: 'https://samandesk.com/department-selection?token=session%20%2B' },
      visible: true,
    })
    const source = api.getState().source
    api.open()
    expect(api.getState().source).toBe(source)
  })

  it('lets onReady open the chat without a second open request', () => {
    const { api, send } = create({ onReady: () => api.open() })
    send('setToken', { token: 'session' })
    expect(api.getState().source.uri).toContain('/department-selection?token=session')
  })

  it('cancels a pending open on close while allowing login to complete', () => {
    const { api, send, onClose } = create()
    api.open()
    api.close()
    api.close()
    send('setToken', { token: 'session' })
    expect(api.getState().visible).toBe(false)
    expect(api.getState().source.uri).toContain('/guest-login/')
    expect(onClose).toHaveBeenCalledOnce()
    api.open()
    expect(api.getState().visible).toBe(true)
  })

  it('handles a close requested from inside the chat', () => {
    const { api, send, onClose } = create()
    send('close')
    expect(api.getState().visible).toBe(false)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('remounts on retry and ignores messages and errors from the old WebView', () => {
    const { api, send, onReady, onError } = create()
    const oldProps = api.getWebViewProps()
    api.retry()
    expect(api.getWebViewProps().key).not.toBe(oldProps.key)
    oldProps.onMessage({
      nativeEvent: {
        data: JSON.stringify({ from: 'SamanDesk', action: 'setToken', data: { token: 'stale' } }),
      },
    })
    oldProps.onError()
    expect(onReady).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
    send('setToken', { token: 'new' })
    expect(onReady).toHaveBeenCalledWith('new')
  })

  it('rejects messages from an unrelated or malformed URL', () => {
    const { send, onReady } = create()
    send('setToken', { token: 'stolen' }, 'https://attacker.example.com/')
    send('setToken', { token: 'stolen' }, 'not-a-url')
    expect(onReady).not.toHaveBeenCalled()
    send('setToken', { token: 'valid' })
    expect(onReady).toHaveBeenCalledWith('valid')
  })

  it('injects a valid configuration response into the WebView', () => {
    const { send, injectJavaScript } = create({ theme: { darkMode: 'dark', color: 'teal' } })
    send('getConfig')
    const dispatchEvent = vi.fn()
    runInNewContext(injectJavaScript.mock.calls[0][0], {
      window: { dispatchEvent },
      MessageEvent: class {
        constructor(
          public type: string,
          public options: unknown,
        ) {}
      },
    })
    expect(dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'message',
        options: {
          data: {
            from: 'SamanDesk',
            action: 'getConfig',
            id: 1,
            data: { color: 'teal', theme: 'dark', language: 'fa' },
          },
        },
      }),
    )
  })

  it('ignores HTTP errors for unrelated resources but fails on document errors', () => {
    const { api, onError } = create()
    const props = api.getWebViewProps()
    props.onHttpError({ nativeEvent: { url: 'https://samandesk.com/image.png', statusCode: 404 } })
    expect(onError).not.toHaveBeenCalled()
    props.onHttpError({ nativeEvent: { url: api.getState().source.uri, statusCode: 500 } })
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: 'LOAD_FAILED' }))
    expect(api.getState().visible).toBe(false)
  })

  it('hides on timeout, rejects late messages and can retry', () => {
    const { api, send, onReady, onError } = create({ handshakeTimeoutMs: 100 })
    vi.advanceTimersByTime(100)
    expect(onError).toHaveBeenCalledWith(expect.objectContaining({ code: 'HANDSHAKE_TIMEOUT' }))
    expect(api.getState().visible).toBe(false)
    send('setToken', { token: 'late' })
    expect(onReady).not.toHaveBeenCalled()
    api.retry()
    send('setToken', { token: 'new' })
    api.open()
    expect(api.getState().visible).toBe(true)
  })

  it('destroys once, clears timers and rejects further actions', () => {
    const { api, send, onClose, onReady } = create()
    api.destroy()
    api.destroy()
    send('setToken', { token: 'late' })
    expect(api.getState()).toEqual({ source: { uri: 'about:blank' }, visible: false })
    expect(onClose).toHaveBeenCalledOnce()
    expect(onReady).not.toHaveBeenCalled()
    expect(vi.getTimerCount()).toBe(0)
    expect(() => api.open()).toThrow(expect.objectContaining({ code: 'DESTROYED' }))
    expect(() => api.retry()).toThrow(expect.objectContaining({ code: 'DESTROYED' }))
  })
})
