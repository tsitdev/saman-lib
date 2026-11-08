import {
  createSamanDeskWeb,
  createSamanDeskReactNative,
  SamanDeskError,
  type SamanDeskConfig,
} from 'samandesk'

const config: SamanDeskConfig = { workspaceID: 'workspace' }
const web = createSamanDeskWeb(config)
web.open()
web.close()
web.destroy()

const native = createSamanDeskReactNative(config, {
  onStateChange: (state) => console.log(state.source.uri),
  injectJavaScript: (script) => console.log(script),
})
native.retry()
native.destroy()

const error = new SamanDeskError('INVALID_CONFIG', 'Invalid configuration')
console.log(error.code)
