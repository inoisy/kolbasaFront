<template>
  <div>
    <nuxt-child @close="handleClose" />
    <page-header
      :title="name"
      :breadrumbs="breadcrumbs"
      :fluid="true"
      :isPadding="subcategories && subcategories.length > 0"
      class="pos-relative"
    >
      <div class="subcategories display-flex wrap" v-if="subcategories && subcategories.length>0">
        <v-btn
          :to="`/catalog/${rootCategory.slug}`"
          :title="rootCategory.name"
          color="white"
          class="subcategory-btn ma-0"
          text
        >все {{rootCategory.name}}</v-btn>
        <v-btn
          v-for="child in subcategories"
          :to="`/catalog/${child.slug}`"
          color="white"
          class="subcategory-btn ma-0"
          text
          :key="child.id"
          :title="child.name"
        >{{child.name}}</v-btn>
      </div>
    </page-header>
    <main
      class="background background-repeat"
      v-lazy:background-image="require('~/assets/img/bg.jpg')"
    >
      <v-container grid-list-lg id="contentWrapper" class="display-flex" fluid>
        <v-layout row wrap id="products" ref="product" class="mt-0">
          <v-flex xs12 class="hidden-md-and-up">
            <v-menu open-on-hover offset-y class="mb-4">
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" style="width: 100%">{{sort.title}}</v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, index) in sortItems"
                  :key="`sort-${index}`"
                  @click="sortChange(item)"
                >
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-flex>
          <v-flex xs12 class="hidden-md-and-up">
            <v-menu open-on-hover offset-y>
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" style="width: 100%">{{ !prodType ? "Все типы" : productType.name }}</v-btn>
              </template>
              <v-list>
                <v-list-item
                  @click="productTypeChange('all')"
                  :to="{ query: {}}"
                  :title="`Все типы`"
                  style="line-height: normal; font-size: 14px; min-height: 28px"
                  exact
                >Все</v-list-item>
                <v-list-item
                  @click="productTypeChange(productType)"
                  v-for="type in category.product_types"
                  :key="type.id"
                  :to="{ query: { type: type.slug }}"
                  style="line-height: normal; font-size: 14px; min-height: 28px"
                  exact
                  :title="type.name"
                >{{ type.name }}</v-list-item>
              </v-list>
            </v-menu>
          </v-flex>
          <v-flex xs12 class="hidden-md-and-up mb-3">
            <v-menu open-on-hover offset-y>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  style="width: 100%"
                >{{ !manuf ? "Все производители" : manufacturer.name }}</v-btn>
              </template>
              <v-list>
                <v-list-item
                  @click="manufacturerChange('all')"
                  :title="`Все ${category.name}`"
                  :to="`/catalog/${category.slug}`"
                  style="line-height: normal; font-size: 14px; min-height: 28px"
                  exact
                >Все</v-list-item>
                <v-list-item
                  v-for="manufacturer in manufacturers"
                  :key="manufacturer._id"
                  @click="manufacturerChange(manufacturer)"
                  :to="`/catalog/${category.slug}?manufacturer=${manufacturer.slug}`"
                  :title="`${category.name} ${manufacturer.name}`"
                  style="line-height: normal; font-size: 14px; min-height: 28px"
                  exact
                >{{ manufacturer.name }}</v-list-item>
              </v-list>
            </v-menu>
          </v-flex>

          <template v-if="products && products.length>0">
            <div class="flex xs12 sm6 md4 lg3 xl2" v-for="(product,index) in products" :key="index">
              <product-card :product="product" :to="`/catalog/${category.slug}/${product.slug}`"></product-card>
            </div>
          </template>

          <template v-else>
            <v-flex
              xs12
              sm6
              md4
              lg3
              xl2
              v-for="(product,index) in new Array(productsCount || 20)"
              :key="index"
            >
              <v-sheet>
                <v-skeleton-loader :boilerplate="!loading" class="mx-auto" type="card"></v-skeleton-loader>
              </v-sheet>
            </v-flex>
          </template>
          <client-only>
            <infinite-loading
              v-if="products && products.length >= 20"
              @infinite="onInfinite"
              ref="infiniteLoading"
              class="flex xs12"
            >
              <div slot="no-results"></div>
              <div slot="no-more"></div>
            </infinite-loading>
          </client-only>
        </v-layout>
        <div class="hidden-sm-and-down py-2 pl-4" style="display:flex">
          <div class style="width: 300px; min-width: 300px;">
            <sticky-menu>
              <v-menu open-on-hover offset-y>
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" style="width: 100%">{{sort.title}}</v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, index) in sortItems"
                    :key="`sort-${index}`"
                    @click="sortChange(item)"
                  >
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>

              <template v-if="category.product_types.length">
                <v-subheader class="pl-0">ВИДЫ</v-subheader>
                <v-sheet>
                  <v-list class="py-0">
                    <v-list-item
                      @click="productTypeChange('all')"
                      :to="`/catalog/${category.slug}`"
                      title="Все виды"
                      style="line-height: normal; font-size: 14px; min-height: 28px"
                      exact
                      nuxt
                    >Все виды</v-list-item>
                    <v-list-item
                      v-for="type in category.product_types"
                      :key="type._id"
                      @click="productTypeChange(type)"
                      :to="`/catalog/${category.slug}?type=${type.slug}`"
                      :title="type.name"
                      style="line-height: normal; font-size: 14px; min-height: 28px"
                      exact
                      nuxt
                    >{{type.name}}</v-list-item>
                    <!-- :to="{ query: { type: type.slug }}":input-value="false" -->
                  </v-list>
                </v-sheet>
              </template>
              <v-subheader class="pl-0">ПРОИЗВОДИТЕЛИ</v-subheader>
              <v-sheet>
                <v-list class="py-0">
                  <v-list-item
                    exact
                    @click="manufacturerChange('all')"
                    :to="`/catalog/${category.slug}`"
                    :title="`Все ${category.name}`"
                    style="line-height: normal; font-size: 14px; min-height: 28px"
                  >Все</v-list-item>
                  <!-- :to="{ query: {}}" -->
                  <v-list-item
                    v-for="manufacturer in manufacturers"
                    @click="manufacturerChange(manufacturer)"
                    :key="manufacturer._id"
                    :to="`/catalog/${category.slug}?manufacturer=${manufacturer.slug}`"
                    :title="`${category.name} ${manufacturer.name}`"
                    style="line-height: normal; font-size: 14px; min-height: 28px"
                    exact
                  >{{manufacturer.name}}</v-list-item>
                  <!-- :to="{ query: { manufacturer: manufacturer.slug }}" -->
                </v-list>
              </v-sheet>
            </sticky-menu>
          </div>
        </div>
      </v-container>
    </main>
    <section class="content-wrapper grey lighten-3">
      <v-container class="pt-10 pb-7">
        <v-row>
          <v-col
            cols="12"
            v-if="this.productType && this.productType.content"
            v-html="this.productType.content"
          ></v-col>
          <v-col cols="12" v-if="category.content" v-html="category.content"></v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>


