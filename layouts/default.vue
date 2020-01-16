<template>
  <v-app>
    <!-- <div>
      <img src="https://mc.yandex.ru/watch/54918895" style="position:absolute; left:-9999px;" alt />
    </div> -->
    <toolbar :menuItems="menuItems" @showDrawer="drawer = true" />
    <navigation-mobile
      :menuItems="menuItems"
      :drawer="drawer"
      @changeDrawer="(val) => drawer = val"
    />

    <v-content class="dash">
      <nuxt />
    </v-content>
    <my-footer class="pos-relative" :menuItems="menuItems" />
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
                ...this.$store.state.sessionStorage.generalInfo.categories.filter(
                  item => item.parent.length === 0
                ),
                { name: "Акционная продукция", slug: "discount" },
                { name: "Халяльная продукция", slug: "halal" }
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
  // mounted() {
  //   (function(m, e, t, r, i, k, a) {
  //     m[i] =
  //       m[i] ||
  //       function() {
  //         (m[i].a = m[i].a || []).push(arguments);
  //       };
  //     m[i].l = 1 * new Date();
  //     (k = e.createElement(t)),
  //       (a = e.getElementsByTagName(t)[0]),
  //       (k.async = 1),
  //       (k.src = r),
  //       a.parentNode.insertBefore(k, a);
  //   })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

  //   ym(54918895, "init", {
  //     clickmap: true,
  //     trackLinks: true,
  //     accurateTrackBounce: true,
  //     webvisor: true
  //   });
  // },
  data() {
    return {
      drawer: false
    };
  }
};
</script>
