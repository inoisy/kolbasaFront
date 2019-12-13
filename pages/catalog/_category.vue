<template>
  <div>
    <!-- <keep-alive> -->
    <nuxt-child />
    <!-- </keep-alive> -->
    <!-- :key="$route.params && $route.params.slug ? $route.params.slug : ''"  -->
    <page-header
      :title="`${category.name} оптом`"
      :breadrumbs="breadcrumbs"
      :fluid="true"
      :isPadding="subcategories && subcategories.length > 0"
      class="pos-relative"
    >
      <div
        class="subcategories display-flex wrap"
        style="bottom: 0; position: absolute;"
        v-if="subcategories && subcategories.length>0"
      >
        <!-- <v-btn-toggle v-model="toggle_exclusive" color="tranparent"> -->
        <v-btn
          :to="`/catalog/${rootCategory.slug}`"
          large
          color="white"
          class="ma-0"
          flat
          style="font-size: 0.9rem !important;"
        >все {{rootCategory.name}}</v-btn>
        <template class="child" v-for="child in subcategories">
          <v-btn
            :to="`/catalog/${child.slug}`"
            color="white"
            large
            class="ma-0"
            style="font-size: 0.9rem !important;"
            flat
            :key="child.id"
          >{{child.name}}</v-btn>
        </template>
        <!-- </v-btn-toggle> -->
      </div>
    </page-header>
    <!-- {{pagesTotal}} -->
    <section class="background">
      <!-- v-lazy:background-image="require('~/assets/img/bg.jpg')" -->
      <v-container grid-list-lg class="py-5" fluid>
        <div id="contentWrapper" class="display-flex">
          <v-flex style="min-height: 73vh">
            <!-- {{products}} -->
            <v-layout row wrap id="products" ref="product" v-if="products && products.length>0">
              <div
                class="flex xs12 sm6 md4 lg3 xl2"
                data-aos="fade-up"
                v-for="(product,index) in products"
                :key="index"
              >
                <product-card :product="product" :to="`/catalog/${category.slug}/${product.slug}`"></product-card>
              </div>
            </v-layout>
            <v-layout v-else-if="multiple" wrap>
              <div
                class="flex xs12 mb-4"
                v-for="(productsGroup,index) in products"
                :key="'prGr'+index"
              >
                <nuxt-link
                  :to="`/catalog/${productsGroup.slug}`"
                  class="lumber font-weight-medium mb-4 d-inline-block primary--text underline-on-hover"
                  style="font-size: 2rem;"
                >{{productsGroup.name}}</nuxt-link>
                <v-layout wrap class="mb-3">
                  <div
                    class="flex xs12 sm6 md4 lg3 xl2"
                    data-aos="fade-up"
                    v-for="(product,prIndex) in productsGroup.items"
                    :key="prIndex"
                  >
                    <product-card
                      :product="product"
                      :to="`/catalog/${category.slug}/${product.slug}`"
                    ></product-card>
                  </div>
                </v-layout>
              </div>

              <v-layout
                wrap
                v-if="category.products && category.products.items && category.products.items.length > 0"
              >
                <h2 class="flex xs12">Остальные {{category.name}}</h2>
                <div
                  class="flex xs12 sm6 md4 lg3 xl2"
                  data-aos="fade-up"
                  v-for="(product,prIndex) in category.products.items"
                  :key="prIndex"
                >
                  <product-card
                    :product="product"
                    :to="`/catalog/${category.slug}/${product.slug}`"
                  ></product-card>
                </div>
              </v-layout>
            </v-layout>
            <div v-else class="ma-auto">
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
                <v-subheader v-show="!multiple" class="pl-0">СОРТИРОВАТЬ ПО</v-subheader>
                <v-btn-toggle
                  class="mb-2"
                  v-model="sort"
                  @change="sortChange"
                  style="width: 100%"
                  mandatory
                  v-show="!multiple"
                >
                  <v-btn flat>Название</v-btn>
                  <v-btn flat>Цена</v-btn>
                </v-btn-toggle>
                <v-subheader class="pl-0" v-show="!multiple && manufacturers.length>1">БРЕНД</v-subheader>
                <v-radio-group
                  :value="manufacturersSelected"
                  :mandatory="false"
                  @change="onManufacturerChange"
                  class="mt-0 mb-2"
                  hide-details
                >
                  <v-radio
                    v-for="(checkbox) in manufacturers"
                    :label="checkbox.name"
                    :key="checkbox.id"
                    :value="checkbox.slug"
                  ></v-radio>
                </v-radio-group>

                <!-- <v-checkbox
                  v-show="!multiple && manufacturers.length>1"
                  v-model="manufacturersSelected"
                  multiple
                  @change="manufacturerChange"
                  v-for="(checkbox) in manufacturers"
                  :label="checkbox.name"
                  :key="checkbox.id"
                  :value="checkbox.id"
                  height="0px"
                ></v-checkbox>-->
                <v-subheader class="pl-0 hidden-sm-and-down">КАТЕГОРИИ</v-subheader>
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
                      <v-list-group :key="category.slug">
                        <v-list-tile
                          slot="activator"
                          :to="`/catalog/${category.slug}`"
                          height="36px"
                        >
                          <v-list-tile-content>{{ category.name}}</v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile
                          height="36px"
                          v-for="child in category.children"
                          :key="child.id"
                          :to="`/catalog/${child.slug}`"
                        >
                          <span class="pl-4" style="line-height: 100% !important">{{child.name}}</span>
                        </v-list-tile>
                      </v-list-group>
                    </div>
                    <v-list-tile
                      :key="index"
                      v-else
                      :to="`/catalog/${category.slug}`"
                      height="36px"
                    >
                      <span style="line-height: 100% !important">{{category.name}}</span>
                    </v-list-tile>
                  </template>
                </v-list>
              </portal>
              <portal-target name="filters" v-show="$vuetify.breakpoint.mdAndUp"></portal-target>
            </sticky-menu>
          </v-flex>
        </div>
      </v-container>
    </section>
    <no-ssr>
      <infinite-loading
        v-if="!multiple && products.length >= 20"
        @infinite="onInfinite"
        ref="infiniteLoading"
      >
        <div slot="no-results"></div>
        <div slot="no-more"></div>
      </infinite-loading>
    </no-ssr>

    <!-- <section v-if="pagesTotal>1 && !multiple">
      <v-card :class="!category.content ? 'pb-5' : ''">
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
    </section>-->
    <section v-if="category.content" class="grey lighten-3">
      <v-container v-html="$md.render(category.content)" class="py-5"></v-container>
    </section>
  </div>
