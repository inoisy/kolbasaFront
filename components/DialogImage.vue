<template>
  <v-dialog v-model="inputVal" :scrollable="false" :max-width="img.width + 48">
    <v-card :class="$style.imageDialogInner" light>
      <v-btn :class="$style.closeButton" fab @click="inputVal = false">
        <v-icon>$close</v-icon>
      </v-btn>

      <div class="pos-relative">
        <div :style="`padding-top: ${(img.height / img.width) * 100}%`" />
        <v-img
          :class="$style.image"
          :src="imgUrl"
          :alt="alt"
          :title="alt"
          contain
          @load="$emit('loaded')"
          @error="$emit('loaded')"
        >
          <template v-slot:placeholder>
            <div class="fill-height row align-center justify-center ma-auto">
              <v-progress-circular indeterminate color="accent" />
            </div>
          </template>
        </v-img>
      </div>
    </v-card>
  </v-dialog>
</template>
<style lang="scss" scoped module>
.imageDialogInner {
  --dialog-img-padding: 12px;
  @include md {
    --dialog-img-padding: 24px;
  }
  position: relative;
  max-height: inherit;
  height: inherit;

  padding: var(--dialog-img-padding);
  overflow: hidden;

  .image {
    max-height: calc(
      var(--dialog-max-height) - var(--dialog-img-padding) * 2
    ) !important;
    width: 100%;
    display: block;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0;
    bottom: 0;
    border-radius: 4px;
  }
}

.closeButton {
  position: absolute;
  top: var(--dialog-img-padding);
  right: var(--dialog-img-padding);
  z-index: 10;
  width: var(--fab-button-size) !important;
  height: var(--fab-button-size) !important;
  border: thin solid $black;
}
</style>
<script>
export default {
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
  // methods: {
  //   hanleImageLoad() {
  //     console.log("imageLoad", this.isLoaded);
  //     this.isLoaded = true;
  //     // console.log(
  //     //   "🚀 ~ file: DialogImage.vue ~ line 68 ~ hanleImageLoad ~ this.isLoaded",
  //     //   this.isLoaded
  //     // );
  //     this.$emit("loaded");
  //   },
  // },

  computed: {
    imgUrl() {
      return this.$config.imageBaseUrl + this.img.url;
    },

    inputVal: {
      get() {
        // console.log(
        //   "🚀 ~ file: DialogImage.vue ~ line 89 ~ get ~ this.value && this.isLoaded",
        //   this.value && this.isLoaded
        // );

        return this.value; //&& this.isLoaded;
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