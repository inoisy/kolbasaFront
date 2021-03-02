<template>
  <div>
    <LazyHydrate when-idle>
      <page-header :title="title" :breadrumbs="breadrumbs" />
    </LazyHydrate>
    <div
      :style="`background-image: url(${require('~/assets/images/bg.jpg?webp')})`"
      class="background-with-transparent"
    >
      <v-container class="py-16" grid-list-lg>
        <v-row>
          <v-col cols="12">
            <LazyHydrate never>
              <content-wrapper v-html="page.content" />
            </LazyHydrate>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>
    

<script>
import LazyHydrate from "vue-lazy-hydration";

// import PageHeader from "~/components/PageHeader";
import gql from "graphql-tag";
// import { mdiAccount, mdiPencil, mdiShareVariant, mdiDelete } from "@mdi/js";
// icons: {
//   mdiAccount,
//   mdiPencil,
//   mdiShareVariant,
//   mdiDelete,
// },
export default {
  head() {
    return {
      title: "О компании",
    };
  },
  components: { LazyHydrate },
  data() {
    return {
      title: "О компании",
      breadrumbs: [
        {
          to: "/",
          text: "Главная",
        },
        {
          to: "/contacts",
          text: "Контакты",
        },
      ],
    };
  },
  async asyncData(ctx) {
    // await ctx.store.dispatch("fetchGeneralInfo");
    const client = ctx.app.apolloProvider.defaultClient;
    const { data: pageData } = await client.query({
      query: gql`
        query AboutPageQuery {
          pages(where: { name: "about" }) {
            name
            content
          }
        }
      `,
    });

    return {
      page: pageData.pages[0],
    };
  },
  // mounted() {
  //   console.log(this.$vuetify.icons);
  // },
};
</script>

<style>
</style>