</template>
<style lang="stylus">
.navigation {
  .v-list__tile--active {
    background-color: rgba(0, 0, 0, 0.1) !important;
  }
}

.subcategories {
  width: 100%;
  justify-content: center;
}

@media (min-width: 960px) {
}
</style>

<script>
import InfiniteLoading from "vue-infinite-loading";

// import gql from "graphql-tag";
// import _ from "lodash";
import PageHeader from "~/components/PageHeader";
import StickyMenu from "~/components/StickyMenu";
import ProductCard from "~/components/ProductCard";

import { isArray } from "util";
export default {
  components: { PageHeader, StickyMenu, ProductCard, InfiniteLoading },
  computed: {
    // products() {
    //   return this.$store.state.sessionStorage.easyProducts;
    // },
    subcategories() {
      return this.category &&
        this.category.children &&
        this.category.children.length > 0
        ? this.category.children
        : this.category &&
          this.category.parent &&
          this.category.parent.length > 0 &&
          this.category.parent[0].children.length > 0
        ? this.category.parent[0].children
        : [];
    },
    rootCategory() {
      return this.category &&
        this.category.parent &&
        this.category.parent.length > 0 &&
        this.category.parent[0]
        ? this.category.parent[0]
        : this.category
        ? this.category
        : {};
    },
    // busket() {
    //   return this.$store.state.localStorage.basket;
    // },
    // products() {
    //   return this.$store.state.sessionStorage.products;
    // },
    multiple() {
      return !Array.isArray(this.products);
    },
    categories() {
      return this.$store.state.sessionStorage.generalInfo.categories.filter(
        item => item.parent.length === 0
      );
    },
    pagesTotal() {
      // console.log(Math.ceil(this.$store.state.sessionStorage.products.count / 20));
      return Math.ceil(this.$store.state.sessionStorage.products.count / 20);
    },
    // manufacturers() {
    //   return this.$store.state.sessionStorage.generalInfo.manufacturers;
    // },
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
      if (
        this.category.parent &&
        this.category.parent.length > 0 &&
        this.category.parent[0]
      ) {
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
  async mounted(ctx) {
    await this.$store.commit("pageFilter", 1);
  },
  async asyncData(ctx) {
    await ctx.store.dispatch("fetchGeneralInfo");

    // await ctx.store.commit("pageFilter", 1);
    const storeManufacturers =
      ctx.store.state.sessionStorage.manufacturerFilter;
    if (storeManufacturers && storeManufacturers.length > 0) {
      ctx.query = {
        manufacturer: storeManufacturers
      };
    }
    // let manufacturersSelectedIds = [];
    const manufacturers =
      ctx.store.state.sessionStorage.generalInfo.manufacturers;
    // const queryManufacturer = ctx.route.query.manufacturer;
    // if(queryManufacturer){
    //  const finded = manufacturers.find(
    //   item => item.slug == queryManufacturers
    // );
    //         if (finded) {
    //     manufacturersSelectedId= finded.id;
    //   }
    // }

    // const queryManufacturers = ctx.route.query.manufacturer;
    let manufacturersSelected = ctx.route.query.manufacturer;

    // if (isArray(queryManufacturers)) {
    //   for (let queryManufacurer of queryManufacturers) {
    //     const finded = manufacturers.find(
    //       item => item.slug == queryManufacurer
    //     );
    //     if (finded) {
    //       manufacturersSelectedIds.push(finded.id);
    //     }
    //   }
    // } else if (queryManufacturers) {
    //   const finded = manufacturers.find(
    //     item => item.slug == queryManufacturers
    //   );
    //   if (finded) {
    //     manufacturersSelectedIds.push(finded.id);
    //   }
    // }
    // const queryManufacturers = ctx.route.query.manufacturer;
    // let manufacturersSelectedIds = [];

    // if (isArray(queryManufacturers)) {
    //   for (let queryManufacurer of queryManufacturers) {
    //     const finded = manufacturers.find(
    //       item => item.slug == queryManufacurer
    //     );
    //     if (finded) {
    //       manufacturersSelectedIds.push(finded.id);
    //     }
    //   }
    // } else if (queryManufacturers) {
    //   const finded = manufacturers.find(
    //     item => item.slug == queryManufacturers
    //   );
    //   if (finded) {
    //     manufacturersSelectedIds.push(finded.id);
    //   }
    // }
    let category = await ctx.store.dispatch("fetchCategory", {
      slug: ctx.route.params.category,
      manufacturer: manufacturersSelected
    });

    if (!category) {
      return ctx.error({
        statusCode: 404,
        message: "Категория не найдена"
      });
    }
    const manufacturersExist =
      category.manufacturers && category.manufacturers.length > 0
        ? manufacturers.filter(item => category.manufacturers.includes(item.id))
        : [];

    let sort;
    let sortNum;
    if (ctx.route.query.sort && ctx.route.query.sort === "price") {
      sort = { sort: "price" };
      sortNum = 1;
    } else {
      sort = { sort: "name" };
      sortNum = 0;
    }

    await ctx.store.commit("sortFilter", sort);
    await ctx.store.commit("manufacturerFilter", manufacturersSelected);
    // await ctx.store.commit("pageFilter", ctx.route.query.page);

    let products;

    if (Array.isArray(category.children) && category.children.length > 0) {
      products = {};
      for (let child of category.children) {
        const productsChild = await ctx.store.dispatch("fetchProducts", {
          slug: child.slug
        });
        products[child.id] = { ...child, ...productsChild };
      }

      const categoryProducts = {
        products: await ctx.store.dispatch("easyFetchProducts", {
          slug: category.slug,
          limit: 999
        })
      };
      await ctx.store.commit("easyProducts", products);
      category = { ...category, ...categoryProducts };
    } else {
      products = await ctx.store.dispatch("easyFetchProducts", {
        slug: ctx.route.params.category
      });
    }
    return {
      products: products,
      category: category,
      manufacturers: manufacturersExist,
      manufacturersSelected: manufacturersSelected,
      sort: sortNum
    };
  },
  methods: {
    async onInfinite($state) {
      await this.$store.commit("pageFilterInc");

      const newProducts = await this.$store.dispatch("easyFetchMoreProducts", {
        slug: this.$route.params.category
        // page: 2
      });
      console.log("TCL: onInfinite -> newProducts", newProducts.length);
      // this.products = this.products.push(newProducts);
      if (newProducts.length) {
        this.products = [...this.products, ...newProducts];
        $state.loaded();
      } else {
        $state.complete();
      }
      // }, 1000);
    },
    async sortChange(val) {
      if (Number.isInteger(val)) {
        this.$vuetify.goTo("#contentWrapper");
        if (val === 1) {
          const addObj = {
            sort: "price"
          };
          await this.$store.commit("sortFilter", addObj);
          this.products = [];
          this.products = await this.$store.dispatch("easyFetchProducts", {
            slug: this.$route.params.category
            // manufacturer: this.$store.state.manufacturerFilter,
            // sort: "price"
          });
          // this.$route.query = { ...this.$route.query, ...addObj };
          // console.log(this.$route.name);
          this.$router.push({
            // path: this.$route.path,
            query: { ...this.$route.query, ...addObj }
          });
        } else if (val === 0) {
          const addObj = {
            sort: "name"
          };
          await this.$store.commit("sortFilter", addObj);
          this.products = [];
          this.products = await this.$store.dispatch("easyFetchProducts", {
            slug: this.$route.params.category
            // manufacturer: this.$store.state.manufacturerFilter,
            // sort: "name"
          });
          let { sort, ...query } = this.$route.query;
          this.$router.push({
            path: this.$route.path,
            query: query
          });
        }
      }
      // let { sort, ...query } = this.$route.query;
      // this.$router.push({
      //   path: this.$route.path,
      //   query: query
      // });
    },
    async onManufacturerChange(val) {
      // console.log("TCL: onManufacturerChange -> val", val);
      // console.log(
      //   "TCL: onManufacturerChange -> this.manufacturersSelected",
      //   this.manufacturersSelected
      // );
      await this.$store.commit("pageFilter", 1);
      this.$vuetify.goTo("#contentWrapper");
      if (!val || val === this.manufacturersSelected) {
        // console.log(
        //   "TCL: onManufacturerChange -> val == this.manufacturersSelected",
        //   val == this.manufacturersSelected
        // );
        this.manufacturersSelected = null;
        await this.$store.commit("manufacturerFilter", null);
        let { manufacturer, ...query } = this.$route.query;
        await this.$router.push({
          path: this.$route.path,
          query: query
        });
        this.products = [];
        this.products = await this.$store.dispatch("easyFetchProducts", {
          slug: this.$route.params.category
        });
      } else {
        this.manufacturersSelected = val;
        const addObj = {
          manufacturer: val
        };
        await this.$store.commit("manufacturerFilter", val);
        await this.$router.push({
          path: this.$route.path,
          query: { ...this.$route.query, ...addObj }
        });
        this.products = [];
        this.products = await this.$store.dispatch("easyFetchProducts", {
          slug: this.$route.params.category
        });
      }
    }
    // async manufacturerChange(val) {
    //   this.pageCurr = 1;
    //   this.$vuetify.goTo("#contentWrapper");
    //   if (val.length === 0) {
    //     await this.$store.commit("manufacturerFilter", {});
    //     let { manufacturer, ...query } = this.$route.query;
    //     await this.$router.push({
    //       path: this.$route.path,
    //       query: query
    //     });
    //     this.products = [];
    //     this.products = await this.$store.dispatch("fetchProducts", {
    //       slug: this.$route.params.category
    //     });
    //   } else {
    //     const manufacturers = this.$store.state.sessionStorage.generalInfo
    //       .manufacturers;
    //     let manufacturersSelectedIds = [];

    //     for (let queryManufacurer of val) {
    //       const finded = manufacturers.find(
    //         item => item.id == queryManufacurer
    //       );
    //       if (finded && finded.slug) {
    //         manufacturersSelectedIds.push(finded.slug);
    //       }
    //     }
    //     const addObj = {
    //       manufacturer: manufacturersSelectedIds
    //     };
    //     await this.$store.commit("manufacturerFilter", val);
    //     await this.$router.push({
    //       path: this.$route.path,
    //       query: { ...this.$route.query, ...addObj }
    //     });
    //     this.products = [];
    //     this.products = await this.$store.dispatch("fetchProducts", {
    //       slug: this.$route.params.category
    //     });
    //   }
    // }
  },
  // watch: {
  //   async pageCurr(val) {
  //     await this.$vuetify.goTo("#contentWrapper");
  //     await this.$store.commit("pageFilter", val);
  //     this.products = [];
  //     this.products = await this.$store.dispatch("fetchProducts", {
  //       slug: this.$route.params.category,
  //       page: val
  //     });

  //     if (val > 1) {
  //       const addObj = {
  //         page: val
  //       };
  //       await this.$router.push({
  //         path: this.$route.path,
  //         query: { ...this.$route.query, ...addObj }
  //       });
  //     } else {
  //       let { page, ...query } = this.$route.query;
  //       // let { manufacturer, ...query } = this.$route.query;
  //       // await this.$store.dispatch("fetchProducts", {
  //       //   slug: this.$route.params.category,
  //       //   manufacturer: val
  //       // });
  //       await this.$router.push({
  //         path: this.$route.path,
  //         query: query
  //       });
  //       // this.$router.push({
  //       //   path: this.$route.path,
  //       //   query:{
  //       //     ...this.$route.query,
  //       //     query
  //       //   }
  //       // });
  //     }
  //     //   console.log("TCL: pageCurr -> val", val);
  //   }
  // },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      modal: false
      // sort: 0,
      // pageCurr: 1
      // pagesTotal: 2
      // manufacturersSelected: []
    };
  }
};
</script>

