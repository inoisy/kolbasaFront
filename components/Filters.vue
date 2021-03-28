<template>
  <div :class="$style.chipsWrapper">
    <div :class="$style.chipHeader">
      <div style="position: relative">
        <span
          v-text="filterName"
          :style="!isData && 'visibility: hidden'"
        ></span>
        <v-skeleton-loader
          v-if="!isData"
          :class="$style.headerSceleton"
          class="header-sceleton"
          type="text"
          :boilerplate="boilerplate"
        />
        <!--  -->
      </div>
    </div>
    <!-- :boilerplate="boilerplate" -->
    <div :class="$style.chipItemWrapper">
      <nuxt-link
        :style="!isData && 'visibility: hidden'"
        :class="[$style.chipItem, filterAllDisabled && $style.chipDisabled]"
        :exact-active-class="$style.chipSelected"
        :to="{ query: false }"
        @click.native="change(null)"
      >
        Все {{ filterName }}
      </nuxt-link>
      <!-- <div > -->
      <v-skeleton-loader
        v-if="!isData"
        :class="$style.chipItemSceleton"
        class="chip-item-sceleton"
        type="chip"
        :boilerplate="boilerplate"
      />
    </div>
    <div
      :class="$style.chipItemWrapper"
      v-for="item in items"
      :key="`filter-${filterSlug}-${item._id}`"
    >
      <nuxt-link
        :style="!isData && 'visibility: hidden'"
        :class="$style.chipItem"
        :exact-active-class="$style.chipSelected"
        exact
        :to="{ query: { [filterSlug]: item.slug } }"
        @click.native="change(item)"
      >
        {{ item.name }}
      </nuxt-link>
      <v-skeleton-loader
        v-if="!isData"
        :class="$style.chipItemSceleton"
        class="chip-item-sceleton"
        type="chip"
        :boilerplate="boilerplate"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    filterName: {
      type: String,
      required: true,
    },
    filterSlug: {
      type: String,
      required: true,
    },
    filterAllDisabled: {
      type: Boolean,
      required: true,
    },
    isData: {
      type: Boolean,
      default: true,
    },
    boilerplate: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    change(item) {
      this.$emit("change", item);
    },
  },
};
</script>
<style lang="scss" scoped>
.header-sceleton {
  ::v-deep .v-skeleton-loader__text {
    margin-bottom: 0 !important;
    height: 100% !important;
    width: 100% !important;
  }
}

.chip-item-sceleton {
  ::v-deep .v-skeleton-loader__chip {
    // height: 100% !important;
    height: 100% !important;
    width: 100% !important;
    // background: none;
    // position: relative;
    // background-color: white;
  }
}
</style>
<style lang="scss" scoped module>
.headerSceleton {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
.chipSelected {
  background-color: #4a4a4a !important;
  color: #f5f5f5 !important;
}
.chipDisabled {
  opacity: 0.4;
  pointer-events: none;
  user-select: none;
}
.chipsWrapper {
  //   white-space: normal;
  flex-wrap: wrap;
  max-width: 100%;
  padding: 8px 0;
  display: flex;
  flex: 1 0 auto;
  position: relative;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  .chipHeader {
    width: 100%;
    text-transform: uppercase;
    font-family: $heading-font-family;
    font-weight: bold;
    font-size: 16px;
    color: $black;
    align-items: center;
    display: flex;
    height: 48px;
    // padding: 0 16px 0 16px;
  }
  .chipItemWrapper {
    // background-color: white;
    height: 30px;
    border-radius: 4px;
    margin: 3px 8px 3px 0;
    position: relative;
    // &:before {
    //   content: "";
    //   display: block;
    //   background-color: white;
    //   border-radius: 4px;
    //   position: absolute;
    //   bottom: 0;
    //   left: 0;
    //   right: 0;
    //   top: 0;
    //   width: 100%;
    //   height: 100%;
    //   z-index: 0;
    // }
    .chipItemSceleton {
      // background-color: white;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 0;
      width: 100%;
      height: 100%;
    }
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
  //   .chip {
  //     margin: 4px 8px 4px 0;
  //     ::v-deep span {
  //       white-space: nowrap !important;
  //       overflow: hidden !important;
  //       text-overflow: ellipsis !important;
  //       height: auto;
  //       display: inline;
  //     }
  //   }
}
</style>