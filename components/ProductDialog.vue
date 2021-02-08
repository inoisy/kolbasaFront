<template>
  <v-sheet light class="fill-height position-relative">
    <div class="grey lighten-2 d-flex align-center py-3 px-4">
      <v-btn
        v-show="!showProductCard"
        color="gray"
        fab
        @click="showProductCard = true"
        title="Назад"
        :small="$vuetify.breakpoint.smAndDown"
      >
        <v-icon>$arrowLeft</v-icon>
      </v-btn>
      <breadcrumbs :items="breadcrumbs" dark />

      <v-btn
        class="ml-auto"
        fab
        @click="closeDialog"
        :small="$vuetify.breakpoint.smAndDown"
      >
        <v-icon>$close</v-icon>
      </v-btn>
    </div>
    <v-container grid-list-lg class="position-relative fill-height px-5">
      <v-layout
        row
        wrap
        v-show="showProductCard"
        itemscope
        itemtype="http://schema.org/Product"
      >
        <v-flex class>
          <h1
            itemprop="name"
            class="font-weight-bold mb-5 hidden-md-and-up"
            style="line-height: normal; font-size: 1.5rem"
            v-text="product.name"
          ></h1>
          <div class="float-none float-md-right content-right">
            <v-card
              class="mb-3 image-wrapper d-flex"
              :class="showImageDialog && 'pa-3'"
              :hover="showImageDialog"
              :ripple="showImageDialog"
              :flat="!showImageDialog"
              :tile="!showImageDialog"
              v-on="showImageDialog ? { click: () => handleImageDialog() } : {}"
              v-if="product.img"
            >
              <div class="mini-imgs-wrapper pa-1">
                <v-tooltip left max-width="400px" style="display: block">
                  <template v-slot:activator="{ on }">
                    <v-img
                      itemprop="image"
                      class="manufacturer-img"
                      contain
                      v-if="manufacturer.img"
                      :src="imageBaseUrl + manufacturer.img.url"
                      :alt="manufacturer.name"
                      :title="manufacturer.name"
                      v-on="on"
                    />
                  </template>
                  <span>{{ manufacturer.description }}</span>
                </v-tooltip>

                <v-img
                  class="halal-img"
                  v-if="product.isHalal"
                  src="/assets/halal.png"
                  alt="Халяльная продукция"
                  title="Халяльная продукция"
                />
              </div>

              <v-img
                class="item-img d-block ma-auto"
                :src="imgUrl"
                :alt="product.name"
                :title="product.name"
                contain
              />
              <image-dialog
                v-if="showImageDialog"
                :item="product.img"
                :value="dialogImg"
                @input="(val) => (dialogImg = val)"
              ></image-dialog>
            </v-card>
            <div
              itemprop="offers"
              itemscope
              itemtype="http://schema.org/Offer"
              class="font-weight-medium"
              style="display: flex; align-items: center; flex-wrap: wrap"
            >
              <div>
                <span
                  itemprop="price"
                  class="font-weight-bold black--text"
                  :class="price ? 'fs-2' : 'fs-1-5'"
                  >{{ price || "Нет в наличии" }}</span
                >
                <span itemprop="priceCurrency" class="fs-1-5" v-show="price"
                  >RUB</span
                >
                <span
                  class="pl-2"
                  v-if="isDiscount"
                  style="text-decoration: line-through; font-size: 1rem"
                  >{{ product.priceNum + "Р" }}</span
                >
              </div>

              <v-chip
                v-if="isDiscount"
                color="accent"
                dark
                class="ml-2"
                style="font-size: 1.1rem"
                >-{{ discountPriceProcent }}%</v-chip
              >
              <div v-if="price && product.weight" class="pl-2">
                / {{ product.weight }} кг.
              </div>
            </div>
            <v-sheet v-if="isMultiple" class="grey lighten-3 mt-3 pa-2">
              <span class="font-weight-bold"
                >{{ Math.round(price * product.minimumOrder) }} RUB</span
              >
              / {{ product.minimumOrder }} {{ product.piece ? "шт." : "кг." }}
            </v-sheet>
            <div class="display-flex align-center wrap" v-if="price">
              <!-- {{ isInCart }} -->

              <v-btn
                v-if="isMounted && !isInCart"
                color="#d50000"
                class="ml-0 product-button mt-3"
                @click="handleAdd"
                style="color: white"
                title="Добавить в корзину"
                >Добавить в корзину</v-btn
              >
              <!-- <client-only v-else> -->
              <v-sheet
                v-else
                class="product-button align-center display-flex justify-center mt-3 py-1"
                color="grey lighten-2"
              >
                <product-quantity
                  :id="product._id"
                  @deleted="isInCart = false"
                ></product-quantity>
              </v-sheet>
              <!-- </client-only> -->

              <!-- {{ busket }} -->

              <!-- {{ qty }}  v-show="!qty"   v-if="qty"-->
              <!-- {{ product._id }} -->
              <!-- <client-only>
           
              </client-only> -->
              <v-btn
                dark
                color="#d50000"
                class="product-button mt-3"
                large
                outlined
                @click="handleOneClickBuy"
                title="Купить в один клик"
                >Купить в один клик</v-btn
              >
            </div>
          </div>

          <h1
            itemprop="name"
            class="font-weight-bold mb-5 hidden-sm-and-down"
            style="line-height: normal; font-size: 1.5rem"
            v-text="product.name"
          ></h1>
          <div class="manufacturer my-3" v-if="manufacturer">
            Производитель:
            <nuxt-link
              :to="`/manufacturers/${manufacturer.slug}`"
              v-text="manufacturer.name"
              :title="manufacturer.name"
            ></nuxt-link>
          </div>
          <div
            itemprop="description"
            v-if="product.description"
            v-html="product.description"
            class="mb-5"
          ></div>
          <div v-else class="mb-5">
            {{ product.name }}, представленная на нашем сайте продается по
            максимально выгодным ценам при условии оптовой покупки. Мы заботимся
            о вашем здоровье, предлагая качественные продукты отечественного
            производства.
            <div class="my-3">
              <p>
                {{ product.name }} c быстрой доставкой по Москве и МО. Доставка
                заказов также осуществляется во все регионы России и в страны
                СНГ.
              </p>
              <p>
                Для оформления заказа воспользуйтесь формой на сайте или звоните
                по телефону
                <a :href="`tel:${phone}`">{{ phone }}</a>
              </p>
            </div>
          </div>
          <content-wrapper v-if="product.content" :content="product.content" />
          <!-- <div
            v-if="product.content"
            class="content-wrapper"
            v-html="product.content"
          ></div> -->
        </v-flex>
      </v-layout>
      <div v-show="!showProductCard" class="pb-6 pt-6 mx-auto">
        <h2 class="fs-1-5 mb-5 font-weight-bold mb-3">
          Купить "{{ product.name }}" в один клик
        </h2>
        <contact-form
          :oneClickBuy="true"
          :productName="product.name"
        ></contact-form>
      </div>
    </v-container>
    <div class="grey lighten-3" v-if="related.length" v-show="showProductCard">
      <v-container grid-list-lg class="py-5 px-5">
        <v-layout row wrap>
          <v-flex xs12>
            <h2 class="mb-2">Похожие товары</h2>
          </v-flex>
          <v-flex v-for="product in related" :key="product.id" xs12 sm6 md4 lg3>
            <product-card
              :product="product"
              :to="`/catalog/${product.category.slug}/${product.slug}`"
            ></product-card>
          </v-flex>
        </v-layout>
      </v-container>
    </div>
  </v-sheet>
