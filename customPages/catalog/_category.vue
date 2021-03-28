<template>
  <div>
    <NuxtChild @close="handleClose" :breadcrumbs-base="breadcrumbs" />
    <LazyHydrate when-idle>
      <page-header fluid :load="!isProductRoute">
        <template #breadcrumbs>
          <div>
            <breadcrumbs-sceleton v-if="noLoad" :boilerplate="!isLoading" />
            <breadcrumbs
              v-else
              :items="breadcrumbs"
              large
              class="pt-6 py-3 text-center"
            />
          </div>
        </template>
        <template #header>
          <v-skeleton-loader
            v-if="noLoad || isLoading"
            class="d-flex justify-center ma-auto"
            dark
            type="heading"
            min-height="24px"
            min-width="300px"
            width="100%"
            :boilerplate="!isLoading"
          />
          <h1 v-else class="header-text" v-text="metaInfo.name" />
        </template>
        <template #bottom>
          <div style="max-width: 100%">
            <lazy-subcategories
              v-if="!noLoad && !!subcategories.length"
              :subcategories="subcategories"
            />
          </div>
        </template>
      </page-header>
    </LazyHydrate>
    <LazyHydrate never :trigger-hydration="!noLoad">
      <div
        :class="$style.categoryWrapper"
        id="contentWrapper"
        :style="isMounted && !noLoad && `background-image: url(/bg.jpg)`"
      >
        <!-- <div>{{ !noLoad }}</div> -->
        <!-- <LazyHydrate never :trigger-hydration="isMounted && !noLoad"> -->
        <!-- <lazy-filters-sceleton v-else :boilerplate="!fetchState" /> -->
        <!-- </LazyHydrate> -->
        <!-- </LazyHydrate> -->
        <!-- <LazyHydrate never :trigger-hydration="!noLoad"> -->
        <div :class="$style.container">
          <!-- <LazyHydrate never :trigger-hydration="!noLoad"> -->
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

          <!-- </LazyHydrate>
           -->
          <div :class="$style.filters">
            <div :class="$style.filtersInner">
              <filtersSort
                :isData="!noLoad"
                :boilerplate="!isLoading"
                @change="(val) => sortChange(val)"
              />
              <!-- </LazyHydrate>
            <LazyHydrate never :trigger-hydration="!noLoad"> -->
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
              <!-- </LazyHydrate>
            <LazyHydrate never :trigger-hydration="!noLoad"> -->
              <lazy-filters
                v-if="!!manufacturers && manufacturers.length > 1"
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
    </LazyHydrate>
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
// import gql from "graphql-tag";
import LazyHydrate from "vue-lazy-hydration";

