<template>
  <!-- <v-lazy v-if="product" min-height="300px"> -->
  <v-card
    v-bind="{
      ripple: false,
      hover: isValue,
      ...(isValue
        ? {
            title: product.name,
            to: `/${grandparent}/${parent}/${product.slug}`,
          }
        : null),
    }"
    @click.capture="cardClick"
    class="fill-height product-wrapper"
  >
    <!--v-intersect.quiet="onIntersect" <v-lazy v-if="isValue" :value="show"> v-intersect.once="onIntersect" -->
    <!-- <LazyHydrate when-visible> -->
    <template v-if="isValue">
      <!-- <LazyHydrate never :trigger-hydration="isVisible" > -->
      <!-- v-show="isVisible" -->

      <div itemscope itemtype="http://schema.org/Product">
        <div class="product-card-img-wrap my-2">
          <v-img
            itemprop="image"
            class="d-block ma-auto product-img"
            :title="product.name"
            :alt="product.name"
            :src="imgUrl"
            contain
          >
            <!--:eager="isVisible" <template v-slot:placeholder>
          <image-placeholder />
        </template> -->
          </v-img>

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
                require(`~/assets/images/manufacturers/${product.manufacturer.slug}.png`)
              "
              contain
              width="50px"
            />
            <!-- {{ product.manufacturer.img }} -->
            <!-- imageBaseUrl + product.manufacturer.img.url -->
          </div>
        </div>
        <div
          class="text-no-wrap display-flex mb-2 align-end"
          style="height: 26px"
        >
          <div
            class="pl-0 display-flex align-center"
            itemprop="offers"
            itemscope
            itemtype="http://schema.org/Offer"
          >
            <span
              itemprop="price"
              v-show="product.priceNum"
              class="product-price"
              >{{ price }}</span
            >
            <span v-show="!product.priceNum" style="font-size: 0.88rem">
              Нет в наличии
            </span>
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
            <v-chip
              v-if="isDiscount"
              color="accent"
              dark
              style="height: 26px"
              class="ml-2"
            >
              -{{
                Math.round(
                  (100 * (product.priceNum - product.discountPrice)) /
                    product.priceNum
                )
              }}%
            </v-chip>
          </div>
          <div
            itemprop="description"
            style="font-size: 15px"
            class="align-center display-flex pa-0 ml-2"
          >
            {{ product.weight ? ` / ${product.weight} кг.` : "" }}
          </div>
          <!-- <div v-if="isMultiple" class="ml-auto">
        <span class="product-price"
          >{{ Math.round(price * product.minimumOrder) }} р</span
        >
        <span style="font-size: 15px"
          >/ {{ product.minimumOrder }}
          {{ product.piece ? "шт." : "кг." }}</span
        >
      </div> -->
        </div>

        <div itemprop="name" class="product-name mb-0">
          {{ product.name }}{{ halal ? "&nbsp; халяль" : "" }}
        </div>
        <div class="product-busket-wrap" ref="productCardActions">
          <product-add
            class="display-flex align-center wrap"
            :id="product._id || product.id"
            isCard
            @add="handleAdd"
          />
          <!-- :="true" -->
        </div>
      </div>

      <!-- </LazyHydrate> -->
    </template>
    <!-- </v-lazy> -->
    <lazy-product-sceleton v-else :boilerplate="!loading" />
    <!-- </LazyHydrate> -->

    <!-- :title="product.name"
      :to="`/${grandparent}/${parent}/${product.slug}`"
       hover
      :ripple="false" -->
    <!--  color="white" :to="to" -->
    <!-- isValue -->
    <!-- {{ Object.entries(product).length === 0 }} -->
    <!-- <div v-else style="display: flex; flex-direction: column; height: 100%">
      <v-skeleton-loader
        class="mb-3"
        type="image"
        :boilerplate="!loading"
        height="150px"
      />
      <v-skeleton-loader type="text" :boilerplate="!loading" />
      <v-skeleton-loader type="text" width="50%" :boilerplate="!loading" />
      <v-skeleton-loader type="text" width="30%" :boilerplate="!loading" />

      <v-skeleton-loader
        class="mt-auto"
        type="button"
        height="48px"
        width="100%"
        :boilerplate="!loading"
      />
    </div> -->

    <!-- </v-sheet> -->
  </v-card>
  <!-- </v-lazy> -->

  <!-- :class="$style.productInner" :boilerplate="!pageData"-->
</template>
<style lang="scss" scoped>
.product-wrapper {
  padding: 10px;
}

.product-busket-wrap {
  margin-top: 10px;
  height: 40px;
  background-color: #f2f2f2;

  // .pruduct-busket-btn {
  //   width: 100%;
  //   color: black !important;
  // }
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

<script>
// import LazyHydrate from "vue-lazy-hydration";

// import ProductSceleton from "./ProductSceleton.vue";
// import ProductQuantity from "~/components/ProductQuantity";
// import ProductAdd from "./ProductAdd.vue";

export default {
  // components: { LazyHydrate },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      // isVisible: this.show,
      // isMounted: false,
      // isInCart: false,
    };
  },
  props: {
    // to: {
    //   type: String,
    //   default: "",
    // },

    product: [Object, Boolean],
    // {
    //   type: Object,
    //   default: () => {},
    // },
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
      required: true,
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
    //   isActive: {
    //   get() {
    //     console.log(
    //       "🚀 ~ file: ProductCard.vue ~ line 308 ~ get ~ this.show",
    //       this.show
    //     );

    //     return this.show;
    //   },
    //   set(val) {
    //     console.log("🚀 ~ file: ProductCard.vue ~ line 310 ~ set ~ val", val);
    //   },
    // },
    isValue() {
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
      // if (this.product.imageUrl) {
      //   return this.product.imageUrl;
      // }
      if (!this.product.img) return "/no-image.png";
      if (!this.product.img.formats) {
        return this.imageBaseUrl + this.product.img.url;
      }

      return this.imageBaseUrl + this.product.img.formats.thumbnail.url;
    },
  },

  methods: {
    // Will only be called once the element is intersected
    // onIntersect(entries, observer, isIntersecting) {
    //   console.log(
    //     "🚀 ~ file: ProductCard.vue ~ line 348 ~ onIntersect ~ isIntersecting",
    //     isIntersecting
    //   );
    //   console.log(
    //     "🚀 ~ file: ProductCard.vue ~ line 329 ~ onIntersect ~ entries",
    //     entries[0].isIntersecting
    //   );

    //   // if (isIntersecting) {
    //   //   this.isVisible = true;
    //   //   console.log("🚀 this.isVisible", this.isVisible);
    //   // }
    // },

    async handleAdd() {
      await this.$store.dispatch("addToCart", {
        item: Object.assign({}, this.product),
      });
      // this.isInCart = true;
    },
    cardClick(event) {
      if (
        this.$refs.productCardActions &&
        this.$refs.productCardActions.contains(event.target)
      ) {
        event.preventDefault();
      }
    },
  },
};
</script>

