import { SamanDeskConfig, SamanDeskError, SamanDeskErrorCode, OutgoingMessage } from './types'

import { libraryColors } from '../../library-colors'

export class SamanDeskCore {
  public config: SamanDeskConfig
  protected token?: string
  public isReady = false
  public isDestroyed = false
  public hasFailed = false
  private handshakeTimer?: ReturnType<typeof setTimeout>

  constructor(config: SamanDeskConfig) {
    if (!config || typeof config !== 'object') {
      throw new SamanDeskError('INVALID_CONFIG', 'Pass a configuration object with verifiedToken or workspaceID.')
    }
    for (const key of ['verifiedToken', 'workspaceID'] as const) {
      const value = config[key]
      if (value !== undefined && (typeof value !== 'string' || !value.trim() || ['undefined', 'null'].includes(value.trim()))) {
        throw new SamanDeskError('INVALID_CONFIG', `${key} must be a non-empty string; omit it when unused.`)
      }
    }
    if (!config.verifiedToken && !config.workspaceID) {
      throw new SamanDeskError('INVALID_CONFIG', 'Set verifiedToken for SSO or workspaceID for guest login.')
    }
    for (const key of ['onReady', 'onTokenChange', 'onGuestReady', 'onOpen', 'onClose', 'onError', 'linkHandler'] as const) {
      if (config[key] !== undefined && typeof config[key] !== 'function') {
        throw new SamanDeskError('INVALID_CONFIG', `${key} must be a function.`)
      }
    }
    const theme = config.theme
    if (theme !== undefined && (!theme || typeof theme !== 'object'
      || (theme.darkMode !== undefined && !['light', 'dark'].includes(theme.darkMode))
      || (theme.color !== undefined && !Object.prototype.hasOwnProperty.call(libraryColors.light, theme.color)))) {
      throw new SamanDeskError('INVALID_CONFIG', 'theme must contain a supported darkMode and color name.')
    }
    if (config.language !== undefined && (typeof config.language !== 'string' || !config.language.trim())) {
      throw new SamanDeskError('INVALID_CONFIG', 'language must be a non-empty string.')
    }
    const timeout = config.handshakeTimeoutMs ?? 30000
    if (!Number.isFinite(timeout) || timeout <= 0 || timeout > 2147483647) {
      throw new SamanDeskError('INVALID_CONFIG', 'handshakeTimeoutMs must be a positive number of milliseconds (at most 2147483647).')
    }
    let site: URL
    try {
      site = new URL(config.siteUrl ?? 'https://samandesk.com')
      if (!['https:', 'http:'].includes(site.protocol) || site.username || site.password || site.search || site.hash) throw new Error()
    } catch {
      throw new SamanDeskError('INVALID_CONFIG', 'siteUrl must be an absolute HTTP(S) web-app URL without credentials, query or fragment.')
    }
    this.config = {
      language: 'fa',
      theme: { darkMode: 'light', color: 'default' },
      ...config,
      siteUrl: site.href.replace(/\/+$/, ''),
      verifiedToken: config.verifiedToken?.trim(),
      workspaceID: config.workspaceID?.trim(),
      handshakeTimeoutMs: timeout,
    }
  }

  public get origin() {
    return new URL(this.config.siteUrl!).origin
  }

  public getInitialUrl(): string {
    return this.config.verifiedToken
      ? `${this.config.siteUrl}/setup-interoperation/${encodeURIComponent(this.config.verifiedToken)}`
      : `${this.config.siteUrl}/guest-login/${encodeURIComponent(this.config.workspaceID!)}`
  }

  public getOpenUrl(link?: string): string {
    if (link !== undefined) {
      try {
        const url = new URL(link, `${this.config.siteUrl}/`)
        if (url.origin !== this.origin || url.username || url.password) throw new Error()
        return url.href
      } catch {
        throw new SamanDeskError('INVALID_LINK', 'open(link) must refer to the configured web app. Use linkHandler for external links.')
      }
    }
    if (!this.token) throw new SamanDeskError('INVALID_MESSAGE', 'The session token has not arrived yet.')
    return `${this.config.siteUrl}/department-selection?token=${encodeURIComponent(this.token)}`
  }

