<template>
  <div class="header d-flex" v-lazy:background-image="require('~/assets/img/promo.jpg')">
    <v-container fill-height :fluid="fluid" class="py-5">
      <v-layout column>
        <!-- <v-flex class> -->
        <v-breadcrumbs :items="breadrumbs" class="pl-1 pb-4" dark>
          <template slot="item" slot-scope="props">
            <nuxt-link
              class="text-decoration-none white--text"
              :to="props.item.to"
              exact
            >{{ props.item.text }}</nuxt-link>
          </template>
        </v-breadcrumbs>
        <!-- </v-flex>
        <v-flex>-->
        <h1 class="white--text mb-5">{{title}}</h1>
        <!-- </v-flex> -->
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  props: ["title", "breadrumbs", "fluid"]
};
</script>
<style lang="stylus" scoped>
.header {
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  min-height: 35vh;
}

a {
  // color: #ffffff;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.1rem;
}

a.nuxt-link-active {
  // color: #19bcdb !important;
  font-weight: 700;
}
</style>

