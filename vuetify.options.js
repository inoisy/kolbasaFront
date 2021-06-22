import { mdiPhone, mdiEmail, mdiMapMarker, mdiClockOutline, mdiArrowLeft, mdiEye, mdiEyeOff, mdiCurrencyRub } from '@mdi/js';

export default function({ app }) {
    return {
        breakpoint: {
            mobileBreakpoint: 'sm', // This is equivalent to a value of 960
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
            },
        },
    };
}
