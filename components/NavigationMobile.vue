<template>
  <v-navigation-drawer :value="drawer" temporary fixed right touchless @input="change" class="pt-2">
    <v-subheader>НАВИГАЦИЯ</v-subheader>
    <!-- {{menuItems}} -->
    <v-list class="pt-0">
      <template v-for="(item,i) in menuItems">
        <!-- {{item}} -->
        <v-list-group v-if="item.items && item.items.length>0" :key="i">
          <v-list-tile slot="activator" :to="item.to">
            <v-list-tile-content>{{ item.name}}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile
            v-for="product in item.items"
            :key="product.name"
            nuxt
            exact
            :to="`${item.to}/${product.slug}`"
          >
            <v-list-tile-content class="ml-4">{{ product.name}}</v-list-tile-content>
          </v-list-tile>
          <v-list-tile
            v-if="item.to==='/catalog'"
            class="list-item"
            active-class="text--accent"
            nuxt
            :to="`${item.to}/halal`"
          >
            <v-list-tile-content class="ml-4">Халяльная продукция</v-list-tile-content>
          </v-list-tile>
        </v-list-group>
        <v-list-tile
          v-else
          active-class="text--accent"
          :key="item.name"
          :to="item.to"
          nuxt
          ripple
          exact
        >
          <v-list-tile-title>{{item.name}}</v-list-tile-title>
        </v-list-tile>
      </template>
      <!-- <v-list-tile
        active-class="text--accent"
        v-for="item in menuItems"
        :key="item.name"
        :to="item.to"
        nuxt
        ripple
      >
        <v-list-tile-title>{{item.name}}</v-list-tile-title>
      </v-list-tile>-->
    </v-list>
    <div class="filter-wrapper px-3" v-if="isModal" v-show="$vuetify.breakpoint.smAndDown">
      <portal-target name="filters"></portal-target>
    </div>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      drawerInner: false
    };
  },
  methods: {
    change(val) {
      this.$emit("changeDrawer", val);
    }
  },
  computed: {
    isModal() {
      return this.$route.name === "catalog-category-slug" &&
        this.$route.params.slug
        ? false
        : true;
    }
  },
  props: ["menuItems", "drawer"]
};
</script>

<style>
</style>
