<template>
  <v-app-bar
    app
    fixed
    class="pa-0 main-header"
    style="z-index: 300"
    :prominent="!hideExtra"
    short
    v-scroll="onScroll"
    :height="hideExtra ? '64px' : '106px'"
  >
    <div class="d-flex w-100 fill-height" style="flex-direction: column;">
      <v-expand-transition>
        <div
          id="header-top"
          class="d-flex w-100 px-4"
          v-if="!hideExtra"
          transition="slide-y-transition"
        >
          <v-hover
            v-slot:default="{ hover }"
            class="fill-height d-flex align-center"
            style
            v-for="(item,i) in extraInfo"
            :key="`extra-${i}`"
            :disabled="!isMobile"
          >
            <nuxt-link to="/delivery">
              <img :src="item.img" style="width:35px; height:35px; object-fit: contain;" />
              <v-subheader class="extra-text pr-0" dark v-show="!isMobile || hover">{{item.text}}</v-subheader>
            </nuxt-link>
          </v-hover>
        </div>
      </v-expand-transition>
      <div class="w-100 d-flex px-3 align-center" style="height: 64px; ">
        <nuxt-link to="/" class="py-1 fill-height d-flex align-center" title="Логотип Альянс Фуд">
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
        <template v-for="(item,index) in menuItems">
          <v-menu
            :key="index"
            v-if="item.items && item.items.length>0"
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
                style="height: 100%;"
                text
                tile
                nuxt
                :to="item.to"
                color="#95282a"
                :title="item.name"
              >
                {{item.name}}
                <v-icon>arrow_drop_down</v-icon>
              </v-btn>
            </template>
            <v-list class="two-columns pa-0" color="white">
              <template v-for="(category, index) in item.items">
                <div
                  :key="'list-group'+index"
                  class="list-item"
                  v-if="category && category.children && category.children.length > 0"
                >
                  <v-list-item
                    :to="`/catalog/${category.slug}`"
                    :title="category.name"
                    style="min-height: 40px !important"
                    height="40px"
                  >
                    <span style="line-height: normal; font-size: 15px;">{{ category.name}}</span>
                  </v-list-item>
                  <v-list-item
                    v-for="child in category.children"
                    :key="child.id"
                    :to="`/catalog/${child.slug}`"
                    :title="child.name"
                    style="min-height: 36px !important"
                    height="36px"
                  >
                    <span class="pl-4" style="line-height: normal; font-size: 14px;">{{child.name}}</span>
                  </v-list-item>
                </div>
                <v-list-item
                  v-else
                  class="list-item"
                  active-class="text--accent"
                  :key="index"
                  nuxt
                  :to="`${item.to}/${category.slug}`"
                  :title="category.name"
                  style="line-height: normal; font-size: 15px;min-height: 36px !important"
                  height="36px"
                >{{ category.name }}</v-list-item>
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
          >{{item.name}}</v-btn>
        </template>
        <client-only>
          <v-btn
            @click="$emit('showBasket')"
            :disabled="!isBasket"
            class="cart-wrap header-link"
            color="#95282a"
            :hover="false"
            text
          >
            <span v-if="summa > 0" class="cart-text mr-2">{{summa}}&nbsp;р</span>
            <v-badge
              class="cart-badge"
              color="#95282a"
              :value="isBasket"
              overlap
              :content="basketLength"
            >
              <v-icon color="#95282a">shopping_basket</v-icon>
            </v-badge>
          </v-btn>
        </client-only>
        <v-btn icon class="ml-1 hidden-md-and-up" @click="$emit('showDrawer')" large title="Меню">
          <v-icon medium color="#95282a">menu</v-icon>
        </v-btn>
      </div>
    </div>
  </v-app-bar>
</template>
<style lang="stylus" scoped>
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
      content: '';
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
    break-inside: avoid-column;
    width: 100%;
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
export default {
  props: ["menuItems"],
  data() {
    return {
      hideExtra: false,
      extraInfo: [
        {
          text: "РАБОТАЕМ ДЛЯ ВАС",
          img: require("~/assets/icons/interface.svg")
        },
        {
          text: "ДОСТАВИМ БЕСПЛАТНО",
          img: require("~/assets/icons/commerce-and-shopping.svg")
        },
        {
          text: "ЗА ОДИН ДЕНЬ",
          img: require("~/assets/icons/fast-delivery.svg")
        },
        {
          text: "С СОБЛЮДЕНИЕМ ВСЕХ САНИТАРНЫХ НОРМ",
          img: require("~/assets/icons/guard.svg")
        }
      ]
    };
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.smAndDown;
    },
    summa() {
      return this.$store.getters.summa;
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
    }
  },
  methods: {
    onScroll() {
      if (window.scrollY > 150) {
        this.hideExtra = true;
      } else {
        this.hideExtra = false;
      }
    }
  }
};
</script>