</template>

<script>
// import ContactForm from "~/components/ContactForm";
// import ProductQuantity from "~/components/ProductQuantity";
// import ProductCard from "~/components/ProductCard";
// import ImageDialog from "~/components/ImageDialog";

export default {
  // components: { ContactForm, ProductQuantity, ProductCard, ImageDialog },
  props: {
    product: {
      type: Object,
    },
  },
  beforeDestroy() {
    this.closeDialog();
  },
  mounted() {
    this.isMounted = true;
  },
  computed: {
    isInCart() {
      // if (!this.isMounted) {
      //   return false;
      // }
      // if (process.server) {
      //   return false;
      // }
      // console.log("server", process.server);
      // console.log("client", process.client);
      // console.log("calculate is in cart");
      return this.$store.getters.isInCart(this.product._id);
    },

    isMultiple() {
      return this.product.minimumOrder > 1;
    },
    showImageDialog() {
      return !!(
        this.product.img &&
        this.product.img.formats &&
        this.product.img.formats.small
      );
    },
    imgUrl() {
      if (!this.product.img) {
        return require("~/assets/no-image.png");
      }
      if (!this.product.img.formats) {
        return this.imageBaseUrl + this.product.img.url;
      }
      if (this.product.img.formats.small) {
        return this.imageBaseUrl + this.product.img.formats.small.url;
      }

      return this.imageBaseUrl + this.product.img.formats.thumbnail.url;
    },
    phone() {
      return this.$store.state.sessionStorage.generalInfo.contacts.phone;
    },
    discountPriceProcent() {
      return this.isDiscount
        ? Math.round(
            (100 * (this.product.priceNum - this.product.discountPrice)) /
              this.product.priceNum
          )
        : "";
    },
    isDiscount() {
      return this.product.isDiscount && this.product.discountPrice;
    },
    breadcrumbs() {
      return [
        ...this.$store.state.sessionStorage.breadcrumbs,
        { to: this.$route.path, text: this.product.name },
      ];
    },
    manufacturer() {
      return this.product.manufacturer ? this.product.manufacturer : {};
    },
    // isInCart() {
    //   console.log("isin cart", this.product._id);
    //   return this.$store.getters["isInCart"](this.product._id);
    // },
    price() {
      return this.isDiscount
        ? this.product.discountPrice
        : this.product.priceNum;
    },
    related() {
      const relatedProducts = this.product.relatedProducts || [];
      const productsRelated = this.product.productsRelated || [];
      return [...relatedProducts, ...productsRelated]; //.filter((item) => item.priceNum);
    },
  },
  // mounted: () => {
  // console.log(this);
  // const isInCart = this.$store.getters.isInCart(this.product._id);
  // // console.log(
  // //   "🚀 ~ file: ProductDialog.vue ~ line 329 ~ mounted ~ isInCart",
  // //   this.$store.state.localStorage.cartItemList.find(
  // //     (element) => element.id == this.product._id
  // //   )
  // // );
  // console.log("id", this.product);
  // const store = this.$store.state.localStorage.cartItemList;
  // console.log(
  //   "🚀 ~ file: ProductDialog.vue ~ line 336 ~ mounted ~ store",
  //   store
  // );
  // const isInStore = this.$store.state.localStorage.cartItemList.findIndex(
  //   (element) => element.id == this.product._id
  // );
  // console.log(
  //   "🚀 ~ file: ProductDialog.vue ~ line 338 ~ mounted ~ isInStore",
  //   isInStore
  // );
  // this.isInCart = isInCart;
  // },
  watch: {
    showProductCard(val) {
      this.$emit("hanleOneClickBuy", val);
    },
  },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      showProductCard: true,
      dialogImg: false,
      isMounted: false,
      // isInCart: false,
    };
  },
  methods: {
    async handleAdd() {
      this.$store.dispatch("addToCart", {
        item: Object.assign({}, this.product),
      });
      // this.isInCart = true;
    },
    handleImageDialog() {
      this.dialogImg = true;
    },
    async closeDialog() {
      await this.$emit("closeProductDialog");
    },
    handleOneClickBuy() {
      this.showProductCard = false;
    },
  },
};

