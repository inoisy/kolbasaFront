import gql from "graphql-tag";
const baseUrl = process.env.baseUrl
export const mutations = {
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
    state.localStorage.basket.push(item)
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
  },
  async fetchCategory(ctx, params) {
    // console.log("TCL: fetchCategory -> manufacturer", params.manufacturer)
    // console.log("TCL: fetchCategory -> slug", params.slug)
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
        //  products {
        //    id
        //    name
        //    slug
        //    img {
        //      url
        //    }
        //  }
        // manufacturer: ["5d273c84ce0d7018fc20a6aa"]
      }
    });
    // console.log("TCL: fetchCategory -> categoryData", categoryData)
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
    } = await this.$axios.get(`http://localhost:1337/products?` + query)
    const {
      data: productsCount
    } = await this.$axios.get(`http://localhost:1337/products/count?` + query)

    count = productsCount
    products = productsData

    await ctx.commit("category", categoryData.category);
    await ctx.commit("products", {
      items: products,
      count: count
    });
    return categoryData.category
  },
  async fetchProduct(ctx, params) {

    const {
      data: product
    } = await ctx.$axios.get(
      `/products?slug=` + params.slug
    );
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
    } = await this.$axios.get(`http://localhost:1337/products?` + query)
    const {
      data: productsCount
    } = await this.$axios.get(`http://localhost:1337/products/count?` + query)

    count = productsCount
    products = productsData

    await ctx.commit("products", {
      items: products,
      count: count
    });

  }
}
