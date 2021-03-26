//   complete: '...',
//   cancel: '...',
//   close: '...',
//   delete: '...', // delete (e.g. v-chip close)
//   clear: '...',
//   success: '...',
//   info: '...',
//   warning: '...',
//   error: '...',
//   prev: '...',
//   next: '...',
//   checkboxOn: '...',
//   checkboxOff: '...',
//   checkboxIndeterminate: '...',
//   delimiter: '...', // for carousel
//   sort: '...',
//   expand: '...',
//   menu: '...',
//   subgroup: '...',
//   dropdown: '...',
//   radioOn: '...',
//   radioOff: '...',
//   edit: '...',
//   ratingEmpty: '...',
//   ratingFull: '...',
//   ratingHalf: '...',
//   loading: '...',
//   first: '...',
//   last: '...',
//   unfold: '...',
//   file: '...',
import { mdiPhone, mdiEmail, mdiMapMarker, mdiClockOutline, mdiArrowLeft, mdiEye, mdiEyeOff, mdiCurrencyRub } from "@mdi/js";
// mdiSortVariant,
export default function ({ app }) {
    return {
        breakpoint: {
            mobileBreakpoint: 'sm' // This is equivalent to a value of 960
        },
        theme: {
            disable: true,
            // dark: false,
            // themes: {
            //     light: {
            //         primary: '#4A1F00',
            //         accent: "#d50000",
            //     },
            // },
        },
        icons: {
            iconfont: 'mdiSvg',
            values: {
                phone: mdiPhone,
                email: mdiEmail,
                map: mdiMapMarker,
                time: mdiClockOutline,
                arrowLeft: mdiArrowLeft,
                eye: mdiEye,
                eyeOff: mdiEyeOff,
                rub: mdiCurrencyRub,
                // sort: mdiSortVariant
            }
        },
    }
}