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
    <!-- {{ id }} -->
    <!-- {{ quantity }} -->
    <!-- :value="quantity % 1 > 0 ? quantity.toFixed(1) : quantity" -->
    <!-- @change="handleChange" -->
    <!-- {{ quantity }} -->

    <!-- <input type="number" :value="quantity" @change="handleInputChange" /> -->
    <v-text-field
      :value="quantity"
      @change="handleChange"
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
// import { mapActions } from "vuex";
// import {
//   minLength,
//   alpha,
// } from "vuelidate/lib/validators";
export default {
  // mixins: [validationMixin],
  //   validations: {
  //   },
  props: {
    id: {
      type: String,
      required: true,
    },
    qty: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    quantity() {
      return this.$store.getters["quantity"](this.id);
    },
  },
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