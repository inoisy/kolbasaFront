<template>
  <div>
    <nuxt-child @close="handleClose" />
    <page-header title="Халяльная продукция оптом" :breadrumbs="breadcrumbs" />
    <section
      class="background background-repeat"
      v-lazy:background-image="require('~/assets/img/bg.jpg')"
    >
      <v-container grid-list-lg class="py-12">
        <v-layout row wrap v-for="category of categories" :key="category.id" class="mb-10">
          <h2 class="mb-5 flex xs12 d-block">{{category.name}} халяль оптом</h2>
          <div
            class="flex xs12 sm6 md4 lg3 xl2"
            v-for="product of category.products"
            :key="product.id"
          >
            <product-card :product="product" :to="`/catalog/halal/${product.slug}`" :halal="true"></product-card>
            <!-- :to="`/catalog/${category.slug}/${product.slug}`" -->
          </div>
        </v-layout>
        <v-layout row wrap v-if="page.content">
          <v-divider class="my-4"></v-divider>
          <div class="content-wrapper" v-if="page.content" v-html="$md.render(page.content)"></div>
        </v-layout>
      </v-container>
    </section>
  </div>
</template>

<script>
import gql from "graphql-tag";
import PageHeader from "~/components/PageHeader";
import ProductCard from "~/components/ProductCard";

export default {
  head() {
    return {
      title: "Халяльная продукция"
    };
  },
  components: { ProductCard, PageHeader },
  async asyncData(ctx) {
    // await ctx.store.dispatch("fetchGeneralInfo");
    let client = ctx.app.apolloProvider.defaultClient;
    const { data: categoryData } = await client.query({
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
      `
    });
    return {
      categories: categoryData.categories.filter(
        item => item.products && item.products.length > 0
      ),
      page: categoryData.pages[0]
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
    }
  },
  data() {
    return {
      breadcrumbs: [
        {
          to: "/",
          text: "Главная"
        },
        {
          to: "/catalog",
          text: "Каталог"
        },
        {
          to: "/catalog/halal",
          text: "Халяльная продукция"
        }
      ],
      imageBaseUrl: process.env.imageBaseUrl
    };
  }
};
</script>

<style>
</style>
