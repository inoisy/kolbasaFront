<template>
  <v-card
    :class="$style.cardWrapper"
    :to="`/${type}/${item.slug}`"
    color="white"
    hover
    ripple
    class="pa-3 d-flex"
    :title="item.name"
  >
    <!--card-wrapper flex xs12 text-xs-left font-weight-medium 
       style="text-decoration: none; border-radius: 10px"
      style="max-width: 220px; height: 150px; object-fit: contain"
class="card-text-inner my-auto"

     <v-layout row wrap class="card-inner">
      <v-flex xs12 md4 lg3 class="img-wrapper display-flex gray py-4" > 
        
        :class="$style.cardImgWrapper"
        -->
    <div class="xs12 md4 lg3 flex" :class="$style.cardImgWrapper">
      <v-img
        :class="$style.cardImg"
        class="d-block ma-auto"
        width="250px"
        max-width="100%"
        contain
        :src="item.img ? imageBaseUrl + item.img.url : '/no-image.png'"
        :alt="item.name"
        :title="item.name"
      />
    </div>

    <!-- </v-flex>  :class="$style.cardTextWrapper"
      <v-flex xs12 md8 lg9 class="card-text-wrapper display-flex"> -->
    <div class="xs12 md8 lg9 flex" :class="$style.cardTextWrapper">
      <h2 class="card-header mb-3">{{ item.name }}</h2>
      <div class="cardText mb-0" v-text="item.description"></div>
    </div>
    <!-- </v-flex>
    </v-layout> -->
  </v-card>
</template>
<style lang="scss" scoped module>
.cardWrapper {
  flex-wrap: wrap;
  border-radius: 10px;
  .cardImgWrapper {
    display: flex;
    margin-bottom: 20px;
    margin-top: 10px;
    max-width: 250px;
    margin-left: auto;
    margin-right: auto;

    min-height: 140px;
    .cardImg {
      height: 140px;
    }
    @include md {
      padding: 15px 45px 15px 25px;
      margin-bottom: 0;
      margin-top: 0;
    }
  }
  .cardTextWrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 5px;
    @include md {
      padding: 15px 45px 15px 25px;
    }
    .cardText {
      max-width: 90%;
    }
  }
}
</style>
<script>
export default {
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
    };
  },
  props: ["item", "type"],
};
</script>

