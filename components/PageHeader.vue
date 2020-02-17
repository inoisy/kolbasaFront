<template>
  <div class="header d-flex" v-lazy:background-image="require('~/assets/img/promo.jpg')">
    <v-container fill-height :fluid="fluid" grid-list-lg>
      <v-layout
        column
        style="min-height: 40vh;"
        :class="isPadding ? 'justify-space-between' : 'justify-space-around'"
      >
        <v-breadcrumbs :items="breadrumbs" dark class="px-4 py-3">
          <template slot="item" slot-scope="props">
            <nuxt-link
              class="text-decoration-none white--text"
              :to="props.item.to"
              :title="props.item.text"
              exact
            >{{ props.item.text }}</nuxt-link>
          </template>
        </v-breadcrumbs>
        <h1 class="lumber header-text white--text text-center px-4">{{title}}</h1>
        <div class="slot-wrapper" ref="slot">
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
  }
};
</script>
<style lang="stylus" scoped>
.header {
  background-color: #131313;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  min-height: 40vh;
}

.header-text {
  font-size: 2.2rem;
  line-height: 1.2;
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

