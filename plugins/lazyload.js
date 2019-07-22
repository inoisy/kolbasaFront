import Vue from 'vue'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload)

// or with options
Vue.use(VueLazyload, {
  preLoad: 1.3,
  // error: 'dist/error.png',
  // loading: 'http://localhost:1337/uploads/78345b5372924b35a7c0588742b490b0.gif',
  attempt: 1
})
