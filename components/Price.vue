<template>
  <div :class="$style.pricesWrapper">
    <div
      :class="$style.priceWrapper"
      itemprop="offers"
      itemscope
      itemtype="http://schema.org/Offer"
    >
      <div :class="$style.priceInner">
        <div
          v-if="priceObject.isPrice"
          :class="[$style.price, priceObject.isDiscount && $style.accent]"
          class="d-inline-flex"
        >
          <span itemprop="price" v-text="priceObject.price" />
          <span itemprop="priceCurrency" content="RUB">&#8381;</span>
        </div>
        <div
          v-if="priceObject.isDiscount"
          :class="priceObject.isDiscount && $style.discount"
          class="d-inline-flex ml-2"
        >
          <span>{{ this.priceNum }}</span>
          <span
            :class="$style.priceCurrency"
            itemprop="priceCurrency"
            content="RUB"
          >
            &#8381;
          </span>
        </div>
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
        class="ml-1"
      >
        -{{ priceObject.discountPriceProcent }}%
      </div>
    </div>
    <div
      :class="[$style.priceWrapper, $style.additionalPrice]"
      v-if="this.minimumOrder > 1"
    >
      <div :class="$style.price">
        <span :class="$style.price">
          {{ Math.round(priceObject.price * this.minimumOrder) }}
        </span>
        <span :class="$style.priceCurrency">&#8381;</span>
      </div>

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

      return object;
    },
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
    margin-bottom: 10px;
    .priceInner {
      display: inline-flex;
      align-items: flex-end;
    }
    .discount {
      text-decoration: line-through;
      font-size: calc(var(--font-size) - 2px);
      color: rgba($black, 0.6);
      //   padding-bottom: 1px;
    }
    // .priceCurrency {
    //   // padding-bottom: 2px;
    //   font-size: var(--font-size);
    //   font-weight: 500;
    //   .priceIcon {
    //     color: $black;
    //   }
    // }
    .noPrice {
      font-size: 1.5rem;
    }
    .price {
      display: inline-flex;
      font-weight: 700;
      font-size: var(--font-size);
      &.accent {
        font-weight: bold;
        color: $accent;
      }
    }
    .weight {
      font-size: var(--reduced-font-size);
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
    &.additionalPrice {
      display: var(--additional-price-display);
    }
  }
}
</style>