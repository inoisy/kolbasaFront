<template>
  <div :class="$style.pricesWrapper">
    <!-- {{ priceObject }} -->
    <div
      :class="$style.priceWrapper"
      itemprop="offers"
      itemscope
      itemtype="http://schema.org/Offer"
    >
      <div :class="$style.priceInner">
        <span
          :class="[priceObject.isPrice ? $style.price : $style.noPrice]"
          itemprop="price"
        >
          {{ priceObject.price || "Нет в наличии" }}
        </span>
        <span
          :class="$style.discount"
          class="pl-1"
          v-if="priceObject.isDiscount"
        >
          {{ this.priceNum }}
        </span>

        <span
          :class="$style.priceCurrency"
          itemprop="priceCurrency"
          v-show="priceObject.isPrice"
          content="RUB"
        >
          &nbsp;&#8381;
        </span>
        <span
          v-if="priceObject.isPrice && this.weight"
          class="pl-1"
          :class="$style.weight"
        >
          за&nbsp;{{ this.weight }}&nbsp;{{ this.piece ? "шт." : "кг." }}
        </span>
      </div>

      <div
        :class="$style.discountPriceProcent"
        v-if="priceObject.isDiscount"
        class="ml-2"
      >
        -{{ priceObject.discountPriceProcent }}%
      </div>
    </div>
    <div :class="$style.priceWrapper" v-if="this.minimumOrder > 1">
      <span :class="$style.price">
        {{ Math.round(priceObject.price * this.minimumOrder) }}
      </span>
      <span :class="$style.priceCurrency">&#8381;</span>
      <span :class="$style.weight"
        >&nbsp;за&nbsp;{{ this.minimumOrder }}&nbsp;{{
          this.piece ? "шт." : "кг."
        }}</span
      >
    </div>
  </div>
</template>

<script>
export default {
  props: {
    minimumOrder: {
      type: Number,
      default: 1,
    },
    isDiscount: {
      type: Boolean,
      default: false,
    },
    priceNum: {
      type: Number,
      default: null,
    },
    discountPrice: {
      type: String,
      default: null,
    },
    piece: {
      type: Boolean,
      default: false,
    },
    weight: {
      type: String,
      default: null,
    },
  },
  //   data() {
  //     console.log(this.priceNum);
  //   },
  computed: {
    priceObject() {
      const object = {
        isDiscount: this.isDiscount && !!this.discountPrice,
      };
      // const isDiscount = ;
      // let discountPriceProcent,price;
      if (object.isDiscount) {
        object.discountPriceProcent = Math.round(
          (100 * (this.priceNum - this.discountPrice)) / this.priceNum
        );
        object.price = this.discountPrice;
      } else {
        object.price = this.priceNum;
      }
      object.isPrice = !!object.price;
      //   console.log(
      //     "🚀 ~ file: Price.vue ~ line 93 ~ priceObject ~ object",
      //     object
      //   );

      return object;
      //   const isDiscount = this.isDiscount && !!this.discountPrice
    },
    // isDiscountComputed() {
    //   return this.isDiscount && !!this.discountPrice;
    // },
    // discountPriceProcentComputed() {
    //   if (!this.isDiscountComputed) {
    //     return null;
    //   }
    //   this.discountPriceProcent = Math.round(
    //     (100 * (this.priceNum - this.discountPrice)) / this.priceNum
    //   );
    // },
    // priceComputed() {
    //   return this.isDiscountComputed ? this.discountPrice : this.priceNum;
    // },
    // this.;
    // if (this.isDiscount) {
    //   this.discountPriceProcent = Math.round(
    //     (100 * (this.priceNum - this.discountPrice)) / this.priceNum
    //   );
    //   this.price = this.discountPrice;
    // } else {
    //   this.price = this.priceNum;
    // }
  },
};
</script>

<style lang="scss" scoped module>
.pricesWrapper {
  //   --font-size: 2rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-around;

  .priceWrapper {
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
    font-weight: 500;
    color: $black;
    line-height: 1;
    margin-bottom: 8px;
    .priceInner {
      display: inline-flex;
      align-items: flex-end;
    }
    .discount {
      text-decoration: line-through;
      font-size: var(--font-size);
      color: rgba($black, 0.6);
      //   padding-bottom: 1px;
    }
    .priceCurrency {
      // padding-bottom: 2px;
      font-size: var(--font-size);
      font-weight: 500;
      //   line-height: 1;
      //   line-height: calc(var(--font-size) + 4px);
      .priceIcon {
        color: $black;
      }
    }
    .noPrice {
      font-size: 1.5rem;
    }
    .price {
      font-weight: 700;
      font-size: var(--font-size);
      //   line-height: 1;
      //   line-height: calc(var(--font-size) + 4px);
    }
    .weight {
      font-size: var(--reduced-font-size);
      //   line-height: 1;
      //   line-height: calc(var(--font-size) + 4px);
    }
    .discountPriceProcent {
      background-color: $accent !important;
      border-color: $accent !important;
      border-radius: 9999px;
      font-size: var(--reduced-font-size);
      height: calc(var(--reduced-font-size) + 8px);
      align-items: center;
      display: inline-flex;
      padding: 0 calc(var(--reduced-font-size) / 2);
      color: $white;
    }
  }
}
</style>