<div dir="rtl" align="right">

# ‏سامان دسک — راهنمای وب و موبایل

‏کتابخانهٔ اتصال به رابط پشتیبانی سامان دسک در وب و ⁦React Native.⁩ نسخهٔ وب رابط را در قاب یا پنجرهٔ مستقل نمایش می‌دهد؛ نسخهٔ ⁦React Native⁩ مدیریت وضعیت و ارتباط با ⁦<code dir="ltr">WebView</code>⁩ را فراهم می‌کند. رابط چت از سرور سامان دسک بارگذاری می‌شود و داخل پکیج قرار ندارد.

‏این راهنما رفتار کد فعلی این شاخه را شرح می‌دهد. اصلاحات کتابخانه با قرارداد پیام وب‌اپ فعلی کار می‌کنند و به انتشار پروژهٔ اصلی وابسته نیستند. نمونه‌های دارای ⁦<code dir="ltr">retry()</code>⁩، ⁦<code dir="ltr">openPopup()</code>⁩ و خطاهای کددار به خروجی اصلاح‌شده نیاز دارند و در نسخهٔ منتشرشدهٔ ⁦<code dir="ltr">2.0.0-beta2.0</code>⁩ موجود نیستند.

‏این فایل مرجع استفاده از نسخهٔ فعلی پکیج و مهاجرت از نسخهٔ ۱ است. شمارهٔ نسخهٔ ⁦<code dir="ltr">node_modules/samandesk/package.json</code>⁩ را با نسخهٔ این راهنما تطبیق دهید؛ مستندات مستقل نسخه‌های قدیمی نگهداری نمی‌شوند.

## ‏فهرست مطالب

