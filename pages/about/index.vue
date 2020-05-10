<template>
  <div>
    <page-header :title="title" :breadrumbs="breadrumbs" />

    <main
      class="background"
      v-lazy:background-image="require('~/assets/img/bg.jpg')"
      style="background-color: #f0f0f0; background-repeat: repeat; background-size: 100%;"
    >
      <v-container class="py-12" grid-list-lg>
        <v-row>
          <v-col cols="12">
            <div v-html="$md.render(page.content)"></div>
          </v-col>
        </v-row>
      </v-container>
    </main>
  </div>
</template>
    

<script>
import PageHeader from "~/components/PageHeader";
import gql from "graphql-tag";

export default {
  head() {
    return {
      title: "О компании"
    };
  },
  components: { PageHeader },
  data() {
    return {
      title: "О компании",
      breadrumbs: [
        {
          to: "/",
          text: "Главная"
        },
        {
          to: "/contacts",
          text: "Контакты"
        }
      ]
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
      `
    });

    return {
      page: pageData.pages[0]
    };
  }
};
</script>

<style>
</style>
