<template>
  <v-dialog v-model="inputVal" :scrollable="false" :max-width="img.width">
    <!--  + 100 content-class="dialog-content-wrapper" content-class="dialog-content-wrapper" -->
    <v-card :class="$style.imageDialogInner" light>
      <v-btn :class="$style.closeButton" fab @click="inputVal = false">
        <v-icon>$close</v-icon>
      </v-btn>
      <v-img
        :class="$style.image"
        :src="imgUrl"
        :alt="alt"
        :title="alt"
        contain
      >
        <!--  :srcset="srcSet"<template v-slot:placeholder>
          <image-placeholder />
        </template> -->
      </v-img>
    </v-card>
    <!-- <div style="position: absolute; top: 16px; right: 16px; z-index: 10"
      class="fullscreen-img d-flex"
      style="height: inherit; max-height: inherit"
    >
      <div
        style="display: flex; height: inherit; max-height: inherit; width: 100%"
      >
        <v-img
          :src="imageBaseUrl + imgUrl"
          :srcset="srcSet"
          :alt="item.name"
          :title="item.name"
          :max-width="item.width"
          height="inherit"
          max-height="inherit"
          width="100%"
          class="ma-auto"
          contain
        >
          <template v-slot:placeholder>
            <image-placeholder />
          </template>
        </v-img>
      </div> -->

    <!-- </div> -->
  </v-dialog>
</template>
<style lang="scss" scoped module>
.imageDialogInner {
  position: relative;
  max-height: inherit;
  height: inherit;
  .image {
    max-height: var(--dialog-max-height) !important;
  }
  // max-height: calc(90vh - 64px);
  // max-height: calc(100% - #{$toolbar-desktop-height + $dialog-desktop-margin*2}) !important;
  //   max-height: calc(
  //     100vh - #{$toolbar-mobile-height + $dialog-mobile-margin * 2}
  //   ) !important;

  //   @include md {
  //     // margin: $toolbar-desktop-height + $dialog-desktop-margin $dialog-desktop-margin $dialog-desktop-margin !important;
  //     max-height: calc(
  //       100vh - #{$toolbar-desktop-height + $dialog-desktop-margin * 2}
  //     ) !important;
  //   }
  // }
}
// .closeButton {

// }
// .closeButton {

// }
.closeButton {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  width: var(--fab-button-size) !important;
  height: var(--fab-button-size) !important;
  // @include closeButton();

  // width: 44px !important;
  // height: 44px !important;
  // @include md {
  //   width: 48px !important;
  //   height: 48px !important;
  // }
}
// .fullscreen-img {
//   background-color: white;
//   position: relative;
//   // min-height: 50vh;
// }
</style>
<script>
export default {
  // data: () => ({
  //   imageBaseUrl: process.env.imageBaseUrl,
  // }),
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    img: {
      type: Object,
      default: () => {},
    },
    alt: {
      type: String,
      default: "",
    },
  },
  computed: {
    imgUrl() {
      // if (!this.img) {
      //   return "/no-image.png";
      // }
      // if (!this.img.formats) {
      return this.$config.imageBaseUrl + this.img.url;
      // }
      // if (this.img.formats.small) {
      //   return this.imageBaseUrl + this.img.formats.small.url;
      // }

      // return this.imageBaseUrl + this.img.formats.thumbnail.url;
    },
    // srcSet() {
    //   if (!this.item.formats) return;
    //   return Object.values(this.item.formats)
    //     .sort(function (a, b) {
    //       if (a.width > b.width) {
    //         return 1;
    //       }
    //       if (a.width < b.width) {
    //         return -1;
    //       }
    //       return 0;
    //     })
    //     .reduce((acc, val) => {
    //       // console.log("srcSet -> val", val);
    //       acc = acc + `${this.imageBaseUrl + val.url} ${val.width}w, `;
    //       return acc;
    //     }, "");
    // },
    inputVal: {
      get() {
        return this.value;
      },
      set(val) {
        if (!val) {
          this.$emit("close");
        }
      },
    },
  },
};
</script>