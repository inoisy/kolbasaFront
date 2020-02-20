<template>
  <v-card
    :title="product.name"
    :to="to"
    @click.capture="cardClick"
    color="white"
    itemscope
    itemtype="http://schema.org/Product"
    hover
    ripple
    class="fill-height"
  >
    <div class="product-card-img-wrap" style="position: relative;">
      <img
        itemprop="image"
        class="d-block ma-auto product-img pa-3"
        :title="product.name"
        :alt="product.name"
        v-lazy="product.img ? imageBaseUrl + product.img.url : require('~/assets/no-image.png')"
      />
      <div class="product-card-mini-imgs">
        <img
          class="product-card-halal-img"
          v-if="product.isHalal"
          src="@/assets/halal1.png"
          title="Халяльная продукция"
          alt="Халяльная продукция"
        />
        <img
          class="product-card-manufacturer-img d-block"
          :title="product.manufacturer.name"
          :alt="product.manufacturer.name"
          v-if="product.manufacturer && product.manufacturer.img"
          v-lazy="product.manufacturer && product.manufacturer.img ? imageBaseUrl + product.manufacturer.img.url : require('~/assets/no-image.png')"
        />
      </div>

      <div
        class="product-card-actions grey lighten-2 pa-1"
        ref="productCardActions"
        style="position:absolute; right: 0;top: 0;"
      >
        <v-btn
          icon
          color="primary"
          @click="removeFromBasket"
          v-show="busket"
          title="remove From Basket"
        >
          <v-icon>remove</v-icon>
        </v-btn>
        <span v-show="busket" class="font-weight-bold mx-1">{{busket}}</span>

        <v-btn icon color="primary" @click="addToBasket" title="add To Basket">
          <v-icon v-show="!busket">add_shopping_cart</v-icon>
          <v-icon v-show="busket">add</v-icon>
        </v-btn>
      </div>
    </div>
    <v-card-text class="pt-0">
      <div class="display-flex justify-space-between mb-2">
        <div
          itemprop="offers"
          itemscope
          itemtype="http://schema.org/Offer"
          class="pl-0 display-flex align-center"
        >
          <span
            itemprop="price"
            v-show="product.priceNum"
            class="font-weight-medium black--text fs-1-5"
          >{{product.isDiscount ? product.discountPrice : product.priceNum}}</span>
          <span v-show="!product.priceNum" style="font-size: 0.88rem">Цена по запросу</span>
          <span
            class="pl-2 fs-1-5"
            v-if="product.isDiscount"
            style="text-decoration: line-through; font-size:1rem"
          >{{product.priceNum}}</span>
          &nbsp;
          <span
            v-show="product.priceNum"
            itemprop="priceCurrency"
            content="RUB"
            class="font-weight-medium black--text fs-1-5"
          >Р</span>
          <v-chip
            v-if="product.isDiscount"
            color="accent"
            dark
            class="ml-2"
            style="font-size: 1.1rem"
          >-{{Math.ceil(100*(product.priceNum-product.discountPrice)/product.priceNum) }}%</v-chip>
        </div>
        <div
          itemprop="description"
          class="align-center display-flex pa-0"
        >{{product.weight ? product.weight + 'кг' : ''}}</div>
      </div>

      <h2
        itemprop="name"
        class="mb-0 mt-1 black--text font-weight-regular"
        style="line-height: normal !important; font-size:1.03rem; font-weight: 600;"
      >{{product.name}}</h2>
    </v-card-text>
  </v-card>
</template>
<style lang="stylus" scoped>
.product-card-mini-imgs {
  position: absolute;
  bottom: 0px;
  right: 10px;
  display: flex;

  img {
    width: 3rem;
    height: 3rem;
    object-fit: contain;
  }
}

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
      if (capture) {
        event.preventDefault();
      }
    },
    async addToBasket(event) {
      await this.$store.commit("addToBasket", this.product);
    },
    async removeFromBasket(event) {
      await this.$store.commit("removeFromBasket", this.product.id);
    }
  },
  props: ["category", "product", "to"]
};
</script>

