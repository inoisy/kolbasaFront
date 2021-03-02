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
        <v-layout
          row
          wrap
          v-for="(category, index) of categories"
          :key="category.id"
          class="mb-10"
        >
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
  computed: {
    breadcrumbs() {
      return [
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
          text: this.title,
        },
      ];
    },
  },

  // components: { ProductCard, PageHeader },
  async asyncData(ctx) {
    console.log("discount");
    // await ctx.store.dispatch("fetchGeneralInfo");
    const client = ctx.app.apolloProvider.defaultClient;
    const { data: categoryData } = await client.query({
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
    return {
      categories: categoryData.categories.filter(
        (item) => item.products && item.products.length > 0
      ),
      page: categoryData.pages[0],
    };
  },
  methods: {
    async handleClose(isInCart, id, categorySlug) {
      //id, categorySlug) {
      // console.log(
      //   "close",
      //   isInCart,
      //   " id: ",
      //   id,
      //   " categorySlug: ",
      //   categorySlug
      // );
      const { slug, ...params } = this.$route.params;

      const routeSplit = this.$route.path.replace(/\/$/, "").split("/");
      routeSplit.pop();
      await this.$router.push({ path: routeSplit.join("/"), params });
      // if (isInCart) {
      //   const category = this.categories.find(
      //     (category) => category.slug == categorySlug
      //   );
      //   console.log(
      //     "🚀 ~ file: _slug.vue ~ line 144 ~ handleClose ~ category",
      //     category
      //   );
      //   const product = category.products.find((item) => item.id === id);
      //   product.__v = (product.__v || 0) + 1;
      //   console.log(
      //     "🚀 ~ file: _slug.vue ~ line 146 ~ handleClose ~ product",
      //     product
      //   );
      // }
    },
  },
  data() {
    return {
      title: "Акционная продукция",
      imageBaseUrl: process.env.imageBaseUrl,
    };
  },
};
</script>

<style>
</style>
