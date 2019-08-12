<template>
  <v-app>
    <toolbar :menuItems="menuItems" @showDrawer="drawer = true" />
    <navigation-mobile
      :menuItems="menuItems"
      :drawer="drawer"
      @changeDrawer="(val) => drawer = val"
    />

    <v-content class="dash">
      <nuxt />
    </v-content>
    <my-footer class="pos-relative" />
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

export default {
  components: { Toolbar, NavigationMobile, MyFooter },
  computed: {
    menuItems() {
      return [
        {
          name: "Главная",
          to: "/"
        },
        {
          name: "Каталог",
          to: "/catalog",
          items: this.$store.state.sessionStorage.generalInfo.categories
            ? [
                ...this.$store.state.sessionStorage.generalInfo.categories,
                // { name: "Халяльная продукция", slug: "halal" },
                { name: "Акционная продукция", slug: "discount" }
              ]
            : []
        },
        {
          name: "Производители",
          to: "/manufacturers",
          items: this.$store.state.sessionStorage.generalInfo.manufacturers
        },
        {
          name: "О компании",
          to: "/about"
        },
        {
          name: "Контакты",
          to: "/contacts"
        }
      ];
    }
  },
  data() {
    return {
      drawer: false
    };
  }
};
</script>
