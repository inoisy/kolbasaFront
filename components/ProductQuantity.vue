<template>
  <div class="d-flex align-center px-2">
    <v-btn
      class="mr-auto"
      icon
      color="#333"
      @click="handleDecrement"
      title="Убрать из корзины"
    >
      <v-icon>$minus</v-icon>
    </v-btn>
    <v-text-field
      :value="quantity"
      @change="handleChange"
      height="36px"
      style="max-width: 100px; min-width: 80px"
      class="quantity"
      rounded
      dense
      single-line
      hide-details
      outlined
      type="number"
    ></v-text-field>
    <v-btn
      class="ml-auto"
      icon
      color="#333"
      @click="hanleIncrement"
      title="Добавить в корзину"
    >
      <v-icon>$plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  computed: {
    quantity() {
      return this.$store.getters["quantity"](this.id);
    },
  },
  // created() {
  //   console.log("quantity created");
  // },
  watch: {
    quantity(newCount, oldCount) {
      if (newCount <= 0) {
        this.$emit("deleted");
      }
    },
  },
  methods: {
    async handleChange(qty) {
      const quantity = parseInt(qty);
      if (quantity > 0) {
        const quan = await this.$store.dispatch("updateCartById", {
          id: this.id,
          quantity: quantity,
        });
        return quan;
      } else {
        this.$store.dispatch("removeItemInCart", this.id);
        return 0;
      }
    },
    async hanleIncrement() {
      await this.$store.dispatch("incrementCart", this.id);
    },
    async handleDecrement() {
      await this.$store.dispatch("decrementCart", this.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.quantity {
  ::v-deep .v-input__control {
    min-width: 45px;
  }

  ::v-deep input {
    text-align: center !important;
  }
}
</style>