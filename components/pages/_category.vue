<template>
  <div>
    <nuxt-child @close="handleClose" />
    <LazyHydrate when-idle>
      <page-header
        :title="name"
        :breadrumbs="breadcrumbs"
        :fluid="true"
        :isPadding="subcategories && subcategories.length > 0"
        class="pos-relative"
      >
        <div
          class="subcategories display-flex wrap"
          v-if="subcategories && subcategories.length > 0"
        >
          <v-btn
            v-for="child in subcategories"
            :to="`/catalog/${child.slug}`"
            color="white"
            class="subcategory-btn ma-0"
            text
            :key="child.id"
            :title="child.name"
            >{{ child.name }}</v-btn
          >
        </div>
      </page-header>
    </LazyHydrate>
    <div :class="$style.categoryWrapper" id="contentWrapper">
      <div :class="$style.container">
        <div :class="$style.products">
          <template v-if="products && products.length > 0">
            <div
              class="flex xs12 sm6 md4 lg3 xl2 pa-2"
              v-for="(product, index) in products"
              :key="`${product.id}-${index}-${product.v || 0}`"
            >
              <product-card
                :product="product"
                :to="`/catalog/${category.slug}/${product.slug}`"
              ></product-card>
            </div>
          </template>
          <!-- <client-only>
            <infinite-loading
              v-if="products && products.length >= 20"
              @infinite="onInfinite"
              ref="infiniteLoading"
              class="flex xs12"
            >
              <div slot="no-results"></div>
              <div slot="no-more"></div>
            </infinite-loading>
          </client-only> -->
        </div>

        <div :class="$style.filters">
          <v-btn
            @click="showSort = !showSort"
            id="sort"
            style="position: relative"
          >
            <v-icon left dark>{{ sortIcon }}</v-icon>
            {{ sort.title }}</v-btn
          >
          <v-menu
            v-model="showSort"
            attach="#sort"
            bottom
            absolute
            :content-class="$style.sortMenu"
          >
            <!-- <template v-slot:activator="{ on }">offset-y
              <v-btn v-on="on" style="width: 100%">{{ sort.title }}</v-btn>
            </template> -->
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
            <v-chip-group
              v-model="productTypeSelected"
              :column="!isMobile"
              mandatory
            >
              <v-chip
                value="all"
                color="#f5f5f5"
                exact-active-class="chipSelected"
                exact
                label
                @click="productTypeChange('all')"
                :to="`/catalog/${category.slug}`"
                >Все виды</v-chip
              >
              <v-chip
                v-for="type in category.product_types"
                :key="type._id"
                :value="type._id"
                color="#f5f5f5"
                exact-active-class="chipSelected"
                exact
                label
                @click="productTypeChange(type)"
                :to="`/catalog/${category.slug}?type=${type.slug}`"
              >
                <span class="d-inline-block text-truncate">
                  {{ type.name }}
                </span>
              </v-chip>
            </v-chip-group>
          </template>

          <v-subheader class="pl-0">ПРОИЗВОДИТЕЛИ</v-subheader>
          <v-chip-group
            v-model="productTypeSelected"
            :column="!isMobile"
            mandatory
          >
            <v-chip
              value="all"
              label
              color="#f5f5f5"
              exact-active-class="chipSelected"
              @click="manufacturerChange('all')"
              :to="`/catalog/${category.slug}`"
              exact
            >
              Все производители
            </v-chip>
            <v-chip
              v-for="manufacturer in manufacturers"
              :key="manufacturer._id"
              :value="manufacturer._id"
              color="#f5f5f5"
              exact-active-class="chipSelected"
              exact
              label
              @click="manufacturerChange(manufacturer)"
              :to="`/catalog/${category.slug}?manufacturer=${manufacturer.slug}`"
            >
              <span class="d-inline-block text-truncate">
                {{ manufacturer.name }}
              </span>
            </v-chip>
          </v-chip-group>
        </div>
      </div>
    </div>
    <section class="content-wrapper grey lighten-3" v-if="content">
      <v-container class="pt-10 pb-7">
        <v-row>
          <v-col cols="12">
            <!-- {{ content }} -->
            <LazyHydrate never>
              <content-wrapper v-html="content" />
            </LazyHydrate>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </div>
