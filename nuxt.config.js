// const pkg = require('./package')
// const os = require("os");
// import fs from 'fs'
const path = require('path')
const fs = require('fs')

const apolloFetch = require('apollo-fetch');

const routes = require("./routes")
const redirectRoutes = require("./redirectRoutes")

const protocol = "https"
const sitename = `${protocol}://prodaem-kolbasu.ru`;
const backURL = `${protocol}://api.prodaem-kolbasu.ru`
const backendUrl = process.env.BACKEND_URL || backURL
const imageUrl = process.env.IMAGE_BASE_URL || process.env.BACKEND_URL || backURL

// const imageBaseUrl = process.env.IMAGE_BASE_URL || "http://cdn.yakutov.com"

// const axios = require('axios')

const name = "Альянс Фуд"
const description = "Альянс Фуд. Колбаса и другие мясные изделия оптом по ценам производителя. Самовывоз со склада в Москве. Доставка по РФ и СНГ."


module.exports = {
  mode: 'universal',
  hooks: {
    build: {
      async before(builder) {
        // console.log("TCL: before -> builder", builder)
        const uri = backendUrl + '/graphql'
        const query = `
          {
            contacts {
              phone
              email
              addressText
              addressCoords
              accessTime
            }
            categories(sort: "name:asc") {
              id
              name
              slug
              parent {
                id
              }
              children {
                id
                name
                slug
                img {
                  url
                }
              }
              img {
                url
              }
            }
            manufacturers(sort: "name:asc") {
              id
              name
              slug

              img {
                url
              }
            }
          }
        `
        const fetchApollo = apolloFetch.createApolloFetch({
          uri
        });

        const data = await fetchApollo({
          query
        })
        // console.log("TCL: before -> data", data)
        // console.log("TCL: done -> builder", builder)
        const extraFilePath = path.join(builder.nuxt.options.srcDir, 'assets', 'generalData.json')
        // console.log("TCL: before -> extraFilePath", extraFilePath)
        await fs.writeFileSync(extraFilePath, JSON.stringify(data.data))
      }
    }
  },
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

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    // '@/plugins/vuetify',
    "@/plugins/lazyload.js",
    {
      src: '@/plugins/aos.js',
      ssr: false
    }, {
      src: "@/plugins/swiper.js",
      ssr: false
    }, {
      src: '@/plugins/infiniteLoading.js',
      ssr: false
    }
  ],

  modules: [
    'nuxt-vuex-localstorage',

    ['@nuxtjs/google-analytics', {
      id: 'UA-153607412-1'
    }],
    [
      '@nuxtjs/yandex-metrika',
      {
        id: '54918895',
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true
      }
    ],
    ['vue-yandex-maps/nuxt', { // you may define your apiKey, lang and version or skip this.
      apiKey: 'df1793f7-7dbf-4c12-abe4-47fcdf2861b5',
      lang: 'ru_RU',
      version: '2.1'
    }],
    [
      "@nuxtjs/markdownit",
      {
        injected: true,
        html: true,
        xhtmlOut: true,
        breaks: true,
        typographer: true,
        linkify: true
      }
    ],
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
      // twitter: '@UserName',
      themeColor: '#d50000'
    }],

    ['@nuxtjs/redirect-module', redirectRoutes],

    // Redirect option here

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
        // if you're serving multiple host names (with differing
        // results) from the same server, set this option to true.
        // (cache keys will be prefixed by your host name)
        // if your server is behind a reverse-proxy, please use
        // express or whatever else that uses 'X-Forwarded-Host'
        // header field to provide req.hostname (actual host name)
        // useHostPrefix: true,

        store: {
          type: 'redis',
          host: 'localhost',
          ttl: 4 * 60 * 60,
          configure: [
            // these values are configured
            // on redis upon initialization
            ['maxmemory', '200mb'],
            ['maxmemory-policy', 'allkeys-lru'],
          ],

        },

        pages: [
          // these are prefixes of pages that need to be cached
          // if you want to cache all pages, just include '/'
          "/"
        ],
      },

    ],
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
            // secondary: '#b0bec5',
            // error: '#b71c1c',
            primary: '#4A1F00',
            accent: "#d50000",
          },
        },
      },
    }],

  ],

  // router: {
  //   scrollBehavior(to, from, savedPosition) {
  //     console.log("TCL: scrollBehavior -> to", to)
  //     console.log("TCL: scrollBehavior -> from", from)
  //     console.log("TCL: scrollBehavior -> savedPosition", savedPosition)

  //     return {
  //       x: 0,
  //       y: 0
  //     }
  //   }
  // },
  /*
   ** Build configuration
   */
  build: {
    babel: {
      sourceType: 'unambiguous',
    },
    transpile: ["@nuxtjs/vuetify", /^aos/, /^vue-awesome-swiper/, /^@nuxtjs.*/, "vue-particles", "nuxt-vuex-localstorage"],

    // publicPath: '/js/',
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {

    }
  }
}
