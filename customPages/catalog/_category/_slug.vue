<template>
  <div
    v-if="isProduct"
    class="modal"
    ref="modal"
    tabindex="0"
    @keydown.esc="handleClose"
  >
    <div class="modal-mask" @click="handleClose" />
    <v-sheet class="modal-inner" light>
      <div :class="$style.toolbar">
        <v-btn
          :class="$style.fabButton"
          class="mr-3 my-auto"
          v-if="!showProductCard"
          color="gray"
          fab
          @click="showProductCard = true"
          title="Назад"
        >
          <v-icon>$arrowLeft</v-icon>
        </v-btn>
        <breadcrumbs class="pr-3 my-auto" :items="breadcrumbs" dark />

        <v-btn
          :class="$style.fabButton"
          class="ml-auto my-auto"
          fab
          @click="handleClose"
        >
          <v-icon>$close</v-icon>
        </v-btn>
      </div>
      <template v-if="$fetchState.pending">
        <v-row
          class="fill-height ma-0"
          align="center"
          justify="center"
          style="min-height: 300px; height: 50vh"
        >
          <v-progress-circular indeterminate color="accent" size="200" />
        </v-row>
      </template>
      <template v-else>
        <div v-show="showProductCard">
          <div class="pa-5" itemscope itemtype="http://schema.org/Product">
            <h1
              itemprop="name"
              class="font-weight-bold mb-5"
              style="line-height: normal; font-size: 1.5rem"
              v-text="product.name"
            />
            <LazyHydrate when-visible>
              <div class="content-right">
                <v-card
                  class="mb-3 image-wrapper d-flex"
                  :class="showImageDialog && 'pa-3'"
                  :hover="showImageDialog"
                  :ripple="showImageDialog"
                  :flat="!showImageDialog"
                  :tile="!showImageDialog"
                  v-on="
                    showImageDialog ? { click: () => handleImageDialog() } : {}
                  "
                  v-if="product.img"
                >
                  <div class="mini-imgs-wrapper pr-3 pt-3">
                    <v-tooltip left max-width="400px" style="display: block">
                      <template v-slot:activator="{ on }">
                        <v-img
                          itemprop="image"
                          class="manufacturer-img"
                          contain
                          height="3rem"
                          width="3rem"
                          :src="
                            require(`~/assets/images/manufacturers/${product.manufacturer.slug}.png?resize&size=50`)
                          "
                          :alt="product.manufacturer.name"
                          :title="product.manufacturer.name"
                          v-on="on"
                        />
                      </template>
                      <span>{{ product.manufacturer.description }}</span>
                    </v-tooltip>

                    <v-img
                      class="halal-img mt-1"
                      v-if="product.isHalal"
                      contain
                      :src="require('~/assets/images/halal-min.png')"
                      alt="Халяльная продукция"
                      title="Халяльная продукция"
                      height="3rem"
                      width="3rem"
                    />
                  </div>
                  <v-img
                    class="item-img d-block"
                    :src="imgUrl"
                    eager
                    :alt="product.name"
                    :title="product.name"
                    contain
                  >
                  </v-img>
                </v-card>
                <price
                  :class="$style.pricesWrapper"
                  class="pt-3 pb-1"
                  :priceNum="product.priceNum"
                  :isDiscount="product.isDiscount"
                  :discountPrice="product.discountPrice"
                  :piece="product.piece"
                  :weight="product.weight"
                  :minimumOrder="product.minimumOrder"
                />
                <product-add
                  class="mt-3"
                  style="height: 48px"
                  v-if="product.priceNum"
                  :id="product._id"
                  @add="handleAdd"
                />
                <v-btn
                  class="mt-3 fill-width"
                  dark
                  color="#d50000"
                  height="48px"
                  large
                  outlined
                  block
                  title="Купить в один клик"
                  @click="handleOneClickBuy"
                >
                  Купить в один клик
                </v-btn>
              </div>
            </LazyHydrate>
            <div class="manufacturer my-3" v-if="product.manufacturer">
              Производитель:
              <nuxt-link
                class="underline-on-hover"
                :to="`/manufacturers/${product.manufacturer.slug}`"
                v-text="product.manufacturer.name"
                :title="product.manufacturer.name"
              />
            </div>
            <LazyHydrate never>
              <content-wrapper :content="contentFull" />
            </LazyHydrate>
            <meta
              itemprop="description"
              :content="`${product.name} купить в Альянс Фуд за ${product.priceNum}`"
            />
          </div>

          <LazyHydrate v-if="related.length" when-visible>
            <div class="grey lighten-3">
              <h2 class="mb-2 pl-5 pt-4">Похожие товары</h2>

              <v-row no-gutters class="pa-3">
                <v-col
                  v-for="product in related"
                  :key="product.id"
                  class="pa-2"
                  cols="12"
                  sm="6"
                  md="4"
                  lg="3"
                >
                  <lazy-product-card
                    v-if="related.length"
                    :product="product"
                    grandparent="catalog"
                    :parent="product.category.slug"
                  />
                </v-col>
              </v-row>
            </div>
          </LazyHydrate>
        </div>
        <div
          v-show="!showProductCard"
          class="py-6 px-5 mx-auto"
          style="max-width: 600px"
        >
          <div class="fs-1-5 mb-5 font-weight-bold mb-3">
            Купить "{{ product.name }}" в один клик
          </div>
          <lazy-contact-form
            v-if="!showProductCard"
            :oneClickBuy="true"
            :productName="product.name"
          />
        </div>
      </template>
    </v-sheet>
    <lazy-dialog-image
      ref="imageDialog"
      class="imageDialog"
      v-if="showImageDialog && dialogImg"
      :img="product.img"
      :value="dialogImg"
      :alt="product.name"
      @close="dialogImg = false"
    />
  </div>
