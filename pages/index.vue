<template>
  <div>
    <LazyHydrate when-idle>
      <section
        v-once
        :class="$style.mainSection"
        style="background-image: url(/promo.jpg)"
      >
        <v-container :class="$style.mainSectionInner" fill-height class="py-15">
          <v-row justify="center" no-gutters>
            <v-col class="pa-3" cols="12" sm="10" md="10" lg="8" xl="6">
              <h1 :class="$style.header" v-html="headerData.header"></h1>
              <div
                :class="$style.subheader"
                v-html="headerData.subheader"
              ></div>
              <div :class="$style.buttonWrapper">
                <v-btn
                  min-width="220px"
                  :class="$style.orderBtn"
                  color="accent"
                  x-large
                  dark
                  nuxt
                  :to="headerData.href"
                >
                  {{ headerData.buttontext }}
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>
    </LazyHydrate>
    <div
      class="background-repeat background-fixed"
      :style="`background-image: linear-gradient(to left, rgb(255 255 255 / 15%), rgb(255 255 255 / 50%)), url(/bg.jpg)`"
    >
      <!-- pos-relativeclass="pos-relative"<v-img
        class="contentSection"
        src="/bg.jpg"
        position="50% 0%"
        gradient="to left top, rgb(255 255 255 / 12%), rgb(255 255 255 / 50%)"
      /> -->
      <!-- <background-image fixed /> -->
      <v-container class="py-15">
        <div class="mb-5 pb-4 align-center d-flex column">
          <v-btn
            color="accent"
            tile
            text
            x-large
            class="ma-auto d-inline-flex"
            to="/catalog"
          >
            <h2 class="primary--text heading-font fs-2">Каталог</h2>
          </v-btn>

          <LazyHydrate v-for="item in categories" :key="item.id" when-visible>
            <v-row
              :class="$style.categoryWrapper"
              class="col-sm-10 col-md-12 justify-center mt-6 pt-3 pb-1 mx-0"
              no-gutters
            >
              <v-col cols="12" class="text-center pa-3">
                <v-btn
                  :class="[$style.overflowButton, $style.categoryButton]"
                  color="accent"
                  tile
                  text
                  large
                  :to="`/catalog/${item.slug}`"
                  class="primary--text heading-font mb-0"
                  :title="item.name"
                >
                  {{ item.name }}
                </v-btn>
              </v-col>
              <v-col
                class="pa-3"
                v-for="child in item.children"
                :key="child.id"
                cols="6"
                md="4"
                lg="3"
              >
                <main-page-card :item="child" class="pa-3" />
              </v-col>
            </v-row>
          </LazyHydrate>
        </div>

        <delimiter class="mx-auto my-10 xs9 xl8 flex" />
        <LazyHydrate when-visible>
          <section class="d-flex column align-center">
            <v-btn
              color="accent"
              tile
              text
              x-large
              class="ma-auto d-inline-flex mb-5"
              to="/manufacturers"
            >
              <h2 :class="$style.mainLink" class="primary--text heading-font">
                Производители
              </h2>
            </v-btn>
            <div class="d-flex my-auto col-sm-10 col-md-12 col-12 pa-0">
              <v-slide-group class="slider-wrapper">
                <v-slide-item
                  v-for="(item, index) in manufacturers"
                  :key="`multi-slide${index}`"
                >
                  <nuxt-link
                    :to="`/manufacturers/${item.slug}`"
                    :title="item.name"
                    class="pa-3"
                  >
                    <v-img
                      contain
                      class="manuf-img"
                      :src="
                        require(`~/assets/images/manufacturers/${item.slug}.png?resize&size=200`)
                      "
                      :alt="item.name"
                      :title="item.name"
                    />
                  </nuxt-link>
                </v-slide-item>
              </v-slide-group>
              <!-- <multi-item-slider :items="manufacturers" /> -->
            </div>
          </section>
        </LazyHydrate>
        <delimiter class="mx-auto my-10 xs9 xl8 flex" />
        <LazyHydrate when-visible>
          <v-row align="center" justify="center" no-gutters class="pt-5">
            <v-col md="4" lg="3" class="hidden-sm-and-down pa-3">
              <v-img
                class="bottom-img pr-4 d-block ma-auto"
                :src="require('~/assets/images/bottomImage1.png')"
                contain
                alt="Колбаса оптом в Москве"
                title="Колбаса оптом"
              />
              <!-- :lazy-src="require('~/assets/images/bottomImage1.png?lqip')" -->
            </v-col>
            <v-col class="pa-3" cols="10" md="8" lg="9">
              <div class="my-auto">
                <h1 class="bottom-header d-block mb-6">
                  Колбаса оптом по самым выгодным для наших парнеров ценам.
                </h1>
                <div class="bottom-text">
                  Одним из ключевых направлений маркетинговой политики компании
                  Альянс Фуд является создание, поддержание и развитие
                  взаимовыгодных партнерских отношений. Почти четверть века мы
                  находимся на ведущих ролях в сфере торговли готовой мясной
                  продукцией.
                </div>
              </div>
            </v-col>
          </v-row>
        </LazyHydrate>
        <LazyHydrate when-visible>
          <v-row align="center" justify="center" class="pb-4" no-gutters>
            <v-col class="pa-3" cols="10" md="8" lg="9">
              <div class="my-auto">
                <h2 class="bottom-header d-block mb-6">
                  Доверяя нам – вы выбираете качество
                </h2>
                <div class="bottom-text mb-6">
                  Для нас не имеет значения статус наших партнеров на рынке или
                  величина их годового товарооборота: со всеми компаньонами мы
                  строим ровные, доверительные отношения.
                </div>
              </div>
            </v-col>
            <v-col md="4" lg="3" class="pa-3 hidden-sm-and-down">
              <v-img
                class="bottom-img pl-4 d-block ma-auto"
                :src="require('~/assets/images/bottomImage2.png')"
                contain
                alt="Колбаса оптом с доставкой"
                title="Колбаса оптом"
              />
            </v-col>
          </v-row>
        </LazyHydrate>
        <delimiter class="mx-auto my-10 xs9 xl8 flex" />
        <LazyHydrate when-visible>
          <section v-once class="flex ma-auto">
            <v-row class="benefits bottom-text" justify="center" no-gutters>
              <v-col class="pa-3" cols="12" sm="10" md="12">
                <h2 class="bottom-header text-center primary--text mb-6">
                  Наши преимущества
                </h2>
                <p class="text-center primary--text mb-6 fs-1-3">
                  После первого шага, сделанного навстречу будущему
                  сотрудничеству, вы убедитесь, насколько выгодны и комфортны
                  для развития вашего бизнеса условия, предоставленные нашей
                  организацией.
                </p>
              </v-col>
              <v-col
                cols="12"
                sm="10"
                md="6"
                lg="4"
                class="d-flex pa-3"
                v-for="(item, index) in benefits"
                :key="'benefit' + index"
              >
                <div class="img-wrapper">
                  <v-img
                    :src="require(`~/assets/images/${item.img}`)"
                    class="pt-1"
                    contain
                    :alt="`Купить колбасу оптом ${item.header}`"
                    :title="item.header"
                    width="3.5rem"
                    height="3.5rem"
                  >
                    <!-- <template v-slot:placeholder>
                    <image-placeholder />
                  </template> -->
                  </v-img>
                </div>
                <div class="pl-3">
                  <div class="heading-font font-weight-bold mb-2">
                    {{ item.header }}
                  </div>
                  <div style="font-size: 1rem">
                    {{ item.text }}
                  </div>
                </div>
              </v-col>
            </v-row>
          </section>
        </LazyHydrate>
        <delimiter class="mx-auto my-10 xs9 xl8 flex" />
        <LazyHydrate when-visible>
          <v-row align="center" justify="center" class="pt-5" no-gutters>
            <v-col cols="12" sm="10" md="8" class="d-flex mb-5 pa-3">
              <div class="my-auto">
                <h2 class="bottom-header mb-6 d-block">
                  Халяльная продукция оптом.
                </h2>
                <div class="">
                  <p>
                    Халяль&nbsp;&ndash; это экологически чистый продукт из мяса,
                    отличающийся своими превосходными вкусовыми свойствами.
                  </p>
                  <p>
                    Продукция&nbsp;халяль&nbsp;отличается чистотой в физическом
                    плане и в духовном. Ее готовят по соответствующим канонам,
                    принятым в исламе. Мясные продукты, изготовленные в
                    соответствии с&nbsp;халяль&nbsp;не имеют вредных добавок и
                    консервантов, способных искусственно увеличивать их
                    долговечность.
                  </p>
                  <p>
                    Халяль&nbsp;&ndash; это вкусно и безопасно! Убедитесь в этом
                    лично, попробовав продукцию, представленную в нашей товарной
                    линейке, которую можно купить оптом по самым доступным
                    ценам.
                  </p>
                  <v-btn
                    :class="[$style.overflowButton, $style.buttonDashed]"
                    to="/catalog/halal"
                    class="button ml-0 flex mt-5"
                    large
                    color="accent"
                    dark
                    title="Халяльная продукция"
                  >
                    Смотреть халаяльную продукцию
                  </v-btn>
                </div>
              </div>
            </v-col>
            <v-col md="4" class="flex hidden-sm-and-down md4 mb-5 pa-3">
              <v-img
                :src="require('~/assets/images/halal.png')"
                class="halal-img pr-4"
                contain
                alt="Халяльная продукция в Москве"
                title="Халяльная продукция"
              />
              <!-- :lazy-src="require('~/assets/images/halal.png?lqip')" -->
            </v-col>
          </v-row>
        </LazyHydrate>
      </v-container>
    </div>
  </div>
