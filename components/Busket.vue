<template>
  <div>
    <div v-show="offer">
      <v-toolbar class="grey lighten-2 px-2" height="100px">
        <div class="toolbar-inner pr-5">
          <v-btn outline @click="offer=false" icon large class="ma-0">
            <v-icon>arrow_back</v-icon>
          </v-btn>
          <h2 class="mb-0 ml-3 display-3 mont font-weight-bold">Оформление заказа</h2>
        </div>
      </v-toolbar>
      <div class="px-4 py-5">
        <contact-form />
        <!-- <v-btn color="accent">Оформить</v-btn> -->
      </div>
    </div>

    <!-- <v-data-table
          :items="basket"
          :disable-pagination="true"
          :headers="[{ text: 'id', sortable: false, value: 'id' },{ text: 'name', sortable: true, value: 'name' }]"
        >
          <template slot="items" slot-scope="props">
            <td class>{{ props.item.id}}</td>
            <td class>{{ props.item.name}}</td>
          </template>
    </v-data-table>-->
    <!-- <h2>Заполните данные</h2> -->
    <div v-show="!offer" class="mb-4">
      <v-toolbar class="grey lighten-2 px-2" height="100px">
        <div class="toolbar-inner">
          <h2 class="mb-0 display-3 mont font-weight-bold">Корзина</h2>
        </div>
      </v-toolbar>
      <div class="px-4 py-5">
        <template v-for="(item,index) in basket" class>
          <div class="mb-1 layout row item-wrapper" :key="index">
            <div
              class="img-wrapper display-flex gray xs2 flex pr-3 hidden-xs-only"
              style="min-width:100px"
            >
              <img
                class="d-block ma-auto"
                style="height:80px; object-fit: contain;"
                v-lazy="item.img ? imageBaseUrl+item.img.url : require('~/assets/no-image.png')"
                :alt="item.name"
              />
            </div>
            <v-flex class="d-flex">
              <nuxt-link
                :to="`/catalog/${item.category.slug}/${item.slug}`"
                class="display-1 mont d-block my-auto"
              >{{item.name}}</nuxt-link>
            </v-flex>
            <div class="quantity">
              <v-text-field
                class="ma-auto mr-3 pt-0 text-xs-center"
                type="number"
                :label="!isMobile ? 'Количество' : ''"
                append-outer-icon="add"
                @click:append-outer="increment($event,item.id)"
                prepend-icon="remove"
                @click:prepend="decrement($event,item.id)"
                @change="handleQuantityChange($event,item.id)"
                :value="item.count"
                hide-details
              ></v-text-field>
            </div>

            <v-btn
              class="ma-auto"
              color="error"
              icon
              outline
              @click="$store.commit('removeFromBasket',item.id)"
            >
              <v-icon>delete_outline</v-icon>
            </v-btn>
          </div>
          <v-divider :key="index" class="my-3"></v-divider>
        </template>
        <v-flex xs12 class="mt-4">
          <v-btn color="accent" class="ml-0" large @click="handleOfferClick">Оформить заказ</v-btn>
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
  width: 120px;
  min-width: 120px;
  display: flex;
  align-items: center;

  input {
    text-align: center !important;
  }
}

@media (max-width: 600px) {
}

@media (min-width: 960px) {
  .quantity {
    width: 155px;
    min-width: 155px;
  }
}
</style>

<script>
import ContactForm from "~/components/ContactForm";
export default {
  components: { ContactForm },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      offer: false
      //   basket: this.$store.state.localStorage.basket
    };
  },
  methods: {
    handleOfferClick() {
      this.offer = true;
    },
    async handleQuantityChange(val, id) {
      console.log("TCL: handleQuantityChange -> id", id);
      // console.log("TCL: handleQuantityChange -> val1", val1);
      // console.log("TCL: handleQuantityChange -> value", val, val1);
    },
    async increment(val, id) {
      console.log("TCL: increment -> id", id);
      this.$store.commit("incrementBasket", id);
      // console.log("TCL: ,increment -> val", val);
    },
    async decrement(val, id) {
      console.log("TCL: decrement -> id", id);
      this.$store.commit("decrementBasket", id);
      // console.log("TCL: ,decrement -> val", val);
    }
  },

  computed: {
    // contacts() {
    //   return this.$store.state.generalInfo.contacts;
    // }
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    basket() {
      return this.$store.state.localStorage.basket;
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


