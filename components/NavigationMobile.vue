<template>
  <v-navigation-drawer :value="drawer" temporary fixed right touchless @input="change" class="pt-2">
    <v-subheader>НАВИГАЦИЯ</v-subheader>
    <v-list class="pt-0">
      <template v-for="(item,i) in menuItems">
        <v-list-group v-if="item.items && item.items.length>0" :key="item.to">
          <v-list-tile slot="activator" :to="item.to">
            <v-list-tile-content>{{ item.name}}</v-list-tile-content>
          </v-list-tile>

          <div v-for="product in item.items" :key="product.name">
            <div v-if="product.children && product.children.length > 0">
              <v-list-tile nuxt exact :to="`${item.to}/${product.slug}`">
                <span class="pl-3">{{ product.name}}</span>
              </v-list-tile>
              <v-list-tile
                v-for="child in product.children"
                :key="child.id"
                nuxt
                exact
                :to="`${item.to}/${child.slug}`"
              >
                <span class="pl-5">{{child.name}}</span>
              </v-list-tile>
            </div>
            <v-list-tile nuxt exact :to="`${item.to}/${product.slug}`" v-else>
              <span class="pl-3">{{ product.name}}</span>
            </v-list-tile>
          </div>
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
