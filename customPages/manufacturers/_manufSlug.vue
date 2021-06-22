<template>
  <div>
    <nuxt-child @close="handleClose" :breadcrumbs-base="breadcrumbs" />
    <LazyHydrate when-idle>
      <page-header
        :title="`Мясокомбинат ${manufacturer.name} оптом`"
        :breadcrumbs="!noLoad ? breadcrumbs : []"
        :load="!noLoad && !isLoading"
        :isLoading="isLoading"
      >
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
      class="background-repeat background-fixed"
      :style="isMounted && !noLoad && `background-image: url(/images/bg.jpg)`"
    >
      <!-- <LazyHydrate never :trigger-hydration="!noLoad"> -->
      <v-container class="pt-10 pb-7">
        <LazyHydrate
          v-for="(category, index) of categories"
          :key="category.id"
          when-visible
        >
          <v-row no-gutters class="mb-10">
            <sceleton-title
              class="pa-3 col col-12"
              :noLoad="noLoad"
              :isLoading="isLoading"
            >
              <h2 :class="$style.categoryName">
                <nuxt-link
                  :to="`/catalog/${category.item.slug}?manufacturer=${manufacturer.slug}`"
                  :title="manufacturer.name"
                  class="heading-font font-weight-bold d-inline-block primary--text underline-on-hover"
                  v-text="`${category.item.name} ${manufacturer.name} оптом`"
                />
              </h2>
            </sceleton-title>
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
      <!-- </LazyHydrate> -->
      <LazyHydrate
        never
        v-if="manufacturer.content && manufacturer.content.length > 0"
      >
        <section class="grey lighten-3">
          <v-container class="py-16">
            <lazy-content-wrapper class="pa-3" v-html="manufacturer.content" />
          </v-container>
        </section>
      </LazyHydrate>
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
  mounted() {
    this.isMounted = true;
    // this.loadImage();
  },

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
      isLoading: false,
    };
  },
  loading: false,

  watch: {
    isLoading(val) {
      if (!process.client) {
        return;
      }
      if (val) {
        this.$nuxt.$loading.start();
      } else {
        this.$nuxt.$loading.finish();
      }
    },
    "$route.params.slug"(val) {
      if (!!val) {
        // console.log("🚀 ~ file: _manufSlug.vue true", val);
        this.isProductRoute = true;
      } else {
        // console.log("🚀 ~ file: _manufSlug.vue fakse", val);
        this.isProductRoute = false;
        if (!this.initialPageData) {
          this.$fetch();
        }
      }
    },
  },

  async fetch() {
    if (!this.initialPageData && !this.$route.params.slug) {
      this.isLoading = true;
      const manufacturerbySlug = this.$store.getters[
        "info/getManufacturerBySlug"
      ][this.$route.params.manufSlug];
      if (!manufacturerbySlug) {
        return this.$nuxt.error({
          statusCode: 404,
          message: "Производитель не найден",
          type: "manufacturer",
        });
      }
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
      if (!byManufacturer) {
        return this.$nuxt.error({
          statusCode: 404,
          message: "Производитель не найден",
          type: "manufacturer",
        });
      }
      this.categories = byManufacturer;
      this.manufacturer = await this.$store.dispatch(
        "fetchManufacturer",
        manufacturerbySlug.id
      );
      this.initialPageData = true;
      this.calculateBreadcrumbs();
    } else if (this.$route.params.slug) {
      this.isLoading = true;
      if (process.client) {
        this.$nuxt.$loading.start();
      }
      this.manufacturer = this.$store.getters.getManufacturerBySlug[
        this.$route.params.manufSlug
      ];
      this.calculateBreadcrumbs();
    }
    this.isLoading = false;
  },

  computed: {
    noLoad() {
      return !this.initialPageData && this.isProductRoute;
    },
  },
  methods: {
    calculateBreadcrumbs() {
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
    },

    async handleClose() {
      await this.$router.push(`/manufacturers/${this.$route.params.manufSlug}`); //({ path: routeSplit.join("/"), params });
    },
  },
};
</script>
<style lang="scss" scoped module>
.categoryName {
  min-height: 38px;
  display: flex;
  align-items: center;
}
</style>
