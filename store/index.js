import gql from "graphql-tag";
const baseUrl = process.env.baseUrl
export const mutations = {
  manufacturerFilter(state, item) {
    state.sessionStorage.manufacturerFilter = item
  },
  sortFilter(state, item) {
    state.sessionStorage.sortFilter = item
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
  basket(state, item) {
    console.log("TCL: basket -> item", item)
    // state.localStorage.basket.add(item)
    console.log("TCL: basket -> state.localStorage.basket", state.localStorage.basket)
    const find = state.localStorage.basket.some(product => product.id === item.id)
    if (!find) {
      item.count = 1
      state.localStorage.basket.push(item)
    }
  },
  removeFromBasket(state, productId) {
    state.localStorage.basket = state.localStorage.basket.filter(item => {
      return String(item.id) !== String(productId)
    })
    // console.log("TCL: removeFromBasket -> state.localStorage.basket.filter(item => item._id == productId)", state.localStorage.basket.filter(item => item._id == productId))
  },
  changeBasket(state, object) {
    // console.log("TCL: changeBasket -> object", object)

    if (object.val < 1) {
      state.localStorage.basket = state.localStorage.basket.filter(item => {
        return String(item.id) !== String(object.id)
      })
    } else {
      const findIndex = state.localStorage.basket.findIndex(item => item.id === object.id)
      const findItem = state.localStorage.basket[findIndex]
      // console.log("TCL: changeBasket -> findItem", findItem)
      const count = object.val
      const newObj = {
        ...findItem,
        count
      }
      state.localStorage.basket[findIndex] = newObj
    }


  },
  incrementBasket(state, productId) {
    const findBasket = state.localStorage.basket.findIndex(item => item.id === productId)
    const count = state.localStorage.basket[findBasket].count + 1
    console.log("TCL: incrementBasket -> count", count)
    state.localStorage.basket[findBasket].count = count
    console.log("TCL: incrementBasket -> findBasket", findBasket)
    //  = state.localStorage.basket.filter(item => {
    //   return String(item.id) !== String(productId)
    // })
    // console.log("TCL: removeFromBasket -> state.localStorage.basket.filter(item => item._id == productId)", state.localStorage.basket.filter(item => item._id == productId))
  },
  decrementBasket(state, productId) {
    const findBasket = state.localStorage.basket.findIndex(item => item.id === productId)
    const count = state.localStorage.basket[findBasket].count - 1
    if (count < 1) {
      state.localStorage.basket = state.localStorage.basket.filter(item => {
        return String(item.id) !== String(productId)
      })

    } else {
      state.localStorage.basket[findBasket].count = count
      console.log("TCL: decrementBasket -> findBasket", findBasket)
    }

    // console.log("TCL: removeFromBasket -> state.localStorage.basket.filter(item => item._id == productId)", state.localStorage.basket.filter(item => item._id == productId))
  }
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
          categories {
            id
            name
            slug
            img {
              url
            }
          }
          manufacturers {
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
    console.log("TCL: fetchCategory -> manufacturer", ctx.state.sessionStorage.category.slug === params.slug)
    // console.log("TCL: fetchCategory -> slug", params.slug)
    if (ctx.state.sessionStorage.category.slug !== params.slug) {
      const categoryFind = ctx.state.sessionStorage.generalInfo.categories.find(item => item.slug === params.slug)
      let client = this.app.apolloProvider.defaultClient;

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
      let products = []
      let count
      let query = `category=${categoryFind.id}`
      if (params.manufacturer && params.manufacturer.length > 0) {
        query = query + params.manufacturer.map(item => `&manufacturer=${item}`).join('')
      }
      if (params.page) {
        query = query + `&_start=${(params.page-1)*20}`
      }
      if (params.sort && params.sort === "price") {
        query = query + `&_sort=price:asc`
      } else {
        query = query + `&_sort=name:asc`
      }
      console.log("TCL: query", query)

      const {
        data: productsData
      } = await this.$axios.get(`/products?` + query)
      const {
        data: productsCount
      } = await this.$axios.get(`/products/count?` + query)

      count = productsCount
      products = productsData

      await ctx.commit("category", categoryData.category);
      await ctx.commit("products", {
        items: products,
        count: count
      });
      return categoryData.category
    } else {
      return ctx.state.sessionStorage.category
    }

  },
  async fetchProduct(ctx, params) {
    // console.log("TCL: fetchProduct -> params", params)

    const {
      data: product
    } = await this.$axios.get(
      `/products?slug=` + params.slug
    );
    // console.log("TCL: fetchProduct -> product", product)

    const productItem = product[0];
    await ctx.commit("product", productItem);

    return productItem
  },
  async fetchProducts(ctx, params) {
    const categoryFind = ctx.state.sessionStorage.generalInfo.categories.find(item => item.slug === params.slug)
    let products = []
    let count
    let query = `category=${categoryFind.id}`
    if (params.manufacturer && params.manufacturer.length > 0) {
      query = query + params.manufacturer.map(item => `&manufacturer=${item}`).join('')
    }
    if (params.page) {
      query = query + `&_start=${(params.page-1)*20}`
    }
    if (params.sort && params.sort === "price") {
      query = query + `&_sort=price:asc`
    } else {
      query = query + `&_sort=name:asc`
    }
    console.log("TCL: query", query)

    const {
      data: productsData
    } = await this.$axios.get(`/products?` + query)
    const {
      data: productsCount
    } = await this.$axios.get(`/products/count?` + query)

    count = productsCount
    products = productsData

    await ctx.commit("products", {
      items: products,
      count: count
    });

  }
}
