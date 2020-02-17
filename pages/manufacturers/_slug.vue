<template>
  <div>
    <nuxt-child />
    <page-header :title="`Мясокомбинат ${manufacturer.name} оптом`" :breadrumbs="breadrumbs">
      <slot>
        <div v-if="manufacturer.catalog.length>0" class="display-flex justify-center">
          <v-btn
            v-for="(catalog,index) in manufacturer.catalog"
            :key="'catalog'+index"
            class
            large
            color="accent"
            :href="imageBaseUrl+catalog.url"
            :title="`Каталог ${manufacturer.name}`"
          >
            <v-icon left dark>save_alt</v-icon>Загрузить прайс
          </v-btn>
        </div>
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
          <h2 class="display-flex align-center wrap xs12 mb-3 flex" data-aos="fade-up">
            <nuxt-link
              :to="`/catalog/${category.item.slug}?manufacturer=${manufacturer.slug}`"
              :title="manufacturer.name"
              class="lumber font-weight-bold d-inline-block primary--text underline-on-hover"
              v-text="`${category.item.name} ${manufacturer.name} оптом`"
            ></nuxt-link>
          </h2>

          <div
            class="flex xs12 sm6 md4 lg3 xl2"
            data-aos="fade-up"
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
      title: `Мясокомбинат ${this.manufacturer.name}. Купить колбасы ${this.manufacturer.name} оптом.`,
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
  methods: {
    async handleShowMore(categoryId) {
      let client = this.$apollo;
      const categoryIndex = this.categories.findIndex(
        item => item.item.id === categoryId
      );

      this.showMoreButtonShow[categoryIndex] = false;
      const productsLength = this.categories[categoryIndex].products.length;
      const { data: products } = await this.$axios.get(
        process.env.baseUrl +
          `/products?category=${categoryId}&manufacturer=${this.manufacturer.id}&_limit=999&_start=${productsLength}`
      );
      if (products.length > 0) {
        this.categories[categoryIndex].products.push(...products);
      }
    }
  },
  async asyncData(ctx) {
    const generalInfo = await ctx.store.dispatch("fetchGeneralInfo");
    let client = ctx.app.apolloProvider.defaultClient;
    const manufacturerFind = generalInfo.manufacturers.find(
      item => item.slug === ctx.params.slug
    );
    if (manufacturerFind) {
      const id = manufacturerFind.id;
      let manufacturerData = await ctx.store.dispatch("fetchManufacturer", id);

      const { data: categoriesData } = await ctx.$axios.get(
        `/categories/categoriesByManufacturer/` + id
      );
      return {
        manufacturer: manufacturerData,
        categories: categoriesData,
        showMoreButtonShow: categoriesData.map(
          item => item.products.length >= 10
        )
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
    isContent() {
      return this.manufacturer.content && this.manufacturer.content.length > 0;
    },
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
        },
        {
          to: this.$route.path,
          text: this.manufacturer.name
        }
      ];
    }

    // manufacturers() {
    //   return this.$store.state.generalInfo.manufacturers;
    // }
  }
};
</script>


