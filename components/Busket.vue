<template>
  <div class="pb-6 basketWrapper">
    <v-app-bar class="grey lighten-3 px-2" height="100px" flat>
      <v-btn v-show="!offer" @click="basketClose" title="Закрыть" class="mr-3" outlined icon large>
        <v-icon>close</v-icon>
      </v-btn>
      <v-btn
        v-show="offer && isSummValid"
        outlined
        @click="offer=false"
        icon
        large
        class="mr-3 ml-0"
        title="Назад"
      >
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <h2 class="mb-0 font-weight-bold">{{offer && isSummValid ? 'Оформление заказа' : 'Корзина'}}</h2>
      <v-btn
        v-show="!offer"
        @click="clearBasket"
        outlined
        icon
        large
        class="ml-auto mr-0"
        title="Очистить корзину"
      >
        <v-icon>delete</v-icon>
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
              <tr v-for="(product,index) in basket" :key="'product-item-wrapper'+index">
                <td class="px-1">
                  <v-avatar>
                    <img
                      style="object-fit: cover;"
                      v-lazy="product.img ? product.img.formats  && product.img.formats.thumbnail ? imageBaseUrl + product.img.formats.thumbnail.url : imageBaseUrl+product.img.url : require('~/assets/no-image.png')"
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
                  >{{product.name}}</nuxt-link>
                </td>
                <td class="px-1">
                  <product-quantity
                    :id="product.id"
                    :qty="product.count"
                    style="max-width: 185px"
                    class="mx-auto"
                  ></product-quantity>
                </td>
                <td class="px-1">
                  <div
                    class="price ml-1 display-flex align-center justify-center font-weight-medium"
                  >{{product.isDiscount ? Math.round(product.discountPrice*product.count) : Math.round(product.priceNum*product.count) }}</div>
                </td>
                <td class="px-1">
                  <v-btn
                    @click="(e)=>deleteFromBasket(e,product.id)"
                    class="display-flex"
                    title="Удалить"
                    icon
                  >
                    <v-icon>close</v-icon>
                  </v-btn>
                </td>
              </tr>
              <tr style="background: white !important;">
                <td></td>
                <td></td>
                <td class="text-right">Итого:</td>
                <td class="text-center font-weight-bold">{{Math.round(summa)}}</td>
                <td></td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-col>
        <v-col v-if="!isSummValid" cols="12">
          <v-alert type="error" :value="!isSummValid" class="mb-0">
            Сумма заказа ниже 3000.
            Наберите товаров еще на {{Math.round(3000-summa)}} рублей.
          </v-alert>
        </v-col>
        <v-col v-show="isSummValid">
          <v-btn
            @click="handleOfferClick"
            color="accent"
            class="ml-0"
            large
            block
            title="Оформить заказ"
          >Оформить заказ</v-btn>
        </v-col>
        <v-col>
          <v-btn @click="basketClose" large block outlined>Назад к покупкам</v-btn>
        </v-col>
      </v-row>
    </div>
    <div v-if="offer && isSummValid" class="px-4 pt-4">
      <v-subheader class="mb-4 pl-0">ВВЕДИТЕ ВАШИ ДАННЫЕ</v-subheader>
      <contact-form @offerClose="offer=false" />
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
          <tr v-for="(item,index) in basket" :key="`busket-item-${index}`">
            <td class="text-left pl-0">{{ item.name }}</td>
            <td class="text-center">{{ Math.round(item.count)}}</td>
            <td class="text-center">{{ item.priceNum }}</td>
          </tr>
          <tr>
            <td class></td>
            <td class="text-right">Итого</td>
            <td class="text-center">{{summa}}</td>
          </tr>
        </tbody>
      </v-simple-table>
    </div>
  </div>
</template>
<style lang="stylus" scoped>
.toolbar-inner {
  display: flex;
  align-items: center;
  width: 100%;
}

.item-wrapper {
  min-height: 80px;
}

.quantity {
  min-width: 100px;
}

.price {
  min-width: 50px;
}

.btn-wrap {
  flex-wrap: wrap;
  flex-direction: column;

  .busket-btn {
    flex-grow: 1;
  }
}

// .busket-btn {
// width: 100%;
// }
@media (min-width: 960px) {
  .btn-wrap {
    flex-direction: row;

    // flex-direction:column
    .busket-btn {
      // flex: 1;
    }
  }

  // .busket-btn {
  // width: 49%;
  // }
  .quantity {
    width: 155px;
    min-width: 155px;
  }
}
</style>

<script>
import ContactForm from "~/components/ContactForm";
import ProductQuantity from "~/components/ProductQuantity";

export default {
  components: { ContactForm, ProductQuantity },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      offer: false,
      cart: {}
    };
  },
  watch: {
    basket() {
      if (this.basket.length === 0) {
        this.basketClose();
      }
    }
  },
  methods: {
    basketClose() {
      return this.$emit("close");
    },
    handleOfferClick() {
      this.offer = true;
    },
    async clearBasket() {
      await this.$store.commit("clearBasket");
    },
    async deleteFromBasket(event, id) {
      await this.$store.commit("deleteFromBasket", id);
    }
  },
  computed: {
    summa() {
      return this.$store.getters.summa;
    },
    isSummValid() {
      return this.summa > 3000;
    },
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    basket() {
      return this.$store.state.localStorage.basket;
    }
  }
};
</script>


