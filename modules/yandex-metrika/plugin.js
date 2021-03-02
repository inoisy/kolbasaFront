// export default ({ app: { router }, $config }) => {

//   const { useRuntimeConfig, metrikaUrl, ...options } = <%= JSON.stringify(options) %>
//   if ($config && useRuntimeConfig) {
//     Object.assign(options, $config[useRuntimeConfig])
//   }
//   const { id, ...metrikaOptions } = options

//   let ready = false
//   const basePath = (router.options.base || '/').replace(/\/$/, '')

//   router.onReady(() => {
//     // Mark when the router has completed the initial navigation.z
//     ready = true
//   })

//   function create() {

//     if (!ready) {
//       // Don't record a duplicate hit for the initial navigation.
//       (function (m, e, t, r, i, k, a) {
//         m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) };
//         m[i].l = 1 * new Date(); k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
//       })
//         (window, document, "script", metrikaUrl, "ym")

//       ym(id, "init", metrikaOptions)
//     }
//     router.afterEach((to, from) => {
//       ym(id, 'hit', basePath + to.fullPath, {
//         referer: basePath + from.fullPath
//         // TODO: pass title: <new page title>
//         // This will need special handling because router.afterEach is called *before* DOM is updated.
//       })
//     })
//   }
//   if (window.ym === undefined) {
//     create()
//   }
// }


export default ({ app: { router }, $config }) => {
  const { useRuntimeConfig, metrikaUrl, ...options } = <%= JSON.stringify(options) %>
  if ($config && useRuntimeConfig) {
    Object.assign(options, $config[useRuntimeConfig])
  }
  const { id, ...metrikaOptions } = options
  // console.log("🚀 ~ file: plugin.js ~ line 8 ~ metrikaOptions", metrikaOptions)

  let ready = false
  const basePath = (router.options.base || '/').replace(/\/$/, '')

  // router.onReady(() => {
  //   // console.log("router ready")
  //   //   // Mark when the router has completed the initial navigation.
  //   //   ready = true
  // })

  function create() {
    // console.log("create ");
    if (!ready) {
      // console.log("create !ready ");
      // Don't record a duplicate hit for the initial navigation. k.async = 1, k.defer = 1,
      (function (m, e, t, r, i, k, a) {
        m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments) };
        m[i].l = 1 * new Date(); k = e.createElement(t), k.async = 1, k.src = r, e.body.appendChild(k) // a = e.getElementsByTagName(t)[0], a.parentNode.insertBefore(k, a)//a.parentNode.appendChild(k) // k = e.createElement(t), a = e.getElementsByTagName(t)[0], k.async = 1, k.src = r, a.parentNode.insertBefore(k, a)
      })
        (window, document, "script", metrikaUrl, "ym")
      // console.log("ym init ")
      ym(id, "init", metrikaOptions)
      ready = true;
    }
    router.afterEach((to, from) => {
      // console.log("ym hit ", this)
      ym(id, 'hit', basePath + to.fullPath, {
        referer: basePath + from.fullPath
        // TODO: pass title: <new page title>
        // This will need special handling because router.afterEach is called *before* DOM is updated.
      })
    });
    // var next = (to, from) => {
    //   console.log("🚀 ~ file: plugin.js ~ line 83 ~ next ~ from", from)
    //   console.log("🚀 ~ file: plugin.js ~ line 83 ~ next ~ to", to)

    // }
    // router.beforeEach((to, from, next) => {
    //   console.log("🚀 ~ file: plugin.js ~ line 83 ~ router.beforeEach ~ to", to)
    //   next(to.fullPath, from.fullPath)
    // })
  }
  window.onNuxtReady((ctx) => {
    // console.log('Nuxt.js is ready and mounted ctx')
    // console.log('Nuxt.js is ready and mounted window', window)
    if (window.ym === undefined) {
      create()
    }
  })
}
