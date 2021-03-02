<template>
  <v-card
    ripple
    flat
    color="transparent"
    class="category-wrapper"
    :to="`/catalog/${item.slug}`"
    :title="item.name"
  >
    <div class="category-img-wrapper">
      <v-img
        class="category-img ma-auto mb-2"
        contain
        v-if="item.img"
        :src="imageBaseUrl + item.img.url"
        :alt="item.name"
        :title="item.name"
      />
    </div>
    <div class="heading-font category-text text-center mb-0 primary--text">
      {{ item.name }}
    </div>
  </v-card>
</template>
<style lang="scss" scoped>
.category-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  .category-text {
    font-size: 18px;
    transition: all 0.2s;
    line-height: 1.2;
    text-transform: uppercase;
    font-weight: bold;
  }

  .category-img-wrapper {
    .category-img {
      filter: grayscale(50%);
      display: block;
      height: 75px;
      margin: auto;
      max-width: 100%;
      transition: all 0.2s;
      // transform-origin: center;
      // transform-box: fill-box;
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

@media (min-width: 600px) {
  .category-wrapper {
    .category-img-wrapper {
      .category-img {
        height: 100px;
      }
    }
  }
}

@media (min-width: 960px) {
  .category-wrapper {
    .category-img-wrapper {
      .category-img {
        height: 130px;
      }
    }
  }
}
</style>
<script>
export default {
  props: ["item"],
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
    };
  },
};
</script>