<template>
  <div>
    <page-header :title="manufacturer.name" :breadrumbs="breadrumbs" />
    <div>
      <!-- class="background" v-lazy:background-image="require('~/assets/img/bg.jpg')" -->
      <v-container grid-list-lg class="py-5">
        <div class="display-1 mb-4" style="font-size: 1.1rem !important">
          <div
            class="flex xs12"
            data-aos="fade-up"
            v-html="manufacturer.content && manufacturer.content.length>0 ? $md.render(manufacturer.content) : ''"
          ></div>
          <div v-if="manufacturer.catalog.length>0" data-aos="fade-up">
            <v-btn
              v-for="(catalog,index) in manufacturer.catalog"
              :key="'catalog'+index"
              class="ml-0"
              large
              color="accent"
              :href="imageBaseUrl+catalog.url"
            >
              <v-icon left dark>save_alt</v-icon>Загрузить каталог
            </v-btn>
          </div>
          <v-divider class="mt-3" v-show="categories.length>0"></v-divider>
        </div>

        <v-layout row wrap v-for="category of categories" :key="category.id" class="mb-4">
          <h2 class="mb-4 flex xs12 d-block" data-aos="fade-up">
            <nuxt-link
              :to="`/catalog/${category.item.slug}?manufacturer=${manufacturer.slug}`"
            >{{category.item.name}}</nuxt-link>
          </h2>
          <div
            class="flex xs12 sm6 md4 lg3 xl2"
            data-aos="fade-up"
            v-for="product of category.products"
            :key="product.id"
          >
            <product-card :product="product" :category="category.item.slug"></product-card>
          </div>
          <div class="flex xs12" data-aos="fade-up">
            <v-btn
              :to="`/catalog/${category.item.slug}?manufacturer=${manufacturer.slug}`"
              class="mt-4 ml-0"
              color="accent"
              large
            >Показать все товары</v-btn>
          </div>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>
<style>
.background {
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
<script>
import gql from "graphql-tag";

import PageHeader from "~/components/PageHeader";
import ProductCard from "~/components/ProductCard";

export default {
  head() {
    return {
      title: this.manufacturer.name,
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: "description",
          name: "description",
          content: this.manufacturer.description
        }
      ]
    };
  },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl
    };
  },
  async asyncData(ctx) {
    const generalInfo = await ctx.store.dispatch("fetchGeneralInfo");
    let client = ctx.app.apolloProvider.defaultClient;
    const manufacturerFind = generalInfo.manufacturers.find(
      item => item.slug === ctx.params.slug
    );
    if (manufacturerFind) {
      const id = manufacturerFind.id;
      const { data: manufacturerData } = await client.query({
        variables: {
          id: id
        },
        query: gql`
          query ManufacturerQuery($id: ID!) {
            manufacturer(id: $id) {
              name
              slug
              description
              content
              img {
                url
              }
              catalog {
                url
              }
            }
          }
        `
      });

      const { data: categories } = await ctx.$axios.get(
        `/categories/categoriesByManufacturer` + id
      );
      return {
        manufacturer: manufacturerData.manufacturer,
        categories: categories
      };
    } else {
      return ctx.error({
        statusCode: 404,
        message: "Производитель не найден"
      });
    }
  },
  components: { PageHeader, ProductCard },

  computed: {
    // manufacturer() {
    //   return this.$store.state.manufacturer;
    // },
    breadrumbs() {
      return [
        {
          to: "/",
          text: "Главная"
        },
        {
          to: "/manufacturers",
          text: "Производители"
        }
        // {
        //   to: this.$route.path,
        //   text: this.manufacturer.name
        // }
      ];
    }

    // manufacturers() {
    //   return this.$store.state.generalInfo.manufacturers;
    // }
  }
};
</script>


