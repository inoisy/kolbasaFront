import { mdiPhone, mdiEmail, mdiMapMarker, mdiClockOutline, mdiArrowLeft, mdiEye, mdiEyeOff, mdiCurrencyRub } from '@mdi/js';

export default function({ app }) {
    return {
        breakpoint: {
            mobileBreakpoint: 'sm',
        },
        theme: {
            disable: true,


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

            },
        },
    };
}
