<template>
  <div>
    <nuxt-child />
    <page-header :title="manufacturer.name" :breadrumbs="breadrumbs">
      <slot>
        <div v-if="manufacturer.catalog.length>0" class="display-flex justify-center">
          <v-btn
            v-for="(catalog,index) in manufacturer.catalog"
            :key="'catalog'+index"
            class="ml-0 mb-4"
            large
            color="accent"
            :href="imageBaseUrl+catalog.url"
          >
            <v-icon left dark>save_alt</v-icon>Загрузить прайс
          </v-btn>
        </div>
      </slot>
    </page-header>
    <div>
      <v-container grid-list-lg class="py-5">
        <div class="display-1 mb-4" style="font-size: 1.1rem !important">
          <div
            class="flex xs12"
            v-html="manufacturer.content && manufacturer.content.length>0 ? $md.render(manufacturer.content) : ''"
          ></div>

          <v-divider class="mt-3" v-show="categories.length>0"></v-divider>
        </div>

        <v-layout row wrap v-for="(category,index) of categories" :key="category.id" class="mb-5">
          <v-flex xs12 class="display-flex align-center wrap" data-aos="fade-up">
            <h2 class="mr-4 mb-4">{{category.item.name}}</h2>
            <v-btn
              class="ma-0 mb-4"
              :to="`/catalog/${category.item.slug}?manufacturer=${manufacturer.slug}`"
              color="accent"
              outline
              large
            >Показать все</v-btn>
          </v-flex>

          <div
            class="flex xs12 sm6 md4 lg3 xl2"
            data-aos="fade-up"
            v-for="product of category.products"
            :key="product.id"
          >
            <product-card
              :product="product"
              :to="`/manufacturers/${manufacturer.slug}/${product.slug}`"
            ></product-card>
          </div>
          <!-- <div class="flex xs12" data-aos="fade-up" v-show="showMoreButtonShow[index]">
            <v-btn
              @click="handleShowMore(category.item.id)"
              class="mt-4 ml-0"
              color="accent"
              large
            >Показать еще</v-btn>
          </div>-->
        </v-layout>
      </v-container>
    </div>
    <!-- <keep-alive>
       :key="$route.params && $route.params.slug ? $route.params.slug : ''" 
    </keep-alive>-->
  </div>
</template>
<style>
.background {
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
<script>
import gql from "graphql-tag";

import PageHeader from "~/components/PageHeader";
import ProductCard from "~/components/ProductCard";

export default {
  head() {
    return {
      title: this.manufacturer.name,
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: "description",
          name: "description",
          content: this.manufacturer.description
        }
      ]
    };
  },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl
    };
  },
  methods: {
    async handleShowMore(categoryId) {
      // console.log("TCL: handleShowMore -> categoryId", categoryId);
      let client = this.$apollo;
      // console.log(
      //   "TCL: handleShowMore -> this.manufacturer.id",
      //   this.manufacturer.id
      // );
      const categoryIndex = this.categories.findIndex(
        item => item.item.id === categoryId
      );

      this.showMoreButtonShow[categoryIndex] = false;

      // console.log("TCL: handleShowMore -> categoryIndex", categoryIndex);
      const productsLength = this.categories[categoryIndex].products.length;
      const { data: products } = await this.$axios.get(
        process.env.baseUrl +
          `/products?category=${categoryId}&manufacturer=${this.manufacturer.id}&_limit=999&_start=${productsLength}`
      );
      // console.log(
      //   "TCL: handleShowMore -> ;",
      //   process.env.baseUrl +
      //     `/products?category=${categoryId}&manufacturer=${this.manufacturer.id}&_limit=999&_start=${productsLength}`
      // );

      // console.log("TCL: handleShowMore -> products", products);
      if (products.length > 0) {
        this.categories[categoryIndex].products.push(...products);
      }
      // if (products.length < 10) {
      //   ;
      // }
      // const { data: categoriesData } = await client.query({
      //   variables: {
      //     id: this.manufacturer.id,
      //     categoryId: id,
      //     start: productsLength
      //   },
      //   query: gql`
      //     query CategoriesByManufacturersQuery(
      //       $id: ID!
      //       $categoryId: ID!
      //       $start: Int
      //     ) {
      //       category(id: $categoryId) {
      //         products(
      //           where: { manufacturer: { id: $id } }
      //           limit: 10
      //           start: $start
      //         ) {
      //           id
      //           name
      //           slug
      //           priceNum
      //           discountPrice
      //           weight
      //         }
      //       }
      //     }
      //   `
      // });
      // const products = categoriesData.category.products;

      // console.log("TCL: productsLength", productsLength);

      // console.log("TCL: category", categoryIndex);
      // console.log("TCL: handleShowMore -> products", products);
    }
  },
  async asyncData(ctx) {
    const generalInfo = await ctx.store.dispatch("fetchGeneralInfo");
    let client = ctx.app.apolloProvider.defaultClient;
    const manufacturerFind = generalInfo.manufacturers.find(
      item => item.slug === ctx.params.slug
    );
    if (manufacturerFind) {
      const id = manufacturerFind.id;
      const { data: manufacturerData } = await client.query({
        variables: {
          id: id
        },
        query: gql`
          query ManufacturerQuery($id: ID!) {
            manufacturer(id: $id) {
              id
              name
              slug
              description
              content
              img {
                url
              }
              catalog {
                url
              }
            }
          }
        `
      });
      // console.log("TCL: Data -> manufacturerData", manufacturerData);
      const { data: categoriesData } = await ctx.$axios.get(
        `/categories/categoriesByManufacturer/` + id
      );
      console.log("TCL: Data -> categoriesData", categoriesData);
      // const { data: categoriesData } = await client.query({
      //   variables: {
      //     id: id
      //   },
      //   query: gql`
      //     query CategoriesByManufacturersQuery($id: ID!) {
      //       categories {
      //         id
      //         name
      //         slug
      //         products(where: { manufacturer: { id: $id } }, limit: 10) {
      //           id
      //           name
      //           slug
      //           priceNum
      //           discountPrice
      //           weight
      //           category {
      //             slug
      //           }
      //           manufacturer {
      //             slug
      //             img {
      //               url
      //             }
      //           }
      //           img {
      //             url
      //           }
      //         }
      //       }
      //     }
      //   `
      // });
      // await ctx.$axios.get(
      //   `/categories/categoriesByManufacturer/` + id
      // );
      return {
        manufacturer: manufacturerData.manufacturer,
        categories: categoriesData,
        showMoreButtonShow: categoriesData.map(
          item => item.products.length >= 10
        )
      };
    } else {
      return ctx.error({
        statusCode: 404,
        message: "Производитель не найден"
      });
    }
  },
  components: { PageHeader, ProductCard },

  computed: {
    // manufacturer() {
    //   return this.$store.state.manufacturer;
    // },
    breadrumbs() {
      return [
        {
          to: "/",
          text: "Главная"
        },
        {
          to: "/manufacturers",
          text: "Производители"
        }
        // {
        //   to: this.$route.path,
        //   text: this.manufacturer.name
        // }
      ];
    }

    // manufacturers() {
    //   return this.$store.state.generalInfo.manufacturers;
    // }
  }
};
</script>


