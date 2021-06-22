const axios = require('axios');
const routes = require('./routes');

const sitename = 'https://prodaem-kolbasu.ru';
const backURL = 'https://api.prodaem-kolbasu.ru';
const backendUrl = process.env.BACKEND_URL || backURL;
const imageUrl = process.env.IMAGE_BASE_URL || process.env.BACKEND_URL || backURL;


const name = 'Альянс Фуд';
const description = 'Альянс Фуд. Колбаса и другие мясные изделия оптом по ценам производителя. Самовывоз со склада в Москве. Доставка по РФ и СНГ.';

async function generateRoutes() {
    const routes = [];
    const {
        data: pages,
    } = await axios.get(backendUrl + '/pages?_limit=99999');
    for (const item of pages) {
        routes.push(`${item.slug}`);
    }
    const {
        data: manufacturers,
    } = await axios.get(backendUrl + '/manufacturers?_limit=99999');
    for (const item of manufacturers) {
        routes.push(`/manufacturers/${item.slug}`);
    }
    const {
        data: categories,
    } = await axios.get(backendUrl + '/categories?_limit=99999');
    for (const category of categories) {
        routes.push(`/catalog/${category.slug}`);
    }
    const {
        data: products,
    } = await axios.get(backendUrl + '/products?_limit=99999');

    for (const product of products) {
        if (product.category && product.category.slug && product.slug) {
            routes.push(`/catalog/${product.category.slug}/${product.slug}`);
        } else {
            console.log('no category', product.name);
        }
    }
    return routes;
}

const devModules = [
    '@nuxtjs/stylelint-module',
    '@nuxtjs/eslint-module',
];

