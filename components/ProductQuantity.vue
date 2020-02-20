<template>
  <div class="d-flex align-center px-2">
    <v-btn class="mr-auto" icon color="#333" @click="handleDecrement" title="Убрать из корзины">
      <v-icon>remove</v-icon>
    </v-btn>
    <v-text-field
      :value="qty"
      @change="handleChange"
      style="max-width: 100px; min-width: 80px;"
      class="quantity"
      rounded
      dense
      single-line
      hide-details
      outlined
      type="number"
    ></v-text-field>
    <v-btn class="ml-auto" icon color="#333" @click="hanleIncrement" title="Добавить в корзину">
      <v-icon>add</v-icon>
    </v-btn>
  </div>
</template>
<script>
export default {
  props: ["id", "qty"],
  methods: {
    async handleChange(qty) {
      const quantity = parseInt(qty);
      if (quantity > 0) {
        await this.$store.commit("changeBasket", {
          id: this.id,
          qty: quantity
        });
      } else if (quantity == 0) {
        await this.$store.commit("deleteFromBasket", this.id);
      }
    },
    async hanleIncrement() {
      // console.log("TCL: hanleIncrement -> id", this.id);
      await this.$store.commit("incrementBasket", this.id);
    },
    async handleDecrement() {
      await this.$store.commit("removeFromBasket", this.id);
    }
  }
};
</script>