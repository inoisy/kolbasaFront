<template>
  <div>
    <page-header title="Каталог" :breadrumbs="breadrumbs" />
    <section class="background">
      <!-- v-lazy:background-image="require('~/assets/img/bg.jpg')" -->
      <v-container grid-list-lg class="py-5">
        <template v-for="(category,index) in categories">
          <!-- <div :key="index" data-aos="fade-up" class="catalog-card layout wrap mb-5">
            <h2 class="xs12 flex">
              {{category.name}}
              <v-btn outline :to="`/catalog/${category.slug}`">Показать все</v-btn>
            </h2>
            <div
              class="flex xs12 sm6 md4 lg3 xl2"
              data-aos="fade-up"
              v-for="(product,prIndex) in category.products"
              :key="prIndex"
            >
              <product-card :product="product" :to="`/catalog/${category.slug}/${product.slug}`"></product-card>
            </div>
          </div>-->
          <vertical-card
            v-if="category.children.length===0"
            :item="category"
            type="catalog"
            class="mb-4 d-block"
            :key="index"
          ></vertical-card>
          <div v-else :key="index">
            <div
              class="catalog-card layout wrap mb-4"
              v-for="child in category.children"
              :key="child.id"
            >{{child}}</div>
          </div>
          <!-- <div v-else>
            <template v-for="child in category.children">
              <vertical-card :item="child" :key="child.id" type="catalog" class="mb-4"></vertical-card>
            </template>
          </div>-->
          <!-- v-if="category.children.length===0"

          

          <!-- <nuxt-link :to="`/catalog/${category.slug}`">
              <h2>{{category.name}}</h2>
          </nuxt-link>-->
        </template>
      </v-container>
    </section>
  </div>
</template>

<style lang="stylus" scoped>
@media (max-width: 960px) {
}
</style>
<script>
import PageHeader from "~/components/PageHeader";
import VerticalCard from "~/components/VerticalCard";
import ProductCard from "~/components/ProductCard";

import gql from "graphql-tag";

export default {
  head() {
    return {
      title: "Каталог"
    };
  },
  components: { PageHeader, VerticalCard, ProductCard },
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
          categories(sort: "name:asc") {
            id
            name
            slug
            description
            parent {
              id
            }
            products(limit: 8) {
              id
              name
              slug
              description
              priceNum
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
                img {
                  url
                }
              }
            }
            children {
              id
              name
              slug
              description
              img {
                url
              }
            }
            img {
              url
            }
          }
        }
      `
    });
    // console.log("TCL: Data -> categoriesData", categoriesData);
    // const reducedCategories = categoriesData.categories.reduce((acc, val) => {
    //   console.log("TCL: acc", acc);
    //   console.log("TCL: val", val);
    //   acc.set(val.id, val);
    //   return acc;
    // }, new Map());
    return {
      categories: categoriesData.categories.filter(
        item => item.children.length === 0
      )
    };
  },
  computed: {
    // categories() {
    //   return this.$store.state.generalInfo.categories;
    // }
  }
};
</script>

