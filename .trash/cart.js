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
    }
}

export const state = () => ({
    cartItemList: []
})

export const mutations = {
    'UPDATE_CART_BY_ID'(state, { id, quantity }) {
        const record = state.cartItemList.find(element => element.id == id);
        if (record) {
            record.quantity = quantity;
        }
    },
    "ADD_TO_CART"(state, { item }) {
        console.log("🚀 ~ file: cart.js ~ line 68 ~ state", state)
        const product = new CartProduct(item)
        state.cartItemList.push({
            ...product,
            quantity: product.minimumOrder
        });
    },
    'SET_CART'(state, productList) {
        if (productList) {
            state.cartItemList = productList;
        }
    },
    'REMOVE_CART_ITEM'(state, id) {
        const record = state.cartItemList.find(element => element.id == id);
        state.cartItemList.splice(state.cartItemList.indexOf(record), 1);
    },
    'INCREMENT_CART'(state, id) {
        const record = state.cartItemList.find(element => element.id == id);
        if (record) {
            record.quantity += record.minimumOrder;
        }
    },
    'DECREMENT_CART'(state, id) {
        const record = state.cartItemList.find(element => element.id == id);
        if (record) {
            const quantityNew = record.quantity -= record.minimumOrder
            if (quantityNew > 0) {
                record.quantity = quantityNew
            } else {
                state.cartItemList.splice(state.cartItemList.indexOf(record), 1);
            }
        }
    },
}

export const actions = {
    addToCart({ commit }, { item }) {
        commit("ADD_TO_CART", { item })
    },
    updateCartById({ commit, state }, { id, quantity }) {
        const record = state.cartItemList.find(element => element.id == id);
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

}

export const getters = {
    isInCart: (state) => id => {
        // console.log("🚀 ~ file: cart.js ~ line 80 ~ id", id)
        const recordIndex = state.cartItemList.findIndex((element) => element.id == id)
        // console.log("🚀 ~ file: cart.js ~ line 81 ~ record", recordIndex)
        if (recordIndex >= 0) {
            return true
        } else {
            return false
        }
    },
    quantity: (state) => id => {
        const record = state.cartItemList.find((element) => element.id == id)
        // console.log("🚀 ~ file: cart.js ~ line 81 ~ record", record)
        if (record) {
            return record.quantity
        } else {
            return 0
        }
    }
}