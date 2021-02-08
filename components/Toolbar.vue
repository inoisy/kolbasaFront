<template>
  <div :class="$style.appBar">
    <nuxt-link
      to="/"
      class="py-1 fill-height d-flex align-center"
      title="Логотип Альянс Фуд"
    >
      <v-img
        id="logo-img"
        :src="require('~/assets/img/logo1.png')"
        alt="Логотип Альянс Фуд"
        title="Логотип Альянс Фуд"
        max-height="100%"
        contain
      ></v-img>
      <v-img
        id="logo-text"
        class="mt-1 mx-1"
        :src="require('~/assets/img/logo2.png')"
        alt="Логотип Альянс Фуд"
        title="Логотип Альянс Фуд"
        max-height="80%"
        contain
      ></v-img>
    </nuxt-link>
    <v-spacer></v-spacer>
    <template v-for="(item, index) in menuItems">
      <v-menu
        :key="index"
        v-if="item.items && item.items.length > 0"
        class="fill-height hidden-sm-and-down d-flex"
        style="height: 100%"
        allow-overflow
        open-on-hover
        offset-y
        left
        z-index="3000"
        transition="slide-y-transition"
      >
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            class="fill-height ma-0 header-link hidden-sm-and-down"
            slot="activator"
            style="height: 100%"
            text
            tile
            nuxt
            :to="item.to"
            color="#95282a"
            :title="item.name"
          >
            {{ item.name }}
            <v-icon>{{ icons.mdiMenuDown }}</v-icon>
          </v-btn>
        </template>
        <v-list class="two-columns" color="white">
          <template v-for="(category, index) in item.items">
            <template
              v-if="
                category && category.children && category.children.length > 0
              "
            >
              <!-- :key="'list-group'+index"
                  class="list-item"-->
              <v-list-item
                :key="'list-group' + index"
                :to="`/catalog/${category.slug}`"
                :title="category.name"
                class="list-item"
              >
                <span style="line-height: normal; font-size: 15px">{{
                  category.name
                }}</span>
              </v-list-item>
              <v-list-item
                v-for="child in category.children"
                :key="child.id"
                :to="`/catalog/${child.slug}`"
                :title="child.name"
                class="list-item"
              >
                <span class="pl-4">{{ child.name }}</span>
              </v-list-item>
            </template>
            <v-list-item
              v-else
              class="list-item"
              active-class="text--accent"
              :key="index"
              nuxt
              :to="`${item.to}/${category.slug}`"
              :title="category.name"
              >{{ category.name }}</v-list-item
            >
          </template>
        </v-list>
      </v-menu>

      <v-btn
        v-else
        :to="item.to"
        :key="index"
        :title="item.name"
        class="ma-0 fill-height header-link hidden-sm-and-down"
        style="height: 100%"
        color="#95282a"
        text
        tile
        nuxt
        exact
      >
        {{ item.name }}
      </v-btn>
    </template>
    <!-- <client-only> -->
    <!-- {{ !(isMounted && isCart) }} -->
    <v-btn
      @click="$emit('show-basket')"
      :disabled="!(isMounted && isCart)"
      class="cart-wrap header-link"
      color="#95282a"
      :hover="false"
      text
    >
      <span v-if="summa > 0" class="cart-text mr-2">{{ summa }}&nbsp;р</span>
      <v-badge
        class="cart-badge"
        color="#95282a"
        :value="isMounted && isCart"
        overlap
        :content="cartLength"
      >
        <v-icon color="#95282a">{{ icons.mdiBasket }}</v-icon>
      </v-badge>
    </v-btn>
    <!-- </client-only> -->
    <v-btn
      @click="$emit('show-user')"
      icon
      class="ml-1"
      large
      title="Меню пользователя"
    >
      <v-icon medium color="#95282a">{{ icons.mdiAccount }}</v-icon>
    </v-btn>
    <v-btn
      @click="$emit('show-drawer')"
      icon
      class="ml-1 hidden-md-and-up"
      large
      title="Меню"
    >
      <v-icon medium color="#95282a">{{ icons.mdiMenu }}</v-icon>
    </v-btn>
  </div>
</template>
<style lang="scss" scoped module>
.appBar {
  padding: 0 12px;
  height: $toolbar-mobile-height;
  margin-top: 0px;
  left: 0px;
  right: 0px;
  background-color: whitesmoke;
  border-color: whitesmoke;
  box-shadow: 0px 2px 4px -1px rgb(0 0 0 / 20%),
    0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%);
  position: fixed;
  top: 0;
  z-index: 300;
  display: flex;
  align-items: center;
  @include md {
    height: $toolbar-desktop-height;
  }
}
</style>

<style lang="scss" scoped>
.extra-text {
  height: 42px !important;
  font-size: 0.8rem !important;
  line-height: 1.1 !important;
}

#header-top {
  background-color: #282828;
  height: 42px;
  justify-content: space-around;
}

