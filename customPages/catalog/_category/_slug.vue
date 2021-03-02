<template>
  <v-dialog
    v-model="isProduct"
    scrollable
    :width="showProductCard ? 'auto' : '600px'"
    content-class="dialog-content-wrapper"
    :retain-focus="false"
  >
    <v-sheet :class="$style.dialogInner" light>
      <div :class="$style.toolbar">
        <v-btn
          class="mr-1 my-auto"
          v-if="!showProductCard"
          color="gray"
          fab
          @click="showProductCard = true"
          title="Назад"
          :small="$vuetify.breakpoint.smAndDown"
        >
          <v-icon>$arrowLeft</v-icon>
        </v-btn>
        <breadcrumbs class="pl-2" :items="breadcrumbs" dark />

        <v-btn
          :class="$style.closeButton"
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
          style="min-height: 50vh"
        >
          <v-progress-circular
            indeterminate
            color="accent"
            size="200"
          ></v-progress-circular>
        </v-row>
      </template>
      <template v-else>
        <v-container grid-list-lg class="position-relative fill-height px-5">
          <v-layout
            row
            wrap
            v-show="showProductCard"
            itemscope
            itemtype="http://schema.org/Product"
          >
            <v-flex>
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
                      showImageDialog
                        ? { click: () => handleImageDialog() }
                        : {}
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
                      :alt="product.name"
                      :title="product.name"
                      contain
                    >
                    </v-img>
                  </v-card>
                  <div :class="$style.pricesWrapper">
                    <div
                      :class="$style.priceWrapper"
                      class="py-3"
                      itemprop="offers"
                      itemscope
                      itemtype="http://schema.org/Offer"
                    >
                      <span
                        :class="[price ? $style.price : $style.noPrice]"
                        itemprop="price"
                        >{{ price || "Нет в наличии" }}</span
                      >

                      <span
                        :class="$style.priceCurrency"
                        itemprop="priceCurrency"
                        v-show="price"
                      >
                        <v-icon :class="$style.priceIcon">$rub</v-icon>
                      </span>
                      <div v-if="price && product.weight" class="pl-1">
                        / {{ product.weight }} кг.
                      </div>
                      <span
                        :class="$style.discount"
                        class="pl-1"
                        v-if="isDiscount"
                      >
                        {{ product.priceNum }}
                      </span>
                      <div
                        :class="$style.discountPriceProcent"
                        v-if="isDiscount"
                        class="ml-2"
                      >
                        -{{ discountPriceProcent }}%
                      </div>
                    </div>
                    <div
                      v-if="product.minimumOrder > 1"
                      :class="$style.priceWrapper"
                    >
                      <span :class="$style.price">
                        {{ Math.round(price * product.minimumOrder) }}
                      </span>
                      <span :class="$style.priceCurrency">
                        <v-icon :class="$style.priceIcon">$rub</v-icon>
                      </span>
                      <span class="pl-2"
                        >/ {{ product.minimumOrder }}
                        {{ product.piece ? "шт." : "кг." }}</span
                      >
                    </div>
                  </div>

                  <product-add
                    class="mt-3"
                    style="height: 48px"
                    v-if="price"
                    :id="product._id"
                    @add="handleAdd"
                  />
                  <!-- @delete="handleDelete" -->
                  <!-- <v-btn
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
                  </v-btn> -->
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
            </v-flex>
          </v-layout>
          <!-- <div v-show="!showProductCard" class="pb-6 pt-6 mx-auto">
            <div class="fs-1-5 mb-5 font-weight-bold mb-3">
              Купить "{{ product.name }}" в один клик
            </div>
            <lazy-contact-form
              v-if="!showProductCard"
              :oneClickBuy="true"
              :productName="product.name"
            />
          </div> -->
        </v-container>
      </template>
      <LazyHydrate v-if="related.length" when-visible>
        <div class="grey lighten-3" v-show="showProductCard">
          <v-container grid-list-lg class="py-5 px-5">
            <v-layout row wrap>
              <v-flex xs12>
                <h2 class="mb-2">Похожие товары</h2>
              </v-flex>
              <v-flex
                v-for="product in related"
                :key="product.id"
                xs12
                sm6
                md4
                lg3
              >
                <lazy-product-card
                  v-if="related.length"
                  :product="product"
                  grandparent="catalog"
                  :parent="product.category.slug"
                />
                <!-- :to="`/catalog/${product.category.slug}/${product.slug}`" -->
              </v-flex>
            </v-layout>
          </v-container>
        </div>
      </LazyHydrate>
    </v-sheet>

    <lazy-image-dialog
      class="imageDialog"
      v-if="showImageDialog && dialogImg"
      :img="product.img"
      :value="dialogImg"
      :alt="product.name"
      @close="dialogImg = false"
    />
  </v-dialog>
</template>
<script>
import LazyHydrate from "vue-lazy-hydration";
import gql from "graphql-tag";
// function calculateImageUrl(imageObject, imageBaseUrl) {
//   if (!imageObject) {
//     return "/no-image.png";
//   }
//   if (!imageObject.formats) {
//     return imageBaseUrl + imageObject.url;
//   }
//   if (imageObject.formats.small) {
//     return imageBaseUrl + imageObject.formats.small.url;
//   }