</template>
<script>
// import gql from "graphql-tag";
// import MultiItemSlider from "~/components/MultiItemSlider.vue";
// import MainPageCard from "~/components/MainPageCard.vue";
import LazyHydrate from "vue-lazy-hydration";

export default {
  name: "IndexPage",
  components: {
    LazyHydrate,
    // MultiItemSlider,
    // MainPageCard,
  },
  head() {
    return {
      title: "Оптовая продажа колбасы",
      link: [
        {
          rel: "canonical",
          href: "https://prodaem-kolbasu.ru",
        },
      ],
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "Альянс Фуд - колбаса и другие мясные изделия оптом по самым выгодным ценам от компании Альянс Фуд. Самовывоз со склада в Москве. Доставка по РФ",
        },
      ],
    };
  },

  computed: {
    categories() {
      // console.log("computed categories");
      return this.$store.getters.getParentCategories;
    },
    manufacturers() {
      return this.$store.state.sessionStorage.generalInfo.manufacturers;
    },
  },
  data() {
    return {
      imageBaseUrl: this.$config.imageBaseUrl,
      benefits: [
        {
          header: "Доставка",
          text: "Быстрая доставка по РФ и странам ЕАЭС",
          img: "shipped.svg",
        },
        {
          header: "Цены",
          text: "Лучшие цены напрямую от производителей",
          img: "currency.svg",
        },
        {
          header: "Акции",
          text:
            "Разнообразные бонусы в виде скидок и акций нашим постоянным клиентам",
          img: "sale.svg",
        },
        {
          header: "Выбор",
          text:
            "Много видов колбас и мясных изделий и этот перечень постоянно увеличивается",
          img: "product.svg",
        },
        {
          header: "Гарантии",
          text:
            "Многоуровневый контроль качества исключает поставки некачественной продукции",
          img: "shield.svg",
        },
        {
          header: "Сертификаты",
          text:
            "Вся продукция имеет документы, подтверждающие качество и состав изделий",
          img: "certificate.svg",
        },
      ],
      headerData: {
        buttontext: "Хочу скидки!",
        subheader:
          "«Альянс Фуд» предлагает первоклассные продукты по реально выгодной стоимости. Участвуйте в ежемесячных акциях и получайте выгодно свежайшие и вкуснейшие колбасы",
        header:
          "Хотите высокое качество по низкой цене? Успейте купить по акции!",
        href: "/catalog/discount",
        img: {
          url: "promo.jpg",
        },
      },
    };
  },
};
</script>

