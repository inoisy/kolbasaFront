<template>
  <div>
    <LazyHydrate when-idle>
      <page-header-simple :title="title" :breadrumbs="breadrumbs" />
    </LazyHydrate>

    <section class="background-with-transparent">
      <LazyHydrate never>
        <v-container class="py-16 pos-relative">
          <content-wrapper class="pa-standart" v-html="content" />
        </v-container>
      </LazyHydrate>
    </section>
  </div>
</template>
    

<script>
import LazyHydrate from "vue-lazy-hydration";
import gql from "graphql-tag";
// import BackgroundImage from '~/components/BackgroundImage.vue';

const title = "О компании";
export default {
  head() {
    return {
      title: title,
    };
  },
  components: { LazyHydrate },
  data() {
    return {
      title: title,
      breadrumbs: [
        {
          to: "/",
          text: "Главная",
        },
        {
          text: title,
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
            content
          }
        }
      `,
    });
    // console.timeEnd("fetchAsyncData");
    return {
      content: page.content,
    };
  },
};
</script>