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
      </v-btn>
      <div v-if="!isLogined">
        <h3 class="mb-5">ВХОД</h3>
        <user-login class="mb-12" />
        <h3 class="mb-5">РЕГИСТРАЦИЯ</h3>
        <user-register />
      </div>
      <user-personal-area v-else />
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