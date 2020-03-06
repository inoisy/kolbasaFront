<template>
  <v-app>
    <toolbar :menuItems="menuItems" @showDrawer="drawer = true" @showBasket="basketDrawer=true" />
    <navigation-mobile
      :menuItems="menuItems"
      :drawer="drawer"
      @changeDrawer="(val) => drawer = val"
    />
    <v-content class="dash">
      <nuxt />
    </v-content>
    <my-footer class="pos-relative" :menuItems="menuItems" />
    <v-navigation-drawer v-model="basketDrawer" temporary fixed right width="550px">
      <client-only>
        <busket v-on:close="basketDrawer=false" />
      </client-only>
    </v-navigation-drawer>
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

export default {
  components: { Toolbar, NavigationMobile, MyFooter, Busket },
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
          items: [
            ...this.$store.getters.getParentCategories,
            { name: "Акционная продукция", slug: "discount" },
            { name: "Халяльная продукция", slug: "halal" }
          ]
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
  mounted() {
    // var ZCallbackWidgetLinkId = "a873333942ec7bcaefc0020ad11672fd";
    // var ZCallbackWidgetDomain = "my.zadarma.com";
    // // (function() {
    // //  src=
    // var jq = document.createElement("script");
    // jq.type = "text/javascript";
    // jq.charset = "utf-8";
    // jq.defer = true;
    // jq.async = false;
    // jq.src = "https://code.jquery.com/jquery-1.12.4.min.js";
    // var sc = document.getElementsByTagName("script")[0];
    // // console.log("TCL: mounted -> sc", document.getElementsByTagName("script"));
    // if (sc) sc.parentNode.insertBefore(jq, sc);
    // else document.documentElement.firstChild.appendChild(jq);
    // var lt = document.createElement("script");
    // lt.type = "text/javascript";
    // lt.charset = "utf-8";
    // lt.async = false;
    // lt.defer = true;
    // lt.src =
    //   "https://" + ZCallbackWidgetDomain + "/callbackWidget/js/main.min.js";
    // var sc = document.getElementsByTagName("script")[0];
    // if (jq) jq.parentNode.appendChild(lt, sc);
    // else document.documentElement.firstChild.appendChild(lt);
    // console.log("TCL: mounted -> sc", document.getElementsByTagName("script"));
    // })();
  },

  data() {
    return {
      drawer: false,
      basketDrawer: false
    };
  }
};
</script>
