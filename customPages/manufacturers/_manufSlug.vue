<template>
  <div>
    <nuxt-child @close="handleClose" />
    <LazyHydrate when-idle>
      <page-header
        :title="`Мясокомбинат ${manufacturer.name} оптом`"
        :breadrumbs="breadcrumbs"
        :isPadding="true"
      >
        <template #header>
          <v-skeleton-loader
            v-if="!initialPageData || !manufacturer.name"
            class="d-flex justify-center ma-auto"
            dark
            type="heading"
            min-height="24px"
            min-width="300px"
            width="100%"
            :boilerplate="!$fetchState.pending"
          />
        </template>
        <template #bottom v-if="manufacturer.catalog">
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
        </template>
      </page-header>
    </LazyHydrate>
    <div
      :style="`background-image: url(/bg.jpg)`"
      class="background-with-transparent"
    >
      <v-container class="pt-10 pb-7">
        <LazyHydrate
          when-visible
          v-for="(category, index) of categories"
          :key="category.id"
        >
          <v-row no-gutters class="mb-10">
            <h2 class="pa-3 mb-3 flex xs12">
              <v-skeleton-loader
                v-if="noLoad || !manufacturer.name"
                class="mb-4"
                width="400px"
                max-width="100%"
                height="38px"
                type="heading"
                :boilerplate="!$fetchState.pending"
              />
              <nuxt-link
                v-else
                :to="`/catalog/${category.item.slug}?manufacturer=${manufacturer.slug}`"
                :title="manufacturer.name"
                class="heading-font font-weight-bold d-inline-block primary--text underline-on-hover"
                v-text="`${category.item.name} ${manufacturer.name} оптом`"
              />
            </h2>
            <v-col
              v-for="(product, i) of category.products"
              :key="`product-${index}-${i}`"
              class="pa-3"
              cols="12"
              sm="6"
              md="4"
              lg="3"
              xl="2"
            >
              <product-card
                :product="product"
                grandparent="manufacturers"
                :parent="manufacturer.slug"
                :loading="$fetchState.pending"
              />
            </v-col>
          </v-row>
        </LazyHydrate>
      </v-container>
      <section
        class="grey lighten-3"
        v-if="manufacturer.content && manufacturer.content.length > 0"
      >
        <v-container class="py-16">
          <LazyHydrate never>
            <lazy-content-wrapper class="pa-3" v-html="manufacturer.content" />
          </LazyHydrate>
        </v-container>
      </section>
    </div>
  </div>
</template>
<script>
import LazyHydrate from "vue-lazy-hydration";
import gql from "graphql-tag";

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
  // mounted() {
  //   this.isMounted = true;
  //   this.loadImage();
  // },
  data() {
    return {
      imageBaseUrl: this.$config.imageBaseUrl,
      isProductRoute: !!this.$route.params.slug,
      initialPageData: false,
      isMounted: false,
      // categories: [],
      manufacturer: {},
      categories: [
        {
          item: false,
          products: new Array(20).fill(false),
        },
      ],

      breadcrumbs: [],
    };
  },
  watch: {
    "$route.params.slug"(val) {
      if (!!val) {
        this.isProductRoute = true;
      } else if (!this.initialPageData) {
        this.$fetch();
      }
    },
  },

  async fetch() {
    if (!this.initialPageData && !this.$route.params.slug) {
      const isLoading = process.client;
      if (isLoading) {
        this.$nuxt.$loading.start();
      }
      const manufacturerbySlug = this.$store.getters.getManufacturerBySlug[
        this.$route.params.manufSlug
      ];
      let {
        data: { byManufacturer },
      } = await this.$apollo.query({
        query: gql`
          query ProductsbyManufacturer($id: ID) {
            byManufacturer(id: $id)
          }
        `,
        variables: {
          id: manufacturerbySlug.id,
        },
      });
      this.categories = byManufacturer;
      this.manufacturer = await this.$store.dispatch(
        "fetchManufacturer",
        manufacturerbySlug.id
      );
      this.initialPageData = true;
      this.calculateBreadcrumbs();
      if (isLoading) {
        this.$nuxt.$loading.finish();
      }
    } else if (this.$route.params.slug) {
      if (process.client) {
        this.$nuxt.$loading.start();
      }
      this.manufacturer = this.$store.getters.getManufacturerBySlug[
        this.$route.params.manufSlug
      ];
      this.calculateBreadcrumbs();
      if (process.client) {
        this.$nuxt.$loading.finish();
      }
    }
  },

  computed: {
    noLoad() {
      return !this.initialPageData && this.isProductRoute;
    },
  },
  methods: {
    calculateBreadcrumbs() {
      // console.log("calculateBreadcrumbs");
      this.breadcrumbs = [
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
      this.$store.dispatch("breadcrumbs", this.breadcrumbs);
    },

    async handleClose() {
      await this.$router.push(`/manufacturers/${this.$route.params.manufSlug}`); //({ path: routeSplit.join("/"), params });
    },
  },
};
// loadImage() {
//   // console.log("loadImage", !this.noLoad && !this.bgLoaded);
//   if (!this.noLoad && !this.bgLoaded) {
//     this.image = this.imageSource;
//     this.bgLoaded = true;
//   }
// },
// console.log(
//   "🚀 ~ file: _manufSlug.vue ~ line 200 ~ handleClose ~ this.initialPageData",
//   this.initialPageData
// );

