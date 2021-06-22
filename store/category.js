const sortItems = [
    { title: "По алфавиту", value: "name:asc", slug: "name" },
    { title: "По популярности", value: "rating:desc", slug: "rating" },
    { title: "Cначала дорогие", value: "priceNum:desc", slug: "pricedesc" },
    { title: "Cначала дешевые", value: "priceNum:asc", slug: "priceasc" },
];

export const state = () => ({
    sort: sortItems[1],
    sortItems: sortItems,
    // status: true
})

export const mutations = {
    setSort(state, value) {
        state.sort = value
    },
}
export const actions = {
    async changeSort({ commit }, value) {
        await commit("setSort", value)
    },
}