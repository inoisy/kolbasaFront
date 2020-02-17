<template>
  <v-app-bar app fixed class="py-0" height="64px" style="z-index: 300">
    <nuxt-link to="/" class="py-1 fill-height d-flex align-center" title="Логотип Альянс Фуд">
      <v-img
        :src="require('~/assets/img/logo1.png')"
        alt="Логотип Альянс Фуд"
        title="Логотип Альянс Фуд"
        max-height="100%"
        width="75px"
        contain
      ></v-img>
      <v-img
        class="hidden-xs-only mt-1 mx-1"
        :src="require('~/assets/img/logo2.png')"
        alt="Логотип Альянс Фуд"
        title="Логотип Альянс Фуд"
        max-height="80%"
        max-width="180px"
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
              <v-list-item :to="`/catalog/${category.slug}`" :title="category.name">
                <span style="line-height: 100%">{{ category.name}}</span>
              </v-list-item>
              <v-list-item
                v-for="child in category.children"
                :key="child.id"
                :to="`/catalog/${child.slug}`"
                :title="child.name"
              >
                <span class="pl-4">{{child.name}}</span>
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
    <div class="ya-phone-icon ma-1">
      <a :href="'tel:'+phone" class="pa-2" title="phone">
        <i
          aria-hidden="true"
          class="v-icon material-icons theme--light"
          style="font-size: 28px; color: rgb(149, 40, 42); caret-color: rgb(149, 40, 42);"
        >phone</i>
      </a>
    </div>
    <v-badge color="#95282a" :value="isBasket" overlap :content="basketLength">
      <v-btn
        icon
        class="ml-1"
        @click="$emit('showBasket')"
        large
        :disabled="!isBasket"
        title="Корзина"
      >
        <v-icon medium color="#95282a">shopping_basket</v-icon>
      </v-btn>
    </v-badge>

    <v-btn icon class="ml-1 hidden-md-and-up" @click="$emit('showDrawer')" large title="Меню">
      <v-icon medium color="#95282a">menu</v-icon>
    </v-btn>
  </v-app-bar>
</template>
<style lang="stylus" scoped>
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

@media (min-width: 576px) {
  .header-link {
    font-size: 0.79rem !important;
    padding: 0 6px !important;
  }
}

@media (min-width: 1199px) {
  .header-link {
    font-size: 0.875rem !important;
    padding: 0 16px !important;
  }
}
</style>

<script>
export default {
  props: ["menuItems"],
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
    isBasket() {
      return this.basketLength && this.basketLength > 0;
    },
    phone() {
      return this.$store.state.sessionStorage.generalInfo &&
        this.$store.state.sessionStorage.generalInfo.contacts
        ? this.$store.state.sessionStorage.generalInfo.contacts.phone
        : "";
    }
  }
};
</script>
