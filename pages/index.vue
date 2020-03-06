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
          <v-container fill-height class="main-content py-12 ma-auto">
            <v-layout align-center>
              <v-flex xs12 sm11 md10 lg7 xl6 class="text-xs-left justify-center column white--text">
                <h2 style class="header lumber font-weight-medium mb-8" v-text="item.header" />
                <div class="subheader mb-8 lumber" v-html="item.content" />
                <v-btn
                  v-if="item.buttontext"
                  :to="item.href"
                  class="button ml-0 flex py-2 lumber"
                  large
                  style
                  color="accent"
                  dark
                  :title="item.buttontext"
                >{{item.buttontext}}</v-btn>
              </v-flex>
            </v-layout>
          </v-container>
          <v-btn
            class="btn-scroll"
            @click="$vuetify.goTo('#content-wrapper')"
            icon
            large
            dark
            title="arrow_down"
          >
            <v-icon large>keyboard_arrow_down</v-icon>
          </v-btn>
        </div>
      </div>
      <div class="swiper-button-prev" slot="button-prev">
        <v-btn icon dark large title="navigate_before">
          <v-icon large>navigate_before</v-icon>
        </v-btn>
      </div>
      <div class="swiper-button-next" slot="button-next">
        <v-btn icon dark large title="navigate_next">
          <v-icon large>navigate_next</v-icon>
        </v-btn>
      </div>
    </div>

    <div
      class="background"
      v-lazy:background-image="require('~/assets/img/bg.jpg')"
      style="background-color: #f0f0f0; background-repeat: repeat; background-size: 100%;"
    >
      <v-container grid-list-lg class="py-12" style="min-height: 100vh" id="content-wrapper">
        <v-layout row wrap>
          <v-btn
            color="accent"
            tile
            text
            x-large
            class="ma-auto d-inline-flex"
            data-aos="zoom-in"
            to="/catalog"
          >
            <h2 class="primary--text lumber">Каталог</h2>
          </v-btn>
        </v-layout>

        <div class="mb-5 pb-4">
          <template v-for="(item,i) in categories">
            <div
              data-aos="zoom-in"
              v-if="item.children.length===0"
              class="flex xs6 sm6 md4 lg3"
              :key="item.id"
            >
              <main-page-card :item="item"></main-page-card>
            </div>
            <div
              v-else
              :key="item.id"
              class="layout row wrap justify-center mt-4 pt-3 pb-1"
              style="border: 1px solid #8b8b8b; border-radius: 10px;"
            >
              <div class="flex xs12 mb-4 text-center">
                <v-btn
                  color="accent"
                  tile
                  text
                  large
                  :to="`/catalog/${item.slug}`"
                  class="lumber font-weight-medium mb-0 fs-1-5"
                  :title="item.name"
                >
                  <h3 class="primary--text lumber">{{item.name}}</h3>
                </v-btn>
              </div>
              <div
                data-aos="zoom-in"
                v-for="child in item.children"
                class="flex xs6 sm6 md4 lg3"
                :key="child.id"
              >
                <main-page-card :item="child"></main-page-card>
              </div>
            </div>
          </template>
        </div>
        <div data-aos="zoom-in">
          <v-img
            class="mx-auto my-5 xs10 md10 lg9 xl8 flex"
            contain
            :src="require('~/assets/delimiter.svg')"
            title="Разделитель"
            alt="Разделитель"
          ></v-img>
        </div>

        <section class="py-12 d-flex column">
          <v-btn
            color="accent"
            tile
            text
            x-large
            class="ma-auto d-inline-flex mx-auto"
            data-aos="zoom-in"
            to="/manufacturers"
          >
            <h2 class="primary--text lumber">Производители</h2>
          </v-btn>
          <!-- <h2 data-aos="zoom-in" class="text-center mb-5 primary--text d-block"></h2> -->
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
            <img
              class="bottom-img pr-4 d-block ma-auto"
              v-lazy="require('~/assets/img/bottomImage1.png')"
              alt="Колбаса оптом в Москве"
              title="Колбаса оптом"
            />
          </div>
          <v-flex xs10 md8 offset-lg1 lg7 xl6 class="d-flex mb-5">
            <div class="my-auto">
              <h1
                class="bottom-header d-block mb-6"
                data-aos="fade-up"
              >Колбаса оптом по самым выгодным для наших парнеров ценам.</h1>
              <div
                class="bottom-text"
                data-aos="fade-up"
              >Одним из ключевых направлений маркетинговой политики компании Альянс Фуд является создание, поддержание и развитие взаимовыгодных партнерских отношений. Почти четверть века мы находимся на ведущих ролях в сфере торговли готовой мясной продукцией.</div>
            </div>
          </v-flex>
        </div>
        <div class="layout row wrap align-center justify-center pb-4">
          <div class="xs10 md8 offset-lg1 lg7 xl6 flex d-flex">
            <div class="my-auto">
              <h2
                class="bottom-header d-block mb-6"
                data-aos="fade-up"
              >Доверяя нам – вы выбираете качество</h2>
              <div
                class="bottom-text mb-6"
                data-aos="fade-up"
              >Для нас не имеет значения статус наших партнеров на рынке или величина их годового товарооборота: со всеми компаньонами мы строим ровные, доверительные отношения.</div>
            </div>
          </div>
          <div class="flex hidden-sm-and-down offset-md0 md4 offset-lg1 lg3" data-aos="fade-up">
            <img
              class="bottom-img pl-4 d-block ma-auto"
              v-lazy="require('~/assets/img/bottomImage2.png')"
              alt="Колбаса оптом с доставкой"
              title="Колбаса оптом"
            />
          </div>
        </div>
        <div data-aos="zoom-in">
          <v-img
            class="mx-auto my-5 xs10 md10 lg9 xl8 flex"
            contain
            :src="require('~/assets/delimiter.svg')"
          ></v-img>
        </div>

        <section class="flex xs10 ma-auto">
          <h2 class="bottom-header text-center primary--text mb-6">Наши преимущества</h2>
          <p
            class="text-center primary--text lumber mb-6 fs-1-3"
          >После первого шага, сделанного навстречу будущему сотрудничеству, вы убедитесь, насколько выгодны и комфортны для развития вашего бизнеса условия, предоставленные нашей организацией.</p>
          <div class="benefits bottom-text layout row wrap" data-aos="fade-up">
            <div
              class="flex xs12 md6 lg4 display-flex"
              v-for="(item,index) in benefits"
              :key="'benefit'+index"
            >
              <div class="img-wrapper">
                <img
                  v-lazy="item.img"
                  class="d-block pt-1"
                  :alt="`Купить колбасу оптом ${item.header}`"
                  :title="item.header"
                  style="width: 3.5rem;min-width: 3.5rem"
                />
              </div>
              <div class="pl-3">
                <h4 class="lumber font-weight-bold mb-2">{{item.header}}</h4>
                <div class="lumber" style="font-size: 1rem">{{item.text}}</div>
              </div>
            </div>
          </div>
        </section>
        <div data-aos="zoom-in">
          <v-img
            class="mx-auto mt-8 mb-5 xs10 md10 lg9 xl8 flex"
            contain
            :src="require('~/assets/delimiter.svg')"
          ></v-img>
        </div>
        <div class="layout row wrap align-center justify-center pt-5">
          <v-flex xs10 md8 offset-lg1 lg8 class="d-flex mb-5">
            <div class="my-auto">
              <h2 class="bottom-header mb-6 d-block" data-aos="fade-up">Халяльная продукция оптом.</h2>
              <div class="lumber" data-aos="fade-up">
                <p>Халяль&nbsp;&ndash; это экологически чистый продукт из мяса, отличающийся своими превосходными вкусовыми свойствами.</p>
                <p>Продукция&nbsp;халяль&nbsp;отличается чистотой в физическом плане и в духовном. Ее готовят по соответствующим канонам, принятым в исламе. Мясные продукты, изготовленные в соответствии с&nbsp;халяль&nbsp;не имеют вредных добавок и консервантов, способных искусственно увеличивать их долговечность.</p>
                <p>Халяль&nbsp;&ndash; это вкусно и безопасно! Убедитесь в этом лично, попробовав продукцию, представленную в нашей товарной линейке, которую можно купить оптом по самым доступным ценам.</p>
                <v-btn
                  to="/catalog/halal"
                  class="button ml-0 flex lumber mt-3"
                  style
                  color="accent"
                  dark
                  title="Халяльная продукция"
                >Смотреть халаяльную продукцию</v-btn>
              </div>
            </div>
          </v-flex>
          <div
            class="flex hidden-sm-and-down offset-md1 md3 offset-lg1 lg2 mb-5"
            data-aos="fade-up"
          >
            <img
              class="pr-4"
              v-lazy="require('~/assets/halal1.png')"
              alt="Халяльная продукция в Москве"
              title="Халяльная продукция"
            />
          </div>
        </div>
        <!-- <h2 class="text-center mb-10 primary--text">Халяльная продукция оптом</h2>
        <p>Халяль&nbsp;&ndash; это экологически чистый продукт из мяса, отличающийся своими превосходными вкусовыми свойствами.</p>
        <p>Продукция&nbsp;халяль&nbsp;отличается чистотой в физическом плане и в духовном. Ее готовят по соответствующим канонам, принятым в исламе. Мясные продукты, изготовленные в соответствии с&nbsp;халяль&nbsp;не имеют вредных добавок и консервантов, способных искусственно увеличивать их долговечность.</p>
        <p>Халяль&nbsp;&ndash; это вкусно и безопасно! Убедитесь в этом лично, попробовав продукцию, представленную в нашей товарной линейке, которую можно купить оптом по самым доступным ценам.</p>-->
      </v-container>
    </div>
  </div>
