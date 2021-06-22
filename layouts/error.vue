<template>
    <div class="__nuxt-error-page">
        <div class="error">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="90"
                height="90"
                fill="#DBE1EC"
                viewBox="0 0 48 48"
            >
                <path
                    d="M22 30h4v4h-4zm0-16h4v12h-4zm1.99-10C12.94 4 4 12.95 4 24s8.94 20 19.99 20S44 35.05 44 24 35.04 4 23.99 4zM24 40c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z"
                />
            </svg>

            <div class="title">{{ message }}</div>
            <v-btn :to="redirect.route"
                   color="white"
                   small
            >
                {{
                    redirect.text
                }}
            </v-btn>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .__nuxt-error-page {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 1rem;
        background: #f7f8fb;
        text-align: center;
        font-family: sans-serif;
        font-weight: 100 !important;
        color: #47494e;
        flex-direction: column;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
        -webkit-font-smoothing: antialiased;
    }

    .__nuxt-error-page .error {
        padding: 1rem 2rem;
    }

    .__nuxt-error-page .title {
        margin-top: 15px;
        margin-bottom: 8px;
        font-size: 1.5rem;
        color: #47494e;
    }

    .__nuxt-error-page .description {
        margin-bottom: 10px;
        line-height: 21px;
        color: #7f828b;
    }

    .__nuxt-error-page a {
        text-decoration: none;
        color: #7f828b !important;
    }

    .__nuxt-error-page .logo {
        position: fixed;
        bottom: 12px;
        left: 12px;
    }
</style>

<script>
export default {
    layout: 'error',

    props: {
        error: {
            type: Object,
            default: null,
        },
    },
    head() {
        console.log('this.metaInfo', 'Ошибка', this.message);
        return {
            title: this.message || 'Ошибка',

            meta: [
                {
                    name: 'viewport',
                    content:
                        'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no',
                },
            ],
        };
    },
    computed: {
        statusCode() {
            return (this.error && this.error.statusCode) || 500;
        },
        message() {
            return this.error.message || 'Ошибка';
        },
        redirect() {
            const main = {
                route: '/',
                text: 'Вернуться на главную',
            };
            const manufacturer = {
                route: '/manufacturers',
                text: 'Вернутся к производителям',
            };
            const catalog = {
                route: '/catalog',
                text: 'Вернуться в каталог',
            };
            if (!this.error.type) {
                return main;
            }
            if (this.error.type === 'catalog') {
                return catalog;
            }
            if (this.error.type === 'manufacturer') {
                return manufacturer;
            }
            return main;
        },


    },
};
</script>