<style lang="scss" scoped module>
.mainSection {
  color: white;
  // position: relative;
  background-color: #212121;
  @include background;
  height: calc(100vh - #{$toolbar-mobile-height});
  @include sm {
    height: 45rem;
  }

  .mainSectionInner {
    min-height: inherit;
    position: relative;
    height: 100%;
  }

  .header {
    font-weight: 800;
    font-size: 2.2rem;
    line-height: 125%;
    text-align: center;
    margin-bottom: 1.5rem;
    @include md {
      font-size: 2.5rem;
    }
    @include lg {
      font-size: 3rem;
    }
  }
  .subheader {
    // font-weight: 400;
    font-size: 1.2rem;
    line-height: 150%;
    text-align: center;
    margin-bottom: 2rem;
    > * {
      margin: 0;
    }
  }
  .buttonWrapper {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .orderBtn {
      margin-bottom: 12px;
      margin-left: 8px;
      margin-right: 8px;
      border-color: $white !important;
      border-style: dashed;
      border-width: 2px;
      @include sm {
        margin-bottom: 0;
      }
    }
    // .orderBtn,
    .seeAllBtn {
      margin-left: 8px;
      margin-right: 8px;
      // margin: 0 12px 12px 12px;
    }
  }
}
.buttonDashed {
  border-color: white !important;
  border-style: dashed;
  border-width: 2px;
}
.categoryButton {
  font-size: 1.2rem;
  font-weight: bold !important;
}
// .contentSection {
// ::v-deep .v-image__image {
//   background-color: #f0f0f0;
//   background-repeat: repeat;
//   background-size: 100% auto;
//   background-position: 50%;
// }

// background-attachment: fixed;
// background-color: #f0f0f0;
// // background-repeat: repeat;
// background-size: 100%;
// background-image: url(/bg.jpg);
// background-color: #f0f0f0;
// background-repeat: repeat !important;
// background-size: 100% !important;
// .backdrop-blur {
//   background-color: rgba(255, 255, 255, 0.9);
// }

/* if backdrop support: very transparent and blurred */

// }
.categoryWrapper {
  width: 100%;
  border: 1px solid #cfcfcf;
  border-radius: 10px;
  background-color: hsla(0, 0%, 100%, 0.4);

  // border-radius: 5px;
  // position: relative;
  // z-index: 1;
  // box-shadow: 5px 3px 30px #cfcfcf;
  &:before {
    content: "";
    position: absolute;
    background: inherit;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: inset 0 0 2000px rgba(255, 255, 255, 0.5);
    filter: blur(5px);
  }
  // @supports (
  //   (-webkit-backdrop-filter: blur(2em)) or (backdrop-filter: blur(2em))
  // ) {
  //   // .categoryWrapper {
  //   // box-shadow: none;
  //   background-color: rgba(235, 235, 235, 0.4);
  //   -webkit-backdrop-filter: blur(3px);
  //   backdrop-filter: blur(3px);
  //   &:before {
  //     display: none;
  //   }
  //   // }
  // }
}
.overflowButton {
  white-space: normal !important;
  ::v-deep > span {
    width: 100% !important;
    text-align: center;
  }
}
</style>
<style lang="scss" scoped>
.slider-wrapper {
  ::v-deep .v-slide-group__next {
    position: absolute;
    right: -52px;
    bottom: 0;
    top: 0;
  }
  ::v-deep .v-slide-group__prev {
    position: absolute;
    left: -52px;
    bottom: 0;
    top: 0;
  }
}

.manuf-img {
  transform: perspective(1px);
  transition: all 0.2s;
  filter: saturate(0.5);
  // object-fit: contain;
  width: 80px;
  height: 80px;

  &:hover {
    transform: scale(1.05);
    // transition: all 0.3s ease-in-out;
    filter: none;
  }
}

@media (min-width: 576px) {
  .manuf-img {
    width: 100px;
    height: 100px;
  }
}

@media (min-width: 1199px) {
  .manuf-img {
    width: 120px;
    height: 120px;
  }
}

// .contentSection {
//   position: absolute;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   ::v-deep > .v-image__image {
//     background-color: #f0f0f0;
//     background-repeat: repeat;
//     background-size: 100% auto;
//     // background-position: 50%;
//     background-attachment: fixed;
//   }
// }

.bottom-header {
  font-size: 2rem;
  color: #4a1f00;
  // font-family: "Lumberjack";
  line-height: normal;

  &:first-letter {
    color: #95282a;
    font-size: 3rem;
  }
}

.bottom-text {
  font-size: 1.2rem;
  // font-family: "Lumberjack";
  color: #4a1f00;
}

.bottom-img {
  max-width: 100%;
  max-height: 250px;
  object-fit: contain;
}

.halal-img {
  max-width: 150px;
  margin-left: auto;
  display: block;
}

@media (min-width: 960px) {
  .halal-img {
    max-width: 200px;
  }

  .bottom-img {
    max-height: 300px;
  }

  .background {
    background-position: 85% center;
  }
}

@media (min-width: 1264px) {
  .bottom-img {
    max-height: 350px;
  }

  .background {
    background-position: center;
  }
}
</style>

