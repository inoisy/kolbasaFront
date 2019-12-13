<template>
  <div class="header d-flex pb-5" v-lazy:background-image="require('~/assets/img/promo.jpg')">
    <v-container
      fill-height
      :fluid="fluid"
      class="pt-4"
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
        <h1 class="header-text white--text mt-4 mb-4 text-xs-center">{{title}}</h1>
        <div class="slot-wrapper" ref="slot" v-resize="this.isPadding ? onResize : ()=>{}">
          <slot></slot>
        </div>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String
    },
    breadrumbs: {
      type: Array
    },
    fluid: {
      type: Boolean,
      default: false
    },
    isPadding: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      paddingHeight: 0
    };
  },
  methods: {
    onResize() {
      if (
        this.isPadding &&
        this.$refs.slot &&
        this.$refs.slot.children &&
        this.$refs.slot.children.length > 0
      ) {
        this.paddingHeight =
          this.$refs.slot.children[0].getBoundingClientRect().height - 30;
      }
    }
  },
  mounted() {
    if (
      this.isPadding &&
      this.$refs.slot &&
      this.$refs.slot.children &&
      this.$refs.slot.children.length > 0
    ) {
      this.paddingHeight =
        this.$refs.slot.children[0].getBoundingClientRect().height - 30;
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

