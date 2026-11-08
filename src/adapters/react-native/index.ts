import { SamanDeskCore } from '../../core'
import {
  SamanDeskConfig,
  SamanDeskError,
  SamanDeskErrorCode,
  OutgoingMessage,
} from '../../core/types'

interface ReactNativeState {
  source: { uri: string }
  visible: boolean
}

interface ReactNativeOptions {
  onStateChange: (state: ReactNativeState) => void
  injectJavaScript: (script: string) => void
}

export function createSamanDeskReactNative(config: SamanDeskConfig, options: ReactNativeOptions) {
  if (
    typeof options?.onStateChange !== 'function' ||
    typeof options?.injectJavaScript !== 'function'
  ) {
    throw new SamanDeskError(
      'INVALID_CONFIG',
      'React Native requires onStateChange and injectJavaScript callbacks.',
    )
  }
  class NativeCore extends SamanDeskCore {
    protected override sendMessage(message: OutgoingMessage) {
      try {
        options.injectJavaScript(
          `window.dispatchEvent(new MessageEvent('message', { data: ${JSON.stringify(message)} })); true;`,
        )
      } catch {
        this.fail(
          'LOAD_FAILED',
          'injectJavaScript failed. Check that the WebView is mounted and its reference is connected.',
        )
      }
    }

    override close() {
      rnApi.close()
    }

    override fail(code: SamanDeskErrorCode, message: string) {
      if (this.isDestroyed || this.hasFailed) return
      pendingOpen = false
      updateState({ ...currentState, visible: false })
      super.fail(code, message)
    }
  }

  const core = new NativeCore(config)
  let currentState: ReactNativeState = {
    source: { uri: core.getInitialUrl() },
    visible: !core.config.verifiedToken,
  }
  let pendingOpen = false
  let pendingLink: string | undefined
  let generation = 0

  const updateState = (state: ReactNativeState) => {
    currentState = state
    try {
      options.onStateChange(currentState)
    } catch {
      core.reportError(
        new SamanDeskError(
          'CALLBACK_ERROR',
          'onStateChange threw an exception in the host application.',
        ),
      )
    }
  }

  const assertAlive = () => {
    if (core.isDestroyed)
      throw new SamanDeskError('DESTROYED', 'This instance was destroyed. Create a new instance.')
  }

  const finishOpen = () => {
    if (!pendingOpen || !core.isReady || core.isDestroyed) return
    const uri = core.getOpenUrl(pendingLink)
    pendingOpen = false
    pendingLink = undefined
    const wasVisible = currentState.visible
    updateState({
      source: currentState.source.uri === uri ? currentState.source : { uri },
      visible: true,
    })
    if (!wasVisible) core.notify('onOpen')
  }

  const rnApi = {
    getState: () => currentState,
    open: (link?: string) => {
      assertAlive()
      if (link !== undefined) core.getOpenUrl(link)
      if (core.hasFailed) {
        core.reportError(
          new SamanDeskError(
            'LOAD_FAILED',
            'Initialization failed. Call retry() or create an instance with a fresh verifiedToken.',
          ),
        )
        return
      }
      pendingOpen = true
      pendingLink = link
      if (core.isReady) finishOpen()
      else if (!core.config.verifiedToken && !currentState.visible) {
        updateState({ ...currentState, visible: true })
        core.notify('onOpen')
      }
    },
    close: () => {
      if (core.isDestroyed) return
      pendingOpen = false
      if (!currentState.visible) return
      updateState({ ...currentState, visible: false })
      core.notify('onClose')
    },
    retry: () => {
      assertAlive()
      pendingOpen = false
      pendingLink = undefined
      generation++
      core.startHandshake()
      updateState({ source: { uri: core.getInitialUrl() }, visible: !core.config.verifiedToken })
    },
    destroy: () => {
      if (core.isDestroyed) return
      const wasVisible = currentState.visible
      core.destroy()
      generation++
      pendingOpen = false
      updateState({ source: { uri: 'about:blank' }, visible: false })
      if (wasVisible) core.notify('onClose')
    },
    getWebViewProps: () => {
      const attempt = generation
      return {
        // Remount on retry so replies from an earlier authentication cannot win.
        key: `samandesk-${attempt}`,
        onMessage: (event: { nativeEvent: { data: string; url?: string } }) => {
          if (attempt !== generation || core.isDestroyed) return
          const url = event.nativeEvent.url
          if (url) {
            try {
              if (new URL(url).origin !== core.origin) return
            } catch {
              return
            }
          }
          core.handleIncomingMessage(event.nativeEvent.data)
          finishOpen()
        },
        onError: () => {
          if (attempt !== generation) return
          core.fail(
            'LOAD_FAILED',
            'The WebView could not load the web app. Check network access and WebView configuration.',
          )
        },
        onHttpError: (event: { nativeEvent: { statusCode: number; url: string } }) => {
          if (attempt !== generation || event.nativeEvent.url !== currentState.source.uri) return
          core.fail(
            'LOAD_FAILED',
            `The WebView document returned HTTP ${event.nativeEvent.statusCode}.`,
          )
        },
      }
    },
  }

  core.startHandshake()
  return rnApi
}
