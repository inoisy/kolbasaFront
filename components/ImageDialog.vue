<template>
  <v-dialog v-model="inputVal" eager content-class="dialog-image-wrapper" class="position-relative">
    <div class="fullscreen-img d-flex" style="height: inherit; max-height: inherit;">
      <!-- <pre>{{item.width}}</pre> -->

      <div style="display: flex; height: inherit; max-height: inherit; width: 100%">
        <v-img
          :src="imageBaseUrl+ item.formats.thumbnail.url"
          :srcset="srcSet"
          :alt="item.name"
          :title="item.name"
          height="inherit"
          max-height="inherit"
          width="100%"
          :max-width="item.width"
          class="ma-auto"
          contain
        />
      </div>

      <v-btn
        class="close-btn"
        fab
        @click="inputVal = false"
        style="position:absolute; top:16px; right: 16px; z-index: 10"
      >
        <v-icon>close</v-icon>
      </v-btn>
    </div>
  </v-dialog>
</template>
<style lang="scss" scoped>
.fullscreen-img {
  background-color: white;
  position: relative;
  min-height: 50vh;
}
</style>
<script>
export default {
  data: () => ({
    imageBaseUrl: process.env.imageBaseUrl
  }),
  props: ["value", "item"],
  computed: {
    srcSet() {
      if (!this.item.formats) return;
      return Object.values(this.item.formats)
        .sort(function(a, b) {
          if (a.width > b.width) {
            return 1;
          }
          if (a.width < b.width) {
            return -1;
          }
          return 0;
        })
        .reduce((acc, val) => {
          // console.log("srcSet -> val", val);
          acc = acc + `${this.imageBaseUrl + val.url} ${val.width}w, `;
          return acc;
        }, "");
    },
    inputVal: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      }
    }
  }
};
</script>