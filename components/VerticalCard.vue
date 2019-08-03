<template>
  <v-card
    :to="`/${type}/${item.slug}`"
    hover
    ripple
    class="card-wrapper flex xs12 text-xs-left mont font-weight-medium pa-3"
    style="text-decoration: none; border-radius: 10px"
  >
    <v-layout class="card-inner">
      <div class="img-wrapper display-flex gray pb-3" style=" min-height:13rem; min-width:300px">
        <img
          class="d-block ma-auto"
          style="max-width:250px; max-height:250px; min-height:150px"
          v-lazy="item.img ? imageBaseUrl+item.img.url : require('~/assets/no-image.png')"
          :alt="item.name"
        />
      </div>
      <v-flex class="card-text-wrapper display-flex">
        <div class="card-text-inner my-auto">
          <h2 class="card-header display-2 mont mb-3">{{item.name}}</h2>
          <div class="card-text mb-0 mont" v-text="item.description"></div>
        </div>
      </v-flex>
    </v-layout>
  </v-card>
</template>
<style lang="stylus">
.card-wrapper {
  .card-inner {
    flex-direction: column;
  }

  .img-wrapper {
    img {
      padding: 0 20px;
      object-fit: contain;
      // max-width: 90%;
    }
  }

  .card-header {
    font-weight: 600 !important;
  }

  .card-text {
    font-size: 1.1rem;
    font-weight: 400 !important;
  }
}

@media (min-width: 960px) {
  .card-wrapper {
    .card-inner {
      flex-direction: row;
    }

    .img-wrapper {
      // padding-right: 20px !important;
      img {
      }
    }

    .card-header {
      // font-weight: 600 !important;
    }

    .card-text-inner {
      padding-top: 1rem;
      padding-bottom: 1rem;
      padding-right: 2.2rem;
    }
  }
}
</style>

<script>
export default {
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl
    };
  },
  props: ["item", "type"]
};
</script>

