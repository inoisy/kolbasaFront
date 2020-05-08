<template>
  <v-sheet light class="fill-height position-relative">
    <div class="grey lighten-2 d-flex align-center py-3 px-4">
      <v-btn
        v-show="!showProductCard"
        color="gray"
        fab
        @click="showProductCard=true"
        title="Назад"
        :small="$vuetify.breakpoint.smAndDown"
      >
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-breadcrumbs :items="breadcrumbs" class="py-0 px-3">
        <template slot="item" slot-scope="props">
          <nuxt-link
            class="text-decoration-none"
            :title="props.item.text"
            :to="props.item.to"
            style="font-size: 0.8rem"
            exact
          >{{ props.item.text }}</nuxt-link>
        </template>
      </v-breadcrumbs>
      <v-btn class="ml-auto" fab @click="closeDialog" :small="$vuetify.breakpoint.smAndDown">
        <v-icon>close</v-icon>
      </v-btn>
    </div>
    <v-container grid-list-lg class="position-relative fill-height px-5">
      <v-layout row wrap v-show="showProductCard" itemscope itemtype="http://schema.org/Product">
        <v-flex class>
          <!-- class="display-flex column position-relative" -->
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
              v-on="showImageDialog ? { click: ()=> handleImageDialog() } : {}"
              v-if="product.img"
            >
              <!-- @click="handleImageDialog" 
              v-on="{ click: showImageDialog ? handleImageDialog : void null}"

              -->
              <div class="mini-imgs-wrapper pa-1">
                <v-tooltip left max-width="400px" style="display: block">
                  <template v-slot:activator="{ on }">
                    <img
                      itemprop="image"
                      class="manufacturer-img"
                      v-if="manufacturer.img"
                      :src="imageBaseUrl+manufacturer.img.url"
                      :alt="manufacturer.name"
                      :title="manufacturer.name"
                      v-on="on"
                    />
                  </template>
                  <span>{{manufacturer.description}}</span>
                </v-tooltip>

                <img
                  class="halal-img"
                  v-if="product.isHalal"
                  :src="require('~/assets/halal1.png')"
                  alt="Халяльная продукция"
                  title="Халяльная продукция"
                />
              </div>

              <img
                class="item-img d-block ma-auto"
                v-lazy="imgUrl"
                :alt="product.name"
                :title="product.name"
              />
              <image-dialog
                v-if="showImageDialog"
                :item="product.img"
                :value="dialogImg"
                @input="(val)=>dialogImg=val"
              ></image-dialog>
            </v-card>
            <div
              itemprop="offers"
              itemscope
              itemtype="http://schema.org/Offer"
              class="font-weight-medium"
            >
              <span
                itemprop="price"
                class="font-weight-bold black--text"
                :class="price ? 'fs-2' : 'fs-1-5'"
              >{{ price ? price : "Нет в наличии"}}</span>
              <span itemprop="priceCurrency" class="fs-1-5" v-show="price">RUB</span>
              <span
                class="pl-2"
                v-if="isDiscount"
                style="text-decoration: line-through; font-size:1rem"
              >{{price+'Р'}}</span>
              <v-chip
                v-if="isDiscount"
                color="accent"
                dark
                class="ml-2"
                style="font-size: 1.1rem"
              >-{{discountPriceProcent}}%</v-chip>
              <span v-if="price && product.weight">/ {{product.weight}} кг.</span>
            </div>
            <div class="display-flex align-center wrap" v-if="price">
              <v-btn
                color="#d50000"
                class="ml-0 product-button mt-3"
                @click="handleAdd"
                v-show="!busket"
                style="color:white"
                title="Добавить в корзину"
              >Добавить в корзину</v-btn>
              <client-only>
                <v-sheet
                  v-if="busket"
                  class="product-button align-center display-flex justify-center mt-3 py-1"
                  color="grey lighten-2"
                >
                  <product-quantity :id="product.id" :qty="busket"></product-quantity>
                </v-sheet>
              </client-only>
              <v-btn
                dark
                color="#d50000"
                class="product-button mt-3"
                large
                outlined
                @click="handleOneClickBuy"
                title="Купить в один клик"
              >Купить в один клик</v-btn>
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
            {{product.name}}, представленная на нашем сайте продается по максимально выгодным ценам при условии оптовой покупки. Мы заботимся о вашем здоровье, предлагая качественные продукты отечественного производства.
            <div class="my-3">
              <p>{{product.name}} c быстрой доставкой по Москве и МО. Доставка заказов также осуществляется во все регионы России и в страны СНГ.</p>
              <p>
                Для оформления заказа воспользуйтесь формой на сайте или звоните по телефону
                <a
                  :href="`tel:${phone}`"
                >{{phone}}</a>
              </p>
            </div>
          </div>
          <div v-if="product.content" class="content-wrapper" v-html="$md.render(product.content)"></div>
        </v-flex>
      </v-layout>
      <div v-show="!showProductCard" class="pb-6 pt-6 mx-auto">
        <h2 class="fs-1-5 mb-5 font-weight-bold mb-3">Купить "{{product.name}}" в один клик</h2>
        <contact-form :oneClickBuy="true" :productName="product.name"></contact-form>
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
import ContactForm from "~/components/ContactForm";
import ProductQuantity from "~/components/ProductQuantity";
import ProductCard from "~/components/ProductCard";
import ImageDialog from "~/components/ImageDialog";

export default {
  components: { ContactForm, ProductQuantity, ProductCard, ImageDialog },
  props: {
    product: {
      type: Object
    }
  },
  beforeDestroy() {
    this.closeDialog();
  },
  computed: {
    showImageDialog() {
      return !!this.product.img.formats.small;
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
        ? Math.ceil(
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
        { to: this.$route.path, text: this.product.name }
      ];
    },
    manufacturer() {
      return this.product.manufacturer ? this.product.manufacturer : {};
    },
    busket() {
      const index = this.$store.state.localStorage.basket.findIndex(
        item => item.id === this.product.id
      );
      return index >= 0
        ? this.$store.state.localStorage.basket[index].count
        : false;
    },
    price() {
      return this.isDiscount
        ? this.product.discountPrice
        : this.product.priceNum;
    },
    related() {
      const relatedProducts = this.product.relatedProducts || [];
      const productsRelated = this.product.productsRelated || [];
      return [...relatedProducts, ...productsRelated].filter(
        item => item.priceNum
      );
    }
  },
  watch: {
    showProductCard(val) {
      this.$emit("hanleOneClickBuy", val);
    }
  },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      showProductCard: true,
      dialogImg: false
    };
  },
  methods: {
    handleImageDialog() {
      this.dialogImg = true;
    },
    async closeDialog() {
      await this.$emit("closeProductDialog");
    },
    handleOneClickBuy() {
      this.showProductCard = false;
    },
    async handleAdd() {
      await this.$store.commit("addToBasket", this.product);
    }
  }
};
</script>
<style lang="stylus" scoped >
.mini-imgs-wrapper {
  position: absolute;
  right: 10px;
  top: 0;

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