<template>
  <div>
    <div v-if="!showOrder">
      <v-btn @click="$emit('close-orders')" title="Закрыть" class="mb-9" outlined icon large>
        <v-icon>keyboard_backspace</v-icon>
      </v-btn>
      <h2 class="mb-6" style="font-size: 23px">Мои заказы</h2>

      <v-list v-if="formattedOrders.length">
        <v-list-item
          @click="selectOrder(order.id)"
          v-for="order of formattedOrders"
          :key="order.id"
        >
          {{order.date}}
          <span
            v-if="!order.oneClick && order.summa"
            class="ml-auto"
          >{{order.summa}} руб.</span>
        </v-list-item>
      </v-list>
      <div v-else>Тут будут отображаться ваши заказы.</div>
    </div>
    <div v-else>
      <v-btn class="mb-9" @click="showOrder=false" title="Закрыть" outlined icon large>
        <v-icon>keyboard_backspace</v-icon>
      </v-btn>
      <order :order="formattedOrders.find(item=>item.id===selectedOrder)" />
    </div>
  </div>
</template>
<script>
import Order from "~/components/user/Order";
export default {
  components: { Order },
  async mounted() {
    await this.fetchOrders();
  },
  data() {
    return { orders: [], showOrder: false, selectedOrder: "" };
  },
  computed: {
    formattedOrders() {
      if (!this.orders || !this.orders.length) {
        return [];
      } else {
        return this.orders.map((order) => {
          const dateCreated = new Date(order.createdAt);
          const day = dateCreated.getDate();
          const mon = dateCreated.getMonth();
          const hour = dateCreated.getHours();
          const min = dateCreated.getMinutes();
          order.date = `${(day > 9 ? "" : "0") + day}.${
            (mon > 9 ? "" : "0") + mon
          }.${dateCreated.getFullYear()} ${(hour > 9 ? "" : "0") + hour}:${
            (min > 9 ? "" : "0") + min
          }`;
          return order;
        });
      }
    },
  },
  methods: {
    async fetchOrders() {
      this.$axios.setToken(this.$store.getters["auth/getJWT"], "Bearer");
      const response = await this.$axios
        .get(process.env.baseUrl + "/orders?_sort=createdAt:DESC")

        .catch((error) => {
          if (error.response.data.statusCode === 401) {
            this.$store.commit("auth/logout");
          }
        });
      if (response && response.data) {
        this.orders = response.data;
      }
    },
    selectOrder(id) {
      this.showOrder = true;
      this.selectedOrder = id;
    },
  },
};
</script>