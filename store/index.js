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
  categorySubcategories(state) {
    const rootCategory = state.sessionStorage.categoryPage.rootCategory
    if (!rootCategory || !rootCategory.children || !rootCategory.children.length) {
      return []
    }
    return rootCategory.children.reduce((acc, val) => {
      acc.push(val)
      return acc
    }, [{
      slug: rootCategory.slug,
      name: `Все ${rootCategory.name}`,
      id: rootCategory.id
    }])
  },
  categorySubcategoriesIDs(state, getters) {
    return getters.categorySubcategories.map(item => item.id)
  },
  categoryMeta(state) {
    const { category: { name: categoryName, metaDescription, content: categoryContent }, manufacturerSelected, productTypeSelected } = state.sessionStorage.categoryPage

    let name = `${categoryName} оптом`;
    let description = metaDescription
      ? metaDescription
      : `${name} от компании Альянс Фуд с доставкой по всей РФ и СНГ по самым выгодным оптовым ценам от производителя.`;
    let content = categoryContent;

    if (manufacturerSelected) {
      name = `${categoryName} ${manufacturerSelected.name} оптом`;
      description = `${name}. ${description}`;
    } else if (productTypeSelected) {
      // const productType = await this.fetchProductType(this.productType._id);

      name = `${productTypeSelected.name} оптом`;
      description = `${name}. ${description}`;
      if (productTypeSelected.content) {
        content = productTypeSelected.content.concat(categoryContent);
      }
    }
    return {
      name,
      description,
      content,
    }
  },

  categoryBreadcrumbs(state) {
    const { name: rootName, slug: rootSlug } = state.sessionStorage.categoryPage.rootCategory
    const { name, slug } = state.sessionStorage.categoryPage.categoryMinimal
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
        to: `/catalog/${rootSlug}`,
        text: rootName,
      }
    ];

    if (slug !== rootSlug) {
      items.push({
        to: `/catalog/${slug}`,
        text: name,
      });
    }
    // console.log("🚀 ~ file: index.js ~ line 68 ~ categoryBreadcrumbs ~ items", items)

    return items
  },

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
    return state.localStorage.cartItemList.reduce((out, item) => {
      out[item.id] = true// item.quantity
      return out
    }, {})
  },
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


  rootCategory(state, item) {
    state.sessionStorage.categoryPage.rootCategory = item
  },
  category(state, item) {
    state.sessionStorage.categoryPage.category = item
  },
  changeCategory(state, { category, categoriesIds }) {
    // rootCategory
    state.sessionStorage.categoryPage.categoryMinimal = category
    state.sessionStorage.categoryPage.categoriesIds = categoriesIds
    // const oldValue = state.sessionStorage.categoryPage.rootCategory
    // if (!oldValue || !oldValue.slug || oldValue.slug !== rootCategory.slug) {
    //   state.sessionStorage.categoryPage.rootCategory = rootCategory
    // }
  },
  setFilters(state, { manufacturer = null, productType = null }) {
    state.sessionStorage.categoryPage.manufacturerSelected = manufacturer
    state.sessionStorage.categoryPage.productTypeSelected = productType
  },
  setSort(state, value) {
    state.localStorage.category.sort = value
    // state.sessionStorage.categoryPage.productTypeSelected = productType
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
export const actions = {
  async nuxtServerInit(state, ctx) {
    const data = require('~/static/data.json')
    await state.commit("generalInfo", {
      ...data,
      contacts: data.contact
    })
  },

  addToCart({ commit }, item) {
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
  async changeCategory({ commit, dispatch, getters: { categorySubcategoriesIDs, getCategoryBySlug } }, slug) {
    const category = getCategoryBySlug[slug];
    if (!category) {
      return false
    }
    let rootCategory, categoriesIds, isChildCategory = false;// categoriesIds,
    if (!!category.parent.length) {
      rootCategory = getCategoryBySlug[category.parent[0].slug]

      // isChildCategory = true
      await dispatch("setRootCategory", rootCategory)
      categoriesIds = [category.id]
    } else {
      // rootCategory = category;
      await dispatch("setRootCategory", category)
      categoriesIds = categorySubcategoriesIDs

    }

    await commit("changeCategory", { category, categoriesIds })
    return true
  },
  async setRootCategory({ commit, state }, newValue) {
    const oldValue = state.sessionStorage.categoryPage.rootCategory
    if (!oldValue || !oldValue.slug || oldValue.slug !== newValue.slug) {
      await commit("rootCategory", newValue);
      // await commit("breadcrumbs", categoryBreadcrumbs)
    }
  },
  // setRootCategory(state, { slug: newSlug }) {
  //   const oldValue = state.sessionStorage.categoryPage.rootCategory
  //   if (!oldValue || !oldValue.slug || oldValue.slug !== newSlug) {
  //     state.sessionStorage.categoryPage.rootCategory = item
  //   }
  // },
  async fetchProductType({ }, id) {
    const {
      data: { productType }
    } = await this.app.apolloProvider.defaultClient.query({
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
    return productType
  },
  async fetchCategory({ commit, getters: { getManufacturerBySlug }, state: { sessionStorage: { categoryPage: { categoryMinimal: { id } } } } }, query) {
    //  , route: { query }
    const {
      data: { category }
    } = await this.app.apolloProvider.defaultClient.query({
      query: gql`
          query CategoryQuery($id: ID!) {
            category(id: $id) {
              id
              description
              metaDescription
              name
              slug
              content
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
              children {
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
        id,
      },
    });
    const { manufacturer, type } = query;
    let manufacturerSelected, productTypeSelected;
    if (manufacturer) {
      manufacturerSelected = getManufacturerBySlug[
        manufacturer
      ];
    }
    if (type) {
      productTypeSelected = category.product_types.find(
        (item) => item.slug === type
      );
    }
    await commit("setFilters", { productType: productTypeSelected, manufacturer: manufacturerSelected })
    await commit("category", category);
    return category
  },

  async fetchCategoryProducts({ state: { sessionStorage: { categoryPage: { categoriesIds, limit, manufacturerSelected, productTypeSelected } }, localStorage: { category: { sort } } } }, start = 0) {
    // const variables = ;
    // console.log("🚀 ~ file: index.js ~ line 495 ~ fetchCategoryProducts ~ variables", variables)
    const {
      data: { products }
    } = await this.app.apolloProvider.defaultClient.query({
      query: gql`
          query productsQuery(
            $manufacturer: ID
            $category: [ID!]
            $product_type: ID
            $sort: String
            $limit: Int
            $start: Int
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
              }
              category {
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
      variables: {
        start: start,
        category: categoriesIds,
        limit: limit,
        sort: sort.value,
        ...(!!manufacturerSelected && {
          manufacturer: manufacturerSelected._id,
        }),
        ...(!!productTypeSelected && {
          product_type: productTypeSelected._id,
        }),
      },
    });
    // await commit("setCategoryProducts", products)

    return products
  },


  async changeProductType({ commit, dispatch }, item) {
    let productTypeNew = null;
    if (item) {
      productTypeNew = await dispatch("fetchProductType", item)
    }
    await commit("setFilters", { productType: productTypeNew })
  },
  async changeManufacturer({ commit }, manufacturer) {
    await commit("setFilters", { manufacturer })
  },
  async changeSort({ commit }, value) {
    await commit("setSort", value)
  },
  async fetchManufacturer(ctx, id) {

    const {
      data: manufacturerData
    } = await this.app.apolloProvider.defaultClient.query({
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

    return manufacturerData.manufacturer
  },
}
 // this.products = this.products.map(() => false);
  // await commit("cleanCategoryProducts")
  // cleanCategoryProducts(state, items) {
  //   state.sessionStorage.categoryPage.products = state.sessionStorage.categoryPage.products.map(() => false)
  // },
  // setCategoryProducts(state, items) {
  //   state.sessionStorage.categoryPage.products = items
  // },
// async fetchAndRefillProducts({ dispatch, commit }) {
  //   // this.products = this.products.map(() => false);
  //   await commit("cleanCategoryProducts")
  //   await dispatch("fetchCategoryProducts"); //await this.fetchProducts();

  // },
  // async cleanProducts ()
// async fetchMoreCategoryProducts({ dispatch, commit, state: { sessionStorage: { categoryPage: { products } } } }, $state) {
  //   const newProducts = await dispatch(
  //     "fetchCategoryProducts",
  //     products.length
  //   );
  //   if (newProducts && newProducts.length) {
  //     await commit("setCategoryProducts", [...products, ...newProducts])
  //     // this.products = [...this.products, ...newProducts];
  //     await $state.loaded();
  //   } else {
  //     await $state.complete();
  //   }
  // },
  // console.log("fetchManufacturer")
    // const client = this.app.apolloProvider.defaultClient;
 // console.log(ctx.state)
    // await ctx.commit("manufacturer", manufacturerData.manufacturer);
    // console.log(ctx.state)
// categoriesIds = rootCategory.children.reduce((acc, val) => {
      //   acc.push(val.id)
      //   return acc
      // }, [rootCategory.id])
    // if (isChildCategory) {
    //   categoriesIds = [category.id]
    // } else {
    //   categoriesIds =categorySubcategoriesIDs
    // }

    // /!!category.parent.length ? getters.getCategoryBySlug[category.parent[0].slug] : category)
    // const siblings =  rootCategory.children.reduce((acc, val) => {
    //   acc.push(val)
    //   return acc
    // }, [{
    //   slug: rootCategory.slug,
    //   name: `Все ${rootCategory.name}`,
    //   id: rootCategory.id
    // }])
    // const categoriesIds = isChildCategory ? [category.id] : siblings.map(item=>item.id)
    // if (isChildCategory){

    // }
    // categorySubcategories(state) {
    //   const rootCategory = state.sessionStorage.categoryPage.rootCategory
    //   if (!rootCategory || !rootCategory.children || !rootCategory.children.length) {
    //     return []
    //   }
    //   return rootCategory.children.reduce((acc, val) => {
    //     acc.push(val)
    //     return acc
    //   }, [{
    //     slug: rootCategory.slug,
    //     name: `Все ${rootCategory.name}`,
    //     id: rootCategory.id
    //   }])
    // },
    // categoriesIds, rootCategory, siblings
    // const productType =
  // categoryMinimal(state, item) {
  //   state.sessionStorage.categoryPage.categoryMinimal = item
  // },
  // categoriesIds(state, items) {
  //   state.sessionStorage.categoryPage.categoriesIds = items
  // },
  // setRootCategory(state, { slug: newSlug }) {
  //   const oldValue = state.sessionStorage.categoryPage.rootCategory
  //   if (!oldValue || !oldValue.slug || oldValue.slug !== newSlug) {
  //     state.sessionStorage.categoryPage.rootCategory = item
  //   }
  // },

  // rootCategory(state, item) {
  //   state.sessionStorage.categoryPage.rootCategory = item

  // },
  // category({ commit }, item) {
  //   commit("category", item)
  // },
    // await commit("categoryMinimal", categoryFind)
    // await dispatch(
    //   "setRootCategory",
    //   rootCategory
    // );
    // await commit("categoriesIds", categoriesIds)
  // async setRootCategory({ commit, state }, newValue) {
  //   const oldValue = state.sessionStorage.categoryPage.rootCategory
  //   if (!oldValue || !oldValue.slug || oldValue.slug !== newValue.slug) {
  //     await commit("rootCategory", newValue);
  //     // await commit("breadcrumbs", categoryBreadcrumbs)
  //   }
  // },
  // async flushProductType({commit}){
  //   await commit("productTypeSelected", null)
  // },
  // async flushManufacturer({ commit }) {
  //   await commit("productTypeSelected", null)
  // },
 // categoryPage(state, item) {
  //   state.sessionStorage.categoryPage = item
  // },
      // console.log("🚀 ~ file: index.js ~ line 254 ~ changeCategory ~ state", state)

     // await commit("categoryMinimal", categoryFind)
    // await dispatch(
    //   "setRootCategory",
    //   rootCategory
    // );
    // await commit("categoriesIds", categoriesIds)
  // manufacturerSelected(state, item) {
  //   state.sessionStorage.categoryPage.manufacturerSelected = item
  // },
  // productTypeSelected(state, item) {
  //   state.sessionStorage.categoryPage.productTypeSelected = item
  // },
    // breadcrumbs(state, items) {
  //   state.sessionStorage.categoryPage.breadcrumbs = items
  // },
      // console.log("🚀 ~ file: index.js ~ line 260 ~ setFilters ~ productType", productType)
    // console.log("🚀 ~ file: index.js ~ line 260 ~ setFilters ~ manufacturer", manufacturer)
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
   // query: gql`
      //   query CategoryQuery( $id: ID! ) {
      //     category(id: $id) {
      //       id
      //       description
      //       metaDescription
      //       name
      //       slug
      //       content
      //       img {
      //         url
      //       }
      //       manufacturers(sort: "name:asc") {
      //         _id
      //         name
      //         slug
      //       }
      //       parent {
      //         slug
      //         name
      //         children {
      //           id
      //           name
      //           slug
      //         }
      //       }
      //       children{
      //         id
      //         name
      //         slug
      //       }
      //       product_types(sort: "name:asc") {
      //         _id
      //         name
      //         slug
      //       }
      //     }
      //   }
      // `,
      // variables: {
      //   id
      // }
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