<template>
  <v-toolbar height="100px" fixed app>
    <div class="flex">
      <nuxt-link to="/" class="py-1 fill-height ml-auto d-inline-flex">
        <img :src="require('~/assets/img/logo.png')" alt="logo" />
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
            >
              <!-- :to="item.forms && item.forms.length > 0 ? localePath({ name: 'catalog-slug', params: { slug: item.forms[0].slug } }) :  localePath({ name: 'about-slug', params: { slug: item.slug } })" -->
              {{ child.name }}
            </v-list-tile>
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
    <!-- <v-btn flat class="headline text-no-wrap fill-height" :href="'tel:'"></v-btn> -->
    <v-btn icon class="ml-1" to="/basket" large>
      <v-icon medium color="#95282a">shopping_basket</v-icon>
    </v-btn>
    <v-btn icon class="ml-1 hidden-md-and-up" @click="$emit('showDrawer')" large>
      <v-icon medium color="#95282a">menu</v-icon>
    </v-btn>
  </v-toolbar>
</template>
<style lang="stylus" scoped>
@media (min-width: 1264px) {
  .toolbar-inner, .toolbar-inner>*, .toolbar-inner>*>*, .toolbar-inner>*>*>* {
    font-size: 1.3rem !important;
  }
}
</style>

<script>
export default {
  props: ["menuItems"],
  computed: {
    phone() {
      return this.$store.state.sessionStorage.generalInfo.contacts.phone;
    }
  }
};
</script>
