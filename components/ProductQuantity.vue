<template>
  <div class="d-flex align-center">
    <v-btn
      class="quantity-btn"
      icon
      color="#333"
      @click="handleDecrement"
      title="Убрать из корзины"
    >
      <v-icon>$minus</v-icon>
    </v-btn>
    <v-text-field
      class="quantity"
      :value="quantity"
      rounded
      dense
      single-line
      hide-details
      filled
      type="number"
      @change="handleChange"
    />
    <v-btn
      class="quantity-btn"
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
      return this.$store.getters["cart/quantity"](this.id);
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
        const quan = await this.$store.dispatch("cart/updateCartById", {
          id: this.id,
          quantity: quantity,
        });
        return quan;
      } else {
        this.$store.dispatch("cart/removeItemInCart", this.id);
        return 0;
      }
    },
    async hanleIncrement() {
      await this.$store.dispatch("cart/incrementCart", this.id);
    },
    async handleDecrement() {
      await this.$store.dispatch("cart/decrementCart", this.id);
    },
  },
};
</script>

<style lang="scss" scoped>
.quantity {
  border-radius: var(--quantity-border-radius, 20px);
  // max-width: 100px;
  // min-width: 80px;
  height: 100%;
  flex: 0 1 80px;
  ::v-deep .v-input__control {
    min-width: 45px;
    height: 100%;
    .v-input__slot {
      padding: 0;
      // padding: 0 var(--quantity-border-radius, 20px);
      // min-height: 100 !important;
      height: 100%;
    }
  }
  ::v-deep input {
    text-align: center !important;
  }
}
.quantity-btn {
  margin-left: var(--quantity-btn-margin);
  margin-right: var(--quantity-btn-margin);
}
</style>