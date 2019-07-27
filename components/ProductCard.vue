<template>
  <v-card
    hover
    ripple
    class="fill-height d-flex column pt-2"
    :to="`/catalog/${category}/${product.slug}`"
    @click.capture="cardClick"
  >
    <!--  -->
    <div class="position-relative product-card-img-wrap">
      <img
        class="d-block ma-auto product-img"
        v-lazy="product.img ? imageBaseUrl + product.img.url : require('~/assets/no-image.png')"
      />
      <!-- <v-sheet class="d-flex align-center display-flex" color="grey lighten-3"> -->

      <div
        class="product-card-actions grey lighten-3"
        ref="productCardActions"
        style="position:absolute; right: 0;top: 0;"
      >
        <v-btn flat icon color="primary" @click="removeFromBasket" v-show="busket">
          <v-icon>remove</v-icon>
        </v-btn>
        <span v-show="busket" class="font-weight-bold display-1 mont mx-1">{{busket}}</span>

        <v-btn flat icon color="primary" @click="addToBasket">
          <v-icon v-show="!busket">add_shopping_cart</v-icon>
          <v-icon v-show="busket">add</v-icon>
        </v-btn>
      </div>
    </div>
    <v-card-text class="pt-2">
      <div class="display-flex justify-space-between">
        <v-subheader
          class="pl-0 display-flex align-center"
          :class="product.price ? 'display-2 font-weight-medium black--text' : ''"
        >{{product.price ? product.price +'₽' : 'Цена по запросу'}}</v-subheader>
        <v-subheader
          class="align-center display-flex pa-0"
        >{{product.weight ? product.weight + 'кг' : ''}}</v-subheader>
      </div>

      <h3
        class="mb-0"
        style="line-height: normal !important; font-size:1rem;font-weight: 600;"
      >{{product.name}}</h3>
    </v-card-text>
  </v-card>
</template>
<style lang="stylus" scoped>
.product-card-img-wrap {
}

.product-img, .product-card-img-wrap {
  height: 140px;
  max-height: 140px;
}

.product-img {
  object-fit: contain;
}

@media (min-width: 600px) {
  .product-img, .product-card-img-wrap {
    height: 140px;
    max-height: 140px;
  }
}

@media (min-width: 960px) {
  .product-img, .product-card-img-wrap {
    height: 160px;
    max-height: 160px;
  }
}
</style>

<script>
export default {
  data() {
    return { imageBaseUrl: process.env.imageBaseUrl };
  },
  computed: {
    busket() {
      return this.$store.state.localStorage.basket[this.product.id]
        ? this.$store.state.localStorage.basket[this.product.id].count
        : null;
    }
  },
  methods: {
    cardClick(event) {
      const capture = this.$refs.productCardActions.contains(event.target);
      console.log("TCL: cardClick -> event", capture);
      if (capture) {
        event.preventDefault();
        // event.stopPropagation();
      }
    },
    async addToBasket(event) {
      await this.$store.commit("addToBasket", this.product);
    },
    async removeFromBasket(event) {
      await this.$store.commit("removeFromBasket", this.product);
    }
  },
  props: ["category", "product"]
};
</script>

