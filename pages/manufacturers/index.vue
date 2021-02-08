<template>
  <div>
    <page-header title="Производители" :breadrumbs="breadrumbs" />
    <div
      class="background background-repeat"
      style="background-image: url(/bg.jpg)"
    >
      <v-container class="py-12" grid-list-lg>
        <!-- <div> v-lazy:background-image="require('~/assets/img/bg.jpg')" -->
        <vertical-card
          v-for="(item, index) in manufacturers"
          :key="index"
          :item="item"
          type="manufacturers"
          class="mb-6"
        ></vertical-card>
        <!-- </div> -->
      </v-container>
    </div>
  </div>
</template>
  

<script>
import gql from "graphql-tag";
import PageHeader from "~/components/PageHeader";
import VerticalCard from "~/components/VerticalCard";

export default {
  head() {
    return {
      title: "Производители(мясокомбинаты)",
    };
  },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
    };
  },
  components: { PageHeader, VerticalCard },
  async asyncData(ctx) {
    // await ctx.store.dispatch("fetchGeneralInfo");
    let client = ctx.app.apolloProvider.defaultClient;
    const { data: manufacturerData } = await client.query({
      query: gql`
        {
          manufacturers(sort: "name:asc", limit: 999) {
            name
            slug
            description
            img {
              url
            }
          }
        }
      `,
    });
    return {
      manufacturers: manufacturerData.manufacturers,
    };
  },
  computed: {
    breadrumbs() {
      return [
        {
          to: "/",
          text: "Главная",
        },
        {
          to: this.$route.path,
          text: "Производители",
        },
      ];
    },
  },
};
</script>


