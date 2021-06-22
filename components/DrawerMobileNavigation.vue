<template>
  <v-navigation-drawer
    class="navigation-drawer-wrapper pt-2"
    :value="show"
    temporary
    fixed
    right
    touchless
    width="22.5rem"
    @input="change"
  >
    <v-subheader>НАВИГАЦИЯ</v-subheader>
    <v-list class="pt-0">
      <template v-for="menuItem in menuItems">
        <v-list-group
          v-if="menuItem.items && menuItem.items.length > 0"
          :key="menuItem.to"
        >
          <v-list-item
            slot="activator"
            :to="menuItem.to"
            :title="menuItem.name"
            exact
          >
            <v-list-item-content>
              {{ menuItem.name }}
            </v-list-item-content>
          </v-list-item>
          <v-list
            class="pa-0"
            dense
            v-for="child in menuItem.items"
            :key="child.name"
          >
            <v-list-group v-if="child.children && child.children.length">
              <v-list-item
                slot="activator"
                class="pl-8"
                nuxt
                exact
                dense
                :to="`/${menuItem.slug}/${child.slug}`"
                :title="child.name"
              >
                <v-list-item-title>
                  {{ child.name }}
                </v-list-item-title>
              </v-list-item>
              <v-list class="pa-0">
                <v-list-item
                  v-for="grandChild in child.children"
                  :key="grandChild.id"
                  nuxt
                  exact
                  dense
                  :to="`/${menuItem.slug}/${grandChild.slug}`"
                  :title="grandChild.name"
                >
                  <v-list-item-title class="pl-10">
                    {{ grandChild.name }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-list-group>
            <v-list-item
              v-else
              :title="child.name"
              nuxt
              exact
              dense
              :to="`${menuItem.to}/${child.slug}`"
            >
              <v-list-item-title class="pl-4">
                {{ child.name }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-list-group>
        <v-list-item
          v-else
          active-class="text--accent"
          :key="menuItem.name"
          :to="`/${menuItem.slug}`"
          nuxt
          ripple
          exact
          :title="menuItem.name"
        >
          <v-list-item-title>{{ menuItem.name }}</v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<style lang="scss" scoped>
.navigation-drawer-wrapper {
  ::v-deep .v-list {
    .v-list-group__header__append-icon {
      width: 24px !important;
      min-width: 24px !important;
    }
    .v-list-group {
      .v-list-group {
        .v-list-group__header {
          padding-left: 0;
        }
      }
    }
  }
}
</style>
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
      return this.$store.getters["info/menuItems"];
    },
  },
};
</script>
