<template>
  <v-card
    :title="product.name"
    :to="to"
    @click.capture="cardClick"
    color="white"
    itemscope
    itemtype="http://schema.org/Product"
    hover
    :ripple="false"
    class="fill-height product-wrapper"
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
    </div>
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
          class="product-price"
        >{{product.isDiscount ? product.discountPrice : product.priceNum}}</span>
        <span v-show="!product.priceNum" style="font-size: 0.88rem">Цена по запросу</span>
        <span
          class="pl-2 product-price"
          v-if="product.isDiscount"
          style="text-decoration: line-through;"
        >{{product.priceNum}}</span>
        &nbsp;
        <span
          v-show="product.priceNum"
          itemprop="priceCurrency"
          content="RUB"
          class="product-price"
        >р</span>
        <v-chip
          v-if="product.isDiscount"
          color="accent"
          dark
          class="ml-2"
        >-{{Math.ceil(100*(product.priceNum-product.discountPrice)/product.priceNum) }}%</v-chip>
      </div>
      <div
        itemprop="description"
        style="font-size: 15px;"
        class="align-center display-flex pa-0"
      >{{product.weight ? product.weight + 'кг' : ''}}</div>
    </div>

    <h2 itemprop="name" class="product-name mb-0 mt-1" style>{{product.name}}</h2>
    <div class="product-busket-wrap" ref="productCardActions">
      <v-btn
        v-show="!busket"
        class="pruduct-busket-btn"
        tile
        color="#f2f2f2"
        style="height: 40px;"
        elevation="0"
        @click="handleAdd"
      >В корзину</v-btn>
      <client-only>
        <product-quantity v-if="busket" class="mx-auto" :id="product.id" :qty="busket"></product-quantity>
      </client-only>
    </div>
  </v-card>
</template>
<style lang="stylus" scoped>
.product-wrapper {
  padding: 10px;
}

.product-busket-wrap {
  margin-top: 10px;
  height: 40px;
  background-color: #f2f2f2;

  .pruduct-busket-btn {
    width: 100%;
    color: black !important;
  }
}

.product-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
}

.product-name {
  font-size: 15px;
  font-weight: 500;
  line-height: 20px;
  height: 40px;
  overflow: hidden;
  color: #333;
}

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
import ProductQuantity from "~/components/ProductQuantity";

export default {
  data() {
    return { imageBaseUrl: process.env.imageBaseUrl };
  },
  props: ["category", "product", "to"],
  components: { ProductQuantity },

  computed: {
    busket() {
      const index = this.$store.state.localStorage.basket.findIndex(
        item => item.id === this.product.id
      );
      return index >= 0
        ? this.$store.state.localStorage.basket[index].count
        : false;
    }
  },
  methods: {
    cardClick(event) {
      if (this.$refs.productCardActions.contains(event.target)) {
        event.preventDefault();
      }
    },
    async handleAdd(event) {
      await this.$store.commit("addToBasket", this.product);
    }
  }
};
</script>

