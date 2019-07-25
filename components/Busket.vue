<template>
  <div>
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
        <!-- <v-simple-table>
          <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Calories</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in basket" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.id }}</td>
            </tr>
          </tbody>
        </v-simple-table>-->
        <v-subheader class="mb-3 pl-0">ВВЕДИТЕ ВАШИ ДАННЫЕ</v-subheader>
        <!-- <div class="display-1 mb-4 mt-4">Введите ваши данные и наши менеджеры свяжутся с вами.</div> -->

        <contact-form class />
        <v-divider class="my-4"></v-divider>
        <v-subheader class="pl-0">ВАШ ЗАКАЗ</v-subheader>
        <v-data-table
          :items="basket"
          :hide-actions="true"
          :headers="[{ text: 'Наименование', sortable: true, value: 'name' },{ text: 'Цена', sortable: true, value: 'price' },{ text: 'Количество', sortable: true, value: 'Quan' }]"
        >
          <template slot="items" slot-scope="props">
            <td class>{{ props.item.name}}</td>
            <td class>{{ props.item.price}}</td>
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

    <!-- <h2>Заполните данные</h2> -->
    <div v-if="!offer || !isSummValid" class="mb-4">
      <v-toolbar class="grey lighten-2 px-2" height="100px">
        <div class="toolbar-inner">
          <h2 class="mb-0 display-3 mont font-weight-bold">Корзина</h2>
        </div>
      </v-toolbar>
      <div class="px-4 py-5">
        <template v-for="(item,index) in basket" class>
          <div class="mb-1 layout row item-wrapper" :key="'item-wrapper'+index">
            <div
              class="img-wrapper display-flex gray xs2 flex pr-3 hidden-xs-only"
              style="max-width:80px; width:80px"
            >
              <img
                class="d-block ma-auto"
                style="height:80px; max-width:80px; width:80px; object-fit: contain;"
                v-lazy="item.img ? imageBaseUrl+item.img.url : require('~/assets/no-image.png')"
                :alt="item.name"
              />
            </div>
            <v-flex class="d-flex">
              <nuxt-link
                :to="`/catalog/${item.category.slug}/${item.slug}`"
                class="mont d-block my-auto text-decoration-none"
              >{{item.name}}</nuxt-link>
            </v-flex>
            <div class="quantity">
              <v-text-field
                class="ma-auto pt-0 text-xs-center"
                type="numeric"
                :label="!isMobile ? 'Количество' : ''"
                append-outer-icon="add"
                @click:append-outer="(e)=>increment(e,item.id)"
                prepend-icon="remove"
                @click:prepend="(e)=>decrement(e,item.id)"
                @input="(e,val)=>handleQuantityChange(e,item.id,val)"
                :value="basketCounts[item.id]"
                hide-details
              ></v-text-field>
            </div>

            <div
              class="price display-flex display-1 align-center justify-center mx-2 font-weight-medium mont"
            >{{item.price ? item.price*item.count : ''}}</div>
            <v-btn class="ma-auto" icon @click="$store.commit('removeFromBasket',item.id)">
              <v-icon>delete_outline</v-icon>
            </v-btn>
          </div>
          <v-divider :key="'item-divider'+index" class="my-1"></v-divider>
        </template>
        <v-flex xs12 class="mt-4">
          <!-- {{basketCounts}} -->
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
  max-width: 60px;
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
    max-width: 80px;
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
      offer: false
      //   basketCounts: newObj
      //   quantity: {}
      //   basket: this.$store.state.localStorage.basket
    };
  },
  methods: {
    handleOfferClick() {
      this.offer = true;
    },
    async handleQuantityChange(event, id, val) {
      console.log("TCL: handleQuantityChange -> val", val);
      console.log("TCL: handleQuantityChange -> id", id);
      console.log("TCL: handleQuantityChange -> event", event);
      //   console.log("TCL: handleQuantityChange -> id", id, val);
      this.basketCounts[id] = val;
      await this.$store.commit("changeBasket", { id, val });
      // console.log("TCL: handleQuantityChange -> val1", val1);
      // console.log("TCL: handleQuantityChange -> value", val, val1);
    },
    async increment(event, id) {
      console.log("TCL: increment -> id", this.basketCounts[id]);
      const val = Number(+this.basketCounts[id] + 1);
      this.basketCounts[id] = val;
      await this.$store.commit("changeBasket", { id, val });
      //   await this.$store.commit("incrementBasket", id);
      // console.log("TCL: ,increment -> val", val);
    },
    async decrement(event, id) {
      //   console.log("TCL: decrement -> id", id);
      const val = Number(this.basketCounts[id]) - 1;
      this.basketCounts[id] = val;
      await this.$store.commit("changeBasket", { id, val });
      //   await this.$store.commit("decrementBasket", id);
      // console.log("TCL: ,decrement -> val", val);
    }
  },

  computed: {
    summa() {
      const summ = this.$store.state.localStorage.basket.reduce((acc, val) => {
        // console.log("TCL: summa -> val", val);
        if (val.price && val.count) {
          acc = acc + val.count * val.price;
        }
        return acc;
      }, 0);
      //   console.log("TCL: summa -> summ", summ);

      return summ;
    },
    isSummValid() {
      return this.summa > 3000;
    },

    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    basket() {
      return this.$store.state.localStorage.basket;
    },
    basketCounts() {
      const newObj = {};
      const basketItems = this.$store.state.localStorage.basket;
      //   console.log("TCL: data -> basketItems", basketItems);
      for (let item of basketItems) {
        const count = Number(item.count);
        // console.log("TCL: data -> count", count);
        newObj[item.id] = count;
      }
      return newObj;
      //   return this.$store.state.localStorage.basket.map(item => {
      //     return {
      //       item: item.id,
      //       count: item.count
      //     };
      //   });
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


