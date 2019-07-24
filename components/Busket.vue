<template>
  <div>
    <!-- <div class="close-btn-wrap ma-4">
      <v-btn class="close-btn ma-0" outline icon large @click="$parent.basketDrawer=false">
        <v-icon>close</v-icon>
      </v-btn>
    </div>-->
    <div v-show="offer">
      <v-toolbar class="grey lighten-2 py-4 px-2">
        <div class="toolbar-inner">
          <v-btn outline @click="offer=false" icon large class="ma-0">
            <v-icon>arrow_back</v-icon>
          </v-btn>
          <h2 class="mb-0 ml-5">Оформление заказа</h2>
          <!-- <v-btn class="close-btn ma-0" outline icon large @click="$parent.basketDrawer=false">
            <v-icon>close</v-icon>
          </v-btn>-->
        </div>
      </v-toolbar>
      <div class="px-4 py-5">
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
        <contact-form />
        <!-- <v-btn color="accent">Оформить</v-btn> -->
      </div>
    </div>

    <div v-show="!offer" class="mb-4">
      <v-toolbar class="grey lighten-2 py-4 px-2">
        <div class="toolbar-inner">
          <h2 class="mb-0">Корзина</h2>
          <!-- <v-btn
            class="close-btn ma-0 ml-auto display-flex"
            outline
            icon
            large
            @click="$parent.basketDrawer=false"
          >
            <v-icon>close</v-icon>
          </v-btn>-->
        </div>
      </v-toolbar>
      <div class="pa-4">
        <v-flex xs12 v-for="(item,index) in basket" :key="item.id" class="mb-1">
          <!---->
          <v-layout row wrap>
            <div class="img-wrapper display-flex gray xs2 flex pr-3" style="min-width:100px">
              <img
                class="d-block ma-auto"
                style="height:80px; object-fit: contain;"
                v-lazy="item.img ? imageBaseUrl+item.img.url : require('~/assets/no-image.png')"
                :alt="item.name"
              />
            </div>
            <v-flex xs6 class="d-flex">
              <nuxt-link
                :to="`/catalog/${item.category.slug}/${item.slug}`"
                class="display-1 mont d-block my-auto"
              >{{item.name}}</nuxt-link>
            </v-flex>
            <v-flex xs4 style="display:flex; flex-direction:row;">
              <v-text-field
                class="ma-auto mr-4"
                style="width:150px"
                type="number"
                label="Количество"
                append-outer-icon="add"
                @click:append-outer="increment($event,item.id)"
                prepend-icon="remove"
                @click:prepend="decrement($event,item.id)"
                @change="handleQuantityChange($event,item.id)"
                :value="item.count"
                hide-details
              ></v-text-field>

              <v-btn
                class="ma-auto"
                color="error"
                icon
                outline
                @click="$store.commit('removeFromBasket',item.id)"
              >
                <v-icon>delete_outline</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <v-divider class="my-4"></v-divider>
          <!-- v-if="index!==basket.length-1" -->
        </v-flex>
        <v-flex xs12 class="mt-4" v-show="!offer">
          <v-btn color="accent" class="ml-0" large @click="offer=true">Оформить заказ</v-btn>
        </v-flex>
      </div>
      <!-- <v-divider class="my-4"></v-divider> -->
    </div>
  </div>
</template>
<style lang="stylus" scoped>
.toolbar-inner {
  display: flex;
  align-items: center;
  width: 100%;
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
    };
  },
  methods: {
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
    basket() {
      return this.$store.state.localStorage.basket;
    }
  }
};
</script>


