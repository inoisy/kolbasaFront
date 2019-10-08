<template>
  <div class="header d-flex pb-5" v-lazy:background-image="require('~/assets/img/promo.jpg')">
    <v-container
      fill-height
      :fluid="fluid"
      class="pt-5"
      :style="`padding-bottom: ${paddingHeight}px`"
    >
      <v-layout column>
        <v-breadcrumbs :items="breadrumbs" class="pl-1 pb-4" dark>
          <template slot="item" slot-scope="props">
            <nuxt-link
              class="text-decoration-none white--text"
              :to="props.item.to"
              exact
            >{{ props.item.text }}</nuxt-link>
          </template>
        </v-breadcrumbs>
        <h1 class="header-text white--text my-5 text-xs-center">{{title}}</h1>
        <div class="slot-wrapper" ref="slot" v-resize="onResize">
          <slot></slot>
        </div>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  props: ["title", "breadrumbs", "fluid"],
  data() {
    return {
      paddingHeight: 0
    };
  },
  methods: {
    onResize() {
      if (
        this.$refs.slot &&
        this.$refs.slot.children &&
        this.$refs.slot.children.length > 0
      ) {
        this.paddingHeight = this.$refs.slot.children[0].getBoundingClientRect().height;
      }
    }
  },
  mounted() {
    if (
      this.$refs.slot &&
      this.$refs.slot.children &&
      this.$refs.slot.children.length > 0
    ) {
      this.paddingHeight = this.$refs.slot.children[0].getBoundingClientRect().height;
    }
    // this.paddingHeight = this.$refs.slot.children[0].getBoundingClientRect().height;
    // console.log("ref", this.$refs.slot.children[0].getBoundingClientRect().height);
  }
  // computed(){
  //   return
  // }
};
</script>
<style lang="stylus" scoped>
.header {
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  min-height: 35vh;
}

.header-text {
  font-size: 2.2rem;
}

@media (min-width: 600px) {
  .header-text {
    font-size: 3rem;
  }
}

@media (min-width: 960px) {
  .header-text {
    font-size: 3.4rem;
  }
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