//   return imageBaseUrl + imageObject.formats.thumbnail.url;
// }
// import ProductDialog from "~/components/ProductDialog";
export default {
  // props: {
  //   isProductRoute: {
  //     type: Boolean,
  //     default: false,
  //   },
  // },
  name: "child",
  head() {
    // console.log("head", this.isProduct);
    if (this.isProduct && this.product.name) {
      // if (!this.product || !this.product.name) return;

      return {
        title: `${this.product.name} оптом`,
        // TODO
        // link: [
        //   {
        //     rel: "canonical",
        //     href:
        //       this.category && this.category.slug
        //         ? `https://prodaem-kolbasu.ru/catalog/${this.category.slug}/${this.product.slug}`
        //         : "",
        //   },
        // ],
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
    // console.log("data CHILD INIT", this.$route.params.slug);
    return {
      imageBaseUrl: this.$config.imageBaseUrl,
      // dialog: !!this.$route.params.slug,
      // showCard: true,
      showProductCard: true,
      dialogImg: false,
      // isInCart: false,
      product: {},
      contentFull: "",
      breadcrumbs: [],
      isDiscount: false,
      discountPriceProcent: 0,
      showImageDialog: false,
      imgUrl: "",
      price: 0,
      related: [],
    };
  },
  watch: {
    "$route.params.slug": "$fetch",
  },
  fetchDelay: 0,
  async fetch() {
    // console.log("fetch  this.$route.params.slug ", this.$route.params.slug);
    // console.log("fetch  this.isProductRoute ", this.isProduct);
    if (!this.isProduct) {
      return;
    }
    const isLoading = process.client;
    // console.log(
    //   "🚀 ~ file: _slug.vue ~ line 341 ~ fetch ~ isLoading",
    //   isLoading
    // );
    if (isLoading) {
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
    // console.log("🚀 ~ file: _slug.vue ~ line 408 ~ fetch ~ products", product);

    // console.log("🚀 ~ file: _slug.vue ~ line 361 ~ fetch ~ fetch");
    // const product = await this.fetchProduct(this.$route.params.slug);
    // console.log("🚀 ~ file: _slug.vue ~ line 342 ~ fetch ~ product", product);

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
    this.breadcrumbs = [
      ...this.$store.state.sessionStorage.breadcrumbs,
      { text: product.name },
    ];
    const phone = this.$store.state.sessionStorage.generalInfo.contacts.phone;
    let contentFull = "";
    if (description) {
      contentFull += `<p>${description}</p>`;
    } else {
      contentFull += `<p> ${product.name}, представленная на нашем сайте продается по максимально выгодным ценам при условии оптовой покупки. Мы заботимся о вашем здоровье, предлагая качественные продукты отечественного производства. </p><p> ${product.name}c быстрой доставкой по Москве и МО. Доставка заказов также осуществляется во все регионы России и в страны СНГ. </p><p> Для оформления заказа воспользуйтесь формой на сайте или звоните по телефону <a :href="tel:${phone}">${phone}</a> </p>`;
    }
    if (content) {
      contentFull += content;
    }
    this.contentFull = contentFull;
    this.isDiscount = product.isDiscount && !!product.discountPrice;
    if (this.isDiscount) {
      this.discountPriceProcent = Math.round(
        (100 * (product.priceNum - product.discountPrice)) / product.priceNum
      );
      this.price = product.discountPrice;
    } else {
      this.price = product.priceNum;
    }
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
    if (isLoading) {
      this.$nuxt.$loading.finish();
    }
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
  methods: {
    async handleClose() {
      await this.$emit(
        "close"
        // this.isInCart,
        // this.product._id,
        // ...(this.product.category && this.product.category.slug)
      );
    },
    async handleAdd() {
      // this.isInCart = true;
      console.log("🚀 ~ file: _slug handleAdd");

      this.$store.dispatch("addToCart", {
        item: Object.assign({}, this.product),
      });
    },
    // async handleDelete() {
    //   this.isInCart = false;
    //   // console.log("🚀 ~ file: _slug handleDelete", this.isInCart);
    // },
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
        // console.log("getter called", !!this.$route.params.slug);
        return !!this.$route.params.slug;
      },
      set(val) {
        // console.log("🚀 ~ file: _slug.vue ~ line 384 ~ value", val);
        if (!val) {
          // console.log("handleClose called", val);
          this.handleClose();
        }
      },
    },
  },
};
</script>

<style lang="scss" scoped module>
.closeButton {
  @include closeButton();
}

.dialogInner {
  height: 100%;
  position: relative;
  .toolbar {
    background-color: #e0e0e0;
    border-color: #e0e0e0;
    display: flex;
    align-content: center;
    padding: 10px;

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
}
.pricesWrapper {
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
    .discount {
      text-decoration: line-through;
      font-size: 1.5rem;
      line-height: 1;
      color: rgba($black, 0.6);
      padding-bottom: 1px;
    }
    .priceCurrency {
      padding-bottom: 2px;
      .priceIcon {
        color: $black;
      }
    }
    .noPrice {
      font-size: 1.5rem;
    }
    .price {
      font-weight: 700;
      font-size: 2rem;
      line-height: 1;
    }
    .discountPriceProcent {
      background-color: $accent !important;
      border-color: $accent !important;
      border-radius: 16px;
      font-size: 16px;
      height: 26px;
      align-items: center;
      display: inline-flex;
      padding: 0 8px;
      color: $white;
    }
  }
}
</style>

<style lang="scss" scoped>
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