export const state = () => ({
    data: {
        contacts: {
            phone: ""
        },
        categories: [],
        manufacturers: [],
    },
    // status: true,
    version: 1
})

export const getters = {
    menuItems(state, getters) {
        return [
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
                items: state.data.manufacturers,
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
        return state.data.categories.filter(
            item => item.parent.length === 0
        )
    },
    getCategoryBySlug(state) {
        return state.data.categories.reduce((out, item) => {
            out[item.slug] = item
            return out
        }, {})
    },
    getManufacturerBySlug(state) {
        return state.data.manufacturers.reduce((out, item) => {
            out[item.slug] = item
            return out
        }, {})
    },
}
export const mutations = {
    // setGeneralInfo(state, data) {
    //     console.log("🚀 ~ file: generalInfo.js ~ line 81 ~ setGeneralInfo ~ item", data)
    //     state.data = data
    // }
}
export const actions = {
    // async nuxtServerInit(state) {
    //     const data = require('~/static/data.json')
    //     console.log("🚀 ~ file: generalInfo.js ~ line 88 ~ nuxtServerInit ~ data", data)
    //     await state.commit("setGeneralInfo", {
    //         ...data, contacts: data.contact
    //     })

    // },
    // setGeneralInfo({}, data) {
    //     // console.log("🚀 ~ file: generalInfo.js ~ line 81 ~ setGeneralInfo ~ item", item)
    //     // state.data = item
    //     commit("setGeneralInfo", data)
    // }
}