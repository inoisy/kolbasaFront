<template>
  <!-- <div> -->
  <!-- <v-subheader class="pl-0 mt-2">{{ filterName }}</v-subheader> -->
  <!-- <v-chip-group column mandatory> -->
  <div :class="$style.chipsWrapper">
    <!-- chipsWrapper -->
    <div :class="$style.chipHeader" v-text="filterName" />
    <nuxt-link
      :class="[$style.chipItem, filterAllDisabled && $style.chipDisabled]"
      :exact-active-class="$style.chipSelected"
      :to="{ query: false }"
      @click.native="change(null)"
    >
      Все {{ filterName }}
    </nuxt-link>
    <nuxt-link
      v-for="item in items"
      :key="`filter-${filterSlug}-${item._id}`"
      :class="$style.chipItem"
      :exact-active-class="$style.chipSelected"
      exact
      :to="{ query: { [filterSlug]: item.slug } }"
      @click.native="change(item)"
    >
      {{ item.name }}
    </nuxt-link>
    <!-- v-ripple="!filterAllDisabled" -->
    <!-- v-ripple -->
    <!-- <br />
    <v-chip
      :class="$style.chip"
      color="#f5f5f5"
      :exact-active-class="$style.chipSelected"
      exact
      label
      :to="{ query: false }"
      :disabled="filterAllDisabled"
      @click="change(null)"
    >
      Все {{ filterName }}
    </v-chip>
    <v-chip
      v-for="item in items"
      :key="item._id"
      :class="$style.chip"
      color="#f5f5f5"
      :exact-active-class="$style.chipSelected"
      exact
      label
      :to="{ query: { [filterSlug]: item.slug } }"
      @click="change(item)"
    >
      {{ item.name }}
    </v-chip> -->
  </div>
  <!-- </v-chip-group> -->
  <!-- </div> -->
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
  },
  methods: {
    change(item) {
      //   console.log("🚀 ~ file: Filters.vue ~ line 81 ~ change ~ item", item);
      this.$emit("change", item);
    },
  },
};
</script>
<style lang="scss" scoped module>
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

  .chipItem {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 3px 8px 3px 0;
    display: inline-block;
    padding: 5px 15px;
    border-radius: 4px;
    font-size: 14px;
    line-height: 22px;
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