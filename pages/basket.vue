<template>
  <div>
    <page-header :title="title" :breadrumbs="breadrumbs" />

    <section
      class="main-wrapper background"
      v-lazy:background-image="require('~/assets/img/bg.jpg')"
    >
      <v-container class="py-5 fill-height">
        <v-layout row wrap>
          <v-card flat class="pa-3 layout row wrap mb-4">
            <v-flex xs12 v-for="(item,index) in basket" :key="item.id" class="mb-1">
              <!---->
              <v-layout row wrap>
                <div class="img-wrapper display-flex gray xs2 flex" style="min-width:100px">
                  <img
                    class="d-block ma-auto"
                    style="height:80px;object-fit: contain;"
                    v-lazy="item.img ? imageBaseUrl+item.img.url : require('~/assets/no-image.png')"
                    :alt="item.name"
                  />
                </div>
                <v-flex xs8>
                  <nuxt-link
                    :to="`/catalog/${item.category.slug}/${item.slug}`"
                    class="display-2 mont mb-4 d-block"
                  >{{item.name}}</nuxt-link>
                  <v-text-field
                    type="number"
                    label="Количество"
                    append-outer-icon="add"
                    @click:append-outer="increment($event,item.id)"
                    prepend-icon="remove"
                    @click:prepend="decrement($event,item.id)"
                    @change="handleQuantityChange($event,item.id)"
                    :value="item.count"
                  ></v-text-field>

                  <v-btn
                    color="error"
                    icon
                    outline
                    large
                    @click="$store.commit('removeFromBasket',item.id)"
                  >
                    <v-icon>delete_outline</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
              <v-divider class="my-4" v-if="index!==basket.length-1"></v-divider>
            </v-flex>
          </v-card>
          <v-flex xs12>
            <v-btn color="accent" class="ml-0" large>Оформить заказ</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </section>
  </div>
</template>

<script>
import PageHeader from "~/components/PageHeader";

export default {
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      title: "Корзина",
      breadrumbs: [
        {
          to: "/",
          text: "Главная"
        },
        {
          to: "/basket",
          text: "Корзина"
        }
      ]
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
  async asyncData(ctx) {
    await ctx.store.dispatch("fetchGeneralInfo");
    // async asyncData(ctx) {
    // const generalData = await ctx.store.dispatch("fetchGeneralInfo");
    // // console.log("TCL: //Data -> generalData", generalData);
    // return {
    //   contacts: generalData.contacts
    // };
    return {
      basketArr: {}
    };
  },
  components: { PageHeader },
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
<style lang="stylus" scoped>
.main-wrapper {
  min-height: 60vh;
}

.link {
  color: rgba(0, 0, 0, 0.87);

  &:hover {
    color: #d50000;

    i {
      color: #d50000 !important;
    }
  }
}

a {
  text-decoration: none;
}
</style>

