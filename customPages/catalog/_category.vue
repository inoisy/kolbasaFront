<template>
  <div>
    <NuxtChild @close="handleClose" :breadcrumbs-base="breadcrumbs" />
    <LazyHydrate when-idle>
      <page-header
        :load="!noLoad"
        :breadcrumbs="breadcrumbs"
        :isLoading="isLoading"
        :title="metaInfo.name"
      >
        <template #bottom>
          <lazy-subcategories
            class="mt-auto"
            style="width: 100%"
            v-if="!noLoad && !!subcategories.length"
            :subcategories="subcategories"
          />
          <!-- </div> -->
        </template>
      </page-header>
    </LazyHydrate>

    <div
      :class="$style.categoryWrapper"
      class="background-repeat background-fixed"
      id="contentWrapper"
      :style="isMounted && !noLoad && `background-image: url(/bg.jpg)`"
    >
      <!-- {{ subcategories }} -->
      <div :class="$style.container">
        <LazyHydrate never :trigger-hydration="!noLoad">
          <div :class="$style.products" ref="products">
            <div
              v-for="(product, index) in products"
              :key="`product-${index}`"
              class="flex xs12 sm6 md4 lg3 xl2 pa-2"
              :class="$style.product"
            >
              <product-card
                :class="$style.productInner"
                :product="product"
                grandparent="catalog"
                :parent="$route.params.category"
                :loading="isLoading"
              />
            </div>
            <!-- <client-only> -->
            <lazy-products-infinity
              style="width: 100%"
              v-if="isMounted && !noLoad && products.length >= limit"
              @load="onInfinite"
            />
            <!-- </client-only> -->
          </div>
        </LazyHydrate>
        <div :class="$style.filters">
          <div :class="$style.filtersInner">
            <filtersSort
              :isData="!noLoad"
              :boilerplate="!isLoading"
              @change="(val) => sortChange(val)"
            />
            <lazy-filters
              v-if="productTypes.length > 1"
              filterSlug="type"
              filterName="виды"
              :filterAllDisabled="!!manufacturer || !productType"
              :items="productTypes"
              :isData="initialPageData"
              :boilerplate="!isLoading"
              @change="(val) => productTypeChange(val)"
            />

            <lazy-filters
              v-if="manufacturers.length > 1"
              filterSlug="manufacturer"
              filterName="производители"
              :filterAllDisabled="!!productType || !manufacturer"
              :items="manufacturers"
              :isData="initialPageData"
              :boilerplate="!isLoading"
              @change="(val) => manufacturerChange(val)"
            />
          </div>
        </div>
      </div>
    </div>
    <LazyHydrate v-if="metaInfo.content" never>
      <section class="grey lighten-3">
        <v-container class="py-16">
          <v-row>
            <v-col cols="12">
              <content-wrapper :content="metaInfo.content" />
            </v-col>
          </v-row>
        </v-container>
      </section>
    </LazyHydrate>
  </div>
</template>

<script>
import LazyHydrate from "vue-lazy-hydration";

