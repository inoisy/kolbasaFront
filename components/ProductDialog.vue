<template>
  <v-card class="position-relative px-4 pb-4 pt-0 fill-height" style="min-height:45vh">
    <div class="close-btn-wrap mt-2 mr-3">
      <v-btn class="close-btn ma-0" color="gray" fab @click="dialog=false">
        <v-icon>close</v-icon>
      </v-btn>
    </div>
    <div v-show="showCard">
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
      <div class="layout row wrap" itemscope itemtype="http://schema.org/Product">
        <v-flex
          xs12
          md8
          lg8
          order-xs2
          order-md1
          class="right-wrapper display-flex column position-relative"
        >
          <h1
            itemprop="name"
            class="display-3 mont font-weight-bold mb-4"
            style="line-height: normal;"
            v-text="product && product.name ? product.name : ''"
          ></h1>
          <div class="manufacturer mb-3" v-if="manufacturer">
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
            class="mb-4"
            style="line-height: 1,5"
          ></div>
          <div
            v-if="product && product.content"
            class="mb-3 table-wrapper"
            v-html="product.content"
          ></div>
          <div
            itemprop="offers"
            itemscope
            itemtype="http://schema.org/Offer"
            class="mont font-weight-medium mb-3"
          >
            <span
              itemprop="price"
              :class="price ? 'display-3 font-weight-bold black--text' : ''"
            >{{ price ? price : "Цена по запросу"}}</span>
            <span itemprop="priceCurrency" class="fs-1-5" v-show="price">RUB</span>
            <span
              class="pl-2"
              v-if="isDiscount"
              style="text-decoration: line-through; font-size:1rem"
            >{{price+'₽'}}</span>
            <v-chip
              v-if="isDiscount"
              color="accent"
              dark
              class="mont ml-2"
              style="font-size: 1.1rem"
            >-{{discountPriceProcent}}%</v-chip>
            <span class="display-1 mb-3" v-if="product && product.weight">/ {{product.weight}} кг.</span>
          </div>
          <div class="display-flex align-center wrap">
            <v-btn
              dark
              color="#d50000"
              class="product-button ml-0 mont"
              large
              @click="handleOneClickBuy"
              title="Купить в один клик"
            >Купить в один клик</v-btn>
            <v-btn
              color="#d50000"
              class="ml-0 mont product-button"
              large
              @click="addToBasket"
              v-show="!busket"
              style="color:white"
              title="Добавить в корзину"
            >Добавить в корзину</v-btn>
            <v-sheet
              class="product-button align-center display-flex justify-center"
              color="grey lighten-2"
            >
              <v-btn
                flat
                icon
                color="primary"
                @click="removeFromBasket"
                v-show="busket"
                title="remove"
              >
                <v-icon>remove</v-icon>
              </v-btn>
              <span class="font-weight-bold">{{busket}}</span>
              <v-btn
                flat
                icon
                color="primary"
                @click="addToBasket"
                v-show="busket"
                title="add to busket"
              >
                <v-icon v-show="busket">add</v-icon>
              </v-btn>
            </v-sheet>
          </div>
        </v-flex>
        <v-flex xs12 md4 lg4 order-xs1 order-md2 class="display-flex image-wrapper">
          <div class="mini-imgs-wrapper">
            <v-tooltip left max-width="300px" v-if="manufacturer">
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
              <div style="font-size:1rem;" class="font-weight-medium mb-2">{{manufacturer.name}}</div>
              <div style="font-size:0.8rem;" class="font-weight-thin">{{manufacturer.description}}</div>
            </v-tooltip>

            <v-tooltip left max-width="300px">
              <template v-slot:activator="{ on }">
                <img
                  class="halal-img"
                  v-if="product && product.isHalal"
                  :src="require('~/assets/halal1.png')"
                  alt="Халяльная продукция"
                  title="Халяльная продукция"
                  v-on="on"
                />
              </template>
              <div style="font-size:1rem;" class="font-weight-medium mb-2">Халяльная продукция</div>
            </v-tooltip>
          </div>

          <img
            class="item-img d-block mx-auto mb-auto"
            :src="product && product.img ? imageBaseUrl+product.img.url : require('~/assets/no-image.png')"
            :alt="product && product.name ? product.name:''"
            :title="product && product.name ? product.name:''"
          />
        </v-flex>
      </div>
    </div>
    <div v-show="!showCard">
      <v-btn color="gray" fab @click="showCard=true" class="ml-0 mb-4" title="arrow_back">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <h2 class="mb-5 mont display-3 font-weight-bold">Купить в один клик</h2>
      <contact-form></contact-form>
    </div>
  </v-card>
</template>
<style lang="stylus" >
.mini-imgs-wrapper {
  position: absolute;
  right: 0;
  top: 20px;

  .manufacturer-img {
    // position: absolute;
    height: 3.5rem;
    width: 3.5rem;
    object-fit: contain;
    // right: 0;
    // bottom: 0;
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

.close-btn-wrap {
  position: sticky;
  right: 0px;
  top: 20px;
  display: flex;
  z-index: 9999;
  margin-bottom: -56px;
  width: 44px;
  margin-left: auto;
}

.table-wrapper table {
  border-radius: 2px;
  border-collapse: collapse;
  border-spacing: 0;
  width: 100%;
  max-width: 100%;

  tr:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }

  // th:first-child {
  // padding: 0 24px;
  // }
  td, th {
    height: 36px;
  }
}

.image-wrapper {
  margin-bottom: 30px;
  position: relative;

  .item-img {
    max-height: 300px;
  }
}

.swiper-button-next, .swiper-button-prev {
  background-image: none !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-button {
  min-width: 200px;
}

@media (max-width: 600px) {
  .product-button {
    width: 100%;
  }
}

@media (min-width: 960px) {
  .image-wrapper {
    padding-left: 1rem;
    margin-bottom: 0;
  }

  .dialog-content-wrapper {
    max-width: 900px !important;
  }
}

@media (min-width: 1264px) {
  .dialog-content-wrapper {
    max-width: 1185px !important;
  }
}
</style>
<script>
import ContactForm from "~/components/ContactForm";

export default {
  components: { ContactForm },

  props: ["product"],
  computed: {
    // product() {
    //   return this.$store.state.sessionStorage.product;
    // },
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
    isProduct() {
      return this.$route.params && this.$route.params.slug;
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
        this.$router.push({ params: { slug: null } });
      }
    }
  },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      //   dialogm1: "",
      dialog: true,
      //   // weight_selected: 0,
      //   activeTab: null,
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