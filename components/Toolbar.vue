<template>
  <div>
    <!-- <portal to="toolbar"> -->
    <v-toolbar height="100px" fixed app>
      <div class="flex">
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

            <v-list :class="item.items.length > 8 ? 'two-columns' : ''">
              <v-list-tile
                class="list-item"
                active-class="text--accent"
                v-for="(child, index) in item.items"
                :key="index"
                nuxt
                :to="`${item.to}/${child.slug}`"
              >{{ child.name }}</v-list-tile>
              <!-- <v-list-tile
                  v-if="item.to==='/catalog'"
                  class="list-item"
                  active-class="text--accent"
                  nuxt
                  :to="`${item.to}/halal`"
                >
                  Халяльная продукция
                  <v-list-tile-avatar class="ml-auto">
                    <img style="width:45px" :src="require('~/assets/halal1.png')" />
                  </v-list-tile-avatar>
              </v-list-tile>-->
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
      <v-btn icon class="ml-1" :href="'tel:'+phone" large>
        <v-icon medium color="#95282a">phone</v-icon>
      </v-btn>
      <span class="d-none">{{basketLength}}</span>

      <v-badge color="#95282a" overlap :value="basketActive">
        <template v-slot:badge>{{basketLength}}</template>
        <v-btn icon class="ml-1" @click="basketDrawer=true" large :disabled="!basketActive">
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
    basketActive() {
      const isActive =
        Object.keys(this.$store.state.localStorage.basket).length > 0;
      if (!isActive) {
        this.basketDrawer = false;
      }
      return isActive;
      // return this.basketLength > 0;
    },
    basketLength() {
      const basketl = Object.values(
        this.$store.state.localStorage.basket
      ).reduce((acc, val) => {
        // console.log("TCL: basketLength -> val", val);
        return acc + val.count;
      }, 0);
      // console.log("TCL: basketLength -> basketLength", basketl);

      return basketl;
    },
    phone() {
      return this.$store.state.sessionStorage.generalInfo.contacts.phone;
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
