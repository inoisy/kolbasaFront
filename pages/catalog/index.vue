<template>
  <div>
    <page-header title="Каталог" :breadrumbs="breadrumbs" />
    <section class="background" v-lazy:background-image="require('~/assets/img/bg.jpg')">
      <v-container grid-list-lg class="py-5">
        <div data-aos="fade-up" v-for="(category,index) in categories" :key="index">
          <vertical-card :item="category" type="catalog" class="mb-4 d-block"></vertical-card>
        </div>
        <!-- <v-card
         
          :to="`/catalog/${category.slug}`"
          hover
          ripple
          class="card-wrapper flex xs12 text-xs-left mont font-weight-medium mb-4 pa-3"
          style="text-decoration: none; border-radius: 10px"
        >
          <v-layout row wrap>
            <v-flex xs12 md4 class="img-wrapper display-flex gray">
              <img
                class="d-block ma-auto"
                style="max-height:20rem"
                v-if="category.img"
                v-lazy="imageBaseUrl+category.img.url"
                :alt="category.name"
              />
            </v-flex>
            <v-flex xs12 md8 class="card-text-wrapper display-flex">
              <div class="card-text-inner my-auto">
                <h2 class="card-header display-2 mont mb-3">{{category.name}}</h2>
                <div
                  class="card-text mb-0 mont"
                  v-text="category.description"
                >Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam culpa sit quas suscipit ipsa magni facere,</div>
              </div>
            </v-flex>
          </v-layout>
        </v-card>-->
      </v-container>
    </section>
  </div>
</template>

<style lang="stylus" scoped></style>
<script>
import PageHeader from "~/components/PageHeader";
import VerticalCard from "~/components/VerticalCard";

import gql from "graphql-tag";

export default {
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
          categories {
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
      // manufacturers: manufacturerData.manufacturers
    };
  },
  computed: {
    // categories() {
    //   return this.$store.state.generalInfo.categories;
    // }
  }
};
</script>

