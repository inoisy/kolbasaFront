<template>
  <div>
    <nuxt-child @close="handleClose" />
    <LazyHydrate when-idle>
      <page-header
        title="Халяльная продукция оптом"
        :breadrumbs="breadcrumbs"
      />
    </LazyHydrate>
    <div
      :style="`background-image: url(/bg.jpg)`"
      class="background-with-transparent"
    >
      <v-container grid-list-lg class="py-12">
        <LazyHydrate
          v-for="(category, index) of categories"
          :key="category.id"
          when-visible
        >
          <v-layout row wrap class="mb-10">
            <h2 class="mb-5 flex xs12 d-block">
              {{ category.name }} халяль оптом
            </h2>
            <div
              class="flex xs12 sm6 md4 lg3 xl2"
              v-for="product of category.products"
              :key="`product-${product.id}`"
            >
              <!---${product.__v || 0} {{ `${product.id}-${product.__v || 0}` }} -->
              <product-card
                :product="product"
                grandparent="catalog"
                parent="halal"
                :show="index === 0"
                :halal="true"
              />
              <!-- </product-card> -->
              <!-- :to="`/catalog/halal/${product.slug}`" -->
            </div>
          </v-layout>
        </LazyHydrate>
      </v-container>
    </div>
    <section class="grey lighten-3" v-if="page.content">
      <v-container class="py-16">
        <v-row>
          <v-col cols="12">
            <LazyHydrate never>
              <content-wrapper v-html="page.content" />
            </LazyHydrate>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>

<script>
import gql from "graphql-tag";
// import PageHeader from "~/components/PageHeader";
// import ProductCard from "~/components/ProductCard";
import LazyHydrate from "vue-lazy-hydration";

export default {
  head() {
    return {
      title: "Халяльная продукция",
    };
  },
  components: { LazyHydrate },
  async asyncData({
    store,
    app: {
      apolloProvider: { defaultClient },
    },
  }) {
    // await ctx.store.dispatch("fetchGeneralInfo");
    // const client = ctx.app.apolloProvider.defaultClient;
    const { data: categoryData } = await defaultClient.query({
      query: gql`
        query HalalQuery {
          pages(where: { name: "halal" }) {
            name
            content
            header
            metaDescription
            file {
              url
            }
          }
          categories {
            id
            name
            slug
            products(where: { isHalal: true }, limit: 60) {
              id
              name
              slug
              description
              priceNum
              discountPrice
              isDiscount
              isHalal
              minimumOrder
              piece
              category {
                slug
              }
              img {
                url
                formats
              }
              manufacturer {
                name
                slug
                img {
                  url
                }
              }
            }
          }
        }
      `,
    });
    const breadcrumbs = [
      {
        to: "/",
        text: "Главная",
      },
      {
        to: "/catalog",
        text: "Каталог",
      },
      {
        // to: "/catalog/halal",
        text: "Халяльная продукция",
      },
    ];
    store.dispatch("breadcrumbs", breadcrumbs);

    return {
      breadcrumbs,
      categories: categoryData.categories.filter(
        (item) => item.products && item.products.length > 0
      ),
      page: categoryData.pages[0],
    };
  },
  methods: {
    async handleClose() {
      await this.$router.push({ path: "/catalog/halal" });
    },
  },
  // data() {
  //   return {
  //     breadcrumbs: [
  //       {
  //         to: "/",
  //         text: "Главная",
  //       },
  //       {
  //         to: "/catalog",
  //         text: "Каталог",
  //       },
  //       {
  //         // to: "/catalog/halal",
  //         text: "Халяльная продукция",
  //       },
  //     ],
  //     imageBaseUrl: process.env.imageBaseUrl,
  //   };
  // },
};
</script>

<style>
</style>
