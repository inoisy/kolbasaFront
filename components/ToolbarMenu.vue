<template>
  <v-menu
    open-on-hover
    offset-y
    left
    :activator="`#${parentSlug}`"
    content-class="menu-inner"
  >
    <!-- <div>
      <LazyHydrate on-interaction> -->
    <v-list color="white" :class="isTwoColumns && 'two-columns'" dense>
      <template v-for="(child, index) in items">
        <v-list-item
          :key="'list-group' + index"
          :to="`/${parentSlug}/${child.slug}`"
          :title="child.name"
          class="list-item"
        >
          <v-list-item-title>
            {{ child.name }}
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
    <!-- </LazyHydrate>
    </div> -->
  </v-menu>
</template>
<style lang="scss" scoped>
.menu-inner {
  top: $toolbar-mobile-height !important;
  @include md {
    top: $toolbar-desktop-height !important;
  }
}

.two-columns {
  column-count: 2;
  max-width: 27rem;
  position: relative;
  .list-item {
    float: left;
    page-break-inside: avoid;
    -moz-column-break-inside: avoid;
    break-inside: avoid;
    width: 100%;
    min-height: 30px !important;
    height: 30px !important;
    font-size: 12px;
  }
  .list-item-child {
    padding-left: 1rem;
  }
}
</style>
<script>
// import LazyHydrate from "vue-lazy-hydration";

export default {
  // components: {
  //   LazyHydrate,
  // },
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    parentSlug: {
      type: String,
      default: "",
    },
    isTwoColumns: {
      type: Boolean,
      default: false,
    },
  },
  //   data() {
  //     return {
  //       showMenu: false,
  //     };
  //   },
  //   computed:{
  //       twoColumns(){
  //           return this.isTwoColumns || this.items.length >10
  //       }
  //   },
  //   watch: {
  //     "$route.path"() {
  //       this.showMenu = false;
  //     },
  //   },
  //   beforeDestroy() {
  //     this.showMenu = false;
  //   },
};
</script>

<style>
</style>