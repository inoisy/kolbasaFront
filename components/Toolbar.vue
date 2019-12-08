<template>
  <div>
    <!-- <portal to="toolbar"> -->
    <v-toolbar height="100px" fixed app>
      <div class="flex mr-2">
        <nuxt-link to="/" class="py-1 fill-height ml-auto d-inline-flex">
          <img :src="require('~/assets/img/logo1.png')" alt="logo" />
        </nuxt-link>
      </div>

      <div
        class="hidden-sm-and-down fill-height ml-3 lumber-rough toolbar-inner"
        style="display: flex"
      >
        <template v-for="(item,index) in menuItems">
          <v-menu
            :key="index"
            v-if="item.items && item.items.length>0"
            class="fill-height"
            style="display:flex"
            open-on-hover
            offset-y
            left
            z-index="3000"
            transition="slide-y-transition"
          >
            <v-btn
              class="fill-height ma-0 header-link"
              slot="activator"
              flat
              nuxt
              :to="item.to"
              color="#95282a"
            >
              {{item.name}}
              <v-icon>arrow_drop_down</v-icon>
            </v-btn>

            <v-list :class="item.items && item.items.length > 6 ? 'two-columns' : ''">
              <template v-for="(category, index) in item.items">
                <div
                  :key="'list-group'+index"
                  v-if="category && category.children && category.children.length > 0"
                >
                  <v-list-tile :to="`/catalog/${category.slug}`">
                    <span style="line-height: 100%">{{ category.name}}</span>
                  </v-list-tile>
                  <v-list-tile
                    v-for="child in category.children"
                    :key="child.id"
                    :to="`/catalog/${child.slug}`"
                  >
                    <span class="pl-4">{{child.name}}</span>
                  </v-list-tile>
                </div>
                <v-list-tile
                  v-else
                  class="list-item"
                  active-class="text--accent"
                  :key="index"
                  nuxt
                  :to="`${item.to}/${category.slug}`"
                >{{ category.name }}</v-list-tile>
              </template>
            </v-list>
          </v-menu>

          <v-btn
            v-else
            flat
            nuxt
            exact
            :key="index"
            class="ma-0 fill-height header-link"
            :to="item.to"
            color="#95282a"
          >{{item.name}}</v-btn>
        </template>
      </div>
      <!-- <v-btn icon class="ml-1" large> -->
      <div class="ya-phone-icon ma-1">
        <a :href="'tel:'+phone" class="pa-2">
          <i
            aria-hidden="true"
            class="v-icon material-icons theme--light"
            style="font-size: 28px; color: rgb(149, 40, 42); caret-color: rgb(149, 40, 42);"
          >phone</i>
        </a>
      </div>

      <!-- <v-icon medium color="#95282a">phone</v-icon> -->
      <!-- </v-btn> -->
      <v-badge color="#95282a" overlap :value="basketLength>0">
        <template v-slot:badge>{{basketLength}}</template>
        <v-btn icon class="ml-1" @click="basketDrawer=true" large :disabled="basketLength<1">
          <v-icon medium color="#95282a">shopping_basket</v-icon>
        </v-btn>
      </v-badge>

      <v-btn icon class="ml-1 hidden-md-and-up" @click="$emit('showDrawer')" large>
        <v-icon medium color="#95282a">menu</v-icon>
      </v-btn>
    </v-toolbar>
    <!-- </portal>
    <portal-target name="toolbar" v-if="isModal"></portal-target>-->
    <v-navigation-drawer
      v-model="basketDrawer"
      temporary
      fixed
      left
      :width="$vuetify.breakpoint.mdAndUp ? '700px' : '500px'"
    >
      <div class="close-btn-wrap mr-4 d-flex" style="height:100px">
        <v-btn class="close-btn mx-0 my-auto" outline icon large @click="basketDrawer=false">
          <v-icon>close</v-icon>
        </v-btn>
      </div>
      <no-ssr>
        <busket />
      </no-ssr>
    </v-navigation-drawer>
  </div>
</template>
<style lang="stylus" scoped>
.two-columns {
  column-count: 2;
  max-width: 600px;

  .list-item {
    float: left;
    page-break-inside: avoid;
    break-inside: avoid;
    width: 100%;
    // max-width: 300px;
  }
}

.close-btn-wrap {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;
  height: 64px;
}

@media (min-width: 1264px) {
  .toolbar-inner, .toolbar-inner>*, .toolbar-inner>*>*, .toolbar-inner>*>*>* {
    font-size: 1.3rem !important;
  }
}
</style>

<script>
import Busket from "~/components/Busket";
export default {
  props: ["menuItems"],
  data() {
    return {
      basketDrawer: false
      // isModal:
    };
  },
  components: { Busket },
  computed: {
    basketLength() {
      // const basketObj = this.$store.state.localStorage.basket;
      let length;
      if (this.$store.state.localStorage.basket) {
        length = Object.keys(this.$store.state.localStorage.basket).length;
        if (length < 1) {
          this.basketDrawer = false;
        }
      }

      return length;
    },
    phone() {
      return this.$store.state.sessionStorage.generalInfo &&
        this.$store.state.sessionStorage.generalInfo.contacts
        ? this.$store.state.sessionStorage.generalInfo.contacts.phone
        : "";
    },
    isModal() {
      return this.$route.name === "catalog-category-slug" &&
        this.$route.params &&
        this.$route.params.slug
        ? false
        : true;
    }
  }
};
</script>