</template>
<script>
import LazyHydrate from "vue-lazy-hydration";
import gql from "graphql-tag";

export default {
  name: "child",
  transition: "dialog",

  props: {
    breadcrumbsBase: {
      type: Array,
      default: () => [],
    },
    // isProductRoute: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  head() {
    if (this.isProduct && this.product.name && this.product.slug) {
      return {
        bodyAttrs: {
          class: this.isProduct && "m-open",
        },
        htmlAttrs: {
          class: this.isProduct && "m-open",
        },
        title: `${this.product.name} оптом`,
        link: [
          {
            rel: "canonical",
            href: `https://prodaem-kolbasu.ru/catalog/${this.product.category.slug}/${this.product.slug}`,
          },
        ],
        meta: [
          {
            hid: "description",
            name: "description",
            content: this.product.description
              ? this.product.description.slice(0, 310)
              : `${this.product.name} оптом. ${this.product.name} от компании Альянс Фуд с доставкой по всей РФ и СНГ по самым выгодным оптовым ценам от производителя.`,
          },
        ],
      };
    }
  },
  components: {
    LazyHydrate,
  },
  data() {
    return {
      imageBaseUrl: this.$config.imageBaseUrl,
      showProductCard: true,
      dialogImg: false,
      product: {},
      contentFull: "",
      breadcrumbs: this.breadcrumbsBase,
      // isDiscount: false,
      // discountPriceProcent: 0,
      showImageDialog: false,
      imgUrl: "",
      // price: 0,
      related: [],
      // pageData: false,
    };
  },
  loading: false,
  watch: {
    "$route.params.slug": "$fetch",
  },
  fetchDelay: 0,
  async fetch() {
    if (!this.isProduct) {
      return;
    }
    // const isLoading = process.client;
    if (process.client) {
      this.$nuxt.$loading.start();
    }
    const {
      data: {
        products: [product],
      },
    } = await this.$apollo.query({
      query: gql`
        fragment relatedProduct on Product {
          name
          slug
          weight
          isDiscount
          isHalal
          priceNum
          discountPrice
          minimumOrder
          piece
          manufacturer {
            slug
            name
          }
          category {
            slug
          }
          img {
            url
            formats
          }
        }
        query ProductQuery($slug: String!) {
          products(where: { slug: $slug }) {
            _id
            description
            name
            slug
            content
            weight
            isDiscount
            isHalal
            priceNum
            discountPrice
            minimumOrder
            piece
            category {
              name
              slug
            }
            img {
              url
              formats
              width
              height
            }
            manufacturer {
              name
              slug
              description
            }
            relatedProducts {
              ...relatedProduct
            }
            productsRelated {
              ...relatedProduct
            }
          }
        }
      `,
      variables: {
        slug: this.$route.params.slug,
      },
    });

    if (!product) {
      // console.log(Object.keys(this.$nuxt));
      return this.$nuxt.error({
        statusCode: 404,
        message: "Товар не найден",
        type: "catalog",
      });
    }
    const { content, description, ...productData } = product;
    // console.log(
    //   "🚀 ~ file: _slug.vue ~ line 338 ~ fetch ~ product",
    //   productData
    // );
    this.product = productData;
    this.breadcrumbs = [...this.breadcrumbsBase, { text: product.name }];
    // console.log(
    //   "🚀 ~ file: _slug.vue ~ line 416 ~ fetch ~ this.breadcrumbs",
    //   this.breadcrumbs
    // );

    const phone = this.$store.state.sessionStorage.generalInfo.contacts.phone;
    let contentFull = "";
    if (description) {
      contentFull += `<p>${description}</p>`;
    } else {
      contentFull += `<p> ${product.name}, представленная на нашем сайте продается по максимально выгодным ценам при условии оптовой покупки. Мы заботимся о вашем здоровье, предлагая качественные продукты отечественного производства. </p><p> ${product.name} c быстрой доставкой по Москве и МО. Доставка заказов также осуществляется во все регионы России и в страны СНГ. </p><p> Для оформления заказа воспользуйтесь формой на сайте или звоните по телефону <a style="white-space: nowrap;" :href="tel:${phone}">${phone}</a> </p>`;
    }
    if (content) {
      contentFull += content;
    }
    this.contentFull = contentFull;
    // this.isDiscount = product.isDiscount && !!product.discountPrice;
    // if (this.isDiscount) {
    //   this.discountPriceProcent = Math.round(
    //     (100 * (product.priceNum - product.discountPrice)) / product.priceNum
    //   );
    //   this.price = product.discountPrice;
    // } else {
    //   this.price = product.priceNum;
    // }
    const relatedProducts = product.relatedProducts || [];
    const productsRelated = product.productsRelated || [];
    this.related = [...relatedProducts, ...productsRelated];
    // let imgUrl=""

    if (!product.img) {
      this.imgUrl = "/no-image.png";
    } else if (!product.img.formats) {
      this.imgUrl = this.imageBaseUrl + product.img.url;
    } else if (this.product.img.formats.small) {
      this.imgUrl = this.imageBaseUrl + product.img.formats.small.url;
      this.showImageDialog = true;
    } else {
      this.imgUrl = this.imageBaseUrl + product.img.formats.thumbnail.url;
    }
    if (process.client) {
      this.$nuxt.$loading.finish();
    }
    // setTimeout(() => , 2000);
    //   this.$nuxt.$loading.finish();
    // }
    // this.pageData = true;
    // console.log(
    //   "🚀 ~ file: _slug.vue ~ line 564 ~ fetch ~ this.pageData",
    //   this.pageData
    // );

    // return this.imageBaseUrl + this.product.img.formats.thumbnail.url;
    // console.log("related", this.related);
    //     price() {
    //   return this.isDiscount
    //     ? this.product.discountPrice
    //     : this.product.priceNum;
    // },
    // related() {
    //   const relatedProducts = this.product.relatedProducts || [];
    //   const productsRelated = this.product.productsRelated || [];
    //   return [...relatedProducts, ...productsRelated];
    // },
    // this.breadcrumbs.push({ text: product.name });
    // breadcrumbs() {
    //   return [
    //     ...this.$store.state.sessionStorage.breadcrumbs,
    //     { text: this.product.name },
    //   ];
    // },
  },
  // enter() {
  //   console.log("enter");
  // },
  methods: {
    // async handleClickOutside(e) {
    //   console.log(
    //     "🚀 ~ file: _slug.vue ~ line 519 ~ handleClickOutside ~ e",
    //     e
    //   );
    // },
    async handleClose() {
      this.$refs.modal.classList.add("dialog-leave-to");
      setTimeout(async () => {
        this.$refs.modal.classList.remove("dialog-leave-to");
        this.showProductCard = true;
        // if (!this.dialogImg) {
        await this.$emit("close");
      }, 200);

      // }
    },
    async handleAdd() {
      this.$store.dispatch("addToCart", this.product);
    },
    handleImageDialog() {
      this.dialogImg = true;
    },

    handleOneClickBuy() {
      this.showProductCard = false;
    },
  },
  computed: {
    isProduct: {
      get() {
        return !!this.$route.params.slug;
      },
      set(val) {
        if (!val) {
          this.handleClose();
        }
      },
    },
  },
};
</script>
<style lang="scss">
// .dialog-enter-active,
// .dialog-leave-active {
//   transition: opacity 3s;
// }

