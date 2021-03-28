<template>
  <v-card
    v-bind="{
      ripple: false,
      ...(isValue
        ? {
            title: product.name,
            to: `/${grandparent}/${parent}/${product.slug}`,
            itemscope: true,
            hover: true,
            itemtype: 'http://schema.org/Product',
          }
        : {
            disabled: true,
          }),
    }"
    @click.capture="cardClick"
    class="product-wrapper"
  >
    <!-- @click.capture="cardClick" -->

    <template v-if="isValue">
      <div class="product-card-img-wrap">
        <v-img
          itemprop="image"
          class="d-block ma-auto product-img"
          :title="product.name"
          :alt="product.name"
          :src="imgUrl"
          contain
        />
        <div class="product-card-mini-imgs">
          <v-img
            v-if="product.isHalal"
            class="mr-1"
            :src="require('~/assets/images/halal-min.png')"
            title="Халяльная продукция"
            alt="Халяльная продукция"
            width="40px"
            contain
          />
          <v-img
            v-if="product.manufacturer && product.manufacturer.slug"
            class="d-block"
            :title="product.manufacturer.name"
            :alt="product.manufacturer.name"
            :src="
              require(`~/assets/images/manufacturers/${product.manufacturer.slug}.png?resize&size=50`)
            "
            contain
            width="50px"
          />
        </div>
      </div>
      <price
        class="product-prices-wrapper text-no-wrap display-flex"
        :priceNum="product.priceNum"
        :isDiscount="product.isDiscount"
        :discountPrice="product.discountPrice"
        :piece="product.piece"
        :weight="product.weight"
        :minimumOrder="product.minimumOrder"
      />
      <div itemprop="name" class="product-name mb-0">
        {{ product.name + (halal ? "&nbsp; халяль" : "") }}
      </div>
      <!-- <div > -->
      <product-add
        class="product-busket-wrap"
        ref="productCardActions"
        :id="product._id || product.id"
        isCard
        @add="handleAdd"
      />
      <!-- </div> -->
      <meta
        itemprop="description"
        :content="`${product.name} купить в Альянс Фуд за ${product.priceNum}`"
      />
    </template>
    <product-sceleton v-else :boilerplate="!loading" />

    <!-- <product-sceleton></product-sceleton> -->
  </v-card>
</template>

<script>
import ProductSceleton from "~/components/ProductSceleton";
export default {
  components: { ProductSceleton },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
    };
  },
  props: {
    product: [Object, Boolean],
    halal: {
      type: Boolean,
      default: false,
    },
    grandparent: {
      type: String,
      default: "catalog",
    },
    parent: {
      type: String,
      default: "",
      // required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    show: {
      type: Boolean,
      default: false,
    },
    // grandparent="catalog"
    //             :parent="category.slug"
  },
  computed: {
    isValue() {
      // return true;
      return !!this.product;
    },
    isDiscount() {
      return this.product.isDiscount && this.product.discountPrice;
    },
    price() {
      return this.isDiscount
        ? this.product.discountPrice
        : this.product.priceNum;
    },
    imgUrl() {
      if (!this.product.img) return "/no-image.png";
      if (!this.product.img.formats) {
        return this.imageBaseUrl + this.product.img.url;
      }

      return this.imageBaseUrl + this.product.img.formats.thumbnail.url;
    },
  },
  methods: {
    async handleAdd() {
      await this.$store.dispatch("addToCart", this.product);
    },
    cardClick(event) {
      if (this.$refs.productCardActions.$el.contains(event.target)) {
        event.preventDefault();
      }
    },
  },
};
</script>

<style lang="scss" scoped module>
</style>
<style lang="scss" scoped>
.product-wrapper {
  padding: 10px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  &:before {
    color: white;
  }
}
.product-prices-wrapper {
  --font-size: 16px;
  --reduced-font-size: 12px;

  justify-content: space-between !important;
  white-space: nowrap;
  min-height: 26px;
  @include lg {
    --font-size: 18px;
  }
}
.product-busket-wrap {
  --quantity-border-radius: 0px;
  --quantity-justify: space-evenly;
  --product-add-background: #f2f2f2;
  --product-add-box-shadow: none;
  --product-add-font-size: 12px;
  margin-top: 10px;
  height: 40px;
  background-color: #f2f2f2;
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
  position: relative;
  margin-bottom: 10px;
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
    height: 150px;
    max-height: 150px;
  }
}
</style>
