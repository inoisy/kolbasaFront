<template>
  <div v-swiper:mySwiper="swiperOption">
    <div class="swiper-wrapper layout">
      <div
        data-aos="zoom-in"
        class="swiper-slide flex xs6 md4 lg3 xl2 d-flex align-center justify-center"
        v-for="(item,index) in items"
        :key="index"
      >
        <nuxt-link :to="`/manufacturers/${item.slug}`" class="align-center justify-center px-3">
          <img
            :src="item.img ? imageBaseUrl+ item.img.url  : require('~/assets/no-image.png')"
            class="ma-auto d-block manuf-img"
            style="max-width: 90%"
          />
        </nuxt-link>
      </div>
    </div>
    <div class="swiper-button-prev" slot="button-prev">
      <v-btn icon flat large>
        <v-icon large>navigate_before</v-icon>
      </v-btn>
    </div>
    <div class="swiper-button-next" slot="button-next">
      <v-btn icon flat large>
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
        // Enable lazy loading
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

<style lang="stylus">
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

  &:hover {
    transform: scale(1.1);
    transition: all 0.3s ease-in-out;
    filter: none;
  }
}
</style>
