<template>
  <v-dialog
    v-if="$route.params && $route.params.slug && product && Object.keys(product).length >0 "
    v-model="dialog"
    scrollable
    :width="showCard ? 'auto' : '500px'"
    style="margin-top: 120px;"
    attach=".v-content__wrap"
    content-class="dialog-content-wrapper"
    persistent
    no-click-animation
    @click:outside="handleClickOutside"
  >
    <!-- <portal-target name="toolbar" ref="portalTarget"></portal-target> -->

    <v-card class="position-relative px-4 pb-4 pt-0 fill-height" style="min-height:45vh">
      <div class="close-btn-wrap mt-2 mr-3">
        <v-btn class="close-btn ma-0" color="gray" fab @click="dialog=false">
          <v-icon>close</v-icon>
        </v-btn>
      </div>
      <div v-show="showCard">
        <v-breadcrumbs :items="breadcrumbs" class="pl-1 pr-5">
          <template slot="item" slot-scope="props">
            <nuxt-link class="text-decoration-none" :to="props.item.to" exact>{{ props.item.text }}</nuxt-link>
          </template>
        </v-breadcrumbs>
        <v-layout row wrap>
          <v-flex
            xs12
            md8
            lg8
            order-xs2
            order-md1
            class="right-wrapper display-flex column position-relative"
          >
            <h1
              class="display-3 mont font-weight-bold mb-4"
              style="line-height: normal;"
            >{{product.name}}</h1>
            <div class="manufacturer mb-3">
              Производитель:
              <nuxt-link
                :to="`/manufacturers/${product.manufacturer.slug}`"
              >{{product.manufacturer.name}}</nuxt-link>
            </div>
            <div
              v-show="product.description"
              v-html="product.description"
              class="mb-4"
              style="line-height: 1,5"
            ></div>
            <div class="mb-3 table-wrapper" v-html="product.content"></div>
            <div class="fs-2 mont font-weight-medium mb-3" v-show="product.priceNum">
              <!-- <span>{{product.priceNum}} &#8381;</span> -->
              <span
                v-show="product.priceNum"
                :class="'display-3 font-weight-bold black--text'"
              >{{product.isDiscount ? product.discountPrice : product.priceNum}}&#8381;</span>
              <span v-show="!product.priceNum">Цена по запросу</span>
              <!-- {{product.priceNum ? product.priceNum +'₽' : ''}}</v-subheader> -->
              <span
                class="pl-2"
                v-if="product.isDiscount"
                style="text-decoration: line-through; font-size:1rem"
              >{{product.priceNum+'₽'}}</span>
              <v-chip
                v-if="product.isDiscount"
                color="accent"
                dark
                class="mont ml-2"
                style="font-size: 1.1rem"
              >-{{Math.ceil(100*(product.priceNum-product.discountPrice)/product.priceNum) }}%</v-chip>
              <span class="display-1 mb-3" v-show="product.weight">/ {{product.weight}} кг.</span>
            </div>
            <div class="display-flex align-center wrap">
              <v-btn
                dark
                color="#d50000"
                class="product-button ml-0 mont"
                large
                @click="handleOneClickBuy"
              >КУпить в один клик</v-btn>
              <v-btn
                color="#d50000"
                class="ml-0 mont product-button"
                large
                @click="addToBasket"
                v-show="!busket"
                style="color:white"
              >Добавить в корзину</v-btn>
              <v-sheet
                class="product-button align-center display-flex justify-center"
                color="grey lighten-2"
              >
                <v-btn flat icon color="primary" @click="removeFromBasket" v-show="busket">
                  <v-icon>remove</v-icon>
                </v-btn>
                <span class="font-weight-bold">{{busket}}</span>
                <v-btn flat icon color="primary" @click="addToBasket" v-show="busket">
                  <!-- <v-icon >add_shopping_cart</v-icon> -->
                  <v-icon v-show="busket">add</v-icon>
                </v-btn>
              </v-sheet>
            </div>
          </v-flex>
          <v-flex xs12 md4 lg4 order-xs1 order-md2 class="display-flex image-wrapper">
            <div class="mini-imgs-wrapper">
              <v-tooltip left max-width="300px" v-if="product.manufacturer">
                <template v-slot:activator="{ on }">
                  <img
                    class="manufacturer-img"
                    v-if="product.manufacturer.img"
                    :src="imageBaseUrl+product.manufacturer.img.url"
                    :alt="product.manufacturer.name"
                    v-on="on"
                  />
                </template>
                <div
                  style="font-size:1rem;"
                  class="font-weight-medium mb-2"
                >{{product.manufacturer.name}}</div>
                <div
                  style="font-size:0.8rem;"
                  class="font-weight-thin"
                >{{product.manufacturer.description}}</div>
              </v-tooltip>

              <v-tooltip left max-width="300px">
                <template v-slot:activator="{ on }">
                  <img
                    class="halal-img"
                    v-if="product.isHalal"
                    :src="require('~/assets/halal1.png')"
                    v-on="on"
                  />
                </template>
                <div style="font-size:1rem;" class="font-weight-medium mb-2">Халяльная продукция</div>
                <div
                  style="font-size:0.8rem;"
                  class="font-weight-thin"
                >Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet perferendis expedita, minima harum impedit tempore beatae velit error. Nesciunt omnis porro minima earum at inventore dolore esse ipsum doloremque voluptate!</div>
              </v-tooltip>
            </div>

            <img
              class="item-img d-block mx-auto mb-auto"
              :src="product.img ? imageBaseUrl+product.img.url : require('~/assets/no-image.png')"
              :alt="product.name"
            />
          </v-flex>
        </v-layout>
      </div>
      <div v-show="!showCard">
        <v-btn color="gray" fab @click="showCard=true" class="ml-0 mb-4">
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <h2 class="mb-5 mont display-3 font-weight-bold">Купить в один клик</h2>
        <contact-form></contact-form>
      </div>
    </v-card>
  </v-dialog>
