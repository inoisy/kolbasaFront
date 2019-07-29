<template>
  <v-footer class="footer pt-4" dark height="auto">
    <v-container>
      <v-layout row wrap>
        <v-flex class="mb-4" xs12 md6 lg3>
          <v-subheader>НАВИГАЦИЯ</v-subheader>
          <v-list style="background: transparent !important;" class>
            <v-list-tile to="/">Главная</v-list-tile>
            <v-list-tile to="/сatalog">Каталог</v-list-tile>
            <v-list-tile to="/manufacturers">Производители</v-list-tile>
            <v-list-tile to="/about">О компании</v-list-tile>
            <v-list-tile to="/contacts">Контакты</v-list-tile>
          </v-list>
        </v-flex>
        <v-flex class="mb-4" xs12 md6 lg3>
          <v-subheader>КОНТАКТЫ</v-subheader>
          <v-list style="background: transparent !important;">
            <v-list-tile avatar :href="`tel:${contacts.phone}`">
              <v-list-tile-avatar>
                <v-icon>phone</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>{{contacts.phone}}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile avatar :href="`mailto:${contacts.email}`">
              <v-list-tile-avatar>
                <v-icon>email</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>{{contacts.email}}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile avatar href="#">
              <v-list-tile-avatar>
                <v-icon>location_on</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content style="font-size: 14px !important;">{{contacts.addressText}}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile avatar href="#">
              <v-list-tile-avatar>
                <v-icon>access_time</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content>{{contacts.accessTime}}</v-list-tile-content>
            </v-list-tile>
          </v-list>
          <!-- <v-list style="background: transparent !important;" class="lumber">
              <v-list-tile class="fs-1-3" to="/">Главная</v-list-tile>
              <v-list-tile class="fs-1-3" to="/сatalog">Каталог</v-list-tile>
              <v-list-tile class="fs-1-3" to="/manufacturers">Производители</v-list-tile>
          </v-list>-->
        </v-flex>
        <v-flex class="mb-4" xs12 md6 lg3 hidden-xs-only>
          <v-subheader>КАТАЛОГ</v-subheader>
          <v-list style="background: transparent !important;" class>
            <v-list-tile
              v-for="(category,index) in categories"
              :key="index"
              :to="`catalog${category.slug}`"
              style="line-height: normal"
            >{{category.name}}</v-list-tile>
            <v-list-tile style="line-height: normal" nuxt to="/catalog/halal">
              <v-list-tile-content>Халяльная продукция</v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-flex>
        <v-flex class="mb-4" xs12 md6 lg3 hidden-xs-only>
          <v-subheader>ПРОИЗВОДИТЕЛИ</v-subheader>
          <v-list style="background: transparent !important;" class>
            <v-list-tile
              v-for="(manufacturer,index) in manufacturers"
              :key="index"
              :to="`/manufacturers/${manufacturer.slug}`"
              style="line-height: normal"
            >{{manufacturer.name}}</v-list-tile>
          </v-list>
        </v-flex>
      </v-layout>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  computed: {
    categories() {
      return this.$store.state.sessionStorage.generalInfo.categories;
    },
    manufacturers() {
      return this.$store.state.sessionStorage.generalInfo.manufacturers;
    },
    contacts() {
      return this.$store.state.sessionStorage.generalInfo.contacts;
    }
  }
};
</script>
<style lang="stylus" scoped>
.footer {
  background-image: url('~assets/img/footerbg.jpg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}
</style>