// .dialog-enter,
// .dialog-leave-to {
//   opacity: 0;
// }
.dialog-enter,
.dialog-leave-to {
  .modal-mask {
    opacity: 0;
  }
  .modal-inner {
    transform: scale(0.5);
    opacity: 0;
  }
}
.dialog-enter-to,
.dialog-leave {
  .modal-mask {
    opacity: 1;
  }
  .modal-inner {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
<style lang="scss" scoped module>
.fabButton {
  // @include closeButton();
  width: var(--fab-button-size) !important;
  height: var(--fab-button-size) !important;
}

// .dialogInner {
// height: 100%;

.toolbar {
  background-color: #e0e0e0;
  border-color: #e0e0e0;
  display: flex;
  align-content: center;
  padding: 10px;
  padding-left: 20px;
  z-index: 4;

  @supports ((position: -webkit-sticky) or (position: sticky)) {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
  }

  @include md {
    padding: 20px;
  }
}
.pricesWrapper {
  --font-size: 26px;
  --reduced-font-size: 1rem;
}
// }
// .pricesWrapper {
//   display: flex;
//   align-items: center;
//   flex-wrap: wrap;
//   justify-content: space-around;
//   .priceWrapper {
//     display: flex;
//     align-items: flex-end;
//     flex-wrap: wrap;
//     font-weight: 500;
//     color: $black;
//     .discount {
//       text-decoration: line-through;
//       font-size: 1.5rem;
//       line-height: 1;
//       color: rgba($black, 0.6);
//       padding-bottom: 1px;
//     }
//     .priceCurrency {
//       // padding-bottom: 2px;
//       font-size: 2rem;
//       font-weight: 500;
//       line-height: 1;
//       .priceIcon {
//         color: $black;
//       }
//     }
//     .noPrice {
//       font-size: 1.5rem;
//     }
//     .price {
//       font-weight: 700;
//       font-size: 2rem;
//       line-height: 1;
//     }
//     .discountPriceProcent {
//       background-color: $accent !important;
//       border-color: $accent !important;
//       border-radius: 16px;
//       font-size: 16px;
//       height: 26px;
//       align-items: center;
//       display: inline-flex;
//       padding: 0 8px;
//       color: $white;
//     }
//   }
// }
</style>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;
  z-index: 200;
  // transform: none !important;
  justify-content: normal;
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  // padding-top: 2vh;

  width: 100%;

  transition: 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);

  // z-index: inherit;
  box-shadow: 0 11px 15px -7px rgb(0 0 0 / 20%),
    0 24px 38px 3px rgb(0 0 0 / 14%), 0 9px 46px 8px rgb(0 0 0 / 12%);

  padding-left: var(--dialog-margin);
  padding-right: var(--dialog-margin);
  .modal-mask {
    left: 0;
    bottom: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 199;
    background-color: rgba(51, 51, 51, 0.5);
    transition: opacity 0e ease;
  }

  .modal-inner {
    // margin-left: 24px;
    // margin-right: 24px;
    z-index: 200;
    position: relative;
    border-radius: 4px;
    overflow-y: auto;
    width: 100%;
    transform-origin: center center;
    box-shadow: 0px 11px 15px -7px rgb(0 0 0 / 20%),
      0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%);

    transition: 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

    margin-top: calc(var(--toolbar-height) + var(--dialog-margin));
    margin-bottom: var(--dialog-margin);
    max-width: var(--dialog-width);
    //  $dialog-mobile-margin
    //   $dialog-mobile-margin !important;
    // max-height: calc(
    //   100% - var(--toolbar-height) + var(--dialog-margin) * 2
    // ) !important;

    // @include md {
    //   //   margin: $toolbar-desktop-height + $dialog-desktop-margin
    //   //     $dialog-desktop-margin $dialog-desktop-margin !important;
    //   //   max-height: calc(
    //   //     100% - #{$toolbar-desktop-height + $dialog-desktop-margin * 2}
    //   //   ) !important;
    //   max-width: 900px !important;
    // }

    // @include lg {
    //   max-width: 1185px !important;
    // }
  }
}
// .closeButton {
//   width: 44px !important;
//   height: 44px !important;
//   @include md {
//     width: 48px !important;
//     height: 48px !important;
//   }
// }

.mini-imgs-wrapper {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;

  // .manufacturer-img {
  //   height: 3.5rem;
  //   width: 3.5rem;
  //   // object-fit: contain;
  // }

  // .halal-img {
  //   height: 3.5rem;
  //   width: 3.5rem;
  //   padding: 7px;
  //   // object-fit: contain;
  // }
}

.halal-img {
  display: block;
}

.mw500 {
  max-width: 500px;
}

.image-wrapper {
  position: relative;
  min-height: 165px;

  .item-img {
    max-height: 165px;
    // object-fit: contain;
  }
}
@include md {
  .content-right {
    float: right;
    width: 260px;
    margin-left: 30px;
    margin-bottom: 15px;
  }
}

@include lg {
  .content-right {
    width: 310px;
    margin-left: 45px;
    margin-bottom: 20px;
  }
}
</style>