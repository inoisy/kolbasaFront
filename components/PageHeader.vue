<template>
  <div
    class="header-wrapper d-flex"
    :style="load && `background-image: url(/promo_crop.jpg)`"
  >
    <v-container class="header-inner" style="padding: 0 24px" fill-height fluid>
      <div class="top-slot-wrapper">
        <breadcrumbs-sceleton v-if="!load" :boilerplate="!isLoading" />
        <breadcrumbs
          v-else
          :items="breadcrumbs"
          large
          class="breadcrumbs-wrap"
        />
      </div>
      <slot name="header">
        <div class="header-text-wrapper">
          <h1 class="header-text">
            <span
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
            />
          </h1>
        </div>
      </slot>

      <div class="bottom-slot-wrapper" style="width: 100%; min-width: 100%">
        <slot name="bottom" />
      </div>
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
    breadcrumbs: {
      type: Array,
      default: () => [],
    },
    fluid: {
      type: Boolean,
      default: false,
    },
    load: {
      type: Boolean,
      default: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  // data() {
  //   return {
  //     isLoading: true,
  //     load: false,
  //   };
  // },
};
</script>
<style lang="scss" scoped>
.top-slot-wrapper {
  padding-top: 24px;
  padding-bottom: 70px;
  min-height: 100px;
  display: flex;
  align-items: center;
}
.bottom-slot-wrapper {
  min-height: 100px;
  // max-width: 100%;
  // width: 100%;
  display: flex;
  padding-top: 30px;
}
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
  ::v-deep .v-skeleton-loader__heading {
    width: 100% !important;
  }
}
.breadcrumbs-wrap {
  text-align: center;
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
    position: relative;
    padding: 0 24px 0 24px;
    justify-content: space-between;
    height: 100%;
    max-width: 100%;
    width: 100%;
    min-height: 400px;
    // @include md {
    //   min-height: 450px;
    // }
    .header-text-wrapper {
      // @include center;
      // min-width: 73%;
      min-height: 180px;
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
// &.nofluid {
//   height: 400px;
//   justify-content: space-between;
//   .header-text-wrapper {
//     @include center;
//   }
//   .header-text {
//     margin-bottom: 0 !important;
//     margin-top: 0 !important;
//     padding-left: 12px;
//     padding-right: 12px;
//     width: 100%;
//   }
// }
// &.fluid {
// .header-text {
// margin-bottom: 75px;
// margin-top: 75px;
// @include sm {
//   margin-bottom: 75px;
//   // padding-top: 50px;
// }
// @include md {
//   margin-left: 10% !important;
//   margin-right: 10% !important;
// }
// }
// }
</style>