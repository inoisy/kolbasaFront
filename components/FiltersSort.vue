<template>
  <div>
    <v-btn id="sort" style="position: relative" block>
      <v-icon left dark>{{ sortIcon }}</v-icon>
      {{ selectedItemTitle }}
    </v-btn>
    <v-menu activator="#sort" offset-y>
      <v-list>
        <v-list-item
          v-for="(item, index) in sortItems"
          :key="`sort-${index}`"
          :disabled="item.title === selectedItemTitle"
          @click="change(item)"
        >
          <v-list-item-title>
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
import { mdiSortVariant } from "@mdi/js";

export default {
  props: {
    sortItems: {
      type: Array,
      required: true,
    },
    selectedItemTitle: {
      type: String,
      required: true,
    },
  },
  methods: {
    change(val) {
      this.$emit("change", val);
    },
  },
  data() {
    //     const sortItems = [
    //   { title: "По алфавиту", value: "name:asc", slug: "name" },
    //   { title: "По популярности", value: "rating:desc", slug: "rating" },
    //   { title: "Cначала дорогие", value: "priceNum:desc", slug: "pricedesc" },
    //   { title: "Cначала дешевые", value: "priceNum:asc", slug: "priceasc" },
    // ];
    return {
      sortIcon: mdiSortVariant,
    };
  },
};
</script>