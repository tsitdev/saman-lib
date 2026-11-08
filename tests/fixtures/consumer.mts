import {
  createSamanDeskWeb,
  createSamanDeskReactNative,
  SamanDeskError,
  type SamanDeskConfig,
} from 'samandesk'

const config: SamanDeskConfig = {
  workspaceID: 'workspace',
  onError: (error) => {
    if (error instanceof SamanDeskError) console.log(error.code)
  },
}

const web = createSamanDeskWeb(config, { mode: 'popup' })
web.openPopup()
web.retry()
web.destroy()

const native = createSamanDeskReactNative(config, {
  onStateChange: (state) => console.log(state.visible),
  injectJavaScript: (script) => console.log(script),
})
native.getWebViewProps().onMessage({ nativeEvent: { data: '{}' } })
native.destroy()
