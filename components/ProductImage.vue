<template>
  <div>
    <v-img
      itemprop="image"
      class="d-block ma-auto product-img"
      :title="product.name"
      :alt="product.name"
      :src="imgUrl"
      contain
    />
    <div class="product-card-mini-imgs">
      <v-img
        v-if="product.isHalal"
        class="mr-1"
        :src="require('~/assets/images/halal-min.png')"
        title="Халяльная продукция"
        alt="Халяльная продукция"
        width="40px"
        contain
      />
      <v-img
        v-if="product.manufacturer && product.manufacturer.slug"
        class="d-block"
        :title="product.manufacturer.name"
        :alt="product.manufacturer.name"
        :src="
          require(`~/assets/images/manufacturers/${product.manufacturer.slug}.png?resize&size=50`)
        "
        contain
        width="50px"
      />
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
export default {};
</script>

<style>
</style>