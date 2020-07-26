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
  mode: 'universal',
  // hooks: {
  //   build: {
  //     async before(builder) {
  //       const query = `
  //         {
  //           contact {
  //             phone
  //             email
  //             addressText
  //             addressCoords
  //             accessTime
  //           }
  //           categories(sort: "name:asc", limit: 999) {
  //             id
  //             name
  //             slug
  //             parent {
  //               id
  //             }
  //             children {
  //               id
  //               name
  //               slug
  //               img {
  //                 url
  //               }
  //             }
  //             img {
  //               url
  //             }
  //           }
  //           manufacturers(sort: "name:asc", limit:999) {
  //             id
  //             name
  //             slug

  //             img {
  //               url
  //             }
  //           }
  //         }
  //       `
  //       const fetchApollo = apolloFetch.createApolloFetch({
  //         uri: backendUrl + '/graphql'
  //       });

  //       const data = await fetchApollo({
  //         query
  //       })
  //       const extraFilePath = path.join(builder.nuxt.options.srcDir, 'assets', 'generalData.json')
  //       await fs.writeFileSync(extraFilePath, JSON.stringify(data.data))
  //     }
  //   }
  // },
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
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Material+Icons'
      }
    ]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#d50000'
  },

  /*
   ** Global CSS
   */
  css: [
    '~/assets/style/app.styl'
  ],

  buildModules: [
    '@nuxtjs/dotenv',
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/cachedApi.js',
    "@/plugins/lazyload.js",
    {
      src: '@/plugins/aos.js',
      ssr: false
    }, {
      src: '@/plugins/infiniteLoading.js',
      ssr: false
    }
  ],

  modules: [
    '@nuxtjs/sentry',
    'nuxt-vuex-localstorage',
    ['@nuxtjs/google-analytics', {
      id: process.env.GOOGLE_ID
    }],
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
    ['vue-yandex-maps/nuxt', {
      apiKey: process.env.MAP_KEY,
      lang: 'ru_RU',
      version: '2.1'
    }],
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
      watchLoading: '~/plugins/apollo-watch-loading-handler.js',
      // optional
      errorHandler: '~/plugins/apollo-error-handler.js',
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

    ['@nuxtjs/redirect-module', redirectRoutes],


    ['@nuxtjs/sitemap', {
      gzip: true,
      routes
    }],
    ['@nuxtjs/robots', {
      UserAgent: '*',
      Allow: '/',
      Sitemap: sitename + "/sitemap.xml"
    }],
    ["nuxt-ssr-cache", {
      store: {
        type: 'redis',
        host: 'localhost',
        ttl: 4 * 60 * 60,
        configure: [

          ['maxmemory', '200mb'],
          ['maxmemory-policy', 'allkeys-lru'],
        ],
      },
      pages: [
        "/"
      ],
    }, ],
    ['@nuxtjs/vuetify', {
      treeShake: true,
      defaultAssets: {
        font: {
          family: 'Open Sans'
        },
        icons: "md"
      },
      customVariables: ['~/assets/variables.scss'],
      theme: {
        themes: {
          light: {
            primary: '#4A1F00',
            accent: "#d50000",
          },
        },
      },
    }],

  ],
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
    extend(config, ctx) {}
  }
}
