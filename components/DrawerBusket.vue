<template>
    <v-navigation-drawer
        :value="show"
        temporary
        fixed
        right
        touchless
        width="550px"
        @input="change"
    >
        <!--v-click-outside="change" @input="change" stateless
    v-click-outside="change" -->
        <div class="pb-6 basketWrapper">
            <v-app-bar class="grey lighten-3 px-2"
                       height="100px"
                       flat
            >
                <v-btn
                    v-show="!offer"
                    title="Закрыть"
                    class="mr-3"
                    outlined
                    icon
                    large
                    @click="basketClose"
                >
                    <v-icon>$close</v-icon>
                </v-btn>
                <v-btn
                    v-show="offer && isSummValid"
                    outlined
                    icon
                    large
                    class="mr-3 ml-0"
                    title="Назад"
                    @click="offer = false"
                >
                    <v-icon>$prev</v-icon>
                </v-btn>
                <h2 class="mb-0 font-weight-bold">
                    {{ offer && isSummValid ? "Оформление заказа" : "Корзина" }}
                </h2>
                <v-btn
                    v-show="!offer"
                    outlined
                    icon
                    large
                    class="ml-auto mr-0"
                    title="Очистить корзину"
                    @click="clearBasket"
                >
                    <v-icon>{{ icons.mdiDeleteForeverOutline }}</v-icon>
                </v-btn>
            </v-app-bar>
            <div v-show="!offer" class="px-4 pt-4">
                <v-row>
                    <v-col cols="12">
                        <v-simple-table class="mb-3">
                            <thead>
                                <tr>
                                    <th colspan="2">Наименование</th>
                                    <th class="px-1 text-center">Количество</th>
                                    <th class="px-1 text-center">Цена</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    v-for="(product, index) in basket"
                                    :key="'product-item-wrapper' + index"
                                >
                                    <td class="px-1">
                                        <v-avatar>
                                            <v-img
                                                contain
                                                :src="
                                                    product.img
                                                        ? imageBaseUrl + product.img
                                                        : '/no-image.png'
                                                "
                                                :alt="product.name"
                                            >
                                                <!-- <template v-slot:placeholder>
                          <image-placeholder />
                        </template> -->
                                            </v-img>
                                        </v-avatar>
                                    </td>
                                    <td class="px-1">
                                        <nuxt-link
                                            v-if="product.categorySlug"
                                            class="busket-product-name underline-on-hover"
                                            :to="`/catalog/${product.categorySlug}/${product.slug}`"
                                            :title="product.name"
                                        >
                                            {{ product.name }}
                                        </nuxt-link>
                                    </td>
                                    <td class="px-1">
                                        <product-quantity
                                            :id="product.id"
                                            class="buscetProductQuantity"
                                        />
                                    </td>
                                    <td class="price">
                                        {{ product.subSumm }}
                                    </td>
                                    <td class="px-1">
                                        <v-btn
                                            class="display-flex"
                                            title="Удалить"
                                            icon
                                            @click="deleteFromBasket(product.id)"
                                        >
                                            <v-icon>{{ icons.mdiDeleteEmptyOutline }} </v-icon>
                                        </v-btn>
                                    </td>
                                </tr>
                                <tr style="background: white !important;">
                                    <td></td>
                                    <td></td>
                                    <td class="text-right">Итого:</td>
                                    <td class="text-center font-weight-bold">
                                        {{ Math.round(summa) }}
                                    </td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </v-simple-table>
                    </v-col>
                    <v-col v-if="!isSummValid" cols="12">
                        <v-alert type="error"
                                 :value="!isSummValid"
                                 class="mb-0"
                        >
                            Сумма заказа ниже 3000. Наберите товаров еще на
                            {{ Math.round(3000 - summa) }} рублей.
                        </v-alert>
                    </v-col>
                    <v-col v-show="isSummValid">
                        <v-btn
                            color="accent"
                            class="ml-0"
                            large
                            block
                            title="Оформить заказ"
                            @click="handleOfferClick"
                        >
                            Оформить заказ
                        </v-btn>
                    </v-col>
                    <v-col>
                        <v-btn large
                               block
                               outlined
                               @click="basketClose"
                        >
                            Назад к покупкам
                        </v-btn>
                    </v-col>
                </v-row>
            </div>
            <div v-if="offer && isSummValid" class="px-4 pt-4">
                <v-subheader class="mb-4 pl-0">ВВЕДИТЕ ВАШИ ДАННЫЕ</v-subheader>
                <contact-form />
                <v-divider class="mt-10 mb-6"></v-divider>
                <v-subheader class="pl-0">ВАШ ЗАКАЗ</v-subheader>
                <v-simple-table>
                    <thead>
                        <tr>
                            <th class="text-left pl-0">Наименование</th>
                            <th class="text-center">Количество</th>
                            <th class="text-center">Цена</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in basket" :key="`busket-item-${index}`">
                            <td class="text-left pl-0">{{ item.name }}</td>
                            <td class="text-center">{{ Math.round(item.quantity) }}</td>
                            <td class="text-center">
                                {{ item.subSumm }}
                            </td>
                        </tr>
                        <tr>
                            <td class></td>
                            <td class="text-right">Итого</td>
                            <td class="text-center">{{ summa }}</td>
                        </tr>
                    </tbody>
                </v-simple-table>
            </div>
        </div>
    </v-navigation-drawer>
</template>
<style lang="scss" scoped>


    .basketWrapper {
        // --quantity-border-radius: 20px;
        // .item-wrapper {
        //   min-height: 80px;
        // }
        .busket-product-name {
            display: block;
            font-size: 12px;
            // line-height: 1;
            line-height: 125%;
        }

        .quantity {
            // min-width: 100px;
            // @include md {
            //   width: 155px;
            //   min-width: 155px;
            // }
        }

        .price {
            // min-width: 50px;
            width: 65px;
            padding-right: 5px;
            padding-left: 5px;
            text-align: center;
        }

        .btn-wrap {
            flex-wrap: wrap;
            flex-direction: column;

            .busket-btn {
                flex-grow: 1;

                @include md {
                    flex-direction: row;
                }
            }
        }
    }
</style>

<script>
import { mdiDeleteForeverOutline, mdiDeleteEmptyOutline } from '@mdi/js';


export default {
    // components: { ContactForm, ProductQuantity },.
    props: {
        show: { type: Boolean, default: false },
    },
    data() {
        return {
            imageBaseUrl: process.env.imageBaseUrl,
            offer: false,
            // cart: {},
            icons: {
                mdiDeleteForeverOutline,
                mdiDeleteEmptyOutline,
            },
        };
    },
    computed: {
        isCart() {
            return this.$store.getters['cart/isCart'];
        },
        summa() {
            return this.$store.getters['cart/cartSumm'];
        },
        isSummValid() {
            return this.summa >= 3000;
        },
        basket() {
            return this.$store.getters['cart/cart'];
        },
    },
    watch: {
        isCart(val) {
            if (!val) {
                this.basketClose();
            }
        },
    },
    methods: {
        change(val) {
            if (!val) {
                this.basketClose();
            }
        },
        basketClose() {
            return this.$emit('close');
        },
        handleOfferClick() {
            this.offer = true;
        },
        async clearBasket() {
            // TODO CREATE MODAL
            await this.$store.dispatch('cart/clearCart');
        },
        async deleteFromBasket(id) {
            await this.$store.dispatch('cart/removeItemInCart', id);
        },
    },
};
</script>
