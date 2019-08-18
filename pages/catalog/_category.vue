<template>
  <div>
    <page-header :title="category.name" :breadrumbs="breadcrumbs" :fluid="true" />
    <!-- {{pagesTotal}} -->
    <section class="background">
      <!-- v-lazy:background-image="require('~/assets/img/bg.jpg')" -->
      <v-container grid-list-lg class="py-5" fluid>
        <div id="contentWrapper" class="display-flex">
          <v-flex style="min-height: 73vh" class="display-flex">
            <!-- {{products}} -->
            <v-layout
              row
              wrap
              id="products"
              ref="product"
              v-show="products.items && products.items.length>0"
            >
              <div
                class="flex xs12 sm6 md4 lg3 xl2"
                data-aos="fade-up"
                v-for="(product,index) in products.items"
                :key="index"
              >
                <product-card :product="product" :category="category.slug"></product-card>
              </div>
            </v-layout>
            <div v-show="$store.state.loading" class="ma-auto">
              <v-progress-circular
                v-if="$store.state.loading"
                :size="150"
                color="#95282a"
                indeterminate
                class="mx-auto my-5 d-flex"
              ></v-progress-circular>
            </div>
          </v-flex>
          <v-flex
            hidden-sm-and-down
            style="width: 300px; min-width: 300px; max-width: 300px; margin-left: auto;"
          >
            <sticky-menu class="px-3">
              <portal to="filters">
                <v-subheader class="pl-0">СОРТИРОВАТЬ ПО</v-subheader>
                <v-btn-toggle
                  class="mb-3"
                  v-model="sort"
                  @change="sortChange"
                  style="width: 100%"
                  mandatory
                >
                  <v-btn flat>Название</v-btn>
                  <v-btn flat>Цена</v-btn>
                </v-btn-toggle>
                <v-subheader class="pl-0" v-show="manufacturers.length>1">БРЕНД</v-subheader>
                <v-checkbox
                  v-show="manufacturers.length>1"
                  v-model="manufacturersSelected"
                  multiple
                  @change="manufacturerChange"
                  v-for="(checkbox) in manufacturers"
                  :label="checkbox.name"
                  :key="checkbox.id"
                  :value="checkbox.id"
                ></v-checkbox>
                <v-subheader class="pl-0 hidden-sm-and-down">КАТЕГОРИИ</v-subheader>
                <v-list
                  class="navigation pa-0 hidden-sm-and-down"
                  style="background-color:transparent !important"
                  color="transparent"
                >
                  <v-list-tile
                    v-for="(item,index) in categories"
                    :key="index"
                    :to="`/catalog/${item.slug}`"
                  >{{item.name}}</v-list-tile>
                </v-list>
              </portal>
              <portal-target name="filters" v-show="$vuetify.breakpoint.mdAndUp"></portal-target>
            </sticky-menu>
          </v-flex>
        </div>
      </v-container>
    </section>
    <section v-if="pagesTotal>1">
      <v-card class="pb-4">
        <v-card-text>
          <v-pagination
            color="accent"
            v-model="pageCurr"
            :length="pagesTotal"
            light
            class="justify-center align-center"
            style="display:flex"
          ></v-pagination>
        </v-card-text>
      </v-card>
    </section>
    <keep-alive>
      <nuxt-child :key="$route.params && $route.params.slug ? $route.params.slug : ''" />
    </keep-alive>
  </div>
</template>
<style lang="stylus">
.navigation {
  .v-list__tile--active {
    background-color: rgba(0, 0, 0, 0.1) !important;
  }
}
</style>

<script>
// import gql from "graphql-tag";
// import _ from "lodash";
import PageHeader from "~/components/PageHeader";
import StickyMenu from "~/components/StickyMenu";
import ProductCard from "~/components/ProductCard";