export default {
  name: "category-main",
  loading: false,
  head() {
    if (!this.isProductRoute) {
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

      manufacturers: [],
      productTypes: [],
      // sortItems: [],
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
    const isCategoryExist = await this.$store.dispatch(
      "changeCategory",
      this.$route.params.category
    );
    if (!isCategoryExist) {
      return this.$nuxt.error({
        statusCode: 404,
        message: "Категория не найдена",
        type: "catalog",
      });
    }

    if (!this.initialPageData && !this.isProductRoute) {
      // this.category =
      await this.$store.dispatch("fetchCategory", this.$route.query);
      this.productTypes = this.$store.state.sessionStorage.categoryPage.category.product_types;
      this.manufacturers = this.$store.state.sessionStorage.categoryPage.category.manufacturers;
      // this.sortItems = this.$store.state.localStorage.category.sortItems;
      // console.log(
      //   "🚀 ~ file: _category.vue ~ line 208 ~ fetch ~ this.$route.query",
      //   this.$route.query
      // );
      // await this.$store.dispatch("fetchCategoryProducts");this.products =
      //await this.fetchProducts();
      this.products = await this.$store.dispatch("fetchCategoryProducts");
      this.initialPageData = true;
    }
    this.isLoading = false;
  },
  computed: {
    noLoad() {
      return !this.initialPageData && this.isProductRoute;
    },
    breadcrumbs() {
      return this.$store.getters.categoryBreadcrumbs;
    },
    subcategories() {
      return this.$store.getters.categorySubcategories;
    },

    // sortItems() {
    //   return this.$store.state.localStorage.category.sortItems;
    // },
    productType() {
      return this.$store.state.sessionStorage.categoryPage.productTypeSelected;
    },

    manufacturer() {
      return this.$store.state.sessionStorage.categoryPage.manufacturerSelected;
    },

    // productTypes() {
    //   if (this.noLoad) {
    //     return [];
    //   }
    //   return this.$store.state.sessionStorage.categoryPage.category
    //     .product_types;
    // },

    // manufacturers() {
    //   if (this.noLoad) {
    //     return [];
    //   }
    //   return this.$store.state.sessionStorage.categoryPage.category
    //     .manufacturers;
    // },

    // products() {
    //   return this.$store.state.sessionStorage.categoryPage.products;
    // },
    metaInfo() {
      if (this.isProductRoute) {
        return {};
      }
      return this.$store.getters.categoryMeta;
    },
  },
  methods: {
    async fetchAndRefillProducts() {
      this.isLoading = true;
      this.products = this.products.map(() => false);
      this.products = await this.$store.dispatch("fetchCategoryProducts"); //await this.fetchProducts();

      // await this.$store.dispatch("fetchAndRefillProducts");
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
      // if (this.sort.value !== item.value) {
      // this.sort = item;
      await this.scrollToProducts();
      await this.$store.dispatch("changeSort", item);

      await this.fetchAndRefillProducts();
      // }
    },
    async productTypeChange(item) {
      // this.manufacturer = null;
      const oldValue = this.productType && this.productType._id;
      const newValue = item && item._id;
      if (oldValue !== newValue) {
        await this.scrollToProducts();
        await this.$store.dispatch("changeProductType", newValue);
        // console.log(
        //   "🚀 ~ file: _category.vue ~ line 338 ~ productTypeChange ~ newValue",
        //   newValue
        // );

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
};
//await this.fetchProducts(this.products.length);
// findCategory(slug) {
//   return this.$store.getters.getCategoryBySlug[slug];
// },
// this.products = this.products.map(() => false);
// this.products = await this.$store.dispatch("fetchCategoryProducts"); //await this.fetchProducts();

// async fetchProducts(start = 0) {
//   const variables = {
//     start: start,
//     category: this.$store.state.sessionStorage.categoryPage.categoriesIds,
//     limit: this.limit,
//     sort: this.sort.value,
//     ...(!!this.manufacturer && {
//       manufacturer: this.manufacturer._id,
//     }),
//     ...(!!this.productType && {
//       product_type: this.productType._id,
//     }),
//   };
//   let {
//     data: { products },
//   } = await this.$apollo.query({
//     query: gql`
//       query productsQuery(
//         $manufacturer: ID
//         $category: [ID!]
//         $product_type: ID
//         $sort: String
//         $limit: Int
//         $start: Int
//       ) {
//         products(
//           limit: $limit
//           start: $start
//           sort: $sort
//           where: {
//             manufacturer: $manufacturer
//             category: $category
//             product_type: $product_type
//           }
//         ) {
//           id
//           name
//           slug
//           weight
//           isDiscount
//           isHalal
//           priceNum
//           discountPrice
//           rating
//           minimumOrder
//           piece
//           manufacturer {
//             name
//             slug
//           }
//           category {
//             name
//             slug
//           }
//           img {
//             url
//             name
//             formats
//           }
//         }
//       }
//     `,
//     variables: variables,
//   });

//   return products.map((item) => {
//     return Object.freeze(item);
//   });
// },
// categoriesIds: [],
// const sortItems = [
//   { title: "По алфавиту", value: "name:asc", slug: "name" },
//   { title: "По популярности", value: "rating:desc", slug: "rating" },
//   { title: "Cначала дорогие", value: "priceNum:desc", slug: "pricedesc" },
//   { title: "Cначала дешевые", value: "priceNum:asc", slug: "priceasc" },
// ];
// cons
// sortItems: sortItems,
// sort: sortItems[0],
// link: [
//   {
//     rel: "canonical",
//     href: this.metaInfo.canonical,
//   },
// ],
// fetchState() {
//   return this.$fetchState.pending;
// },
// else {
//   this.category = categoryFind;
// }
// this.calculateBreadcrumbs();
// imageBaseUrl: this.$config.imageBaseUrl,
// productType: false,
// manufacturer: false,
// pageData: false,
// metaInfo: {},
// bgLoaded: false,
// breadcrumbs: [],
// async validate({ params, store }) {
//   console.log("VALUDATE CALLED"); //query
//   try {
//     await store.dispatch("rootCategory", params.category);
//     return true;
//   } catch (error) {
//     return false;
//   }
//   // console.log(
//   //   "🚀 ~ file: _category.vue ~ line 234 ~ validate ~ params",
//   //   params
//   // );
//   // return true;
//   // return true // if the params are valid
//   // return false // will stop Nuxt.js to render the route and display the error page
// },
// await this.calculateMeta();
// console.log(
//   "🚀 ~ file: _category.vue ~ line 444 ~ productTypeChange ~ newValue",
//   newValue
// );this.productType =
// item;
// console.log(
//   "🚀 ~ file: _category.vue ~ line 538 ~ productTypeChange ~ this.productType",
//   this.productType
// );
// this.productType = null;
// await this.$store.dispatch("fetchProductType", newValue);

// this.manufacturer = item;
// console.log(
//   "🚀 ~ file: _category.vue ~ line 421 ~ manufacturerChange ~ item",
//   item
// );
// console.log(
//   "🚀 ~ file: _category.vue ~ line 611 ~ handleClose ~ this.$router",
//   this.$store.state.route.from.name
// );
//  this.$route.path
//   .replace(/\/$/, "")
//   .split("/")
//   .slice(0, -1)
//   .join("/"),
// params: (({ slug, ...params }) => params)(this.$route.params),
// console.log(
//   "🚀 ~ file: _category.vue ~ line 230 ~ fetch ~ rootCategory",
//   rootCategory
// );

// console.log("fetch initiated");

// const categoryFind = this.findCategory(this.$route.params.category);
// console.log(
//   "🚀 ~ file: _category.vue ~ line 231 ~ fetch ~ this.$route.params",
//   this.$route
// );
// if (!!categoryFind.parent.length) {
//   this.$store.dispatch(
//     "setRootCategory",
//     this.findCategory(categoryFind.parent[0].slug)
//   );
//   this.categoriesIds = [categoryFind.id];
// } else {
//   const { id, children, name, slug } = categoryFind;
//   this.$store.dispatch("setRootCategory", { id, children, name, slug });
//   this.categoriesIds = this.$store.getters.categorySubcategoriesIDs;
// }
// async calculateMeta() {
//   console.log(
//     "🚀 ~ file: _category.vue ~ line 317 ~ calculateMeta ~ calculateMeta"
//   );
//   let name = `${this.category.name} оптом`;
//   let description = this.category.metaDescription
//     ? this.category.metaDescription
//     : `${name} от компании Альянс Фуд с доставкой по всей РФ и СНГ по самым выгодным оптовым ценам от производителя.`;
//   let content = this.category.content;

//   if (this.manufacturer) {
//     name = `${this.category.name} ${this.manufacturer.name} оптом`;
//     description = `${name}. ${description}`;
//   } else if (this.productType) {
//     const productType = this.productType; //await this.fetchProductType(this.productType._id);

//     name = `${productType.name} оптом`;
//     description = `${name}. ${description}`;
//     if (productType.content) {
//       content = productType.content.concat(content);
//     }
//   }

//   // this.metaInfo = {
//   //   name,
//   //   description,
//   //   content,
//   // };
// },
// console.log(
//   "🚀 ~ file: _category.vue ~ line 263 ~ fetch ~ this.category",
//   this.category
// );
// this.category); // await this.fetchCategory(categoryFind.id);

// const { manufacturer, type } = this.$route.query;
// if (manufacturer) {
//   this.manufacturer = this.$store.getters.getManufacturerBySlug[
//     manufacturer
//   ];
// }
// if (type) {
//   this.productType = this.category.product_types.find(
//     (item) => item.slug === type
//   );
// }

// await this.calculateMeta();
// async calculateBreadcrumbs() {
//   const rootCategory = this.$store.state.sessionStorage.rootCategory;
//   let items = [
//     {
//       to: "/",
//       text: "Главная",
//     },
//     {
//       to: "/catalog",
//       text: "Каталог",
//     },
//   ];
//   items.push({
//     to: `/catalog/${rootCategory.slug}`,
//     text: rootCategory.name,
//   });

//   if (this.category.slug !== rootCategory.slug) {
//     items.push({
//       to: `/catalog/${this.category.slug}`,
//       text: this.category.name,
//       // disable: false,
//     });
//   }
//   this.breadcrumbs = items;
// },
// async fetchProductType(id) {
//   const {
//     data: { productType },
//   } = await this.$apollo.query({
//     variables: {
//       id,
//     },
//     query: gql`
//       query ProductTypeQuery($id: ID!) {
//         productType(id: $id) {
//           _id
//           id
//           name
//           slug
//           content
//         }
//       }
//     `,
//   });
//   return productType;
// },

// async fetchCategory(id) {
//   const {
//     data: { category },
//   } = await this.$apollo.query({
//     query: gql`
//       query CategoryQuery($id: ID!) {
//         category(id: $id) {
//           id
//           description
//           metaDescription
//           name
//           slug
//           content
//           manufacturers(sort: "name:asc") {
//             _id
//             name
//             slug
//           }
//           parent {
//             slug
//             name
//             children {
//               id
//               name
//               slug
//             }
//           }
//           children {
//             id
//             name
//             slug
//           }
//           product_types(sort: "name:asc") {
//             _id
//             name
//             slug
//           }
//         }
//       }
//     `,
//     variables: {
//       id,
//     },
//   });
//   return category;
// },
</script>
<style lang="scss" scoped module>
.categoryWrapper {
  --indent: calc(var(--toolbar-height) + 20px);
  --height: calc(100vh - var(--indent) - 20px);
  min-height: var(--height);
  background-color: #f0f0f0;
  background-repeat: repeat;
  background-size: 100% auto;

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
