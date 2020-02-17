<template>
  <v-card
    :to="`/${type}/${item.slug}`"
    color="white"
    hover
    ripple
    class="card-wrapper flex xs12 text-xs-left font-weight-medium pa-3"
    style="text-decoration: none; border-radius: 10px"
    :title="item.name"
  >
    <v-layout row wrap class="card-inner">
      <v-flex xs12 md4 lg3 class="img-wrapper display-flex gray py-4" style>
        <img
          class="d-block ma-auto"
          style="max-width: 220px; height:150px; object-fit: contain;"
          v-lazy="item.img ? imageBaseUrl+item.img.url : require('~/assets/no-image.png')"
          :alt="item.name"
          :title="item.name"
        />
      </v-flex>
      <v-flex xs12 md8 lg9 class="card-text-wrapper display-flex">
        <div class="card-text-inner my-auto">
          <h2 class="card-header mb-3">{{item.name}}</h2>
          <div class="card-text mb-0" v-text="item.description"></div>
        </div>
      </v-flex>
    </v-layout>
  </v-card>
</template>

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