.cart-wrap {
  height: 100% !important;

  .cart-badge {
    width: 40px;
    height: 40px;
    align-items: center;
    display: flex;
    justify-content: center;
    border-radius: 50%;
    background-color: #eeeeee;
    transition-duration: 0.28s;
  }

  .cart-text {
    position: relative;
    font-size: 16px;
    font-weight: 600;
    color: #95282a;
    white-space: nowrap;

    &:before {
      content: "";
      display: block;
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      border-bottom: 2px solid #95282a;
      width: 0;
      transition: width 0.1s ease-in;
    }
  }

  &:hover {
    .cart-badge {
      background-color: #d8b7b7;
    }

    .cart-text:before {
      width: 100%;
    }
  }
}

.two-columns {
  column-count: 2;
  max-width: 600px;
  position: relative;

  .list-item {
    float: left;
    line-height: 1;
    break-inside: avoid;
    width: 100%;
    min-height: 36px !important;
    height: 36px !important;
    line-height: normal;
    font-size: 14px;
  }
}

#logo-img {
  width: 50px;
  max-width: 50px;
}

#logo-text {
  width: 110px;
  max-width: 110px;
}

.header-link {
  font-size: 0.8rem !important;
  padding: 0 8px !important;
}

@media (min-width: 576px) {
  #logo-img {
    width: 65px;
    max-width: 65px;
  }

  #logo-text {
    width: 140px;
    max-width: 140px;
  }
}

@media (min-width: 960px) {
  #logo-img {
    width: 50px;
    max-width: 50px;
  }

  #logo-text {
    width: 120px;
    max-width: 120px;
  }

  // #header-top {
  // justify-content: space-between;
  // }
  .header-link {
    font-size: 0.8rem !important;
    padding: 0 6px !important;
  }
}

@media (min-width: 1199px) {
  #logo-img {
    width: 65px;
    max-width: 65px;
  }

  #logo-text {
    width: 130px;
    max-width: 130px;
  }

  .header-link {
    font-size: 0.85rem !important;
    padding: 0 12px !important;
  }
}
</style>

<script>
import { mdiMenuDown, mdiMenu, mdiAccount, mdiBasket } from "@mdi/js";
// icons: {
//   mdiAccount,
//   mdiPencil,
//   mdiShareVariant,
//   mdiDelete,
// },
export default {
  // props: ["menuItems"],
  data() {
    return {
      hideExtra: false,
      extraInfo: [
        {
          text: "РАБОТАЕМ ДЛЯ ВАС",
          img: require("~/assets/icons/interface.svg"),
        },
        {
          text: "ДОСТАВИМ БЕСПЛАТНО",
          img: require("~/assets/icons/commerce-and-shopping.svg"),
        },
        {
          text: "ЗА ОДИН ДЕНЬ",
          img: require("~/assets/icons/fast-delivery.svg"),
        },
        {
          text: "С СОБЛЮДЕНИЕМ ВСЕХ САНИТАРНЫХ НОРМ",
          img: require("~/assets/icons/guard.svg"),
        },
      ],
      icons: { mdiMenuDown, mdiMenu, mdiAccount, mdiBasket },
      isMounted: false,
    };
  },
  mounted() {
    // console.log("id", this.product.id);
    this.isMounted = true;
    // this.isCart = this.$store.getters.isCart;
    // console.log("isCart", this.isCart);
  },
  computed: {
    isCart() {
      // if(!this.isMounted){
      //   return false
      // }
      return this.$store.getters.isCart;
    },
    menuItems() {
      return this.$store.getters.menuItems;
    },
    // isMobile() {
    //   return this.$vuetify.breakpoint.smAndDown;
    // },
    summa() {
      if (!this.isMounted || !this.isCart) {
        console.log("noSumm");
        return 0;
      } else {
        return this.$store.getters.cartSumm;
      }
    },
    cartLength() {
      if (!this.isMounted || !this.isCart) {
        console.log("nolength");
        return 0;
      } else {
        const length = this.$store.getters.cartLength;
        console.log(
          "🚀 ~ file: Toolbar.vue ~ line 371 ~ cartLength ~ length",
          length
        );
        return length;
      }
    },
    basketLength() {
      let length;
      if (this.$store.state.localStorage.basket) {
        length = Object.keys(this.$store.state.localStorage.basket).length;
        if (length < 1) {
          this.basketDrawer = false;
        }
      }
      return length;
    },
    isBasket() {
      return this.basketLength && this.basketLength > 0;
    },
    phone() {
      return this.$store.state.sessionStorage.generalInfo &&
        this.$store.state.sessionStorage.generalInfo.contacts
        ? this.$store.state.sessionStorage.generalInfo.contacts.phone
        : "";
    },
  },
  methods: {
    onScroll() {
      if (window.scrollY > 150) {
        this.hideExtra = true;
      } else {
        this.hideExtra = false;
      }
    },
  },
};
</script>
