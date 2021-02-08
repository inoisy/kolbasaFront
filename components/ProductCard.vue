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
    <div class="product-card-img-wrap" style="position: relative">
      <v-img
        itemprop="image"
        class="d-block ma-auto product-img pa-3"
        :title="product.name"
        :alt="product.name"
        :src="imgUrl"
        contain
      />
      <div class="product-card-mini-imgs">
        <v-img
          class="product-card-halal-img"
          v-if="product.isHalal"
          src="/halal-min.png"
          title="Халяльная продукция"
          alt="Халяльная продукция"
          contain
        />
        <!-- <v-img
          class="product-card-manufacturer-img d-block"
          :title="product.manufacturer.name"
          :alt="product.manufacturer.name"
          v-if="product.manufacturer && product.manufacturer.img"
          :src="imageBaseUrl + product.manufacturer.img.url"
        /> -->
      </div>
    </div>
    <div class="display-flex mb-2">
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
          >{{ price }}</span
        >
        <span v-show="!product.priceNum" style="font-size: 0.88rem"
          >Нет в наличии</span
        >
        <span
          class="pl-2 product-price"
          v-if="product.isDiscount"
          style="text-decoration: line-through"
          >{{ product.priceNum }}</span
        >
        &nbsp;
        <span
          v-show="product.priceNum"
          itemprop="priceCurrency"
          content="RUB"
          class="product-price"
          >р</span
        >
        <v-chip v-if="isDiscount" color="accent" dark class="ml-2"
          >-{{
            Math.round(
              (100 * (product.priceNum - product.discountPrice)) /
                product.priceNum
            )
          }}%</v-chip
        >
      </div>
      <div
        itemprop="description"
        style="font-size: 15px"
        class="align-center display-flex pa-0 ml-2"
      >
        {{ product.weight ? ` / ${product.weight} кг.` : "" }}
      </div>
      <div v-if="isMultiple" class="ml-auto">
        <span class="product-price"
          >{{ Math.round(price * product.minimumOrder) }} р</span
        >
        <span style="font-size: 15px"
          >/ {{ product.minimumOrder }}
          {{ product.piece ? "шт." : "кг." }}</span
        >
      </div>
    </div>

    <div itemprop="name" class="product-name mb-0 mt-1">
      {{ product.name }}{{ halal ? "&nbsp; халяль" : "" }}
    </div>
    <div class="product-busket-wrap" ref="productCardActions">
      <!-- {{ busketWatch }} -->
      <v-btn
        v-if="isMounted && !isInCart"
        class="pruduct-busket-btn"
        tile
        color="#f2f2f2"
        style="height: 40px"
        :disabled="!product.priceNum"
        elevation="0"
        @click="handleAdd"
        >В корзину</v-btn
      >
      <!-- <client-only v-else> -->
      <product-quantity
        v-else
        class="mx-auto"
        :id="product._id || product.id"
        @deleted="isInCart = false"
      ></product-quantity>
      <!-- </client-only> -->
    </div>
  </v-card>
</template>
<style lang="scss" scoped>
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

.product-img,
.product-card-img-wrap {
  height: 140px;
  max-height: 140px;
}

.product-img {
  object-fit: contain;
}

@media (min-width: 600px) {
  .product-img,
  .product-card-img-wrap {
    height: 140px;
    max-height: 140px;
  }
}

@media (min-width: 960px) {
  .product-img,
  .product-card-img-wrap {
    height: 160px;
    max-height: 160px;
  }
}
</style>

<script>
import ProductQuantity from "~/components/ProductQuantity";

export default {
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      isMounted: false,
      isInCart: false,
    };
  },
  props: {
    to: {
      type: String,
    },
    product: {
      type: Object,
    },
    halal: {
      type: Boolean,
      default: false,
    },
  },
  components: { ProductQuantity },

  computed: {
    // isInCart() {
    //   return this.$store.getters.isInCart(this.product.id);
    // },
    isDiscount() {
      return this.product.isDiscount && this.product.discountPrice;
    },
    price() {
      return this.isDiscount
        ? this.product.discountPrice
        : this.product.priceNum;
    },
    isMultiple() {
      return this.product.minimumOrder > 1;
    },
    imgUrl() {
      if (!this.product.img) return require("~/assets/no-image.png");
      if (!this.product.img.formats)
        return this.imageBaseUrl + this.product.img.url;
      return this.imageBaseUrl + this.product.img.formats.thumbnail.url;
    },
    // busket() {
    //   const index = this.$store.state.localStorage.basket.findIndex(
    //     (item) => item.id === this.product.id
    //   );
    //   console.log(
    //     "🚀 ~ file: ProductCard.vue ~ line 244 ~ busket ~ index",
    //     index
    //   );
    //   return index >= 0
    //     ? this.$store.state.localStorage.basket[index].count
    //     : false;
    // },
  },
  // watch: {
  //   busketWatch() {
  //     const index = this.$store.state.localStorage.basket.findIndex(
  //       (item) => item.id === this.product.id
  //     );
  //     console.log(
  //       "🚀 ~ file: ProductCard.vue ~ line 244 ~ busket ~ index",
  //       index,
  //       !!(index >= 0)
  //     );
  //     return !!(index >= 0);
  //   },
  // },
  mounted() {
    console.log("id", this.product.id);
    this.isMounted = true;
    this.isInCart = this.$store.getters.isInCart(this.product.id);
    // console.log("id", this.isInCart);
  },
  methods: {
    async handleAdd() {
      await this.$store.dispatch("addToCart", {
        item: Object.assign({}, this.product),
      });
      this.isInCart = true;
    },
    cardClick(event) {
      if (this.$refs.productCardActions.contains(event.target)) {
        event.preventDefault();
      }
    },
    // async handleAdd(event) {
    //   await this.$store.commit("addToBasket", this.product);
    // },
  },
};
</script>

