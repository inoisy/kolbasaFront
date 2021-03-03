// require('dotenv').config()
// const path = require('path')
// const fs = require('fs')
// const apolloFetch = require('apollo-fetch');
const axios = require('axios')

const routes = require("./routes")
// const redirectRoutes = require("./redirectRoutes")

const sitename = `https://prodaem-kolbasu.ru`;
const backURL = `https://api.prodaem-kolbasu.ru`
const backendUrl = process.env.BACKEND_URL || backURL
const imageUrl = process.env.IMAGE_BASE_URL || process.env.BACKEND_URL || backURL


const name = "Альянс Фуд"
const description = "Альянс Фуд. Колбаса и другие мясные изделия оптом по ценам производителя. Самовывоз со склада в Москве. Доставка по РФ и СНГ."

async function generateRoutes() {

  let routes = []
  const {
    data: pages
  } = await axios.get(backendUrl + '/pages?_limit=99999')
  for (let item of pages) {
    routes.push(`${item.slug}`)
  }
  const {
    data: manufacturers
  } = await axios.get(backendUrl + '/manufacturers?_limit=99999')
  for (let item of manufacturers) {
    routes.push(`/manufacturers/${item.slug}`)
  }
  const {
    data: categories
  } = await axios.get(backendUrl + '/categories?_limit=99999')
  for (let category of categories) {
    routes.push(`/catalog/${category.slug}`)
    // if (category.manufacturers.length) {
    //   for (manufacturer of category.manufacturers) {
    //     routes.push(`/catalog/${category.slug}?manufacturer=${manufacturer.slug}`)
    //   }
    // }
    // if (category.product_types.length) {
    //   for (type of category.product_types) {
    //     routes.push(`/catalog/${category.slug}?type=${type.slug}`)
    //   }
    // }
  }
  const {
    data: products
  } = await axios.get(backendUrl + '/products?_limit=99999')

  for (let product of products) {
    if (product.category && product.category.slug && product.slug) {
      routes.push(`/catalog/${product.category.slug}/${product.slug}`)
    } else {
      console.log("no category", product.name)
    }


  }
  return routes

}

