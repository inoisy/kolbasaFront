<template>
  <div>
    <LazyHydrate when-idle>
      <v-carousel
        :class="$style.mainCarousel"
        cycle
        height="inherit"
        hide-delimiters
        interval="10000"
        show-arrows-on-hover
        dark
      >
        <v-carousel-item
          v-for="(item, i) in sliders"
          :key="`main-slide-${i}`"
          :src="imageBaseUrl + item.img.url"
        >
          <v-container
            fill-height
            grid-list-lg
            class="main-content py-12 ma-auto"
          >
            <v-row align-center>
              <v-col cols="12" sm="10" lg="7" class="text-xs-left white--text">
                <h2
                  :class="$style.mainHeader"
                  class="mb-8"
                  v-text="item.header"
                />
                <div
                  :class="$style.mainSubHeader"
                  class="mb-8"
                  v-html="item.content"
                />
                <v-btn
                  v-if="item.buttontext"
                  :class="$style.buttonDashed"
                  :to="item.href"
                  class="button ml-0 flex py-2"
                  x-large
                  color="accent"
                  dark
                  :title="item.buttontext"
                >
                  {{ item.buttontext }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-carousel-item>
      </v-carousel>
    </LazyHydrate>
    <div
      :style="`background-image: url(${require('~/assets/images/bg.jpg')})`"
      :class="$style.contentSection"
      class="background-with-transparent"
    >
      <v-container grid-list-lg class="py-15">
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
            <!-- <div
              v-if="item.children.length === 0"
              class="flex xs6 sm6 md4 lg3"
              :key="item.id"
            >
              <main-page-card :item="item"></main-page-card>
            </div>  v-else-->
            <v-row
              :class="$style.categoryWrapper"
              class="justify-center mt-6 pt-3 pb-1 mx-0"
            >
              <!-- [, $style.buttonDashed] -->
              <v-col cols="12" class="text-center">
                <v-btn
                  :class="$style.overflowButton"
                  color="accent"
                  tile
                  text
                  large
                  :to="`/catalog/${item.slug}`"
                  class="heading-font font-weight-medium mb-0"
                  :title="item.name"
                >
                  <h3
                    class="primary--text heading-font"
                    style="font-size: 1.4rem"
                  >
                    {{ item.name }}
                  </h3>
                </v-btn>
              </v-col>
              <v-col
                v-for="child in item.children"
                :key="child.id"
                cols="6"
                md="4"
                lg="3"
              >
                <main-page-card :item="child" class="pb-3" />
              </v-col>
            </v-row>
          </LazyHydrate>
        </div>

        <delimiter class="mx-auto my-10 xs10 md10 lg9 xl8 flex" />
        <LazyHydrate when-visible>
          <section class="d-flex column">
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
            <div class="d-flex justify-center layout">
              <multi-item-slider :items="manufacturers" />
            </div>
          </section>
        </LazyHydrate>
        <delimiter class="mx-auto my-10 xs10 md10 lg9 xl8 flex" />
        <LazyHydrate when-visible>
          <div class="layout row wrap align-center justify-center pt-5">
            <div class="flex hidden-sm-and-down md4 lg3 mb-5">
              <v-img
                class="bottom-img pr-4 d-block ma-auto"
                :src="require('~/assets/images/bottomImage1.png')"
                :lazy-src="require('~/assets/images/bottomImage1.png?lqip')"
                contain
                alt="Колбаса оптом в Москве"
                title="Колбаса оптом"
              />
            </div>
            <v-flex xs10 md8 lg9 class="d-flex mb-5">
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
            </v-flex>
          </div>
        </LazyHydrate>
        <LazyHydrate when-visible>
          <div class="layout row wrap align-center justify-center pb-4">
            <div class="xs10 md8 lg9 flex d-flex">
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
            </div>
            <div class="flex hidden-sm-and-down md4 lg3">
              <v-img
                class="bottom-img pl-4 d-block ma-auto"
                :src="require('~/assets/images/bottomImage2.png')"
                :lazy-src="require('~/assets/images/bottomImage2.png?lqip')"
                contain
                alt="Колбаса оптом с доставкой"
                title="Колбаса оптом"
              />
            </div>
          </div>
        </LazyHydrate>
        <delimiter class="mx-auto my-10 xs10 md10 lg9 xl8 flex" />

        <!-- <div>
          <svg-icon name="delimiter" />
        </div> -->
        <LazyHydrate when-visible>
          <section class="flex ma-auto">
            <div class="benefits bottom-text layout row wrap">
              <div class="flex offset-xs1 xs10 md12">
                <h2 class="bottom-header text-center primary--text mb-6">
                  Наши преимущества
                </h2>
                <p class="text-center primary--text mb-6 fs-1-3">
                  После первого шага, сделанного навстречу будущему
                  сотрудничеству, вы убедитесь, насколько выгодны и комфортны
                  для развития вашего бизнеса условия, предоставленные нашей
                  организацией.
                </p>
              </div>
              <div
                class="flex offset-xs1 xs10 offset-md0 md6 lg4 display-flex"
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
              </div>
            </div>
          </section>
        </LazyHydrate>
        <delimiter class="mx-auto my-10 xs10 md10 lg9 xl8 flex" />
        <LazyHydrate when-visible>
          <v-row align="center" justify="center" class="pt-5">
            <v-flex xs10 md8 class="d-flex mb-5">
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
            </v-flex>
            <div class="flex hidden-sm-and-down md4 mb-5">
              <v-img
                :src="require('~/assets/images/halal.png')"
                :lazy-src="require('~/assets/images/halal.png?lqip')"
                class="halal-img pr-4"
                contain
                alt="Халяльная продукция в Москве"
                title="Халяльная продукция"
              />
            </div>
          </v-row>
        </LazyHydrate>
      </v-container>
    </div>
  </div>
</template>
<style lang="scss" scoped module>
.buttonDashed {
  border-color: white !important;
  border-style: dashed;
  border-width: 2px;
}
.mainCarousel {
  background-color: #212121;
  height: 45rem !important;

  @supports (height: max(640px, 100vh)) {
    // @debug var(--toolbar-mobile-height);
    height: max(640px, calc(100vh - #{$toolbar-mobile-height})) !important;
  }
  @include md {
    height: 46.5rem !important;
    @supports (height: max(640px, 100vh)) {
      height: max(640px, calc(100vh - #{$toolbar-desktop-height})) !important;
    }
  }

  .mainHeader {
    font-size: 2.2rem;
    line-height: 125%;
    @include sm {
      font-size: 2.5rem;
    }
  }
  .mainSubHeader {
    font-size: 1.1rem;
    line-height: 140%;
    @include sm {
      font-size: 1.3rem;
    }
  }
}
// $toolbar-mobile-height: 64px;
// $toolbar-desktop-height: 80px;

.contentSection {
  // background-attachment: fixed;
  // background-color: #f0f0f0;
  // // background-repeat: repeat;
  // background-size: 100%;
  // background-image: url(/bg.jpg);
  // background-color: #f0f0f0;
  // background-repeat: repeat !important;
  // background-size: 100% !important;
  .backdrop-blur {
    background-color: rgba(255, 255, 255, 0.9);
  }

  /* if backdrop support: very transparent and blurred */

  .categoryWrapper {
    width: 100%;
    border: 1px solid #cfcfcf;
    border-radius: 10px;
    background-color: hsla(0, 0%, 100%, 0.4);

    // border-radius: 5px;
    // position: relative;
    // z-index: 1;
    // box-shadow: 5px 3px 30px #cfcfcf;
    // &:before {
    //   content: "";
    //   position: absolute;
    //   background: inherit;
    //   z-index: -1;
    //   top: 0;
    //   left: 0;
    //   right: 0;
    //   bottom: 0;
    //   box-shadow: inset 0 0 2000px rgba(255, 255, 255, 0.5);
    //   filter: blur(5px);
    // }
  }
  // @supports (
  //   (-webkit-backdrop-filter: blur(2em)) or (backdrop-filter: blur(2em))
  // ) {
  //   .categoryWrapper {
  //     background-color: rgba(255, 255, 255, 0.5);
  //     -webkit-backdrop-filter: blur(2em);
  //     backdrop-filter: blur(5px);
  //     &:before {
  //       display: none;
  //     }
  //   }
  // }
  .overflowButton {
    white-space: normal !important;
    ::v-deep > span {
      width: 100% !important;
    }
  }
}
</style>
<style lang="scss" scoped>
// .btn-scroll {
// position: absolute;
// bottom: 5px;
// left: calc(50% - 17px);
// }
// .background {
//   background-position: 80% center;
//   background-size: cover;
//   background-repeat: no-repeat;
//   background-color: #131313;
// }

// .header {
//   font-size: 2.5rem;
//   line-height: normal;
// }

// .subheader {
//   font-size: 1.3rem;
//   line-height: 1.5;
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

// @media (min-width: 600px) {
//   // .header {
//   //   font-size: 3rem;
//   // }

//   // .subheader {
//   //   font-size: 1.5rem;
//   // }

//   .background {
//     background-position: 75% center;
//   }
// }

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

<script>
import gql from "graphql-tag";
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
      return this.$store.getters.getParentCategories;
    },
    manufacturers() {
      return this.$store.state.sessionStorage.generalInfo.manufacturers;
    },
  },
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
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
    };
  },
  // mounted() {
  //   console.log(this.$vuetify.icons);
  // },

  async asyncData({ app }) {
    // const client = ctx.;
    const { data: promosData } = await app.apolloProvider.defaultClient.query({
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
      `,
    });
    return {
      sliders: promosData.promos,
    };
  },
};
</script>
