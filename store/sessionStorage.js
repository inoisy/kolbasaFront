const categoryLimit = 20;
export const state = () => ({
  generalInfo: {
    contacts: {
      phone: ""
    }
  },
  // breadcrumbs: [],
  categoryPage: {
    category: {
      product_types: [],
      manufacturers: []
    },
    rootCategory: {
      children: []
    },
    limit: categoryLimit,
    manufacturerSelected: null,
    isManufacturerSelected: false,
    productTypeSelected: null,
    isProductTypeSelected: false,
    categoriesIds: [],
    categoryMinimal: {},
    products: new Array(categoryLimit).fill(false)
  },

})
