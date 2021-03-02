<template>
  <div style="height: 100%; width: 100%">
    <v-sheet
      v-if="isMounted && isInCart"
      width="100%"
      height="100%"
      class="align-center display-flex justify-center py-1"
      color="grey lighten-2"
    >
      <lazy-product-quantity :id="id" @deleted="isInCart = false" />
    </v-sheet>
    <v-btn
      v-else
      :color="isCard ? '#f2f2f2' : '#d50000'"
      :elevation="isCard ? 0 : 2"
      :dark="!isCard"
      :class="[isCard && $style.reduceFontSize]"
      class="ml-0 fill-width"
      @click="handleAdd"
      large
      height="100%"
      block
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
      // console.log(
      //   "🚀 ~ file: ProductAdd.vue ~ line 59 ~ isInCart ~ isCartObj",
      //   isCartObj
      // );
      // const isInCart = this.$store.getters.isInCart(this.id);
      // console.log(
      //   "🚀 ~ file: ProductAdd.vue ~ line 59 ~ isInCart ~ isInCart",
      //   isInCart
      // );
      // if (!isInCart) {
      //   this.$emit("delete");
      // }
      // return isInCart;
    },
  },
};
</script>

<style lang="scss" scoped module>
.reduceFontSize {
  font-size: 12px !important;
  @include lg {
    font-size: 14px !important;
  }
}
</style>