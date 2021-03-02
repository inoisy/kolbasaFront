<template>
  <div :class="$style.subcategoriesWrapper">
    <nuxt-link
      v-for="child in subcategories"
      :to="`/catalog/${child.slug}`"
      :class="$style.subcategory"
      :exact-active-class="$style.subcategorySelected"
      :key="`subcategory-${child.id}`"
      :title="child.name"
      v-ripple
    >
      <!-- <span class="d-inline-block text-truncate text-uppercase"> -->
      {{ child.name }}
      <!-- </span> -->
    </nuxt-link>
  </div>
</template>

<script>
export default {
  props: {
    subcategories: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped module>
.subcategoriesWrapper {
  justify-content: center;
  display: flex;
  flex-flow: wrap-reverse;
  max-width: 100%;
  //   position: absolute;
  // bottom: 0;
  // left: 0;
  // right: 0;
  .subcategory {
    $height: 36px !default;
    $fontSize: 14px !default;

    height: $height;
    font-size: $fontSize;
    line-height: $fontSize;
    padding: #{($height - $fontSize) / 2} 16px;

    position: relative;
    min-width: 64px;
    color: $white;
    overflow: hidden;
    text-overflow: ellipsis;
    text-decoration: none;
    text-transform: uppercase;
    transition-duration: 0.28s;
    transition-property: box-shadow, opacity;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    vertical-align: middle;
    white-space: nowrap;
    border-radius: 4px !important;
    align-items: center;
    font-weight: 500;
    max-width: 100%;
    display: inline-block;

    @include sm {
      $height: 38px;
      $fontSize: 15px;

      height: $height;
      font-size: $fontSize;
      line-height: $fontSize;
      padding: #{($height - $fontSize) / 2} 19px;
    }
    @include md {
      $height: 44px;
      $fontSize: 15.5px;

      height: $height;
      font-size: $fontSize;
      line-height: $fontSize;
      padding: #{($height - $fontSize) / 2} 24px;
    }
    @include lg {
      $height: 48px;
      $fontSize: 16px;

      height: $height;
      font-size: $fontSize;
      line-height: $fontSize;
      padding: #{($height - $fontSize) / 2} 24px;
    }

    &:before {
      background-color: currentColor;
      bottom: 0;
      border-radius: inherit;
      content: "";
      left: 0;
      opacity: 0;
      position: absolute;
      pointer-events: none;
      right: 0;
      top: 0;
    }
    &:hover {
      &:before {
        opacity: 0.12;
      }
    }
  }
  .subcategorySelected {
    &:before {
      opacity: 0.12;
    }
  }
  //   .theme--light.v-chip--active:hover::before, .theme--light.v-chip--active::before {
  //     opacity: 0.12;
  // }
}
</style>