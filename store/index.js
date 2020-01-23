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
  pageFilterInc(state) {
    state.sessionStorage.pageFilter++
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
  easyProducts(state, item) {
    state.sessionStorage.easyProducts = item
  },
  pushEasyProducts(state, items) {
    state.sessionStorage.easyProducts = [...state.sessionStorage.easyProducts, ...items]
  },
  async addToBasket(state, product) {
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

    state.localStorage.basket = _.omit(basket, product.id)
  },
  removeFromBasket(state, product) {
    const basket = state.localStorage.basket
    const count = basket[product.id].count - 1
    if (count < 1) {

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

    }

  },

}
export const strict = false
export const actions = {
  async fetchGeneralInfo(ctx) {
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
              img{
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
    })
    const result = {
      categories: generalData.categories,
      manufacturers: generalData.manufacturers,
      contacts: generalData.contacts[0]
    }
    await ctx.commit("generalInfo", result)
    return result
    // } else {
    //   return ctx.state.sessionStorage.generalInfo
    // }

  },
  async fetchCategory(ctx, params) {

    // if (ctx.state.sessionStorage.category.slug !== params.slug) {
    const categoryFind = ctx.state.sessionStorage.generalInfo.categories.find(item => item.slug === params.slug)

    let client = this.app.apolloProvider.defaultClient;
    if (categoryFind && categoryFind.id) {
      const {
        data: categoryData
      } = await client.query({
        query: gql `
        query CategoryQuery( $id: ID! ) {
          category(id: $id) {
            description
            name
            slug
            content
            img {
              url
            }
            products{
              id
              name
              slug
              weight
              priceNum
              discountPrice
              isDiscount
              isHalal
              category {
                slug
              }
              img {
                url
              }
              manufacturer {
                name
                img {
                  url
                }
              }
            }
            parent {
              id
              slug
              name
              children {
                id
                name
                slug
              }
            }
            children{
              id
              name
              slug
              products(limit:25){
                id
                name
                slug
                weight
                priceNum
                discountPrice
                isDiscount
                isHalal
                category {
                  slug
                }
                img {
                  url
                }
                manufacturer {
                  name
                  img {
                    url
                  }
                }
              }
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

    // } else {
    //   return ctx.state.sessionStorage.category
    // }

  },
  async fetchProduct(ctx, params) {
    // await ctx.commit("product", {});
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

    let query = `category=${categoryFind.id}`
    const page = ctx.state.sessionStorage.pageFilter
    // const manufacturers = ctx.state.sessionStorage.manufacturerFilter
    const sort = ctx.state.sessionStorage.sortFilter.sort
    if (page) {
      query = query + `&_start=${(page - 1) * 20}`
    }

    // if (manufacturers && manufacturers.length > 0) {
    //   query = query + manufacturers.map(item => `&manufacturer=${item}`).join('')
    // }

    if (sort && sort === "price") {
      query = query + `&_sort=priceNum:desc`
    } else {
      query = query + `&_sort=name:asc`
    }

    const limit = params.limit ? params.limit : 20
    const {
      data: productsData
    } = await this.$axios.get(`/products?` + query + "&_limit=" + limit)
    // const {
    //   data: productsCount
    // } = await this.$axios.get(`/products/count?` + query)

    await ctx.commit("products", {
      items: productsData,
      // count: productsCount
    });

    await ctx.commit('loading', false)
    return {
      items: productsData,
      // count: productsCount
    }
  },
  async easyFetchProducts(ctx, params) {
    console.log("TCL: easyFetchProducts -> params", params)
    // await ctx.commit("easyProducts", {
    //   items: [],
    //   count: 0
    // });
    await ctx.commit('loading', true)


    const categoryFind = ctx.state.sessionStorage.generalInfo.categories.find(item => item.slug === params.slug)

    let query = `category=${categoryFind.id}`
    const page = ctx.state.sessionStorage.pageFilter
    // const manufacturers = ctx.state.sessionStorage.manufacturerFilter

    // console.log("TCL: easyFetchProducts -> manufacturer", manufacturer)
    const sort = ctx.state.sessionStorage.sortFilter.sort
    if (page) {
      query = query + `&_start=${(page - 1) * 20}`
    }
    const manufacturer = ctx.state.sessionStorage.manufacturerFilter
    const manufacturerId = ctx.state.sessionStorage.generalInfo.manufacturers.find(item => item.slug === manufacturer)
    if (manufacturerId) {
      query = query + `&manufacturer=${manufacturerId.id}`
    }
    // if (manufacturers && manufacturers.length > 0) {
    //   query = query + manufacturers.map(item => `&manufacturer=${item}`).join('')
    // }
    if (sort && sort === "price") {
      query = query + `&_sort=priceNum:desc`
    } else {
      query = query + `&_sort=name:asc`
    }

    const limit = params.limit ? params.limit : 20
    const {
      data: productsData
    } = await this.$axios.get(`/products?` + query + "&_limit=" + limit)
    // const {
    //   data: productsCount
    // } = await this.$axios.get(`/products/count?` + query)

    // let countcount = productsCount
    // products = productsData

    await ctx.commit("easyProducts", productsData);

    await ctx.commit('loading', false)
    return productsData
  },
  async easyFetchMoreProducts(ctx, params) {
    await ctx.commit('loading', true)


    const categoryFind = ctx.state.sessionStorage.generalInfo.categories.find(item => item.slug === params.slug)

    let query = `category=${categoryFind.id}`
    const page = ctx.state.sessionStorage.pageFilter
    // const manufacturers = ctx.state.sessionStorage.manufacturerFilter
    const manufacturer = ctx.state.sessionStorage.manufacturerFilter
    const sort = ctx.state.sessionStorage.sortFilter.sort
    if (page) {
      query = query + `&_start=${(page - 1) * 20}`
    }

    // if (manufacturers && manufacturers.length > 0) {
    //   query = query + manufacturers.map(item => `&manufacturer=${item}`).join('')
    // }

    const manufacturerId = ctx.state.sessionStorage.generalInfo.manufacturers.find(item => item.slug === manufacturer)
    if (manufacturerId) {
      query = query + `&manufacturer=${manufacturerId.id}`
    }
    if (sort && sort === "price") {
      query = query + `&_sort=priceNum:desc`
    } else {
      query = query + `&_sort=name:asc`
    }

    const limit = params.limit ? params.limit : 20
    const {
      data: productsData
    } = await this.$axios.get(`/products?` + query + "&_limit=" + limit)
    // const {
    //   data: productsCount
    // } = await this.$axios.get(`/products/count?` + query)

    // let countcount = productsCount
    // products = productsData

    // await ctx.commit("pushEasyProducts", productsData);

    await ctx.commit('loading', false)
    return productsData
  }
}
