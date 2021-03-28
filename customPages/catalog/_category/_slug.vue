<template>
  <div
    v-if="isProduct"
    class="modal"
    ref="modal"
    tabindex="0"
    @keydown.esc="handleClose"
  >
    <div class="modal-mask" @click="handleClose" />
    <div class="modal-inner">
      <LazyHydrate when-idle>
        <div class="toolbar">
          <v-btn
            class="fabButton mr-3 my-auto"
            v-if="!showProductCard"
            color="gray"
            fab
            @click="showProductCard = true"
            title="Назад"
          >
            <v-icon>$arrowLeft</v-icon>
          </v-btn>
          <breadcrumbs class="pr-3 my-auto" :items="breadcrumbs" dark />
          <!-- :class="$style.fabButton" -->
          <v-btn class="fabButton ml-auto my-auto" fab @click="handleClose">
            <v-icon>$close</v-icon>
          </v-btn>
        </div>
      </LazyHydrate>
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
        <template v-if="showProductCard">
          <LazyHydrate when-idle>
            <div
              class="dialog-product"
              itemscope
              itemtype="http://schema.org/Product"
            >
              <h1 itemprop="name" class="productTitle" v-text="product.name" />
              <div class="content-right">
                <!-- {{ imgThumbnail }}
                {{ imgThumbnail.height > 300 }} -->
                <v-card
                  class="mb-3 image-wrapper"
                  :ripple="showImageDialog"
                  :outlined="!showImageDialog"
                  :hover="showImageDialog"
                  v-on="
                    showImageDialog ? { click: () => handleImageDialog() } : {}
                  "
                >
                  <div class="mini-imgs-wrapper pr-3 pt-3">
                    <v-tooltip
                      v-if="product.manufacturer.description"
                      activator="#manufacturer-img"
                      left
                      max-width="400px"
                      style="display: block"
                      z-index="205"
                      nudge-left
                    >
                      <span>{{ product.manufacturer.description }}</span>
                    </v-tooltip>
                    <v-img
                      class="manufacturer-img"
                      id="manufacturer-img"
                      contain
                      height="3rem"
                      width="3rem"
                      :src="
                        require(`~/assets/images/manufacturers/${product.manufacturer.slug}.png?resize&size=50`)
                      "
                      :alt="product.manufacturer.name"
                      :title="product.manufacturer.name"
                    />
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
                  <v-responsive
                    :aspect-ratio="16 / 9"
                    :max-height="
                      +imgThumbnail.height < 300
                        ? imgThumbnail.height + 10
                        : 300
                    "
                  >
                    <img
                      itemscope="itemscope"
                      itemprop="image"
                      class="item-img"
                      :src="imgThumbnail.url"
                      :alt="product.name"
                      contain
                    />
                  </v-responsive>
                </v-card>
                <!-- :class="$style.pricesWrapper" -->
                <price
                  class="productPricesWrapper pt-3 pb-1"
                  :priceNum="product.priceNum"
                  :isDiscount="product.isDiscount"
                  :discountPrice="product.discountPrice"
                  :piece="product.piece"
                  :weight="product.weight"
                  :minimumOrder="product.minimumOrder"
                />
                <product-add
                  class="productAdd mt-3"
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
              <div class="manufacturer" v-if="product.manufacturer">
                Производитель:
                <nuxt-link
                  class="underline-on-hover"
                  :to="`/manufacturers/${product.manufacturer.slug}`"
                  v-text="product.manufacturer.name"
                  :title="product.manufacturer.name"
                />
              </div>
              <!-- <LazyHydrate never> -->
              <content-wrapper :content="contentFull" />
              <!-- </LazyHydrate> -->
              <meta
                itemprop="description"
                :content="`${product.name} купить в Альянс Фуд за ${product.priceNum}`"
              />
            </div>
          </LazyHydrate>
          <LazyHydrate v-if="related.length" when-visible>
            <div class="grey lighten-3" style="clear: both">
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
        </template>
        <div v-else class="dialog-form-wrapper">
          <!-- v-show="!showProductCard" class="fs-1-5 mb-5 font-weight-bold mb-3" -->
          <LazyHydrate on-interaction>
            <lazy-contact-form
              v-if="!showProductCard"
              :oneClickBuy="true"
              :productName="product.name"
            >
              <h2 class="dialog-form-wrapper-header">
                Купить "{{ product.name }}" в один клик
              </h2>
            </lazy-contact-form>
          </LazyHydrate>
        </div>
      </template>
    </div>
    <lazy-dialog-image
      ref="imageDialog"
      class="imageDialog"
      v-if="showImageDialog && dialogImg"
      :img="imgDialog"
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
        // bodyAttrs: {
        //   class: this.isProduct && "m-open",
        // },
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
      showProductCard: true,
      dialogImg: false,
      product: {},
      contentFull: "",
      breadcrumbs: this.breadcrumbsBase,
      showImageDialog: false,
      // imgUrl: "",
      imgThumbnail: {},
      imgDialog: null,
      related: [],
      isLoading: false,
      // pageData: false,
    };
  },
  loading: false,
  watch: {
    "$route.params.slug": "$fetch",
    isLoading(val) {
      if (!process.client) {
        return;
      }
      if (val) {
        this.$nuxt.$loading.start();
      } else {
        this.$nuxt.$loading.finish();
      }
    },
  },
  fetchDelay: 0,
  async fetch() {
    if (!this.isProduct) {
      return;
    }
    this.isLoading = true;
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
    this.product = productData;
    this.breadcrumbs = [...this.breadcrumbsBase, { text: product.name }];

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
    const relatedProducts = product.relatedProducts || [];
    const productsRelated = product.productsRelated || [];
    this.related = [...relatedProducts, ...productsRelated];
    // console.log("🚀 ~ file: _slug.vue ", img);
    await this.caclulateImage(product.img);
    this.isLoading = false;
  },
  methods: {
    caclulateImage(imageObject) {
      if (!imageObject) {
        this.imgUrl = "/no-image.png";
        return;
      }
      const imageBaseUrl = this.$config.imageBaseUrl;

      if (!imageObject.formats) {
        this.imgThumbnail = {
          height: imageObject.height,
          url: imageBaseUrl + imageObject.url,
        };
      } else if (imageObject.formats.small) {
        this.imgThumbnail = {
          height: imageObject.formats.small.height,
          url: imageBaseUrl + imageObject.formats.small.url,
        };
      } else {
        this.imgThumbnail = {
          height: imageObject.formats.thumbnail.height,
          url: imageBaseUrl + imageObject.formats.thumbnail.url,
        };
      }
      if (imageObject.width > 500) {
        this.showImageDialog = true;
        this.imgDialog = {
          width: imageObject.width,
          height: imageObject.height,
          url: imageObject.url,
        };
      }
    },
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
// .dialog-content-wrapper {
//   max-width: var(--dialog-width) !important;
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
</style>

<style lang="scss" scoped>
.modal {
  --card-padding: 18px;
  // --card-padding-increased: calc(var(--card-padding) + 5px);
  @include md {
    --card-padding: 24px;
  }
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  flex-direction: column;
  height: 100%;
  z-index: 200;
  align-items: center;
  display: flex;
  height: 100%;
  justify-content: center;
  width: 100%;
  transition: 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
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
    background-color: #ffffff;
    border-color: #ffffff;
    color: rgba(0, 0, 0, 0.87);
    outline: none;

    .toolbar {
      background-color: #e0e0e0;
      border-color: #e0e0e0;
      display: flex;
      align-content: center;
      padding: 10px;
      // padding-left: 20px;
      padding-left: var(--card-padding);
      z-index: 4;

      @supports ((position: -webkit-sticky) or (position: sticky)) {
        position: -webkit-sticky;
        position: sticky;
        top: -1px;
        transform: translateY(0px);
        left: 0px;
        right: 0px;
        contain: layout;
      }

      @include md {
        padding: 20px;
      }
      .fabButton {
        width: var(--fab-button-size) !important;
        height: var(--fab-button-size) !important;
      }
    }

    .dialog-product {
      padding: var(--card-padding);
      overflow: hidden;

      .productPricesWrapper {
        --font-size: 26px;
        --reduced-font-size: 1rem;
      }
      .productTitle {
        margin-bottom: 24px;
        font-weight: bold;
        line-height: normal;
        font-size: 1.5rem;
        @include md {
          margin-bottom: 12px;
        }
      }
      .image-wrapper {
        position: relative;
        padding: var(--card-padding);
        // min-height: 165px;
        // max-height: 350px;
        // &:after {
        //   content: "";
        //   display: block;
        //   padding-bottom: 66.66666667%;
        // }
        .item-img {
          // max-height: 165px;
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          max-height: 100%;
          max-width: 100%;
          // position: absolute;
          // top: 50%;
          // left: 50%;
          // transform: translate(-50%, -50%);
        }
        .mini-imgs-wrapper {
          position: absolute;
          right: 0;
          top: 0;
          z-index: 1;
          .halal-img {
            display: block;
          }
        }
      }
      .manufacturer {
        margin-bottom: 12px;
        margin-top: 12px;
        // margin-top: calc(var(--card-padding) + 5px);
        // margin-bottom: var(--card-padding);
        // @include md {
        //   margin-top: 12px;
        // }
      }
      .productAdd {
        height: 48px !important;
        --product-add-background: #d50000;
        --product-add-color: #{$white};
        --product-add-font-size: 14px;
        --quantity-border-radius: 0px;
        --quantity-btn-margin: 12px;
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
    }

    .dialog-form-wrapper {
      // min-height: calc(var(--dialog-max-height) - 88px);
      min-height: 60vh;
      max-width: 600px;
      padding-top: var(--card-padding);
      padding-bottom: var(--card-padding);
      margin: auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: var(--card-padding);
      padding-right: var(--card-padding);
      @include md {
        padding-top: 4.5rem;
        padding-bottom: 5rem;
      }
      .dialog-form-wrapper-header {
        font-size: 1.5rem;
        margin-bottom: var(--card-padding);
        font-weight: bold;
        line-height: 125%;
        @include md {
          margin-bottom: 35px;
        }
      }
    }
  }
}
</style>