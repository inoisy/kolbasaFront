<template>
  <div>
    <NuxtChild @close="handleClose" :breadcrumbs-base="breadcrumbs" />
    <LazyHydrate when-idle>
      <!-- :isProductRoute="isProductRoute" never :trigger-hydration="!noLoad" -->
      <page-header fluid :load="!isProductRoute">
        <template #breadcrumbs>
          <div>
            <breadcrumbs-sceleton
              v-if="isProductRoute"
              :boilerplate="!fetchState"
            />
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
            v-if="noLoad || !metaInfo.name"
            class="d-flex justify-center ma-auto"
            dark
            type="heading"
            min-height="24px"
            min-width="300px"
            width="100%"
            :boilerplate="!fetchState"
          />
          <h1 v-else class="header-text" v-text="metaInfo.name" />
        </template>
        <template #bottom>
          <div style="max-width: 100%">
            <lazy-subcategories
              v-if="!isProductRoute && !!subcategories.length"
              :subcategories="subcategories"
            />
          </div>
        </template>
      </page-header>
    </LazyHydrate>

    <div
      :class="$style.categoryWrapper"
      id="contentWrapper"
      :style="isMounted && !noLoad && `background-image: url(/bg.jpg)`"
    >
      <div :class="$style.container">
        <LazyHydrate never :trigger-hydration="isMounted && !noLoad">
          <div :class="$style.products">
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
                :parent="category.slug"
                :loading="fetchState"
              />
              <!-- :show="index < 10" -->
            </div>
            <!-- </LazyHydrate>
          <LazyHydrate when-visible> -->
            <lazy-products-infinity
              style="width: 100%"
              v-if="isMounted && pageData && products.length >= limit"
              @load="onInfinite"
            />
            <!-- </LazyHydrate> -->
          </div>
        </LazyHydrate>
        <div :class="$style.filters">
          <lazy-filtersSort
            v-if="!isProductRoute"
            :sortItems="sortItems"
            :selectedItemTitle="sort.title"
            @change="(val) => sortChange(val)"
          />
          <lazy-filters-sort-sceleton v-else :boilerplate="!fetchState" />
          <LazyHydrate never :trigger-hydration="isMounted && !noLoad">
            <div>
              <lazy-filters
                v-if="
                  initialPageData &&
                  !!category.product_types &&
                  category.product_types.length
                "
                filterSlug="type"
                filterName="виды"
                :filterAllDisabled="!!manufacturer || !productType"
                :items="category.product_types"
                @change="(val) => productTypeChange(val)"
              />

              <lazy-filters
                v-if="initialPageData && !!category.manufacturers"
                filterSlug="manufacturer"
                filterName="производители"
                :filterAllDisabled="!!productType || !manufacturer"
                :items="category.manufacturers"
                @change="(val) => manufacturerChange(val)"
              />
              <lazy-filters-sceleton v-else :boilerplate="!fetchState" />
            </div>
          </LazyHydrate>
        </div>
      </div>
    </div>
    <section class="grey lighten-3" v-if="metaInfo.content">
      <LazyHydrate never>
        <v-container class="py-16">
          <v-row>
            <v-col cols="12">
              <content-wrapper :content="metaInfo.content" />
            </v-col>
          </v-row>
        </v-container>
      </LazyHydrate>
    </section>
  </div>
</template>