module.exports = async () => {
  const isDev = process.env.NODE_ENV !== 'production';
  // const generateRoutesArr = await generateRoutes()
  // console.log("🚀 ~ file: nuxt.config.js ~ line 70 ~ module.exports= ~ generateRoutes", generateRoutesArr.length)
  return {
    // target: "static",
    env: {
      name: name,
      description: description,
      baseUrl: backendUrl,
      imageBaseUrl: imageUrl
    },
    publicRuntimeConfig: {
      name: name,
      description: description,
      baseUrl: backendUrl,
      imageBaseUrl: imageUrl,
      siteUrl: sitename
    },

    // generate: {
    //   interval: 300,
    //   dir: 'public',
    //   subFolders: false,
    //   fallback: "404.html",
    //   routes: generateRoutesArr
    // },
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
    // components: true,
    components: [
      { path: '~/components', extensions: ['vue'] }
    ], // true,
    /*
     ** Global CSS
     */
    css: [
      '~/assets/style/app.scss'
    ],
    plugins: [
      '@/plugins/strapi.js',
      // '~/plugins/directives.js'
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
            path: "/catalog/discount",
            component: resolve(__dirname, 'customPages/catalog/discount.vue'), //customPages\catalog\discount.vue
            name: "catalog-discount",
            children: [{
              path: ":slug?",
              component: resolve(__dirname, 'customPages/catalog/_category/_slug.vue'),
              name: "catalog-discount-slug"
            }]
          },
          {
            path: "/catalog/halal",
            component: resolve(__dirname, 'customPages/catalog/halal.vue'),//customPages\catalog\halal.vue
            name: "catalog-halal",
            children: [{
              path: ":slug?",
              component: resolve(__dirname, 'customPages/catalog/_category/_slug.vue'),
              name: "catalog-halal-slug"
            }]
          },
          {
            path: "/catalog/:category",
            component: resolve(__dirname, 'customPages/catalog/_category.vue'),
            name: "catalog-category",
            children: [{
              path: ":slug?",
              component: resolve(__dirname, 'customPages/catalog/_category/_slug.vue'),
              name: "catalog-category-slug"
            }]
          },

          {
            path: "/manufacturers/:manufSlug",
            component: resolve(__dirname, 'customPages/manufacturers/_slug.vue'),//customPages\manufacturers\_slug.vue
            name: "manufacturers-manufSlug",
            children: [{
              path: ":slug?",
              component: resolve(__dirname, 'customPages/catalog/_category/_slug.vue'),
              name: "manufacturers-manufSlug-slug"
            }]
          },
        )
      }
    },
    buildModules: [
      '~/modules/hook.js',
      // https://github.com/nuxt-community/style-resources-module
      // '@nuxtjs/eslint-module',
      '@nuxtjs/style-resources',
      '@nuxtjs/vuetify',
      ['@aceforth/nuxt-optimized-images', {
        inlineImageLimit: 1000,
        imagesName: ({ isDev }) => isDev ? '[path][name][hash:optimized].[ext]' : 'img/[contenthash:7].[ext]',
        responsiveImagesName: ({ isDev }) => isDev ? '[path][name]--[width][hash:optimized].[ext]' : 'img/[contenthash:7]-[width].[ext]',
        handleImages: ['jpeg', 'png', 'svg', 'webp'],
        optimizeImages: true,
        optimizeImagesInDev: true, // TODO
        defaultImageLoader: 'img-loader',
        mozjpeg: {
          quality: 40,
        },
        optipng: {
          optimizationLevel: 3,
        },
        pngquant: false,
        // gifsicle: {
        //   interlaced: true,
        //   optimizationLevel: 3,
        // },
        svgo: {
          // enable/disable svgo plugins here
        },
        webp: {
          preset: 'default',
          quality: 60,
        },
      },]
    ],
    /*
     ** Plugins to load before mounting the App
     */

    modules: [
      // 'nuxt-ssr-cache',
      '@nuxtjs/strapi',
      ['@nuxtjs/toast', {
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
      }],
      // ['nuxt-webfontloader', {
      //   google: {
      //     families: [
      //       'Montserrat:400,500,700',
      //       "Alice"
      //       // 'Montserrat Alternates:700'
      //     ],
      //     urls: [
      //       // for each Google Fonts add url + options you want
      //       // here add font-display option
      //       'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap',
      //       "https://fonts.googleapis.com/css2?family=Alice&display=swap"
      //       // 'https://fonts.googleapis.com/css2?family=Montserrat+Alternates:wght@700&display=swap'
      //     ]
      //     // families: ['Montserrat:400,500,700']
      //     // "https://fonts.googleapis.com/css2?family=Signika:wght@700&display=swap"
      //   }
      // }],
      // '@nuxtjs/sentry',
      'nuxt-vuex-localstorage',
      // ['@nuxtjs/google-analytics', {
      //   id: process.env.GOOGLE_ID
      // }],
      // [
      //   '@rkaliev/nuxtjs-yandex-metrika',
      //   {
      //     id: process.env.YANDEX_ID,
      //     clickmap: true,
      //     trackLinks: true,
      //     accurateTrackBounce: true,
      //     webvisor: true
      //   }
      // ],
      [
        "@nuxtjs/yandex-metrika",
        // "~/modules/yandex-metrika",
        {
          id: process.env.YANDEX_ID,
          clickmap: true,
          trackLinks: true,
          accurateTrackBounce: true,
          webvisor: true,
          useCDN: false,
          defer: true,
          // defer: false
        }
      ],

      // ['@nuxtjs/axios', {
      //   baseURL: backendUrl
      // }],
      ['@nuxtjs/apollo', {
        clientConfigs: {
          default: {
            httpEndpoint: backendUrl + '/graphql',
            persisting: true,
          },
        },
        includeNodeModules: true,

      }],
      ['nuxt-social-meta', {
        url: sitename,
        title: name,
        description: description,
        img: imageUrl + "/uploads/031ba5905e18488794851c8d512b1227.jpg",
        locale: 'ru_RU',
        themeColor: '#d50000'
      }],
      ['@nuxtjs/sitemap', {
        gzip: true,
        routes
      }],
      ['@nuxtjs/robots', {
        UserAgent: '*',
        Allow: '/',
        Sitemap: sitename + "/sitemap.xml"
      }],
      ['@nuxtjs/google-fonts', {
        families: {
          Montserrat: [400, 500, 700],
          Alice: true
        },
        // useStylesheet: true 400,600,800,  500,
        // display: "auto",
        // inject: true,
        // useStylesheet: true,
        // base64: true
      }]

    ],
    // cache: {
    //   // if you're serving multiple host names (with differing
    //   // results) from the same server, set this option to true.
    //   // (cache keys will be prefixed by your host name)
    //   // if your server is behind a reverse-proxy, please use
    //   // express or whatever else that uses 'X-Forwarded-Host'
    //   // header field to provide req.hostname (actual host name)
    //   useHostPrefix: false,
    //   pages: [
    //     // these are prefixes of pages that need to be cached
    //     // if you want to cache all pages, just include '/'
    //     '/',
    //   ],

    //   // key(route, context) {
    //   //   // custom function to return cache key, when used previous
    //   //   // properties (useHostPrefix, pages) are ignored. return 
    //   //   // falsy value to bypass the cache
    //   // },

    //   store: {
    //     type: 'memory',

    //     // maximum number of pages to store in memory
    //     // if limit is reached, least recently used page
    //     // is removed.
    //     max: 100,

    //     // number of seconds to store this page in cache
    //     ttl: 60 * 60 * 60 * 24,
    //   },
    // },
    strapi: {
      // Options
      url: backendUrl,
      expires: '365d',
      key: "jwt",
      entities: ["orders"]
    },
    // toast: {
    //   theme: "outline",
    //   position: 'top-right',
    //   duration: 8000,
    //   iconPack: 'callback',
    //   action: {
    //     text: "Закрыть",
    //     onClick: (e, toastObject) => {
    //       toastObject.goAway(0);
    //     },
    //   },
    // },
    vuetify: {
      customVariables: ["~/assets/variables.scss"],
      treeShake: true,
      options: {
        customProperties: true
      },
      defaultAssets: false,
      optionsPath: './vuetify.options.js'
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
    // sentry: {
    //   dsn: 'https://e3280a17ba94410780a38ca12ccc2e6e@o413020.ingest.sentry.io/5295312', // Enter your project's DSN here
    //   config: {}, // Additional config
    // },
    ...(!isDev && {
      modern: 'client'
    }),
    render: {
      // http2: {
      //   push: true
      // },
      // asyncScripts: true,
      resourceHints: false,
    },
    build: {
      followSymlinks: false,
      terser: {
        extractComments: false // default was LICENSES
      },
      // ...(!isDev && {
      //   extractCSS: {
      //     ignoreOrder: true
      //   }
      // }),

      // analyze: true,
      // babel: {
      //   sourceType: 'unambiguous',
      //   presets: [
      //     ["@nuxt/babel-preset-app", {
      //       corejs: {
      //         version: 2
      //       }
      //     }],
      //   ]
      // },
      transpile: ['@nuxtjs/apollo', '@nuxtjs/robots',
        '@nuxtjs/sentry', '@nuxtjs/sitemap',
        '@nuxtjs/strapi', '@nuxtjs/toast',
        '@nuxtjs/yandex-metrika', 'graphql-tag',
        'nuxt-social-meta',
        'nuxt-ssr-cache', 'nuxt-vuex-localstorage',
        'vue', 'vue-infinite-loading',
        'vue-lazy-hydration', 'vue-server-renderer',
        'vue-template-compiler', 'vue-the-mask',
        'vue-yandex-maps', 'vuelidate']
      // transpile: ["@nuxtjs/vuetify", /^aos/, /^@nuxtjs.*/, "nuxt-vuex-localstorage"],
      // extend(config, ctx) { }
    }
  }
}