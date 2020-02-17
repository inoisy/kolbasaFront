// import gql from "graphql-tag";
// const baseUrl = process.env.baseUrl
export const state = () => ({
  loading: false,
  sortFilter: {},
  manufacturerFilter: null,
  pageFilter: 1,
  easyProducts: [],
  category: {},
  manufacturer: {},
  generalInfo: {},
  products: {
    items: [],
    count: 0
  }
})
