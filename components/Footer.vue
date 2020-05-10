<template>
  <v-footer
    class="footer pt-4"
    dark
    height="auto"
    v-lazy:background-image="require('~/assets/img/footerbg.jpg')"
  >
    <v-container>
      <v-layout row wrap>
        <v-flex class="mb-10" xs12 md6 lg4>
          <v-subheader>НАВИГАЦИЯ</v-subheader>
          <v-list style="background: transparent !important;" class="footer-list">
            <v-list-item
              v-for="menuItem in menuItems"
              :key="menuItem.to"
              :to="menuItem.to"
              :title="menuItem.name"
              color="accent"
            >{{menuItem.name}}</v-list-item>
          </v-list>
        </v-flex>
        <div class="flex mb-10 xs12 md6 lg4" itemscope itemtype="http://schema.org/LocalBusiness">
          <v-subheader>КОНТАКТЫ</v-subheader>
          <v-list style="background: transparent !important;" class="footer-list">
            <v-list-item color="accent" itemprop="name">ООО "АЛЬЯНС ФУД"</v-list-item>
            <v-list-item color="accent" class title="telephone" :href="`tel:${contacts.phone}`">
              <v-list-item-icon>
                <v-icon>phone</v-icon>
              </v-list-item-icon>
              <v-list-item-content
                class="ya-phone white--text"
                itemprop="telephone"
              >{{contacts.phone}}</v-list-item-content>
            </v-list-item>
            <v-list-item color="accent" :href="`mailto:${contacts.email}`" title="email">
              <v-list-item-icon>
                <v-icon>email</v-icon>
              </v-list-item-icon>
              <v-list-item-content itemprop="email">{{contacts.email}}</v-list-item-content>
            </v-list-item>
            <v-list-item color="accent" @click title="address">
              <v-list-item-icon>
                <v-icon>location_on</v-icon>
              </v-list-item-icon>
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
            </v-list-item>
            <v-list-item color="accent" @click title="openingHours">
              <v-list-item-icon>
                <v-icon>access_time</v-icon>
              </v-list-item-icon>
              <v-list-item-content
                itemprop="openingHours"
                datetime="Mo-Fr 09:00−18:00"
              >{{contacts.accessTime}}</v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
        <v-flex class="mb-10" xs12 md6 lg4 hidden-xs-only>
          <v-subheader>КАТАЛОГ</v-subheader>

          <v-list style="background: transparent !important;" class="footer-list">
            <template v-for="(category,index) in categories.items">
              <div
                :key="'list-group'+index"
                v-if="category && category.children && category.children.length > 0"
              >
                <v-list-group :key="category.slug" color="accent">
                  <v-list-item
                    :to="`/catalog/${category.slug}`"
                    :title="category.name"
                    slot="activator"
                  >
                    <v-list-item-content>{{ category.name}}</v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    v-for="child in category.children"
                    :key="child.id"
                    :to="`/catalog/${child.slug}`"
                    :title="child.name"
                  >
                    <span class="pl-4" style="line-height: 100% !important">{{child.name}}</span>
                  </v-list-item>
                </v-list-group>
              </div>
              <v-list-item
                color="accent"
                :key="index"
                v-else
                :to="`/catalog/${category.slug}`"
                :title="category.name"
              >
                <span style="line-height: 100% !important">{{category.name}}</span>
              </v-list-item>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </v-container>
  </v-footer>
</template>
<style lang="stylus" >
.footer {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;

  .v-list__tile--active {
    color: #da6e6e !important;
  }
}
</style>
<script>
export default {
  props: ["menuItems"],
  computed: {
    categories() {
      return this.menuItems.find(item => item.name === "Каталог");
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


