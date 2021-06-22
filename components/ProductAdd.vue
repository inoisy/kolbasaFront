<template>
    <div>
        <lazy-product-quantity
            v-if="isMounted && isInCart"
            :id="id"
            class="productQuantity"
        />

        <v-btn
            v-else
            class="productAddButton"
            large
            title="Добавить в корзину"
            @click="handleAdd"
        >
            Добавить в корзину
        </v-btn>
    </div>
</template>

<script>
export default {
    props: {
        id: {
            type: String,
            default: '',
            required: true,
        },
        isCard: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            isMounted: false,
        };
    },
    computed: {
        isInCart() {
            return this.$store.getters['cart/isInCartByIds'][this.id];
        },
    },
    mounted() {
        this.isMounted = true;
    },
    methods: {
        async handleAdd() {
            this.$emit('add');
        },
    },
};
</script>

<style lang="scss" scoped >
    .productQuantity {
        justify-content: var(--quantity-justify, center);
        width: 100%;
        height: 100%;
        border-radius: 4px;
        border-color: #e0e0e0 !important;
        background-color: #e0e0e0 !important;
    }

    .productAddButton {
        width: 100%;
        height: 100% !important;
        border-radius: 4px;
        background-color: var(--product-add-background) !important;
        font-size: var(--product-add-font-size);
        color: var(--product-add-color) !important;
        box-shadow: var(--product-add-box-shadow);
    }
</style>
