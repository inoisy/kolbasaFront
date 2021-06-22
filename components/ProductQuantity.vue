<template>
    <div class="d-flex align-center">
        <v-btn
            class="quantity-btn"
            icon
            color="#333"
            title="Убрать из корзины"
            @click="handleDecrement"
        >
            <v-icon>$minus</v-icon>
        </v-btn>
        <v-text-field
            class="quantity"
            :value="quantity"
            rounded
            dense
            single-line
            hide-details
            filled
            type="number"
            @change="handleChange"
        />
        <v-btn
            class="quantity-btn"
            icon
            color="#333"
            title="Добавить в корзину"
            @click="hanleIncrement"
        >
            <v-icon>$plus</v-icon>
        </v-btn>
    </div>
</template>

<script>
export default {
    props: {
        id: {
            type: String,
            required: true,
        },
    },
    computed: {
        quantity() {
            return this.$store.getters['cart/quantity'](this.id);
        },
    },


    watch: {
        quantity(newCount, oldCount) {
            if (newCount <= 0) {
                this.$emit('deleted');
            }
        },
    },
    methods: {
        async handleChange(qty) {
            const quantity = parseInt(qty);
            if (quantity > 0) {
                const quan = await this.$store.dispatch('cart/updateCartById', {
                    id: this.id,
                    quantity,
                });
                return quan;
            } else {
                this.$store.dispatch('cart/removeItemInCart', this.id);
                return 0;
            }
        },
        async hanleIncrement() {
            await this.$store.dispatch('cart/incrementCart', this.id);
        },
        async handleDecrement() {
            await this.$store.dispatch('cart/decrementCart', this.id);
        },
    },
};
</script>

<style lang="scss" scoped>
    .quantity {
        flex: 0 1 80px;
        height: 100%;
        border-radius: var(--quantity-border-radius, 20px);

        ::v-deep .v-input__control {
            min-width: 45px;
            height: 100%;

            .v-input__slot {
                height: 100%;
                padding: 0;
            }
        }

        ::v-deep input {
            text-align: center !important;
        }
    }

    .quantity-btn {
        margin-right: var(--quantity-btn-margin);
        margin-left: var(--quantity-btn-margin);
    }
</style>
