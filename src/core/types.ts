import { Color } from '../../library-colors'

export type ProjectTheme = {
  /** روشن یا تیره‌بودن تم برنامه */
  darkMode: 'light' | 'dark'
  /** رنگ برنامه */
  color: Color
}

export interface SamanDeskConfig {
  /** شناسه محیط کاری پروژه */
  workspaceID?: string
  /** توکن وریفای شده */
  verifiedToken?: string
  /** تم کتابخانه شامل :
   * روشن یا تیره بودن کتابخانه
   * رنگ تم کتابخانه
   */
  theme?: Partial<ProjectTheme>
  /** زبان کتابخانه */
  language?: string
  /** آدرس سرور */
  siteUrl?: string
  /** Maximum time to load the login page or receive the SSO session. Default: 30000 ms. */
  handshakeTimeoutMs?: number
  /** تابع مدیریت‌کننده‌ی لینک‌ها */
  linkHandler?: (link: string) => void
  /** زمانی که کتابخانه آماده شد */
  onReady?: (token: string) => void
  /** وقتی که توکن عوض میشه */
  onTokenChange?: (token: string) => void
  /** باز شدن کتابخانه */
  onOpen?: () => void
  /** بسته شدن کتابخانه */
  onClose?: () => void
  /** آماده شدن گست */
  onGuestReady?: () => void
  /** هندل کردن ارور ها */
  onError?: (error: Error) => void
}

export type SamanDeskErrorCode =
  | 'INVALID_CONFIG'
  | 'INVALID_LINK'
  | 'INVALID_MESSAGE'
  | 'HANDSHAKE_TIMEOUT'
  | 'AUTHENTICATION_FAILED'
  | 'LOAD_FAILED'
  | 'POPUP_REQUIRED'
  | 'POPUP_BLOCKED'
  | 'CALLBACK_ERROR'
  | 'DESTROYED'

export class SamanDeskError extends Error {
  constructor(
    public readonly code: SamanDeskErrorCode,
    message: string,
  ) {
    super(`[SamanDesk] ${message}`)
    this.name = 'SamanDeskError'
  }
}

export type MessageData<T = {}> = {
  /** شناسه داده */
  id: number
  /** تابعی که داده برای آن ارسال شده است */
  action: string
  /** داده موردنظر */
  data: T
}

export interface OutgoingMessage {
  from: 'SamanDesk'
  action: string
  data?: any
  id?: number
}