import { isArray } from "util";
export default {
  head() {
    return {
      title: this.category.title ? this.category.title : "",
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: "description",
          name: "description",
          content: this.category.description ? this.category.description : ""
        }
      ]
    };
  },
  components: { PageHeader, StickyMenu, ProductCard },
  computed: {
    // busket() {
    //   return this.$store.state.localStorage.basket;
    // },
    // products() {
    //   return this.$store.state.sessionStorage.products;
    // },
    categories() {
      return this.$store.state.sessionStorage.generalInfo.categories;
    },
    pagesTotal() {
      // console.log(Math.ceil(this.$store.state.sessionStorage.products.count / 20));
      return Math.ceil(this.$store.state.sessionStorage.products.count / 20);
    },
    // manufacturers() {
    //   return this.$store.state.sessionStorage.generalInfo.manufacturers;
    // },
    breadcrumbs() {
      return [
        {
          to: "/",
          text: "Главная"
        },
        {
          to: "/catalog",
          text: "Каталог"
        },
        {
          to: this.$route.path,
          text: this.category.name
        }
      ];
    }
  },
  async asyncData(ctx) {
    // console.log("TCL: Data -> asyncData");
    await ctx.store.dispatch("fetchGeneralInfo");

    const storeManufacturers =
      ctx.store.state.sessionStorage.manufacturerFilter;
    if (storeManufacturers && storeManufacturers.length > 0) {
      ctx.query = {
        manufacturer: storeManufacturers
      };
    }

    const manufacturers =
      ctx.store.state.sessionStorage.generalInfo.manufacturers;
    const queryManufacturers = ctx.route.query.manufacturer;
    let manufacturersSelectedIds = [];

    if (isArray(queryManufacturers)) {
      for (let queryManufacurer of queryManufacturers) {
        const finded = manufacturers.find(
          item => item.slug == queryManufacurer
        );
        if (finded) {
          manufacturersSelectedIds.push(finded.id);
        }
      }
    } else if (queryManufacturers) {
      const finded = manufacturers.find(
        item => item.slug == queryManufacturers
      );
      if (finded) {
        manufacturersSelectedIds.push(finded.id);
      }
    }
    const category = await ctx.store.dispatch("fetchCategory", {
      slug: ctx.route.params.category,
      manufacturer: manufacturersSelectedIds
      //   manufacturer && manufacturer.item ? manufacturer.item.id : null
    });
    // console.log("TCL: Data -> category", category);

    if (category) {
      const manufacturersExist =
        category.manufacturers && category.manufacturers.length > 0
          ? manufacturers.filter(item =>
              category.manufacturers.includes(item.id)
            )
          : [];

      let sort;
      if (ctx.route.query.sort && ctx.route.query.sort === "price") {
        sort = { sort: "price" };
      } else {
        sort = { sort: "name" };
      }

      await ctx.store.commit("sortFilter", sort);
      await ctx.store.commit("manufacturerFilter", manufacturersSelectedIds);
      await ctx.store.commit("pageFilter", ctx.route.query.page);
      const products = await ctx.store.dispatch("fetchProducts", {
        slug: ctx.route.params.category
        // manufacturer: manufacturersSelectedIds,
        // sort: ctx.route.query.sort,
        // page: ctx.route.query.page
      });

      return {
        products: products,
        category: category,
        manufacturers: manufacturersExist,
        manufacturersSelected: manufacturersSelectedIds
        // manufacturersModel: manufacturersModel
      };
    } else {
      return ctx.error({
        statusCode: 404,
        message: "Категория не найдена"
      });
    }
  },
  methods: {
    // handleScroll() {
    //   return _.throttle(this.throttledMethod, 300);
    // },

    async sortChange(val) {
      if (Number.isInteger(val)) {
        this.$vuetify.goTo("#contentWrapper");
        if (val === 1) {
          const addObj = {
            sort: "price"
          };
          await this.$store.commit("sortFilter", addObj);
          this.products = [];
          this.products = await this.$store.dispatch("fetchProducts", {
            slug: this.$route.params.category
            // manufacturer: this.$store.state.manufacturerFilter,
            // sort: "price"
          });

          await this.$router.push({
            path: this.$route.path,
            query: { ...this.$route.query, ...addObj }
          });
        } else if (val === 0) {
          const addObj = {
            sort: "name"
          };
          await this.$store.commit("sortFilter", addObj);
          this.products = [];
          this.products = await this.$store.dispatch("fetchProducts", {
            slug: this.$route.params.category
            // manufacturer: this.$store.state.manufacturerFilter,
            // sort: "name"
          });
        }
      }
      let { sort, ...query } = this.$route.query;
      this.$router.push({
        path: this.$route.path,
        query: query
      });
    },
    async manufacturerChange(val) {
      this.pageCurr = 1;
      this.$vuetify.goTo("#contentWrapper");
      if (val.length === 0) {
        await this.$store.commit("manufacturerFilter", {});
        let { manufacturer, ...query } = this.$route.query;
        await this.$router.push({
          path: this.$route.path,
          query: query
        });
        this.products = [];
        this.products = await this.$store.dispatch("fetchProducts", {
          slug: this.$route.params.category
          // page: this.$route.query.page,
          // sort: this.$route.query.sort
        });
      } else {
        const manufacturers = this.$store.state.sessionStorage.generalInfo
          .manufacturers;
        let manufacturersSelectedIds = [];

        for (let queryManufacurer of val) {
          const finded = manufacturers.find(
            item => item.id == queryManufacurer
          );
          if (finded && finded.slug) {
            manufacturersSelectedIds.push(finded.slug);
          }
        }
        const addObj = {
          manufacturer: manufacturersSelectedIds
        };
        await this.$store.commit("manufacturerFilter", val);
        await this.$router.push({
          path: this.$route.path,
          query: { ...this.$route.query, ...addObj }
        });
        this.products = [];
        this.products = await this.$store.dispatch("fetchProducts", {
          slug: this.$route.params.category
          // manufacturer: val,
          // page: this.$route.query.page,
          // sort: this.$route.query.sort
        });
      }

      // } else {
      //   const query = this.$route.query.sort
      //     ? { sort: this.$route.query.sort }
      //     : {};

      //   await this.$store.dispatch(
      //     "fetchCategory",
      //     this.$route.params.category
      //   );

      // }
    }
  },
  watch: {
    async pageCurr(val) {
      await this.$vuetify.goTo("#contentWrapper");
      await this.$store.commit("pageFilter", val);
      this.products = [];
      this.products = await this.$store.dispatch("fetchProducts", {
        slug: this.$route.params.category,
        // manufacturer: this.$route.query.manufacturer,
        // sort: this.$route.query.sort,
        page: val
      });

      if (val > 1) {
        const addObj = {
          page: val
        };
        await this.$router.push({
          path: this.$route.path,
          query: { ...this.$route.query, ...addObj }
        });
      } else {
        let { page, ...query } = this.$route.query;
        // let { manufacturer, ...query } = this.$route.query;
        // await this.$store.dispatch("fetchProducts", {
        //   slug: this.$route.params.category,
        //   manufacturer: val
        // });
        await this.$router.push({
          path: this.$route.path,
          query: query
        });
        // this.$router.push({
        //   path: this.$route.path,
        //   query:{
        //     ...this.$route.query,
        //     query
        //   }
        // });
      }
      //   console.log("TCL: pageCurr -> val", val);
    }
    //   async manufacturersSelected(val) {
    //     const ids = val;
    //     await this.$store.dispatch(
    //       "fetchCategory",
    //       this.$route.params.category,
    //       ids
    //     );
    //     // console.log("TCL: manufacturerSelected -> val", val);
    //   }
  },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      modal: false,
      sort: 0,
      pageCurr: 1
      // pagesTotal: 2
      // manufacturersSelected: []
    };
  }
};
</script>

