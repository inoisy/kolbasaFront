<template>
  <div class="header-wrapper d-flex" :style="`background-image: url(${image})`">
    <!-- :imageSource="imageSource"
    :load="!noLoad" -->
    <!--  :no-load="noLoad" :style="`background-image: url(${image})`" require('~/assets/images/promo_crop.jpg?webp'  ref="wrapper" -->
    <v-container
      class="header-inner"
      :class="fluid ? 'fluid' : 'nofluid'"
      fill-height
      fluid
      grid-list-lg
    >
      <!--:="fluid" {{ bgLoaded }} -->
      <slot name="breadcrumbs">
        <breadcrumbs
          v-if="!noLoad"
          :items="breadrumbs"
          large
          class="breadcrumbs-wrap pt-6 py-3"
        />
      </slot>
      <slot name="header">
        <h1 class="header-text" v-text="title" />
      </slot>

      <!-- <div class="slot-wrapper d-flex"> -->
      <slot name="bottom" />
      <!-- </div> -->
    </v-container>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
    },
    breadrumbs: {
      type: Array,
    },
    fluid: {
      type: Boolean,
      default: false,
    },
    isPadding: {
      type: Boolean,
      default: false,
    },
    imageSource: {
      type: String,
      default: require("~/assets/images/promo_crop.jpg?webp"), // "/promo_crop.webp",
    },
    noLoad: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      image: "",
      bgLoaded: false,
    };
  },
  watch: {
    noLoad(val) {
      // console.log("watch ~ val", val);
      if (!val) {
        this.loadImage();
      }
    },
  },
  mounted() {
    this.loadImage();

    // this.image = this.imageSource;
  },
  methods: {
    loadImage() {
      // console.log("loadImage", !this.noLoad && !this.bgLoaded);
      if (!this.noLoad && !this.bgLoaded) {
        this.image = this.imageSource;
        this.bgLoaded = true;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.breadcrumbs-wrap {
  justify-content: center;
  padding-top: 24px;
  padding-bottom: 12px;
  // position: absolute;
  // top: 0;
  // left: 0;
  // right: 0;
}
.header-inner {
  display: flex;
  align-items: center;
  flex-direction: column;
  flex-wrap: nowrap;
  min-height: 400px;
  // height: 370px;

  // @include md {
  //   height: 385px;
  // }
}

.header-wrapper {
  background-color: #131313;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
}

.header-text {
  font-size: 2.2rem;
  line-height: 1.2;
  margin-top: 12px;
  margin-bottom: 12px;
  color: $white;
  text-align: center;
  // padding-right: 16px;
  //   padding-left: 16px;
  @include sm {
    font-size: 2.7rem;
  }

  @include md {
    font-size: 3rem;
    // max-width: 74%;
  }
  @include lg {
    font-size: 3.5rem;
  }
}
.nofluid {
  height: 400px;
  justify-content: space-between;

  .header-text {
    @include center;
    margin-bottom: 0 !important;
    margin-top: 0 !important;
    padding-top: 10px;
  }
}
.fluid {
  padding: 12px 12px 0 12px;

  // min-height: 400px;
  justify-content: space-between;
  height: 100%;
  max-width: 100%;
  width: 100%;
  .header-text {
    @include md {
      padding-left: 10% !important;
      padding-right: 10% !important;
    }
  }
}

// a {
//   text-decoration: none;
//   font-weight: 500;
//   font-size: 1.1rem;
// }

// a.nuxt-link-active {
//   font-weight: 700;
// }

// .slot-wrapper {
//   // flex-wrap: wrap;
//   justify-content: center;
//   display: flex;
//   flex-flow: wrap-reverse;
//   max-width: 100%;

// }
// position: absolute;
// bottom: 0;
// left: 0;
// right: 0;
// @media (min-width: 960px) {
//   .breadcrumbs-wrap {
//     justify-content: flex-start;
//   }
// }
</style>