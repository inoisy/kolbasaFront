// import axios from './axios'
const apolloFetch = require('apollo-fetch');
let data // simple data cache
// console.log("data", data)
import Vue from 'vue'
const backendUrl = process.env.BACKEND_URL || `https://api.prodaem-kolbasu.ru`
// console.log("backendUrl", backendUrl)
// Vue.prototype.$getCachedData =  async function () {
//     console.log("getCachedData -> getCachedData")
//     // return async function () {
//     if (data) { // get data from cache if exists
//       console.log("data Cached")
//       return data
//     } else { // else get data from API
//       console.log("else get data from API")

//       const query = `
//           {
//             contact {
//               phone
//               email
//               addressText
//               addressCoords
//               accessTime
//             }
//             categories(sort: "name:asc", limit: 999) {
//               id
//               name
//               slug
//               parent {
//                 id
//               }
//               children {
//                 id
//                 name
//                 slug
//                 img {
//                   url
//                 }
//               }
//               img {
//                 url
//               }
//             }
//             manufacturers(sort: "name:asc", limit:999) {
//               id
//               name
//               slug

//               img {
//                 url
//               }
//             }
//           }
//         `
//       const fetchApollo = apolloFetch.createApolloFetch({
//         uri: backendUrl + '/graphql'
//       });

//       const {
//         data: dataFetched
//       } = await fetchApollo({
//         query
//       })
//       if (dataFetched) {
//         data = dataFetched
//         return data
//         //   resolve(data)
//       } else {
//         //   reject()
//       }
//       // const extraFilePath = path.join(builder.nuxt.options.srcDir, 'assets', 'generalData.json')
//       // await fs.writeFileSync(extraFilePath, JSON.stringify(data.data))

//       // axios
//       //   .request({
//       //     url: '/api/get-data'
//       //   })
//       //   .then(response => {
//       //     data = response.data // set data, so new getData() will take data from cache
//       //     resolve(data)
//       //   })
//       //   .catch(reject)
//     }
//   }

const MyPlugin = {
  install(Vue, options) {
    Vue.prototype.$myAddedProperty
    Vue.prototype.$getCachedData = async function () {
      //   console.log("getCachedData -> getCachedData", Vue.prototype.$myAddedProperty)
      // return async function () {
      if (Vue.prototype.$myAddedProperty) { // get data from cache if exists
        console.log("data Cached")
        return Vue.prototype.$myAddedProperty
      } else { // else get data from API
        console.log("else get data from API")

        const query = `
          {
            contact {
              phone
              email
              addressText
              addressCoords
              accessTime
            }
            categories(sort: "name:asc", limit: 999) {
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
            manufacturers(sort: "name:asc", limit:999) {
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
          uri: backendUrl + '/graphql'
        });

        const {
          data: dataFetched
        } = await fetchApollo({
          query
        })
        if (dataFetched) {
          Vue.prototype.$myAddedProperty = dataFetched
          return dataFetched
          //   resolve(data)
        } else {
          //   reject()
        }
        // const extraFilePath = path.join(builder.nuxt.options.srcDir, 'assets', 'generalData.json')
        // await fs.writeFileSync(extraFilePath, JSON.stringify(data.data))

        // axios
        //   .request({
        //     url: '/api/get-data'
        //   })
        //   .then(response => {
        //     data = response.data // set data, so new getData() will take data from cache
        //     resolve(data)
        //   })
        //   .catch(reject)
      }
    }
    Vue.mixin({
      mounted() {
        console.log('Mounted!');
      }
    });

  }
};

Vue.use(MyPlugin)
