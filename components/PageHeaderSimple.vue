<template>
  <div
    class="header-wrapper d-flex"
    :style="`background-image: url(/promo_crop.jpg)`"
  >
    <v-container class="header-inner fluid" fill-height fluid>
      <!-- :class="fluid ? 'fluid' : 'nofluid'" -->

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
        <!-- {{ title }} -->
        <div class="header-text-wrapper">
          <h1 v-text="title" class="header-text">
            <!--    v-if="load"-->
            <!-- <span
              v-if="title"
              v-text="title"
              :style="isLoading && 'visibility: hidden'"
            />
            
            <v-skeleton-loader
              v-if="isLoading"
              :class="
                !!title
                  ? 'absolute-header-sceleton'
                  : 'relative-header-sceleton'
              "
              dark
              type="heading"
              :boilerplate="false"
            /> -->
          </h1>
        </div>
      </slot>
      <!-- d-flex justify-center ma-auto min-height="24px"
            min-width="300px"
            width="100%" -->
      <!-- v-if="title" -->
      <!-- <div class="slot-wrapper d-flex"> -->
      <!-- <div> -->
      <slot name="bottom" />
      <!-- </div> -->
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
    // fluid: {
    //   type: Boolean,
    //   default: false,
    // },
    // load: {
    //   type: Boolean,
    //   default: true,
    // },
    // isLoading: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  data() {
    return {
      isLoading: true,
    };
  },
};
</script>
<style lang="scss" scoped>
.absolute-header-sceleton {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  ::v-deep .v-skeleton-loader__heading {
    // width: 100%;
    // height: 100%;
    margin-bottom: auto !important;
    margin-top: auto;
    height: 85% !important;
    width: 100% !important;
  }
}
.relative-header-sceleton {
  height: 100% !important;
  width: 300px !important;
  display: inline-flex !important;
}
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
    // &.nofluid {
    height: 400px;
    justify-content: space-between;
    .header-text-wrapper {
      @include center;
    }
    .header-text {
      margin-bottom: 0 !important;
      margin-top: 0 !important;
      padding-left: 12px;
      padding-right: 12px;
      width: 100%;
    }
    // }
    // &.fluid {
    //   padding: 12px 12px 0 12px;

    //   // min-height: 400px;
    //   justify-content: space-between;
    //   height: 100%;
    //   max-width: 100%;
    //   width: 100%;
    //   .header-text {
    //     margin-bottom: 75px;
    //     margin-top: 75px;
    //     // @include sm {
    //     //   margin-bottom: 75px;
    //     //   // padding-top: 50px;
    //     // }
    //     // @include md {
    //     //   margin-left: 10% !important;
    //     //   margin-right: 10% !important;
    //     // }
    //   }
    // }
    .header-text-wrapper {
      // @include center;
      // min-width: 73%;
      width: 100%;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      .header-text {
        font-size: 2.2rem;
        line-height: 1.2;
        color: $white;
        text-align: center;
        position: relative;
        display: inline;
        //       align-items: center;
        // display: inline-flex;
        // justify-content: center;
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
}
</style>