export default {
  name: "category-main",
  loading: false,
  head() {
    if (!this.isProductRoute && !!this.metaInfo && this.metaInfo.name) {
      // console.log("this.metaInfo", this.metaInfo);
      // console.log("from route");
      return {
        title: this.metaInfo.name,
        meta: [
          {
            hid: "description",
            name: "description",
            content: this.metaInfo.description,
          },
        ],
      };
    }
  },
  components: { LazyHydrate },
  data() {
    const limit = this.$store.state.sessionStorage.categoryPage.limit;
    return {
      category: {},
      limit: limit,

      isProductRoute: !!this.$route.params.slug,
      products: new Array(limit).fill(false),
      initialPageData: false,

      isMounted: false,
      isLoading: false,
    };
  },
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
        this.isProductRoute = true;
      } else {
        this.isProductRoute = false;
        if (!this.initialPageData) {
          this.$fetch();
        }
      }
    },
  },
  mounted() {
    this.isMounted = true;
  },

  async fetch() {
    this.isLoading = true;

    const categoryId = await this.$store.dispatch(
      "changeCategory",
      this.$route.params.category
    );
    // console.log(
    //   "🚀 ~ file: _category.vue ~ line 170 ~ fetch ~ categoryId",
    //   categoryId
    // );

    if (!categoryId) {
      // if (process.server) {
      //   this.$nuxt.context.res.statusCode = 404;
      // }
      // throw new Error("Категория не найдена");
      return this.$nuxt.error({
        statusCode: 404,
        message: "Категория не найдена",
        type: "catalog",
      });
    }
    // console.log("CODE IS WTF", categoryId);
    if (!this.initialPageData && !this.isProductRoute) {
      await this.$store.dispatch("fetchAndSetFilters", this.$route.query);
      this.products = (
        await Promise.all([
          this.$store.dispatch("fetchCategoryProducts"),
          this.$store.dispatch("fetchCategory", categoryId),
        ])
      )[0];

      this.initialPageData = true;
    }
    this.isLoading = false;
  },
  computed: {
    noLoad() {
      return !this.initialPageData && this.isProductRoute;
    },
    breadcrumbs() {
      // if (this.$fetchState.error) {
      //   return [];
      // }
      // console.log("breadcrumbs", this.$fetchState.error);
      return this.$store.getters.categoryBreadcrumbs;
    },

    manufacturer() {
      return this.$store.state.sessionStorage.categoryPage.manufacturerSelected;
    },
    manufacturers() {
      if (this.noLoad) {
        return [];
      }
      return this.$store.state.sessionStorage.categoryPage.category
        .manufacturers;
    },
    productType() {
      return this.$store.state.sessionStorage.categoryPage.productTypeSelected;
    },

    productTypes() {
      if (this.noLoad) {
        return [];
      }
      return this.$store.state.sessionStorage.categoryPage.category
        .product_types;
    },

    subcategories() {
      if (this.noLoad) {
        return [];
      }
      return this.$store.getters.categorySubcategories;
    },
    metaInfo() {
      if (this.noLoad) {
        return {};
      }
      // console.log("metaInfo", this.noLoad);
      return this.$store.getters.categoryMeta;
    },
  },
  methods: {
    async fetchAndRefillProducts() {
      this.isLoading = true;
      this.products = this.products.map(() => false);
      this.products = await this.$store.dispatch("fetchCategoryProducts");
      this.isLoading = false;
    },

    async scrollToProducts() {
      if (this.$vuetify.breakpoint.mobile) {
        return;
      }
      if (this.$refs.products.getBoundingClientRect().top >= 90) {
        return;
      }
      await this.$vuetify.goTo(this.$refs.products, {
        offset: 90,
      });
    },
    async sortChange(item) {
      await this.scrollToProducts();
      await this.$store.dispatch("changeSort", item);
      await this.fetchAndRefillProducts();
    },
    async productTypeChange(item) {
      const oldValue = this.productType && this.productType._id;
      const newValue = item && item._id;
      if (oldValue !== newValue) {
        await this.scrollToProducts();
        await this.$store.dispatch("changeProductType", newValue);
        await this.fetchAndRefillProducts();
      }
    },

    async manufacturerChange(item) {
      const oldValue = this.manufacturer && this.manufacturer._id;
      const newValue = item && item._id;
      if (oldValue !== newValue) {
        await this.scrollToProducts();
        await this.$store.dispatch("changeManufacturer", item);
        await this.fetchAndRefillProducts();
      }
    },

    async handleClose() {
      await this.$router.push({
        path: `/catalog/${this.$route.params.category}`,
        query: {
          ...(this.manufacturer && { manufacturer: this.manufacturer.slug }),
          ...(this.productType && { type: this.productType.slug }),
        },
      });
    },
    async onInfinite($state) {
      this.isLoading = true;
      // await this.$store.dispatch("fetchMoreCategoryProducts", $state);

      const newProducts = await this.$store.dispatch(
        "fetchCategoryProducts",
        this.products.length
      );
      if (newProducts && newProducts.length) {
        this.products = [...this.products, ...newProducts];
        await $state.loaded();
      } else {
        await $state.complete();
      }
      this.isLoading = false;
    },
  },
}; // $route(val) {
//   console.log("🚀 ~ file: _category.vue ~ line 202 ~ val", val);
// },
// async "$route.query"({ type, manufacturer }) {
//   if (this.isProductRoute) {
//     return;
//   }

