<template>
  <div>
    <page-header :title="title" :breadrumbs="breadrumbs" />

    <section
      class="main-wrapper background"
      v-lazy:background-image="require('~/assets/img/bg.jpg')"
    >
      <v-container class="py-5 fill-height">
        <v-layout row wrap>
          <v-flex xs12 v-for="item in basket" :key="item.id" class="mb-4">
            <v-card class="pa-3">
              <h2>{{item.name}}</h2>
              <v-btn
                class="ml-0"
                :to="`/catalog/${item.category.slug}/${item.slug}`"
              >на страницу продукта</v-btn>
              <v-btn
                color="error"
                outline
                @click="$store.commit('removeFromBasket',item.id)"
              >удалить из корзины</v-btn>
            </v-card>
          </v-flex>
        </v-layout>

        <!-- {{basket}} -->
      </v-container>
    </section>
  </div>
</template>

<script>
import PageHeader from "~/components/PageHeader";

export default {
  data() {
    return {
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
  async asyncData(ctx) {
    await ctx.store.dispatch("fetchGeneralInfo");
    // async asyncData(ctx) {
    // const generalData = await ctx.store.dispatch("fetchGeneralInfo");
    // // console.log("TCL: //Data -> generalData", generalData);
    // return {
    //   contacts: generalData.contacts
    // };
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