<script>
import gql from "graphql-tag";
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
        // link: [
        //   {
        //     rel: "canonical",
        //     href: this.metaInfo.canonical,
        //   },
        // ],
      };
    }
  },
  components: { LazyHydrate },
  data() {
    const sortItems = [
      { title: "По алфавиту", value: "name:asc", slug: "name" },
      { title: "По популярности", value: "rating:desc", slug: "rating" },
      { title: "Cначала дорогие", value: "priceNum:desc", slug: "pricedesc" },
      { title: "Cначала дешевые", value: "priceNum:asc", slug: "priceasc" },
    ];
    return {
      imageBaseUrl: this.$config.imageBaseUrl,
      sortItems: sortItems,
      sort: sortItems[0],
      pageData: false,
      categoriesIds: [],
      category: {},
      limit: 20,
      productType: false,
      manufacturer: false,
      isProductRoute: !!this.$route.params.slug,
      products: new Array(20).fill(false),
      initialPageData: false,
      metaInfo: {},
      bgLoaded: false,
      isMounted: false,
      isLoading: false,
    };
  },
  watch: {
    isLoading(val) {
      console.log("category loading", val);
      if (val) {
        this.$nuxt.$loading.start();
      } else {
        this.$nuxt.$loading.finish();
      }
    },
  },
  mounted() {
    this.isMounted = true;
    // this.loadImage();
  },
  async fetch() {
    if (!this.initialPageData && !this.isProductRoute) {
      this.isLoading = true;
      const categoryFind = this.findCategory(this.$route.params.category);

      if (!categoryFind) {
        return this.$nuxt.error({
          statusCode: 404,
          message: "Категория не найдена",
          type: "catalog",
        });
      }
      this.categoriesIds = [categoryFind.id];
      if (categoryFind.children && categoryFind.children.length > 0) {
        this.categoriesIds.push(
          ...categoryFind.children.map((item) => item.id)
        );
      }
      // const category = ;
      this.category = await this.fetchCategory(categoryFind.id);
      const { manufacturer, type } = this.$route.query;
      if (manufacturer) {
        this.manufacturer = this.$store.getters.getManufacturerBySlug[
          manufacturer
        ];
      }
      if (type) {
        this.productType = this.category.product_types.find(
          (item) => item.slug === type
        );
      }
      if (!!this.category.parent.length) {
        this.$store.dispatch("setRootCategory", this.category.parent[0]);
      } else {
        const { children, name, slug } = this.category;
        this.$store.dispatch("setRootCategory", { children, name, slug });
      }

      await this.calculateMeta();

      this.initialPageData = true;
    } else if (this.isProductRoute) {
      // console.time("newCategoryFetch");
      // const categoryMinimal = await this.fetchCategoryMinimalBySlug(
      //   this.$route.params.category
      // );
      // console.log(
      //   "🚀 ~ file: _category.vue ~ line 481 ~ fetch ~ categoryMinimal",
      //   categoryMinimal
      // );
      // if (!categoryMinimal.length) {
      //   return this.$nuxt.error({
      //     statusCode: 404,
      //     message: "Категория не найдена",
      //     type: "catalog",
      //   });
      // }
      // const category = categoryMinimal[0];
      // console.timeEnd("newCategoryFetch");
      // console.log(
      //   "🚀 ~ file: _category.vue ~ line 478 ~ fetch ~ categoryMinimal",
      //   categoryMinimal
      // );

      // console.time("oldCategoryFetch");
      this.category = this.findCategory(this.$route.params.category);

      if (!this.category) {
        return this.$nuxt.error({
          statusCode: 404,
          message: "Категория не найдена",
          type: "catalog",
        });
      }
      if (!!this.category.parent.length) {
        this.$store.dispatch("setRootCategory", this.category.parent[0]);
      } else {
        const { children, name, slug } = this.category;
        this.$store.dispatch("setRootCategory", { children, name, slug });
      }
      // this.$store.dispatch("category", this.category);
      // console.timeEnd("oldCategoryFetch");
      // this.category = categoryFind;
      // this.$store.dispatch("setRootCategory", this.category);
      // this.breadcrumbs = this.calculateBreadcrumbs();
    }

    if (!this.pageData && !this.isProductRoute) {
      this.isLoading = true;
      const oldLength = this.products.length;
      this.products = new Array(oldLength).fill(false);
      const categoryFind = this.findCategory(this.$route.params.category);

      // console.time("newFetch");
      // // const categoryFind1 = this.findCategory(this.$route.params.category);

      // const products1 = await this.fetchProductsByCategory({
      //   category: categoryFind.id,
      //   limit: this.limit,
      //   sort: this.sort.value,
      //   manufacturer: !!this.manufacturer && this.manufacturer._id,
      //   product_type: !!this.productType && this.productType._id,
      // });
      // console.timeEnd("newFetch");
      // console.time("oldFetch");
      this.categoriesIds = [categoryFind.id];
      if (categoryFind.children && categoryFind.children.length > 0) {
        this.categoriesIds.push(
          ...categoryFind.children.map((item) => item.id)
        );
      }
      const products = await this.fetchProducts({
        category: this.categoriesIds,
        limit: this.limit,
        sort: this.sort.value,
        manufacturer: !!this.manufacturer && this.manufacturer._id,
        product_type: !!this.productType && this.productType._id,
      });
      // console.timeEnd("oldFetch");

      const length = products.length;
      if (oldLength !== length) {
        this.products = this.products.slice(0, length);
      }
      this.products = products;
      this.pageData = true;
    }
    this.isLoading = false;
    // if (process.client) {
    //   console.log("loading finish");
    //   this.$nuxt.$loading.finish();
    // }
  },
  computed: {
    noLoad() {
      return !this.initialPageData && this.isProductRoute;
    },
    fetchState() {
      return this.$fetchState.pending;
    },

    subcategories() {
      return this.$store.getters.subcategories;
    },

    breadcrumbs() {
      const rootCategory = this.$store.state.sessionStorage.rootCategory;
      let items = [
        {
          to: "/",
          text: "Главная",
        },
        {
          to: "/catalog",
          text: "Каталог",
        },
      ];
      items.push({
        to: `/catalog/${rootCategory.slug}`,
        text: rootCategory.name,
      });

      if (this.category.slug !== rootCategory.slug) {
        items.push({
          to: `/catalog/${this.category.slug}`,
          text: this.category.name,
          // disable: false,
        });
      }

      // this.$store.dispatch("breadcrumbs", items);
      return items;
    },
  },
  methods: {
    // calculateBreadcrumbs() {
    //   // return [];
    //   // const breadcrumbs = this.$store.state.sessionStorage.breadcrumbs;
    //   // console.log(
    //   //   "🚀 ~ file: _category.vue ~ line 615 ~ calculateBreadcrumbs ~ breadcrumbs",
    //   //   breadcrumbs
    //   // );
    //   // items.push(});
    //   // disable: false,
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
    //     {
    //       to: `/catalog/${rootCategory.slug}`,
    //       text: rootCategory.name,
    //     },
    //   ];

    //   if (this.category.slug !== rootCategory.slug) {
    //     items.push({
    //       to: `/catalog/${this.category.slug}`,
    //       text: this.category.name,
    //     });
    //   }
    //   return items;
    // },
    // if (this.category.slug !== rootCategory.slug) {
    //   this.$store.dispatch("pushBreadcrumbs", {
    //     to: `/catalog/${this.category.slug}`,
    //     text: this.category.name,
    //     // disable: false,
    //   });
    // }
    // this.$store.dispatch("pushBreadcrumbs", {
    //   to: `/catalog/${this.category.slug}`,
    //   text: this.category.name,
    //   // disable: false,
    // });
    // this.$store.dispatch("breadcrumbs", breadcrumbs);
    // return this.$store.state.sessionStorage.breadcrumbs;

    async calculateMeta() {
      let name = `${this.category.name} оптом`;
      let description = this.category.metaDescription
        ? this.category.metaDescription
        : `${name} от компании Альянс Фуд с доставкой по всей РФ и СНГ по самым выгодным оптовым ценам от производителя.`;
      // let canonical = `${this.$config.siteUrl}/catalog/${this.category.slug}`;
      let content = this.category.content;

      if (this.manufacturer) {
        name = `${this.category.name} ${this.manufacturer.name} оптом`;
        description = `${name}. ${description}`;
        // canonical = `${canonical}?manufacturer=${this.manufacturer.slug}`;
      } else if (this.productType) {
        const productType = await this.fetchProductType(this.productType._id);

        name = `${productType.name} оптом`;
        description = `${name}. ${description}`;
        // canonical = `${canonical}?type=${productType.slug}`;
        if (productType.content) {
          content = productType.content.concat(content);
        }
      }

      this.metaInfo = {
        name,
        description,
        // canonical,
        content,
      };
      // return ;
    },
    findCategory(slug) {
      // const category = this.$store.getters.getCategoryBySlug[slug];
      // if (!category) return null;
      return this.$store.getters.getCategoryBySlug[slug];
    },
    //  async fetchCategoryMinimalBySlug(slug) {
    //   // console.log(
    //   //   "🚀 ~ file: _category.vue ~ line 800 ~ fetchCategory ~ id",
    //   //   id
    //   // );
    //   const {
    //     data: { categories },
    //   } = await this.$apollo.query({
    //     query: gql`
    //       query CategoryMinimalQuery($slug: String!) {
    //         categories(where: { slug: $slug }) {
    //           id
    //           name
    //           slug
    //           parent {
    //             id
    //             slug
    //             name
    //           }
    //           children {
    //             id
    //             name
    //             slug
    //           }
    //         }
    //       }
    //     `,
    //     variables: {
    //       slug,
    //     },
    //   });
    //   return categories;
    // },
    // async fetchProductsByCategory(params) {
    //   let {
    //     data: { byCategory },
    //   } = await this.$apollo.query({
    //     query: gql`
    //       query productsByCategoryQuery(
    //         $manufacturer: ID
    //         $id: ID!
    //         $product_type: ID
    //         $sort: String
    //         $limit: Int
    //         $start: Int
    //       ) {
    //         byCategory(
    //           id: $id
    //           limit: $limit
    //           start: $start
    //           sort: $sort
    //           where: {
    //             manufacturer: $manufacturer
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
    //     variables: {
    //       manufacturer: params.manufacturer || null,
    //       product_type: params.product_type || null,
    //       id: params.category,
    //       sort: params.sort || "name:asc",
    //       limit: params.limit || 20,
    //       start: params.start || 0,
    //     },
    //   });
    //   // console.log(data);
    //   return byCategory.map((item) => {
    //     return Object.freeze(item);
    //   });
    // },
    async fetchProducts(params) {
      // this.isLoading = true;
      // console.log(
      //   "🚀 ~ file: _category.vue ~ line 620 ~ fetchProducts ~ params",
      //   JSON.stringify(params)
      // );
      let {
        data: { products },
      } = await this.$apollo.query({
        query: gql`
          query productsQuery(
            $manufacturer: ID
            $category: [ID!]
            $product_type: ID
            $sort: String
            $limit: Int
            $start: Int
          ) {
            products(
              limit: $limit
              start: $start
              sort: $sort
              where: {
                manufacturer: $manufacturer
                category: $category
                product_type: $product_type
              }
            ) {
              id
              name
              slug
              weight
              isDiscount
              isHalal
              priceNum
              discountPrice
              rating
              minimumOrder
              piece
              manufacturer {
                name
                slug
              }
              category {
                name
                slug
              }
              img {
                url
                name
                formats
              }
            }
          }
        `,
        variables: {
          ...(!!params.manufacturer && {
            manufacturer: params.manufacturer,
          }),
          ...(!!params.product_type && {
            product_type: params.product_type,
          }),
          category: params.category,
          sort: params.sort || "name:asc",
          limit: params.limit || 20,
          start: params.start || 0,
        },
      });

      return products.map((item) => {
        return Object.freeze(item);
      });
    },
    async fetchProductType(id) {
      // const client = this.app.apolloProvider.defaultClient;
      const {
        data: { productType },
      } = await this.$apollo.query({
        variables: {
          id,
        },
        query: gql`
          query ProductTypeQuery($id: ID!) {
            productType(id: $id) {
              _id
              id
              name
              slug
              content
            }
          }
        `,
      });
      return productType;
    },

    // async fetchCategoryBySlug(slug) {
    //   // console.log(
    //   //   "🚀 ~ file: _category.vue ~ line 800 ~ fetchCategory ~ id",
    //   //   id
    //   // );
    //   const {
    //     data: { categories },
    //   } = await this.$apollo.query({
    //     query: gql`
    //       query CategoryQuery($slug: String!) {
    //         categories(where: { slug: $slug }) {
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
    //       slug,
    //     },
    //   });
    //   return categories;
    // },
    async fetchCategory(id) {
      // console.log(
      //   "🚀 ~ file: _category.vue ~ line 800 ~ fetchCategory ~ id",
      //   id
      // );
      const {
        data: { category },
      } = await this.$apollo.query({
        query: gql`
          query CategoryQuery($id: ID!) {
            category(id: $id) {
              id
              description
              metaDescription
              name
              slug
              content
              manufacturers(sort: "name:asc") {
                _id
                name
                slug
              }
              parent {
                slug
                name
                children {
                  id
                  name
                  slug
                }
              }
              children {
                id
                name
                slug
              }
              product_types(sort: "name:asc") {
                _id
                name
                slug
              }
            }
          }
        `,
        variables: {
          id,
        },
      });
      return category;
    },
    async sortChange(item) {
      if (this.sort.value !== item.value) {
        this.sort = item;
        this.pageData = false;
        await this.$fetch();
      }
    },
    async productTypeChange(item) {
      this.manufacturer = null;
      const oldValue = this.productType && this.productType._id;
      const newValue = item && item._id;
      if (oldValue !== newValue) {
        this.productType = item;
        this.pageData = false;
        await this.$fetch();
        await this.calculateMeta();
      }
    },
    async manufacturerChange(item) {
      this.productType = null;
      const oldValue = this.manufacturer && this.manufacturer._id;
      const newValue = item && item._id;
      if (oldValue !== newValue) {
        this.manufacturer = item;
        this.pageData = false;
        await this.$fetch();
        await this.calculateMeta();
      }
    },

    async handleClose() {
      const query = {
        ...(this.manufacturer && { manufacturer: this.manufacturer.slug }),
        ...(this.productType && { type: this.productType.slug }),
      };

      const { slug, ...params } = this.$route.params;
      const routeSplit = this.$route.path.replace(/\/$/, "").split("/");
      routeSplit.pop();
      const newRoute = { path: routeSplit.join("/"), params, query };

      await this.$router.push(newRoute); //.go(-1); //.push({ params: { params } });
      this.isProductRoute = false;

      if (!this.pageData) {
        await this.$fetch();
      }
    },
    async onInfinite($state) {
      this.isLoading = true;
      const newProducts = await this.fetchProducts({
        category: this.categoriesIds,
        start: this.products.length,
        sort: this.sort.value,
        manufacturer: this.manufacturer && this.manufacturer._id,
        product_type: this.productType && this.productType._id,
      });
      if (newProducts && newProducts.length) {
        // const newProductArr = newProducts.map((product) => {
        //   const { img, ...newProduct } = product;
        //   newProduct.imageUrl = calculateImageUrl(img, this.imageBaseUrl);
        //   return {
        //     value: Object.freeze(newProduct),
        //     __v: 0,
        //   };
        // });
        // for (let product of newProducts) {
        //   const { img, ...newProduct } = product;
        //   newProduct.imageUrl = calculateImageUrl(img, this.imageBaseUrl);
        //   console.log(
        //     "🚀 ~ file: _category.vue ~ line 932 ~ onInfinite ~ newProduct.imageUrl",
        //     newProduct
        //   );
        //   this.products.push({
        //     value: Object.freeze(newProduct),
        //     __v: 0,
        //   });
        // }
        this.products = [...this.products, ...newProducts];
        await $state.loaded();
      } else {
        await $state.complete();
      }
      this.isLoading = false;
    },
  },
};
</script>
<style lang="scss" scoped>
// .chipSelected {
//   background-color: #252525 !important;
//   color: #f5f5f5 !important;
// }
#contentWrapper {
  min-height: 900px;
}

// .subcategories {
//   width: 100%;
//   justify-content: center;

//   .subcategory-btn {
//     font-size: 0.7rem;
//   }
// }

// @media (min-width: 960px) {
//   .subcategories {
//     .subcategory-btn {
//       font-size: 0.9rem;
//     }
//   }
// }
</style>
<style lang="scss" scoped module>
.categoryWrapper {
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