//   if (type) {
//     if (this.productType && this.productType.slug === type) {
//       return;
//     }
//     // if(type ===this.$ststate.sessionStorage.categoryPage.manufacturerSelected)
//     await this.scrollToProducts();
//     await this.$store.dispatch("changeProductTypeBySlug", type);
//     await this.fetchAndRefillProducts();
//   } else if (manufacturer) {
//     if (this.manufacturer && this.manufacturer.slug === manufacturer) {
//       return;
//     }
//     await this.scrollToProducts();
//     await this.$store.dispatch("changeManufacturerBySlug", manufacturer);
//     await this.fetchAndRefillProducts();
//   } else if (!!this.manufacturer || this.productType) {
//     await this.scrollToProducts();
//     await this.$store.dispatch("cleanFilters");
//     await this.fetchAndRefillProducts();
//   }
//   // await this.fetchAndRefillProducts();
// },
// async "$route.query.type"(slug) {
//    await this.scrollToProducts();
//     await this.$store.dispatch("changeProductTypeBySlug", slug);
//     await this.fetchAndRefillProducts();
// },
// async "$route.query.manufacturer"(slug) {
//   await this.scrollToProducts();
//   await this.$store.dispatch("changeManufacturerBySlug", slug);
//   await this.fetchAndRefillProducts();
// },
</script>
<style lang="scss" scoped>
.header-sceleton {
  ::v-deep .v-skeleton-loader__text {
    margin-bottom: 0 !important;
    height: 100% !important;
    width: 100% !important;
  }
}
</style>
<style lang="scss" scoped module>
.headerSceleton {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.chipsWrapper {
  //   white-space: normal;
  flex-wrap: wrap;
  max-width: 100%;
  padding: 8px 0;
  display: flex;
  flex: 1 0 auto;
  position: relative;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  .chipHeader {
    width: 100%;
    text-transform: uppercase;
    font-family: $heading-font-family;
    font-weight: bold;
    font-size: 16px;
    color: $black;
    align-items: center;
    display: flex;
    height: 48px;
    // padding: 0 16px 0 16px;
  }
}
.categoryWrapper {
  --indent: calc(var(--toolbar-height) + 20px);
  --height: calc(100vh - var(--indent) - 20px);
  min-height: var(--height);
  // background-color: #f0f0f0;
  // background-repeat: repeat;
  // background-size: 100% auto;

  max-width: 100%;
  $filtersWidthMd: 270px;
  $filtersWidthLg: 320px;
  position: relative;
  .container {
    position: relative;
    width: 100%;
    padding: 12px;
    // padding: 25px 20px;
    margin: 0 auto;
    display: flex;
    flex-direction: column-reverse;
    @include md {
      flex-direction: row;
    }
    .filters {
      padding: 8px;
      padding-left: 12px;
      width: 100%;
      @include md {
        width: $filtersWidthMd;
        min-width: $filtersWidthMd;
        // flex: 0 0 270px;
      }
      @include lg {
        width: $filtersWidthLg;
        min-width: $filtersWidthLg;
        // flex: 0 0 300px;
      }
      .filtersInner {
        @include md {
          @supports ((position: -webkit-sticky) or (position: sticky)) {
            top: var(--indent);
            max-height: var(--height);
            position: -webkit-sticky;
            position: sticky;
            overflow-y: auto;
            &::-webkit-scrollbar {
              width: 10px;
            }

            &::-webkit-scrollbar-track {
              box-shadow: inset 0 0 5px grey;
              border-radius: 10px;
            }

            &::-webkit-scrollbar-thumb {
              background-color: darkgrey;
              border-radius: 10px;
              // outline: 1px solid slategrey;
            }
          }
        }
      }
    }
    .products {
      flex-grow: 1;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      align-content: flex-start;
      @include md {
        max-width: calc(100% - #{$filtersWidthMd});
      }
      @include lg {
        max-width: calc(100% - #{$filtersWidthLg});
      }
    }
  }
}
</style>
