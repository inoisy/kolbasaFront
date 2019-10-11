<template>
  <div>
    <div v-show="!offer" class="mb-4">
      <v-toolbar class="grey lighten-2 px-2" height="100px">
        <div class="toolbar-inner">
          <h2 class="mb-0 display-3 mont font-weight-bold">Корзина</h2>
        </div>
      </v-toolbar>
      <div class="px-4 py-5" v-if="basket && basket.length > 0">
        <template v-for="(product,index) in basket" class>
          <div class="mb-1 layout row item-wrapper" :key="'item-wrapper'+index">
            <div
              class="img-wrapper display-flex gray xs2 flex pr-3 hidden-xs-only"
              style="max-width:80px; width:80px"
            >
              <img
                class="d-block ma-auto"
                style="height:80px; max-width:80px; width:80px; object-fit: contain;"
                v-lazy="product.item.img ? imageBaseUrl+product.item.img.url : require('~/assets/no-image.png')"
                :alt="product.item.name"
              />
            </div>
            <v-flex class="d-flex">
              <nuxt-link
                v-if="product.item.category && product.item.category.slug"
                :to="`/catalog/${product.item.category.slug}/${product.item.slug}`"
                class="mont d-block my-auto text-decoration-none"
              >{{product.item.name}}</nuxt-link>
            </v-flex>
            <div class="quantity align-center display-flex justify-center">
              <v-btn icon @click="(e)=> removeFromBasket(e,product.item)">
                <v-icon>remove</v-icon>
              </v-btn>
              {{product.count}}
              <v-btn icon @click="(e)=>addToBasket(e,product.item)">
                <v-icon>add</v-icon>
              </v-btn>
            </div>

            <div
              class="price display-flex display-1 align-center justify-center font-weight-medium mont"
            >{{product.item.isDiscount ? product.item.discountPrice*product.count : product.item.priceNum*product.count }}</div>
            <div class="display-flex align-center justify-center ma-0">
              <v-btn icon @click="(e)=>deleteFromBasket(e,product.item)" class="display-flex">
                <v-icon>delete_outline</v-icon>
              </v-btn>
            </div>
          </div>

          <v-divider :key="'item-divider'+index" class="my-1"></v-divider>
        </template>
        <v-flex xs12 class="mt-4">
          <div class="mb-3 display-1 mont text-xs-right pr-3">
            Итого:
            <span class="font-weight-bold">{{summa}}</span>
          </div>
          <v-alert type="error" :value="!isSummValid" class="mt-4">
            Сумма заказа ниже 3000.
            Наберите товаров еще на {{3000-summa}} рублей.
          </v-alert>
          <v-btn
            color="accent"
            class="ml-0"
            large
            @click="handleOfferClick"
            v-show="isSummValid"
          >Оформить заказ</v-btn>
        </v-flex>
      </div>
    </div>
    <div v-if="offer && isSummValid">
      <v-toolbar class="grey lighten-2 px-2" height="100px">
        <div class="toolbar-inner pr-5">
          <v-btn outline @click="offer=false" icon large class="ma-0">
            <v-icon>arrow_back</v-icon>
          </v-btn>
          <h2 class="mb-0 ml-3 display-3 mont font-weight-bold">Оформление заказа</h2>
        </div>
      </v-toolbar>
      <div class="px-4 py-5">
        <v-subheader class="mb-3 pl-0">ВВЕДИТЕ ВАШИ ДАННЫЕ</v-subheader>
        <contact-form class />
        <v-divider class="my-4"></v-divider>
        <v-subheader class="pl-0">ВАШ ЗАКАЗ</v-subheader>
        <v-data-table
          :items="basket"
          :hide-actions="true"
          :headers="[{ text: 'Наименование', sortable: false, value: 'name' },{ text: 'Цена', sortable: false, value: 'price' },{ text: 'Количество', sortable: false, value: 'Quan' }]"
        >
          <template slot="items" slot-scope="props">
            <td class>{{ props.item.item.name}}</td>
            <td class>{{ props.item.item.priceNum}}</td>
            <td class>{{ props.item.count}}</td>
          </template>
          <template slot="footer">
            <td class></td>
            <td class>Итого</td>
            <td class>{{summa}}</td>
          </template>
        </v-data-table>
      </div>
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
  width: 90px;
  min-width: 90px;
  display: flex;
  align-items: center;

  input {
    text-align: center !important;
  }
}

.price {
  width: 60px;
  min-width: 60px;
}

@media (max-width: 600px) {
}

@media (min-width: 960px) {
  .quantity {
    width: 155px;
    min-width: 155px;
  }

  .priceNum {
    width: 80px;
    min-width: 80px;
  }
}
</style>

<script>
import ContactForm from "~/components/ContactForm";
export default {
  components: { ContactForm },
  data() {
    //   return newObj;
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      offer: false,
      cart: {}
      //   basketCounts: newObj
      //   quantity: {}
      //   basket: this.$store.state.localStorage.basket
    };
  },
  methods: {
    handleOfferClick() {
      this.offer = true;
    },
    async addToBasket(event, item) {
      // console.log("TCL: addToBasket -> item", item);

      await this.$store.commit("addToBasket", item);
    },
    async removeFromBasket(event, item) {
      // console.log("TCL: removeFromBasket -> item", item);

      await this.$store.commit("removeFromBasket", item);
    },
    async deleteFromBasket(event, item) {
      // console.log("TCL: removeFromBasket -> item", item);
      await this.$store.commit("deleteFromBasket", item);
    }
  },
  // watch: {
  //   basket() {
  //     this.$set(this.cart, this.$store.state.localStorage.basket);
  //     console.log("watch basket");
  //   }
  // },
  computed: {
    summa() {
      let summ = 0;
      const basketItems = Object.keys(this.$store.state.localStorage.basket);
      for (let id of basketItems) {
        const product = this.$store.state.localStorage.basket[id];
        if (product.item.isDiscount && product.item.discountPrice) {
          summ = summ + product.count * product.item.discountPrice;
        } else if (product.item.priceNum && product.count) {
          summ = summ + product.count * product.item.priceNum;
        }
      }
      return summ;
    },
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


