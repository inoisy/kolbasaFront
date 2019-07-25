<template>
  <div>
    <page-header :title="category.name" :breadrumbs="breadcrumbs" :fluid="true" />
    <!-- {{pagesTotal}} -->
    <section class="background">
      <!-- v-lazy:background-image="require('~/assets/img/bg.jpg')" -->
      <v-container grid-list-lg class="py-5" fluid>
        <v-layout row wrap id="contentWrapper">
          <v-flex xs12 md8 lg9 xl10 style="min-height: 80vh">
            <v-layout row wrap id="products" ref="product" v-scroll="handleScroll">
              <div
                class="flex xs12 sm6 md4 lg3 xl2"
                data-aos="fade-up"
                v-for="(product,index) in products.items"
                :key="index"
              >
                <product-card :product="product" :category="category.slug"></product-card>
              </div>
            </v-layout>
          </v-flex>
          <v-flex hidden-sm-and-down md4 lg3 xl2>
            <sticky-menu>
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
        </v-layout>
      </v-container>
    </section>
    <section v-if="pagesTotal>1">
      <v-card class="pb-4">
        <v-card-text>
          <v-pagination
            @input="paginationInput"
            v-model="pageCurr"
            :length="pagesTotal"
            light
            class="justify-center align-center"
            style="display:flex"
          ></v-pagination>
        </v-card-text>
      </v-card>
    </section>
    <!-- {{category}} -->
    <!-- <div> -->
    <nuxt-child :key="$route.params && $route.params.slug ? $route.params.slug : ''" />
    <!-- </div> -->
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
import gql from "graphql-tag";
// import _ from "lodash";
import PageHeader from "~/components/PageHeader";
import StickyMenu from "~/components/StickyMenu";
import ProductCard from "~/components/ProductCard";

import { isArray } from "util";
export default {
  components: { PageHeader, StickyMenu, ProductCard },
  computed: {
    products() {
      return this.$store.state.sessionStorage.products;
    },
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
    // console.log(ctx.route.params);

    // console.log("TCL: Data -> queryManufacturers", queryManufacturers);
    await ctx.store.dispatch("fetchGeneralInfo");

    // let client = ctx.app.apolloProvider.defaultClient;

    const manufacturers =
      ctx.store.state.sessionStorage.generalInfo.manufacturers;
    // console.log(
    //   "manufacturerFilter",
    //   ctx.store.state.sessionStorage.manufacturerFilter
    // );
    // const storeManufacturers =
    //   ctx.store.state.sessionStorage.manufacturerFilter;
    // if (isArray(storeManufacturers)) {
    //   console.log("TCL: Data -> storeManufacturers", storeManufacturers);
    //   let manufacturersSelectedIds = [];

    //   for (let queryManufacurer of storeManufacturers) {
    //     manufacturersSelectedIds.push(
    //       manufacturers.find(item => item.id == queryManufacurer).slug
    //     );
    //   }
    //   const addObj = {
    //     manufacturer: manufacturersSelectedIds
    //   };
    //   ctx.router.push({
    //     path: ctx.route.path,
    //     query: { ...ctx.route.query, ...addObj }
    //   });
    // }
    // const manufacturers = ctx.store.state.sessionStorage.generalInfo.manufacturers;

    const queryManufacturers = ctx.route.query.manufacturer;
    // console.log("TCL: Data -> queryManufacturers", isArray(queryManufacturers));
    // const manufacturersSelected = queryManufacturer;
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
    const manufacturersExist =
      category.manufacturers && category.manufacturers.length > 0
        ? manufacturers.filter(item => category.manufacturers.includes(item.id))
        : [];
    return {
      category: category,
      manufacturers: manufacturersExist,
      manufacturersSelected: manufacturersSelectedIds
      // manufacturersModel: manufacturersModel
    };
  },
  methods: {
    throttledMethod(val) {
      console.log("TCL: val", val);
      // const that = this;
      // return _.throttle(() => {
      //   console.log("I get fired every two seconds!", that.$refs.products);
      // }, 300);
    },
    handleScroll() {
      return _.throttle(this.throttledMethod, 300);
    },

    async paginationInput(val) {},
    sortChange(val) {
      if (Number.isInteger(val)) {
        if (val === 1) {
          const addObj = {
            sort: "price"
          };
          this.$store.commit("sortFilter", addObj);
          this.$router.push({
            path: this.$route.path,
            query: { ...this.$route.query, ...addObj }
          });
        } else if (val === 0) {
          const addObj = {
            sort: "name"
          };
          this.$store.commit("sortFilter", addObj);
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
      if (val.length === 0) {
        await this.$store.dispatch("fetchProducts", {
          slug: this.$route.params.category
        });
        this.$store.commit("manufacturerFilter", {});
        let { manufacturer, ...query } = this.$route.query;
        this.$router.push({
          path: this.$route.path,
          query: query
        });
      } else {
        await this.$store.dispatch("fetchProducts", {
          slug: this.$route.params.category,
          manufacturer: val
        });
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
        this.$store.commit("manufacturerFilter", manufacturersSelectedIds);
        this.$router.push({
          path: this.$route.path,
          query: { ...this.$route.query, ...addObj }
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
      await this.$vuetify.goTo("#contentWrapper", {
        // offset: 100
      });

      await this.$store.dispatch("fetchProducts", {
        slug: this.$route.params.category,
        page: val
      });
      if (val > 1) {
        const addObj = {
          page: val
        };
        this.$router.push({
          path: this.$route.path,
          query: { ...this.$route.query, ...addObj }
        });
      } else {
        let { page, ...query } = this.$route.query;
        // console.log("TCL: paginationInput -> query", query);
        this.$router.push({
          path: this.$route.path,
          query: query
        });
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

