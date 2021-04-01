<template>
  <div :class="$style.chipItemWrapper">
    <nuxt-link
      :style="!isData && 'visibility: hidden'"
      :class="[$style.chipItem, disabled && $style.chipDisabled]"
      :exact-active-class="$style.chipSelected"
      exact
      :to="{ query: query }"
      @click.native="change(item)"
    >
      <!-- -->

      {{ text }}
    </nuxt-link>
    <v-skeleton-loader
      v-if="!isData"
      :class="$style.chipItemSceleton"
      class="chip-item-sceleton"
      type="chip"
      :boilerplate="boilerplate"
    />
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true,
    },
    filterSlug: {
      type: String,
      required: true,
    },
    item: {
      //   type: [Object,Null],
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    boilerplate: {
      type: Boolean,
      default: true,
    },
    isData: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    query() {
      return this.item ? { [this.filterSlug]: this.item.slug } : false;
    },
  },
  methods: {
    change(item) {
      // console.log("🚀 ~ file: FilterItem.vue ~ line 60 ~ change ~ item", item);
      this.$emit("change", item);
    },
  },
};
</script>
<style lang="scss" scoped>
.chip-item-sceleton {
  ::v-deep .v-skeleton-loader__chip {
    height: 100% !important;
    width: 100% !important;
  }
}
</style>
<style lang="scss" scoped module>
.chipItemWrapper {
  // background-color: white;
  height: 30px;
  border-radius: 4px;
  margin: 3px 8px 3px 0;
  position: relative;
  .chipSelected {
    background-color: #4a4a4a !important;
    color: #f5f5f5 !important;
  }
  .chipDisabled {
    opacity: 0.4;
    pointer-events: none;
    user-select: none;
  }
  .chipItemSceleton {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 0;
    width: 100%;
    height: 100%;
  }
  .chipItem {
    --font-size: 12px;
    --padding-y: 8px;
    // --padding-x: calc(var(--padding-y) * 2);
    @include md {
      // --height: 44px;
      --font-size: 13px;
      // --padding: 24px;
    }
    height: 30px;
    z-index: 3;
    position: relative;
    font-size: var(--font-size);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    // margin: 3px 8px 3px 0;
    display: inline-block;
    padding: calc((30px - var(--font-size)) / 2) var(--padding-y); //var(--padding-y) var(--padding-x);
    border-radius: 4px;
    line-height: 1;
    text-decoration: none;
    color: $black;
    background-color: $white;
    max-width: 300px;

    &:hover {
      background-color: $black;
      color: $white;
    }
  }
}
</style>