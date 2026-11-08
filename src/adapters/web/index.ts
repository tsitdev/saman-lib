import { SamanDeskCore } from '../../core'
import { SamanDeskConfig, SamanDeskError, OutgoingMessage, SamanDeskErrorCode } from '../../core/types'

interface WebOptions {
  /** auto uses a popup when the legacy web app's top-window bridge is inaccessible. */
  mode?: 'auto' | 'iframe' | 'popup'
  fullScreen?: boolean
  style?: {
    marginTop?: number
    marginBottom?: number
    width?: string
    height?: string
  }
}

export function createSamanDeskWeb(config: SamanDeskConfig, options: WebOptions = {}) {
  class WebCore extends SamanDeskCore {
    protected override sendMessage(message: OutgoingMessage) {
      const target = usingPopup ? popup : frame.contentWindow
      target?.postMessage(message, this.origin)
    }

    override close() {
      hide()
    }

    override fail(code: SamanDeskErrorCode, message: string) {
      if (this.isDestroyed || this.hasFailed) return
      hide(false)
      super.fail(code, message)
    }
  }

  const core = new WebCore(config)
  if (typeof document === 'undefined' || !document.body) {
    throw new SamanDeskError('INVALID_CONFIG', 'Create the web adapter on the client after document.body exists (for example in onMounted/useEffect).')
  }
  if (options.mode !== undefined && !['auto', 'iframe', 'popup'].includes(options.mode)) {
    throw new SamanDeskError('INVALID_CONFIG', 'Web mode must be auto, iframe or popup.')
  }
  let frame = document.createElement('iframe')
  const backdrop = document.createElement('div')
  const messageWindows = new Set<Window>()
  let popup: Window | null = null
  let popupPoll: ReturnType<typeof setInterval> | undefined
  let usingPopup = false
  let visible = false
  let pendingOpen = false
  let pendingLink: string | undefined
  let activeUrl = ''

  const applyStyles = () => {
    const frameVisible = visible && !usingPopup
    Object.assign(backdrop.style, {
      position: 'fixed', inset: '0', backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: '1000', display: frameVisible && !options.fullScreen ? 'block' : 'none',
    })
    Object.assign(frame.style, {
      position: 'fixed', zIndex: '1000', border: 'none',
      display: 'block', opacity: frameVisible ? '1' : '0',
      pointerEvents: frameVisible ? 'auto' : 'none',
    })
    frame.title = 'SamanDesk support'
    frame.tabIndex = frameVisible ? 0 : -1
    frame.setAttribute('aria-hidden', String(!frameVisible))
    if (!frameVisible) {
      Object.assign(frame.style, { width: '1px', height: '1px', left: '-10000px', top: '0', boxShadow: 'none' })
    } else if (options.fullScreen) {
      const marginTop = options.style?.marginTop ?? 0
      const marginBottom = options.style?.marginBottom ?? 0
      Object.assign(frame.style, {
        bottom: `${marginBottom}px`, left: '0', top: `${marginTop}px`, right: '0',
        width: '100%', height: `calc(100% - ${marginTop + marginBottom}px)`,
        maxWidth: 'none', maxHeight: 'none', boxShadow: 'none', borderRadius: '0', transform: 'none',
      })
    } else {
      Object.assign(frame.style, {
        top: '50%', left: '50%', bottom: 'auto', right: 'auto', transform: 'translate(-50%, -50%)',
        width: options.style?.width || '100%', maxWidth: '500px',
        height: options.style?.height || '100%', maxHeight: '660px',
        boxShadow: '0px 0px 100px 0px rgba(0,0,0,0.48)', borderRadius: '24px',
      })
    }
  }

  const show = () => {
    const wasVisible = visible
    visible = true
    applyStyles()
    if (usingPopup) {
      try { popup?.focus() } catch { /* Focus can be restricted by the browser. */ }
    }
    if (!wasVisible) core.notify('onOpen')
  }

  const hide = (notify = true) => {
    const wasVisible = visible
    visible = false
    pendingOpen = false
    pendingLink = undefined
    if (usingPopup) {
      clearInterval(popupPoll)
      popupPoll = undefined
      core.clearHandshake()
      const oldPopup = popup
      popup = null
      oldPopup?.close()
    }
    applyStyles()
    if (wasVisible && notify) core.notify('onClose')
  }

  const navigate = (url: string) => {
    if (activeUrl === url) return
    activeUrl = url
    if (usingPopup) {
      try {
        if (!popup || popup.closed) throw new Error()
        popup.location.href = url
      } catch {
        core.fail('LOAD_FAILED', 'The popup connection was lost. Check popup/sandbox and Cross-Origin-Opener-Policy settings.')
      }
    } else {
      frame.src = url
    }
  }

  const finishOpen = () => {
    if (!pendingOpen || !core.isReady || core.isDestroyed) return
    const link = pendingLink
    pendingOpen = false
    pendingLink = undefined
    navigate(core.getOpenUrl(link))
    if (!core.hasFailed) show()
  }

  const handleMessage = (event: MessageEvent) => {
    const source = usingPopup ? popup : frame.contentWindow
    if (!source || event.source !== source || event.origin !== core.origin) return
    core.handleIncomingMessage(event.data)
    finishOpen()
  }

  const assertAlive = () => {
    if (core.isDestroyed) throw new SamanDeskError('DESTROYED', 'This instance was destroyed. Create a new instance.')
  }

  // Deployed web apps send to window.top; newer ones may send to window.parent.
  // Listen at both when same-origin access allows it, without forwarding tokens.
  const listen = (target: Window) => {
    if (messageWindows.has(target)) return
    target.addEventListener('message', handleMessage)
    messageWindows.add(target)
  }
  listen(window)
  let canReceiveLegacyMessages = window.top === window
  if (window.top && window.top !== window) {
    try {
      listen(window.top)
      canReceiveLegacyMessages = true
    } catch {
      // Cross-origin ancestors cannot be inspected or given event listeners.
    }
  }
  const needsPopup = options.mode === 'popup' || !canReceiveLegacyMessages

  const initializeFrame = () => {
    usingPopup = false
    pendingOpen = false
    pendingLink = undefined
    activeUrl = ''
    core.startHandshake()
    const initialFrame = frame
    frame.onerror = () => {
      if (frame !== initialFrame || usingPopup) return
      core.fail('LOAD_FAILED', 'The embedded web app could not load. Check network access and embedding policy, or call openPopup() from a user click.')
    }
    navigate(core.getInitialUrl())
    if (!core.config.verifiedToken) show()
    else applyStyles()
  }

  const openPopup = (link?: string, restart = false) => {
    assertAlive()
    if (link !== undefined) core.getOpenUrl(link)
    if (popup && !popup.closed && !restart && !core.hasFailed) {
      pendingOpen = true
      pendingLink = link
      if (core.isReady) finishOpen()
      show()
      return
    }

    // Open synchronously, before closing the iframe or changing session state.
    // A blocked popup must leave any existing iframe/session intact.
    let opened: Window | null = null
    try {
      opened = window.open('about:blank', '_blank', 'popup,width=500,height=660')
    } catch { /* Sandboxed frames may deny window.open entirely. */ }
    if (!opened) {
      core.reportError(new SamanDeskError('POPUP_BLOCKED', 'The browser blocked the support popup. Call openPopup() directly from a click and allow popups for this page.'))
      return
    }
    const reusePopupSession = usingPopup && core.isReady && !restart
    const oldPopup = popup
    popup = opened
    usingPopup = true
    oldPopup?.close()
    frame.src = 'about:blank'
    frame.onerror = null
    activeUrl = ''
    pendingOpen = true
    pendingLink = link
    if (reusePopupSession) {
      finishOpen()
    } else {
      core.startHandshake()
      navigate(core.getInitialUrl())
      if (!core.hasFailed) show()
    }
    if (core.hasFailed || core.isDestroyed || !popup || popup.closed) return
    clearInterval(popupPoll)
    popupPoll = setInterval(() => {
      if (popup?.closed) hide()
    }, 500)
  }

  const webApi = {
    open: (link?: string) => {
      assertAlive()
      if (link !== undefined) core.getOpenUrl(link)
      if (usingPopup || (needsPopup && options.mode !== 'iframe')) {
        openPopup(link)
        return
      }
      if (!canReceiveLegacyMessages) {
        core.reportError(new SamanDeskError('POPUP_REQUIRED', 'The deployed web app sends to an inaccessible top window. Call openPopup() from a user click.'))
        return
      }
      if (core.hasFailed) {
        core.reportError(new SamanDeskError('LOAD_FAILED', 'Initialization failed. Use openPopup() from a user click for blocked iframe/storage, or retry() with a reusable token. A consumed token requires a new instance with a fresh verifiedToken.'))
        return
      }
      pendingOpen = true
      pendingLink = link
      if (core.isReady) finishOpen()
      else if (!core.config.verifiedToken) show()
    },
    openPopup: (link?: string) => openPopup(link),
    close: () => {
      if (!core.isDestroyed) hide()
    },
    retry: () => {
      assertAlive()
      if (usingPopup || needsPopup) {
        openPopup(undefined, true)
        return
      }
      hide()
      if (core.isDestroyed) return
      const oldFrame = frame
      frame = document.createElement('iframe')
      oldFrame.replaceWith(frame)
      oldFrame.onerror = null
      initializeFrame()
    },
    destroy: () => {
      if (core.isDestroyed) return
      const wasVisible = visible
      core.destroy()
      visible = false
      pendingOpen = false
      clearInterval(popupPoll)
      const oldPopup = popup
      popup = null
      oldPopup?.close()
      for (const target of messageWindows) target.removeEventListener('message', handleMessage)
      messageWindows.clear()
      frame.onerror = null
      frame.remove()
      backdrop.remove()
      if (wasVisible) core.notify('onClose')
    },
  }

  backdrop.onclick = () => webApi.close()
  applyStyles()
  document.body.append(backdrop, frame)
  if (needsPopup) {
    // Never try an unsolicited popup during construction.
    Promise.resolve().then(() => {
      if (!core.isDestroyed && !usingPopup) {
        core.reportError(new SamanDeskError('POPUP_REQUIRED', 'Call openPopup() directly from a user click to connect to the deployed web app in a standalone window.'))
      }
    })
  } else {
    initializeFrame()
  }
  return webApi
}

