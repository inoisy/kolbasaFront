<template>
  <div>
    <template v-if="isData && isMounted">
      <v-btn id="sort" style="position: relative" block>
        <v-icon left dark>{{ sortIcon }}</v-icon>
        {{ sort.title }}
      </v-btn>

      <v-menu activator="#sort" offset-y>
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
    </template>
    <filters-sort-sceleton v-else :boilerplate="boilerplate" />
  </div>
</template>

<script>
import { mdiSortVariant } from "@mdi/js";

export default {
  props: {
    // sortItems: {
    //   type: Array,
    //   required: true,
    // },
    // selectedItemTitle: {
    //   type: String,
    //   required: true,
    // },
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
    // async sortChange(item) {
    //   if (this.sort.value !== item.value) {
    //   }},
    change(item) {
      if (this.sort.value !== item.value) {
        this.$emit("change", item);
      }
    },
  },
  computed: {
    sort() {
      return this.$store.state.localStorage.category.sort;
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
      sortItems: this.$store.state.localStorage.category.sortItems,
      isMounted: false,
    };
  },
};
</script>