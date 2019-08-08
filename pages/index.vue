<template>
  <div>
    <div v-swiper:mySwiper="swiperOption">
      <div class="swiper-wrapper">
        <div
          class="swiper-slide background-wrapper main-background background d-flex"
          v-for="(item,index) in sliders"
          :key="index"
          :style="`background-image: url(${imageBaseUrl+item.img.url})`"
          style="min-height: calc(100vh - 100px)"
        >
          <v-container fill-height class="main-content py-5">
            <v-layout align-center>
              <v-flex xs12 sm11 md10 lg7 xl6 class="text-xs-left justify-center column white--text">
                <h2 style class="header lumber-rough font-weight-medium mb-4" v-text="item.header" />
                <div class="subheader mb-4 lumber" v-html="item.content" />
                <v-btn
                  v-if="item.buttontext"
                  :to="item.href"
                  class="button ml-0 flex py-2 lumber"
                  large
                  style
                  color="accent"
                  dark
                >{{item.buttontext}}</v-btn>
              </v-flex>
            </v-layout>
          </v-container>
          <v-btn class="btn-scroll" @click="$vuetify.goTo('#content-wrapper')" icon flat large dark>
            <v-icon large>keyboard_arrow_down</v-icon>
          </v-btn>
        </div>
      </div>
      <div class="swiper-button-prev" slot="button-prev">
        <v-btn icon flat dark large>
          <v-icon large>navigate_before</v-icon>
        </v-btn>
      </div>
      <div class="swiper-button-next" slot="button-next">
        <v-btn icon flat dark large>
          <v-icon large>navigate_next</v-icon>
        </v-btn>
      </div>
    </div>

    <div class="background" v-lazy:background-image="require('~/assets/img/bg.jpg')">
      <v-container class="py-5" style="min-height: 100vh" id="content-wrapper">
        <div data-aos="zoom-in">
          <h2 class="text-xs-center primary--text mt-4">Каталог</h2>
        </div>
        <v-layout class="mb-5 pb-4" row wrap align-center justify-center>
          <div
            data-aos="zoom-in"
            class="flex xs6 sm6 md4 lg3"
            v-for="(item,i) in categories"
            :key="i"
          >
            <v-card ripple flat color="transparent" class="category-wrapper px-4 pt-3 pb-4">
              <nuxt-link
                class="td-none"
                style="display:flex; flex-direction: column"
                :to="`/catalog/${item.slug}`"
              >
                <div class="category-img-wrapper">
                  <img
                    class="category-img ma-auto mb-2"
                    v-if="item.img"
                    v-lazy="imageBaseUrl+item.img.url"
                  />
                </div>
                <h3
                  class="category-text text-xs-center lumber font-weight-medium mb-0 primary--text"
                  style
                >{{item.name}}</h3>
              </nuxt-link>
            </v-card>
          </div>
        </v-layout>
        <div data-aos="zoom-in">
          <v-img
            class="mx-auto my-5 xs10 md10 lg9 xl8 flex"
            contain
            :src="require('~/assets/delimiter.svg')"
          ></v-img>
        </div>

        <section class="py-5">
          <h2 data-aos="zoom-in" class="text-xs-center mb-5 primary--text d-block">Производители</h2>
          <div class="d-flex justify-center layout">
            <multi-item-slider :items="manufacturers" />
          </div>
        </section>
        <div data-aos="zoom-in">
          <v-img
            class="mx-auto my-5 xs10 md10 lg9 xl8 flex"
            contain
            :src="require('~/assets/delimiter.svg')"
          ></v-img>
        </div>
        <div class="layout row wrap align-center justify-center pt-5">
          <div class="flex hidden-sm-and-down md4 offset-lg1 lg3 mb-5" data-aos="fade-up">
            <img class="bottom-img pr-4" v-lazy="require('~/assets/img/bottomImage1.png')" />
          </div>
          <v-flex xs10 md8 offset-lg1 lg7 xl6 class="d-flex mb-5">
            <div class="my-auto">
              <h2 class="bottom-header d-block" data-aos="fade-up">Наши партнеры – наша гордость</h2>
              <div class="bottom-text" data-aos="fade-up">
                <!-- <p>«Альянс Фуд» предлагает колбасную продукцию на самых выгодных условиях, чтобы вы могли наслаждаться вкуснейшими блюдами с экономией семейного бюджета. Наша цель – установление продолжительного взаимовыгодного сотрудничества, в рамках которого на вашем столе всегда будут находиться свежие колбасы, полуфабрикаты и разнообразные деликатесы превосходного качества.</p> -->
                <p>Мы сотрудничаем как с крупными предприятиями, так и с частными клиентами. За долгие годы успешной работы нам удалось накопить богатый опыт взаимодействия с поставщиками, благодаря чему мы сохраняем наиболее выгодные условия оформления заказа для своих клиентов.</p>
              </div>
            </div>
          </v-flex>
        </div>
        <div class="layout row wrap align-center justify-center pb-4">
          <div class="xs10 md8 offset-lg1 lg7 xl6 flex d-flex">
            <div class="my-auto">
              <h2
                class="bottom-header d-block mb-3"
                data-aos="fade-up"
              >Почему стоит выбрать именно нас?</h2>
              <div
                class="bottom-text mb-3"
                data-aos="fade-up"
              >Мы заинтересованы в успешном развитии вашего бизнеса и стараемся сделать все возможное с нашей стороны. Сотрудничество с нами будет максимально комфортным за счет:</div>
              <div class="bottom-text layout row wrap" data-aos="fade-up">
                <div
                  class="flex xs12 sm4 px-3 mb-3"
                  v-for="(item,index) in benefits"
                  :key="'benefit'+index"
                >
                  <div class="img-wrapper display-flex mb-3 pt-3">
                    <img v-lazy="item.img" class="mx-auto d-block" alt style="width: 3.5rem" />
                  </div>
                  <div class="display-1 lumber text-xs-center">{{item.text}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex hidden-sm-and-down offset-md0 md4 offset-lg1 lg3" data-aos="fade-up">
            <img class="bottom-img pl-4" v-lazy="require('~/assets/img/bottomImage2.png')" />
            <!-- <img class="bottom-img"> -->
          </div>
        </div>
        <!-- <h2 class="text-xs-center mb-4 primary--text">Производители</h2> -->
      </v-container>
    </div>
  </div>
</template>
<style lang="stylus" scoped>
@import 'swiper/dist/css/swiper.css';

.btn-scroll {
  position: absolute;
  bottom: 5px;
  left: calc(50% - 17px);
}

.swiper-button-next, .swiper-button-prev {
  background-image: none !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.background {
  background-position: 80% center;
  background-size: cover;
  background-repeat: no-repeat;
}

// .main-background {
// min-height: 50rem;
// }
.header {
  font-size: 2.5rem;
  line-height: normal;
}

.subheader {
  font-size: 1.3rem;
  line-height: 1.5;
}

.button {
  font-size: 1.6rem;
  border-color: white !important;
  border-style: dashed;
  border-width: 2px;
}

.category-wrapper {
  .category-text {
    font-size: 1.33rem;
    transition: all 0.2s;
  }

  .category-img-wrapper {
    .category-img {
      filter: grayscale(50%);
      display: block;
      // min-height: 70px;
      height: 75px;
      margin: auto;
      max-width: 100%;
      transition: all 0.2s;
      object-fit: contain;
    }
  }

  &:hover {
    .category-text {
      transition: all 0.3s ease-in-out;
      color: #d50000 !important;
    }

    .category-img-wrapper {
      .category-img {
        transition: all 0.3s ease-in-out;
        filter: none !important;
        transform: scale(1.05);
      }
    }
  }
}

// }
.bottom-header {
  font-size: 3rem;
  color: #4A1F00;

  &:first-letter {
    color: #95282A;
    font-size: 4rem;
    font-family: 'Lumberjack Rough';
  }
}

.bottom-text {
  font-size: 1.6rem;
  // line-height: normal;
  font-family: 'Lumberjack';
  color: #4A1F00;
}

@media (min-width: 600px) {
  .header {
    font-size: 3rem;
    // line-height: normal;
  }

  .subheader {
    font-size: 1.5rem;
    // line-height: 1.3;
  }

  .background {
    background-position: 75% center;
  }

  .category-wrapper {
    .category-img-wrapper {
      .category-img {
        height: 100px;
      }
    }
  }
}

@media (min-width: 960px) {
  .background {
    background-position: 85% center;
  }

  .category-wrapper {
    .category-img-wrapper {
      .category-img {
        height: 150px;
      }
    }
  }
}

@media (min-width: 1264px) {
  .background {
    background-position: center;
  }
}
</style>

<script>
import gql from "graphql-tag";
import Logo from "~/components/Logo.vue";
// import VuetifyLogo from "~/components/VuetifyLogo.vue";
import MultiItemSlider from "~/components/MultiItemSlider.vue";

export default {
  head() {
    return {
      title: "Оптовая продажа колбасы",

      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: "description",
          name: "description",
          content:
            "Колбаса оптом по самым выгодным ценам от компании Альянс Фуд. Самовывоз со склада в Москве. Доставка по РФ"
        }
      ]
    };
  },
  components: {
    // Logo,
    MultiItemSlider
  },
  computed: {
    // sliders() {
    //   return this.$store.state.sessionStorage.generalInfo.promos;
    // },
    categories() {
      return this.$store.state.sessionStorage.generalInfo.categories;
    },
    manufacturers() {
      return this.$store.state.sessionStorage.generalInfo.manufacturers;
    }
  },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      swiperOption: {
        loop: false,
        slidesPerView: "auto",
        preloadImages: false,
        // Enable lazy loading
        lazy: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },
      // page: {
      //   title: "Минимальный заказ от 3000 рублей!",
      //   description: `Capi ta lise on low hanging fruit to identify a ballpark value added activity to beta test.
      //       <br>Override the digital divide with.`
      // },
      benefits: [
        {
          text: "Быстрая доставка по РФ и странам ЕАЭС",
          img: require("@/assets/benefits/shipped.svg")
        },
        {
          text: "Лучшие цены напрямую от производителей",
          img: require("@/assets/benefits/currency.svg")
        },
        {
          text: "Aкции и скидки постоянным заказчикам",
          img: require("@/assets/benefits/1179545.svg")
        }
      ],
      // sliders: [
      //   {
      //     header: "Пс, у нас тут новая вареная колбаска!",
      //     content: `  Capi ta lise on low hanging fruit to identify a ballpark value added activity to beta test.
      //       <br>Override the digital divide with.`,
      //     buttontext: "Хочу колбаску!",
      //     href: "/catalog/varenaya",
      //     image: require("@/assets/img/promo.jpg")
      //   },
      //   {
      //     header: "Скидка деликатесы и копчености 10%!",
      //     content: `Capitalise on low hanging fruit to identify a ballpark value added activity to beta test.
      //       <br>Override the digital divide with.`,
      //     buttontext: "Хочу вкусняшек!",
      //     href: "/catalog/delikatesy-i-kopchenosti",
      //     image: require("@/assets/img/promo3.jpg")
      //   }
      // ],

      promoHeight: "45rem"
    };
  },
  async asyncData(ctx) {
    await ctx.store.dispatch("fetchGeneralInfo");

    let client = ctx.app.apolloProvider.defaultClient;
    const { data: promosData } = await client.query({
      query: gql`
        {
          promos {
            header
            content
            buttontext
            href
            img {
              url
            }
          }
        }
      `
    });
    // console.log("TCL: Data -> categoryData", categoryData);
    // const categories=
    // # const data = await ctx.store.dispatch("fetchMainCategories");
    // await ctx.store.dispatch("fetchGeneralInfo");
    return {
      sliders: promosData.promos
      // categories: categoryData.categories
    };
  }
};
</script>