<script>
import gql from "graphql-tag";
import InfiniteLoading from "vue-infinite-loading";
import PageHeader from "~/components/PageHeader";
import ProductCard from "~/components/ProductCard";
import StickyMenu from "~/components/StickyMenu";

export default {
  name: "category-main",
  components: { PageHeader, ProductCard, InfiniteLoading, StickyMenu },
  computed: {
    name() {
      if (this.manufacturer && this.manufacturer.name) {
        return `${this.category.name} ${this.manufacturer.name} оптом`;
      } else if (this.productType && this.productType.name) {
        return `${this.productType.name} оптом`;
      } else {
        return `${this.category.name} оптом`;
      }
      // return this.manufacturer && this.manufacturer.name
      //   ? `${this.category.name} ${this.manufacturer.name} оптом`
      //   : `${this.category.name} оптом`;
    },
    loading() {
      return !this.$route.params.slug && !this.products.length;
    },
    isParentCategory() {
      return (
        this.category.parent &&
        this.category.parent.length > 0 &&
        this.category.parent[0]
      );
    },
    subcategories() {
      return this.multiple
        ? this.category.children
        : this.isParentCategory &&
          this.category.parent[0].children &&
          this.category.parent[0].children.length > 0
        ? this.category.parent[0].children
        : [];
    },
    rootCategory() {
      return this.isParentCategory ? this.category.parent[0] : this.category;
    },
    multiple() {
      return this.category.children && this.category.children.length > 0;
    },
    categories() {
      return this.$store.getters.getParentCategories;
    },
    breadcrumbs() {
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
      if (this.isParentCategory && this.category.parent[0].name) {
        items.push({
          to: `/catalog/${this.category.parent[0].slug}`,
          text: this.category.parent[0].name,
        });
      }
      items.push({
        to: `/catalog/${this.category.slug}`,
        text: this.category.name,
      });
      this.$store.commit("breadcrumbs", items);
      return items;
    },
    manuf() {
      // console.log("manuf -> this.manufacturer", this.manufacturer);
      return this.manufacturer !== "all" && this.manufacturer
        ? this.manufacturer.id || this.manufacturer._id
        : null;
    },
    prodType() {
      return this.productType !== "all" &&
        this.productType &&
        this.productType._id
        ? this.productType._id
        : null;
    },
  },
  async asyncData(ctx) {
    const categoryFind = await ctx.store.getters.getCategory(
      ctx.params.category
    );
    if (!categoryFind) {
      return ctx.error({
        statusCode: 404,
        message: "Категория не найдена",
        type: "catalog",
      });
    }

    let products = [],
      category = await ctx.store.dispatch("fetchCategory", categoryFind.id),
      manufacturer = {},
      categoriesIds = [categoryFind.id],
      limit = 60,
      pageData = !!ctx.params.slug ? false : true;

    if (categoryFind.children && categoryFind.children.length > 0) {
      categoriesIds.push(...categoryFind.children.map((item) => item.id));
      limit = 80;
    }

    const productType =
      ctx.query.type &&
      (await ctx.store.dispatch(
        "fetchProductType",
        category.product_types.find((item) => item.slug === ctx.query.type)._id
      ));
    if (pageData) {
      manufacturer = ctx.store.getters.getManufacturer(ctx.query.manufacturer);
      // console.log("Data -> manufacturer", manufacturer);

      products = await ctx.store.dispatch("fetchProducts", {
        category: categoriesIds,
        limit: limit,
        manufacturer: manufacturer ? manufacturer.id : null,
        product_type: productType ? productType._id : null,
      });
    }

    return {
      products: products,
      productsCount: products && products.length ? products.length : 20,
      category: category,
      categoriesIds: categoriesIds,
      pageData: pageData,
      manufacturer: manufacturer || "all",
      manufacturers: category.manufacturers,
      productType: productType || "all",
      limit: limit,
    };
  },
  methods: {
    async sortChange(item) {
      if (this.sort.value !== item.value) {
        this.products = [];
        this.sort = item;
        this.products = await this.$store.dispatch("fetchProducts", {
          category: this.categoriesIds,
          limit: this.limit,
          manufacturer: this.manuf,
          sort: item.value,
          product_type: this.prodType,
        });
        this.productsCount = this.products.length;
      }
    },
    async productTypeChange(item) {
      // console.log("productTypeChange -> item", item);
      // console.log("productTypeChange -> this.productType", this.productType);
      this.manufacturer = "all";
      if (item === "all" && this.productType !== "all") {
        this.productType = "all";
        this.products = [];
        this.products = await this.$store.dispatch("fetchProducts", {
          category: this.categoriesIds,
          limit: this.limit,
          sort: this.sort.value,
        });
        this.productsCount = this.products.length;
        this.$vuetify.goTo("#contentWrapper");
      } else if (!this.productType || this.productType._id !== item._id) {
        this.productType = await this.$store.dispatch(
          "fetchProductType",
          item._id
        );
        // console.log("productTypeChange -> productType", this.productType);
        // console.log(
        //   "productTypeChange -> item",

        // );
        this.products = [];
        this.products = await this.$store.dispatch("fetchProducts", {
          category: this.categoriesIds,
          limit: this.limit,
          sort: this.sort.value,
          product_type: item._id,
        });
        this.productsCount = this.products.length;
        this.$vuetify.goTo("#contentWrapper");
      }
      // else {
      //   console.log("productTypeChange -> item", item);
      // }
    },
    async manufacturerChange(manufacturer) {
      this.productType = "all";
      if (manufacturer === "all" && this.manufacturer !== "all") {
        this.products = [];
        this.manufacturer = "all";
        this.products = await this.$store.dispatch("fetchProducts", {
          category: this.categoriesIds,
          limit: this.limit,
          manufacturer: null,
          sort: this.sort.value,
        });
        this.productsCount = this.products.length;
        this.$vuetify.goTo("#contentWrapper");
      } else if (
        !this.manufacturer ||
        manufacturer._id !== this.manufacturer._id
      ) {
        this.products = [];
        this.manufacturer = manufacturer;
        this.products = await this.$store.dispatch("fetchProducts", {
          category: this.categoriesIds,
          limit: this.limit,
          manufacturer: manufacturer._id,
          sort: this.sort.value,
        });
        this.productsCount = this.products.length;
        this.$vuetify.goTo("#contentWrapper");
      }
    },
    async handleClose() {
      if (!this.pageData) {
        const products = await this.$store.dispatch("fetchProducts", {
          category: this.categoriesIds,
          limit: this.limit,
          sort: this.sort.value,
        });
        // console.log("handleClose -> products", products.length);
        this.products = products;

        this.productsCount =
          this.products && this.products.length ? this.products.length : 0;
        this.pageData = true;
      }
    },
    async onInfinite($state) {
      console.log("onInfinite -> this.manuf", this.manuf);
      console.log("onInfinite -> onInfinite", this.prodType);

      const newProducts = await this.$store.dispatch("fetchProducts", {
        category: this.categoriesIds,
        start: this.products.length,
        manufacturer: this.manuf,
        product_type: this.prodType,
        sort: this.sort.value,
      });
      if (newProducts && newProducts.length) {
        this.products = [...this.products, ...newProducts];
        this.productsCount = this.products.length;
        $state.loaded();
      } else {
        $state.complete();
      }
    },
  },
  data() {
    const sortItems = [
      { title: "По алфавиту", value: "name:asc" },
      { title: "По популярности", value: "rating:desc" },
      { title: "Cначала дорогие", value: "priceNum:desc" },
      { title: "Cначала дешевые", value: "priceNum:asc" },
    ];
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      modal: false,
      sortItems: sortItems,
      sort: sortItems[0],
    };
  },
};
// async getProducts(params) {
//   let client = this.$apollo.getClient();
//   const vars = {
//     ...(params.manufacturer && {
//       manufacturer: params.manufacturer
//     }),
//     ...(params.product_type && {
//       product_type: params.product_type
//     }),
//     category: params.category,
//     sort: params.sort || "name:asc",
//     limit: params.limit || 20,
//     start: params.start || 0
//   };
//   const { data: productsData } = await client.query({
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
//             img {
//               url
//             }
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
//     variables: vars
//   });
//   return productsData.products;
// },
// async fetchProductsWithRetry(params, n = 3) {
//   // const getProducts = async () => {

//   //   // }
//   // };
//   try {
//     const products = await this.getProducts(params);
//     // if (products && products.length) {
//     //   console.log("products.length", products.length);
//     return products;
//     // }
//   } catch (error) {
//     console.log("fetchProducts -> error", error);
//     n -= 1;
//     console.log("fetchProducts -> n", n);
//     // this.app.$sentry.captureException(error)
//     // console.log("fetchProducts -> error", error)
//     // return []

//     if (n === 0) return null;
//     return await this.getProducts(params);
//   }
// },
</script>
<style lang="stylus" scoped>
#contentWrapper {
  min-height: 900px;
}

.subcategories {
  width: 100%;
  justify-content: center;

  .subcategory-btn {
    font-size: 0.7rem;
  }
}

@media (min-width: 960px) {
  .subcategories {
    .subcategory-btn {
      font-size: 0.9rem;
    }
  }
}
</style>
