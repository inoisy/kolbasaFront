<template>
  <div>
    <page-header title="Производители" :breadrumbs="breadrumbs" />
    <div class="background" v-lazy:background-image="require('~/assets/img/bg.jpg')">
      <v-container class="py-5">
        <!-- <v-layout row wrap> -->
        <div v-for="(item,index) in manufacturers" :key="index" data-aos="fade-up">
          <vertical-card :item="item" type="manufacturers" class="mb-4"></vertical-card>
          <!-- <v-card :to="`/manufacturers/${item.slug}`" class="pa-3 display-flex wrap" hover ripple>
              <v-flex xs12 sm3 lg2 class="display-flex">
                <img
                  style="max-height: 20rem"
                  class="d-block ma-auto"
                  :src="item.img ? imageBaseUrl+item.img.url : require('~/assets/no-image.png')"
                  :alt="item.name"
                />
              </v-flex>
              <v-flex xs12 sm9 lg10>
                <h2 class="display-2 mont mb-3 font-weight-bold">{{item.name}}</h2>
                <div class="display-1 mont">{{item.description}}</div>
              </v-flex>
          </v-card>-->
        </div>
        <!-- </v-layout> -->
      </v-container>
    </div>
  </div>
</template>
  

<script>
import gql from "graphql-tag";
import PageHeader from "~/components/PageHeader";
import VerticalCard from "~/components/VerticalCard";

export default {
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
    console.log("TCL: Data -> manufacturerData", manufacturerData);

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