// if (!this.initialPageData) {
//   await this.$fetch();
// }
// console.log("route changed", val);

//: "$fetch",
//   noLoad(val) {
//     if (!val) {
//       this.loadImage();
//     }
//   },
// middleware({ req, store, redirect, route }) {
//   // console.log(
//   //   "🚀 ~ file: _manufSlug.vue ~ line 192 ~ middleware ~ req",
//   //   route
//   // );
//   if (req && req.url.match("undefined")) {
//     console.log(
//       "🚀 ~ file: _manufSlug.vue ~ line 194 ~ middleware ~ undefined"
//     );
//     // redirect('/')
//   }

//   // If the user is not authenticated
//   // if (!store.state.authenticated) {
//   //   return redirect('/login')
//   // }
// },
// async asyncData({ store, params, error, app, route }) {
//   console.log("🚀 asyncData called ~ params2222");
//   // $strapi,
//   let manufacturerData, productsbyManufacturer;
//   if (!params.slug) {
//     console.log("data called1", params.slug);

//     console.time("getManufacturer", params.manufSlug);
//     const manufacturer = await store.getters.getManufacturer(
//       params.manufSlug
//     );
//     console.timeEnd("getManufacturer");

//     if (!manufacturer) {
//       return error({
//         statusCode: 404,
//         message: "Производитель не найден",
//         type: "manufacturer",
//       });
//     }
//     const {
//       data: { byManufacturer },
//     } = await app.apolloProvider.defaultClient.query({
//       query: gql`
//         query ProductsbyManufacturer($id: ID) {
//           byManufacturer(id: $id)
//         }
//       `,
//       variables: {
//         id: manufacturer.id,
//       },
//     });
//     productsbyManufacturer = byManufacturer;
//     manufacturerData = await store.dispatch(
//       "fetchManufacturer",
//       manufacturer.id
//     );
//   }

//   return {
//     manufacturer: manufacturerData,
//     categories: productsbyManufacturer,
//   };
// },

// isProductRoute() {
//   const value = this.$route.params.slug ?? true;
//   console.log("computed ~ isProductRoute", this.$route.params.slug,);
//   return value;
// },
// isContent() {
//   return this.manufacturer.content && this.manufacturer.content.length > 0;
// },
// breadrumbs() {
//   console.log("calculate breadrumbs");
//   const items = [
//     {
//       to: "/",
//       text: "Главная",
//     },
//     {
//       to: "/manufacturers",
//       text: "Производители",
//     },
//     {
//       to: `/manufacturers/${this.manufacturer.slug}`,
//       text: this.manufacturer.name,
//     },
//   ];
//   this.$store.dispatch("breadcrumbs", items);
//   return items;
// },
// id, categorySlug) {isInCart, id, categorySlug
// console.log(
//   "close",
//   isInCart,
//   " id: ",
//   id,
//   " categorySlug: ",
//   categorySlug
// );
// const { slug, ...params } = this.$route.params;

// const routeSplit = this.$route.path.replace(/\/$/, "").split("/");
// routeSplit.pop();
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
// async asyncData({ store, params, error, app }) {
//   console.log("🚀 ~ file: _slug.vue ~ line 112 ~ asyncData ~ params", params);
//   // $strapi,
//   let manufacturerData, productsbyManufacturer;
//   if (!params.slug) {
//     console.log("data called1", params.slug);
//     console.log(
//       "🚀 ~ file: _slug.vue ~ line 124 ~ asyncData ~  params.manufSlug",
//       params.manufSlug
//     );

//     console.time("getManufacturer", params.manufSlug);
//     const manufacturer = await store.getters.getManufacturer(
//       params.manufSlug
//     );
//     console.timeEnd("getManufacturer");

//     if (!manufacturer) {
//       return error({
//         statusCode: 404,
//         message: "Производитель не найден",
//         type: "manufacturer",
//       });
//     }
//     const {
//       data: { byManufacturer },
//     } = await app.apolloProvider.defaultClient.query({
//       query: gql`
//         query ProductsbyManufacturer($id: ID) {
//           byManufacturer(id: $id)
//         }
//       `,
//       variables: {
//         id: manufacturer.id,
//       },
//     });
//     productsbyManufacturer = byManufacturer;
//     manufacturerData = await store.dispatch(
//       "fetchManufacturer",
//       manufacturer.id
//     );
//     // console.log(
//     //   "🚀 ~ file: _manufSlug.vue ~ line 152 ~ asyncData ~ manufacturerData",
//     //   manufacturerData
//     // );
//   }

//   // console.log(
//   //   "🚀 ~ file: _slug.vue ~ line 128 ~ asyncData ~ data",
//   //   byManufacturer
//   // );
//   // console.log(
//   //   "🚀 ~ file: _slug.vue ~ line 134 ~ asyncData ~ awaimanufacturer.id)",
//   //   await store.dispatch("fetchManufacturer", manufacturer.id)
//   // );

//   return {
//     manufacturer: manufacturerData,
//     categories: productsbyManufacturer,
//     // await $strapi.$http.$get(
//     //   `/products/byManufacturer/` + manufacturer.id
//     // ),
//   };
// },

// components: { PageHeader, ProductCard },
</script>