<template>
  <div v-swiper:mySwiper="swiperOption">
    <div class="swiper-wrapper layout">
      <nuxt-link
        data-aos="zoom-in"
        class="manuf-wrap pa-0 swiper-slide flex xs6 sm4 md3 lg2 xl2 d-flex align-center justify-center"
        v-for="(item,index) in items"
        :key="index"
        :to="`/manufacturers/${item.slug}`"
        :title="item.name"
      >
        <img
          :data-src="item.img ? imageBaseUrl+ item.img.url  : require('~/assets/no-image.png')"
          class="manuf-img swiper-lazy ma-auto d-block"
          :alt="item.name"
          :title="item.name"
        />
        <div class="swiper-lazy-preloader"></div>
      </nuxt-link>
    </div>
    <div class="swiper-button-prev" slot="button-prev">
      <v-btn icon large title="navigate_before">
        <v-icon large>navigate_before</v-icon>
      </v-btn>
    </div>
    <div class="swiper-button-next" slot="button-next">
      <v-btn icon large title="navigate_next">
        <v-icon large>navigate_next</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: ["items"],
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      swiperOption: {
        loop: true,
        slidesPerView: "auto",
        preloadImages: false,
        lazy: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      }
    };
  },
  methods: {}
};
</script>

<style lang="stylus" scoped>
@import 'swiper/dist/css/swiper.css';

.swiper-button-next, .swiper-button-prev {
  background-image: none !important;
  display: flex;
  align-items: center;
  justify-content: center;
}

.manuf-img {
  transition: all 0.2s;
  filter: saturate(0.5);
  height: 80px;
  object-fit: contain;
  max-height: 80%;
  max-width: 80%;

  &:hover {
    transform: scale(1.1);
    transition: all 0.3s ease-in-out;
    filter: none;
  }
}

@media (min-width: 600px) {
  .manuf-img {
    height: 120px;
  }
}

@media (min-width: 960px) {
  .manuf-img {
    height: 140px;
  }
}
</style>
