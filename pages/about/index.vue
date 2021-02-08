<template>
  <div>
    <LazyHydrate when-idle>
      <page-header :title="title" :breadrumbs="breadrumbs" />
    </LazyHydrate>
    <section class="background-with-transparent">
      <!-- <main
      class="background"
      style="
        background-color: #f0f0f0;
        background-repeat: repeat;
        background-size: 100%;
        background-image: url(/bg.jpg);
      "
    > -->
      <v-container class="py-12" grid-list-lg>
        <v-row>
          <v-col cols="12">
            <LazyHydrate never>
              <content-wrapper v-html="page.content" />
            </LazyHydrate>
            <!-- <div v-html="page.content"></div> -->
          </v-col>
        </v-row>
      </v-container>
    </section>
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
    let client = ctx.app.apolloProvider.defaultClient;
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
