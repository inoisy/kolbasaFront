<template>
  <v-footer
    class="footer pt-4"
    dark
    height="auto"
    v-lazy:background-image="require('~/assets/img/footerbg.jpg')"
  >
    <v-container>
      <v-layout row wrap>
        <v-flex class="mb-4" xs12 md6 lg4>
          <v-subheader>НАВИГАЦИЯ</v-subheader>
          <v-list style="background: transparent !important;" class="footer-list">
            <v-list-tile
              v-for="menuItem in menuItems"
              :key="menuItem.to"
              :to="menuItem.to"
            >{{menuItem.name}}</v-list-tile>
            <!-- <v-list-tile to="/catalog">Каталог</v-list-tile>
            <v-list-tile to="/manufacturers">Производители</v-list-tile>
            <v-list-tile to="/about">О компании</v-list-tile>
            <v-list-tile to="/contacts">Контакты</v-list-tile>-->
          </v-list>
        </v-flex>
        <div class="flex mb-4 xs12 md6 lg4" itemscope itemtype="http://schema.org/LocalBusiness">
          <v-subheader>КОНТАКТЫ</v-subheader>
          <v-list style="background: transparent !important;" class="footer-list">
            <v-list-tile avatar itemprop="name">ООО "АЛЬЯНС ФУД"</v-list-tile>
            <v-list-tile avatar class>
              <v-list-tile-avatar>
                <v-icon>phone</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content class="ya-phone white--text">
                <a itemprop="telephone" :href="`tel:${contacts.phone}`">{{contacts.phone}}</a>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile avatar :href="`mailto:${contacts.email}`">
              <v-list-tile-avatar>
                <v-icon>email</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content itemprop="email">{{contacts.email}}</v-list-tile-content>
            </v-list-tile>
            <v-list-tile avatar href="#">
              <v-list-tile-avatar>
                <v-icon>location_on</v-icon>
              </v-list-tile-avatar>
              <div
                itemprop="address"
                itemscope
                itemtype="http://schema.org/PostalAddress"
                style="font-size: 0.8rem !important;"
              >
                <span itemprop="postalCode">109029</span>,
                <span itemprop="addressLocality">Москва</span>
                <span itemprop="streetAddress">Михайловский проезд, д.3</span>
              </div>
            </v-list-tile>
            <v-list-tile avatar href="#">
              <v-list-tile-avatar>
                <v-icon>access_time</v-icon>
              </v-list-tile-avatar>
              <v-list-tile-content
                itemprop="openingHours"
                datetime="Mo-Fr 09:00−18:00"
              >{{contacts.accessTime}}</v-list-tile-content>
            </v-list-tile>
          </v-list>
        </div>
        <v-flex class="mb-4" xs12 md6 lg4 hidden-xs-only>
          <v-subheader>КАТАЛОГ</v-subheader>

          <v-list style="background: transparent !important;" class="footer-list">
            <template v-for="(category,index) in categories.items">
              <div
                :key="'list-group'+index"
                v-if="category && category.children && category.children.length > 0"
              >
                <v-list-group :key="category.slug">
                  <v-list-tile slot="activator" :to="`/catalog/${category.slug}`">
                    <v-list-tile-content>{{ category.name}}</v-list-tile-content>
                  </v-list-tile>
                  <v-list-tile
                    v-for="child in category.children"
                    :key="child.id"
                    :to="`/catalog/${child.slug}`"
                  >
                    <span class="pl-4" style="line-height: 100% !important">{{child.name}}</span>
                  </v-list-tile>
                </v-list-group>
              </div>
              <v-list-tile :key="index" v-else :to="`/catalog/${category.slug}`">
                <span style="line-height: 100% !important">{{category.name}}</span>
              </v-list-tile>
            </template>
          </v-list>
        </v-flex>
        <!-- <v-flex class="mb-4" xs12 md6 lg3 hidden-xs-only>
          <v-subheader>ПРОИЗВОДИТЕЛИ</v-subheader>
          <v-list style="background: transparent !important;" class="footer-list">
            <v-list-tile
              v-for="(manufacturer,index) in manufacturers"
              :key="index"
              :to="`/manufacturers/${manufacturer.slug}`"
              style="line-height: normal"
            >{{manufacturer.name}}</v-list-tile>
          </v-list>
        </v-flex>-->
      </v-layout>
    </v-container>
  </v-footer>
</template>
<style lang="stylus" scoped>
.footer {
  // background-image: url();
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  .primary--text.theme--dark {
    color: #ff7a7a !important;
  }
}
</style>
<script>
export default {
  props: ["menuItems"],
  computed: {
    categories() {
      return this.menuItems.find(item => item.name === "Каталог");
      // if (
      //   this.$store.state.sessionStorage.generalInfo &&
      //   this.$store.state.sessionStorage.generalInfo.categories &&
      //   this.$store.state.sessionStorage.generalInfo.categories.length > 0
      // ) {
      //   return this.$store.state.sessionStorage.generalInfo.categories.filter(
      //     item => item.parent && item.parent.length === 0
      //   );
      // } else return [];
    },
    manufacturers() {
      return this.$store.state.sessionStorage.generalInfo.manufacturers;
    },
    contacts() {
      return this.$store.state.sessionStorage.generalInfo.contacts
        ? this.$store.state.sessionStorage.generalInfo.contacts
        : "";
    }
  }
};
</script>


