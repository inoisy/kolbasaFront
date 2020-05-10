<template>
  <div>
    <page-header :title="title" :breadrumbs="breadrumbs" />
    <section
      class="background background-repeat"
      v-lazy:background-image="require('~/assets/img/bg.jpg')"
      style="min-height: 40vh;"
    >
      <v-container grid-list-lg>
        <v-layout row wrap class="py-12">
          <v-flex
            xs12
            class="content-wrapper"
            v-html="pageData.content && $md.render(pageData.content)"
          ></v-flex>
        </v-layout>
      </v-container>
    </section>
  </div>
</template>

<script>
import gql from "graphql-tag";

import PageHeader from "~/components/PageHeader";
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
            this.title + " " + process.env.description
        }
      ]
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
          text: "Главная"
        },
        {
          to: "/delivery",
          text: this.title
        }
      ];
    }
  },
  async asyncData({ app }) {
    let client = app.apolloProvider.defaultClient;
    const { data: pageData } = await client.query({
      query: gql`
        {
          delivery {
            title
            description
            content
          }
        }
      `
    });
    return {
      pageData: pageData.delivery
    };
  },
  components: { PageHeader }
};
</script>