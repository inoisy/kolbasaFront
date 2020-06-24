import gql from "graphql-tag";
export const mutations = {
  breadcrumbs(state, item) {
    state.sessionStorage.breadcrumbs = item
  },
  generalInfo(state, item) {
    state.sessionStorage.generalInfo = item
  },
  category(state, item) {
    state.sessionStorage.category = item
  },
  manufacturer(state, item) {
    state.sessionStorage.manufacturer = item
  },
  incrementBasket(state, id) {
    let product = state.localStorage.basket.find((product) => product.id === id);
    product.count += product.minimumOrder
  },
  addToBasket(state, product, qty) {
    console.log("addToBasket -> qty", qty)
    let cartProduct = state.localStorage.basket.find((item) => item.id === product.id);
    if (cartProduct) {
      cartProduct.count += cartProduct.minimumOrder;
    } else {
      state.localStorage.basket.push({
        ...product,
        count: product.minimumOrder
      })
    }
  },
  clearBasket(state) {
    state.localStorage.basket = []
  },
  changeBasket(state, params) {
    const {
      qty,
      id
    } = params
    let product = state.localStorage.basket.find((item) => item.id === id);
    if (product.minimumOrder > 1) {
      const ostatok = qty % product.minimumOrder
      if (ostatok !== 0) {
        product.count = qty + (product.minimumOrder - ostatok)
      } else {
        product.count = qty
      }
    } else {
      product.count = qty
    }
  },
  deleteFromBasket(state, id) {
    let cartProductIndex = state.localStorage.basket.findIndex((item) => item.id === id);
    state.localStorage.basket.splice(cartProductIndex, 1);
  },
  removeFromBasket(state, id) {
    let cartProduct = state.localStorage.basket.find((item) => item.id === id);
    cartProduct.count -= cartProduct.minimumOrder;
    if (cartProduct.count <= 0) {
      let cartProductIndex = state.localStorage.basket.findIndex((item) => item.id === id);
      state.localStorage.basket.splice(cartProductIndex, 1);
    }
  },
  saveBasket(state) {
    state.localStorage.basketStory.unshift(state.localStorage.basket)
  },
  setUserData(state, data) {
    state.localStorage.user = data
  }
}
export const strict = false
export const getters = {
  summa(state) {
    if (Array.isArray(state.localStorage.basket)) {
      const summ = state.localStorage.basket.reduce(
        (acc, product) => {
          acc =
            product.isDiscount && product.discountPrice ?
            acc + product.discountPrice * product.count :
            acc + product.count * product.priceNum;
          return acc;
        }, 0)

      return summ % 1 > 0 ? summ.toFixed(1) : summ
    } else {
      state.localStorage.basket = []
      return 0
    }
  },
  getParentCategories(state) {
    if (state.sessionStorage.generalInfo && state.sessionStorage.generalInfo.categories) {
      return state.sessionStorage.generalInfo.categories.filter(
        item => item.parent.length === 0
      )
    } else {
      return []
    }
  },
  getManufacturerId: state => slug => {
    if (!slug) return null
    const manufacturerFind = state.sessionStorage.generalInfo.manufacturers.find(
      item => item.slug === slug
    )
    return manufacturerFind ? manufacturerFind.id : null
  },
  getCategory: state => slug => {
    if (!slug) return null
    const category = state.sessionStorage.generalInfo.categories.find(
      item => item.slug === slug
    )
    if (!category) return null
    return category
  },
  getManufacturerById: state => id => {
    if (!id) return null
    const manufacturer = state.sessionStorage.generalInfo.manufacturers.find(
      item => item.id === id
    )
    if (!manufacturer) return null
    return manufacturer
  },
  getManufacturer: state => slug => {
    if (!slug) return null
    const manufacturer = state.sessionStorage.generalInfo.manufacturers.find(
      item => item.slug === slug
    )
    if (!manufacturer) return null
    return manufacturer
  }
}
export const actions = {
  async nuxtServerInit(state, ctx) {

    // if (ctx.isDev) {
    //   const query = require("~/generalInfo.gql")
    //   let client = this.app.apolloProvider.defaultClient;
    //   const {
    //     data
    //   } = await client.query({
    //     query
    //   })
    //   await state.commit("generalInfo", {
    //     ...data,
    //     contacts: data.contact
    //   })
    // } else {
    const data = await this._vm.$getCachedData()
    await state.commit("generalInfo", {
      ...data,
      contacts: data.contact
    })
    // }
  },
  async fetchManufacturer(ctx, id) {
    let client = this.app.apolloProvider.defaultClient;
    const {
      data: manufacturerData
    } = await client.query({
      variables: {
        id: id
      },
      query: gql `
          query ManufacturerQuery($id: ID!) {
            manufacturer(id: $id) {
              id
              name
              slug
              description
              content
              img {
                url
              }
              catalog {
                url
              }
            }
          }
        `
    });
    await ctx.commit("manufacturer", manufacturerData.manufacturer);
    return manufacturerData.manufacturer
  },
  async fetchCategory(ctx, id) {
    let client = this.app.apolloProvider.defaultClient;
    const {
      data: categoryData
    } = await client.query({
      query: gql `
        query CategoryQuery( $id: ID! ) {
          category(id: $id) {
            id
            description
            name
            slug
            content
            img {
              url
            }
            manufacturers{
              _id
              name
              slug
            }
            parent {
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
            }
            product_types {
              _id
              name
              slug
            }
          }
        }
      `,
      variables: {
        id: id,
      }
    });
    await ctx.commit("category", categoryData.category);
    return categoryData.category
  },
  async fetchProduct(ctx, slug) {
    let client = this.app.apolloProvider.defaultClient;
    const {
      data: productData
    } = await client.query({
      query: gql `
        fragment relatedProduct on Product {
          name
          slug
          weight
          isDiscount
          isHalal
          priceNum
          discountPrice
          minimumOrder
          piece
          manufacturer {
            slug
            name
            img {
              url
            }
          }
          category {
            slug
          }
          img {
            url
            formats
          }
        }
        query ProductQuery( $slug: String! ) {
          productFull:products( where: { slug: $slug } ) {
            id
            description
            name
            slug
            content
            weight
            isDiscount
            isHalal
            priceNum
            discountPrice
            minimumOrder
            piece
            category{
              name
              slug
            }
            img {
              url
              formats
              width
              height
            }
            manufacturer {
              name
              slug
              description
              img {
                url
              }
            }
            relatedProducts {
              ...relatedProduct
            },
            productsRelated {
              ...relatedProduct
            }

          }
        }
      `,
      variables: {
        slug: slug,
      }
    });
    // console.log("productData.products", productData)
    if (!productData.productFull.length) return null


    return productData.productFull[0]
  },
  async fetchProducts(ctx, params) {
    // console.log("fetchProducts -> params", params)
    let client = this.app.apolloProvider.defaultClient;
    const vars = {
      ...params.manufacturer && {
        manufacturer: params.manufacturer
      },
      ...params.product_type && {
        product_type: params.product_type
      },
      category: params.category,
      sort: params.sort || "name:asc",
      limit: params.limit || 20,
      start: params.start || 0
    }
    // console.log("fetchProducts -> vars", vars)
    const {
      data: productsData
    } = await client.query({
      query: gql `
      query productsQuery(
        $manufacturer: ID $category: [ID!] $product_type: ID $sort: String $limit: Int $start: Int
      ) {
        products(
          limit: $limit 
          start: $start 
          sort: $sort 
          where: {
            manufacturer: $manufacturer
            category: $category
            product_type: $product_type
          }
        ) {
          id
          name
          slug
          weight
          isDiscount
          isHalal
          priceNum
          discountPrice
          rating
          minimumOrder
          piece
          manufacturer {
            name
            slug
            img {
              url
            }
          }
          category{
            name
            slug
          }
          img {
            url
            name
            formats
          }
        }
      }
    `,
      variables: vars
    });
    return productsData.products
  }
}
// console.log("fetchProducts -> productsData", productsData)

// const {
//   data: productsData
// } = await this.$axios.get("/products", {
//   params: {
//     category: params.category,
//     _limit: params.limit || 20,
//     _sort: params.sort || "name:asc",
//     _start: params.start || 0,
//     manufacturer: params.manufacturer
//   }
// })
