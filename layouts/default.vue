<template>
  <v-app>
    <LazyHydrate when-idle>
      <toolbar
        @show-user="userDrawer = true"
        @show-drawer="drawer = true"
        @show-basket="basketDrawer = true"
      />
    </LazyHydrate>
    <lazy-navigation-mobile
      v-if="drawer"
      :show="drawer"
      @close="drawer = false"
    />
    <v-main class="dash">
      <nuxt />
    </v-main>
    <v-lazy v-model="isFooter" min-height="300">
      <lazy-default-footer class="pos-relative" />
    </v-lazy>
    <lazy-user-drawer
      v-if="userDrawer"
      :show="userDrawer"
      @close="userDrawer = false"
    />
    <!-- </v-navigation-drawer> -->
    <client-only>
      <!-- <v-navigation-drawer
        v-model="basketDrawer"
        temporary
        fixedfooter-bg
        right
        width="550px"
      > -->
      <lazy-busket-drawer
        v-if="basketDrawer"
        :show="basketDrawer"
        @close="basketDrawer = false"
      />
      <!-- </v-navigation-drawer> -->
    </client-only>
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
    background-image: url("~assets/img/stroke.png");
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
