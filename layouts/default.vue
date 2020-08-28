<template>
  <v-app>
    <toolbar
      :menuItems="menuItems"
      @show-user="userDrawer=true"
      @show-drawer="drawer = true"
      @show-basket="basketDrawer=true"
    />
    <navigation-mobile
      :menuItems="menuItems"
      :drawer="drawer"
      @changeDrawer="(val) => drawer = val"
    />
    <v-main class="dash">
      <nuxt />
    </v-main>
    <my-footer class="pos-relative" :menuItems="menuItems" />
    <v-navigation-drawer v-model="userDrawer" temporary fixed right width="550px">
      <user @close="userDrawer=false" />
    </v-navigation-drawer>
    <client-only>
      <v-navigation-drawer v-model="basketDrawer" temporary fixed right width="550px">
        <busket @close="basketDrawer=false" />
      </v-navigation-drawer>
    </client-only>
  </v-app>
</template>
<style lang="stylus" scoped>
.dash {
  position: relative;
  min-height: 80vh;

  &:after {
    content: '';
    display: block;
    width: 100%;
    background-image: url('~assets/img/stroke.png');
    background-repeat: no-repeat;
    background-position: center;
    height: 45px;
    position: absolute;
    bottom: 0px;
    background-size: auto;
  }
}

@media (min-width: 960px) {
  .dash {
    &:after {
      background-size: contain;
    }
  }
}
</style>

<script>
import Toolbar from "~/components/Toolbar";
import NavigationMobile from "~/components/NavigationMobile";
import MyFooter from "~/components/Footer";
import Busket from "~/components/Busket";
import User from "~/components/User";

export default {
  components: { Toolbar, NavigationMobile, MyFooter, Busket, User },
  name: "default",
  computed: {
    menuItems() {
      return [
        {
          name: "Главная",
          to: "/",
        },
        {
          name: "Каталог",
          to: "/catalog",
          items: [
            ...this.$store.getters.getParentCategories,
            { name: "Акционная продукция", slug: "discount" },
            { name: "Халяльная продукция", slug: "halal" },
          ],
        },
        {
          name: "Производители",
          to: "/manufacturers",
          items: this.$store.state.sessionStorage.generalInfo.manufacturers,
        },
        {
          name: "О компании",
          to: "/about",
        },
        {
          name: "Доставка",
          to: "/delivery",
        },
        {
          name: "Контакты",
          to: "/contacts",
        },
      ];
    },
  },
  data() {
    return {
      drawer: false,
      basketDrawer: false,
      userDrawer: false,
    };
  },
};
</script>
