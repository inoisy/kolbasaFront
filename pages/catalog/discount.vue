<template>
  <div>
    <nuxt-child @close="handleClose" />
    <page-header :title="title" :breadrumbs="breadcrumbs" />
    <section
      class="background background-repeat"
      style="background-image: url(/bg.jpg)"
    >
      <!-- v-lazy:background-image="require('~/assets/img/bg.jpg')" -->
      <v-container grid-list-lg class="py-12">
        <v-layout row wrap v-if="page && page.content">
          <div>
            <v-flex
              class="content"
              v-if="page.content"
              v-html="page.content"
            ></v-flex>
            <v-btn
              v-if="page.file"
              class="ml-0"
              large
              color="accent"
              :href="imageBaseUrl + page.file.url"
            >
              <v-icon left dark>{{ icons.mdiDownload }}</v-icon>
              <!-- <svg-icon name="save_alt" style="width: 24px; height: 24px" /> -->
              Загрузить каталог
            </v-btn>
          </div>

          <v-divider class="my-4"></v-divider>
        </v-layout>
        <v-layout
          row
          wrap
          v-for="category of categories"
          :key="category.id"
          class="mb-10"
        >
          <h2 class="mb-10 flex xs12 d-block">{{ category.name }}</h2>
          <div
            class="flex xs12 sm6 md4 lg3 xl2"
            v-for="product of category.products"
            :key="product.id"
          >
            <product-card
              :product="product"
              :to="`/catalog/discount/${product.slug}`"
            ></product-card>
          </div>
        </v-layout>
      </v-container>
    </section>
  </div>
</template>

<script>
import gql from "graphql-tag";
// import PageHeader from "~/components/PageHeader";
// import ProductCard from "~/components/ProductCard";
import { mdiDownload } from "@mdi/js";

export default {
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
          to: this.$route.path,
          text: this.title,
        },
      ];
    },
  },

  components: { ProductCard, PageHeader },
  async asyncData(ctx) {
    // await ctx.store.dispatch("fetchGeneralInfo");
    let client = ctx.app.apolloProvider.defaultClient;
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
    async handleClose() {
      // const products = await this.$store.dispatch("fetchProducts", {
      //   category: this.categoriesIds,
      //   limit: this.limit,
      //   sort: this.sort.value
      // });
      // // console.log("handleClose -> products", products.length);
      // this.products = products;
    },
  },
  data() {
    return {
      title: "Акционная продукция",
      imageBaseUrl: process.env.imageBaseUrl,
      icons: {
        mdiDownload,
      },
    };
  },
};
</script>

<style>
</style>