// busket() {
//   const index = this.$store.state.localStorage.basket.findIndex(
//     (item) => item._id === this.product._id
//   );
//   console.log(
//     "🚀 ~ file: ProductDialog.vue ~ line 312 ~ busket ~ index",
//     index
//   );
//   return index >= 0
//     ? this.$store.state.localStorage.basket[index].count
//     : false;
// },
// busket: {
//   get: function () {
//     let vm = this;
//     console.log(
//       "🚀 ~ file: ProductDialog.vue ~ line 308 ~ this.product",
//       vm.product
//     );

//     return this.$store.getters.isItemInBusket(vm.product.id);
//   },
//   set: function (value) {
//     this.busket = value;
//   },
//   // console.log(this.$store.getters.isItemInBusket(this.product.id));
//   // const item = this.$store.state.localStorage.basket.find(
//   //   (item) => item.id === this.product.id
//   // );
//   // console.log("🚀 ~ file: ProductDialog.vue ~ ", item);

//   // // console.log(
//   // //   "🚀 ~ file: ProductDialog.vue ~ line 309 ~ busket ~ index",
//   // //   index
//   // // );
//   // if (item) {
//   //   return item.count;
//   // }
//   // return false; //return this.$store.getters.summa;
//   // // index >= 0
//   // //   ? this.$store.state.localStorage.basket[index].count
//   // //   : false;
// },
// qty() {
//   // if (!this.busket) {
//   //   return 0;
//   // } else {
//   // console.log(
//   //   "🚀 ~ file: ProductDialog.vue ~ line 340 ~ qty ~ this.product",
//   //   this.product.name
//   // );
//   // let vm = this;
//   // console.log(
//   //   "🚀 ~ file: ProductDialog.vue ~ line 340 ~ qty ~ this.product",
//   //   vm.product.name
//   // );
//   return this.$store.getters.getProductQty(
//     this.product.id || this.product._id
//   );
//   // }
// },
</script>
<style lang="scss" scoped >
.mini-imgs-wrapper {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;

  .manufacturer-img {
    height: 3.5rem;
    width: 3.5rem;
    object-fit: contain;
  }

  .halal-img {
    height: 3.5rem;
    width: 3.5rem;
    padding: 7px;
    object-fit: contain;
  }
}

.halal-img {
  display: block;
}

.mw500 {
  max-width: 500px;
}

.product-button {
  // min-width: 240px;
  width: 100%;
  height: 48px !important;
}

.image-wrapper {
  position: relative;
  min-height: 165px;

  .item-img {
    max-height: 165px;
    object-fit: contain;
  }
}

@media (min-width: 960px) {
  .content-right {
    width: 230px;
    margin-left: 30px;
    margin-bottom: 15px;
  }

  .product-button {
    // min-width: 240px;
    // width: 100%;
    height: 40px !important;
  }
}

@media (min-width: 1199px) {
  .product-button {
    // min-width: 240px;
    // width: 100%;
    height: 48px !important;
  }

  .content-right {
    width: 310px;
    margin-left: 45px;
    margin-bottom: 20px;
  }
}
</style>