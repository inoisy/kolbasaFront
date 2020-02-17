<template>
  <div>
    <page-header title="Каталог" :breadrumbs="breadrumbs" />
    <section
      class="background background-repeat"
      v-lazy:background-image="require('~/assets/img/bg.jpg')"
    >
      <v-container grid-list-lg class="py-12">
        <template v-for="(category,index) in categories">
          <vertical-card
            v-if="category.children.length===0"
            :item="category"
            type="catalog"
            class="mb-10 d-block"
            :key="index"
          ></vertical-card>
          <div
            v-else
            :key="index"
            class="pa-3 mb-10 pb-4 pl-4"
            style="border: 1px solid #c1c1c1; border-radius: 10px;"
          >
            <nuxt-link
              :to="`/catalog/${category.slug}`"
              class="mb-6 d-block category-text lumber font-weight-medium mb-0 primary--text fs-1-5 underline-on-hover"
              :title="category.name"
            >{{category.name}}</nuxt-link>
            <vertical-card
              class="catalog-card layout wrap mt-3"
              v-for="child in category.children"
              :item="child"
              type="catalog"
              :key="child.id"
            ></vertical-card>
          </div>
        </template>
      </v-container>
    </section>
  </div>
</template>

<style lang="stylus" scoped>
@media (max-width: 960px) {
}
</style>
<script>
import PageHeader from "~/components/PageHeader";
import VerticalCard from "~/components/VerticalCard";
import ProductCard from "~/components/ProductCard";

import gql from "graphql-tag";

export default {
  head() {
    return {
      title: "Каталог. Колбаса и другие мясные изделия оптом.",
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: "description",
          name: "description",
          content:
            "Каталог Альянс Фуд. Колбаса и другие мясные изделия оптом по ценам производителя. Самовывоз со склада в Москве. Доставка по РФ"
        }
      ]
    };
  },
  components: { PageHeader, VerticalCard, ProductCard },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      breadrumbs: [
        {
          to: "/",
          text: "Главная"
        },
        {
          to: "/catalog",
          text: "Каталог"
        }
      ]
    };
  },
  async asyncData(ctx) {
    await ctx.store.dispatch("fetchGeneralInfo");
    let client = ctx.app.apolloProvider.defaultClient;
    const { data: categoriesData } = await client.query({
      query: gql`
        {
          categories(sort: "name:asc") {
            id
            name
            slug
            description
            parent {
              id
            }
            children {
              id
              name
              slug
              description
              img {
                url
              }
            }
            img {
              url
            }
          }
        }
      `
    });
    // console.log("TCL: Data -> categoriesData", categoriesData);
    // const reducedCategories = categoriesData.categories.reduce((acc, val) => {
    //   console.log("TCL: acc", acc);
    //   console.log("TCL: val", val);
    //   acc.set(val.id, val);
    //   return acc;
    // }, new Map());
    return {
      categories: categoriesData.categories
        .filter(item => item.parent.length === 0)
        .sort((a, b) => {
          if (a.children.length > b.children.length) {
            return 1;
          }
          if (a.children.length < b.children.length) {
            return -1;
          }
          // a.children.length < b.children.length});
        })
    };
  },
  computed: {
    // categories() {
    //   return this.$store.state.generalInfo.categories;
    // }
  }
};
</script>

