<template>
  <div>
    <nuxt-child />
    <page-header
      :title="`Мясокомбинат ${manufacturer.name} оптом`"
      :breadrumbs="breadrumbs"
      :isPadding="true"
    >
      <slot>
        <template v-if="manufacturer.catalog">
          <v-btn
            class="mb-12 mx-auto"
            large
            color="accent"
            :href="imageBaseUrl+manufacturer.catalog.url"
            :title="`Каталог ${manufacturer.name}`"
          >
            <v-icon left dark>save_alt</v-icon>Загрузить прайс
          </v-btn>
        </template>
      </slot>
    </page-header>
    <div
      class="background background-repeat"
      v-lazy:background-image="require('~/assets/img/bg.jpg')"
    >
      <v-container grid-list-lg class="py-12">
        <div v-if="isContent" class="mb-6 content-wrapper">
          <div class="flex xs12" v-html="isContent ? $md.render(manufacturer.content) : ''"></div>
          <v-divider class="mt-3" v-show="categories.length>0"></v-divider>
        </div>

        <v-layout row wrap v-for="(category,index) of categories" :key="category.id" class="mb-0">
          <h2 class="display-flex align-center wrap xs12 mb-3 flex">
            <nuxt-link
              :to="`/catalog/${category.item.slug}?manufacturer=${manufacturer.slug}`"
              :title="manufacturer.name"
              class="lumber font-weight-bold d-inline-block primary--text underline-on-hover"
              v-text="`${category.item.name} ${manufacturer.name} оптом`"
            ></nuxt-link>
          </h2>

          <div
            class="flex xs12 sm6 md4 lg3 xl2"
            v-for="product of category.products"
            :key="product.id"
          >
            <product-card
              :product="product"
              :to="`/manufacturers/${manufacturer.slug}/${product.slug}`"
            ></product-card>
          </div>
          <v-flex xs12>
            <v-divider class="mt-3 mb-1"></v-divider>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </div>
</template>
<script>
import gql from "graphql-tag";

import PageHeader from "~/components/PageHeader";
import ProductCard from "~/components/ProductCard";

export default {
  head() {
    return {
      title: `Мясокомбинат ${this.manufacturer.name}. Купить колбасы ${this.manufacturer.name} оптом.`,
      meta: [
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
    // const generalInfo = await ctx.store.dispatch("fetchGeneralInfo");
    // const manufacturerFind = generalInfo.manufacturers.find(
    //   item => item.slug === ctx.params.slug
    // );
    const manufacturer = await ctx.store.getters.getManufacturer(
      ctx.params.slug
    );
    if (!manufacturer) {
      return ctx.error({
        statusCode: 404,
        message: "Производитель не найден",
        type: "manufacturer"
      });
    }
    let manufacturerData = await ctx.store.dispatch(
      "fetchManufacturer",
      manufacturer.id
    );

    const { data: categoriesData } = await ctx.$axios.get(
      `/categories/categoriesByManufacturer/` + manufacturer.id
    );
    return {
      manufacturer: manufacturerData,
      categories: categoriesData
    };
  },
  components: { PageHeader, ProductCard },

  computed: {
    isContent() {
      return this.manufacturer.content && this.manufacturer.content.length > 0;
    },
    breadrumbs() {
      const items = [
        {
          to: "/",
          text: "Главная"
        },
        {
          to: "/manufacturers",
          text: "Производители"
        },
        {
          to: this.$route.path,
          text: this.manufacturer.name
        }
      ];
      this.$store.commit("breadcrumbs", items);
      return items;
    }
  }
};
</script>


