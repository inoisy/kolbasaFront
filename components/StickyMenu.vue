<template>
  <div
    v-scroll="onScroll"
    id="sidebarContent"
    class="sidebarContent"
    v-resize="onResize"
    :class="fixedTop ? 'fixed-top':''"
    ref="sidebarContent"
    :style="`max-height: ${sidebar.maxHeight}px;`"
  >
    <!-- width: ${this.parentWidth}px;  -->
    <slot></slot>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  mounted() {},
  computed: {
    breakpoint() {
      return this.$vuetify.breakpoint
        ? this.$vuetify.breakpoint.smAndDown
        : null;
    },
    fixedTop() {
      return (
        !this.breakpoint &&
        this.sidebar.windowScrollTop > this.sidebar.offsetHeight &&
        this.sidebar.bottomOffset > 0
      );
    }
  },
  methods: {
    onResize() {
      const elem = this.$refs.sidebarContent
        ? this.$refs.sidebarContent.parentElement
        : null;
      this.sidebar.offsetHeight = elem.offsetTop;
      this.calculateSidebar();
    },
    calculateSidebar() {
      const elem = this.$refs.sidebarContent
        ? this.$refs.sidebarContent.parentElement
        : null;

      const bottomOffset = elem.getBoundingClientRect().bottom - 120;
      console.log("TCL: calculateSidebar -> bottomOffset", bottomOffset);
      const clientHeight = window.innerHeight - 120;
      this.sidebar.maxHeight =
        bottomOffset > clientHeight ? clientHeight : bottomOffset;
      this.sidebar.bottomOffset = bottomOffset;
    },
    onScroll() {
      this.sidebar.windowScrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      this.calculateSidebar();
    }
  },
  mounted() {
    const elem = this.$refs.sidebarContent
      ? this.$refs.sidebarContent.parentElement
      : null;
    // this.parentWidth = elem.clientWidth - 20;
    this.sidebar.windowScrollTop =
      window.pageYOffset || document.documentElement.scrollTop;

    this.sidebar.offsetHeight = elem.offsetTop;
    this.calculateSidebar();
  },
  data() {
    return {
      offsetTop: 0,
      sidebar: {
        windowScrollTop: 0,
        // innerHeight: 0,
        offsetHeight: 0,
        bottomOffset: 1000
        // maxHeight: 1000
      }
    };
  }
};
// &::-webkit-scrollbar {
//   width: 0 !important;
// }

// overflow: -moz-scrollbars-none;
// -ms-overflow-style: none;
</script>

<style lang="stylus">
.sidebarContent {
  width: 100%;

  ::-webkit-scrollbar {
    width: 20px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: red;
    border-radius: 10px;
  }
}

.fixed-bottom {
  position: fixed;
  width: inherit;
  top: 80px;
  height: 100%;
  overflow-y: auto;
}

.fixed-top {
  position: fixed;
  width: inherit;
  top: 80px;
  height: 100%;
  overflow-y: auto;
  // padding-bottom: 90px;
}

@media only screen and (min-width: 960px) {
  .fixed-top, .fixed-bottom {
    top: 110px;
    // padding-bottom: 160px;
  }
}
</style>