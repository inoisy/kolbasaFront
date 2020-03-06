<template>
  <div>
    <page-header :title="title" :breadrumbs="breadrumbs" />
    <section
      class="background background-repeat"
      v-lazy:background-image="require('~/assets/img/bg.jpg')"
    >
      <v-container grid-list-lg>
        <v-layout row wrap class="py-12">
          <v-flex
            v-for="(contact,i) in contacts"
            :key="`contact-${i}`"
            class="mb-2 fs-1-3"
            xs12
            d-flex
            align-center
          >
            <a
              v-if="contact.href"
              :href="contact.href"
              class="link font-weight-medium d-inline-flex align-center"
            >
              <v-icon class="mr-3" color="rgba(0,0,0,0.87)">{{contact.icon}}</v-icon>
              {{contact.text}}
            </a>
            <div v-else class="font-weight-medium d-inline-flex align-center">
              <v-icon class="mr-3" color="rgba(0,0,0,0.87)">{{contact.icon}}</v-icon>
              {{contact.text}}
            </div>
          </v-flex>
        </v-layout>
        <v-layout row wrap id="map">
          <client-only>
            <yandex-map
              :coords="addressCoords"
              zoom="16"
              style="width: 100%; height: 35rem;"
              class="mb-6"
            >
              <ymap-marker marker-id="1" marker-type="placemark" :coords="addressCoords"></ymap-marker>
            </yandex-map>
          </client-only>
        </v-layout>
      </v-container>
    </section>
  </div>
</template>

<script>
import PageHeader from "~/components/PageHeader";
const pageName = "Контакты";
export default {
  head() {
    return {
      title: pageName,
      meta: [
        {
          hid: "description",
          name: "description",
          content: pageName + " " + process.env.description
        }
      ]
    };
  },
  data() {
    return {
      title: pageName,
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
    // await ctx.store.dispatch("fetchGeneralInfo");
  },
  components: { PageHeader },
  computed: {
    contacts() {
      const contacts = this.$store.state.sessionStorage.generalInfo
        ? this.$store.state.sessionStorage.generalInfo.contacts
        : null;
      const contactsArr = [];
      if (contacts) {
        contactsArr.push(
          {
            icon: "phone",
            href: `tel:${contacts.phone}`,
            text: contacts.phone
          },
          {
            icon: "mail",
            href: `mailto:${contacts.email}`,
            text: contacts.email
          },
          {
            icon: "location_on",
            href: ``,
            text: contacts.addressText
          },
          {
            icon: "access_time",
            href: ``,
            text: contacts.accessTime
          }
        );
      }
      return contactsArr;
    },
    addressCoords() {
      const contacts = this.$store.state.sessionStorage.generalInfo
        ? this.$store.state.sessionStorage.generalInfo.contacts
        : null;
      return contacts ? contacts.addressCoords : [];
    }
  }
};
</script>
<style lang="stylus" scoped>
.link a {
  color: rgba(0, 0, 0, 0.87) !important;
}

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

