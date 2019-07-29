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
              <v-btn icon @click="(e)=>removeFromBasket(e,product.item)">
                <v-icon>remove</v-icon>
              </v-btn>
              {{product.count}}
              <v-btn icon @click="(e)=>addToBasket(e,product.item)">
                <v-icon>add</v-icon>
              </v-btn>
            </div>

            <div
              class="price display-flex display-1 align-center justify-center mx-2 font-weight-medium mont"
            >{{product.item.price ? product.item.price*product.count : ''}}</div>
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
            <td class>{{ props.item.item.price}}</td>
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
    <!-- <v-text-field
                class="ma-auto pt-0 text-xs-center"
                type="numeric"
                :label="!isMobile ? 'Количество' : ''"
                append-outer-icon="add"
                @click:append-outer="(e)=>increment(e,item.item.id)"
                prepend-icon="remove"
                @click:prepend="(e)=>decrement(e,item.item.id)"
                @input="(e,val)=>handleQuantityChange(e,item.item.id,val)"
                hide-details
                v-model="$store.state.localStorage[item.item.id]"
    ></v-text-field>-->
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
  width: 100px;
  min-width: 100px;
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

  .price {
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
    async handleQuantityChange(val, id, event) {
      // await this.$store.commit("changeBasket", { id, val });
      // // this.$set(this.cart, id, val);
      // await this.$nextTick();
    },
    async addToBasket(event, item) {
      await this.$store.commit("addToBasket", item);
    },
    async removeFromBasket(event, item) {
      await this.$store.commit("removeFromBasket", item);
    }
    // async increment(event, id) {

    // const item = this.$store.state.localStorage.basket.find(
    //   item => item.item.id === id
    // );
    // console.log(
    //   "TCL: increment -> item",
    //   this.$store.state.localStorage.basket
    // );
    // const val = Number(+item.count + 1);
    // await this.$store.commit("changeBasket", { id, val });
    // // this.$set(this.cart, id, val);
    // await this.$nextTick();
    // },
    // async decrement(event, id) {
    // const val = Number(+this.basketCounts[id] - 1);
    // await this.$store.commit("changeBasket", { id, val });
    // // this.$set(this.cart, id, val);
    // await this.$nextTick();
    // }
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
      for (let id of Object.keys(this.$store.state.localStorage.basket)) {
        const product = this.$store.state.localStorage.basket[id];
        console.log("TCL: summa -> product", product);
        if (product.item.price && product.count) {
          summ = summ + product.count * product.item.price;
        }
      }
      console.log("TCL: summa -> acc", summ);
      return summ;
      // const summ = this.$store.state.localStorage.basket.reduce(
      //   (acc, product) => {
      //     // console.log("TCL: summa -> val", val);
      //     if (product.item.price && product.count) {
      //       acc = acc + product.count * product.item.price;
      //     }
      //     return acc;
      //   },
      //   0
      // );
      // console.log("TCL: summa -> summ", summ);
      // return summ;
    },
    isSummValid() {
      return this.summa > 3000;
    },

    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    basket() {
      //   this.$forceUpdate();
      // this.$forceUpdate();
      return Object.values(this.$store.state.localStorage.basket);
    },
    basketCounts: {
      get() {
        const newObj = {};
        const basketItems = this.$store.state.localStorage.basket;
        console.log("TCL: get -> basketItems", basketItems);
        // this.$forceUpdate();
        //   console.log("TCL: data -> basketItems", basketItems);
        for (let item of basketItems) {
          // const count = ;
          // this.$set(this.cart, item.id, count);

          // console.log("TCL: data -> count", count);
          newObj[item.id] = Number(item.count);
        }
        return newObj;
      },
      set(newValue) {
        console.log("TCL: set -> newValue", newValue);
        this.basketCounts = newValue;
      }
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


