import gql from "graphql-tag";
export const mutations = {
  breadcrumbs(state, item) {
    state.sessionStorage.breadcrumbs = item
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
  manufacturer(state, item) {
    state.sessionStorage.manufacturer = item
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
  incrementBasket(state, id) {
    let product = state.localStorage.basket.find((product) => product.id === id);
    product.count++
  },
  addToBasket(state, product) {
    let cartProduct = state.localStorage.basket.find((item) => item.id === product.id);

    if (cartProduct) {
      cartProduct.count++;
    } else {
      state.localStorage.basket.push({
        ...product,
        count: 1
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
    let cartProduct = state.localStorage.basket.find((item) => item.id === id);
    cartProduct.count = qty
  },
  deleteFromBasket(state, id) {
    let cartProductIndex = state.localStorage.basket.findIndex((item) => item.id === id);
    state.localStorage.basket.splice(cartProductIndex, 1);
  },
  removeFromBasket(state, id) {
    let cartProduct = state.localStorage.basket.find((item) => item.id === id);
    cartProduct.count--;
    if (cartProduct.count <= 0) {
      let cartProductIndex = state.localStorage.basket.findIndex((item) => item.id === id);
      state.localStorage.basket.splice(cartProductIndex, 1);
    }
  }
}
export const strict = false
export const getters = {
  summa(state) {
    if (Array.isArray(state.localStorage.basket)) {
      return state.localStorage.basket.reduce(
        (acc, product) => {
          acc =
            product.isDiscount && product.discountPrice ?
            acc + product.discountPrice * product.count :
            acc + product.count * product.priceNum;
          return acc;
        }, 0)
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
    const data = require("~/assets/generalData.json")
    const result = {
      ...data,
      contacts: data.contacts[0]
    }
    await state.commit("generalInfo", result)
  },
  // async fetchGeneralInfo(ctx) {
  //   const data = require("~/assets/generalData.json")
  //   const result = {
  //     categories: data.categories,
  //     manufacturers: data.manufacturers,
  //     contacts: data.contacts[0]
  //   }
  //   await ctx.commit("generalInfo", result)
  //   return result
  // },
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
  async fetchProduct(ctx, params) {
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
    const {
      data: productsData
    } = await this.$axios.get("/products", {
      params: {
        category: params.category,
        _limit: params.limit ? params.limit : 20,
        _sort: params.sort === "price" ? "priceNum:desc" : "name:asc",
        _start: params.start ? params.start : 0,
        manufacturer: params.manufacturer
      }
    })
    return productsData
  }
}
