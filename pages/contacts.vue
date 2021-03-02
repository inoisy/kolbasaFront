<template>
  <div>
    <page-header :title="title" :breadrumbs="breadrumbs" />
    <div
      :style="`background-image: url(${require('~/assets/images/bg.jpg?webp')})`"
      class="background-with-transparent"
    >
      <v-container grid-list-lg>
        <v-row class="py-12">
          <v-col :class="$style.contactsWrapper" cols="12" md="6" lg="4">
            <v-list :class="$style.contactsList" light width="100%">
              <v-list-item
                :class="$style.link"
                title="Телефон"
                :href="`tel:${contacts.phone}`"
              >
                <v-list-item-icon>
                  <v-icon>$phone</v-icon>
                </v-list-item-icon>
                <v-list-item-content itemprop="telephone">
                  {{ contacts.phone }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                :class="$style.link"
                :href="`mailto:${contacts.email}`"
                title="email"
              >
                <v-list-item-icon>
                  <v-icon>$email</v-icon>
                </v-list-item-icon>
                <v-list-item-content itemprop="email">
                  {{ contacts.email }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item title="Адрес">
                <v-list-item-icon>
                  <v-icon>$map</v-icon>
                </v-list-item-icon>
                {{ contacts.addressText }}
              </v-list-item>
              <v-list-item title="Время работы">
                <v-list-item-icon>
                  <v-icon>$time</v-icon>
                </v-list-item-icon>
                {{ contacts.accessTime }}
              </v-list-item>
            </v-list>
          </v-col>
          <v-col
            cols="12"
            md="6"
            offset-lg="1"
            lg="7"
            :class="$style.yandexMapWrapper"
            id="map"
          >
            <client-only>
              <map-component :coords="contacts.addressCoords" />
            </client-only>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import { hydrateWhenIdle, hydrateWhenVisible } from "vue-lazy-hydration";

const pageName = "Контакты";
export default {
  components: {
    // addressCoords,
    PageHeader: hydrateWhenIdle(() => import("~/components/PageHeader.vue")),
    MapComponent: hydrateWhenVisible(
      () => import("~/components/MapComponent.vue"),
      // Optional.
      { observerOptions: { rootMargin: "100px" } }
    ),
  },
  head() {
    return {
      title: pageName,
      meta: [
        {
          hid: "description",
          name: "description",
          content: pageName + " " + process.env.description,
        },
      ],
    };
  },
  data() {
    return {
      // mapSettings: {
      //   apiKey: process.env.MAP_KEY,
      //   lang: "ru_RU",
      //   version: "2.1",
      // },
      title: pageName,
      breadrumbs: [
        {
          to: "/",
          text: "Главная",
        },
        {
          to: "/contacts",
          text: "Контакты",
        },
      ],
    };
  },
  computed: {
    contacts() {
      return this.$store.state.sessionStorage.generalInfo.contacts; // contactsArr;
    },
  },
};
</script>

<style lang="scss" scoped module>
.yandexMapWrapper {
  height: 400px;
  min-height: 400px;
  @include md {
    height: 300px;
    min-height: 300px;
  }
  @include lg {
    height: 400px;
    min-height: 400px;
  }
}
.contactsWrapper {
  display: flex;
  align-items: center;
  .contactsList {
    background: transparent !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    font-weight: 500;
    font-size: 16px;
    .link {
      color: rgba(0, 0, 0, 0.87);

      &:hover {
        color: #d50000 !important;

        ::v-deep svg {
          color: #d50000 !important;
        }
      }
    }
  }
  // ::v-deep a {
  //   &:hover {
  //     color: #d50000 !important;
  //   }
  // }
}
</style>


