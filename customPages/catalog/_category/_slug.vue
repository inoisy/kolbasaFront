<template>
  <div
    v-if="isProduct"
    class="modal"
    ref="modal"
    tabindex="0"
    @keydown.esc="handleClose"
  >
    <div class="modal-mask" @click="handleClose" />
    <div class="modal-inner" :class="!showProductCard && 'formShowed'">
      <LazyHydrate when-idle>
        <div class="toolbar">
          <v-btn
            class="fabButton backButton my-auto"
            v-if="!showProductCard"
            color="gray"
            fab
            @click="showProductCard = true"
            title="Назад"
          >
            <v-icon>$arrowLeft</v-icon>
          </v-btn>
          <breadcrumbs class="pr-3 my-auto" :items="breadcrumbs" dark />
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
                <v-card
                  id="imgWrapper"
                  class="image-wrapper"
                  :outlined="!showImageDialog"
                  :disabled="!showImageDialog"
                  @click="handleImageDialog"
                >
                  <div class="mini-imgs-wrapper pr-3 pt-3">
                    <div ref="manufImage">
                      <v-btn
                        id="manufacturer-img"
                        :outlined="isManufacturerDesctiption"
                        width="55px"
                        height="55px"
                        class="pa-0"
                        color="rgba(0,0,0,0.4)"
                        :text="!isManufacturerDesctiption"
                        :disabled="!isManufacturerDesctiption"
                      >
                        <img
                          class="manufacturer-img"
                          :src="manufacturerImgMin"
                          :alt="product.manufacturer.name"
                          height="50px"
                          width="50px"
                        />
                      </v-btn>

                      <v-menu
                        v-if="isManufacturerDesctiption"
                        activator="#manufacturer-img"
                        attach="#imgWrapper"
                        z-index="205"
                        absolute
                        eager
                        max-width="100%"
                      >
                        <v-sheet class="tooltip-inner">
                          {{ product.manufacturer.description }}
                        </v-sheet>
                      </v-menu>
                    </div>
                    <img
                      class="halal-img mt-2 mx-auto"
                      v-if="product.isHalal"
                      src="/images/halal-min.png"
                      alt="Халяльная продукция"
                      title="Халяльная продукция"
                      height="50px"
                      width="50px"
                    />
                  </div>
                  <div class="image-inner">
                    <div
                      :style="`padding-top: ${
                        (imgThumbnail.height / imgThumbnail.width) * 100
                      }%`"
                    />
                    <img
                      itemscope="itemscope"
                      itemprop="image"
                      class="item-img"
                      :src="$config.imageBaseUrl + imgThumbnail.url"
                      :alt="product.name"
                      contain
                    />
                  </div>
                </v-card>
                <price
                  class="productPricesWrapper"
                  :priceNum="product.priceNum"
                  :isDiscount="product.isDiscount"
                  :discountPrice="product.discountPrice"
                  :piece="product.piece"
                  :weight="product.weight"
                  :minimumOrder="product.minimumOrder"
                />
                <product-add
                  class="productAdd"
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
              <content-wrapper :content="contentFull" />
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
      @loaded="loadingEnd"
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
  },
  head() {
    if (this.isProduct && this.product.name && this.product.slug) {
      return {
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
      product: {
        manufacturer: {},
      },
      contentFull: "",
      breadcrumbs: this.breadcrumbsBase,
      showImageDialog: false,
      imgThumbnail: {},
      imgDialog: null,
      related: [],
      isShowManufacturerInfo: false,
      manufacturerImgMin: null,
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
    this.loadingStart();
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
      return this.$nuxt.error({
        statusCode: 404,
        message: "Товар не найден",
        type: "catalog",
      });
    }
    const { content, description, ...productData } = product;
    this.product = productData;
    this.breadcrumbs = [...this.breadcrumbsBase, { text: product.name }];

    const phone = this.$store.state.info.data.contacts.phone;
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
    this.manufacturerImgMin = require(`~/assets/images/manufacturers/${product.manufacturer.slug}.png?resize&size=50`);
    await this.caclulateImage(product.img);
    this.loadingEnd();
  },
  methods: {
    caclulateImage(imageObject) {
      if (!imageObject) {
        this.imgUrl = "/no-image.png";
        return;
      }
      let thumbnailImageObject = imageObject;
      if (imageObject.formats.small) {
        thumbnailImageObject = imageObject.formats.small;
      } else {
        thumbnailImageObject = imageObject.formats.thumbnail;
      }
      this.imgThumbnail = {
        width: thumbnailImageObject.width,
        height: thumbnailImageObject.height,
        url: thumbnailImageObject.url,
      };
      if (imageObject.width > 500) {
        this.showImageDialog = true;
        this.imgDialog = {
          width: imageObject.width,
          height: imageObject.height,
          url: imageObject.url,
        };
      }
    },
    loadingStart() {
      if (!process.client) {
        return;
      }
      this.$nuxt.$loading.start();
    },
    loadingEnd() {
      if (!process.client) {
        return;
      }
      this.$nuxt.$loading.finish();
    },
    async handleClose() {
      this.$refs.modal.classList.add("dialog-leave-to");
      setTimeout(async () => {
        this.$refs.modal.classList.remove("dialog-leave-to");
        this.showProductCard = true;
        await this.$emit("close");
      }, 200);
    },
    async handleAdd() {
      this.$store.dispatch("cart/addToCart", this.product);
    },
    handleImageDialog(event) {
      if (
        !this.showImageDialog ||
        (this.isManufacturerDesctiption &&
          this.$refs.manufImage.contains(event.target))
      ) {
        return;
      }
      this.loadingStart();
      this.dialogImg = true;
    },
    handleOneClickBuy() {
      this.showProductCard = false;
    },
  },
  computed: {
    isManufacturerDesctiption() {
      return !!this.product.manufacturer.description;
    },
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
    &.formShowed {
      max-width: 600px;
    }
    .toolbar {
      background-color: #e0e0e0;
      border-color: #e0e0e0;
      display: flex;
      align-content: center;
      padding-top: 10px;
      padding-bottom: 10px;
      // padding-left: 20px;
      padding-left: var(--card-padding);
      padding-right: var(--card-padding);
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

      // @include md {
      //   // padding: 20px;
      // }
      .fabButton {
        width: var(--fab-button-size) !important;
        height: var(--fab-button-size) !important;
      }
      .backButton {
        margin-right: 10px;
        margin-left: -5px;
        @include sm {
          margin-left: 0;
          margin-right: var(--card-padding);
        }
      }
    }

    .dialog-product {
      padding: var(--card-padding);
      overflow: hidden;

      .productPricesWrapper {
        --font-size: 26px;
        --reduced-font-size: 1rem;
        margin-bottom: calc(var(--card-padding) - 10px);
      }
      .productTitle {
        margin-bottom: var(--card-padding);
        font-weight: bold;
        line-height: normal;
        font-size: 1.5rem;
        // @include md {
        //   margin-bottom: 12px;
        // }
      }
      .image-wrapper {
        position: relative;
        padding: 12px;
        margin-bottom: var(--card-padding);
        .image-inner {
          max-height: 180px;
          overflow: hidden;
          position: relative;
          @include sm {
            max-height: 200px;
          }
          @include md {
            max-height: 250px;
          }
          .item-img {
            height: 100%;
            object-fit: contain;
            max-height: 100%;
            max-width: 100%;
            border-radius: 4px;
            margin-left: auto;
            margin-right: auto;
            display: block;
            position: absolute;
            top: 0px;
            left: 0px;
            right: 0;
            bottom: 0;
          }
        }

        .tooltip-inner {
          background: rgb(39 39 39 / 90%);
          color: rgb(255, 255, 255);
          border-radius: 4px;
          font-size: 12px;
          padding: 10px 16px;
          pointer-events: none;
        }
        .mini-imgs-wrapper {
          position: absolute;
          right: 0;
          top: 0;
          z-index: 1;
          pointer-events: all;
          user-select: all;
          .halal-img {
            display: block;
            object-fit: contain;
          }
          .manufacturer-img {
            display: block;
            object-fit: contain;
          }
        }
      }
      .manufacturer {
        margin-bottom: 12px;
        margin-top: var(--card-padding);
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
      // @include md {
      //   padding-top: 4.5rem;
      //   padding-bottom: 5rem;
      // }
      .dialog-form-wrapper-header {
        font-size: 18px;
        margin-bottom: var(--card-padding);
        font-weight: bold;
        line-height: 125%;
        @include md {
          font-size: 1.5rem;
          // margin-bottom: 35px;
        }
      }
    }
  }
}
</style>
