import gql from 'graphql-tag';


export const mutations = {

    generalInfo(state, data) {
    // state.sessionStorage.generalInfo = data
        state.info.data = data;
    },

};
export const actions = {
    async nuxtServerInit(state) {
        const data = require('~/static/data.json');
        await state.commit('generalInfo', {
            ...data,
            contacts: data.contact,
        });
    },


    async fetchManufacturer({ }, id) {
        const {
            data: manufacturerData,
        } = await this.app.apolloProvider.defaultClient.query({
            variables: {
                id,
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
        `,
        });

        return manufacturerData.manufacturer;
    },
};


// addToCart({ commit }, item) {
//   commit("addToCart", item)
// },
// updateCartById({ commit, state }, { id, quantity }) {
//   const record = state.localStorage.cartItemList.find(element => element.id == id);
//   if (record) {
//     let newQuantity;
//     if (record.minimumOrder > 1) {
//       const ostatok = quantity % record.minimumOrder
//       if (ostatok !== 0) {
//         newQuantity = quantity + (record.minimumOrder - ostatok)
//       } else {
//         newQuantity = quantity
//       }
//     } else {
//       newQuantity = quantity
//     }
//     if (record.quantity !== newQuantity) {
//       commit("updateCartByID", { id, quantity: newQuantity })
//       return newQuantity
//     } else {
//       return record.quantity
//     }
//   }
// },
// removeItemInCart({ commit }, id) {
//   commit("removeCartItem", id)
// },
// incrementCart({ commit }, id) {
//   commit("incrementCart", id)
// },
// decrementCart({ commit }, id) {
//   commit("decrementCart", id)
// },
// setCart({ commit }, cart) {
//   commit("setCart", cart)
// },
// clearCart({ commit }) {
//   commit("setCart", [])
// },


// async changeCategory({ commit, getters, state }, slug) {
//   // state: { sessionStorage: { categoryPage: { categoryMinimal } } }
//   const categoryMinimal = state.sessionStorage.categoryPage.categoryMinimal
//   const category = getters.getCategoryBySlug[slug];
//   if (!category) {
//     return false
//   }
//   if (!categoryMinimal.id || categoryMinimal.id !== category.id) {
//     await commit("setCategoryMinimal", category)
//   }

//   return category.id
// },

// async fetchProductTypeBySlug({ }, slug) {
//   const {
//     data: { productTypes: [productType] }
//   } = await this.app.apolloProvider.defaultClient.query({
//     variables: {
//       slug
//     },
//     query: gql`
//       query ProductTypeQuery($slug: String!) {
//         productTypes(where:{ slug: $slug}) {
//           _id
//           id
//           name
//           slug
//           content
//         }
//       }
//     `});
//   return productType
// },
// async fetchProductType({ }, id) {
//   const {
//     data: { productType }
//   } = await this.app.apolloProvider.defaultClient.query({
//     variables: {
//       id
//     },
//     query: gql`
//         query ProductTypeQuery($id: ID!) {
//           productType(id: $id) {
//             _id
//             id
//             name
//             slug
//             content
//           }
//         }
//       `
//   });
//   return productType
// },
// async fetchAndSetFilters({ commit, dispatch, getters }, query) {
//   const { manufacturer, type } = query;
//   let manufacturerSelected, productTypeSelected;
//   if (manufacturer) {
//     manufacturerSelected = getters.getManufacturerBySlug[manufacturer];
//   }
//   if (type) {
//     productTypeSelected = await dispatch("fetchProductTypeBySlug", type)
//   }
//   await commit("setFilters", { productType: productTypeSelected, manufacturer: manufacturerSelected })
// },
// async fetchCategory({ commit }, id) {

//   const {
//     data: { category }
//   } = await this.app.apolloProvider.defaultClient.query({
//     query: gql`
//         query CategoryQuery($id: ID!) {
//           category(id: $id) {
//             id
//             description
//             metaDescription
//             name
//             slug
//             content
//             manufacturers(sort: "name:asc") {
//               _id
//               name
//               slug
//             }
//             parent {
//               slug
//               name
//               children {
//                 id
//                 name
//                 slug
//               }
//             }
//             children {
//               id
//               name
//               slug
//             }
//             product_types(sort: "name:asc") {
//               _id
//               name
//               slug
//             }
//           }
//         }
//       `,
//     variables: {
//       id,
//     },
//   });
//   await commit("category", category);

// },

// async fetchCategoryProducts({ getters, state }, start = 0) {
//   // : { sessionStorage: { categoryPage: { limit, manufacturerSelected, productTypeSelected } }, localStorage: { category: { sort } } }
//   const { limit, manufacturerSelected, productTypeSelected } = state.sessionStorage.categoryPage
//   const { sort } = state.localStorage.category
//   const {
//     data: { products }
//   } = await this.app.apolloProvider.defaultClient.query({
//     query: gql`
//         query productsQuery(
//           $manufacturer: ID
//           $category: [ID!]
//           $product_type: ID
//           $sort: String
//           $limit: Int
//           $start: Int
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
//           ) {
//             id
//             name
//             slug
//             weight
//             isDiscount
//             isHalal
//             priceNum
//             discountPrice
//             rating
//             minimumOrder
//             piece
//             manufacturer {
//               name
//               slug
//             }
//             category {
//               name
//               slug
//             }
//             img {
//               url
//               name
//               formats
//             }
//           }
//         }
//       `,
//     variables: {
//       start: start,
//       category: getters.categoriesIds,
//       // category: categoriesIds,
//       limit: limit,
//       sort: sort.value,
//       ...(!!manufacturerSelected && {
//         manufacturer: manufacturerSelected._id,
//       }),
//       ...(!!productTypeSelected && {
//         product_type: productTypeSelected._id,
//       }),
//     },
//   });
//   // await commit("setCategoryProducts", products)

//   return products
// },
// async cleanFilters({ commit }) {
//   await commit("setFilters", {})
// },
// async changeProductType({ commit, dispatch }, item) {
//   let productTypeNew = null;
//   if (item) {
//     productTypeNew = await dispatch("fetchProductType", item)
//   }
//   await commit("setFilters", { productType: productTypeNew })
// },
// async changeManufacturer({ commit }, manufacturer) {
//   await commit("setFilters", { manufacturer })
// },

// async changeSort({ commit }, value) {
//   await commit("setSort", value)
// },


// category(state, item) {
//   state.sessionStorage.categoryPage.category = item
// },
// setCategoryMinimal(state, category) {
//   state.sessionStorage.categoryPage.categoryMinimal = category
// },
// setFilters(state, { manufacturer = null, productType = null }) {
//   state.sessionStorage.categoryPage.manufacturerSelected = manufacturer
//   state.sessionStorage.categoryPage.productTypeSelected = productType
// },

// setSort(state, value) {
//   state.localStorage.category.sort = value
// },

// updateCartByID(state, { id, quantity }) {
//   const record = state.localStorage.cartItemList.find(element => element.id == id);
//   if (record) {
//     record.quantity = quantity;
//   }
// },
// addToCart(state, item) {
//   const product = new CartProduct(item)
//   state.localStorage.cartItemList.push({
//     ...product,
//     quantity: product.minimumOrder
//   });
// },
// setCart(state, productList) {
//   if (productList) {
//     state.localStorage.cartItemList = productList;
//   }
// },
// removeCartItem(state, id) {
//   const record = state.localStorage.cartItemList.find(element => element.id == id);
//   if (record) {
//     state.localStorage.cartItemList.splice(state.localStorage.cartItemList.indexOf(record), 1);
//   }
// },
// incrementCart(state, id) {
//   const record = state.localStorage.cartItemList.find(element => element.id == id);
//   if (record) {
//     record.quantity += record.minimumOrder;
//   }
// },
// decrementCart(state, id) {
//   const record = state.localStorage.cartItemList.find(element => element.id == id);
//   if (record) {
//     const quantityNew = record.quantity -= record.minimumOrder
//     if (quantityNew > 0) {
//       record.quantity = quantityNew
//     } else {
//       state.localStorage.cartItemList.splice(state.localStorage.cartItemList.indexOf(record), 1);
//     }
//   }
// },


// getProductTypeBySlug(state) {
//   return state.sessionStorage.categoryPage.category.product_types.reduce((out, item) => {
//     out[item.slug] = item
//     return out
//   }, {})
// },
// isChildCategory(state) {
//   const category = state.sessionStorage.categoryPage.categoryMinimal
//   // { sessionStorage: { categoryPage: { categoryMinimal: category } } }
//   if (!!category.parent.length) {
//     return true
//   }
//   return false
// },
// categoriesIds(state, getters) {
//   // { sessionStorage: { categoryPage: { categoryMinimal: category } } }
//   const category = state.sessionStorage.categoryPage.categoryMinimal
//   if (getters.isChildCategory) {
//     return [category.id]
//   }
//   return getters.categorySubcategoriesIDs
// },
// rootCategory(state, getters) {
//   // { sessionStorage: { categoryPage: { categoryMinimal: category } } }
//   const category = state.sessionStorage.categoryPage.categoryMinimal
//   if (getters.isChildCategory) {
//     return getters.getCategoryBySlug[category.parent[0].slug]
//   }
//   return category
// },
// categorySubcategories({ }, getters) {
//   const rootCategory = getters.rootCategory
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
// categorySubcategoriesIDs({ }, getters) {
//   return getters.categorySubcategories.map(item => item.id)
// },
// categoryMeta(state) {
//   const { category: { name: categoryName, metaDescription, content: categoryContent }, manufacturerSelected, productTypeSelected } = state.sessionStorage.categoryPage
//   if (!categoryName) {
//     return {}
//   }
//   let name = `${categoryName} оптом`;
//   let description = metaDescription
//     ? metaDescription
//     : `${name} от компании Альянс Фуд с доставкой по всей РФ и СНГ по самым выгодным оптовым ценам от производителя.`;
//   let content = categoryContent;

//   if (manufacturerSelected) {
//     name = `${categoryName} ${manufacturerSelected.name} оптом`;
//     description = `${name}. ${description}`;
//   } else if (productTypeSelected) {
//     name = `${productTypeSelected.name} оптом`;
//     description = `${name}. ${description}`;
//     if (productTypeSelected.content) {
//       content = productTypeSelected.content.concat(categoryContent);
//     }
//   }
//   return {
//     name,
//     description,
//     content,
//   }
// },

// categoryBreadcrumbs(state, getters) {

//   const { name: rootName, slug: rootSlug } = getters.rootCategory
//   const { name, slug } = state.sessionStorage.categoryPage.categoryMinimal
//   let items = [
//     {
//       to: "/",
//       text: "Главная",
//     },
//     {
//       to: "/catalog",
//       text: "Каталог",
//     },
//     {
//       to: `/catalog/${rootSlug}`,
//       text: rootName,
//     }
//   ];

//   if (slug !== rootSlug) {
//     items.push({
//       to: `/catalog/${slug}`,
//       text: name,
//     });
//   }
//   return items
// },


// cart(state) {
//   const cart = state.localStorage.cartItemList.reduce((acc, product) => {
//     const newProd = Object.assign({}, product)
//     newProd.subSumm = product.isDiscount
//       ? Math.round(product.discountPrice * product.quantity)
//       : Math.round(product.priceNum * product.quantity)
//     acc.push(newProd)
//     return acc
//   }, [])
//   return cart
// },
// cartSumm(state) {
//   const summa = state.localStorage.cartItemList.reduce(
//     (acc, product) => {
//       acc =
//         product.isDiscount && product.discountPrice ?
//           acc + product.discountPrice * product.quantity :
//           acc + product.quantity * product.priceNum;
//       return acc;
//     }, 0)

//   return summa
// },
// isCart(state) {
//   return state.localStorage.cartItemList && !!state.localStorage.cartItemList.length
// },
// cartLength(state) {
//   return state.localStorage.cartItemList.length
// },
// isInCartByIds(state, getters) {
//   if (!getters.isCart) {
//     return {};
//   }
//   return state.localStorage.cartItemList.reduce((out, item) => {
//     out[item.id] = true
//     return out
//   }, {})
// },
// quantity: (state) => id => {
//   const record = state.localStorage.cartItemList.find((element) => element.id == id)
//   if (record) {
//     return record.quantity
//   } else {
//     return 0
//   }
// },


// menuItems(state, getters) {
//   return [
//     {
//       name: "Каталог",
//       slug: "catalog",
//       to: "/catalog",
//       disable: true,
//       isChild: true,
//       items: [
//         ...getters.getParentCategories,
//         { name: "Акционная продукция", slug: "discount" },
//         { name: "Халяльная продукция", slug: "halal" },
//       ],
//     },
//     {
//       name: "Производители",
//       slug: "manufacturers",
//       to: "/manufacturers",
//       disable: false,
//       isChild: true,
//       items: state.sessionStorage.generalInfo.manufacturers,
//     },
//     {
//       name: "О компании",
//       slug: "about",
//       to: "/about",
//       disable: false,
//       isChild: true,
//       items: [
//         {
//           name: "Доставка",
//           slug: "delivery",
//         },
//         {
//           name: "Условия сотрудничества",
//           slug: "usloviya-sotrudnichestva",
//         },
//       ]
//     },
//     {
//       name: "Контакты",
//       slug: "contacts",
//       to: "/contacts",
//       disable: false,
//       isChild: false,
//     },
//   ];
// },
// getParentCategories(state) {
//   return state.sessionStorage.generalInfo.categories.filter(
//     item => item.parent.length === 0
//   )
// },
// getCategoryBySlug(state) {
//   return state.sessionStorage.generalInfo.categories.reduce((out, item) => {
//     out[item.slug] = item
//     return out
//   }, {})
// },

// getManufacturerBySlug(state) {
//   return state.sessionStorage.generalInfo.manufacturers.reduce((out, item) => {
//     out[item.slug] = item
//     return out
//   }, {})
// },
