<template>
  <div>
    <h3 class="pl-0 mb-5">
      <span>Заказ</span>
      <span v-if="order.oneClick">&nbsp;в один клик&nbsp;</span>
      <span>{{ order.date }}</span>
      <span v-if="!order.oneClick">на сумму {{ order.summa }}</span>
    </h3>
    <div class="mb-3">
      <h3 class="mb-2">Получатель</h3>
      <div class="mb-3">{{ order.name }} {{ order.phone }}</div>
      <v-divider></v-divider>
    </div>
    <div v-if="order.address" class="mb-3">
      <h3 class="mb-2">Адрес доставки</h3>
      <div class="mb-3">{{ order.address }}</div>
      <v-divider></v-divider>
    </div>
    <div v-if="order.oneClick">Товар: {{ order.data.product }}</div>
    <div v-else-if="products.length">
      <h3>Состав заказа</h3>
      <v-simple-table class="mb-3">
        <thead>
          <tr>
            <th colspan="2">Наименование</th>
            <th class="px-1 text-center">Количество</th>
            <th class="px-1 text-center">Цена</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(product, index) in this.products"
            :key="'product-item-wrapper' + index"
          >
            <td class="px-1">
              <v-avatar>
                <v-img
                  contain
                  :src="
                    product.img
                      ? product.img.formats && product.img.formats.thumbnail
                        ? imageBaseUrl + product.img.formats.thumbnail.url
                        : imageBaseUrl + product.img.url
                      : '/no-image.png'
                  "
                  :alt="product.name"
                />
              </v-avatar>
            </td>
            <td class="px-1">
              <nuxt-link
                v-if="product.category && product.category.slug"
                :to="`/catalog/${product.category.slug}/${product.slug}`"
                class="d-block underline-on-hover"
                :title="product.name"
                >{{ product.name }}</nuxt-link
              >
            </td>
            <td class="px-1 text-center">{{ product.qty }}</td>
            <td class="px-1">
              <div
                class="price ml-1 display-flex align-center justify-center font-weight-medium"
              >
                {{ product.priceAll }}
              </div>
            </td>
          </tr>
          <tr style="background: white !important" v-if="order.summa">
            <td></td>
            <td></td>
            <td class="text-right">Итого:</td>
            <td class="text-center font-weight-bold">{{ order.summa }}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </div>

    <div v-if="!order.oneClick">
      <v-btn block @click="repeatOrder">Повторить заказ</v-btn>
    </div>
  </div>
</template>
<script>
import gql from "graphql-tag";
export default {
  props: ["order"],
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      products: [],
    };
  },
  async mounted() {
    if (!this.order.oneClick) {
      this.products = await this.fetchProducts();
    }
  },
  methods: {
    async repeatOrder() {
      await this.$store.dispatch("cart/clearCart");
      for (let product of this.products) {
        await this.$store.dispatch("cart/addToCart", product);
      }
    },
    async fetchProducts() {
      if (Array.isArray(this.order.data) && this.order.data.length) {
        const { data: products } = await this.$apollo.query({
          query: gql`
            query ProductsOrderQuery($ids: [ID!]) {
              products(where: { id_in: $ids }) {
                id
                name
                slug
                priceNum
                isDiscount
                discountPrice
                minimumOrder
                category {
                  slug
                }
                img {
                  url
                  formats
                }
              }
            }
          `,
          variables: {
            ids: this.order.data.map((item) => item.id),
          },
        });
        if (products.products && products.products.length) {
          const productsMapped = this.order.data.map((product) => {
            product = {
              ...products.products.find((item) => item.id === product.id),
              ...product,
            };
            return product;
          });
          return productsMapped;
        } else {
          return [];
        }
      } else {
        return [];
      }
    },
  },
};
</script>