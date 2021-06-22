<template>
    <v-navigation-drawer
        :value="show"
        temporary
        fixed
        right
        touchless
        width="550px"
        @input="change"
    >
        <div class="py-5 px-5">
            <v-btn
                v-if="!showOrders"
                class="mb-9"
                title="Закрыть"
                icon
                large
                outlined
                @click="$emit('close')"
            >
                <v-icon>$close</v-icon>
            </v-btn>
            <div v-if="!isLogined">
                <h3 class="mb-5">ВХОД</h3>
                <user-login class="mb-12" />
                <h3 class="mb-5">РЕГИСТРАЦИЯ</h3>
                <user-register />
            </div>
            <user-personal-area v-else />
        </div>
    </v-navigation-drawer>
</template>
<script>


export default {
    middleware: 'auth',

    props: {
        show: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            showOrders: false,

        };
    },
    computed: {
        isLogined() {
            return Boolean(this.$strapi.user);
        },
        userData() {
            return this.$strapi.user;
        },
    },
    mounted() {
        this.$strapi.fetchUser();
    },
    methods: {
        async logout() {
            this.$strapi.logout();
        },
        change(val) {
            if (!val) {
                this.$emit('close');
            }
        },
    },
};
</script>
