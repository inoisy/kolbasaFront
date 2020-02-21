<template>
  <div>
    <nuxt-child @close="handleClose" />
    <page-header
      :title="`${category.name} оптом`"
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
        <template class="child" v-for="child in subcategories">
          <v-btn
            :to="`/catalog/${child.slug}`"
            color="white"
            class="subcategory-btn ma-0"
            text
            :key="child.id"
            :title="child.name"
          >{{child.name}}</v-btn>
        </template>
      </div>
    </page-header>
    <section
      class="background background-repeat"
      v-lazy:background-image="require('~/assets/img/bg.jpg')"
    >
      <!-- {{loading}} -->
      <v-container grid-list-lg id="contentWrapper" class="display-flex py-9" fluid>
        <v-layout row wrap id="products" ref="product" class="mt-0" v-if="pageData">
          <div class="flex xs12 sm6 md4 lg3 xl2" v-for="(product,index) in products" :key="index">
            <product-card :product="product" :to="`/catalog/${category.slug}/${product.slug}`"></product-card>
          </div>
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
        <v-layout v-else row wrap id="products" ref="product">
          <v-flex xs12 sm6 md4 lg3 xl2 v-for="(product,index) in new Array(20)" :key="index">
            <v-sheet>
              <v-skeleton-loader :boilerplate="!loading" class="mx-auto" type="card"></v-skeleton-loader>
            </v-sheet>
          </v-flex>
        </v-layout>
        <div
          class="flex hidden-sm-and-down"
          style="width: 300px; min-width: 300px; max-width: 300px; margin-left: auto;"
        >
          <sticky-menu class="px-3 pb-1">
            <v-subheader class="pl-0 hidden-sm-and-down">КАТЕГОРИИ</v-subheader>
            <v-card>
              <v-list
                class="navigation pa-0 hidden-sm-and-down"
                style="background-color:transparent !important"
                color="transparent"
              >
                <template v-for="(category,index) in categories">
                  <div
                    :key="'list-group'+index"
                    v-if="category && category.children && category.children.length > 0"
                  >
                    <v-list-group :key="category.slug" class="aside-nav">
                      <v-list-item
                        slot="activator"
                        :to="`/catalog/${category.slug}`"
                        :title="category.name"
                        height="36px"
                      >
                        <v-list-item-content>{{ category.name}}</v-list-item-content>
                      </v-list-item>
                      <v-list-item
                        height="36px"
                        v-for="child in category.children"
                        :key="child.id"
                        :to="`/catalog/${child.slug}`"
                        :title="child.name"
                      >
                        <v-list-item-content
                          class="pl-9"
                          style="line-height: 100% !important"
                        >{{child.name}}</v-list-item-content>
                      </v-list-item>
                    </v-list-group>
                  </div>
                  <v-list-item
                    :title="category.name"
                    :key="index"
                    v-else
                    :to="`/catalog/${category.slug}`"
                    height="36px"
                  >
                    <span style="line-height: 100% !important">{{category.name}}</span>
                  </v-list-item>
                </template>
              </v-list>
            </v-card>
          </sticky-menu>
        </div>
      </v-container>
    </section>

    <section v-if="category.content" class="content-wrapper grey lighten-3">
      <v-container v-html="$md.render(category.content)" class="py-9"></v-container>
    </section>
  </div>
</template>


<script>
import InfiniteLoading from "vue-infinite-loading";
import PageHeader from "~/components/PageHeader";
import StickyMenu from "~/components/StickyMenu";
import ProductCard from "~/components/ProductCard";

import { isArray } from "util";
export default {
  components: { PageHeader, StickyMenu, ProductCard, InfiniteLoading },
  computed: {
    loading() {
      return this.$store.state.sessionStorage.loading;
    },
    isParentCategory() {
      return (
        this.category &&
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
      return this.isParentCategory
        ? this.category.parent[0]
        : this.category
        ? this.category
        : {};
    },
    multiple() {
      return (
        this.category &&
        this.category.children &&
        this.category.children.length > 0
      );
    },
    categories() {
      return this.$store.state.sessionStorage.generalInfo.categories.filter(
        item => item.parent.length === 0
      );
    },
    breadcrumbs() {
      let base = [
        {
          to: "/",
          text: "Главная"
        },
        {
          to: "/catalog",
          text: "Каталог"
        }
      ];
      if (this.isParentCategory) {
        base.push({
          to: `/catalog/${this.category.parent[0].slug}`,
          text: this.category.parent[0].name
        });
      }
      base.push({
        to: this.$route.path,
        text: this.category.name
      });
      return base;
    }
  },
  async asyncData(ctx) {
    const generalData = await ctx.store.dispatch("fetchGeneralInfo");
    const categoryFind = generalData.categories.find(
      item => item.slug === ctx.params.category
    );
    if (!categoryFind) {
      return ctx.error({
        statusCode: 404,
        message: "Категория не найдена"
      });
    }
    let products = [],
      category = {},
      categoriesIds = [categoryFind.id],
      limit = 20;
    if (categoryFind.children && categoryFind.children.length > 0) {
      categoriesIds.push(...categoryFind.children.map(item => item.id));
      limit = ctx.params.slug ? 60 : 20;
    }
    if (ctx.params.slug) {
      return {
        products: products,
        category: categoryFind,
        categoriesIds: categoriesIds,
        pageData: false
      };
    }
    // const manufacturerFind = ctx.query.manufacturer
    //   ? generalData.manufacturers.find(
    //       item => item.slug === ctx.query.manufacturer
    //     )
    //   : null;

    category = await ctx.store.dispatch("fetchCategory", categoryFind.id);
    products = await ctx.store.dispatch("fetchProducts", {
      category: categoriesIds,
      limit: limit,
      manufacturer: ctx.store.getters.getManufacturerId(ctx.query.manufacturer)
    });
    return {
      products: products,
      category: category,
      categoriesIds: categoriesIds,
      pageData: true
    };
  },
  methods: {
    async handleClose() {
      // console.log("TCL: handleClose -> handleClose");
      if (!this.pageData) {
        this.category = await this.$store.dispatch(
          "fetchCategory",
          this.category.id
        );
        const products = await this.$store.dispatch("fetchProducts", {
          category: this.categoriesIds,
          limit: this.limit
        });
        this.products = products;
        this.pageData = true;
      }
    },
    async onInfinite($state) {
      const newProducts = await this.$store.dispatch("fetchProducts", {
        category: this.categoriesIds,
        start: this.products.length,
        manufacturer: this.$store.getters.getManufacturerId(
          this.$route.query.manufacturer
        )
      });
      if (newProducts && newProducts.length) {
        this.products = [...this.products, ...newProducts];
        $state.loaded();
      } else {
        $state.complete();
      }
    }
  },

  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      modal: false
    };
  }
};
</script>
<style lang="stylus" scoped>
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
