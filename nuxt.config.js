const pkg = require('./package')
const os = require("os");
const sitename = "http://prodaem-kolbasu.ru";
const imageUrl = process.env.IMAGE_BASE_URL || process.env.BACKEND_URL || "https://kolbasaback.herokuapp.com"
const backendUrl = process.env.BACKEND_URL || "https://kolbasaback.herokuapp.com"
// const imageBaseUrl = process.env.IMAGE_BASE_URL || "http://cdn.yakutov.com"

module.exports = {
  mode: 'universal',
  env: {
    baseUrl: backendUrl,
    imageBaseUrl: imageUrl
  },
  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
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
        href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
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
    'nuxt-vuex-localstorage'
    // ['@nuxtjs/sitemap', {
    //   gzip: true,
    // async routes() {
    //   let routes = []

    //   const {
    //     data: manufacturers
    //   } = await axios.get(backendUrl + '/manufacturers?_limit=99999')
    //   console.log("TCL: routes -> manufacturers", manufacturers)
    //   for (let item of manufacturers) {
    //     routes.push(`/manufacturers/${item.slug}`)
    //   }


    //   const {
    //     data: pages
    //   } = await axios.get(backendUrl + '/pages?parent.slug=about')
    //   console.log("TCL: routes -> pages", pages)
    //   for (let item of pages) {
    //     routes.push(`/about/${item.slug}`)
    //   }

    //   const {
    //     data: categories
    //   } = await axios.get(backendUrl + '/categories?ismain=true&_limit=99999')
    //   for (let category of categories) {
    //     routes.push(`/catalog/${category.slug}`)

    //   }
    //   for (let category of categories) {
    //     for (let subcategory of category.child) {
    //       routes.push(`/catalog/${category.slug}/${subcategory.slug}`)
    //     }
    //   }
    //   const {
    //     data: products
    //   } = await axios.get(backendUrl + '/products?_limit=99999')
    //   // console.log("TCL: routes ->  products.length", products.length)
    //   for (let product of products) {
    //     routes.push(`/product/${product.slug}`)
    //   }

    //   return routes
    // }

    // }],
    // ['@nuxtjs/robots', {
    //   UserAgent: '*',
    //   Disallow: '/'
    // }],
    // ["nuxt-ssr-cache", {
    // if you're serving multiple host names (with differing
    // results) from the same server, set this option to true.
    // (cache keys will be prefixed by your host name)
    // if your server is behind a reverse-proxy, please use
    // express or whatever else that uses 'X-Forwarded-Host'
    // header field to provide req.hostname (actual host name)
    // useHostPrefix: true,

    // store: {
    //   type: 'redis',
    //   host: 'localhost',
    //   ttl: 4 * 60 * 60,
    //   configure: [
    //     // these values are configured
    //     // on redis upon initialization
    //     ['maxmemory', '200mb'],
    //     ['maxmemory-policy', 'allkeys-lru'],
    //   ],

    // },

    // pages: [
    //   // these are prefixes of pages that need to be cached
    //   // if you want to cache all pages, just include '/'
    //   "/"
    // ],
    // }],
  ],

  /*
   ** Build configuration
   */
  build: {
    publicPath: '/js/',
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {

    }
  }
}
