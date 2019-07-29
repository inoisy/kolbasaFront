<template>
  <div>
    <page-header title="Халяльная продукция" :breadrumbs="breadcrumbs" />
    <section class="background" v-lazy:background-image="require('~/assets/img/bg.jpg')">
      <v-container class="py-5">
        <v-layout row wrap v-if="page.content">
          <div v-html="page.content"></div>
          <v-divider class="mb-4"></v-divider>
        </v-layout>
        <v-layout row wrap v-for="category of categories" :key="category.id" class="mb-4">
          <h2 class="mb-4 flex xs12 d-block" data-aos="fade-up">{{category.name}}</h2>
          <div
            class="flex xs12 sm6 md4 lg3 xl2"
            data-aos="fade-up"
            v-for="product of category.products"
            :key="product.id"
          >
            <product-card :product="product" :category="category.slug"></product-card>
          </div>
          <!-- <div class="flex xs12" data-aos="fade-up"> -->
          <!-- <v-btn
            :to="`/catalog/${category.slug}?manufacturer=${manufacturer.slug}`"
            class="mt-4 ml-0"
            color="accent"
            large
          >Показать все товары</v-btn>-->
          <!-- </div> -->
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
    await ctx.store.dispatch("fetchGeneralInfo");
    let client = ctx.app.apolloProvider.defaultClient;
    const { data: categoryData } = await client.query({
      query: gql`
        query HalalQuery {
          pages(where: { name: "halal" }) {
            name
            content
          }
          categories {
            id
            name
            slug
            products(where: { isHalal: true }) {
              id
              name
              slug
              description
              price
              discountPrice
              isDiscount
              isHalal
              category {
                slug
              }
              img {
                url
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
  data() {
    return {
      breadcrumbs: [
        {
          to: "/",
          text: "Главная"
        },
        {
          to: "/catalog/halal",
          text: "Халяльная продукция"
        }
      ]
    };
  }
};
</script>

<style>
</style>
