const pkg = require('./package')
const os = require("os");

const protocol = "https"
const sitename = `${protocol}://prodaem-kolbasu.ru`;
const backURL = `${protocol}://api.prodaem-kolbasu.ru`
const backendUrl = process.env.BACKEND_URL || backURL
const imageUrl = process.env.IMAGE_BASE_URL || process.env.BACKEND_URL || backURL

// const imageBaseUrl = process.env.IMAGE_BASE_URL || "http://cdn.yakutov.com"
const axios = require('axios')

module.exports = {
  mode: 'universal',
  env: {
    baseUrl: backendUrl,
    imageBaseUrl: imageUrl
  },
  generate: {
    interval: 300,
    dir: 'public',
    subFolders: false,
    fallback: "404.html",
    async routes() {
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
      for (let item of categories) {
        routes.push(`/catalog/${item.slug}`)
      }
      for (let category of categories) {
        //  routes.push(`/catalog/${item.slug}`)
        for (let product of category.products) {
          routes.push(`/catalog/${category.slug}/${product.slug}`)
        }
      }


      return routes
    }
  },

  /*
   ** Headers of the page
   */
  head: {
    title: 'Альянс Фуд',
    titleTemplate: '%s - Альянс Фуд',
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
        content: pkg.description
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
    '@/plugins/vuetify',
    "@/plugins/lazyload.js",
    {
      src: '@/plugins/aos.js',
      ssr: false
    }, {
      src: "@/plugins/swiper.js",
      ssr: false
    },
  ],
  // robots: ,
  // cache: ,
  /*
   ** Nuxt.js modules
   */
  modules: [
    [
      '@nuxtjs/yandex-metrika',
      {
        id: '54918895',
        webvisor: true,
        // clickmap:true,
        // useCDN:false,
        // trackLinks:true,
        // accurateTrackBounce:true,
      }
    ],
    ['vue-yandex-maps/nuxt', { // you may define your apiKey, lang and version or skip this.
      apiKey: 'df1793f7-7dbf-4c12-abe4-47fcdf2861b5',
      lang: 'ru_RU',
      version: '2.1'
    }],
    ['@nuxtjs/markdownit', {
      preset: 'default',
      linkify: true,
      breaks: true,
      injected: true
    }],
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
      title: 'Оптовая продажа колбасы',
      description: 'Оптовая продажа колбасы в Москве и МО. Доставка в регионы.',
      img: imageUrl + "main.jpg",
      locale: 'ru_RU',
      // twitter: '@UserName',
      themeColor: '#d50000'
    }],
    'portal-vue/nuxt',
    'nuxt-vuex-localstorage',
    '@nuxtjs/redirect-module',

    // Redirect option here

    ['@nuxtjs/sitemap', {
      gzip: true,
      async routes() {
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
        for (let item of categories) {
          routes.push(`/catalog/${item.slug}`)
        }
        for (let category of categories) {
          //  routes.push(`/catalog/${item.slug}`)
          for (let product of category.products) {
            routes.push(`/catalog/${category.slug}/${product.slug}`)
          }
        }


        return routes
      }

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
          //   // these are prefixes of pages that need to be cached
          //   // if you want to cache all pages, just include '/'
          "/"
        ],
      },

    ],
  ],
  redirect: [{
    from: '^/catalog/konservy.*',
    to: '/catalog/polufabrikaty'
  }, {
    from: '^/catalog/livery.*',
    to: '/catalog/pashtety-zelcy-studni'
  }, {
    from: '^/catalog/narezka.*',
    to: '/catalog/syrokopchenaya-kolbasa'
  }, {
    from: '^/catalog/pashtety.*',
    to: '/catalog/pashtety-zelcy-studni'
  }, {
    from: '^/catalog/polufabrikaty.*',
    to: '/catalog/polufabrikaty'
  }, {
    from: '^/catalog/studni.*',
    to: '/catalog/pashtety-zelcy-studni'
  }, {
    from: '^/catalog/delikatesy.*',
    to: '/catalog/delikatesy-vetchina-i-kopchenosti'
  }, {
    from: '^/catalog/izdeliya-iz-pticy.*',
    to: '/catalog/delikatesy-vetchina-i-kopchenosti'
  }, {
    from: '^/catalog/delikatesy.*',
    to: '/catalog/delikatesy-vetchina-i-kopchenosti'
  }, {
    from: '^/catalog/kolbasy.*',
    to: '/catalog/varenaya-kolbasa'
  }, {
    from: '^/catalog/kolbasy/varenye.*',
    to: '/catalog/varenaya-kolbasa'
  }, {
    from: '^/catalog/kolbasy/vareno-kopchenye.*',
    to: '/catalog/varyono-kopchenye-i-polukopchyonye-kolbasy'
  }, {
    from: '^/catalog/kolbasy/vetchiny.*',
    to: '/catalog/delikatesy-vetchina-i-kopchenosti'
  }, {
    from: '^/catalog/kolbasy/polukopchenye.*',
    to: '/catalog/varyono-kopchenye-i-polukopchyonye-kolbasy'
  }, {
    from: '^/catalog/kolbasy/syrokopchenye.*',
    to: '/catalog/syrokopchenaya-kolbasa'
  }, {
    from: '^/catalog/proizvoditeli/vegus.*',
    to: '/manufacturers/vegus'
  }, {
    from: '^/catalog/proizvoditeli/vladimirskij-standart.*',
    to: '/manufacturers/vladimirskiy-standart'
  }, {
    from: '^/catalog/proizvoditeli/myasnoj-dom-borodina.*',
    to: '/manufacturers/mdb'
  }, {
    from: '^/catalog/proizvoditeli/kolomenskij-myasokombinat.*',
    to: '/manufacturers/kolomenskoe'
  }, {
    from: '^/catalog/proizvoditeli/klinskij-mk.*',
    to: '/manufacturers/klinskiy'
  }, {
    from: '^/catalog/proizvoditeli/mikoyan.*',
    to: '/manufacturers/mikoyan'
  }, {
    from: '^/catalog/proizvoditeli/ostankino.*',
    to: '/manufacturers/ostankino'
  }, {
    from: '^/catalog/proizvoditeli/remit.*',
    to: '/manufacturers/remit'
  }, {
    from: '^/catalog/proizvoditeli/cherkizovskij-mk.*',
    to: '/manufacturers/cherkizovo'
  }, {
    from: '^/catalog/proizvoditeli/snezhana.*',
    to: '/manufacturers/snezhana'
  }, {
    from: '^/catalog/proizvoditeli/rublevskij-myasokombinat.*',
    to: '/manufacturers/rublevskiy'
  }],
  /*
   ** Build configuration
   */
  build: {
    // publicPath: '/js/',
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {

    }
  }
}