module.exports = async () => {
    const isDev = process.env.NODE_ENV !== 'production';
    return {
        env: {
            name,
            description,
            baseUrl: backendUrl,
            imageBaseUrl: imageUrl,
        },
        publicRuntimeConfig: {
            name,
            description,
            baseUrl: backendUrl,
            imageBaseUrl: imageUrl,
            siteUrl: sitename,
        },


        head: {
            title: name,
            titleTemplate: `%s - ${name}`,
            meta: [{
                charset: 'utf-8',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                hid: 'description',
                name: 'description',
                content: description,
            }],
            link: [{
                rel: 'icon',
                type: 'image/x-icon',
                href: '/favicon.ico',
            }],
        },


        loading: {
            color: '#d50000',
            throttle: 30,
            duration: 3000,
            continuous: true,
            failedColor: 'black',
        },
        components: [
            { path: '~/components', extensions: ['vue'] },
        ],

        css: [
            '~/assets/style/app.scss',
        ],
        plugins: [
            '@/plugins/strapi.js',
        ],

        router: {

            extendRoutes(routes, resolve) {
                routes.push({
                    path: '/catalog/discount',
                    component: resolve(__dirname, 'customPages/catalog/discount.vue'),
                    name: 'catalog-discount',
                    children: [{
                        path: ':slug?',
                        component: resolve(__dirname, 'customPages/catalog/_category/_slug.vue'),
                        name: 'catalog-discount-slug',
                    }],
                }, {
                    path: '/catalog/halal',
                    component: resolve(__dirname, 'customPages/catalog/halal.vue'),
                    name: 'catalog-halal',
                    children: [{
                        path: ':slug?',
                        component: resolve(__dirname, 'customPages/catalog/_category/_slug.vue'),
                        name: 'catalog-halal-slug',
                    }],
                }, {
                    path: '/catalog/:category',
                    component: resolve(__dirname, 'customPages/catalog/_category.vue'),
                    name: 'catalog-category',
                    children: [{
                        path: ':slug?',
                        component: resolve(__dirname, 'customPages/catalog/_category/_slug.vue'),
                        name: 'catalog-category-slug',
                    }],
                }, {
                    path: '/manufacturers/:manufSlug',
                    component: resolve(__dirname, 'customPages/manufacturers/_manufSlug.vue'),
                    name: 'manufacturers-manufSlug',
                    children: [{
                        path: ':slug?',
                        component: resolve(__dirname, 'customPages/catalog/_category/_slug.vue'),
                        name: 'manufacturers-manufSlug-slug',
                    }],
                });
            },
        },
        buildModules: [
            ...(isDev ? devModules : []),
            '~/modules/hook.js',


            '@nuxtjs/style-resources',
            '@nuxtjs/vuetify',
            ['@aceforth/nuxt-optimized-images', {
                inlineImageLimit: 1000,
                imagesName: ({ isDev }) => isDev ? '[path][name][hash:optimized].[ext]' : 'img/[contenthash:7].[ext]',
                responsiveImagesName: ({ isDev }) => isDev ? '[path][name]--[width][hash:optimized].[ext]' : 'img/[contenthash:7]-[width].[ext]',
                handleImages: ['jpeg', 'png', 'svg', 'webp'],
                optimizeImages: true,
                optimizeImagesInDev: true,
                defaultImageLoader: 'img-loader',
                mozjpeg: {
                    quality: 40,
                },
                optipng: {
                    optimizationLevel: 3,
                },
                pngquant: false,
                svgo: {

                },
                webp: {
                    preset: 'default',
                    quality: 60,
                },
            }],
        ],


        modules: [
            ['@nuxtjs/apollo', {
                clientConfigs: {
                    default: {
                        httpEndpoint: backendUrl + '/graphql',
                        persisting: true,
                    },
                },
                includeNodeModules: true,
            }],
            '@nuxtjs/strapi',
            ['@nuxtjs/toast', {
                theme: 'outline',
                position: 'top-right',
                duration: 8000,
                iconPack: 'callback',
                action: {
                    text: 'Закрыть',
                    onClick: (e, toastObject) => {
                        toastObject.goAway(0);
                    },
                },
            }],
            ['nuxt-vuex-localstorage', {
                localStorage: ['cart', 'category'],
                sessionStorage: ['info', 'categoryPage'],
            }],
            [
                '@nuxtjs/yandex-metrika',
                {
                    id: process.env.YANDEX_ID,
                    clickmap: true,
                    trackLinks: true,
                    accurateTrackBounce: true,
                    webvisor: true,
                    useCDN: false,
                },
            ],

            ['nuxt-social-meta', {
                url: sitename,
                title: name,
                description,
                img: imageUrl + '/uploads/031ba5905e18488794851c8d512b1227.jpg',
                locale: 'ru_RU',
                themeColor: '#d50000',
            }],
            ['@nuxtjs/sitemap', {
                gzip: true,
                routes,
            }],
            ['@nuxtjs/robots', {
                UserAgent: '*',
                Allow: '/',
                Sitemap: sitename + '/sitemap.xml',
            }],
            ['@nuxtjs/google-fonts', {
                families: {
                    Montserrat: [400, 500, 700],
                    Alice: true,
                },
            }],

        ],

        strapi: {
            url: backendUrl,
            expires: '365d',
            key: 'jwt',
            entities: ['orders'],
        },

        vuetify: {
            customVariables: ['~/assets/variables.scss'],
            treeShake: true,
            options: {
                customProperties: true,
            },
            defaultAssets: false,
            optionsPath: './vuetify.options.js',
        },

        styleResources: {
            sass: [],
            scss: [
                './assets/styles/_mixins/*.scss',
                './assets/styles/_vars/*.scss',
            ],
            less: [],
            stylus: [],
        },

        ...(!isDev && {
            modern: 'client',
        }),

        render: {
            resourceHints: false,
        },
        stylelint: {
            files: [
                'assets/**/*.{s?(a|c)ss}',
                '**/components/**/*.{s?(a|c)ss}',
                '**/{components,layouts,services}/**/*.vue',
            ],
        },

        eslint: {
            cache: false,
        },
        build: {
            followSymlinks: false,
            terser: {
                extractComments: false,
            },
            transpile: ['@nuxtjs/apollo',
                '@nuxtjs/robots',
                '@nuxtjs/sitemap',
                '@nuxtjs/strapi',
                '@nuxtjs/toast',
                '@nuxtjs/yandex-metrika',
                'graphql-tag',
                'nuxt-social-meta',
                'nuxt-vuex-localstorage',
                'vue-infinite-loading',
                'vue-lazy-hydration',
                'vue-the-mask',
                'vue-yandex-maps',
                'vuelidate',
                'vue',
                'vue-server-renderer',
                'vue-template-compiler',
                'nuxt'],
        },
    };
};
