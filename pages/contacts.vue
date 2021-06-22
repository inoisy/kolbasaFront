<template>
  <div>
    <page-header-simple :title="title" :breadrumbs="breadrumbs" />
    <div class="background-with-transparent">
      <v-container grid-list-lg>
        <v-row class="py-16" no-gutters align="center">
          <v-col :class="$style.contactsWrapper" cols="12" md="6" lg="5">
            <v-list :class="$style.contactsList" light width="100%">
              <v-list-item
                :class="$style.link"
                title="Телефон"
                :href="`tel:${contacts.phone}`"
              >
                <v-list-item-icon :class="$style.iconWrapper">
                  <v-icon :class="$style.icon">$phone</v-icon>
                </v-list-item-icon>
                <v-list-item-content itemprop="telephone">
                  <v-list-item-title :class="$style.text">
                    {{ contacts.phone }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                :class="$style.link"
                title="Телефон"
                :href="`tel:+79261191748`"
                two-line
              >
                <v-list-item-icon :class="$style.iconWrapper">
                  <v-icon :class="$style.icon">$phone</v-icon>
                </v-list-item-icon>
                <v-list-item-content itemprop="telephone">
                  <v-list-item-title :class="$style.text">
                    +7 (926) 119 17 48
                  </v-list-item-title>
                  <v-list-item-subtitle :class="$style.text">
                    Для оптовых клиентов
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item
                :class="$style.link"
                :href="`mailto:${contacts.email}`"
                title="email"
              >
                <v-list-item-icon :class="$style.iconWrapper">
                  <v-icon :class="$style.icon">$email</v-icon>
                </v-list-item-icon>
                <v-list-item-content itemprop="email">
                  <v-list-item-title :class="$style.text">
                    {{ contacts.email }}
                  </v-list-item-title>
                  <v-list-item-subtitle :class="$style.text">
                    Для заказов
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                :class="$style.link"
                :href="`mailto:info@prodaem-kolbasu.ru`"
                title="email"
              >
                <v-list-item-icon :class="$style.iconWrapper">
                  <v-icon :class="$style.icon">$email</v-icon>
                </v-list-item-icon>
                <v-list-item-content itemprop="email">
                  <v-list-item-title :class="$style.text"
                    >info@prodaem-kolbasu.ru</v-list-item-title
                  >
                  <v-list-item-subtitle :class="$style.text">
                    Для преложений по сотрудничеству
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item title="Адрес">
                <v-list-item-icon :class="$style.iconWrapper">
                  <v-icon :class="$style.icon">$map</v-icon>
                </v-list-item-icon>
                <v-list-item-title :class="$style.text">
                  {{ contacts.addressText }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item title="Время работы">
                <v-list-item-icon :class="$style.iconWrapper">
                  <v-icon :class="$style.icon">$time</v-icon>
                </v-list-item-icon>
                <v-list-item-title :class="$style.text">{{
                  contacts.accessTime
                }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col
            :class="$style.yandexMapWrapper"
            class="pa-3"
            cols="12"
            md="6"
            lg="7"
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
      return this.$store.state.info.data.contacts; // contactsArr;
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
  padding-top: 12px;
  padding-bottom: 12px;
  @include md {
    padding-left: 12px;
    padding-right: 12px;
  }
  .contactsList {
    background: transparent !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    font-weight: 500;
    font-size: 16px;
    margin-bottom: 56px;
    @include md {
      margin-bottom: unset;
    }
    .link {
      color: rgba(0, 0, 0, 0.87);
      &:hover {
        color: #d50000 !important;
      }
    }
    .text {
      overflow: unset;
      text-overflow: unset;
      white-space: unset;
    }

    .iconWrapper {
      margin-right: 20px !important;
      margin-top: auto;
      margin-bottom: auto;
      .icon {
        color: currentColor !important;
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


