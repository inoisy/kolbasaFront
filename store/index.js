import gql from "graphql-tag";
const _ = require('lodash');
const baseUrl = process.env.baseUrl
export const mutations = {
  loading(state, item) {
    state.loading = item
  },
  manufacturerFilter(state, item) {
    state.sessionStorage.manufacturerFilter = item
  },
  sortFilter(state, item) {
    state.sessionStorage.sortFilter = item
  },
  pageFilter(state, item) {
    state.sessionStorage.pageFilter = item
  },
  generalInfo(state, item) {
    state.sessionStorage.generalInfo = item
  },
  category(state, item) {
    state.sessionStorage.category = item
  },
  product(state, item) {
    state.sessionStorage.product = item
  },
  products(state, item) {
    state.sessionStorage.products = item
  },
  async addToBasket(state, product) {
    console.log("TCL: addToBasket -> id", product.id)
    // console.log("TCL: addToBasket -> get", state.localStorage.basket[id])
    if (state.localStorage.basket[product.id]) {
      const count = state.localStorage.basket[product.id].count + 1
      const newItem = {
        [product.id]: {
          count: count,
          item: product
        }
      }
      state.localStorage.basket = {
        ...state.localStorage.basket,
        ...newItem
      }
    } else {
      const newItem = {
        [product.id]: {
          count: 1,
          item: product
        }
      }
      state.localStorage.basket = {
        ...state.localStorage.basket,
        ...newItem
      }
    }



  },
  deleteFromBasket(state, product) {
    const basket = state.localStorage.basket
    // const count = basket[product.id].count - 1
    // console.log("TCL: removeFromBasket -> count", count)
    // if (count < 1) {
    // const basket = state.localStorage.basket
    // let {
    //   id,
    //   ...basket
    // } = state.localStorage.basket
    // console.log("TCL: removeFromBasket -> basket", basket)
    // const productid = product.id
    // const basket = state.localStorage.basket
    // const {
    //   productid,
    //   ...basket
    // } = 

    state.localStorage.basket = _.omit(basket, product.id)
  },
  removeFromBasket(state, product) {
    const basket = state.localStorage.basket
    const count = basket[product.id].count - 1
    console.log("TCL: removeFromBasket -> count", count)
    if (count < 1) {
      // const basket = state.localStorage.basket
      // let {
      //   id,
      //   ...basket
      // } = state.localStorage.basket
      // console.log("TCL: removeFromBasket -> basket", basket)
      // const productid = product.id
      // const basket = state.localStorage.basket
      // const {
      //   productid,
      //   ...basket
      // } = 

      state.localStorage.basket = _.omit(basket, product.id)
    } else {
      const newItem = {
        [product.id]: {
          count: count,
          item: product
        }
      }
      state.localStorage.basket = {
        ...state.localStorage.basket,
        ...newItem
      }
      // const newBusket = state.localStorage.basket.filter(item => console.log("TCL: removeFromBasket -> item", item))
      // set(state.localStorage.basket, product.id, {
      //   count: count,
      //   item: product
      // })
      // {
      //   ...state.localStorage.basket,
      //   ...newItem
      // }
      // state.localStorage.basket.s
      // state.localStorage.basket = newBusket
    }
    //  let { page, ...query } = this.$route.query;
    // const newItem = {
    //   [id]: state.localStorage.basket[id] ? state.localStorage.basket[id] - 1 : 1
    // }
    // const newBusket = {
    //   ...state.localStorage.basket,
    //   ...newItem
    // }
    // state.localStorage.basket = newBusket
    //   state.localStorage.basket = state.localStorage.basket.filter(item => {
    //     return String(item.id) !== String(productId)
    //   })
    //   // console.log("TCL: removeFromBasket -> state.localStorage.basket.filter(item => item._id == productId)", state.localStorage.basket.filter(item => item._id == productId))
  },

}
export const strict = false
export const actions = {
  async fetchGeneralInfo(ctx) {
    // console.log("TCL: fetchGeneralInfo -> fetchGeneralInfo", Object.keys(ctx.state.sessionStorage.generalInfo).length)
    if (!ctx.state.sessionStorage.generalInfo || Object.keys(ctx.state.sessionStorage.generalInfo).length === 0) {
      // console.log("TCL: fetchGeneralInfo -> FETCH")
      let client = this.app.apolloProvider.defaultClient;
      const {
        data: generalData
      } = await client.query({
        query: gql `
        {
           contacts {
             phone
             email
             addressText
             addressCoords
             accessTime
           }
           promos {
             header
             content
             buttontext
             href
             img {
               url
             }
           }
          categories(sort: "name:asc") {
            id
            name
            slug
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
      })
      const result = {
        promos: generalData.promos,
        categories: generalData.categories,
        manufacturers: generalData.manufacturers,
        contacts: generalData.contacts[0]
      }
      await ctx.commit("generalInfo", result)
      return result
    } else {
      return ctx.state.sessionStorage.generalInfo
    }

  },
  async fetchCategory(ctx, params) {

    if (ctx.state.sessionStorage.category.slug !== params.slug) {
      const categoryFind = ctx.state.sessionStorage.generalInfo.categories.find(item => item.slug === params.slug)
      let client = this.app.apolloProvider.defaultClient;
      if (categoryFind && categoryFind.id) {
        const {
          data: categoryData
        } = await client.query({
          query: gql `
        query CategoryQuery( $id: ID! ) {
          category(id: $id) {
            manufacturers
            name
            slug
            img {
              url
            }
           
          }
        }
      `,
          variables: {
            id: categoryFind.id,
          }
        });

        await ctx.commit("category", categoryData.category);
        return categoryData.category
      }

    } else {
      return ctx.state.sessionStorage.category
    }

  },
  async fetchProduct(ctx, params) {
    // let client = this.app.apolloProvider.defaultClient;
    // const {
    //   data: productData
    // } = await client.query({
    //   variables: {
    //     slug: "varenaya-kolbasa-fermerskaya-so-shpikom"
    //   },
    //   query: gql `
    //     query ProductQuery($slug: String!) {
    //       products(where: {
    //         slug: $slug
    //       }) {
    //         id
    //       }
    //     }
    //     `
    // })
    // console.log("TCL: fetchProduct -> productData", productData)

    const {
      data: product
    } = await this.$axios.get(
      `/products?slug=` + params.slug
    );
    const productItem = product[0];
    await ctx.commit("product", productItem);

    return productItem
  },
  async fetchProducts(ctx, params) {
    await ctx.commit("products", {
      items: [],
      count: 0
    });
    await ctx.commit('loading', true)


    const categoryFind = ctx.state.sessionStorage.generalInfo.categories.find(item => item.slug === params.slug)

    // let client = this.app.apolloProvider.defaultClient;
    // const allManufacturerIds = ctx.state.sessionStorage.generalInfo.manufacturers.map(item => item.id)
    // const manufacturerId = params.manufacturer && params.manufacturer.length > 0 ? params.manufacturer : allManufacturerIds
    // console.log("TCL: fetchProducts -> manufacturerId", manufacturerId)
    // const start = params.page ? (params.page - 1) * 20 : 0
    // const sort = params.sort && params.sort === "price" ? "priceNum:desc" : "name:asc"


    // if () {
    //   query = query + `&_sort=price:asc`
    // } else {
    //   query = query + `&_sort=name:asc`
    // }
    // const {
    //   data: productsDataGraphQL
    // } = await client.query({
    //   query: gql `
    //     query ProductsQuery($categoryId: ID!, $manufacturerId: [ID!], $sort: String!, $start: Int!,$limit: Int!) {
    //         category(id: $categoryId) {
    //         products(where: {
    //           manufacturer: {
    //             id_in: $manufacturerId
    //           }
    //         }, sort: $sort, start: $start,limit:$limit) {
    //           id
    //           name
    //           slug
    //           description
    //           priceNum
    //           discountPrice
    //           isDiscount
    //           isHalal
    //           category{
    //             slug
    //           }
    //           img {
    //             url
    //           }
    //           manufacturer {
    //             name
    //             img {
    //               url
    //             }
    //           }
    //         }
    //       }
    //     }
    //   `,
    //   variables: {
    //     manufacturerId: manufacturerId,
    //     categoryId: categoryFind.id,
    //     sort: sort,
    //     start: start,
    //     limit: 20
    //   }
    // });
    // console.log("TCL: fetchProducts -> productsDataGraphQL", productsDataGraphQL)

    // let products = []

    let query = `category=${categoryFind.id}`
    const page = ctx.state.sessionStorage.pageFilter
    console.log("TCL: fetchProducts -> page", page)
    const manufacturers = ctx.state.sessionStorage.manufacturerFilter
    console.log("TCL: fetchProducts -> manufacturers", manufacturers)
    const sort = ctx.state.sessionStorage.sortFilter.sort
    console.log("TCL: fetchProducts -> sort", sort)
    if (page) {
      query = query + `&_start=${(page - 1) * 20}`
    }

    if (manufacturers && manufacturers.length > 0) {
      query = query + manufacturers.map(item => `&manufacturer=${item}`).join('')
    }

    if (sort && sort === "price") {
      query = query + `&_sort=priceNum:desc`
    } else {
      query = query + `&_sort=name:asc`
    }


    // let query = `category=${categoryFind.id}`
    // if (params.page) {
    //   query = query + `&_start=${(params.page - 1) * 20}`
    // }
    // if (params.manufacturer && params.manufacturer.length > 0) {
    //   query = query + params.manufacturer.map(item => `&manufacturer=${item}`).join('')
    // }

    // if (params.sort && params.sort === "price") {
    //   query = query + `&_sort=priceNum:desc`
    // } else {
    //   query = query + `&_sort=name:asc`
    // }
    console.log("TCL: Count query+", query)
    console.log("TCL: Count params+", params)
    const {
      data: productsData
    } = await this.$axios.get(`/products?` + query + "&_limit=20")
    const {
      data: productsCount
    } = await this.$axios.get(`/products/count?` + query)

    // let countcount = productsCount
    // products = productsData

    await ctx.commit("products", {
      items: productsData,
      count: productsCount
    });

    await ctx.commit('loading', false)
    return {
      items: productsData,
      count: productsCount
    }
  }
}
// changeBasket(state, object) {
//   console.log("TCL: changeBasket -> object", object)

//   if (object.val < 1) {
//     state.localStorage.basket = state.localStorage.basket.filter(item => {
//       return String(item.id) !== String(object.id)
//     })
//   } else {
//     const findIndex = state.localStorage.basket.findIndex(item => item.item.id === object.id)
//     console.log("TCL: changeBasket -> findIndex", findIndex)
//     const count = object.val
//     const newItem = {
//       ...state.localStorage.basket[findIndex].item,
//       count
//     }
//     console.log("TCL: changeBasket -> newItem", newItem)
//     // state.localStorage.basket.splice(findIndex, 1, newItem)
//     // const newArray = state.localStorage.basket.splice(findIndex, 1)
//     // console.log("TCL: changeBasket -> newArray", )
//     state.localStorage.basket[findIndex] = newItem
//   }


// },
// incrementBasket(state, productId) {
//   const findBasket = state.localStorage.basket.findIndex(item => item.id === productId)
//   const count = state.localStorage.basket[findBasket].count + 1
//   console.log("TCL: incrementBasket -> count", count)
//   state.localStorage.basket[findBasket].count = count
//   console.log("TCL: incrementBasket -> findBasket", findBasket)
//   //  = state.localStorage.basket.filter(item => {
//   //   return String(item.id) !== String(productId)
//   // })
//   // console.log("TCL: removeFromBasket -> state.localStorage.basket.filter(item => item._id == productId)", state.localStorage.basket.filter(item => item._id == productId))
// },
// decrementBasket(state, productId) {
//   const findBasket = state.localStorage.basket.findIndex(item => item.id === productId)
//   const count = state.localStorage.basket[findBasket].count - 1
//   if (count < 1) {
//     state.localStorage.basket = state.localStorage.basket.filter(item => {
//       return String(item.id) !== String(productId)
//     })

//   } else {
//     state.localStorage.basket[findBasket].count = count
//     console.log("TCL: decrementBasket -> findBasket", findBasket)
//   }

//   // console.log("TCL: removeFromBasket -> state.localStorage.basket.filter(item => item._id == productId)", state.localStorage.basket.filter(item => item._id == productId))
// }
