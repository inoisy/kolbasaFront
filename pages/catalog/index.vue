<template>
  <div>
    <page-header title="Каталог" :breadrumbs="breadrumbs" />
    <section class="background" v-lazy:background-image="require('~/assets/img/bg.jpg')">
      <v-container grid-list-lg class="py-5">
        <div
          class="catalog-card"
          data-aos="fade-up"
          v-for="(category,index) in categories"
          :key="index"
        >
          <vertical-card :item="category" type="catalog" class="mb-4 d-block"></vertical-card>
        </div>
      </v-container>
    </section>
  </div>
</template>

<style lang="stylus" scoped>
@media (max-width: 960px) {
}
</style>
<script>
import PageHeader from "~/components/PageHeader";
import VerticalCard from "~/components/VerticalCard";

import gql from "graphql-tag";

export default {
  head() {
    return {
      title: "Каталог"
    };
  },
  components: { PageHeader, VerticalCard },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      breadrumbs: [
        {
          to: "/",
          text: "Главная"
        },
        {
          to: "/catalog",
          text: "Каталог"
        }
      ]
    };
  },
  async asyncData(ctx) {
    await ctx.store.dispatch("fetchGeneralInfo");
    let client = ctx.app.apolloProvider.defaultClient;
    const { data: categoriesData } = await client.query({
      query: gql`
        {
          categories(sort: "name:asc") {
            name
            slug
            description

            img {
              url
            }
          }
        }
      `
    });
    console.log("TCL: Data -> categoriesData", categoriesData);

    return {
      categories: categoriesData.categories
    };
  },
  computed: {
    // categories() {
    //   return this.$store.state.generalInfo.categories;
    // }
  }
};
</script>

