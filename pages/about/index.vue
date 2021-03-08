<template>
  <div>
    <LazyHydrate when-idle>
      <page-header :title="title" :breadrumbs="breadrumbs" />
    </LazyHydrate>

    <div
      style="background-image: url(/bg.jpg)"
      class="background-with-transparent"
    >
      <v-container class="py-16" grid-list-lg>
        <v-row no-gutters>
          <v-col class="pa-3" cols="12">
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
import gql from "graphql-tag";

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
  async asyncData({
    app: {
      apolloProvider: { defaultClient },
    },
  }) {
    const {
      data: {
        pages: [page],
      },
    } = await defaultClient.query({
      query: gql`
        query AboutPageQuery {
          pages(where: { name: "about" }) {
            name
            content
          }
        }
      `,
    });
    // console.timeEnd("fetchAsyncData");
    return {
      page,
    };
  },
};
</script>