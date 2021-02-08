// const MDI_ICONS = {
//     cancel: "mdi-close-circle",
//     close: "mdi-close",
//     delete: "mdi-close-circle", // delete (e.g. v-chip close)
//     success: "mdi-check-circle",
//     info: "mdi-information",
//     warning: "mdi-exclamation",
//     error: "mdi-alert",
//     previous: "mdi-chevron-left",
//     next: "mdi-chevron-right",
//     checked: "mdi-checkbox-marked",
//     unchecked: "mdi-checkbox-blank-outline",
//     indeterminate: "mdi-minus-box",
//     dot: "mdi-circle", // for carousel
//     sort: "mdi-arrow-up",
//     expand: "mdi-chevron-down",
//     append: "mdi-chevron-down",
//     subgroup: "mdi-menu-down",
//     rchecked: "radio-button-checked",
//     runchecked: "radio-button-unchecked",
//     edit: "pencil"
// };
import { mdiPhone, mdiEmail, mdiMapMarker, mdiClockOutline, mdiArrowLeft, mdiEye, mdiEyeOff } from "@mdi/js";

export default function ({ app }) {
    return {
        theme: {
            dark: false,
            themes: {
                light: {
                    primary: '#4A1F00',
                    accent: "#d50000",
                },
            },
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
                eyeOff: mdiEyeOff
            }
        },
    }
}