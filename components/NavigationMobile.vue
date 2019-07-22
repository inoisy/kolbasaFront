<template>
  <v-navigation-drawer :value="drawer" temporary fixed right touchless @input="change" class="pt-2">
    <v-subheader>НАВИГАЦИЯ</v-subheader>
    <v-list class="pt-0">
      <v-list-tile
        active-class="text--accent"
        v-for="item in menuItems"
        :key="item.name"
        :to="item.to"
        nuxt
        ripple
      >
        <v-list-tile-title>{{item.name}}</v-list-tile-title>
      </v-list-tile>
    </v-list>
    <div class="filter-wrapper px-3" v-if="$vuetify.breakpoint.smAndDown">
      <portal-target name="destination"></portal-target>
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
  props: ["menuItems", "drawer"]
};
</script>

<style>
</style>