</template>
<style lang="stylus" >
// .v-dialog:not(.v-dialog--fullscreen) {

// }
// .dialog-content-wrapper {
// margin-top: 100px;
// max-height: calc(90% - 100px) !important;
// }
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
  // position: absolute;
  // width: 6rem;
  // right: 0;
  // top: 4rem;
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
import gql from "graphql-tag";
// import ProductZoomer from "vue-product-zoomer";
import ContactForm from "~/components/ContactForm";
export default {
  head() {
    return {
      title:
        this.$route.params && this.$route.params.slug
          ? this.product && this.product.name
            ? this.product.name
            : ""
          : this.$parent.category && this.$parent.category.name
          ? this.$parent.category.name
          : "",
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: "description",
          name: "description",
          content:
            this.$route.params && this.$route.params.slug
              ? this.product && this.product.description
                ? this.product.description
                : ""
              : this.$parent.category && this.$parent.category.description
              ? this.$parent.category.description
              : ""
        }
      ]
    };
  },
  components: { ContactForm },
  async asyncData(ctx) {
    if (ctx.params && ctx.params.slug) {
      // console.log("TCL: Data -> CHILD COMPONENT RENDERER1");
      await ctx.store.dispatch("fetchGeneralInfo");
      const category = await ctx.store.dispatch("fetchCategory", {
        slug: ctx.params.category
      });
      const product = await ctx.store.dispatch("fetchProduct", {
        slug: ctx.params.slug
      });
      console.log("TCL: Data -> product", product);

      // const { data: product } = await ctx.$axios.get(
      //   `/products?slug=` + ctx.params.slug
      // );
      // const productItem = product[0];
      return {
        product: product
        // multiple: product.productmodifications.length > 1
      };
    }
  },
  computed: {
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
          to: `/catalog/${this.$store.state.sessionStorage.category.slug}`,
          text: this.$store.state.sessionStorage.category.name
        }
      ];
    },
    busket() {
      return this.$store.state.localStorage.basket[this.product.id]
        ? this.$store.state.localStorage.basket[this.product.id].count
        : null;
    }
  },
  watch: {
    dialog(val) {
      if (val === false) {
        this.$router.push({ params: { slug: null } });
      }
    }
    // weight_selected(val) {
    //   console.log("TCL: weight_selected -> val", val, this.mySwiper);
    //   this.mySwiper.slideTo(val, 1000, false);
    //   // console.log(val)
    // }
  },
  methods: {
    handleClickOutside() {
      console.log(
        "TCL: handleClickOutside -> handleClickOutside",
        this.$refs.portalTarget
      );

      // const capture = this.$refs.productCardActions.contains(event.target);
    },
    handleOneClickBuy() {
      this.showCard = false;
    },
    async addToBasket(event) {
      await this.$store.commit("addToBasket", this.product);
    },
    async removeFromBasket(event) {
      await this.$store.commit("removeFromBasket", this.product);
    }
  },
  props: ["products"],
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      dialogm1: "",
      dialog: true,
      // weight_selected: 0,
      activeTab: null,
      showCard: true
    };
  }
};
</script>

