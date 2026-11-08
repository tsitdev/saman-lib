/** خانواده رنگی‌ای که می‌تواند از سمت پروژه مقصد انتخاب شود */
export type Color =
'blue'
| 'red'
| 'default'
| 'darkGreen'
| 'orange'
| 'green'
| 'teal'
| 'absolute'
| 'pink'
| 'darkTeal'
| 'mint'
| 'darkPurple'
| 'dodgerBlue'
| 'darkGold'
| 'purple'
| 'brown'
| 'ferra'

/** رنگ هایی که قرار است از پروژه های دیگر گرفته شود تا رنگ پروژه به آن رنگ در بیاید */
export const libraryColors = {
  light: {
    blue: '#1D9CF0',
    red: '#C2412D',
    default: '#40826D',
    darkGreen: '#005141',
    orange: '#E86D0F',
    green: '#00BA7B',
    teal: '#30B0C7',
    absolute: '#11232E',
    pink: '#EB43AD',
    darkTeal: '#344EA2',
    mint: '#00B2AA',
    darkPurple: '#65558F',
    dodgerBlue: '#386CF8',
    darkGold: '#9C8410',
    purple: '#8056E0',
    brown: '#A2845E',
    ferra: '#7D5260',
  },
  dark: {
    blue: '#52B6FC',
    red: '#F69B8A',
    default: '#68b09d',
    darkGreen: '#86D6BE',
    orange: '#FFA36B',
    green: '#00BA7B',
    teal: '#5DD5EA',
    absolute: '#DDE7EE',
    pink: '#F7A7DA',
    darkTeal: '#A5B6EC',
    mint: '#13C0B8',
    darkPurple: '#D0BCFE',
    dodgerBlue: '#8EA7FF',
    darkGold: '#DDC66E',
    purple: '#B49CED',
    brown: '#CEAA7C',
    ferra: '#EFB8C8',
  },
} as const
