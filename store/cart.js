class CartProduct {
    constructor(item) {
        if (item.id) {
            this.id = item.id;
        }
        if (item._id) {
            this.id = item._id;
        }
        if (item.category) {
            this.categorySlug = item.category.slug;
        }

        this.discountPrice = item.discountPrice;
        if (item.img) {
            this.img = item.img.formats && item.img.formats.thumbnail ? item.img.formats.thumbnail.url : item.img.url;
        }
        this.isDiscount = item.isDiscount;
        this.minimumOrder = item.minimumOrder || 1;
        this.priceNum = item.priceNum;
        this.slug = item.slug;
        this.weight = item.weight;
        this.name = item.name;
    }
}
export const state = () => ({
    cartItemList: [],

});

export const getters = {
    cart(state) {
        const cart = state.cartItemList.reduce((acc, product) => {
            const newProd = Object.assign({}, product);
            newProd.subSumm = product.isDiscount ?
                Math.round(product.discountPrice * product.quantity) :
                Math.round(product.priceNum * product.quantity);
            acc.push(newProd);
            return acc;
        }, []);
        return cart;
    },
    cartSumm(state) {
        const summa = state.cartItemList.reduce((acc, product) => {
            acc =
                    product.isDiscount && product.discountPrice ?
                        acc + product.discountPrice * product.quantity :
                        acc + product.quantity * product.priceNum;
            return acc;
        }, 0);

        return summa;
    },
    isCart(state) {
        return state.cartItemList && Boolean(state.cartItemList.length);
    },
    cartLength(state) {
        return state.cartItemList.length;
    },
    isInCartByIds(state, getters) {
        if (!getters.isCart) {
            return {};
        }
        return state.cartItemList.reduce((out, item) => {
            out[item.id] = true;
            return out;
        }, {});
    },
    quantity: state => id => {
        const record = state.cartItemList.find(element => element.id == id);
        if (record) {
            return record.quantity;
        } else {
            return 0;
        }
    },
};
export const mutations = {

    updateCartByID(state, { id, quantity }) {
        const record = state.cartItemList.find(element => element.id == id);
        if (record) {
            record.quantity = quantity;
        }
    },
    addToCart(state, item) {
        const product = new CartProduct(item);
        state.cartItemList.push({
            ...product,
            quantity: product.minimumOrder,
        });
    },
    setCart(state, productList) {
        if (productList) {
            state.cartItemList = productList;
        }
    },
    removeCartItem(state, id) {
        const record = state.cartItemList.find(element => element.id == id);
        if (record) {
            state.cartItemList.splice(state.cartItemList.indexOf(record), 1);
        }
    },
    incrementCart(state, id) {
        const record = state.cartItemList.find(element => element.id == id);
        if (record) {
            record.quantity += record.minimumOrder;
        }
    },
    decrementCart(state, id) {
        const record = state.cartItemList.find(element => element.id == id);
        if (record) {
            const quantityNew = record.quantity -= record.minimumOrder;
            if (quantityNew > 0) {
                record.quantity = quantityNew;
            } else {
                state.cartItemList.splice(state.cartItemList.indexOf(record), 1);
            }
        }
    },
};
export const actions = {
    addToCart({ commit }, item) {
        commit('addToCart', item);
    },
    updateCartById({ commit, state }, { id, quantity }) {
        const record = state.cartItemList.find(element => element.id == id);
        if (record) {
            let newQuantity;
            if (record.minimumOrder > 1) {
                const ostatok = quantity % record.minimumOrder;
                if (ostatok !== 0) {
                    newQuantity = quantity + (record.minimumOrder - ostatok);
                } else {
                    newQuantity = quantity;
                }
            } else {
                newQuantity = quantity;
            }
            if (record.quantity !== newQuantity) {
                commit('updateCartByID', { id, quantity: newQuantity });
                return newQuantity;
            } else {
                return record.quantity;
            }
        }
    },
    removeItemInCart({ commit }, id) {
        commit('removeCartItem', id);
    },
    incrementCart({ commit }, id) {
        commit('incrementCart', id);
    },
    decrementCart({ commit }, id) {
        commit('decrementCart', id);
    },


    clearCart({ commit }) {
        commit('setCart', []);
    },
};