- ‏[نصب و پیش‌نیازها](#installation)
- ‏[شروع سریع و ورود مهمان](#quick-start)
- ‏[تنظیمات مشترک و رنگ‌ها](#configuration)
- ‏[وب، مرورگر، ⁦Vue / Nuxt⁩ و ⁦React / Next.js⁩](#web)
- ‏[ورود با توکن](#token-login)
- ‏[⁦React Native⁩ و ⁦WebView⁩](#react-native)
- ‏[خروجی‌ها و نوع‌های ⁦TypeScript⁩](#types)
- ‏[پروتکل تبادل پیام](#protocol)
- ‏[محدودیت‌ها و رفع مشکل](#troubleshooting)
- ‏[راهنمای مهاجرت از نسخهٔ ۱](#migration)
- ‏[توسعه و انتشار کتابخانه](#development)

<a id="installation"></a>

## ‏نصب و پیش‌نیازها


</div>

<div dir="ltr" align="left">

```bash
npm install samandesk@2.0.0-beta2.0
```

</div>

<div dir="rtl" align="right">


- ‏برای ورود مهمان، شناسهٔ محیط کاری (⁦<code dir="ltr">workspaceID</code>⁩) لازم است.
- ‏برای ورود با توکن، ⁦<code dir="ltr">verifiedToken</code>⁩ معتبرِ مورد پذیرش سرور سامان دسک لازم است. دریافت این توکن از سرویس پروژهٔ میزبان انجام می‌شود؛ این پکیج ⁦API⁩ دریافت یا ساخت آن را ندارد.
- ‏مرورگر یا ⁦WebView⁩ باید به سرور سامان دسک دسترسی داشته باشد. اجرای آفلاین پشتیبانی نمی‌شود.
- ‏در وب، نمونه را بعد از آماده‌شدن ⁦<code dir="ltr">document.body</code>⁩ و فقط سمت کلاینت بسازید.
- ‏در ⁦React Native⁩، نصب و راه‌اندازی ⁦<code dir="ltr">react-native-webview</code>⁩ بر عهدهٔ پروژهٔ میزبان است؛ خود پکیج کامپوننت ⁦React⁩ یا ⁦WebView⁩ ارائه نمی‌کند.

<a id="quick-start"></a>

## ‏شروع سریع — ورود مهمان در وب

‏این مثال در فایل ⁦JavaScript⁩ پروژه‌ای با ⁦bundler⁩ اجرا می‌شود. ایجاد نمونه بدون ⁦<code dir="ltr">verifiedToken</code>⁩ بلافاصله فرم ورود مهمان را نمایش می‌دهد. فراخوانی زودهنگام ⁦<code dir="ltr">open()</code>⁩ ورود را قطع نمی‌کند؛ درخواست تا دریافت توکن نگه داشته می‌شود.


</div>

<div dir="ltr" align="left">

```js
import { createSamanDeskWeb } from 'samandesk'

// اجرا بعد از آماده‌شدن document.body
const support = createSamanDeskWeb({
  workspaceID: 'YOUR_WORKSPACE_ID',
  language: 'fa',
  theme: { darkMode: 'light', color: 'default' },
  onReady: () => {
    // توکن نشست دریافت شده؛ اکنون می‌توان صفحهٔ دپارتمان‌ها را باز کرد.
    support.open()
  },
  linkHandler: (link) => {
    const url = new URL(link)
    if (['https:', 'http:'].includes(url.protocol)) {
      window.open(url.href, '_blank', 'noopener,noreferrer')
    }
  },
})

// پس از ورود: support.open()
// بستن: support.close()
// هنگام حذف بخش میزبان: support.destroy()
```

</div>

<div dir="rtl" align="right">


‏ورود مهمان شامل فرم اطلاعات و تأیید ⁦OTP⁩ است. پس از دریافت توکن، میزبان باید با ⁦<code dir="ltr">open()</code>⁩ صفحهٔ انتخاب دپارتمان را باز کند؛ دریافت توکن به‌تنهایی این جابه‌جایی را انجام نمی‌دهد.

<a id="configuration"></a>

## ‏تنظیمات مشترک: ⁦SamanDeskConfig⁩

‏آرگومان اول هر دو تابع سازنده است. برای ورود باید یکی از ⁦<code dir="ltr">workspaceID</code>⁩ یا ⁦<code dir="ltr">verifiedToken</code>⁩ معتبر باشد. اگر هر دو تنظیم شوند، ⁦<code dir="ltr">verifiedToken</code>⁩ اولویت دارد. ورودی خالی، مقدار نامعتبر، رشته‌های ⁦<code dir="ltr">undefined</code>⁩ و ⁦<code dir="ltr">null</code>⁩ و آدرس نامعتبر، پیش از ایجاد قاب با خطای همگام ⁦<code dir="ltr">INVALID_CONFIG</code>⁩ رد می‌شوند؛ گزینهٔ استفاده‌نشده را حذف کنید.

| ‏گزینه | ‏نوع | ‏پیش‌فرض / کاربرد |
| ---: | ---: | ---: |
| ‏⁦<code dir="ltr">workspaceID</code>⁩ | ‏⁦<code dir="ltr">string</code>⁩ | ‏بدون پیش‌فرض؛ شناسهٔ محیط کاری برای ورود مهمان |
| ‏⁦<code dir="ltr">verifiedToken</code>⁩ | ‏⁦<code dir="ltr">string</code>⁩ | ‏بدون پیش‌فرض؛ توکن ورودی برای راه‌اندازی نشست |
| ‏⁦<code dir="ltr">siteUrl</code>⁩ | ‏⁦<code dir="ltr">string</code>⁩ | ‏⁦<code dir="ltr">https://samandesk.com</code>⁩ در خروجی انتشار؛ آدرس پایهٔ وب‌اپ |
| ‏⁦<code dir="ltr">language</code>⁩ | ‏⁦<code dir="ltr">string</code>⁩ | ‏⁦<code dir="ltr">fa</code>⁩؛ صفحات ورود مهمان و انتخاب دپارتمان فعلاً ⁦<code dir="ltr">fa</code>⁩ و ⁦<code dir="ltr">en</code>⁩ را می‌پذیرند و برای مقادیر دیگر به زبان پیش‌فرض برنامه برمی‌گردند |
| ‏⁦<code dir="ltr">theme</code>⁩ | ‏⁦<code dir="ltr">Partial&lt;ProjectTheme&gt;</code>⁩ | ‏⁦<code dir="ltr">{ darkMode: 'light', color: 'default' }</code>⁩؛ فیلدهای حذف‌شده نیز هنگام پاسخ به وب‌اپ همین مقادیر را می‌گیرند |
| ‏⁦<code dir="ltr">linkHandler</code>⁩ | ‏⁦<code dir="ltr">(link: string) =&gt; void</code>⁩ | ‏دریافت درخواست بازکردن لینک از داخل رابط؛ بدون این تابع فقط هشدار در ⁦console⁩ ثبت می‌شود |
| ‏⁦<code dir="ltr">handshakeTimeoutMs</code>⁩ | ‏⁦<code dir="ltr">number</code>⁩ | ‏پیش‌فرض ۳۰٬۰۰۰ میلی‌ثانیه؛ مهلت دریافت توکن در ورود مستقیم یا آماده‌شدن فرم مهمان؛ زمان واردکردن اطلاعات و ⁦OTP⁩ را محدود نمی‌کند |
| ‏⁦<code dir="ltr">onReady</code>⁩ | ‏⁦<code dir="ltr">(token: string) =&gt; void</code>⁩ | ‏پس از دریافت توکن معتبر؛ پیام تکراری با همان توکن نادیده گرفته می‌شود |
| ‏⁦<code dir="ltr">onTokenChange</code>⁩ | ‏⁦<code dir="ltr">(token: string) =&gt; void</code>⁩ | ‏پس از ⁦<code dir="ltr">onReady</code>⁩ با توکن جدید |
| ‏⁦<code dir="ltr">onOpen</code>⁩ | ‏⁦<code dir="ltr">() =&gt; void</code>⁩ | ‏هنگام نمایش از طریق آداپتر؛ نشانهٔ پایان بارگذاری نیست |
| ‏⁦<code dir="ltr">onClose</code>⁩ | ‏⁦<code dir="ltr">() =&gt; void</code>⁩ | ‏هنگام تغییر از نمایان به مخفی؛ بستن تکراری و پاکسازی نمونهٔ مخفی دوباره آن را اجرا نمی‌کند |
| ‏⁦<code dir="ltr">onGuestReady</code>⁩ | ‏⁦<code dir="ltr">() =&gt; void</code>⁩ | ‏هنگام ⁦mount⁩ صفحهٔ ورود مهمان؛ به معنی ورود موفق یا دریافت توکن نیست |
| ‏⁦<code dir="ltr">onError</code>⁩ | ‏⁦<code dir="ltr">(error: Error) =&gt; void</code>⁩ | ‏خطای ورود، بارگذاری یا پایان مهلت؛ خطا از نوع ⁦<code dir="ltr">SamanDeskError</code>⁩ است. بدون این تابع خطا در کنسول ثبت می‌شود |


‏پارامتر ⁦<code dir="ltr">siteUrl</code>⁩ آدرس مطلق وب‌اپ است، مانند ⁦<code dir="ltr">https://samandesk.com</code>⁩. اسلش پایانی عادی‌سازی می‌شود؛ مسیر پایه نیز پذیرفته می‌شود و ⁦origin⁩ پیام مستقل از مسیر محاسبه می‌شود. آدرس نباید نام کاربری، رمز، پرس‌وجو یا قطعه داشته باشد. پیش‌فرض همیشه سرور عمومی است؛ برای توسعه، ⁦<code dir="ltr">siteUrl: 'http://localhost:2525'</code>⁩ را صریح تنظیم کنید. هر قاب فقط پیام‌های همان پنجره و همان ⁦origin⁩ را می‌پذیرد؛ تغییر دامنه با ریدایرکت نیازمند اصلاح آدرس تنظیم‌شده است.

### ‏تم و رنگ‌ها


</div>

<div dir="ltr" align="left">

```ts
import type { ProjectTheme, SamanDeskConfig } from 'samandesk'

const theme: ProjectTheme = { darkMode: 'dark', color: 'teal' }
const config: SamanDeskConfig = {
  workspaceID: 'YOUR_WORKSPACE_ID',
  theme,
  language: 'en',
}
```

</div>

<div dir="rtl" align="right">


‏⁦<code dir="ltr">darkMode</code>⁩ یکی از ⁦<code dir="ltr">light</code>⁩ یا ⁦<code dir="ltr">dark</code>⁩ است. ⁦<code dir="ltr">color</code>⁩ نام یکی از رنگ‌های زیر است؛ مقدار ⁦hex⁩ دلخواه پذیرفته نمی‌شود:


</div>

<div dir="ltr" align="left">

```text
default, blue, red, darkGreen, orange, green, teal, absolute, pink,
darkTeal, mint, darkPurple, dodgerBlue, darkGold, purple, brown, ferra
```

</div>

<div dir="rtl" align="right">


| ‏شناسه رنگ (⁦`color`⁩) | ‏کد رنگ (⁦Light⁩) | ‏کد رنگ (⁦Dark⁩) | ‏پیش‌نمایش |
| :--- | :--- | :--- | :---: |
| `default` | `#40826D` | `#68B09D` | 🟢 |
| `blue` | `#1D9CF0` | `#52B6FC` | 🔵 |
| `red` | `#C2412D` | `#F69B8A` | 🔴 |
| `darkGreen` | `#005141` | `#86D6BE` | 🌲 |
| `orange` | `#E86D0F` | `#FFA36B` | 🟠 |
| `green` | `#00BA7B` | `#00BA7B` | ❇️ |
| `teal` | `#30B0C7` | `#5DD5EA` | 🐬 |
| `absolute` | `#11232E` | `#DDE7EE` | 🌑 |
| `pink` | `#EB43AD` | `#F7A7DA` | 🌸 |
| `darkTeal` | `#344EA2` | `#A5B6EC` | 🌊 |
| `mint` | `#00B2AA` | `#13C0B8` | 🍃 |
| `darkPurple` | `#65558F` | `#D0BCFE` | 🟣 |
| `dodgerBlue` | `#386CF8` | `#8EA7FF` | 🔷 |
| `darkGold` | `#9C8410` | `#DDC66E` | 🟡 |
| `purple` | `#8056E0` | `#B49CED` | 🪻 |
| `brown` | `#A2845E` | `#CEAA7C` | 🟤 |
| `ferra` | `#7D5260` | `#EFB8C8` | 🍷 |

‏تم و زبان در پاسخ به درخواست ⁦<code dir="ltr">getConfig</code>⁩ وب‌اپ اعمال می‌شوند. متدی برای تغییر زندهٔ تنظیمات در ⁦API⁩ عمومی وجود ندارد.

<a id="web"></a>

## ‏⁦API⁩ وب


</div>

<div dir="ltr" align="left">

```text
createSamanDeskWeb(config, options?)
```

</div>

<div dir="rtl" align="right">


‏آرگومان دوم فقط مربوط به وب است:

| ‏گزینه | ‏نوع | ‏پیش‌فرض / کاربرد |
| ---: | ---: | ---: |
| ‏⁦<code dir="ltr">mode</code>⁩ | ‏⁦<code dir="ltr">'auto' &#124; 'iframe' &#124; 'popup'</code>⁩ | ‏پیش‌فرض ⁦<code dir="ltr">auto</code>⁩؛ قاب در حالت معمول، پنجرهٔ مستقل در پورتال با بالاترین پنجرهٔ غیرقابل‌دسترسی. حالت ⁦<code dir="ltr">iframe</code>⁩ در این وضعیت خطای نیاز به پنجرهٔ مستقل می‌دهد. حالت ⁦<code dir="ltr">popup</code>⁩ از ابتدا منتظر کلیک کاربر می‌ماند |
| ‏⁦<code dir="ltr">fullScreen</code>⁩ | ‏⁦<code dir="ltr">boolean</code>⁩ | ‏⁦<code dir="ltr">false</code>⁩؛ نمایش تمام‌صفحه |
| ‏⁦<code dir="ltr">style.width</code>⁩ | ‏⁦<code dir="ltr">string</code>⁩ | ‏⁦<code dir="ltr">100%</code>⁩؛ فقط حالت پنجره‌ای، با سقف ثابت ⁦<code dir="ltr">500px</code>⁩ |
| ‏⁦<code dir="ltr">style.height</code>⁩ | ‏⁦<code dir="ltr">string</code>⁩ | ‏⁦<code dir="ltr">100%</code>⁩؛ فقط حالت پنجره‌ای، با سقف ثابت ⁦<code dir="ltr">660px</code>⁩ |
| ‏⁦<code dir="ltr">style.marginTop</code>⁩ | ‏⁦<code dir="ltr">number</code>⁩ | ‏⁦<code dir="ltr">0</code>⁩ پیکسل؛ فقط در تمام‌صفحه |
| ‏⁦<code dir="ltr">style.marginBottom</code>⁩ | ‏⁦<code dir="ltr">number</code>⁩ | ‏⁦<code dir="ltr">0</code>⁩ پیکسل؛ فقط در تمام‌صفحه |

---

</div>

<div dir="ltr" align="left">

```js
const support = createSamanDeskWeb(
  { workspaceID: 'YOUR_WORKSPACE_ID' },
  {
    fullScreen: true,
    style: { marginTop: 64, marginBottom: 16 },
  },
)
```

</div>

<div dir="rtl" align="right">


‏خروجی سازنده متدهای زیر را دارد؛ هیچ‌کدام ⁦Promise⁩ یا مقدار بازگشتی ندارند:

| ‏متد | ‏رفتار |
| ---: | ---: |
| ‏⁦<code dir="ltr">open(link?: string)</code>⁩ | ‏نمایش چت پس از دریافت توکن؛ درخواست زودهنگام در صف می‌ماند. لینک باید متعلق به دامنهٔ وب‌اپ باشد؛ لینک نامعتبر خطای همگام ⁦<code dir="ltr">INVALID_LINK</code>⁩ می‌دهد |
| ‏⁦<code dir="ltr">openPopup(link?: string)</code>⁩ | ‏ورود و چت در پنجرهٔ مستقل؛ باید مستقیماً از کلیک کاربر فراخوانی شود. پنجرهٔ باز دوباره بارگذاری نمی‌شود؛ تغییر از قاب به پنجره، ورود تازه شروع می‌کند |
| ‏⁦<code dir="ltr">close()</code>⁩ | ‏در حالت قاب، مخفی‌کردن بدون قطع ورود؛ در حالت پنجرهٔ مستقل، بستن پنجره و لغو مهلت انتظار |
| ‏⁦<code dir="ltr">retry()</code>⁩ | ‏شروع دوبارهٔ ورود در قاب تازه با تنظیمات اولیه؛ پاسخ دیرهنگام قاب قبلی پذیرفته نمی‌شود |
| ‏⁦<code dir="ltr">destroy()</code>⁩ | ‏حذف قاب، پس‌زمینه، شنونده و تایمر؛ پاکسازی تکراری بی‌اثر است |

‏بازکردن مجدد همان مقصد در قاب یا پنجرهٔ باز، صفحه را دوباره بارگذاری نمی‌کند و پیشرفت چت حفظ می‌شود. بستن، خروج از حساب نیست. برای حذف منابع نمونه، ⁦<code dir="ltr">destroy()</code>⁩ را اجرا کنید؛ بازکردن یا تلاش مجدد روی نمونهٔ پاک‌شده خطای همگام ⁦<code dir="ltr">DESTROYED</code>⁩ می‌دهد. پاکسازی نمونه، نشست ذخیره‌شدهٔ خود وب‌اپ را از حساب خارج نمی‌کند.

### ‏مرورگر بدون ابزار بسته‌بندی

‏همان نسخهٔ مشخص‌شده در دستور نصب را در آدرس ⁦CDN⁩ استفاده کنید. این مثال را در انتهای ⁦<code dir="ltr">body</code>⁩ قرار دهید؛ فرم مهمان خودکار نمایش داده می‌شود و پس از دریافت توکن، صفحهٔ دپارتمان‌ها باز می‌شود.

</div>

<div dir="ltr" align="left">

```html
<button id="support-button" disabled>پشتیبانی</button>
<script type="module">
  import { createSamanDeskWeb } from 'https://cdn.jsdelivr.net/npm/samandesk@2.0.0-beta2.0/dist/saman-desk.js'

  const button = document.getElementById('support-button')
  const support = createSamanDeskWeb({
    workspaceID: 'YOUR_WORKSPACE_ID',
    onReady: () => {
      button.disabled = false
      support.open()
    },
  })
  button.addEventListener('click', () => support.open())
</script>
```

</div>

<div dir="rtl" align="right">

### Vue / Nuxt


</div>

<div dir="ltr" align="left">

```vue
<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { createSamanDeskWeb } from 'samandesk'

let support: ReturnType<typeof createSamanDeskWeb> | undefined

onMounted(() => {
  support = createSamanDeskWeb({
    workspaceID: 'YOUR_WORKSPACE_ID',
    onReady: () => support?.open(),
  })
})

onBeforeUnmount(() => support?.destroy())
</script>
```

</div>

<div dir="rtl" align="right">


‏برای دکمهٔ بازکردن مجدد، پس از اولین ⁦<code dir="ltr">onReady</code>⁩ از ⁦<code dir="ltr">support?.open()</code>⁩ استفاده کنید. در ⁦React⁩ وب نیز ساخت نمونه را داخل ⁦<code dir="ltr">useEffect</code>⁩ و ⁦<code dir="ltr">destroy()</code>⁩ را در ⁦cleanup⁩ همان ⁦effect⁩ قرار دهید.

### React / Next.js

‏در ⁦Next.js⁩ (هم در ⁦Pages Router⁩ و هم در ⁦App Router⁩ با ⁦`'use client'`⁩) کتابخانه را داخل هوک ⁦`useEffect`⁩ نمونه‌سازی کنید:

</div>

<div dir="ltr" align="left">

```tsx
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createSamanDeskWeb } from 'samandesk'

type SamanDeskWebInstance = ReturnType<typeof createSamanDeskWeb>

export function SupportWidget() {
  const supportRef = useRef<SamanDeskWebInstance | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsReady(false)
    const support = createSamanDeskWeb(
      {
        workspaceID: 'YOUR_WORKSPACE_ID',
        language: 'fa',
        theme: { darkMode: 'light', color: 'blue' },
        onReady: () => {
          setIsReady(true)
        },
      },
      {
        fullScreen: false,
      }
    )

    supportRef.current = support

    return () => {
      // پاکسازی هنگام Unmount
      support.destroy()
      supportRef.current = null
    }
  }, [])

  return (
    <button
      disabled={!isReady}
      onClick={() => supportRef.current?.open()}
      className="btn-support"
    >
      {isReady ? 'پشتیبانی آنلاین' : 'در حال راه‌اندازی...'}
    </button>
  )
}
```

</div>

<div dir="rtl" align="right">

---

<a id="token-login"></a>

### ‏ورود با توکن


</div>

<div dir="ltr" align="left">

```js
const support = createSamanDeskWeb({
  verifiedToken: 'VERIFIED_TOKEN_FROM_YOUR_SERVICE',
  onReady: (sessionToken) => {
    // sessionToken توکن نشست است، نه لزوماً همان verifiedToken ورودی.
  },
})
```

</div>

<div dir="rtl" align="right">


‏در این حالت مسیر ⁦<code dir="ltr">/setup-interoperation/{verifiedToken}</code>⁩ در پس‌زمینه بارگذاری می‌شود و توکن نشست با ⁦<code dir="ltr">onReady</code>⁩ و ⁦<code dir="ltr">onTokenChange</code>⁩ تحویل داده می‌شود. توکن خروجی را جایگزین ⁦<code dir="ltr">verifiedToken</code>⁩ نکنید مگر قرارداد سرویس شما صریحاً آن را بپذیرد. پکیج توکن را فقط در حافظه نگه می‌دارد و ⁦API⁩ ذخیره، تمدید یا خروج از حساب ندارد.

### ‏مدیریت خطا و تلاش مجدد

‏برای خطای تنظیمات، محل ساخت را با ⁦<code dir="ltr">try/catch</code>⁩ پوشش دهید. خطاهای غیرهمگام از ⁦<code dir="ltr">onError</code>⁩ می‌آیند. پیام و کد خطا را نمایش دهید و دکمهٔ تلاش مجدد را در اختیار کاربر بگذارید؛ تلاش خودکار نامحدود ممکن است توکن یک‌بارمصرف را دوباره ارسال کند. برای توکن منقضی یا مصرف‌شده، نمونهٔ قبلی را پاک و با توکن تازه نمونهٔ جدید بسازید. هنگام ثبت گزارش، مقدار توکن و آدرس کامل مسیر ورود را ثبت نکنید.

</div>

<div dir="ltr" align="left">

```ts
import { createSamanDeskWeb, SamanDeskError } from 'samandesk'

try {
  const support = createSamanDeskWeb({
    verifiedToken: 'VERIFIED_TOKEN_FROM_YOUR_SERVICE',
    handshakeTimeoutMs: 30000,
    onReady: () => support.open(),
    onError: (error) => {
      if (error instanceof SamanDeskError) {
        console.error(error.code, error.message)
      }
      // Enable a user-operated retry button; do not loop automatically.
    },
  })
  // Retry button: support.retry()
  // Unmount/logout: support.destroy()
} catch (error) {
  // Invalid configuration or client DOM not available.
  console.error(error)
}
```

</div>

<div dir="rtl" align="right">

‏مهلت راه‌اندازی فقط در خود کتابخانه اعمال می‌شود و بارگذاری وب‌اپ را هم پوشش می‌دهد؛ مهلت درخواست‌های شبکه و رفتار ذخیره‌سازیِ وب‌اپ فعلی تغییر نکرده‌اند. پایان این مهلت، نتیجهٔ قطعیِ درخواست ورود را مشخص نمی‌کند؛ ممکن است سرور توکن یک‌بارمصرف را مصرف کرده باشد.

### ‏پورتال، ذخیره‌سازی محدود و وب‌اپ فعلی

‏وب‌اپ فعلی پیام را به بالاترین پنجره می‌فرستد. کتابخانه در صفحهٔ میزبان و، در صورت دسترسی هم‌دامنه، در بالاترین پنجره شنونده ثبت می‌کند؛ هر دو مسیر فقط پیام پنجرهٔ همان نمونه و دامنهٔ تنظیم‌شده را می‌پذیرند. این کار نیاز به تغییر گیرنده در وب‌اپ را برطرف می‌کند. اگر بالاترین پنجره از دامنه‌ای دیگر باشد، مرورگر اجازهٔ ثبت شنونده در آن را نمی‌دهد؛ در حالت خودکار، فراخوانی ⁦<code dir="ltr">open()</code>⁩ از کلیک کاربر به پنجرهٔ مستقل می‌رود.

‏اگر قاب به‌دلیل محدودیت ذخیره‌سازی یا سیاست تعبیه آماده نشود، دکمه‌ای برای ⁦<code dir="ltr">openPopup()</code>⁩ ارائه کنید. در این مسیر، ورود و چت هر دو در همان پنجره می‌مانند و توکن را بین ذخیره‌سازیِ قاب و پنجره جابه‌جا نمی‌کنیم. پنجرهٔ مستقل از ⁦<code dir="ltr">window.opener</code>⁩ موجود در وب‌اپ فعلی استفاده می‌کند. برای جلوگیری از مسدودشدن پنجره، ساخت آن قبل از هر عملیات غیرهمگام و مستقیماً در پاسخ به کلیک انجام می‌شود.

</div>

<div dir="ltr" align="left">

```js
const support = SamanDesk.createSamanDeskWeb({
  verifiedToken: 'FRESH_VERIFIED_TOKEN_FROM_YOUR_SERVICE',
  onError: (error) => {
    console.error(error.code, error.message)
    // Keep the standalone-window button available even before onReady.
  },
}, { mode: 'popup' })

document.getElementById('support-button').addEventListener('click', () => {
  support.openPopup()
})
```

</div>

<div dir="rtl" align="right">

‏این مثال برای خروجی ⁦UMD⁩ است و دکمه نباید تا دریافت توکن غیرفعال بماند؛ شروع ورود به همان کلیک نیاز دارد. فایل ساخته‌شده را پیش از این کد با برچسب ⁦<code dir="ltr">script</code>⁩ بارگذاری کنید. در حالت پنجرهٔ مستقل، پس از دریافت توکن صفحهٔ دپارتمان‌ها خودکار باز می‌شود. اگر ورود قبلی توکن را مصرف کرده باشد، از سرویس میزبان توکن تازه بگیرید و نمونهٔ تازه بسازید. کتابخانه توکن نشست را جایگزین توکن تأیید نمی‌کند. الزام کلیک کاربر و احتمال مسدودشدن پنجره در [مستندات مرورگر](https://developer.mozilla.org/en-US/docs/Web/API/Window/open) توضیح داده شده است.

‏محدودیت‌های باقی‌مانده: کتابخانه نمی‌تواند از بیرون قاب ذخیره‌سازی وب‌اپ را اصلاح کند، پاسخ ورود را بخواند یا فهرست دامنه‌های مجاز وب‌اپ را تغییر دهد. در دامنه‌های خارج از فهرست قدیمی، تم و زبان ممکن است با پیش‌فرض وب‌اپ نمایش داده شوند؛ در قاب تودرتو نیز وب‌اپ قدیمی ممکن است پاسخ پیکربندیِ والد مستقیم را نپذیرد. پنجرهٔ مستقل نیازمند مجازبودن پنجره‌ها، ذخیره‌سازی معمول وب‌اپ و حفظ ارتباط با بازکننده است. محدودیت ⁦sandbox⁩ یا سیاست ⁦COOP⁩ می‌تواند این مسیر را نیز ببندد. شکست داخلی وب‌اپ یا رد توکن همچنان باید در همان سرویس رفع شود.


<a id="react-native"></a>

## ‏رابط ⁦React Native⁩


</div>

<div dir="ltr" align="left">

```text
createSamanDeskReactNative(config, options)
```

</div>

<div dir="rtl" align="right">


‏هر دو گزینهٔ آرگومان دوم الزامی‌اند:

| ‏گزینه | ‏امضا | ‏کاربرد |
| ---: | ---: | ---: |
| ‏⁦<code dir="ltr">onStateChange</code>⁩ | ‏⁦<code dir="ltr">(state: { source: { uri: string }; visible: boolean }) =&gt; void</code>⁩ | ‏دریافت وضعیت جدید بعد از ⁦<code dir="ltr">open()</code>⁩ یا ⁦<code dir="ltr">close()</code>⁩؛ هنگام ساخت اجرا نمی‌شود |
| ‏⁦<code dir="ltr">injectJavaScript</code>⁩ | ‏⁦<code dir="ltr">(script: string) =&gt; void</code>⁩ | ‏اجرای کد ارسالی کتابخانه داخل ⁦WebView⁩ |

| ‏متد خروجی | ‏رفتار |
| ---: | ---: |
| ‏⁦<code dir="ltr">getState()</code>⁩ | ‏وضعیت فعلی؛ برای وضعیت اولیه بلافاصله بعد از ساخت استفاده کنید |
| ‏⁦<code dir="ltr">getWebViewProps()</code>⁩ | ‏اتصال ⁦<code dir="ltr">onMessage</code>⁩، ⁦<code dir="ltr">onError</code>⁩، ⁦<code dir="ltr">onHttpError</code>⁩ و ⁦<code dir="ltr">key</code>⁩؛ کلید برای ایجاد نمای تازه هنگام تلاش مجدد است. آدرس را جداگانه از وضعیت بدهید |
| ‏⁦<code dir="ltr">open(link?: string)</code>⁩ | ‏تنظیم ⁦<code dir="ltr">visible: true</code>⁩ و بارگذاری لینک یا مسیر دپارتمان‌ها با توکن نشست |
| ‏⁦<code dir="ltr">close()</code>⁩ | ‏مخفی‌کردن بدون تخلیهٔ صفحه و لغو درخواست بازکردن معلق |
| ‏⁦<code dir="ltr">retry()</code>⁩ | ‏شروع دوبارهٔ ورود و تغییر کلید ⁦WebView⁩؛ برای توکن منقضی‌شده نمونهٔ جدید با توکن تازه بسازید |
| ‏⁦<code dir="ltr">destroy()</code>⁩ | ‏لغو تایمرها و انتقال به صفحهٔ خالی؛ پیام‌های بعدی نادیده گرفته می‌شوند. حذف ⁦WebView⁩ بر عهدهٔ میزبان است |

‏وضعیت اولیه با توکن، مخفی و روی مسیر ⁦setup⁩ است؛ بدون توکن، نمایان و روی مسیر ورود مهمان. برخلاف وب، ایجاد نمونهٔ مهمان در ⁦React Native⁩ باعث اجرای ⁦<code dir="ltr">onOpen</code>⁩ نمی‌شود.

### ‏نمونهٔ اتصال ⁦WebView⁩

‏پس از نصب و راه‌اندازی ⁦<code dir="ltr">react-native-webview</code>⁩ در پروژه، کامپوننت زیر جریان ورود مهمان را متصل می‌کند. ⁦WebView⁩ هنگام راه‌اندازی مخفی نیز ⁦mount⁩ می‌ماند تا بتواند با کتابخانه ارتباط برقرار کند.


</div>

<div dir="ltr" align="left">

```tsx
import { useEffect, useRef, useState } from 'react'
import { Button, Linking, View } from 'react-native'
import { WebView } from 'react-native-webview'
import { createSamanDeskReactNative } from 'samandesk'

type Support = ReturnType<typeof createSamanDeskReactNative>
type SupportState = ReturnType<Support['getState']>

export function SupportChat() {
  const webView = useRef<WebView>(null)
  const support = useRef<Support | null>(null)
  const [state, setState] = useState<SupportState | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const api = createSamanDeskReactNative(
      {
        workspaceID: 'YOUR_WORKSPACE_ID',
        onReady: () => {
          setReady(true)
          support.current?.open()
        },
        linkHandler: (link) => {
          if (/^https?:\/\//i.test(link)) {
            void Linking.openURL(link).catch(console.error)
          }
        },
      },
      {
        onStateChange: setState,
        injectJavaScript: (script) => {
          webView.current?.injectJavaScript(script + '\ntrue;')
        },
      },
    )
    support.current = api
    setState(api.getState())

    return () => {
      api.destroy()
      support.current = null
    }
  }, [])

  const api = support.current
  const webViewProps = api?.getWebViewProps()
  return (
    <View style={{ flex: 1 }}>
      <Button title="پشتیبانی" disabled={!ready} onPress={() => api?.open()} />
      {state && api && webViewProps && (
        <View
          pointerEvents={state.visible ? 'auto' : 'none'}
          style={state.visible ? { flex: 1 } : { width: 1, height: 1, opacity: 0 }}
        >
          <WebView
            key={webViewProps.key}
            ref={webView}
            source={state.source}
            javaScriptEnabled
            onMessage={webViewProps.onMessage}
            onError={webViewProps.onError}
            onHttpError={webViewProps.onHttpError}
          />
        </View>
      )}
    </View>
  )
}
```

</div>

<div dir="rtl" align="right">


‏پیام بستنِ داخل وب‌اپ از همان مسیر بستن آداپتر عبور می‌کند؛ وضعیت نمایشی و خروجی ⁦<code dir="ltr">getState()</code>⁩ هماهنگ می‌مانند. هنگام مخفی‌بودن، ⁦WebView⁩ را متصل نگه دارید تا ورود قطع نشود. تایمر راه‌اندازی از زمان ساخت نمونه شروع می‌شود؛ نمونه و نمای آن را با هم بسازید.

<a id="types"></a>

## ‏خروجی‌های ⁦TypeScript⁩ و ماژول‌ها

‏پکیج ورودی ⁦ESM⁩ و ⁦CommonJS⁩ و ⁦declaration⁩های ⁦TypeScript⁩ را در ⁦<code dir="ltr">package.json</code>⁩ معرفی می‌کند:


</div>

<div dir="ltr" align="left">

```js
import { createSamanDeskWeb, createSamanDeskReactNative } from 'samandesk'
// CommonJS:
// const { createSamanDeskWeb } = require('samandesk')
```

</div>

<div dir="rtl" align="right">


‏نوع‌های عمومی شامل ⁦<code dir="ltr">SamanDeskConfig</code>⁩، ⁦<code dir="ltr">ProjectTheme</code>⁩، ⁦<code dir="ltr">SamanDeskErrorCode</code>⁩، ⁦<code dir="ltr">MessageData&lt;T = {}&gt;</code>⁩ و ⁦<code dir="ltr">OutgoingMessage</code>⁩ هستند. کلاس ⁦<code dir="ltr">SamanDeskError</code>⁩ نیز صادر می‌شود. دو نوع آخر ساختار پیام ارتباطی‌اند:


</div>

<div dir="ltr" align="left">

```ts
// MessageData<T>: { id: number; action: string; data: T }
// OutgoingMessage: { from: 'SamanDesk'; action: string; data?: any; id?: number }
```

</div>

<div dir="rtl" align="right">


‏⁦<code dir="ltr">Color</code>⁩، ⁦<code dir="ltr">WebOptions</code>⁩، ⁦<code dir="ltr">ReactNativeOptions</code>⁩، ⁦<code dir="ltr">ReactNativeState</code>⁩ و کلاس ⁦<code dir="ltr">SamanDeskCore</code>⁩ مستقیماً از ورودی عمومی ⁦export⁩ نمی‌شوند. برای استخراج نوع‌ها از امضای توابع استفاده کنید:


</div>

<div dir="ltr" align="left">

```ts
import type { ProjectTheme } from 'samandesk'
import { createSamanDeskWeb, createSamanDeskReactNative } from 'samandesk'

type ThemeColor = ProjectTheme['color']
type WebOptions = NonNullable<Parameters<typeof createSamanDeskWeb>[1]>
type NativeOptions = Parameters<typeof createSamanDeskReactNative>[1]
```

</div>

<div dir="rtl" align="right">


<a id="protocol"></a>

## ‏پروتکل تبادل پیام

‏در وب، ارتباط میزبان و ⁦<code dir="ltr">iframe</code>⁩ با ⁦<code dir="ltr">postMessage</code>⁩ انجام می‌شود. در ⁦React Native⁩، وب‌اپ پیام ⁦JSON⁩ را با ⁦<code dir="ltr">window.ReactNativeWebView.postMessage</code>⁩ می‌فرستد و آداپتر پاسخ را با ⁦<code dir="ltr">injectJavaScript</code>⁩ به ⁦WebView⁩ می‌رساند. اتصال این دو مسیر در نمونهٔ بالا آمده است.

| ‏پیام | ‏کاربرد |
| ---: | ---: |
| ‏⁦<code dir="ltr">getConfig</code>⁩ | ‏درخواست تم، رنگ و زبان؛ پاسخ با همان شناسهٔ پیام ارسال می‌شود |
| ‏⁦<code dir="ltr">setToken</code>⁩ | ‏دریافت توکن نشست و اجرای ⁦<code dir="ltr">onReady</code>⁩ و سپس ⁦<code dir="ltr">onTokenChange</code>⁩ |
| ‏⁦<code dir="ltr">setGuestReadyEvent</code>⁩ | ‏آماده‌شدن فرم مهمان و اجرای ⁦<code dir="ltr">onGuestReady</code>⁩؛ هنوز توکن نشست دریافت نشده است |
| ‏⁦<code dir="ltr">openLink</code>⁩ | ‏تحویل لینک به ⁦<code dir="ltr">linkHandler</code>⁩ |
| ‏⁦<code dir="ltr">close</code>⁩ | ‏بستن از مسیر آداپتر و هماهنگ‌کردن وضعیت میزبان |
| ‏⁦<code dir="ltr">error</code>⁩ | ‏اعلام شکست ورود به میزبان و اجرای ⁦<code dir="ltr">onError</code>⁩ |

‏این پیام‌ها قرارداد ارتباط داخلی‌اند؛ متد عمومی برای ارسال دلخواه پیام یا فراخوانی هسته از خروجی پکیج ارائه نمی‌شود.

<a id="troubleshooting"></a>

## ‏محدودیت‌ها و رفع مشکل

| ‏نشانه | ‏علت / اقدام |
| ---: | ---: |
| ‏خطای ⁦<code dir="ltr">INVALID_CONFIG</code>⁩ | ‏ساخت را سمت کلاینت و بعد از آماده‌شدن بدنه انجام دهید؛ شناسه یا توکن و آدرس وب‌اپ را بررسی کنید. این خطا همگام است و باید در محل ساخت گرفته شود |
| ‏خطای ⁦<code dir="ltr">HANDSHAKE_TIMEOUT</code>⁩ | ‏به‌موقع توکن یا آماده‌شدن فرم دریافت نشده است؛ شبکه، محدودیت قاب، دامنهٔ نهایی وب‌اپ و اتصال پیام‌ها را بررسی کنید. تایمر اضافی بر اساس رویداد خام نسازید |
| ‏خطای ⁦<code dir="ltr">AUTHENTICATION_FAILED</code>⁩ | ‏وب‌اپ ورود را رد کرده است؛ متن خطا را بررسی و در صورت انقضا توکن تازه بگیرید. پاسخ ۲۰۰ بدون توکن معتبر نیز ورود موفق نیست |
| ‏خطای ⁦<code dir="ltr">CALLBACK_ERROR</code>⁩ | ‏یکی از توابع میزبان استثنا داده است؛ نام تابع در پیام خطا آمده است. پیاده‌سازی همان تابع را اصلاح کنید |
| ‏خطای ⁦<code dir="ltr">POPUP_REQUIRED</code>⁩ | ‏راه‌اندازی به پنجرهٔ مستقل نیاز دارد؛ دکمهٔ فعال برای ⁦<code dir="ltr">openPopup()</code>⁩ ارائه کنید و آن را به دریافت توکن وابسته نکنید |
| ‏خطای ⁦<code dir="ltr">POPUP_BLOCKED</code>⁩ | ‏پنجره را مستقیماً از کلیک کاربر باز کنید؛ مجوز پنجره‌ها و محدودیت قابِ پورتال را بررسی کنید |
| ‏تم یا زبان اعمال نمی‌شود | ‏وب‌اپ فعلی پاسخ پیکربندی را فقط از چند دامنهٔ ثابت و پنجرهٔ موردانتظار می‌پذیرد. کتابخانه این محدودیت را دور نمی‌زند و رابط می‌تواند با تنظیمات پیش‌فرض کار کند |
| ‏خطای بارگذاری در وب یا ⁦WebView⁩ | ‏اتصال ⁦<code dir="ltr">onError</code>⁩ و پراپ‌های نمای بومی را برقرار کنید. مرورگر همیشه شکست بارگذاری قاب را با رویداد خطا اعلام نمی‌کند؛ مهلت راه‌اندازی مسیر جایگزین تشخیص است |
| ‏ذخیره‌سازی مرورگر در قاب مسدود است | ‏از کلیک کاربر ⁦<code dir="ltr">openPopup()</code>⁩ را اجرا کنید؛ ورود و چت در پنجرهٔ مستقل ادامه می‌یابد. اگر توکن قبلی مصرف شده، نمونهٔ تازه با توکن تازه لازم است |

‏پیام‌های وب با پنجرهٔ مبدأ و ⁦origin⁩ تطبیق داده می‌شوند؛ وجود چند نمونه روی یک صفحه باعث جابه‌جایی پیام‌ها نمی‌شود. دریافت از بالاترین پنجرهٔ قابل‌دسترسی برای سازگاری با وب‌اپ فعلی پشتیبانی می‌شود و همهٔ شنونده‌ها و پنجرهٔ مستقل هنگام پاکسازی حذف می‌شوند. ⁦API⁩ عمومی برای ارسال پیام چت، مدیریت مکالمه، دریافت تعداد پیام خوانده‌نشده، تنظیم مجدد توکن یا دسترسی به قاب وجود ندارد.

<a id="migration"></a>

## ‏راهنمای مهاجرت از نسخهٔ ۱

‏مقصد این راهنما نسخهٔ ⁦<code dir="ltr">2.0.0-beta2.0</code>⁩ است که هنوز بتا است. نمونهٔ «قبل» بر اساس ⁦API⁩ نسخهٔ ⁦<code dir="ltr">1.2.0</code>⁩ نوشته شده؛ در نسخهٔ ⁦<code dir="ltr">1.1.1</code>⁩ امضاها ⁦<code dir="ltr">init(verifiedToken)</code>⁩ و ⁦<code dir="ltr">open(config)</code>⁩ بودند. در آن پروژه‌ها نیز تنظیمات ورود و تم را به آرگومان اول سازندهٔ جدید و تنظیمات نمایش را به آرگومان دوم منتقل کنید.

### ‏تغییرات لازم

| ‏نسخهٔ ۱ | ‏بتای ۲ |
| ---: | ---: |
| ‏نوع ⁦<code dir="ltr">OpenConfig</code>⁩ | ‏نوع ⁦<code dir="ltr">SamanDeskConfig</code>⁩ برای تنظیمات مشترک؛ نوع تنظیمات وب را از آرگومان دوم استخراج کنید |
| ‏بازکردن لینک بدون تنظیم ⁦handler⁩ | ‏تعریف صریح ⁦<code dir="ltr">linkHandler</code>⁩؛ در نبود آن فقط هشدار ثبت می‌شود |
| ‏⁦<code dir="ltr">new SamanDesk()</code>⁩ و سپس ⁦<code dir="ltr">init(config, token?)</code>⁩ | ‏⁦<code dir="ltr">createSamanDeskWeb(config, options?)</code>⁩؛ بدون متد ⁦<code dir="ltr">init</code>⁩ |
| ‏توکن در آرگومان دوم ⁦<code dir="ltr">init</code>⁩ | ‏توکن در ⁦<code dir="ltr">config.verifiedToken</code>⁩ |
| ‏تنظیم اندازه و تمام‌صفحه در ⁦config⁩ ورود | ‏گزینه‌های نمایش وب در آرگومان دوم سازنده |
| ‏رویدادهای ⁦<code dir="ltr">window</code>⁩ شامل ⁦<code dir="ltr">ready</code>⁩، ⁦<code dir="ltr">guest-ready</code>⁩، ⁦<code dir="ltr">open</code>⁩ و ⁦<code dir="ltr">close</code>⁩ | ‏به‌ترتیب ⁦callback⁩های ⁦<code dir="ltr">onReady</code>⁩، ⁦<code dir="ltr">onGuestReady</code>⁩، ⁦<code dir="ltr">onOpen</code>⁩ و ⁦<code dir="ltr">onClose</code>⁩ |
| ‏توکن نشست از ⁦API⁩ عمومی در دسترس نیست | ‏توکن نشست به ⁦<code dir="ltr">onReady</code>⁩ و ⁦<code dir="ltr">onTokenChange</code>⁩ تحویل داده می‌شود |
| ‏کلاس و داده‌های مشترک؛ بدون ⁦<code dir="ltr">destroy</code>⁩ | ‏خروجی سازنده دارای ⁦<code dir="ltr">destroy()</code>⁩ و وضعیت مستقل |
| ‏فقط ⁦iframe⁩ مرورگر | ‏آداپتر وب و آداپتر ⁦headless⁩ برای ⁦React Native⁩ |

### ‏قبل — نسخهٔ ۱٫۲٫۰

</div>

<div dir="ltr" align="left">

```ts
import { SamanDesk } from 'samandesk'

const support = new SamanDesk()
function handleReady() {
  support.open()
}
window.addEventListener('ready', handleReady)

await support.init(
  {
    language: 'fa',
    theme: { darkMode: 'light', color: 'teal' },
    fullScreen: true,
    style: { marginTop: 64, marginBottom: 16 },
  },
  'VERIFIED_TOKEN_FROM_YOUR_SERVICE',
)
```

</div>

<div dir="rtl" align="right">

### ‏بعد — نسخهٔ فعلی

‏وابستگی را با دستور نصب ابتدای سند به‌روزرسانی و کد بالا را با نمونهٔ زیر جایگزین کنید. ⁦listener⁩ قدیمی ⁦<code dir="ltr">ready</code>⁩ و سایر ⁦listener⁩های متعلق به ادغام قبلی را از کد میزبان حذف کنید؛ نسخهٔ جدید این رویدادها را روی ⁦<code dir="ltr">window</code>⁩ منتشر نمی‌کند.

</div>

<div dir="ltr" align="left">

```ts
import { createSamanDeskWeb } from 'samandesk'

const support = createSamanDeskWeb(
  {
    verifiedToken: 'VERIFIED_TOKEN_FROM_YOUR_SERVICE',
    language: 'fa',
    theme: { darkMode: 'light', color: 'teal' },
    onReady: () => support.open(),
    linkHandler: (link) => {
      const url = new URL(link)
      if (['https:', 'http:'].includes(url.protocol)) {
        window.open(url.href, '_blank', 'noopener,noreferrer')
      }
    },
  },
  {
    fullScreen: true,
    style: { marginTop: 64, marginBottom: 16 },
  },
)

// Call from the component's unmount hook:
// support.destroy()
```

</div>

<div dir="rtl" align="right">

‏ساخت نمونهٔ جدید همگام است و متد ⁦<code dir="ltr">init()</code>⁩ یا ⁦Promise⁩ راه‌اندازی ندارد؛ برای آماده‌شدن نشست منتظر ⁦<code dir="ltr">onReady</code>⁩ بمانید. برای ورود مهمان، ⁦<code dir="ltr">verifiedToken</code>⁩ را حذف و ⁦<code dir="ltr">workspaceID</code>⁩ را تنظیم کنید. فرم ورود بلافاصله نمایش داده می‌شود؛ پس از دریافت توکن می‌توانید ⁦<code dir="ltr">open()</code>⁩ را صدا بزنید. اجرای ⁦<code dir="ltr">onGuestReady</code>⁩ به معنی ورود موفق نیست.

‏در ⁦Vue / Nuxt⁩ ساخت نمونه را به ⁦<code dir="ltr">onMounted</code>⁩ و پاکسازی را به ⁦<code dir="ltr">onBeforeUnmount</code>⁩ منتقل کنید. در ⁦React / Next.js⁩ این کارها در ⁦<code dir="ltr">useEffect</code>⁩ و تابع ⁦cleanup⁩ آن انجام می‌شوند؛ نمونه‌های کامل در بخش وب آمده‌اند. هر نمونه باید هنگام پایان عمرش با ⁦<code dir="ltr">destroy()</code>⁩ پاکسازی شود.

‏پیام بستن داخل رابط، آداپتر را می‌بندد و رویداد بستن فقط هنگام تغییر وضعیت اجرا می‌شود. برای ⁦React Native⁩، وضعیت، کلید و رویدادهای بارگذاری را مطابق نمونهٔ ⁦WebView⁩ متصل کنید؛ آداپتر خودش نمای بومی را ایجاد یا حذف نمی‌کند.

<a id="development"></a>

## ‏توسعه و انتشار کتابخانه

‏این مخزن مستقل، سورس پکیج ⁦<code dir="ltr">samandesk</code>⁩ را نگهداری می‌کند. دستورات زیر را از ریشهٔ همین مخزن اجرا کنید. مدیریت وابستگی‌ها با ⁦Bun 1.4.2⁩ و ساخت با ⁦tsdown⁩ انجام می‌شود. ابزار ساخت به ⁦Node.js⁩ با نسخهٔ ⁦<code dir="ltr">^22.18.0 || ^24.11.0 || >=26.0.0</code>⁩ نیاز دارد؛ این پیش‌نیاز مربوط به محیط توسعه و انتشار است.

</div>

<div dir="ltr" align="left">

```bash
bun install --frozen-lockfile
bun run start
```

</div>

<div dir="rtl" align="right">

‏دستور ⁦<code dir="ltr">bun run start</code>⁩ پکیج را با ⁦<code dir="ltr">bun link</code>⁩ ثبت و تغییرات سورس را با ⁦tsdown⁩ در ⁦<code dir="ltr">dist/</code>⁩ بازسازی می‌کند. در پروژهٔ مصرف‌کننده اجرا کنید:

</div>

<div dir="ltr" align="left">

```bash
bun link samandesk
```

</div>

<div dir="rtl" align="right">

‏فایل ⁦<code dir="ltr">bun.lock</code>⁩ باید همراه تغییرات وابستگی‌ها ثبت شود. خروجی ⁦ESM⁩ در ⁦<code dir="ltr">dist/saman-desk.js</code>⁩، خروجی ⁦UMD⁩ با نام سراسری ⁦<code dir="ltr">SamanDesk</code>⁩ در ⁦<code dir="ltr">dist/saman-desk.umd.cjs</code>⁩ و اعلان‌های ⁦TypeScript⁩ در ⁦<code dir="ltr">dist/saman-desk.d.ts</code>⁩ تولید می‌شوند. پوشهٔ خروجی پیش از ساخت پاکسازی می‌شود.

‏وب‌اپ سامان دسک جداگانه اجرا می‌شود. برای اتصال به نسخهٔ محلی، آدرس وب‌اپ را صریحاً در ⁦<code dir="ltr">siteUrl</code>⁩ تنظیم کنید؛ حالت توسعه آدرس پیش‌فرض سرور عمومی را تغییر نمی‌دهد.

‏پالت رنگ‌ها در ⁦<code dir="ltr">library-colors.ts</code>⁩ بخشی از قرارداد تم با وب‌اپ است؛ تغییر نام یا مقدار رنگ‌ها باید با فایل متناظر وب‌اپ هماهنگ شود.

### ‏مستندات و انتشار

‏این ⁦README⁩ تنها مرجع مصرف‌کنندگان و راهنمای مهاجرت است و همراه بسته منتشر می‌شود. هنگام تغییر رفتار عمومی، نمونه‌ها و راهنمای مهاجرت همین فایل را با کد همان نسخه هماهنگ کنید؛ برای هر نسخه ⁦README⁩ جدا نسازید. شمارهٔ نسخه در دستورهای نصب و نمونه‌های ⁦CDN⁩ را نیز به‌روزرسانی کنید.

‏برای انتشار، نسخه‌ای جدید و استفاده‌نشده در ⁦<code dir="ltr">package.json</code>⁩ قرار دهید و خروجی را از ریشهٔ همین مخزن بسازید:

</div>

<div dir="ltr" align="left">

```bash
bun run build

# Stable release
bun publish --tag latest

# Beta release
bun publish --tag beta
```

</div>

<div dir="rtl" align="right">

‏دستور ⁦<code dir="ltr">bun publish</code>⁩ پیش از انتشار از طریق ⁦<code dir="ltr">prepublishOnly</code>⁩ خروجی را دوباره می‌سازد؛ نصب وابستگی‌ها ساخت را اجرا نمی‌کند. فقط دستور انتشار متناسب با نسخه را اجرا کنید؛ نسخهٔ بتا باید با تگ ⁦<code dir="ltr">beta</code>⁩ منتشر شود. نسخهٔ فعلی مشخصات پکیج همچنان ⁦<code dir="ltr">2.0.0-beta2.0</code>⁩ است و برای انتشار تغییرات فعلی باید افزایش یابد.

‏این مخزن عمومی است. توکن واقعی، اطلاعات مشتریان و تنظیمات رجیستری خصوصی را در سورس یا نمونه‌ها قرار ندهید. نمونه‌های ورود از مقدارهای جایگزین استفاده می‌کنند. فایل‌های محیطی، تنظیمات محلی رجیستری، کلیدها و خروجی ساخت در ⁦<code dir="ltr">.gitignore</code>⁩ مستثنا شده‌اند؛ فایل‌های قابل انتشار نیز در ⁦<code dir="ltr">package.json</code>⁩ محدود شده‌اند.

## ‏مجوز

‏مقدار ⁦<code dir="ltr">license</code>⁩ در مشخصات پکیج: ⁦<code dir="ltr">MIT</code>⁩.

</div>
