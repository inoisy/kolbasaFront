<template>
  <div>
    <page-header title="Производители" :breadrumbs="breadrumbs" />
    <div
      class="background"
      v-lazy:background-image="require('~/assets/img/bg.jpg')"
      style="background-color: #f0f0f0; background-repeat: repeat; background-size: 100%;"
    >
      <v-container class="py-5">
        <div v-for="(item,index) in manufacturers" :key="index" data-aos="fade-up">
          <vertical-card :item="item" type="manufacturers" class="mb-4"></vertical-card>
        </div>
      </v-container>
    </div>
  </div>
</template>
  

<script>
import gql from "graphql-tag";
import PageHeader from "~/components/PageHeader";
import VerticalCard from "~/components/VerticalCard";

export default {
  head() {
    return {
      title: "Производители(мясокомбинаты)"
    };
  },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl
    };
  },
  components: { PageHeader, VerticalCard },
  async asyncData(ctx) {
    await ctx.store.dispatch("fetchGeneralInfo");
    let client = ctx.app.apolloProvider.defaultClient;
    const { data: manufacturerData } = await client.query({
      query: gql`
        {
          manufacturers {
            name
            slug
            description
            img {
              url
            }
          }
        }
      `
    });
    // console.log("TCL: Data -> manufacturerData", manufacturerData);

    return {
      manufacturers: manufacturerData.manufacturers
    };
  },
  computed: {
    breadrumbs() {
      return [
        {
          to: "/",
          text: "Главная"
        },
        {
          to: this.$route.path,
          text: "Производители"
        }
      ];
    }

    // manufacturers() {
    //   return this.$store.state.generalInfo.manufacturers;
    // }
  }
};
</script>


