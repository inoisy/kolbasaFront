<template>
  <div>
    <lazy-product-quantity
      v-if="isMounted && isInCart"
      class="productQuantity"
      :id="id"
      @deleted="isInCart = false"
    />
    <v-btn
      v-else
      class="productAddButton"
      @click="handleAdd"
      large
      title="Добавить в корзину"
    >
      Добавить в корзину
    </v-btn>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: "",
      required: true,
    },
    isCard: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isMounted: false,
    };
  },
  methods: {
    async handleAdd() {
      this.$emit("add");
    },
  },
  mounted() {
    this.isMounted = true;
  },
  computed: {
    isInCart() {
      const isCartObj = this.$store.getters.isInCartByIds[this.id];
      if (!isCartObj) {
        this.$emit("delete");
      }
      return isCartObj;
    },
  },
};
</script>

<style lang="scss" scoped >
.productQuantity {
  background-color: #e0e0e0 !important;
  border-color: #e0e0e0 !important;
  border-radius: 4px;
  width: 100%;
  height: 100%;
  justify-content: var(--quantity-justify, center);
}
.productAddButton {
  height: 100% !important;
  width: 100%;
  background-color: var(--product-add-background) !important;
  color: var(--product-add-color) !important;
  box-shadow: var(--product-add-box-shadow);
  font-size: var(--product-add-font-size);
  border-radius: 4px;
}
</style>