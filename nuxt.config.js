require('dotenv').config()
const path = require('path')
const fs = require('fs')
const apolloFetch = require('apollo-fetch');

const routes = require("./routes")
const redirectRoutes = require("./redirectRoutes")

const sitename = `https://prodaem-kolbasu.ru`;
const backURL = `https://api.prodaem-kolbasu.ru`
const backendUrl = process.env.BACKEND_URL || backURL
const imageUrl = process.env.IMAGE_BASE_URL || process.env.BACKEND_URL || backURL


const name = "Альянс Фуд"
const description = "Альянс Фуд. Колбаса и другие мясные изделия оптом по ценам производителя. Самовывоз со склада в Москве. Доставка по РФ и СНГ."


module.exports = {
  // target: "static",
  env: {
    name: name,
    description: description,
    baseUrl: backendUrl,
    imageBaseUrl: imageUrl
  },
  generate: {
    interval: 300,
    dir: 'public',
    subFolders: false,
    fallback: "404.html",
    routes
  },
  // components: false,
  /*
   ** Headers of the page
   */
  head: {
    title: name,
    titleTemplate: `%s - ${name}`,
    meta: [{
      charset: 'utf-8'
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    },
    {
      hid: 'description',
      name: 'description',
      content: description
    }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    },
      // {
      //   rel: 'stylesheet',
      //   href: 'https://fonts.googleapis.com/css?family=Material+Icons'
      // }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#d50000'
  },
  components: true,
  /*
   ** Global CSS
   */
  css: [
    '~/assets/style/app.scss'
  ],
  plugins: [
    '@/plugins/cachedApi.js',
    '@/plugins/strapi.js',
    // '~/plugins/fa.js',
    // "@/plugins/lazyload.js",
    // {
    //   src: '@/plugins/aos.js',
    //   ssr: false
    // },
    // {
    //   src: '@/plugins/infiniteLoading.js',
    //   ssr: false
    // }
  ],
  router: {
    extendRoutes(routes, resolve) {
      routes.push(
        //   {
        //   name: 'catalog-nested',
        //   path: '/catalog/:categorySlug/:productSlug',
        //   component: resolve(__dirname, 'components/pages/catalog.vue')
        // }
        {
          path: "/catalog/:category",
          component: resolve(__dirname, 'components/pages/_category.vue'),
          name: "catalog-category",
          children: [{
            path: ":slug?",
            component: resolve(__dirname, 'components/pages/_category/_slug.vue'),
            name: "catalog-category-slug"
          }]
        }
      )
    }
  },
  buildModules: [
    // '@nuxtjs/dotenv',
    // '@nuxtjs/pwa',
    // https://github.com/nuxt-community/style-resources-module
    // '@nuxtjs/eslint-module',
    '@nuxtjs/style-resources',
    '@nuxtjs/vuetify',
  ],
  // pwa: {
  //   meta: {
  //     name, description
  //     /* meta options */
  //   }
  // },
  /*
   ** Plugins to load before mounting the App
   */

  modules: [
    '@nuxtjs/strapi',
    '@nuxtjs/toast',
    'nuxt-webfontloader',
    // 'cookie-universal-nuxt',
    // '@nuxtjs/sentry',
    'nuxt-vuex-localstorage',
    // ['@nuxtjs/google-analytics', {
    //   id: process.env.GOOGLE_ID
    // }],
    [
      '@nuxtjs/yandex-metrika',
      {
        id: process.env.YANDEX_ID,
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true
      }
    ],
    // ['vue-yandex-maps/nuxt', {
    //   apiKey: process.env.MAP_KEY,
    //   lang: 'ru_RU',
    //   version: '2.1'
    // }],
    // [
    //   "@nuxtjs/markdownit",
    //   {
    //     injected: true,
    //     html: true,
    //     xhtmlOut: true,
    //     breaks: true,
    //     typographer: true,
    //     linkify: true
    //   }
    // ],
    ['@nuxtjs/axios', {
      baseURL: backendUrl
    }],
    ['@nuxtjs/apollo', {
      clientConfigs: {
        default: {
          httpEndpoint: backendUrl + '/graphql',
        },
      }
    }],
    ['nuxt-social-meta', {
      url: sitename,
      title: name,
      description: description,
      img: imageUrl + "/uploads/031ba5905e18488794851c8d512b1227.jpg",
      locale: 'ru_RU',
      themeColor: '#d50000'
    }],

    // ['@nuxtjs/redirect-module', redirectRoutes],


    ['@nuxtjs/sitemap', {
      gzip: true,
      routes
    }],
    ['@nuxtjs/robots', {
      UserAgent: '*',
      Allow: '/',
      Sitemap: sitename + "/sitemap.xml"
    }],

  ],
  strapi: {
    // Options
    url: backendUrl,
    expires: '365d',
    key: "jwt",
    entities: ["orders"]
  },
  toast: {
    theme: "outline",
    position: 'top-right',
    duration: 8000,
    iconPack: 'callback',
    action: {
      text: "Закрыть",
      onClick: (e, toastObject) => {
        toastObject.goAway(0);
      },
    },
    // register: [ // Register custom toasts
    //   {
    //     name: 'my_error',
    //     message: message => message,
    //     options: {
    //       type: 'error',
    //       theme: 'bubble',

    //     }
    //   }
    // ]
  },
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    treeShake: true,
    options: {
      customProperties: true
    },
    defaultAssets: false,
    optionsPath: './vuetify.options.js'
  },
  // svgSprite: {
  //   input: '~/assets/icons/'
  // },
  webfontloader: {
    google: {
      families: [
        'Open Sans:n4,n5,n7',
        'Signika:n7'
      ],
      urls: [
        // for each Google Fonts add url + options you want
        // here add font-display option
        'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&family=Signika:wght@700&display=swap',
        'https://fonts.googleapis.com/css2?family=Montserrat+Alternates:wght@700&display=swap'
      ]
      // families: ['Montserrat:400,500,700']
      // "https://fonts.googleapis.com/css2?family=Signika:wght@700&display=swap"
    }
  },
  styleResources: {
    // your settings here
    sass: [],
    scss: [
      './assets/styles/_mixins/*.scss',
      './assets/styles/_vars/*.scss',
    ],
    less: [],
    stylus: []
  },
  sentry: {
    dsn: 'https://e3280a17ba94410780a38ca12ccc2e6e@o413020.ingest.sentry.io/5295312', // Enter your project's DSN here
    config: {}, // Additional config
  },
  build: {
    babel: {
      sourceType: 'unambiguous',
      presets: [
        ["@nuxt/babel-preset-app", {
          corejs: {
            version: 2
          }
        }],
      ]
    },
    transpile: ["@nuxtjs/vuetify", /^aos/, /^@nuxtjs.*/, "nuxt-vuex-localstorage"],
    extend(config, ctx) { }
  }
}
