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

      const bottomOffset = elem.getBoundingClientRect().bottom - 64;
      const clientHeight = window.innerHeight - 64;
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
        offsetHeight: 0,
        bottomOffset: 1000
      }
    };
  }
};
</script>

<style lang="stylus" scoped>
.sidebarContent {
  width: 100%;

  ::-webkit-scrollbar {
    width: 20px;
  }

  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
  }

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
  top: 56px;
  height: 100%;
  overflow-y: auto;
}

@media only screen and (min-width: 960px) {
  .fixed-top, .fixed-bottom {
    top: 64px;
  }
}
</style>