<template>
  <v-navigation-drawer
    :value="show"
    temporary
    fixed
    right
    touchless
    width="550px"
    @input="change"
  >
    <div class="py-5 px-5">
      <v-btn
        v-if="!showOrders"
        @click="$emit('close')"
        class="mb-9"
        title="Закрыть"
        icon
        large
        outlined
      >
        <v-icon>$close</v-icon>
        <!-- <svg-icon name="close" style="width: 24px; height: 24px" /> -->
      </v-btn>
      <div v-if="!isLogined">
        <h3 class="mb-5">ВХОД</h3>
        <user-login class="mb-12" />
        <h3 class="mb-5">РЕГИСТРАЦИЯ</h3>
        <user-register />
      </div>
      <user-personal-area v-else />
      <!-- <div v-if="isLogined"> -->
      <!-- <div v-if="!showOrders">
          <h2 class="mb-6" style="font-size: 23px">Личный кабинет</h2>
          <div class="font-weight-bold mb-2" style="font-size: 17px">
            {{ userData.firstname }}
          </div>
          <div style="font-size: 14px">{{ userData.phone }}</div>
          <div style="font-size: 14px">{{ userData.email }}</div>
          <div class="mb-12 mt-6">
            <v-btn outlined @click="showOrders = true" width="200">
              <v-icon left>{{ icons.mdiHistory }}</v-icon>
              <span>История заказов</span>
            </v-btn>
          </div>
          <div>
            <v-btn
              color="#7f7f7f"
              width="200"
              outlined
              @click="logout"
              text
              style
            >
              <v-icon left>{{ icons.mdiLogoutVariant }}</v-icon>
              <span>Выход</span>
            </v-btn>
          </div>
        </div>
        <div v-else-if="showOrders">
          <orders @close-orders="showOrders = false" />
        </div> -->
      <!-- </div> -->
    </div>
  </v-navigation-drawer>
</template>
<script>
// import Register from "~/components/Register";
// import Login from "~/components/Login";
// import Orders from "~/components/Orders";
export default {
  middleware: "auth",
  // components: { Register, Login, Orders },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showOrders: false,
      // icons: { mdiHistory, mdiLogoutVariant },
    };
  },
  computed: {
    isLogined() {
      return !!this.$strapi.user;
      // return this.$store.getters["auth/isLogined"];
    },
    userData() {
      return this.$strapi.user;
    },
  },
  mounted() {
    this.$strapi.fetchUser();
  },
  methods: {
    async logout() {
      this.$strapi.logout();
    },
    change(val) {
      if (!val) {
        this.$emit("close");
      }
    },
  },
};
</script>