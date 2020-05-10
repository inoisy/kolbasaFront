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
          <v-flex xs12 class="hidden-md-and-up mb-3">
            <v-menu open-on-hover offset-y>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  style="width: 100%"
                >{{manufacturer === "all" || !manufacturer || !manufacturer.name ? "Все производители" : manufacturer.name }}</v-btn>
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
                  :key="manufacturer.id"
                  @click="manufacturerChange(manufacturer)"
                  :to="`/catalog/${category.slug}?manufacturer=${manufacturer.slug}`"
                  :title="`${category.name} ${manufacturer.name}`"
                  style="line-height: normal; font-size: 14px; min-height: 28px"
                  exact
                >{{ manufacturer.name }}</v-list-item>
              </v-list>
            </v-menu>
          </v-flex>
          <template v-if="products.length>0">
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
              v-for="(product,index) in new Array(productsCount)"
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
        <div class="hidden-sm-and-down py-2 pl-4" style="width: 300px; min-width: 300px;">
          <div id="sidebarContent">
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
                <v-list-item
                  v-for="manufacturer in manufacturers"
                  :key="manufacturer.id"
                  @click="manufacturerChange(manufacturer)"
                  :to="`/catalog/${category.slug}?manufacturer=${manufacturer.slug}`"
                  :title="`${category.name} ${manufacturer.name}`"
                  style="line-height: normal; font-size: 14px; min-height: 28px"
                  exact
                >{{manufacturer.name}}</v-list-item>
              </v-list>
            </v-sheet>
          </div>
        </div>
      </v-container>
    </main>
    <section v-if="category.content" class="content-wrapper grey lighten-3">
      <v-container v-html="$md.render(category.content)" class="py-9"></v-container>
    </section>
  </div>
</template>


<script>
import InfiniteLoading from "vue-infinite-loading";
import PageHeader from "~/components/PageHeader";
// import StickyMenu from "~/components/StickyMenu";
import ProductCard from "~/components/ProductCard";

export default {
  name: "category-main",
  components: { PageHeader, ProductCard, InfiniteLoading },
  computed: {
    name() {
      return this.manufacturer && this.manufacturer.name
        ? `${this.category.name} ${this.manufacturer.name} оптом`
        : `${this.category.name} оптом`;
    },
    loading() {
      if (process.browser) {
        return window.$nuxt.$root.$loading.show;
      } else {
        return false;
      }
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
          text: "Главная"
        },
        {
          to: "/catalog",
          text: "Каталог"
        }
      ];
      if (this.isParentCategory && this.category.parent[0].name) {
        items.push({
          to: `/catalog/${this.category.parent[0].slug}`,
          text: this.category.parent[0].name
        });
      }
      items.push({
        to: `/catalog/${this.category.slug}`,
        text: this.category.name
      });
      this.$store.commit("breadcrumbs", items);
      return items;
    }
  },
  async asyncData(ctx) {
    const categoryFind = await ctx.store.getters.getCategory(
      ctx.params.category
    );
    if (!categoryFind) {
      return ctx.error({
        statusCode: 404,
        message: "Категория не найдена",
        type: "catalog"
      });
    }

    let products = [],
      category = await ctx.store.dispatch("fetchCategory", categoryFind.id),
      manufacturer = {},
      categoriesIds = [categoryFind.id],
      limit = 40,
      pageData = !!ctx.params.slug ? false : true;

    if (categoryFind.children && categoryFind.children.length > 0) {
      categoriesIds.push(...categoryFind.children.map(item => item.id));
      limit = 80;
    }

    if (pageData) {
      manufacturer = ctx.store.getters.getManufacturer(ctx.query.manufacturer);
      products = await ctx.store.dispatch("fetchProducts", {
        category: categoriesIds,
        limit: limit,
        manufacturer: manufacturer ? manufacturer.id : null
      });
    }

    return {
      products: products,
      productsCount: products.length,
      category: category,
      categoriesIds: categoriesIds,
      pageData: pageData,
      manufacturer: manufacturer,
      manufacturers: category.manufacturers.sort((a, b) =>
        a.name > b.name ? 1 : -1
      )
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
          manufacturer: this.manufacturer ? this.manufacturer.id : null,
          sort: item.value
        });
        this.productsCount = this.products.length;
      }
    },
    async manufacturerChange(manufacturer) {
      if (manufacturer === "all" && this.manufacturer !== "all") {
        this.products = [];
        this.manufacturer = "all";
        this.products = await this.$store.dispatch("fetchProducts", {
          category: this.categoriesIds,
          limit: this.limit,
          manufacturer: null,
          sort: this.sort.value
        });
        this.productsCount = this.products.length;
        this.$vuetify.goTo("#contentWrapper");
      } else if (
        !this.manufacturer ||
        manufacturer.id !== this.manufacturer.id
      ) {
        this.products = [];
        this.manufacturer = manufacturer;
        this.products = await this.$store.dispatch("fetchProducts", {
          category: this.categoriesIds,
          limit: this.limit,
          manufacturer: manufacturer.id,
          sort: this.sort.value
        });
        this.productsCount = this.products.length;
        this.$vuetify.goTo("#contentWrapper");
      }
    },
    async handleClose() {
      if (this.manufacturer) {
        this.$router.push({
          path: `/catalog/${this.category.slug}`,
          query: {
            manufacturer: this.manufacturer.slug
          }
        });
      }

      if (!this.pageData) {
        this.category = await this.$store.dispatch(
          "fetchCategory",
          this.category.id
        );
        const products = await this.$store.dispatch("fetchProducts", {
          category: this.categoriesIds,
          limit: this.limit,
          sort: this.sort.value
        });
        this.products = products;
        this.productsCount = this.products.length;
        this.pageData = true;
      }
    },
    async onInfinite($state) {
      const newProducts = await this.$store.dispatch("fetchProducts", {
        category: this.categoriesIds,
        start: this.products.length,
        manufacturer: this.manufacturer ? this.manufacturer.id : null,
        sort: this.sort.value
      });
      if (newProducts && newProducts.length) {
        this.products = [...this.products, ...newProducts];
        this.productsCount = this.products.length;
        $state.loaded();
      } else {
        $state.complete();
      }
    }
  },
  data() {
    const sortItems = [
      { title: "По алфавиту", value: "name:asc" },
      { title: "Cначала дорогие", value: "priceNum:desc" },
      { title: "Cначала дешевые", value: "priceNum:asc" }
    ];
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      modal: false,
      sortItems: sortItems,
      sort: sortItems[0]
    };
  }
};
</script>
<style lang="stylus" scoped>
#sidebarContent {
  position: sticky;
  top: 80px;
}

#contentWrapper {
  min-height: 100vh;
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
