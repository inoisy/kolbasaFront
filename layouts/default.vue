<template>
  <v-app>
    <LazyHydrate when-idle>
      <toolbar
        @show-user="userDrawer = true"
        @show-drawer="drawer = true"
        @show-basket="basketDrawer = true"
      />
    </LazyHydrate>
    <lazy-drawer-mobile-navigation
      v-if="drawer"
      :show="drawer"
      @close="drawer = false"
    />
    <v-main class="dash">
      <nuxt />
    </v-main>
    <v-lazy v-model="isFooter" min-height="300">
      <lazy-default-footer v-if="isFooter" class="pos-relative" />
    </v-lazy>
    <lazy-drawer-user
      v-if="userDrawer"
      :show="userDrawer"
      @close="userDrawer = false"
    />
    <!-- <client-only> -->
    <lazy-drawer-busket
      v-if="basketDrawer"
      :show="basketDrawer"
      @close="basketDrawer = false"
    />
    <!-- </client-only> -->
  </v-app>
</template>
<style lang="scss" scoped>
.dash {
  position: relative;
  min-height: 80vh;

  &:after {
    content: "";
    display: block;
    width: 100%;
    background-image: url("/images/stroke.png");
    background-repeat: no-repeat;
    background-position: center;
    height: 45px;
    position: absolute;
    bottom: 0px;
    background-size: auto;
  }
}

@media (min-width: 960px) {
  .dash {
    &:after {
      background-size: contain;
    }
  }
}
</style>

<script>
import LazyHydrate from "vue-lazy-hydration";

export default {
  components: {
    LazyHydrate,
  },
  name: "default",
  data() {
    return {
      drawer: false,
      basketDrawer: false,
      userDrawer: false,
      isFooter: false,
    };
  },
  mounted() {
    this.isMounted = true;
  },
};
</script>
