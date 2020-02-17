<template>
  <v-text-field
    :value="qty"
    @click:append-outer.stop="(e)=>addToBasket(e,product)"
    @click:prepend.stop="(e)=> removeFromBasket(e,product.id)"
    @change="(e)=>changeBasket(e,product.id)"
    class="quantity"
    dense
    single-line
    hide-details
    outlined
    prepend-icon="remove"
    type="number"
    append-outer-icon="add"
  ></v-text-field>
</template>
<script>
export default {
  props: ["product", "qty"],
  methods: {
    async changeBasket(qty, id) {
      const quantity = parseInt(qty);
      if (quantity > 0) {
        await this.$store.commit("changeBasket", { id, qty: quantity });
      } else if (quantity == 0) {
        await this.$store.commit("deleteFromBasket", id);
      }
    },
    async addToBasket(event, item) {
      await this.$store.commit("addToBasket", item);
    },
    async removeFromBasket(event, id) {
      await this.$store.commit("removeFromBasket", id);
    },
    async deleteFromBasket(event, id) {
      await this.$store.commit("deleteFromBasket", id);
    }
  }
};
</script>