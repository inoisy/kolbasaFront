<template>
    <div :class="$style.appBar">
        <div :class="$style.appBarInner">
            <nuxt-link
                :class="$style.logoWrapper"
                to="/"
                class="py-1 fill-height d-flex align-center"
                title="Логотип Альянс Фуд"
            >
                <v-img
                    id="logo-img"
                    src="/images/logo1.png"
                    alt="Логотип Альянс Фуд"
                    title="Логотип Альянс Фуд"
                    max-height="100%"
                    contain
                />
                <v-img
                    id="logo-text"
                    class="mt-1 mx-1"
                    src="/images/logo2.png"
                    alt="Логотип Альянс Фуд"
                    title="Логотип Альянс Фуд"
                    max-height="80%"
                    contain
                />
            </nuxt-link>
            <v-spacer></v-spacer>
            <template v-if="isMounted && !isMobile">
                <v-btn
                    v-for="(item, index) in menuItems"
                    v-bind="{
                        ...(!item.disable ? { to: `/${item.slug}` } : null),
                    }"
                    :id="item.slug"
                    :key="item.slug + index"
                    class="fill-height ma-0 header-link hidden-sm-and-down"
                    style="height: 100%;"
                    text
                    tile
                    color="#95282a"
                    :title="item.name"
                >
                    {{ item.name }}
                    <v-icon v-if="item.isChild" style="margin-right: -8px;">
                        $dropdown
                    </v-icon>
                </v-btn>
            </template>

            <v-btn
                :disabled="!(isMounted && isCart)"
                class="cart-wrap"
                color="#95282a"
                :hover="false"
                text
                @click="$emit('show-basket')"
            >
                <span v-if="summa > 0" class="cart-text mr-2">
                    {{ summa }}&nbsp;&#8381;
                </span>

                <v-badge
                    class="cart-badge"
                    color="#95282a"
                    :value="isMounted && isCart"
                    overlap
                    :content="cartLength"
                >
                    <v-icon color="#95282a">{{ icons.mdiBasket }}</v-icon>
                </v-badge>

            </v-btn>
            <v-btn
                icon
                class="ml-1"
                large
                title="Меню пользователя"
                @click="$emit('show-user')"
            >
                <v-icon medium color="#95282a">{{ icons.mdiAccount }}</v-icon>
            </v-btn>
            <v-btn
                icon
                class="ml-1 hidden-md-and-up"
                large
                title="Меню"
                @click="$emit('show-drawer')"
            >
                <v-icon medium color="#95282a">$menu</v-icon>
            </v-btn>
        </div>

        <lazy-toolbar-catalog-menu
            v-if="isMounted && !isMobile"
            :items="menuItems[0].items"
        />
        <lazy-toolbar-menu
            v-if="isMounted && !isMobile"
            :items="menuItems[1].items"
            :is-two-columns="true"
            parent-slug="manufacturers"
        />
        <lazy-toolbar-menu
            v-if="isMounted && !isMobile"
            :items="menuItems[2].items"
            parent-slug="about"
        />
    </div>
</template>
<style lang="scss" scoped module>
    .appBar {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        z-index: 300;
        height: $toolbar-mobile-height;
        margin-top: 0;
        padding: 0 12px;
        border-color: whitesmoke;
        background-color: whitesmoke;
        box-shadow:
            0 2px 4px -1px rgb(0 0 0 / 20%),
            0 4px 5px 0 rgb(0 0 0 / 14%),
            0 1px 10px 0 rgb(0 0 0 / 12%);

        @include md {
            height: $toolbar-desktop-height;
        }

        .logoWrapper {
            padding-right: 8px;
        }

        .appBarInner {
            display: flex;
            align-items: center;
            height: 100%;
        }
    }
</style>

<style lang="scss" scoped>
    .cart-wrap {
        height: 100% !important;
        border-radius: 0;

        &[disabled="disabled"] {
            min-width: 44px;
            margin-left: 4px;
            padding: 0;
        }

        .cart-badge {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            transition-duration: .28s;
        }

        .cart-text {
            position: relative;
            white-space: nowrap;
            font-size: 16px;
            font-weight: 600;
            color: #95282a;

            &:before {
                content: "";
                position: absolute;
                right: 0;
                bottom: 0;
                left: 0;
                display: block;
                width: 0;
                border-bottom: 2px solid #95282a;
                transition: width .1s ease-in;
            }
        }

        &:hover {
            .cart-badge {
                background-color: #d8b7b7;
            }

            .cart-text:before {
                width: 100%;
            }
        }
    }

    #logo-img {
        width: 50px;
        max-width: 50px;
    }

    #logo-text {
        display: none;
        width: 110px;
        max-width: 110px;
    }

    .header-link {
        padding: 0 8px !important;
        text-indent: 0 !important;
        font-size: 12px !important;
        letter-spacing: 0 !important;
    }

    @include sm {
        #logo-img {
            width: 65px;
            max-width: 65px;
        }

        #logo-text {
            display: block;
            width: 140px;
            max-width: 140px;
        }

        .header-link {
            padding: 0 6px !important;
            font-size: 14px !important;
        }
    }

    @include md {
        #logo-img {
            width: 50px;
            max-width: 50px;
        }

        #logo-text {
            width: 120px;
            max-width: 120px;
        }

        .header-link {
            padding: 0 8px !important;
        }
    }

    @include lg {
        #logo-img {
            width: 65px;
            max-width: 65px;
        }

        #logo-text {
            width: 130px;
            max-width: 130px;
        }

        .header-link {
            padding: 0 12px !important;
        }
    }
</style>

<script>
import { mdiAccount, mdiBasket } from '@mdi/js';

export default {
    data() {
        return {
            icons: { mdiAccount, mdiBasket },
            isMounted: false,
        };
    },
    computed: {
        isMobile() {
            return this.$vuetify.breakpoint.mobile;
        },
        isCart() {
            if (!this.isMounted) {
                return false;
            }
            return this.$store.getters['cart/isCart'];
        },
        menuItems() {
            return this.$store.getters['info/menuItems'];
        },
        summa() {
            if (!this.isCart) {
                return 0;
            } else {
                return this.$store.getters['cart/cartSumm'];
            }
        },
        cartLength() {
            if (!this.isCart) {
                return 0;
            } else {
                const length = this.$store.getters['cart/cartLength'];
                return length;
            }
        },
    },
    mounted() {
        this.isMounted = true;
    },
};
</script>