</template>
<style lang="scss" scoped module>
.sortMenu {
  top: 36px;
  text-transform: none;
}
.categorySelected {
  color: #ffffff !important;
  caret-color: #ffffff !important;
  // background-color: rgba($white, 0.5) !important;
}
.categoryWrapper {
  // @include bg(url(/bg.jpg));
  background-color: rgb(240, 240, 240);
  background-repeat: repeat !important;
  background-size: 100% !important;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url(/bg.jpg);
  .container {
    width: 100%;
    padding: 25px 20px;
    margin: 0 auto;
    display: flex;
    flex-direction: column-reverse;
    @include md {
      flex-direction: row;
    }
    .filters {
      padding: 8px;
      width: 100%;
      @include md {
        width: 250px;
        flex: 0 0 250px;
      }
      @include md {
        width: 300px;
        flex: 0 0 300px;
      }
    }
    .products {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
    }
  }
}
</style>

<script>
// import gql from "graphql-tag";
import LazyHydrate from "vue-lazy-hydration";
import InfiniteLoading from "vue-infinite-loading";

import { mdiSortVariant } from "@mdi/js";
// import PageHeader from "~/components/PageHeader";
// import ProductCard from "~/components/ProductCard";
// import StickyMenu from "~/components/StickyMenu";

export default {
  name: "category-main",
  head() {
    return {
      title: "pageName",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "dsads",
        },
      ],
    };
  },
  components: { LazyHydrate, InfiniteLoading },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.xs;
    },
    content() {
      // let content = "";
      // if (this.productType && this.productType.content) {
      //   content += this.productType.content;
      // }
      // content += this.category.content;
      return this.productType && this.productType.content
        ? this.productType.content.concat(this.category.content)
        : this.category.content;
    },
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
      // console.log("wtfcommit");
      // this.$store.commit("breadcrumbs", items);
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
      // productsCount: products && products.length ? products.length : 20,
      category: category,
      categoriesIds: categoriesIds,
      pageData: pageData,
      manufacturer: manufacturer || "all",
      manufacturers: category.manufacturers,
      productType: productType || "all",
      limit: limit,
      productTypeSelected: productType || "all",
    };
  },
  methods: {
    async productTypeHandle() {
      console.log("🚀 ~  productTypeHandle");
    },
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
        // this.productsCount = this.products.length;
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
        // this.productsCount = this.products.length;
        this.$vuetify.goTo("#contentWrapper");
      } else if (!this.productType || this.productType._id !== item._id) {
        this.productType = await this.$store.dispatch(
          "fetchProductType",
          item._id
        );
        this.products = [];
        this.products = await this.$store.dispatch("fetchProducts", {
          category: this.categoriesIds,
          limit: this.limit,
          sort: this.sort.value,
          product_type: item._id,
        });
        // this.productsCount = this.products.length;
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
        // this.productsCount = this.products.length;
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
        // this.productsCount = this.products.length;
        this.$vuetify.goTo("#contentWrapper");
      }
    },
    async handleClose(id) {
      console.log("handleClose -> products", id);
      const find = this.products.find((item) => item.id === id);
      if (find) {
        find.v = (find.v || 0) + 1;
        console.log("new version of product ", id, find.v);
        // console.log(
        //   "🚀 ~ file: _category.vue ~ line 479 ~ handleClose ~ find.v",
        //   find.v
        // );
      }
      // console.log(
      //   "🚀 ~ file: _category.vue ~ line 477 ~ handleClose ~ find",
      //   find
      // );
      if (!this.pageData) {
        // const products =
        this.products = await this.$store.dispatch("fetchProducts", {
          category: this.categoriesIds,
          limit: this.limit,
          sort: this.sort.value,
        });

        // this.productsCount =
        //   this.products && this.products.length ? this.products.length : 0;
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
        // this.productsCount = this.products.length;
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
      sortIcon: mdiSortVariant,
      showSort: false,
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
<style lang="scss" scoped>
.chipSelected {
  background-color: #252525 !important;
  color: #f5f5f5 !important;
}
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
