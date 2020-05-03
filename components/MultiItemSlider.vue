<template>
  <v-slide-group show-arrows>
    <v-slide-item v-for="(item,index) in items" :key="`multi-slide${index}`">
      <nuxt-link
        data-aos="zoom-in"
        :to="`/manufacturers/${item.slug}`"
        :title="item.name"
        class="pa-3"
      >
        <v-img
          contain
          :src="item.img ? imageBaseUrl+ item.img.url  : require('~/assets/no-image.png')"
          class="ma-auto d-block manuf-img"
          :alt="item.name"
          :title="item.name"
        />
      </nuxt-link>
    </v-slide-item>
  </v-slide-group>
</template>

<script>
export default {
  props: ["items"],
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl
    };
  }
};
</script>

<style lang="stylus" scoped>
.manuf-img {
  transition: all 0.2s;
  filter: saturate(0.5);
  object-fit: contain;
  width: 80px;
  height: 80px;

  &:hover {
    transform: scale(1.05);
    transition: all 0.3s ease-in-out;
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
</style>
