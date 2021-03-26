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
export const getters = {
  // subcategories(state) {
  //   return state.sessionStorage.category.subcategories
  // },

  subcategories(state) {
    const rootCategory = state.sessionStorage.rootCategory
    if (!rootCategory) {
      return []
    }
    // const value = 
    // console.log("🚀 ~ file: index.js ~ line 107 ~ value ~ value", value)
    return rootCategory.children.reduce((acc, val) => {
      acc.push(val)
      return acc
    }, [{
      slug: rootCategory.slug,
      name: `Все ${rootCategory.name}`,
      id: rootCategory.id
    }])
  },
  // categoryBreadcrumbs(state) {

  //     // this.$store.dispatch("breadcrumbs", items);
  //     return items;
  //   },

  cart(state) {
    // console.log("cart getter called")
    const cart = state.localStorage.cartItemList.reduce((acc, product) => {
      const newProd = Object.assign({}, product)
      newProd.subSumm = product.isDiscount
        ? Math.round(product.discountPrice * product.quantity)
        : Math.round(product.priceNum * product.quantity)
      acc.push(newProd)
      return acc
    }, [])
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
    // console.log("🚀 ~ file: index.js ~ line 142 ~ cartSumm ~ summa", summa)

    return summa
  },
  isCart(state) {
    return state.localStorage.cartItemList && !!state.localStorage.cartItemList.length
  },
  cartLength(state) {
    return state.localStorage.cartItemList.length
  },
  isInCartByIds(state, getters) {
    if (!getters.isCart) {
      return {};
    }
    // console.log("🚀 ~ file: index.js ~ line 133 ~ isInCartByIds ~ state")

    return state.localStorage.cartItemList.reduce((out, item) => {
      // console.log("🚀 ~ file: index.js ~ line 139 ~ returnstate.localStorage.cartItemList.reduce ~ item", item)
      out[item.id] = true// item.quantity
      return out
    }, {})
  },
  // isInCart: (state, getters) => id => {
  //   if (!getters.isCart) {
  //     return false;
  //   }
  //   const recordIndex = state.localStorage.cartItemList.findIndex((element) => element.id == id)
  //   if (recordIndex >= 0) {
  //     return true
  //   } else {
  //     return false
  //   }
  // },
  quantity: (state) => id => {
    // console.log("🚀 ~ file: index.js ~ line 156 ~ id", id)
    const record = state.localStorage.cartItemList.find((element) => element.id == id)
    if (record) {
      return record.quantity
    } else {
      return 0
    }
  },

  menuItems(state, getters) {
    return [
      // {
      //   name: "Главная",
      //   to: "/",
      //   isChild: false,
      // },
      {
        name: "Каталог",
        slug: "catalog",
        to: "/catalog",
        disable: true,
        isChild: true,
        items: [
          ...getters.getParentCategories,
          { name: "Акционная продукция", slug: "discount" },
          { name: "Халяльная продукция", slug: "halal" },
        ],
      },
      {
        name: "Производители",
        slug: "manufacturers",
        to: "/manufacturers",
        disable: false,
        isChild: true,
        items: state.sessionStorage.generalInfo.manufacturers,
      },
      {
        name: "О компании",
        slug: "about",
        to: "/about",
        disable: false,
        isChild: true,
        items: [
          {
            name: "Доставка",
            slug: "delivery",
          },
          {
            name: "Условия сотрудничества",
            slug: "usloviya-sotrudnichestva",
          },
        ]
      },
      {
        name: "Контакты",
        slug: "contacts",
        to: "/contacts",
        disable: false,
        isChild: false,
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
  getCategory: state => slug => {
    // console.log("🚀 ~ file: index.js ~ line 159 ~ state", state)
    if (!slug) return null
    const category = state.sessionStorage.generalInfo.categories.find(
      item => item.slug === slug
    )
    if (!category) return null
    return category
  },
  getCategoryBySlug(state) {
    return state.sessionStorage.generalInfo.categories.reduce((out, item) => {
      out[item.slug] = item
      return out
    }, {})
  },
  getManufacturerBySlug(state) {
    return state.sessionStorage.generalInfo.manufacturers.reduce((out, item) => {
      out[item.slug] = item
      return out
    }, {})
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
export const mutations = {
  breadcrumbs(state, items) {
    state.sessionStorage.breadcrumbs = items
  },
  // subcategories(state, items) {
  //   state.sessionStorage.category.subcategories = items
  // },
  rootCategory(state, items) {
    state.sessionStorage.rootCategory = items
  },
  category(state, item) {
    state.sessionStorage.category = item
  },
  generalInfo(state, item) {
    state.sessionStorage.generalInfo = item
  },
  updateCartByID(state, { id, quantity }) {
    const record = state.localStorage.cartItemList.find(element => element.id == id);
    if (record) {
      record.quantity = quantity;
    }
  },
  addToCart(state, item) {
    const product = new CartProduct(item)
    state.localStorage.cartItemList.push({
      ...product,
      quantity: product.minimumOrder
    });
  },
  setCart(state, productList) {
    if (productList) {
      state.localStorage.cartItemList = productList;
    }
  },
  removeCartItem(state, id) {
    const record = state.localStorage.cartItemList.find(element => element.id == id);
    if (record) {
      state.localStorage.cartItemList.splice(state.localStorage.cartItemList.indexOf(record), 1);

    }
  },
  incrementCart(state, id) {
    const record = state.localStorage.cartItemList.find(element => element.id == id);
    if (record) {
      record.quantity += record.minimumOrder;
    }
  },
  decrementCart(state, id) {
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

export const actions = {
  async nuxtServerInit(state, ctx) {


    // if (ctx.isDev) {
    //   const query = require("~/graphql/query/generalInfo")
    //   const {
    //     data
    //   } = await this.app.apolloProvider.defaultClient.query({
    //     query: gql(query)
    //   })
    //   await state.commit("generalInfo", {
    //     ...data,
    //     contacts: data.contact
    //   })
    // } else {
    const data = require('~/static/data.json')
    await state.commit("generalInfo", {
      ...data,
      contacts: data.contact
    })
    // }



    // const user = ctx.$cookies.get('user')
    // if (user) {
    //   await state.commit("auth/setUserData", user)
    // }
    // const jwt = ctx.$cookies.get('jwt')
    // if (jwt) {
    //   await state.commit("auth/setJWT", jwt)
    // }
    //   const query = gql`
    //       {
    //         contact {
    //           phone
    //           email
    //           addressText
    //           addressCoords
    //           accessTime
    //         }
    //         categories(sort: "name:asc", limit: 999) {
    //           id
    //           name
    //           slug
    //           parent {
    //             id
    //           }
    //           children {
    //             id
    //             name
    //             slug
    //             img {
    //               url
    //             }
    //           }
    //           img {
    //             url
    //           }
    //         }
    //         manufacturers(sort: "name:asc", limit:999) {
    //           id
    //           name
    //           slug

    //           img {
    //             url
    //           }
    //         }
    //       }
    //     `
    //   const client = this.app.apolloProvider.defaultClient;
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
    //   const data = await this._vm.$getCachedData()
    //   await state.commit("generalInfo", {
    //     ...data,
    //     contacts: data.contact
    //   })
    // }

  },
  breadcrumbs({ commit }, items) {
    commit("breadcrumbs", items)
  },
  pushBreadcrumbs({ commit, state }, item) {
    console.log("🚀 ~ file: index.js ~ line 350 ~ pushBreadcrumbs ~ state.sessionStorage.breadcrumbs", state.sessionStorage.breadcrumbs)

    const existed = [...state.sessionStorage.breadcrumbs]
    console.log("🚀 ~ file: index.js ~ line 349 ~ pushBreadcrumbs ~ ctx", state.sessionStorage.breadcrumbs)
    commit("breadcrumbs", [...existed, item])
  },
  addToCart({ commit }, item) {
    // console.log("🚀 ~ file: index.js ~ line 347 ~ addToCart ~ item", item)
    commit("addToCart", item)
  },
  updateCartById({ commit, state }, { id, quantity }) {
    // console.log("🚀 ~ file: index.js ~ line 251 ~ updateCartById ~ state", state)
    const record = state.localStorage.cartItemList.find(element => element.id == id);
    if (record) {
      // console.log("🚀 ~ file: cart.js ~ line 110 ~ updateCartById ~ record", record)
      let newQuantity;
      if (record.minimumOrder > 1) {
        const ostatok = quantity % record.minimumOrder
        // console.log("🚀 ~ file: cart.js ~ line 66 ~ ostatok", ostatok)
        if (ostatok !== 0) {
          newQuantity = quantity + (record.minimumOrder - ostatok)

        } else {
          newQuantity = quantity
        }
      } else {
        newQuantity = quantity
      }
      // console.log("🚀 ~ file: cart.js ~ line 124 ~ updateCartById ~ newQuantity", record.quantity, newQuantity)

      if (record.quantity !== newQuantity) {
        // console.log("🚀 ~ file: cart.js ~ line 127 updateCartByID", record.quantity, newQuantity)

        commit("updateCartByID", { id, quantity: newQuantity })
        return newQuantity
      } else {
        return record.quantity
      }
    }

  },
  removeItemInCart({ commit }, id) {
    commit("removeCartItem", id)
  },
  incrementCart({ commit }, id) {
    commit("incrementCart", id)
  },
  decrementCart({ commit }, id) {
    commit("decrementCart", id)
  },
  setCart({ commit }, cart) {
    commit("setCart", cart)
  },
  clearCart({ commit }) {
    commit("setCart", [])
  },
  category({ commit, state, dispatch }, newValue) {
    const oldValue = state.sessionStorage.rootCategory
    if (!oldValue || !oldValue.slug || oldValue.slug !== newValue.slug) {
      commit("rootCategory", newValue);
    }
  },
  setRootCategory({ commit, state, dispatch }, newValue) {
    const oldValue = state.sessionStorage.rootCategory
    if (!oldValue || !oldValue.slug || oldValue.slug !== newValue.slug) {
      // commit("subcategories", [])
      // commit("category", {
      //   rootCategory: newValue,
      //   // subcategories: newValue.children.reduce((acc, val) => {
      //   //   acc.push(val)
      //   //   return acc
      //   // }, [{
      //   //   slug: newValue.slug,
      //   //   name: `Все ${newValue.name}`,
      //   //   id: newValue.id
      //   // }])
      // });

      commit("rootCategory", newValue);
      // const rootCategory = newValue;
      let items = [
        {
          to: "/",
          text: "Главная",
        },
        {
          to: "/catalog",
          text: "Каталог",
        },
        {
          to: `/catalog/${newValue.slug}`,
          text: newValue.name,
        }
      ];
      // items.push();
      dispatch("breadcrumbs", items);
      // if (this.category.slug !== rootCategory.slug) {
      //   items.push({
      //     to: `/catalog/${this.category.slug}`,
      //     text: this.category.name,
      //     // disable: false,
      //   });
      // }

      // const newSubcats =
      // console.log("🚀 ~ file: index.js ~ line 394 ~ newSubcats ~ newSubcats", newSubcats)
      // commit("subcategories", newSubcats)
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
  async fetchCategory(state, id) {
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
  async fetchManufacturer(ctx, id) {
    // console.log("fetchManufacturer")
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
    // console.log(ctx.state)
    // await ctx.commit("manufacturer", manufacturerData.manufacturer);
    // console.log(ctx.state)
    return manufacturerData.manufacturer
  },
  // async fetchProduct(ctx, slug) {
  //   // const client = this.app.apolloProvider.defaultClient;
  //   try {
  //     const {
  //       data: { products: [product] }
  //     } = await this.app.apolloProvider.defaultClient.query({
  //       query: gql`
  //       fragment relatedProduct on Product {
  //         name
  //         slug
  //         weight
  //         isDiscount
  //         isHalal
  //         priceNum
  //         discountPrice
  //         minimumOrder
  //         piece
  //         manufacturer {
  //           slug
  //           name
  //         }
  //         category {
  //           slug
  //         }
  //         img {
  //           url
  //           formats
  //         }
  //       }
  //       query ProductQuery( $slug: String! ) {
  //         products( where: { slug: $slug } ) {
  //           _id
  //           description
  //           name
  //           slug
  //           content
  //           weight
  //           isDiscount
  //           isHalal
  //           priceNum
  //           discountPrice
  //           minimumOrder
  //           piece
  //           category{
  //             name
  //             slug
  //           }
  //           img {
  //             url
  //             formats
  //             width
  //             height
  //           }
  //           manufacturer {
  //             name
  //             slug
  //             description
  //           }
  //           relatedProducts {
  //             ...relatedProduct
  //           },
  //           productsRelated {
  //             ...relatedProduct
  //           }

  //         }
  //       }
  //     `,
  //       variables: {
  //         slug
  //       }
  //     });
  //     return product
  //   } catch (error) {
  //     // console.log("🚀 ~ file: index.js ~ line 523 ~ fetchProduct ~ error", error)
  //     return null
  //   }

  // },
  // async fetchProducts(ctx, params) {
  //   let n = 3
  //   const getProducts = async () => {
  //     const client = this.app.apolloProvider.defaultClient;
  //     const vars = {
  //       ...params.manufacturer && {
  //         manufacturer: params.manufacturer
  //       },
  //       ...params.product_type && {
  //         product_type: params.product_type
  //       },
  //       category: params.category,
  //       sort: params.sort || "name:asc",
  //       limit: params.limit || 20,
  //       start: params.start || 0
  //     }
  //     const {
  //       data: productsData
  //     } = await client.query({
  //       query: gql`
  //       query productsQuery(
  //           $manufacturer: ID $category: [ID!] $product_type: ID $sort: String $limit: Int $start: Int
  //         ) {
  //           products(
  //             limit: $limit 
  //             start: $start 
  //             sort: $sort 
  //             where: {
  //               manufacturer: $manufacturer
  //               category: $category
  //               product_type: $product_type
  //             }
  //         ) {
  //           id
  //           name
  //           slug
  //           weight
  //           isDiscount
  //           isHalal
  //           priceNum
  //           discountPrice
  //           rating
  //           minimumOrder
  //           piece
  //           manufacturer {
  //             name
  //             slug
  //           }
  //           category{
  //             name
  //             slug
  //           }
  //           img {
  //             url
  //             name
  //             formats
  //           }
  //         }
  //       }
  //     `,
  //       variables: vars
  //     });
  //     return productsData.products
  //   }
  //   try {
  //     return await getProducts()
  //   } catch (error) {
  //     n -= 1
  //     if (n === 0) return []
  //     return await getProducts()
  //   }
  // }
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