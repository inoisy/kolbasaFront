<template>
  <v-navigation-drawer
    :value="show"
    temporary
    fixed
    right
    touchless
    class="pt-2"
    width="22.5rem"
    @input="change"
  >
    <v-subheader>НАВИГАЦИЯ</v-subheader>
    <v-list class="pt-0">
      <template v-for="item in menuItems">
        <v-list-group v-if="item.items && item.items.length > 0" :key="item.to">
          <v-list-item slot="activator" :to="item.to" :title="item.name">
            <v-list-item-content>{{ item.name }}</v-list-item-content>
          </v-list-item>

          <div v-for="product in item.items" :key="product.name">
            <div v-if="product.children && product.children.length > 0">
              <v-list-item
                nuxt
                exact
                dense
                :to="`${item.to}/${product.slug}`"
                :title="product.name"
              >
                <v-list-item-title class="pl-6">{{
                  product.name
                }}</v-list-item-title>
              </v-list-item>
              <v-list-item
                v-for="child in product.children"
                :key="child.id"
                nuxt
                exact
                dense
                :to="`${item.to}/${child.slug}`"
                :title="child.name"
              >
                <v-list-item-title class="pl-10">{{
                  child.name
                }}</v-list-item-title>
              </v-list-item>
            </div>
            <v-list-item
              v-else
              :title="product.name"
              nuxt
              exact
              dense
              :to="`${item.to}/${product.slug}`"
            >
              <v-list-item-title class="pl-6">{{
                product.name
              }}</v-list-item-title>
            </v-list-item>
          </div>
        </v-list-group>
        <v-list-item
          v-else
          active-class="text--accent"
          :key="item.name"
          :to="item.to"
          nuxt
          ripple
          exact
          :title="item.name"
        >
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    show: { type: Boolean, default: false },
  },
  methods: {
    change(val) {
      if (!val) {
        this.$emit("close");
      }
    },
  },
  computed: {
    menuItems() {
      return this.$store.getters.menuItems;
    },
  },
};
</script>
