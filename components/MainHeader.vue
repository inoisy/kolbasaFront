<template>
  <section
    v-once
    :class="$style.mainSection"
    :style="`background-image: url(${require(`~/assets/images/${img}?webp`)})`"
  >
    <v-container
      :class="$style.mainSectionInner"
      grid-list-lg
      fill-height
      class="py-15"
    >
      <v-row justify="center">
        <v-col cols="12" sm="10" md="10" lg="8" xl="6">
          <h1 :class="$style.header" v-html="header"></h1>
          <div :class="$style.subheader" v-html="subheader"></div>
          <div :class="$style.buttonWrapper">
            <v-btn
              min-width="220px"
              :class="$style.orderBtn"
              color="accent"
              x-large
              dark
              @click="handleOrder"
              >{{ buttontext }}</v-btn
            >

            <!-- <v-btn
              min-width="220px"
              :class="$style.seeAllBtn"
              to="/service"
              color="accent"
              large
              dark
              outlined
            >
              смотреть услуги
            </v-btn> -->
          </div>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>
export default {
  props: {
    header: {
      type: String,
      default: "",
    },
    subheader: {
      type: String,
      default: "",
    },
    buttontext: {
      type: String,
      default: "",
    },
    href: {
      type: String,
      default: "",
    },
    img: {
      type: String,
      default: "",
    },
  },
  // methods: {
  //   handleOrder() {
  //     // console.log("order");
  //     return true;
  //   },
  // },
  methods: {
    handleOrder() {
      this.$store.dispatch("showDialog", {
        // name: this.header,
        isShow: true,
      });
      // return true;
    },
  },
};
</script>

<style lang="scss" scoped module>
.mainSection {
  // height: 500px;
  color: white;
  position: relative;
  background-color: #212121;
  @include background;
  height: calc(100vh - #{$toolbar-mobile-height});
  @include sm {
    height: 45rem;
  }

  &::before {
    content: "";
    position: absolute;
    display: block;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    @include bg(
      //   linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.23)),
      linear-gradient(
          180deg,
          rgba(25, 24, 30, 0.752) 0%,
          rgba(25, 24, 30, 0.32) 31.25%,
          rgba(25, 24, 30, 0) 100%
        )
    );
  }
  .mainSectionInner {
    min-height: inherit;
    position: relative;
  }

  .header {
    font-weight: 800;
    font-size: 2.2rem;
    line-height: 125%;
    text-align: center;
    margin-bottom: 1.5rem;
    @include md {
      font-size: 2.5rem;
    }
    @include lg {
      font-size: 3rem;
    }
  }
  .subheader {
    // font-weight: 400;
    font-size: 1.2rem;
    line-height: 150%;
    text-align: center;
    margin-bottom: 2rem;
    > * {
      margin: 0;
    }
  }
  .buttonWrapper {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .orderBtn {
      margin-bottom: 12px;
      margin-left: 8px;
      margin-right: 8px;
      border-color: $white !important;
      border-style: dashed;
      border-width: 2px;
      @include sm {
        margin-bottom: 0;
      }
    }
    // .orderBtn,
    .seeAllBtn {
      margin-left: 8px;
      margin-right: 8px;
      // margin: 0 12px 12px 12px;
    }
  }
}
</style>