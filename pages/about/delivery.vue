<template>
  <div>
    <LazyHydrate when-idle>
      <page-header :title="title" :breadrumbs="breadrumbs" />
    </LazyHydrate>
    <div
      :style="`background-image: url(${require('~/assets/images/bg.jpg?webp')})`"
      class="background-with-transparent"
    >
      <v-container grid-list-lg class="pt-16 pb-15">
        <v-row>
          <v-col cols="12">
            <LazyHydrate never>
              <content-wrapper v-html="pageData.content" />
            </LazyHydrate>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import gql from "graphql-tag";
import LazyHydrate from "vue-lazy-hydration";

// import PageHeader from "~/components/PageHeader";
const pageName = "Доставка";
export default {
  head() {
    return {
      title: this.title,
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            (this.pageData && this.pageData.description) ||
            this.title + " " + process.env.description,
        },
      ],
    };
  },
  computed: {
    title() {
      return (this.pageData && this.pageData.title) || pageName;
    },
    breadrumbs() {
      return [
        {
          to: "/",
          text: "Главная",
        },
        {
          to: "/delivery",
          text: this.title,
        },
      ];
    },
  },
  async asyncData({ app }) {
    const client = app.apolloProvider.defaultClient;
    const { data: pageData } = await client.query({
      query: gql`
        {
          delivery {
            title
            description
            content
          }
        }
      `,
    });
    return {
      pageData: pageData.delivery,
    };
  },
  components: { LazyHydrate },
};
</script>