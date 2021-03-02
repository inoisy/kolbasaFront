<template>
  <div>
    <nuxt-child @close="handleClose" />
    <LazyHydrate when-idle>
      <page-header
        :title="`Мясокомбинат ${manufacturer.name} оптом`"
        :breadrumbs="breadrumbs"
        :isPadding="true"
      >
        <template #bottom v-if="manufacturer.catalog">
          <!-- <template > -->
          <v-btn
            class="mb-8 mx-auto"
            large
            color="accent"
            :href="imageBaseUrl + manufacturer.catalog.url"
            :title="`Каталог ${manufacturer.name}`"
          >
            <v-icon left dark>$file</v-icon>
            Загрузить прайс
          </v-btn>
          <!-- </template> -->
        </template>
      </page-header>
    </LazyHydrate>

    <div
      :style="`background-image: url(${require('~/assets/images/bg.jpg?original')})`"
      class="background-with-transparent"
    >
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
              class="heading-font font-weight-bold d-inline-block primary--text underline-on-hover"
              v-text="`${category.item.name} ${manufacturer.name} оптом`"
            ></nuxt-link>
          </h2>

          <div
            class="flex xs12 sm6 md4 lg3 xl2"
            v-for="product of category.products"
            :key="`product-${product.id}`"
          >
            <!-- -${product.__v} -->
            <product-card
              :product="product"
              grandparent="manufacturers"
              :parent="manufacturer.slug"
              :show="index === 0"
            />
            <!-- </product-card>
                          :to="`/manufacturers/${manufacturer.slug}/${product.slug}`" -->
          </div>
        </v-layout>
      </v-container>
      <section class="grey lighten-3" v-if="isContent">
        <v-container class="py-16">
          <v-row>
            <v-col cols="12">
              <LazyHydrate never>
                <content-wrapper v-html="manufacturer.content" />
              </LazyHydrate>
            </v-col>
          </v-row>
        </v-container>
      </section>
    </div>
  </div>
</template>
<script>
// import PageHeader from "~/components/PageHeader";
// import ProductCard from "~/components/ProductCard";
// import { mdiDownload } from "@mdi/js";
import LazyHydrate from "vue-lazy-hydration";

export default {
  components: {
    LazyHydrate,
  },
  head() {
    if (!this.manufacturer || !this.manufacturer.name) return;
    return {
      title: `Мясокомбинат ${this.manufacturer.name}. Купить колбасы ${this.manufacturer.name} оптом.`,
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            this.manufacturer.metaDescription ||
            `${this.manufacturer.name} оптом. ${this.manufacturer.name} от компании Альянс Фуд с доставкой по всей РФ и СНГ по самым выгодным оптовым ценам от производителя.`,
        },
      ],
    };
  },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      // iscons: { mdiDownload },
    };
  },
  async asyncData({ store, params, error, $strapi }) {
    const manufacturer = await store.getters.getManufacturer(params.manufSlug);
    if (!manufacturer) {
      return error({
        statusCode: 404,
        message: "Производитель не найден",
        type: "manufacturer",
      });
    }
    // console.log(
    //   "🚀 ~ file: _slug.vue ~ line 134 ~ asyncData ~ awaimanufacturer.id)",
    //   await store.dispatch("fetchManufacturer", manufacturer.id)
    // );

    return {
      manufacturer: await store.dispatch("fetchManufacturer", manufacturer.id),
      categories: await $strapi.$http.$get(
        `/products/byManufacturer/` + manufacturer.id
      ),
    };
  },
  // components: { PageHeader, ProductCard },
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
      this.$store.dispatch("breadcrumbs", items);
      return items;
    },
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

      // await this.$router.push({ slug: undefined });
      // if (isInCart) {
      //   const category = this.categories.find(
      //     (category) => category.item.slug == categorySlug
      //   );
      //   console.log(
      //     "🚀 ~ file: _slug.vue ~ line 144 ~ handleClose ~ category",
      //     category
      //   );
      //   const product = category.products.find((item) => item._id === id);
      //   product.__v = product.__v + 1;
      //   console.log(
      //     "🚀 ~ file: _slug.vue ~ line 146 ~ handleClose ~ product",
      //     product
      //   );
      // }
    },
  },
};
</script>


