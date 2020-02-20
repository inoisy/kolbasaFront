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
                  v-lazy="product.item.img ? imageBaseUrl+product.item.img.url : require('~/assets/no-image.png')"
                  :alt="product.item.name"
                />
              </v-avatar>
            </td>
            <td class="px-1">
              <nuxt-link
                v-if="product.item.category && product.item.category.slug"
                :to="`/catalog/${product.item.category.slug}/${product.item.slug}`"
                class="d-block underline-on-hover"
                :title="product.item.name"
              >{{product.item.name}}</nuxt-link>
            </td>
            <td class="px-1">
              <product-quantity
                :id="product.item.id"
                :qty="product.count"
                style="max-width: 185px"
                class="mx-auto"
              ></product-quantity>
            </td>
            <td class="px-1">
              <div
                class="price ml-1 display-flex align-center justify-center font-weight-medium"
              >{{product.item.isDiscount ? product.item.discountPrice*product.count : product.item.priceNum*product.count }}</div>
            </td>
            <td class="px-1">
              <v-btn
                @click="(e)=>deleteFromBasket(e,product.item.id)"
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
            <td class="text-center font-weight-bold">{{summa}}</td>
            <td></td>
          </tr>
        </tbody>
      </v-simple-table>
      <div>
        <v-alert type="error" :value="!isSummValid">
          Сумма заказа ниже 3000.
          Наберите товаров еще на {{3000-summa}} рублей.
        </v-alert>
        <v-btn
          @click="handleOfferClick"
          v-show="isSummValid"
          color="accent"
          class="busket-btn ml-0 mt-3"
          large
          title="Оформить заказ"
        >Оформить заказ</v-btn>
        <v-btn @click="basketClose" class="busket-btn mt-3" large outlined>Назад к покупкам</v-btn>
      </div>
    </div>
    <div v-if="offer && isSummValid" class="px-4 pt-4">
      <v-subheader class="mb-4 pl-0">ВВЕДИТЕ ВАШИ ДАННЫЕ</v-subheader>
      <contact-form class />
      <v-divider class="mt-10 mb-6"></v-divider>
      <v-subheader class="pl-0">ВАШ ЗАКАЗ</v-subheader>
      <v-simple-table>
        <thead>
          <tr>
            <th class="text-left pl-0">Наименование</th>
            <th class="text-center">Цена</th>
            <th class="text-center">Количество</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in basket" :key="item.item.name">
            <td class="text-left pl-0">{{ item.item.name }}</td>
            <td class="text-center">{{ item.item.priceNum }}</td>
            <td class="text-center">{{ item.count}}</td>
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
  // width: 100px;
  min-width: 100px;
  // display: flex;
  // align-items: center;
}

.price {
  // flex-basis: 50px;
  min-width: 50px;
}

.busket-btn {
  width: 100%;
}

@media (min-width: 960px) {
  .busket-btn {
    width: auto;
  }

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
  props: ["summa"],
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
    // summa() {
    //   let summ = 0;
    //   for (let id of Object.keys(this.$store.state.localStorage.basket)) {
    //     const product = this.$store.state.localStorage.basket[id];
    //     if (product.item.isDiscount && product.item.discountPrice) {
    //       summ = summ + product.count * product.item.discountPrice;
    //     } else if (product.item.priceNum && product.count) {
    //       summ = summ + product.count * product.item.priceNum;
    //     }
    //   }
    //   return summ;
    // },
    isSummValid() {
      return this.summa > 3000;
    },

    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    basket() {
      return Object.values(this.$store.state.localStorage.basket);
    },
    isBasket() {
      return (
        this.$store.state.localStorage.basket &&
        this.$store.state.localStorage.basket.length > 0
      );
    }
  }
};
</script>


