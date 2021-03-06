<template>
  <div>
    <nuxt-child @close="handleClose" />
    <LazyHydrate when-idle>
      <page-header :title="title" :breadrumbs="breadcrumbs" />
    </LazyHydrate>
    <div
      :style="`background-image: url(${require('~/assets/images/bg.jpg?original')})`"
      class="background-with-transparent"
    >
      <v-container grid-list-lg class="py-16">
        <LazyHydrate
          when-visible
          v-for="(category, index) of categories"
          :key="category.id"
        >
          <v-layout row wrap class="mb-10">
            <h2 class="mb-3 flex xs12 d-block">{{ category.name }}</h2>
            <div
              class="flex xs12 sm6 md4 lg3 xl2"
              v-for="product of category.products"
              :key="`product-${product.id}`"
            >
              <!-- -${product.__v || 0} -->
              <product-card
                :product="product"
                grandparent="catalog"
                parent="discount"
                :show="index === 0"
              />
              <!-- :to="`/catalog/discount/${product.slug}`" -->
            </div>
          </v-layout>
        </LazyHydrate>
      </v-container>
    </div>
    <section class="grey lighten-3" v-if="page.content">
      <v-container class="pt-10 pb-7">
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
// import { mdiDownload } from "@mdi/js";
import LazyHydrate from "vue-lazy-hydration";

export default {
  components: { LazyHydrate },
  head() {
    return {
      title: this.title,
    };
  },
  // computed: {
  //   breadcrumbs() {
  //     return [
  //       {
  //         to: "/",
  //         text: "Главная",
  //       },
  //       {
  //         to: "/catalog",
  //         text: "Каталог",
  //       },
  //       {
  //         // to: "/catalog/discount",
  //         text: this.title,
  //       },
  //     ];
  //   },
  // },

  // components: { ProductCard, PageHeader },
  async asyncData({
    store,
    app: {
      apolloProvider: { defaultClient },
    },
  }) {
    // console.log("discount");
    // await ctx.store.dispatch("fetchGeneralInfo");
    // const client = apolloProv1`    ` 1q  ider.defaultClient;
    const { data: categoryData } = await defaultClient.query({
      query: gql`
        query DiscountQuery {
          pages(where: { name: "discount" }) {
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
            products(where: { isDiscount: true }) {
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
    const title = "Акционная продукция";
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
        // to: "/catalog/discount",
        text: title,
      },
    ];
    store.dispatch("breadcrumbs", breadcrumbs);

    return {
      breadcrumbs,
      title,
      categories: categoryData.categories.filter(
        (item) => item.products && item.products.length > 0
      ),
      page: categoryData.pages[0],
    };
  },
  methods: {
    async handleClose() {
      await this.$router.push({ path: "/catalog/discount" });
    },
  },
};
</script>