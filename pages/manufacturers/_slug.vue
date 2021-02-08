<template>
  <div>
    <nuxt-child @close="handleClose" />
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
            :href="imageBaseUrl + manufacturer.catalog.url"
            :title="`Каталог ${manufacturer.name}`"
          >
            <v-icon left dark>{{ icons.mdiDownload }}</v-icon>
            <!-- <svg-icon name="save_alt" style="width: 24px; height: 24px" /> -->

            Загрузить прайс
          </v-btn>
        </template>
      </slot>
    </page-header>
    <div
      class="background background-repeat"
      style="background-image: url(/bg.jpg)"
    >
      <!-- v-lazy:background-image="require('~/assets/img/bg.jpg')" -->
      <v-container grid-list-lg class="pt-10 pb-7">
        <v-layout
          row
          wrap
          v-for="(category, index) of categories"
          :key="category.id"
          class="mb-5"
        >
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
            :key="`${product.id}-${product.__v}`"
          >
            <product-card
              :product="product"
              :to="`/manufacturers/${manufacturer.slug}/${product.slug}`"
            ></product-card>
          </div>
          <!-- <v-flex xs12 v-if="index !== categories.length-1">
            <v-divider class="mt-3 mb-1"></v-divider>
          </v-flex>-->
        </v-layout>
      </v-container>
      <section class="content-wrapper grey lighten-4">
        <v-container grid-list-lg class="py-10">
          <div v-if="isContent" class="content-wrapper">
            <div
              class="flex xs12"
              v-html="isContent ? manufacturer.content : ''"
            ></div>
            <!-- <v-divider class="mt-3" v-show="categories.length>0"></v-divider> -->
          </div>
        </v-container>
      </section>
    </div>
  </div>
</template>
<script>
import PageHeader from "~/components/PageHeader";
import ProductCard from "~/components/ProductCard";
import { mdiDownload } from "@mdi/js";

export default {
  head() {
    return {
      title: `Мясокомбинат ${this.manufacturer.name}. Купить колбасы ${this.manufacturer.name} оптом.`,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.manufacturer.description,
        },
      ],
    };
  },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      icons: { mdiDownload },
    };
  },
  async asyncData({ store, params, error, $axios }) {
    const manufacturer = await store.getters.getManufacturer(params.slug);
    if (!manufacturer) {
      return error({
        statusCode: 404,
        message: "Производитель не найден",
        type: "manufacturer",
      });
    }
    return {
      manufacturer: await store.dispatch("fetchManufacturer", manufacturer.id),
      categories: (
        await $axios.get(`/products/byManufacturer/` + manufacturer.id)
      ).data,
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
          text: "Главная",
        },
        {
          to: "/manufacturers",
          text: "Производители",
        },
        {
          to: `/manufacturers/${this.manufacturer.slug}`,
          text: this.manufacturer.name,
        },
      ];
      this.$store.commit("breadcrumbs", items);
      return items;
    },
  },
  methods: {
    handleClose(id, categorySlug) {
      console.log("close", id, "categorySlug: ", categorySlug);

      const category = this.categories.find(
        (category) => category.item.slug == categorySlug
      );
      console.log(
        "🚀 ~ file: _slug.vue ~ line 144 ~ handleClose ~ category",
        category
      );
      const product = category.products.find((item) => item._id === id);
      product.__v = product.__v + 1;
      console.log(
        "🚀 ~ file: _slug.vue ~ line 146 ~ handleClose ~ product",
        product
      );
    },
  },
};
</script>


