<template>
  <div v-if="!showOrders">
    <h2 class="mb-6" style="font-size: 23px">Личный кабинет</h2>
    <div class="font-weight-bold mb-2" style="font-size: 17px">
      {{ userData.firstname }}
    </div>
    <div style="font-size: 14px">{{ userData.phone }}</div>
    <div style="font-size: 14px">{{ userData.email }}</div>
    <!-- <div class="mb-12 mt-6"> -->
    <v-btn class="mt-14" outlined block large @click="showOrders = true">
      <v-icon left>{{ icons.mdiHistory }}</v-icon>
      <!-- <svg-icon name="history" style="width: 24px; height: 24px" /> -->
      <span>История заказов</span>
    </v-btn>
    <!-- </div>
    <div> -->
    <v-btn
      class="mt-4"
      color="#7f7f7f"
      block
      outlined
      text
      large
      @click="logout"
    >
      <v-icon left>{{ icons.mdiLogoutVariant }}</v-icon>
      <!-- <svg-icon name="login" style="width: 24px; height: 24px" /> -->
      <span>Выход</span>
    </v-btn>
    <!-- </div> -->
  </div>
  <div v-else-if="showOrders">
    <user-orders @close-orders="showOrders = false" />
  </div>
</template>

<script>
import { mdiHistory, mdiLogoutVariant } from "@mdi/js";

export default {
  middleware: "auth",

  data() {
    return {
      showOrders: false,
      icons: { mdiHistory, mdiLogoutVariant },
    };
  },
  computed: {
    // isLogined() {
    //   return !!this.$strapi.user;
    // },
    userData() {
      return this.$strapi.user;
    },
  },
  methods: {
    async logout() {
      await this.$strapi.logout();
      // this.$store.commit("auth/logout");
    },
    // change(val) {
    //   if (!val) {
    //     this.$emit("close");
    //   }
    // },
  },
};
</script>

<style>
</style>