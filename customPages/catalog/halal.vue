<template>
  <div>
    <nuxt-child @close="handleClose" :breadcrumbs-base="breadcrumbs" />
    <LazyHydrate when-idle>
      <page-header-simple
        title="Халяльная продукция оптом"
        :breadrumbs="breadcrumbs"
      />
    </LazyHydrate>
    <div :style="`background-image: url(/bg.jpg)`" class="background-repeat">
      <v-container class="py-16">
        <LazyHydrate
          v-for="(category, index) of categories"
          :key="`category-${index}`"
          when-visible
        >
          <v-row no-gutters class="mb-10">
            <sceleton-title
              class="pa-3 col col-12"
              :noLoad="isLoading"
              :isLoading="isLoading"
            >
              <h2>{{ category.name }} халяль оптом</h2>
            </sceleton-title>
            <v-col
              class="pa-3"
              v-for="(product, i) of category.products"
              :key="`product-${index}-${i}`"
              cols="12"
              sm="6"
              md="4"
              lg="3"
              xl="2"
            >
              <product-card
                :product="product"
                grandparent="catalog"
                parent="halal"
                :show="index === 0"
                :halal="true"
              />
            </v-col>
          </v-row>
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
  loading: false,
  watch: {
    isLoading(val) {
      if (!process.client) {
        return;
      }
      if (val) {
        this.$nuxt.$loading.start();
      } else {
        this.$nuxt.$loading.finish();
      }
    },
  },
  data() {
    return {
      isLoading: false,
      breadcrumbs: [
        {
          to: "/",
          text: "Главная",
        },
        {
          to: "/catalog",
          text: "Каталог",
        },
        {
          text: "Халяльная продукция",
        },
      ],
      title: "Халяльная продукция",
      categories: [
        {
          item: false,
          products: new Array(20).fill(false),
        },
      ],
      page: {},
    };
  },
  components: { LazyHydrate },
  // async asyncData({
  //   store,
  //   app: {
  //     apolloProvider: { defaultClient },
  //   },
  // }) {
  // await ctx.store.dispatch("fetchGeneralInfo");
  // const client = ctx.app.apolloProvider.defaultClient;
  async fetch() {
    this.isLoading = true;
    // const { data: categoryData } = await defaultClient.query({
    const {
      data: {
        pages: [pageData],
        categories,
      },
    } = await this.$apollo.query({
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

    this.categories = categories.filter(
      (item) => item.products && item.products.length > 0
    );
    this.page = pageData;
    this.isLoading = false;
    // const breadcrumbs =
    // store.dispatch("breadcrumbs", breadcrumbs);
    // return {
    //   // breadcrumbs,
    //   categories: ,
    //   page: pageData,
    // };
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
