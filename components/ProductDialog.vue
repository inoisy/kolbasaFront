<template>
  <v-sheet light class="fill-height position-relative">
    <v-app-bar height="80px" flat>
      <v-btn v-show="!showCard" color="gray" fab @click="showCard=true" class="mr-4" title="Назад">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-breadcrumbs :items="breadcrumbs" class="pl-1 pr-5">
        <template slot="item" slot-scope="props">
          <nuxt-link
            class="text-decoration-none"
            :title="props.item.text"
            :to="props.item.to"
            exact
          >{{ props.item.text }}</nuxt-link>
        </template>
      </v-breadcrumbs>
      <v-btn class="ml-auto" fab @click="dialog=false">
        <v-icon>close</v-icon>
      </v-btn>
    </v-app-bar>

    <v-container grid-list-lg class="position-relative fill-height">
      <v-layout row wrap v-show="showCard" itemscope itemtype="http://schema.org/Product">
        <v-flex xs12 md8 lg8 order-xs2 order-md1 class="display-flex column position-relative pl-4">
          <h1
            itemprop="name"
            class="font-weight-bold mb-5"
            style="line-height: normal;"
            v-text="product && product.name ? product.name : ''"
          ></h1>
          <div class="manufacturer mb-5" v-if="manufacturer">
            Производитель:
            <nuxt-link
              :to="`/manufacturers/${manufacturer.slug}`"
              v-text="manufacturer.name"
              :title="manufacturer.name"
            ></nuxt-link>
          </div>
          <div
            itemprop="description"
            v-if="product && product.description"
            v-html="product.description"
            class="mb-5"
            style="line-height: 1,5"
          ></div>
          <div
            v-if="product && product.content"
            class="mb-5 content-wrapper"
            v-html="$md.render(product.content)"
          ></div>
          <div
            itemprop="offers"
            itemscope
            itemtype="http://schema.org/Offer"
            class="font-weight-medium mb-2"
          >
            <span
              itemprop="price"
              :class="price ? 'fs-2 font-weight-bold black--text' : ''"
            >{{ price ? price : "Цена по запросу"}}</span>
            <span itemprop="priceCurrency" class="fs-1-5" v-show="price">RUB</span>
            <span
              class="pl-2"
              v-if="isDiscount"
              style="text-decoration: line-through; font-size:1rem"
            >{{price+'&#8381;'}}</span>
            <v-chip
              v-if="isDiscount"
              color="accent"
              dark
              class="ml-2"
              style="font-size: 1.1rem"
            >-{{discountPriceProcent}}%</v-chip>
            <span class="mb-5" v-if="product && product.weight">/ {{product.weight}} кг.</span>
          </div>
          <div class="display-flex align-center wrap">
            <v-btn
              dark
              color="#d50000"
              class="product-button ml-0 mr-3 mt-3"
              large
              @click="handleOneClickBuy"
              title="Купить в один клик"
            >Купить в один клик</v-btn>
            <v-btn
              color="#d50000"
              class="ml-0 product-button mt-3"
              large
              @click="addToBasket"
              v-show="!busket"
              style="color:white"
              title="Добавить в корзину"
            >Добавить в корзину</v-btn>
            <v-sheet
              v-if="busket"
              class="product-button align-center display-flex justify-center mt-3 py-1"
              color="grey lighten-2"
            >
              <product-quantity style="max-width: 150px" :product="product" :qty="busket"></product-quantity>
              <!-- <v-btn icon color="primary" @click="removeFromBasket" title="remove">
                <v-icon>remove</v-icon>
              </v-btn>
              <span class="font-weight-bold mx-2">{{busket}}</span>
              <v-btn icon color="primary" @click="addToBasket" title="add to busket">
                <v-icon>add</v-icon>
              </v-btn>-->
            </v-sheet>
          </div>
        </v-flex>
        <v-flex xs12 md4 lg4 order-xs1 order-md2 class="display-flex image-wrapper">
          <div class="mini-imgs-wrapper pa-1">
            <img
              itemprop="image"
              class="manufacturer-img"
              v-if="manufacturer.img"
              :src="imageBaseUrl+manufacturer.img.url"
              :alt="manufacturer.name"
              :title="manufacturer.name"
            />
            <img
              class="halal-img"
              v-if="product && product.isHalal"
              :src="require('~/assets/halal1.png')"
              alt="Халяльная продукция"
              title="Халяльная продукция"
            />
          </div>

          <img
            class="item-img d-block mx-auto mb-auto"
            :src="product && product.img ? imageBaseUrl+product.img.url : require('~/assets/no-image.png')"
            :alt="product && product.name ? product.name:''"
            :title="product && product.name ? product.name:''"
          />
        </v-flex>
      </v-layout>
      <div v-show="!showCard" class="pb-12 pt-8 mx-auto">
        <h2 class="fs-2 mb-5 font-weight-bold">Купить в один клик</h2>
        <contact-form></contact-form>
      </div>
    </v-container>
  </v-sheet>
</template>

<script>
import ContactForm from "~/components/ContactForm";
import ProductQuantity from "~/components/ProductQuantity";

export default {
  components: { ContactForm, ProductQuantity },

  props: ["product", "isManufacturer"],
  computed: {
    discountPriceProcent() {
      return this.product && this.isDiscount
        ? Math.ceil(
            (100 * (this.product.priceNum - this.product.discountPrice)) /
              this.product.priceNum
          )
        : "";
    },
    isDiscount() {
      return this.product
        ? this.product.isDiscount && this.product.discountPrice
        : false;
    },
    breadcrumbs() {
      return [
        {
          to: "/",
          text: "Главная"
        },
        {
          to: "/catalog",
          text: "Каталог"
        },
        {
          to:
            this.product && this.product.category
              ? `/catalog/${this.product.category.slug}`
              : "",
          text:
            this.product && this.product.category
              ? this.product.category.name
              : ""
        }
      ];
    },
    manufacturer() {
      return this.product && this.product.manufacturer
        ? this.product.manufacturer
        : {};
    },
    busket() {
      return this.product &&
        this.$store.state.localStorage.basket[this.product.id]
        ? this.$store.state.localStorage.basket[this.product.id].count
        : null;
    },
    price() {
      return this.product
        ? this.isDiscount
          ? this.product.discountPrice
          : this.product.priceNum
        : "";
    }
  },
  watch: {
    dialog(val) {
      if (val === false) {
        this.isManufacturer
          ? this.$router.push({ params: { productSlug: null } })
          : this.$router.push({ params: { slug: null } });
      }
    }
  },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      dialog: true,
      showCard: true
    };
  },
  methods: {
    handleOneClickBuy() {
      this.showCard = false;
    },
    async addToBasket(event) {
      await this.$store.commit("addToBasket", this.product);
    },
    async removeFromBasket(event) {
      await this.$store.commit("removeFromBasket", this.product);
    }
  }
};
</script>
<style lang="stylus" scoped >
// .noscroll {
// overflow: hidden;
// }
.mini-imgs-wrapper {
  position: absolute;
  right: 10px;
  top: 0;

  .manufacturer-img {
    // position: absolute;
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
  min-width: 200px;
}

.image-wrapper {
  margin-bottom: 1.1rem;
  position: relative;

  .item-img {
    max-height: 300px;
    object-fit: contain;
  }
}

@media (min-width: 960px) {
  .image-wrapper {
    padding-left: 1rem;
    margin-bottom: 0;
  }
}
</style>