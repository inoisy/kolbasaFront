const categoryLimit = 20;
export const state = () => ({

  generalInfo: {
    contacts: {
      phone: ""
    },
    categories: [],
    manufacturers: []
  },
  // breadcrumbs: [],
  categoryPage: {
    category: {
      parent: [],
      product_types: [],
      manufacturers: []
    },
    // rootCategory: {
    //   children: []
    // },
    limit: categoryLimit,
    manufacturerSelected: null,
    // isManufacturerSelected: false,
    productTypeSelected: null,
    // isProductTypeSelected: false,
    // categoriesIds: [],
    categoryMinimal: {
      parent: [],
    },

    // products: new Array(categoryLimit).fill(false)
  },

})
