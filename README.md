<div dir="rtl" align="right">

# ‏راهنمای استفاده از سامان دسک

‏پکیج ⁦`samandesk`⁩ بخش پشتیبانی سامان دسک را به وب‌سایت یا اپلیکیشن شما اضافه می‌کند. کاربر می‌تواند به‌عنوان مهمان وارد شود یا با توکنی که سرویس شما در اختیار برنامه قرار می‌دهد، به حساب خود متصل شود.

‏برای وب از ⁦`createSamanDeskWeb`⁩ و برای ⁦React Native⁩ از ⁦`createSamanDeskReactNative`⁩ استفاده کنید. این راهنما روش استفاده از نسخهٔ ۲ کتابخانه را توضیح می‌دهد.

## ‏فهرست مطالب

- ‏[نصب و پیش‌نیازها](#installation)
- ‏[شروع سریع در وب](#quick-start)
- ‏[ورود با حساب کاربر](#token-login)
- ‏[باز و بسته‌کردن چت](#web)
- ‏[تنظیمات، ظاهر و رویدادها](#configuration)
- ‏[استفاده در ⁦Vue / Nuxt⁩](#vue)
- ‏[استفاده در ⁦React / Next.js⁩](#react)
- ‏[استفاده در صفحهٔ ⁦HTML⁩](#html)
- ‏[استفاده در ⁦React Native⁩](#react-native)
- ‏[مدیریت خطا و تلاش دوباره](#errors)
- ‏[بازکردن چت در پنجرهٔ جدا](#popup)
- ‏[نوع‌های ⁦TypeScript⁩](#types)
- ‏[مهاجرت از نسخهٔ ۱](#migration)

<a id="installation"></a>

## ‏نصب و پیش‌نیازها

‏برای نصب نسخهٔ بتا، یکی از دستورهای زیر را اجرا کنید:

</div>

<div dir="ltr" align="left">

~~~bash
# Bun
bun add samandesk@beta

# npm
npm install samandesk@beta
~~~

</div>

<div dir="rtl" align="right">

‏پیش از راه‌اندازی، روش ورود را انتخاب کنید:

| ‏روش ورود | ‏چه چیزی لازم دارید؟ | ‏کاربر چه می‌بیند؟ |
| --- | --- | --- |
| ‏ورود مهمان | ‏شناسهٔ محیط کاری در ⁦`workspaceID`⁩ | ‏فرم ورود سامان دسک؛ کاربر مراحل ورود را در همان فرم انجام می‌دهد. |
| ‏ورود با حساب کاربر | ‏توکن معتبر در ⁦`verifiedToken`⁩ | ‏ورود با توکنی که سرویس شما در اختیار برنامه قرار داده است. |

‏کتابخانه توکن ورود تولید نمی‌کند. برای ورود با حساب کاربر، ابتدا توکن معتبر را از سرویس مربوط به پروژهٔ خود دریافت کنید.

‏برای نمایش چت، دسترسی به سرور سامان دسک لازم است. در وب، نمونه را فقط در مرورگر و بعد از آماده‌شدن بدنهٔ صفحه بسازید؛ مثال‌های ⁦Vue⁩ و ⁦React⁩ در ادامه محل مناسب این کار را نشان می‌دهند. در ⁦React Native⁩ نیز باید پکیج ⁦`react-native-webview`⁩ را جداگانه نصب و راه‌اندازی کنید.

<a id="quick-start"></a>

## ‏شروع سریع در وب

‏این مثال برای پروژه‌ای است که از ⁦`import`⁩ استفاده می‌کند. مقدار ⁦`YOUR_WORKSPACE_ID`⁩ را با شناسهٔ محیط کاری خود جایگزین کنید:

</div>

<div dir="ltr" align="left">

~~~js
import { createSamanDeskWeb } from 'samandesk'

const support = createSamanDeskWeb({
  workspaceID: 'YOUR_WORKSPACE_ID',
  onError: (error) => console.error(error),
})

support.open()
~~~

</div>

<div dir="rtl" align="right">

‏در حالت معمول وب، ساخت نمونهٔ مهمان، فرم ورود را بلافاصله نمایش می‌دهد. دستور ⁦`open()`⁩ در مثال بالا باعث می‌شود پس از تکمیل ورود و دریافت توکن نشست، صفحهٔ انتخاب دپارتمان هم باز شود. لازم نیست پیش از این دستور منتظر پایان ورود بمانید؛ کتابخانه آخرین درخواست بازکردن را نگه می‌دارد.

‏برای بازکردن دوبارهٔ چت، همان ⁦`support.open()`⁩ را صدا بزنید. برای بستن از ⁦`support.close()`⁩ استفاده کنید. هر بار نمونهٔ جدید نسازید؛ تا زمانی که صفحه یا کامپوننت به پشتیبانی نیاز دارد، همان نمونه را نگه دارید و در پایان استفاده، ⁦`support.destroy()`⁩ را فراخوانی کنید.

<a id="token-login"></a>

## ‏ورود با حساب کاربر

‏اگر توکن ورود کاربر را از سرویس خود دریافت کرده‌اید، آن را در ⁦`verifiedToken`⁩ قرار دهید:

</div>

<div dir="ltr" align="left">

~~~js
import { createSamanDeskWeb } from 'samandesk'

const support = createSamanDeskWeb({
  verifiedToken: 'VERIFIED_TOKEN_FROM_YOUR_SERVICE',
  onError: (error) => console.error(error),
})

support.open()
~~~

</div>

<div dir="rtl" align="right">

‏ورود در پس‌زمینه شروع می‌شود و چت پس از دریافت توکن نشست نمایش داده می‌شود. اگر نمی‌خواهید چت خودکار باز شود، دستور آخر را حذف کنید و ⁦`open()`⁩ را به دکمهٔ پشتیبانی متصل کنید.

‏اگر هر دو مقدار ⁦`workspaceID`⁩ و ⁦`verifiedToken`⁩ را بدهید، ورود با توکن انجام می‌شود. تنظیمی را که به آن نیاز ندارید، حذف کنید؛ مقدار خالی یا رشته‌های ⁦`'undefined'`⁩ و ⁦`'null'`⁩ پذیرفته نمی‌شوند.

‏توکنی که از ⁦`onReady`⁩ یا ⁦`onTokenChange`⁩ می‌گیرید، **توکن نشست سامان دسک** است و الزاماً با ⁦`verifiedToken`⁩ ورودی یکی نیست. آن را برای ساخت نمونهٔ جدید جایگزین توکن ورود نکنید، مگر سرویس شما صریحاً این کاربرد را پشتیبانی کند.

‏اگر توکن ورود منقضی شده یا یک‌بارمصرف بوده و مصرف شده است، از سرویس خود توکن تازه بگیرید، نمونهٔ قبلی را با ⁦`destroy()`⁩ کنار بگذارید و نمونهٔ جدید بسازید. کتابخانه متدی برای تعویض توکن روی نمونهٔ موجود ندارد.

<a id="web"></a>

## ‏باز و بسته‌کردن چت

‏تابع ⁦`createSamanDeskWeb(config, options?)`⁩ یک شیء با متدهای زیر برمی‌گرداند. ساخت نمونه و فراخوانی این متدها به ⁦`await`⁩ نیاز ندارد؛ پایان ورود را از طریق ⁦`onReady`⁩ دنبال کنید.

| ‏متد | ‏کاربرد |
| --- | --- |
| ‏⁦`open(link?)`⁩ | ‏چت را باز می‌کند. اگر ورود تمام نشده باشد، آخرین درخواست تا دریافت توکن نگه داشته می‌شود. |
| ‏⁦`openPopup(link?)`⁩ | ‏ورود و چت را در پنجرهٔ جدا باز می‌کند. آن را مستقیماً از رویداد کلیک کاربر صدا بزنید. |
| ‏⁦`close()`⁩ | ‏چت را مخفی می‌کند؛ اگر چت در پنجرهٔ جدا باشد، پنجره بسته می‌شود. درخواست بازکردنِ در انتظار هم لغو می‌شود. |
| ‏⁦`retry()`⁩ | ‏ورود را با همان تنظیمات و همان توکن ورودی از نو شروع می‌کند. در حالت پنجرهٔ جدا، به کلیک کاربر نیاز دارد. |
| ‏⁦`destroy()`⁩ | ‏نمونه را می‌بندد و منابع آن را آزاد می‌کند. پس از آن، برای استفادهٔ دوباره باید نمونهٔ جدید بسازید. |

‏⁦`close()`⁩ به معنی خروج از حساب نیست. در حالت نمایش داخل صفحه، بستن چت، ورودِ در حال انجام را هم متوقف نمی‌کند. ⁦`destroy()`⁩ نمونه را حذف می‌کند، اما کاربر را از حساب ذخیره‌شدهٔ خود سامان دسک خارج نمی‌کند.

‏فراخوانی چندبارهٔ ⁦`close()`⁩ و ⁦`destroy()`⁩ مجاز است. فراخوانی ⁦`open()`⁩، ⁦`openPopup()`⁩ یا ⁦`retry()`⁩ پس از ⁦`destroy()`⁩ خطای ⁦`DESTROYED`⁩ می‌دهد.

### ‏بازکردن یک مسیر مشخص

‏بدون آرگومان، ⁦`open()`⁩ صفحهٔ انتخاب دپارتمان را با توکن نشست باز می‌کند. اگر لینک مشخصی از سامان دسک دارید، می‌توانید آن را به ⁦`open(link)`⁩ بدهید. لینک باید متعلق به همان مبدأِ ⁦`siteUrl`⁩ باشد؛ یعنی پروتکل، دامنه و پورت آن یکسان باشد. مسیر نسبی نیز پذیرفته می‌شود.

‏⁦`open(link)`⁩ برای بازکردن سایت‌های دیگر نیست. برای لینک‌های بیرونی که از داخل چت درخواست می‌شوند، ⁦`linkHandler`⁩ را تنظیم کنید.

‏بازکردن دوبارهٔ همان مقصد در چتی که هنوز باز است، صفحه را دوباره بارگذاری نمی‌کند.

<a id="configuration"></a>

## ‏تنظیمات، ظاهر و رویدادها

‏آرگومان اول هر دو تابع وب و ⁦React Native⁩ تنظیمات مشترک است:

| ‏گزینه | ‏پیش‌فرض | ‏توضیح |
| --- | --- | --- |
| ‏⁦`workspaceID`⁩ | ‏ندارد | ‏شناسهٔ محیط کاری برای ورود مهمان. |
| ‏⁦`verifiedToken`⁩ | ‏ندارد | ‏توکن ورود دریافت‌شده از سرویس شما. |
| ‏⁦`siteUrl`⁩ | ‏⁦`https://samandesk.com`⁩ | ‏آدرس وب‌اپ سامان دسک؛ فقط اگر از آدرس دیگری استفاده می‌کنید، آن را تغییر دهید. |
| ‏⁦`language`⁩ | ‏⁦`fa`⁩ | ‏زبان درخواستی رابط؛ نمایش آن به زبان‌های پشتیبانی‌شده در وب‌اپ بستگی دارد. |
| ‏⁦`theme.darkMode`⁩ | ‏⁦`light`⁩ | ‏یکی از دو مقدار ⁦`light`⁩ یا ⁦`dark`⁩. |
| ‏⁦`theme.color`⁩ | ‏⁦`default`⁩ | ‏نام یکی از رنگ‌های پشتیبانی‌شده. |
| ‏⁦`handshakeTimeoutMs`⁩ | ‏⁦`30000`⁩ | ‏مهلت راه‌اندازی به میلی‌ثانیه؛ باید عددی مثبت و حداکثر ⁦`2147483647`⁩ باشد. |
| ‏⁦`linkHandler`⁩ | ‏ندارد | ‏تابعی که تصمیم می‌گیرد لینک درخواست‌شده از داخل چت چگونه باز شود. |

‏مهلت راه‌اندازی در ورود با توکن، زمان انتظار برای دریافت توکن نشست است. در ورود مهمان، تا آماده‌شدن فرم ورود اعمال می‌شود؛ زمان کاربر برای پرکردن فرم و تکمیل ورود را محدود نمی‌کند.

‏⁦`siteUrl`⁩ باید یک آدرس کامل با پروتکل ⁦`http`⁩ یا ⁦`https`⁩ باشد. آدرس می‌تواند مسیر پایه داشته باشد، اما نباید شامل نام کاربری، رمز عبور، ⁦query string⁩ یا بخش ⁦`#fragment`⁩ باشد. آدرس نهایی بعد از تغییر مسیرِ سرور هم باید با مبدأ تنظیم‌شده سازگار بماند.

### ‏انتخاب ظاهر

</div>

<div dir="ltr" align="left">

~~~js
const support = createSamanDeskWeb({
  workspaceID: 'YOUR_WORKSPACE_ID',
  language: 'fa',
  theme: {
    darkMode: 'dark',
    color: 'teal',
  },
})
~~~

</div>

<div dir="rtl" align="right">

‏برای رنگ، یکی از نام‌های زیر را بدهید. واردکردن کد رنگ دلخواه مانند ⁦`#30B0C7`⁩ پشتیبانی نمی‌شود.

</div>

<div dir="ltr" align="left">

~~~text
default, blue, red, darkGreen, orange, green, teal, absolute, pink,
darkTeal, mint, darkPurple, dodgerBlue, darkGold, purple, brown, ferra
~~~

</div>

<div dir="rtl" align="right">

‏برای تغییر تنظیمات پس از راه‌اندازی، نمونهٔ قبلی را حذف و نمونهٔ جدید بسازید؛ متدی برای تغییر زندهٔ تم، زبان یا اطلاعات ورود وجود ندارد.

### ‏اندازه و محل نمایش در وب

‏تنظیمات نمایش را در آرگومان دوم ⁦`createSamanDeskWeb`⁩ بدهید:

</div>

<div dir="ltr" align="left">

~~~js
const support = createSamanDeskWeb(
  { workspaceID: 'YOUR_WORKSPACE_ID' },
  {
    fullScreen: true,
    style: {
      marginTop: 64,
      marginBottom: 16,
    },
  },
)
~~~

</div>

<div dir="rtl" align="right">

| ‏گزینه | ‏کاربرد |
| --- | --- |
| ‏⁦`fullScreen`⁩ | ‏با مقدار ⁦`true`⁩ چت تمام‌صفحه می‌شود. پیش‌فرض ⁦`false`⁩ است. |
| ‏⁦`style.marginTop`⁩ و ⁦`style.marginBottom`⁩ | ‏فاصله از بالا و پایین، به پیکسل؛ فقط در حالت تمام‌صفحه. |
| ‏⁦`style.width`⁩ و ⁦`style.height`⁩ | ‏اندازه با مقدار معتبر ⁦CSS⁩؛ فقط در حالت نمایش وسط صفحه. عرض حداکثر ⁦`500px`⁩ و ارتفاع حداکثر ⁦`660px`⁩ است. مقدار پیش‌فرض هر دو ⁦`100%`⁩ است. |
| ‏⁦`mode`⁩ | ‏یکی از ⁦`auto`⁩، ⁦`iframe`⁩ یا ⁦`popup`⁩؛ پیش‌فرض ⁦`auto`⁩ است. توضیح این گزینه در [بخش پنجرهٔ جدا](#popup) آمده است. |

‏در حالت معمول، چت وسط صفحه و روی یک پس‌زمینهٔ تیره نمایش داده می‌شود؛ کلیک روی پس‌زمینه آن را می‌بندد. تنظیمات اندازه و تمام‌صفحهٔ بالا برای نمایش داخل صفحه‌اند و اندازهٔ پنجرهٔ جدا را تغییر نمی‌دهند.

### ‏اطلاع از وضعیت چت

‏این توابع را در همان آرگومان اول قرار دهید:

| ‏تابع | ‏چه زمانی اجرا می‌شود؟ |
| --- | --- |
| ‏⁦`onReady(sessionToken)`⁩ | ‏وقتی توکن نشست معتبر دریافت شده و می‌توان چت را باز کرد. با دریافت توکن جدید ممکن است دوباره اجرا شود. |
| ‏⁦`onTokenChange(sessionToken)`⁩ | ‏پس از ⁦`onReady`⁩، هم برای اولین توکن نشست و هم برای توکن‌های جدید. |
| ‏⁦`onGuestReady()`⁩ | ‏وقتی فرم ورود مهمان آماده شده است؛ این رویداد به معنی ورود موفق نیست. |
| ‏⁦`onOpen()`⁩ | ‏وقتی چت نمایش داده می‌شود؛ به معنی پایان بارگذاری نیست. در وب، نمایش اولیهٔ فرم مهمان هم می‌تواند هنگام ساخت نمونه این تابع را اجرا کند. |
| ‏⁦`onClose()`⁩ | ‏وقتی چتِ نمایان با عملیات بستن مخفی می‌شود؛ بستن دوبارهٔ چتِ مخفی آن را تکرار نمی‌کند. |
| ‏⁦`onError(error)`⁩ | ‏وقتی مشکلی در ورود، بارگذاری یا اجرای توابعی که شما داده‌اید رخ می‌دهد. خطاهای ورودی نامعتبر را جداگانه با ⁦`try/catch`⁩ بگیرید. |

‏دریافت دوبارهٔ همان توکن نشست، ⁦`onReady`⁩ و ⁦`onTokenChange`⁩ را تکرار نمی‌کند. اگر در ⁦`onReady`⁩ نمونه را حذف کنید یا ورود را از نو شروع کنید، نباید انتظار اجرای ⁦`onTokenChange`⁩ برای همان تلاش قبلی را داشته باشید.

‏در ⁦React Native⁩، نمایان‌بودن اولیهٔ فرم مهمان به‌تنهایی باعث اجرای ⁦`onOpen`⁩ نمی‌شود؛ برای نمایش اولیه از ⁦`getState()`⁩ استفاده کنید.

### ‏بازکردن لینک‌های داخل چت

‏اگر کاربر از داخل چت درخواست بازکردن لینکی را بدهد، آن لینک به ⁦`linkHandler`⁩ تحویل داده می‌شود. بدون این تابع، کتابخانه لینک را باز نمی‌کند. برای نمونه، در وب می‌توانید فقط لینک‌های وب را بپذیرید:

</div>

<div dir="ltr" align="left">

~~~js
const support = createSamanDeskWeb({
  workspaceID: 'YOUR_WORKSPACE_ID',
  linkHandler: (link) => {
    try {
      const url = new URL(link)
      if (url.protocol === 'https:' || url.protocol === 'http:') {
        window.open(url.href, '_blank', 'noopener,noreferrer')
      }
    } catch {
      console.error('Invalid support link')
    }
  },
})
~~~

</div>

<div dir="rtl" align="right">

<a id="vue"></a>

## ‏استفاده در ⁦Vue / Nuxt⁩

‏نمونه را در ⁦`onMounted`⁩ بسازید و هنگام حذف کامپوننت، آن را پاک کنید. در این مثال، فرم مهمان ابتدا نمایش داده می‌شود و پس از ورود، چت باز می‌شود:

</div>

<div dir="ltr" align="left">

~~~vue
<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef } from 'vue'
import { createSamanDeskWeb } from 'samandesk'

const support = shallowRef<ReturnType<typeof createSamanDeskWeb>>()

onMounted(() => {
  support.value = createSamanDeskWeb({
    workspaceID: 'YOUR_WORKSPACE_ID',
    onError: (error) => console.error(error),
  })
  support.value.open()
})

onBeforeUnmount(() => support.value?.destroy())
</script>

<template>
  <button @click="support?.open()">پشتیبانی</button>
  <button @click="support?.close()">بستن</button>
</template>
~~~

</div>

<div dir="rtl" align="right">

‏همین الگو برای ⁦Nuxt⁩ هم مناسب است؛ ساخت نمونه داخل ⁦`onMounted`⁩ باعث می‌شود دسترسی به صفحه در مرورگر انجام شود.

<a id="react"></a>

## ‏استفاده در ⁦React / Next.js⁩

‏نمونه را در ⁦`useEffect`⁩ بسازید، در ⁦`ref`⁩ نگه دارید و در تابع پاکسازی همان ⁦effect⁩ حذف کنید. در ⁦Next.js App Router⁩ این کامپوننت باید ⁦`'use client'`⁩ داشته باشد.

</div>

<div dir="ltr" align="left">

~~~tsx
'use client'

import { useEffect, useRef } from 'react'
import { createSamanDeskWeb } from 'samandesk'

type Support = ReturnType<typeof createSamanDeskWeb>

export function SupportWidget() {
  const supportRef = useRef<Support | null>(null)

  useEffect(() => {
    const support = createSamanDeskWeb({
      workspaceID: 'YOUR_WORKSPACE_ID',
      onError: (error) => console.error(error),
    })

    supportRef.current = support
    support.open()

    return () => {
      support.destroy()
      supportRef.current = null
    }
  }, [])

  return (
    <div>
      <button onClick={() => supportRef.current?.open()}>پشتیبانی</button>
      <button onClick={() => supportRef.current?.close()}>بستن</button>
    </div>
  )
}
~~~

</div>

<div dir="rtl" align="right">

‏اگر ورود باید با حساب کاربر انجام شود، ابتدا توکن را دریافت کنید و سپس نمونه را با ⁦`verifiedToken`⁩ بسازید. تغییر کاربر یا توکن نیاز به حذف نمونهٔ قبلی و ساخت نمونهٔ جدید دارد؛ وابستگی‌های ⁦`useEffect`⁩ را متناسب با این تغییرات تنظیم کنید.

<a id="html"></a>

## ‏استفاده در صفحهٔ ⁦HTML⁩

‏اگر پروژهٔ شما ابزار مدیریت ماژول ندارد، فایل ⁦`dist/saman-desk.js`⁩ را از نسخهٔ نصب‌شدهٔ پکیج در یک مسیر عمومی سایت، مثلاً ⁦`/vendor/saman-desk.js`⁩، قرار دهید. سپس این کد را در انتهای ⁦`body`⁩ بنویسید:

</div>

<div dir="ltr" align="left">

~~~html
<button id="support-button">پشتیبانی</button>

<script type="module">
  import { createSamanDeskWeb } from '/vendor/saman-desk.js'

  const support = createSamanDeskWeb({
    workspaceID: 'YOUR_WORKSPACE_ID',
    onError: (error) => console.error(error),
  })

  support.open()

  document.getElementById('support-button').addEventListener('click', () => {
    support.open()
  })
</script>
~~~

</div>

<div dir="rtl" align="right">

‏در صورت استفاده از ⁦CDN⁩، همین فایل را با شمارهٔ نسخهٔ مشخص بارگذاری کنید تا با انتشار نسخه‌های بعدی، رفتار برنامهٔ شما ناخواسته تغییر نکند.

‏اگر از خروجی ⁦`dist/saman-desk.umd.cjs`⁩ در تگ معمولی ⁦`script`⁩ استفاده می‌کنید، توابع زیر نام سراسری ⁦`SamanDesk`⁩ قرار می‌گیرند؛ برای نمونه، ⁦`SamanDesk.createSamanDeskWeb(...)`⁩.

<a id="react-native"></a>

## ‏استفاده در ⁦React Native⁩

‏در ⁦React Native⁩، نمایش و نگهداری ⁦WebView⁩ با برنامهٔ شماست. تابع ⁦`createSamanDeskReactNative`⁩ وضعیت موردنیاز آن را می‌دهد و متدهای بازکردن، بستن و تلاش دوباره را در اختیارتان می‌گذارد.

‏پس از [نصب و راه‌اندازی ⁦react-native-webview⁩](https://github.com/react-native-webview/react-native-webview/blob/master/docs/Getting-Started.md)، دو گزینهٔ زیر را در آرگومان دوم بدهید:

| ‏گزینه | ‏کاربرد |
| --- | --- |
| ‏⁦`onStateChange(state)`⁩ | ‏دریافت وضعیت جدید نمایش و آدرس. هنگام ساخت نمونه اجرا نمی‌شود؛ وضعیت اولیه را با ⁦`getState()`⁩ بخوانید. |
| ‏⁦`injectJavaScript(script)`⁩ | ‏کد دریافت‌شده را با متد هم‌نام روی ⁦WebView⁩ اجرا کنید. |

‏نمونهٔ زیر ورود مهمان و بازشدن چت پس از ورود را نشان می‌دهد:

</div>

<div dir="ltr" align="left">

~~~tsx
import { useEffect, useRef, useState } from 'react'
import { Button, Linking, Text, View } from 'react-native'
import { WebView } from 'react-native-webview'
import { createSamanDeskReactNative } from 'samandesk'

type Support = ReturnType<typeof createSamanDeskReactNative>
type SupportState = ReturnType<Support['getState']>

export function SupportChat() {
  const webViewRef = useRef<WebView>(null)
  const supportRef = useRef<Support | null>(null)
  const [state, setState] = useState<SupportState | null>(null)
  const [errorText, setErrorText] = useState('')

  useEffect(() => {
    setErrorText('')

    const support = createSamanDeskReactNative(
      {
        workspaceID: 'YOUR_WORKSPACE_ID',
        onReady: () => supportRef.current?.open(),
        onError: () => setErrorText('اتصال به پشتیبانی برقرار نشد.'),
        linkHandler: (link) => {
          if (/^https?:\/\//i.test(link)) {
            void Linking.openURL(link).catch(() => {
              setErrorText('بازکردن لینک ممکن نشد.')
            })
          }
        },
      },
      {
        onStateChange: setState,
        injectJavaScript: (script) => {
          webViewRef.current?.injectJavaScript(script)
        },
      },
    )

    supportRef.current = support
    setState(support.getState())

    return () => {
      support.destroy()
      supportRef.current = null
    }
  }, [])

  const support = supportRef.current
  const webViewProps = support?.getWebViewProps()

  return (
    <View style={{ flex: 1 }}>
      <Button title="پشتیبانی" onPress={() => support?.open()} />
      <Button title="بستن" onPress={() => support?.close()} />
      {errorText ? <Text>{errorText}</Text> : null}

      {state && webViewProps && (
        <View
          pointerEvents={state.visible ? 'auto' : 'none'}
          style={state.visible ? { flex: 1 } : { width: 1, height: 1, opacity: 0 }}
        >
          <WebView
            key={webViewProps.key}
            ref={webViewRef}
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
~~~

</div>

<div dir="rtl" align="right">

‏در این اتصال، چند نکته را رعایت کنید:

- ‏⁦`source`⁩ را از وضعیت کتابخانه بگیرید و همهٔ مقادیر برگشتی ⁦`getWebViewProps()`⁩ را مطابق مثال متصل کنید.
- ‏وقتی ⁦`visible`⁩ برابر ⁦`false`⁩ است، ⁦WebView⁩ را از صفحه حذف نکنید؛ فقط آن را مخفی کنید تا ورود بتواند ادامه پیدا کند.
- ‏پس از ⁦`retry()`⁩، ⁦`getWebViewProps()`⁩ را دوباره بخوانید و مقدار تازهٔ ⁦`key`⁩ را اعمال کنید.
- ‏نمونه و ⁦WebView⁩ را نزدیک به هم ایجاد کنید؛ مهلت راه‌اندازی از زمان ساخت نمونه شروع می‌شود.

‏در ورود مهمان، وضعیت اولیه نمایان است. در ورود با ⁦`verifiedToken`⁩، وضعیت اولیه مخفی است و باید ⁦WebView⁩ همچنان بارگذاری شود. پس از آماده‌شدن نشست، با ⁦`open()`⁩ آن را نمایش دهید؛ در مثال بالا، ⁦`onReady`⁩ این کار را انجام می‌دهد.

| ‏متد | ‏کاربرد |
| --- | --- |
| ‏⁦`getState()`⁩ | ‏دریافت ⁦`{ source: { uri }, visible }`⁩؛ برای وضعیت اولیه هم از همین متد استفاده کنید. |
| ‏⁦`getWebViewProps()`⁩ | ‏دریافت ⁦`key`⁩ و رویدادهای لازم برای اتصال ⁦WebView⁩. |
| ‏⁦`open(link?)`⁩ | ‏نمایش چت پس از آماده‌شدن نشست؛ درخواست زودهنگام نگه داشته می‌شود. |
| ‏⁦`close()`⁩ | ‏مخفی‌کردن چت و لغو درخواست بازکردنِ در انتظار؛ صفحهٔ فعلی حفظ می‌شود. |
| ‏⁦`retry()`⁩ | ‏شروع دوبارهٔ ورود با همان تنظیمات. برای توکن تازه، نمونهٔ تازه بسازید. |
| ‏⁦`destroy()`⁩ | ‏پایان استفاده از نمونه و مخفی‌کردن آن؛ حذف ⁦WebView⁩ از رابط برنامه با شماست. |

<a id="errors"></a>

## ‏مدیریت خطا و تلاش دوباره

‏دو نوع خطا را جداگانه مدیریت کنید: خطاهایی مثل شناسهٔ خالی یا آدرس نامعتبر، همان لحظهٔ فراخوانی رخ می‌دهند و با ⁦`try/catch`⁩ گرفته می‌شوند. خطاهای ورود و بارگذاری از طریق ⁦`onError`⁩ اعلام می‌شوند. اگر ⁦`onError`⁩ تعریف نکنید، کتابخانه خطا را در کنسول ثبت می‌کند.

</div>

<div dir="ltr" align="left">

~~~ts
import { createSamanDeskWeb, SamanDeskError } from 'samandesk'

let support: ReturnType<typeof createSamanDeskWeb> | undefined

try {
  support = createSamanDeskWeb({
    workspaceID: 'YOUR_WORKSPACE_ID',
    onError: (error) => {
      if (error instanceof SamanDeskError) {
        console.error(error.code, error.message)
      }
    },
  })
  support.open()
} catch (error) {
  console.error('Could not create the support widget:', error)
}
~~~

</div>

<div dir="rtl" align="right">

‏برای نمایش پیام مناسب به کاربر، از ⁦`error.code`⁩ استفاده کنید:

| ‏کد | ‏معنی و اقدام پیشنهادی |
| --- | --- |
| ‏⁦`INVALID_CONFIG`⁩ | ‏تنظیمات معتبر نیست یا نمونهٔ وب پیش از آماده‌شدن صفحه ساخته شده است. ورودی‌ها و محل ساخت نمونه را اصلاح کنید. |
| ‏⁦`INVALID_LINK`⁩ | ‏لینک به مبدأ سامان دسکِ تنظیم‌شده تعلق ندارد یا معتبر نیست. لینک بیرونی را از طریق ⁦`linkHandler`⁩ مدیریت کنید. |
| ‏⁦`HANDSHAKE_TIMEOUT`⁩ | ‏راه‌اندازی در مهلت تعیین‌شده کامل نشده است. اتصال شبکه، توکن و امکان نمایش چت داخل صفحه را بررسی کنید. |
| ‏⁦`AUTHENTICATION_FAILED`⁩ | ‏سامان دسک خطای ورود اعلام کرده است. اعتبار توکن را بررسی و در صورت نیاز توکن تازه دریافت کنید. |
| ‏⁦`INVALID_MESSAGE`⁩ | ‏توکن نشست معتبر دریافت نشده است؛ ممکن است اتصال به نسخهٔ وب‌اپ نیاز به بررسی داشته باشد. |
| ‏⁦`LOAD_FAILED`⁩ | ‏بارگذاری یا ادامهٔ اتصال ممکن نشده است. در وب، گزینهٔ پنجرهٔ جدا را هم در اختیار کاربر بگذارید. |
| ‏⁦`POPUP_REQUIRED`⁩ | ‏برای شروع، به پنجرهٔ جدا و کلیک کاربر نیاز است. دکمهٔ بازکردن پنجره را فعال نگه دارید. |
| ‏⁦`POPUP_BLOCKED`⁩ | ‏مرورگر اجازهٔ بازکردن پنجره را نداده است. آن را مستقیماً در پاسخ به کلیک باز کنید. |
| ‏⁦`CALLBACK_ERROR`⁩ | ‏یکی از توابعی که به کتابخانه داده‌اید خطا داده است. تابع مشخص‌شده در پیام را اصلاح کنید. |
| ‏⁦`DESTROYED`⁩ | ‏نمونه قبلاً حذف شده است. برای ادامه نمونهٔ جدید بسازید. |

‏⁦`INVALID_LINK`⁩ و ⁦`DESTROYED`⁩ نیز ممکن است هنگام فراخوانی متدها رخ دهند؛ در صورت نیاز، همان فراخوانی را با ⁦`try/catch`⁩ پوشش دهید.

‏برای تلاش دوباره، ⁦`retry()`⁩ را به دکمهٔ کاربر متصل کنید. این متد تنظیمات اولیه، از جمله همان ⁦`verifiedToken`⁩ را دوباره استفاده می‌کند. حلقهٔ تلاش خودکار نسازید؛ پایان مهلت لزوماً به معنی مصرف‌نشدن توکن در سرور نیست. اگر اعتبار توکن معلوم نیست، از سرویس خود توکن تازه بگیرید و نمونهٔ جدید بسازید.

‏پس از ⁦`retry()`⁩، اگر می‌خواهید چت به محض ورود باز شود، دوباره ⁦`open()`⁩ را فراخوانی کنید یا این کار را در ⁦`onReady`⁩ انجام دهید.

<a id="popup"></a>

## ‏بازکردن چت در پنجرهٔ جدا

‏در بعضی سایت‌ها، به‌خصوص وقتی صفحهٔ شما داخل یک پورتال نمایش داده می‌شود، چت نمی‌تواند داخل همان صفحه راه‌اندازی شود. محدودیت‌های مرورگر برای ذخیره‌سازی یا نمایش صفحات خارجی هم ممکن است مانع شوند. در این شرایط، ⁦`openPopup()`⁩ را به یک دکمه متصل کنید.

‏اگر از ابتدا می‌خواهید ورود و چت در پنجرهٔ جدا انجام شود، ⁦`mode: 'popup'`⁩ را در آرگومان دوم بدهید:

</div>

<div dir="ltr" align="left">

~~~js
import { createSamanDeskWeb, SamanDeskError } from 'samandesk'

const support = createSamanDeskWeb(
  {
    workspaceID: 'YOUR_WORKSPACE_ID',
    onError: (error) => {
      if (error instanceof SamanDeskError && error.code === 'POPUP_REQUIRED') {
        return
      }
      console.error(error)
    },
  },
  { mode: 'popup' },
)

document.getElementById('support-button').addEventListener('click', () => {
  support.openPopup()
})
~~~

</div>

<div dir="rtl" align="right">

‏این مثال به دکمه‌ای با شناسهٔ ⁦`support-button`⁩ در صفحه نیاز دارد. در حالت ⁦`popup`⁩، ساخت نمونه پنجره‌ای باز نمی‌کند؛ ⁦`POPUP_REQUIRED`⁩ اعلام می‌شود تا برنامه از کاربر بخواهد روی دکمه کلیک کند. پس از کلیک، ورود شروع می‌شود و بعد از دریافت توکن، صفحهٔ انتخاب دپارتمان در همان پنجره باز می‌شود.

‏دکمهٔ بازکردن پنجره را تا رسیدن ⁦`onReady`⁩ غیرفعال نکنید، چون شروع ورود به همان کلیک نیاز دارد. ⁦`openPopup()`⁩ را پیش از هر ⁦`await`⁩ در رویداد کلیک صدا بزنید.

| ‏حالت | ‏رفتار |
| --- | --- |
| ‏⁦`auto`⁩ | ‏در حالت معمول، چت داخل صفحه باز می‌شود. اگر کتابخانه تشخیص دهد اتصال در صفحه به پنجرهٔ جدا نیاز دارد، ⁦`open()`⁩ از همان مسیر استفاده می‌کند و باید با کلیک اجرا شود. |
| ‏⁦`iframe`⁩ | ‏چت را داخل صفحه راه‌اندازی می‌کند؛ اگر این مسیر ممکن نباشد، خطا اعلام می‌شود. |
| ‏⁦`popup`⁩ | ‏از ابتدا منتظر کلیک کاربر برای شروع ورود در پنجرهٔ جدا می‌ماند. |

‏حالت ⁦`auto`⁩ همهٔ محدودیت‌های مرورگر را خودکار تشخیص نمی‌دهد. حتی در این حالت، برای خطاهای راه‌اندازی می‌توانید دکمهٔ ⁦`openPopup()`⁩ ارائه کنید. اگر ورود قبلی توکن یک‌بارمصرف را مصرف کرده باشد، برای ادامه توکن و نمونهٔ تازه لازم است.

‏پنجرهٔ جدا هم باید در مرورگر و پورتال مجاز باشد. اگر سرور اجازهٔ نمایش رابط یا ادامهٔ اتصال را ندهد، تغییر حالت نمایش به‌تنهایی مشکل را برطرف نمی‌کند. همچنین اعمال زبان و تم به پشتیبانی و تنظیمات وب‌اپ سامان دسک وابسته است.

<a id="types"></a>

## ‏نوع‌های ⁦TypeScript⁩

‏نوع‌های عمومی همراه پکیج ارائه می‌شوند. برای تنظیمات مشترک از ⁦`SamanDeskConfig`⁩، برای تم از ⁦`ProjectTheme`⁩ و برای کد خطا از ⁦`SamanDeskErrorCode`⁩ استفاده کنید. ⁦`SamanDeskError`⁩ نیز کلاس خطاست و برای ⁦`instanceof`⁩ کاربرد دارد.

</div>

<div dir="ltr" align="left">

~~~ts
import type { ProjectTheme, SamanDeskConfig } from 'samandesk'
import { createSamanDeskWeb, createSamanDeskReactNative } from 'samandesk'

const config: SamanDeskConfig = {
  workspaceID: 'YOUR_WORKSPACE_ID',
  theme: { darkMode: 'dark', color: 'teal' },
}

type ThemeColor = ProjectTheme['color']
type WebOptions = NonNullable<Parameters<typeof createSamanDeskWeb>[1]>
type NativeOptions = Parameters<typeof createSamanDeskReactNative>[1]
type WebSupport = ReturnType<typeof createSamanDeskWeb>
type NativeSupport = ReturnType<typeof createSamanDeskReactNative>
~~~

</div>

<div dir="rtl" align="right">

‏نوع‌های تنظیمات اختصاصی وب و موبایل با نام جداگانه از پکیج صادر نمی‌شوند؛ مانند مثال بالا، آن‌ها را از امضای توابع استخراج کنید.

<a id="migration"></a>

## ‏مهاجرت از نسخهٔ ۱

‏در نسخهٔ ۱٫۲، راه‌اندازی با ساخت ⁦`SamanDesk`⁩ و فراخوانی ⁦`init(config, verifiedToken?)`⁩ انجام می‌شد. در نسخهٔ فعلی، تابع ⁦`createSamanDeskWeb`⁩ نمونهٔ قابل‌استفاده را برمی‌گرداند و نیازی به ⁦`init()`⁩ نیست.

| ‏کد قبلی | ‏تغییر لازم |
| --- | --- |
| ‏⁦`new SamanDesk()`⁩ و سپس ⁦`init(...)`⁩ | ‏استفاده از ⁦`createSamanDeskWeb(config, options?)`⁩. |
| ‏توکن در آرگومان دوم ⁦`init`⁩ | ‏قرار دادن توکن در ⁦`config.verifiedToken`⁩. |
| ‏⁦`fullScreen`⁩ و ⁦`style`⁩ در تنظیمات ورود | ‏انتقال این گزینه‌ها به آرگومان دوم تابع جدید. |
| ‏نوع ⁦`OpenConfig`⁩ | ‏استفاده از ⁦`SamanDeskConfig`⁩ برای تنظیمات مشترک و استخراج نوع آرگومان دوم برای تنظیمات نمایش. |
| ‏رویدادهای ⁦`ready`⁩، ⁦`guest-ready`⁩، ⁦`open`⁩ و ⁦`close`⁩ روی ⁦`window`⁩ | ‏استفاده از ⁦`onReady`⁩، ⁦`onGuestReady`⁩، ⁦`onOpen`⁩ و ⁦`onClose`⁩ در تنظیمات. |

‏نمونهٔ جایگزین برای ورود با توکن و نمایش تمام‌صفحه:

</div>

<div dir="ltr" align="left">

~~~js
import { createSamanDeskWeb } from 'samandesk'

const support = createSamanDeskWeb(
  {
    verifiedToken: 'VERIFIED_TOKEN_FROM_YOUR_SERVICE',
    language: 'fa',
    theme: { darkMode: 'light', color: 'teal' },
    onError: (error) => console.error(error),
  },
  {
    fullScreen: true,
    style: { marginTop: 64, marginBottom: 16 },
  },
)

support.open()

// Call from the component's cleanup function:
// support.destroy()
~~~

</div>

<div dir="rtl" align="right">

‏رویدادهای قدیمی‌ای را که روی ⁦`window`⁩ ثبت کرده بودید، حذف کنید؛ نسخهٔ فعلی آن‌ها را منتشر نمی‌کند. اگر قبلاً به بازشدن لینک‌های داخل چت تکیه داشتید، حالا ⁦`linkHandler`⁩ را صریح تنظیم کنید.

‏برای ورود مهمان، به‌جای ⁦`verifiedToken`⁩ مقدار ⁦`workspaceID`⁩ را بدهید. پس از ارتقا، باز و بسته‌کردن چت را با همان نمونه انجام دهید و در پایان استفاده، آن را با ⁦`destroy()`⁩ حذف کنید.

## ‏مجوز

‏این پکیج با مجوز ⁦[MIT](LICENSE)⁩ ارائه می‌شود.

</div>
