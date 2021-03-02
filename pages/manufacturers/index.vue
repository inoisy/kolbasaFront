<template>
  <div>
    <LazyHydrate when-idle>
      <page-header title="Производители" :breadrumbs="breadrumbs" />
    </LazyHydrate>
    <div
      :style="`background-image: url(${require('~/assets/images/bg.jpg?webp')})`"
      class="background-with-transparent"
    >
      <v-container class="py-16" grid-list-lg>
        <LazyHydrate
          when-visible
          v-for="(item, index) in manufacturers"
          :key="`manufacturer-${index}`"
        >
          <vertical-card :item="item" type="manufacturers" class="mb-6" />
        </LazyHydrate>
      </v-container>
    </div>
  </div>
</template>
  

<script>
import gql from "graphql-tag";
import LazyHydrate from "vue-lazy-hydration";

export default {
  head() {
    return {
      title: "Производители (мясокомбинаты)",
    };
  },
  components: { LazyHydrate },
  async asyncData({ app }) {
    const {
      data: manufacturerData,
    } = await app.apolloProvider.defaultClient.query({
      query: gql`
        query ManufacturersQuery {
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
          to: "/manufacturers",
          text: "Производители",
        },
      ];
    },
  },
};
</script>


