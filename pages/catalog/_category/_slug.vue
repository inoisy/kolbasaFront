<template>
  <v-dialog
    v-if="$route.params.slug && product && Object.keys(product).length >0 "
    v-model="dialog"
    scrollable
    :width="showCard ? 'auto' : '500px'"
  >
    <v-card class="position-relative px-3 pb-4 pt-2 fill-height" style="min-height:45vh">
      <div class="close-btn-wrap">
        <v-btn class="close-btn" outline icon large @click="dialog=false">
          <v-icon>close</v-icon>
        </v-btn>
      </div>
      <div v-show="showCard">
        <v-breadcrumbs :items="breadcrumbs" class="pl-1">
          <template slot="item" slot-scope="props">
            <nuxt-link class="text-decoration-none" :to="props.item.to" exact>{{ props.item.text }}</nuxt-link>
          </template>
        </v-breadcrumbs>
        <v-layout row wrap>
          <v-flex
            xs12
            md7
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
            <v-tabs v-model="activeTab" centered grow>
              <template v-for="(item) in product.productmodifications">
                <v-tab :key="item.id" ripple>{{item.weight}} кг.</v-tab>
                <v-tab-item :key="item.id">
                  <v-card flat>
                    <v-card-text>
                      <div class="mb-2 table-wrapper" v-html="item.description"></div>
                      <div class="fs-2 mont font-weight-medium mb-3" v-show="item.price">
                        <span>от {{item.price}} &#8381;</span>
                        <span class="display-1 mb-3" v-show="item.weight">/ {{item.weight}} кг.</span>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-tab-item>
              </template>
            </v-tabs>
            <div>
              <v-btn
                dark
                color="#d50000"
                class="ml-0 mont"
                large
                @click="handleOneClickBuy"
              >КУпить в один клик</v-btn>
              <v-btn dark color="#d50000" class="ml-0 mont" $large>Добавить в корзину</v-btn>
            </div>
          </v-flex>
          <v-flex xs12 md5 lg4 order-xs1 order-md2 class="display-flex image-wrapper">
            <img
              class="manufacturer-img"
              v-if="product.manufacturer.img"
              :src="imageBaseUrl+product.manufacturer.img.url"
              :alt="product.manufacturer.name"
            />
            <img
              class="item-img d-block mx-auto mb-auto"
              :src="product.img ? imageBaseUrl+product.img.url : require('~/assets/no-image.png')"
              :alt="product.name"
            />
          </v-flex>
        </v-layout>
      </div>
      <div v-show="!showCard">
        <v-btn outline @click="showCard=true" icon large class="ml-0 mb-5">
          <v-icon>arrow_back</v-icon>
        </v-btn>
        <h2 class="mb-5">Купить в один клик</h2>
        <contact-form></contact-form>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import gql from "graphql-tag";
import ContactForm from "~/components/ContactForm";
export default {
  components: { ContactForm },
  async asyncData(ctx) {
    if (ctx.params && ctx.params.slug) {
      // console.log("TCL: Data -> CHILD COMPONENT RENDERER1");
      await ctx.store.dispatch("fetchGeneralInfo");
      const category = await ctx.store.dispatch("fetchCategory", {
        slug: ctx.route.params.category
      });
      const { data: product } = await ctx.$axios.get(
        `/products?slug=` + ctx.params.slug
      );
      const productItem = product[0];
      return {
        product: productItem,
        multiple: productItem.productmodifications.length > 1
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
    handleOneClickBuy() {
      this.showCard = false;
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

<style lang="stylus" >
.mw500 {
  max-width: 500px;
}

.close-btn-wrap {
  position: absolute;
  right: 5px;
  top: 5px;
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

  .manufacturer-img {
    position: absolute;
    width: 8rem;
    right: 0;
    // bottom: 0;
  }

  .item-img {
    max-height: 300px;
  }
}

@media (min-width: 960px) {
  .image-wrapper {
    padding-left: 30px;
    margin-bottom: 0;
  }
}

.swiper-button-next, .swiper-button-prev {
  background-image: none !important;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
