const sortItems = [
  { title: "По алфавиту", value: "name:asc", slug: "name" },
  { title: "По популярности", value: "rating:desc", slug: "rating" },
  { title: "Cначала дорогие", value: "priceNum:desc", slug: "pricedesc" },
  { title: "Cначала дешевые", value: "priceNum:asc", slug: "priceasc" },
];
export const state = () => ({
  cartItemList: [],
  category: {
    sort: sortItems[1],
    sortItems: sortItems,
  }
})