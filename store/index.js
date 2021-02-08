import gql from "graphql-tag";

class CartProduct {
  constructor(item) {
    if (item.id) {
      this.id = item.id
    }
    if (item._id) {
      this.id = item._id
    }
    if (item.category) {
      this.categorySlug = item.category.slug
    }

    this.discountPrice = item.discountPrice
    if (item.img) {
      this.img = item.img.formats && item.img.formats.thumbnail ? item.img.formats.thumbnail.url : item.img.url
    }
    this.isDiscount = item.isDiscount
    this.minimumOrder = item.minimumOrder || 1
    this.priceNum = item.priceNum
    this.slug = item.slug
    this.weight = item.weight
    this.name = item.name
  }
}

export const mutations = {
  breadcrumbs(state, item) {
    state.sessionStorage.breadcrumbs = item
  },
  generalInfo(state, item) {
    state.sessionStorage.generalInfo = item
  },
  'UPDATE_CART_BY_ID'(state, { id, quantity }) {
    const record = state.localStorage.cartItemList.find(element => element.id == id);
    if (record) {
      record.quantity = quantity;
    }
  },
  "ADD_TO_CART"(state, { item }) {
    // console.log("🚀 ~ file: cart.js ~ line 68 ~ state", state)
    const product = new CartProduct(item)
    state.localStorage.cartItemList.push({
      ...product,
      quantity: product.minimumOrder
    });
  },
  'SET_CART'(state, productList) {
    if (productList) {
      state.localStorage.cartItemList = productList;
    }
  },
  'REMOVE_CART_ITEM'(state, id) {
    console.log("🚀 ~ file: index.js ~ line 54 ~ id", id)
    console.log("🚀 ~ file: index.js ~ line 54 ~ state", state)
    const record = state.localStorage.cartItemList.find(element => element.id == id);
    if (record) {
      state.localStorage.cartItemList.splice(state.localStorage.cartItemList.indexOf(record), 1);

    }
  },
  'INCREMENT_CART'(state, id) {
    const record = state.localStorage.cartItemList.find(element => element.id == id);
    if (record) {
      record.quantity += record.minimumOrder;
    }
  },
  'DECREMENT_CART'(state, id) {
    const record = state.localStorage.cartItemList.find(element => element.id == id);
    if (record) {
      const quantityNew = record.quantity -= record.minimumOrder
      if (quantityNew > 0) {
        record.quantity = quantityNew
      } else {
        state.localStorage.cartItemList.splice(state.localStorage.cartItemList.indexOf(record), 1);
      }
    }
  },
}
// export const strict = false
export const getters = {
  cart(state) {
    const cart = state.localStorage.cartItemList.map(product => {
      product.subSumm = product.isDiscount
        ? Math.round(product.discountPrice * product.quantity)
        : Math.round(product.priceNum * product.quantity)
      return product
    })
    // console.log("🚀 ~ file: index.js ~ line 142 ~ cart ~ cart", cart)
    return cart
  },
  cartSumm(state) {
    const summa = state.localStorage.cartItemList.reduce(
      (acc, product) => {
        acc =
          product.isDiscount && product.discountPrice ?
            acc + product.discountPrice * product.quantity :
            acc + product.quantity * product.priceNum;
        return acc;
      }, 0)
    console.log("🚀 ~ file: index.js ~ line 142 ~ cartSumm ~ summa", summa)

    return summa
  },
  isCart(state) {
    return !!state.localStorage.cartItemList.length
  },
  cartLength(state) {
    // console.log("🚀 ~ file: index.js ~ line 146 ~ cartLength ~ state.localStorage.cartItemList.length", state.localStorage.cartItemList.length)

    return state.localStorage.cartItemList.length
  },
  isInCart: (state, getters) => id => {
    // console.log(!getters.isCart)
    if (!getters.isCart) {
      return false;
    }
    // console.log("🚀 ~ file: index.js ~ line 136 ~ state", state)
    // console.log("🚀 ~ file: cart.js ~ line 80 ~ id", id)
    const recordIndex = state.localStorage.cartItemList.findIndex((element) => element.id == id)
    // console.log("🚀 ~ file: cart.js ~ line 81 ~ record", recordIndex)
    if (recordIndex >= 0) {
      return true
    } else {
      return false
    }
  },
  quantity: (state) => id => {
    const record = state.localStorage.cartItemList.find((element) => element.id == id)
    // console.log("🚀 ~ file: cart.js ~ line 81 ~ record", record)
    if (record) {
      return record.quantity
    } else {
      return 0
    }
  },
  getProductQty: (state) => id => {
    console.log("🚀 ~ file: index.js ~ line 71 ~ id", id)
    const finded = state.localStorage.basket.find(
      (item) => (item._id === id) || (item.id === id)
    );
    console.log("🚀 ~ file: index.js ~ line 76 ~ state.localStorage.basket", finded)

    // console.log("🚀 ~ file: index.js ~ line 74 ~ index", index)
    if (!finded) {
      return 0
    }
    return finded.count
  },

  menuItems(state, getters) {
    // console.log("🚀 ~ file: index.js ~ line 91 ~ menuItems ~ state", getters)
    return [
      {
        name: "Главная",
        to: "/",
      },
      {
        name: "Каталог",
        to: "/catalog",
        items: [
          ...getters.getParentCategories,
          { name: "Акционная продукция", slug: "discount" },
          { name: "Халяльная продукция", slug: "halal" },
        ],
      },
      {
        name: "Производители",
        to: "/manufacturers",
        items: state.sessionStorage.generalInfo.manufacturers,
      },
      {
        name: "О компании",
        to: "/about",
      },
      {
        name: "Доставка",
        to: "/delivery",
      },
      {
        name: "Контакты",
        to: "/contacts",
      },
    ];
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
    console.log("🚀 ~ file: index.js ~ line 159 ~ state", state)
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
  addToCart({ commit }, { item }) {
    commit("ADD_TO_CART", { item })
  },
  updateCartById({ commit, state }, { id, quantity }) {
    console.log("🚀 ~ file: index.js ~ line 251 ~ updateCartById ~ state", state)
    const record = state.localStorage.cartItemList.find(element => element.id == id);
    if (record) {
      console.log("🚀 ~ file: cart.js ~ line 110 ~ updateCartById ~ record", record)
      let newQuantity;
      if (record.minimumOrder > 1) {
        const ostatok = quantity % record.minimumOrder
        console.log("🚀 ~ file: cart.js ~ line 66 ~ ostatok", ostatok)
        if (ostatok !== 0) {
          newQuantity = quantity + (record.minimumOrder - ostatok)

        } else {
          newQuantity = quantity
        }
      } else {
        newQuantity = quantity
      }
      console.log("🚀 ~ file: cart.js ~ line 124 ~ updateCartById ~ newQuantity", record.quantity, newQuantity)

      if (record.quantity !== newQuantity) {
        console.log("🚀 ~ file: cart.js ~ line 127 UPDATE_CART_BY_ID", record.quantity, newQuantity)

        commit("UPDATE_CART_BY_ID", { id, quantity: newQuantity })
        return newQuantity
      } else {
        return record.quantity
      }
    }

  },
  removeItemInCart({ commit }, id) {
    commit("REMOVE_CART_ITEM", id)
  },
  incrementCart({ commit }, id) {
    commit("INCREMENT_CART", id)
  },
  decrementCart({ commit }, id) {
    commit("DECREMENT_CART", id)
  },
  setCart({ commit }, cart) {
    commit("SET_CART", cart)
  },
  clearCart({ commit }) {
    commit("SET_CART", [])
  },

  async nuxtServerInit(state, ctx) {
    // const user = ctx.$cookies.get('user')
    // if (user) {
    //   await state.commit("auth/setUserData", user)
    // }
    // const jwt = ctx.$cookies.get('jwt')
    // if (jwt) {
    //   await state.commit("auth/setJWT", jwt)
    // }
    if (ctx.isDev) {
      const query = gql`
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
      const client = this.app.apolloProvider.defaultClient;
      const {
        data
      } = await client.query({
        query
      })
      await state.commit("generalInfo", {
        ...data,
        contacts: data.contact
      })
    } else {
      const data = await this._vm.$getCachedData()
      await state.commit("generalInfo", {
        ...data,
        contacts: data.contact
      })
    }
  },
  async fetchProductType(state, id) {
    const client = this.app.apolloProvider.defaultClient;
    const {
      data: productTypeData
    } = await client.query({
      variables: {
        id
      },
      query: gql`
          query ProductTypeQuery($id: ID!) {
            productType(id: $id) {
              _id
              id
              name
              slug
              content
            }
          }
        `
    });
    return productTypeData.productType
  },
  async fetchManufacturer(ctx, id) {
    const client = this.app.apolloProvider.defaultClient;
    const {
      data: manufacturerData
    } = await client.query({
      variables: {
        id
      },
      query: gql`
          query ManufacturerQuery($id: ID!) {
            manufacturer(id: $id) {
              id
              name
              slug
              description
              metaDescription
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
    const client = this.app.apolloProvider.defaultClient;
    const {
      data: categoryData
    } = await client.query({
      query: gql`
        query CategoryQuery( $id: ID! ) {
          category(id: $id) {
            id
            description
            metaDescription
            name
            slug
            content
            img {
              url
            }
            manufacturers(sort: "name:asc") {
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
            product_types(sort: "name:asc") {
              _id
              name
              slug
            }
          }
        }
      `,
      variables: {
        id
      }
    });
    // await ctx.commit("category", categoryData.category);
    return categoryData.category
  },
  async fetchProduct(ctx, slug) {
    const client = this.app.apolloProvider.defaultClient;
    const {
      data: productData
    } = await client.query({
      query: gql`
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
            _id
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
        slug
      }
    });
    // console.log("productData.products", productData)
    if (!productData.productFull.length) return null
    return productData.productFull[0]
  },
  async fetchProducts(ctx, params) {
    let n = 3
    const getProducts = async () => {
      const client = this.app.apolloProvider.defaultClient;
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
      const {
        data: productsData
      } = await client.query({
        query: gql`
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
    try {
      return await getProducts()
    } catch (error) {
      n -= 1
      if (n === 0) return []
      return await getProducts()
    }
  }
}

  // isItemInBusket: (state) => id => {
  //   const find = state.localStorage.basket.find(
  //     (item) => item.id === id
  //   );
  //   console.log("🚀 ~ file: index.js ~ line 74 ~ index", find)
  //   return !!find
  // },
  // summa(state) {
  //   if (Array.isArray(state.localStorage.basket)) {
  //     const summ = state.localStorage.basket.reduce(
  //       (acc, product) => {
  //         acc =
  //           product.isDiscount && product.discountPrice ?
  //             acc + product.discountPrice * product.count :
  //             acc + product.count * product.priceNum;
  //         return acc;
  //       }, 0)

  //     return summ % 1 > 0 ? summ.toFixed(1) : summ
  //   } else {
  //     state.localStorage.basket = []
  //     return 0
  //   }
  // },

   // category(state, item) {
  //   state.sessionStorage.category = item
  // },
  // manufacturer(state, item) {
  //   state.sessionStorage.manufacturer = item
  // },
  // incrementBasket(state, id) {
  //   const product = state.localStorage.basket.find((product) => product._id === id);
  //   product.count += product.minimumOrder
  // },
  // addToBasket(state, product) {
  //   console.log("addToBasket -> qty", product)
  //   const qty = product.qty || 1
  //   const cartProduct = state.localStorage.basket.find((item) => item.id === (product.id || product._id));
  //   if (cartProduct) {
  //     cartProduct.count += cartProduct.minimumOrder * qty;
  //   } else {
  //     state.localStorage.basket.push({
  //       ...product,
  //       count: product.minimumOrder * qty
  //     })
  //   }
  // },
  // clearBasket(state) {
  //   state.localStorage.basket = []
  // },
  // changeBasket(state, params) {
  //   const {
  //     qty,
  //     id
  //   } = params
  //   const product = state.localStorage.basket.find((item) => item._id === id);
  //   if (product.minimumOrder > 1) {
  //     const ostatok = qty % product.minimumOrder
  //     if (ostatok !== 0) {
  //       product.count = qty + (product.minimumOrder - ostatok)
  //     } else {
  //       product.count = qty
  //     }
  //   } else {
  //     product.count = qty
  //   }
  // },
  // deleteFromBasket(state, id) {
  //   const cartProductIndex = state.localStorage.basket.findIndex((item) => item.id === id);
  //   state.localStorage.basket.splice(cartProductIndex, 1);
  // },
  // removeFromBasket(state, id) {
  //   const cartProduct = state.localStorage.basket.find((item) => item.id === id);
  //   cartProduct.count -= cartProduct.minimumOrder;
  //   if (cartProduct.count <= 0) {
  //     const cartProductIndex = state.localStorage.basket.findIndex((item) => item.id === id);
  //     state.localStorage.basket.splice(cartProductIndex, 1);
  //   }
  // },
  // setUserData(state, data) {
  //   state.localStorage.user = data
  // }