  public startHandshake() {
    this.clearHandshake()
    this.isReady = false
    this.hasFailed = false
    this.token = undefined
    this.handshakeTimer = setTimeout(() => {
      this.fail('HANDSHAKE_TIMEOUT', this.config.verifiedToken
        ? 'No session token received from the deployed web app. Check network, token and iframe storage access. On web, call openPopup() from a click; a consumed token needs a fresh instance.'
        : 'The guest form did not become ready. Check network and the host message bridge. On web, call openPopup() from a click to avoid iframe storage restrictions.')
    }, this.config.handshakeTimeoutMs)
  }

  public clearHandshake() {
    clearTimeout(this.handshakeTimer)
    this.handshakeTimer = undefined
  }

  public handleIncomingMessage(message: unknown) {
    if (this.isDestroyed || this.hasFailed) return
    if (typeof message === 'string') {
      try { message = JSON.parse(message) } catch { return }
    }
    if (!message || typeof message !== 'object') return
    const { from, action, id, data } = message as OutgoingMessage
    if (from !== 'SamanDesk' || typeof action !== 'string') return

    switch (action) {
      case 'setToken':
        this.handleSetToken(data)
        break
      case 'getConfig':
        if (typeof id === 'number' && Number.isFinite(id)) {
          this.sendMessage({ from: 'SamanDesk', id, action, data: {
            color: this.config.theme?.color || 'default',
            theme: this.config.theme?.darkMode || 'light',
            language: this.config.language || 'fa',
          } })
        }
        break
      case 'openLink':
        if (typeof data?.link === 'string') this.notify('linkHandler', data.link)
        break
      case 'setGuestReadyEvent':
        if (!this.config.verifiedToken) {
          this.clearHandshake()
          this.notify('onGuestReady')
        }
        break
      case 'close':
        this.close()
        break
      case 'error':
        this.fail('AUTHENTICATION_FAILED', typeof data?.message === 'string' ? data.message : 'Authentication failed in the web app.')
        break
    }
  }

  protected handleSetToken(data: unknown) {
    const token = data && typeof data === 'object' && 'token' in data ? data.token : undefined
    if (typeof token !== 'string' || !token.trim() || ['undefined', 'null'].includes(token.trim())) {
      this.fail('INVALID_MESSAGE', 'The web app returned an empty or invalid session token.')
      return
    }
    const sessionToken = token.trim()
    if (this.isReady && this.token === sessionToken) return
    this.clearHandshake()
    this.token = sessionToken
    this.isReady = true
    this.notify('onReady', sessionToken)
    if (!this.isDestroyed && this.isReady && this.token === sessionToken) this.notify('onTokenChange', sessionToken)
  }

  public notify(name: 'onReady' | 'onTokenChange' | 'onGuestReady' | 'onOpen' | 'onClose' | 'linkHandler', value?: string) {
    try {
      const callback = this.config[name] as ((value?: string) => void) | undefined
      callback?.(value)
    } catch {
      this.reportError(new SamanDeskError('CALLBACK_ERROR', `${name} threw an exception in the host application. Check that callback's implementation.`))
    }
  }

  public reportError(error: SamanDeskError) {
    try {
      if (this.config.onError) this.config.onError(error)
      else console.error(error)
    } catch {
      console.error(new SamanDeskError('CALLBACK_ERROR', 'onError threw an exception in the host application.'))
    }
  }

  public fail(code: SamanDeskErrorCode, message: string) {
    if (this.isDestroyed || this.hasFailed) return
    this.hasFailed = true
    this.isReady = false
    this.clearHandshake()
    this.reportError(new SamanDeskError(code, message))
  }

  protected sendMessage(_message: OutgoingMessage) {
    throw new Error('sendMessage not implemented')
  }

  public close() {
    this.notify('onClose')
  }

  public destroy() {
    this.isDestroyed = true
    this.isReady = false
    this.token = undefined
    this.clearHandshake()
  }
}

