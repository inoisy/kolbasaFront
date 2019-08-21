<template>
  <div>
    <page-header :title="title" :breadrumbs="breadrumbs" />

    <section class="background" v-lazy:background-image="require('~/assets/img/bg.jpg')">
      <v-container class="py-5">
        <v-layout row wrap class="mont">
          <div class="flex xs12 mb-3 align-center display-flex" data-aos="fade-up">
            <a
              :href="`tel:${contacts.phone}`"
              class="link font-weight-medium display-1 d-inline-flex"
            >
              <v-icon class="mr-3" color="rgba(0,0,0,0.87)">phone</v-icon>
              {{contacts.phone}}
            </a>
            <span>,&nbsp;&nbsp;</span>
            <a
              :href="`tel:+79261191748`"
              class="link font-weight-medium display-1 d-inline-flex"
              style="min-height:32px"
            >+7 (926) 119 17 48 (оптовый отдел)</a>
          </div>
          <div class="flex xs12 mb-3" data-aos="fade-up">
            <a
              :href="`mailto:${contacts.email}`"
              class="link font-weight-medium display-1 d-inline-flex"
            >
              <v-icon class="mr-3" color="rgba(0,0,0,0.87)">mail</v-icon>
              {{contacts.email}}
            </a>
          </div>
          <div class="flex xs12 mb-3" data-aos="fade-up">
            <a
              @click="$vuetify.goTo('#map')"
              class="link font-weight-medium display-1 d-inline-flex"
            >
              <v-icon class="mr-3" color="rgba(0,0,0,0.87)">location_on</v-icon>
              {{contacts.addressText}}
            </a>
          </div>
          <div class="flex xs12 mb-5" data-aos="fade-up">
            <div class="font-weight-medium display-1 d-inline-flex">
              <v-icon class="mr-3" color="rgba(0,0,0,0.87)">access_time</v-icon>
              {{contacts.accessTime}}
            </div>
          </div>
          <no-ssr>
            <yandex-map
              id="map"
              :coords="contacts.addressCoords"
              zoom="16"
              style="width: 100%; height: 35rem;"
              class="mb-3"
            >
              <ymap-marker marker-id="1" marker-type="placemark" :coords="contacts.addressCoords"></ymap-marker>
            </yandex-map>
          </no-ssr>
        </v-layout>
      </v-container>
    </section>
  </div>
</template>

<script>
import PageHeader from "~/components/PageHeader";

export default {
  head() {
    return {
      title: "Контакты"
    };
  },
  data() {
    return {
      title: "Контакты",
      breadrumbs: [
        {
          to: "/",
          text: "Главная"
        },
        {
          to: "/contacts",
          text: "Контакты"
        }
      ]
    };
  },
  async asyncData(ctx) {
    // async asyncData(ctx) {

    const generalData = await ctx.store.dispatch("fetchGeneralInfo");
    // console.log("TCL: //Data -> generalData", generalData);
    return {
      contacts: generalData.contacts
    };
  },
  components: { PageHeader },
  computed: {
    // contacts() {
    //   return this.$store.state.generalInfo.contacts;
    // }
  }
};
</script>
<style lang="stylus" scoped>
.link {
  color: rgba(0, 0, 0, 0.87);

  &:hover {
    color: #d50000;

    i {
      color: #d50000 !important;
    }
  }
}

a {
  text-decoration: none;
}
</style>

