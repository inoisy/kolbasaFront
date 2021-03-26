<template>
  <div
    class="header-wrapper d-flex"
    :style="load && `background-image: url(/promo_crop.jpg)`"
  >
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
          v-if="breadrumbs.length"
          :items="breadrumbs"
          large
          class="breadcrumbs-wrap pt-6 py-3"
        />
      </slot>
      <slot name="header">
        <h1 v-if="title" class="header-text" v-text="title" />
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
      default: "",
    },
    breadrumbs: {
      type: Array,
      default: () => [],
    },
    fluid: {
      type: Boolean,
      default: false,
    },
    // isPadding: {
    //   type: Boolean,
    //   default: false,
    // },
    // imageSource: {
    //   type: String,
    //   default: require("~/assets/images/promo_crop.jpg"),
    // },
    load: {
      type: Boolean,
      default: true,
    },
  },
  // data() {
  //   return {
  //     image: "",
  //     bgLoaded: false,
  //   };
  // },
  // watch: {
  //   noLoad(val) {
  //     // console.log("watch ~ val", val);
  //     if (!val) {
  //       this.loadImage();
  //     }
  //   },
  // },
  // mounted() {
  //   this.loadImage();

  //   // this.image = this.imageSource;
  // },
  // methods: {
  //   loadImage() {
  //     // console.log("loadImage", !this.noLoad && !this.bgLoaded);
  //     if (!this.noLoad && !this.bgLoaded) {
  //       this.image = this.imageSource;
  //       this.bgLoaded = true;
  //     }
  //   },
  // },
};
</script>
<style lang="scss" scoped>
.breadcrumbs-wrap {
  // justify-content: center;
  padding-top: 24px;
  padding-bottom: 12px;
  text-align: center;
  // position: absolute;
  // top: 0;
  // left: 0;
  // right: 0;
}

.header-wrapper {
  background-color: #131313;

  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  background-position: 70% center;
  @include md {
    background-position: center;
  }
  .header-inner {
    display: flex;
    align-items: center;
    flex-direction: column;
    flex-wrap: nowrap;
    min-height: 400px;
    position: relative;
    padding-left: 24px !important;
    padding-right: 24px !important;
    &.nofluid {
      height: 400px;
      justify-content: space-between;

      .header-text {
        padding-bottom: 25px;
        padding-top: 25px;
        @include center;
        margin-bottom: 0 !important;
        margin-top: 0 !important;
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 12px;
        padding-right: 12px;
        width: 100%;
      }
    }
    &.fluid {
      padding: 12px 12px 0 12px;

      // min-height: 400px;
      justify-content: space-between;
      height: 100%;
      max-width: 100%;
      width: 100%;
      .header-text {
        padding-bottom: 60px;
        padding-top: 75px;
        @include sm {
          padding-bottom: 75px;
          // padding-top: 50px;
        }
        @include md {
          padding-left: 10% !important;
          padding-right: 10% !important;
        }
      }
    }

    .header-text {
      font-size: 2.2rem;
      line-height: 1.2;
      color: $white;
      text-align: center;
      @include sm {
        font-size: 2.7rem;
      }

      @include md {
        font-size: 3rem;
      }
      @include lg {
        font-size: 3.5rem;
      }
    }
  }
}
</style>