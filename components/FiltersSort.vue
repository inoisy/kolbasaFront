<template>
  <div>
    <!-- <template v-if="isData && isMounted"> -->
    <v-btn
      id="sort"
      style="position: relative"
      block
      :disabled="!isData || !isMounted"
    >
      <template>
        <v-icon left dark>{{ sortIcon }}</v-icon>
        <span :style="!isData || !isMounted ? 'visibility: hidden' : ''">
          {{ sort.title }}
        </span>
      </template>
    </v-btn>

    <v-menu v-if="isData && isMounted" activator="#sort" offset-y>
      <v-list>
        <v-list-item
          v-for="(item, index) in sortItems"
          :key="`sort-${index}`"
          :disabled="sort.title === item.title"
          @click="change(item)"
        >
          <v-list-item-title>
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <!-- <filters-sort-sceleton v-else :boilerplate="boilerplate" /> -->
  </div>
</template>

<script>
import { mdiSortVariant } from "@mdi/js";

export default {
  props: {
    isData: {
      type: Boolean,
      default: true,
    },
    boilerplate: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {
    this.isMounted = true;
  },
  methods: {
    change(item) {
      if (this.sort.value !== item.value) {
        this.$emit("change", item);
      }
    },
  },
  computed: {
    sort() {
      return this.$store.state.category.sort;
    },
  },
  data() {
    return {
      sortIcon: mdiSortVariant,
      sortItems: this.$store.state.category.sortItems,
      isMounted: false,
    };
  },
};
</script>