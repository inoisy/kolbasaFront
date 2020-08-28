<template>
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
      <v-icon>close</v-icon>
    </v-btn>
    <div v-if="!isLogined">
      <h3 class="mb-5">ВХОД</h3>
      <login class="mb-12" />
      <h3 class="mb-5">РЕГИСТРАЦИЯ</h3>
      <register />
    </div>
    <div v-if="isLogined">
      <div v-if="!showOrders">
        <h2 class="mb-6" style="font-size: 23px">Личный кабинет</h2>
        <div class="font-weight-bold mb-2" style="font-size: 17px">{{userData.firstname}}</div>
        <div style="font-size: 14px">{{userData.phone}}</div>
        <div style="font-size: 14px">{{userData.email}}</div>
        <div class="mb-12 mt-6">
          <v-btn outlined @click="showOrders=true" width="200">
            <v-icon left>history</v-icon>
            <span>История заказов</span>
          </v-btn>
        </div>
        <div>
          <v-btn color="#7f7f7f" width="200" outlined @click="logout" text style>
            <v-icon left>login</v-icon>
            <span>Выход</span>
          </v-btn>
        </div>
      </div>
      <div v-else-if="showOrders">
        <orders @close-orders="showOrders=false" />
      </div>
    </div>
  </div>
</template>
<script>
import Register from "~/components/Register";
import Login from "~/components/Login";
import Orders from "~/components/Orders";
export default {
  components: { Register, Login, Orders },
  data() {
    return {
      showOrders: false,
    };
  },
  computed: {
    isLogined() {
      return this.$store.getters["auth/isLogined"];
    },
    userData() {
      return this.isLogined && this.$store.getters["auth/getUser"];
    },
  },

  methods: {
    async logout() {
      this.$store.commit("auth/logout");
    },
  },
};
</script>