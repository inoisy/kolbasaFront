<template>
  <div :class="$style.appBar">
    <!-- <LazyHydrate when-idle> -->
    <div :class="$style.appBarInner">
      <nuxt-link
        :class="$style.logoWrapper"
        to="/"
        class="py-1 fill-height d-flex align-center"
        title="Логотип Альянс Фуд"
      >
        <v-img
          id="logo-img"
          :src="require('~/assets/images/logo1.png')"
          alt="Логотип Альянс Фуд"
          title="Логотип Альянс Фуд"
          max-height="100%"
          contain
        />
        <v-img
          id="logo-text"
          class="mt-1 mx-1"
          :src="require('~/assets/images/logo2.png')"
          alt="Логотип Альянс Фуд"
          title="Логотип Альянс Фуд"
          max-height="80%"
          contain
        />
      </nuxt-link>
      <v-spacer></v-spacer>
      <template v-if="isMounted && !isMobile">
        <v-btn
          v-for="(item, index) in menuItems"
          v-bind="{
            ...(!item.disable ? { to: `/${item.slug}` } : null),
          }"
          :key="item.slug + index"
          :id="item.slug"
          class="fill-height ma-0 header-link hidden-sm-and-down"
          style="height: 100%"
          text
          tile
          color="#95282a"
          :title="item.name"
        >
          {{ item.name }}
          <v-icon v-if="item.isChild" style="margin-right: -8px">
            $dropdown
          </v-icon>
        </v-btn>
      </template>

      <v-btn
        @click="$emit('show-basket')"
        :disabled="!(isMounted && isCart)"
        class="cart-wrap"
        color="#95282a"
        :hover="false"
        text
      >
        <span v-if="summa > 0" class="cart-text mr-2">
          {{ summa }}&nbsp;&#8381;
        </span>
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
        <v-icon medium color="#95282a">$menu</v-icon>
      </v-btn>
    </div>
    <!-- </LazyHydrate> -->
    <lazy-toolbar-catalog-menu
      v-if="isMounted && !isMobile"
      :items="menuItems[0].items"
    />
    <lazy-toolbar-menu
      v-if="isMounted && !isMobile"
      :items="menuItems[1].items"
      :isTwoColumns="true"
      parentSlug="manufacturers"
    />
    <lazy-toolbar-menu
      v-if="isMounted && !isMobile"
      :items="menuItems[2].items"
      parentSlug="about"
    />
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

  @include md {
    height: $toolbar-desktop-height;
  }
  .logoWrapper {
    padding-right: 8px;
  }
  .appBarInner {
    display: flex;
    align-items: center;
    height: 100%;
  }
}
</style>

<style lang="scss" scoped>
.cart-wrap {
  height: 100% !important;
  border-radius: 0;
  &[disabled="disabled"] {
    padding: 0;
    min-width: 44px;
    margin-left: 4px;
  }
  .cart-badge {
    width: 40px;
    height: 40px;
    align-items: center;
    display: flex;
    justify-content: center;
    border-radius: 50%;
    // background-color: #eeeeee;
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

#logo-img {
  width: 50px;
  max-width: 50px;
}

#logo-text {
  width: 110px;
  max-width: 110px;
  display: none;
  // padding-right: 8px;
}

.header-link {
  font-size: 12px !important;
  padding: 0 8px !important;
  letter-spacing: 0 !important;
  text-indent: 0 !important;
}

@include sm {
  #logo-img {
    width: 65px;
    max-width: 65px;
  }

  #logo-text {
    width: 140px;
    max-width: 140px;
    display: block;
  }
  .header-link {
    font-size: 14px !important;
    padding: 0 6px !important;
  }
}

@include md {
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
    // font-size: 0.8rem !important;
    padding: 0 8px !important;
  }
}

@include lg {
  #logo-img {
    width: 65px;
    max-width: 65px;
  }

  #logo-text {
    width: 130px;
    max-width: 130px;
  }

  .header-link {
    // font-size: 0.85rem !important;
    padding: 0 12px !important;
  }
}
</style>

<script>
import { mdiAccount, mdiBasket } from "@mdi/js";

export default {
  data() {
    return {
      icons: { mdiAccount, mdiBasket },
      isMounted: false,
    };
  },
  mounted() {
    this.isMounted = true;
  },
  computed: {
    isMobile() {
      return this.$vuetify.breakpoint.mobile;
    },
    isCart() {
      return this.$store.getters.isCart;
    },
    menuItems() {
      return this.$store.getters.menuItems;
    },
    summa() {
      if (!this.isMounted || !this.isCart) {
        return 0;
      } else {
        return this.$store.getters.cartSumm;
      }
    },
    cartLength() {
      if (!this.isMounted || !this.isCart) {
        return 0;
      } else {
        const length = this.$store.getters.cartLength;
        return length;
      }
    },
  },
};
</script>
