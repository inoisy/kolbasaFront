<template>
  <v-card
    :to="`/${type}/${item.slug}`"
    hover
    ripple
    class="card-wrapper flex xs12 text-xs-left mont font-weight-medium pa-3"
    style="text-decoration: none; border-radius: 10px"
  >
    <v-layout row wrap>
      <v-flex xs12 md4 class="img-wrapper display-flex gray px-5 py-4">
        <img
          class="d-block ma-auto"
          style="max-height:13rem"
          v-lazy="item.img ? imageBaseUrl+item.img.url : require('~/assets/no-image.png')"
          :alt="item.name"
        />
      </v-flex>
      <v-flex xs12 md8 class="card-text-wrapper display-flex">
        <div class="card-text-inner my-auto">
          <h2 class="card-header display-2 mont mb-3">{{item.name}}</h2>
          <div class="card-text mb-0 mont" v-text="item.description"></div>
        </div>
      </v-flex>
    </v-layout>
  </v-card>
</template>
<style lang="stylus">
.card-wrapper {
  .img-wrapper {
    img {
      padding: 0 20px;
      max-width: 90%;
    }
  }

  .card-header {
    font-weight: 600 !important;
  }

  .card-text {
    font-size: 1.1rem;
    font-weight: 400 !important;
  }
}

@media (min-width: 960px) {
  .card-wrapper {
    .img-wrapper {
      // padding-right: 20px !important;
      img {
      }
    }

    .card-header {
      // font-weight: 600 !important;
    }

    .card-text-inner {
      padding-top: 1rem;
      padding-bottom: 1rem;
      padding-right: 2.2rem;
    }
  }
}
</style>

<script>
export default {
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl
    };
  },
  props: ["item", "type"]
};
</script>

