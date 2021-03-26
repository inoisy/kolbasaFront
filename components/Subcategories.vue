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
    --height: 36px;
    --font-size: 12px;
    --padding: 16px;
    @include sm {
      --height: 38px;
      --font-size: 14px;
      --padding: 19px;
    }
    @include md {
      --height: 44px;
      --font-size: 15px;
      --padding: 24px;
    }
    @include lg {
      --height: 48px;
      --font-size: 16px;
    }

    height: var(--height);
    font-size: var(--font-size);
    line-height: 1;
    padding: calc((var(--height) - var(--font-size)) / 2) var(--padding);

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
    white-space: nowrap;
    border-radius: 4px !important;
    font-weight: 500;
    max-width: 100%;
    display: inline-block;

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