</template>
<style lang="stylus" scoped>
@import 'swiper/dist/css/swiper.css';

.bottom-img {
  max-width: 100%;
  max-height: 250px;
  object-fit: contain;
}

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
  background-color: #131313;
}

.header {
  font-size: 2.5rem;
  line-height: normal;
}

.subheader {
  font-size: 1.3rem;
  line-height: 1.5;
}

.button {
  border-color: white !important;
  border-style: dashed;
  border-width: 2px;
}

.bottom-header {
  font-size: 2.3rem;
  color: #4A1F00;
  font-family: 'Lumberjack';
  line-height: normal;

  &:first-letter {
    color: #95282A;
    font-size: 4rem;
  }
}

.bottom-text {
  font-size: 1.45rem;
  font-family: 'Lumberjack';
  color: #4A1F00;
}

@media (min-width: 600px) {
  .header {
    font-size: 3rem;
  }

  .subheader {
    font-size: 1.5rem;
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
import MultiItemSlider from "~/components/MultiItemSlider.vue";
import MainPageCard from "~/components/MainPageCard.vue";

export default {
  head() {
    return {
      title: "Оптовая продажа колбасы",
      link: [
        {
          rel: "canonical",
          href: "https://prodaem-kolbasu.ru"
        }
      ],
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "Альянс Фуд - колбаса и другие мясные изделия оптом по самым выгодным ценам от компании Альянс Фуд. Самовывоз со склада в Москве. Доставка по РФ"
        }
      ]
    };
  },
  components: {
    MultiItemSlider,
    MainPageCard
  },
  computed: {
    categories() {
      return this.$store.getters.getParentCategories;
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
        lazy: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },
      benefits: [
        {
          header: "Доставка",
          text: "Быстрая доставка по РФ и странам ЕАЭС",
          img: require("@/assets/benefits/shipped.svg")
        },
        {
          header: "Цены",
          text: "Лучшие цены напрямую от производителей",
          img: require("@/assets/benefits/currency.svg")
        },
        {
          header: "Акции",
          text:
            "Разнообразные бонусы в виде скидок и акций нашим постоянным клиентам",
          img: require("@/assets/benefits/1179545.svg")
        },
        {
          header: "Выбор",
          text:
            "Много видов колбас и мясных изделий и этот перечень постоянно увеличивается",
          img: require("@/assets/benefits/product.svg")
        },
        {
          header: "Гарантии",
          text:
            "Многоуровневый контроль качества исключает поставки некачественной продукции",
          img: require("@/assets/benefits/shield.svg")
        },
        {
          header: "Сертификаты",
          text:
            "Вся продукция имеет документы, подтверждающие качество и состав изделий",
          img: require("@/assets/benefits/certificate.svg")
        }
      ]
    };
  },
  async asyncData(ctx) {
    // await ctx.store.dispatch("fetchGeneralInfo");

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
    return {
      sliders: promosData.promos
    };
  }
};
</script>
