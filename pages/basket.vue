<template>
  <div>
    <page-header :title="title" :breadrumbs="breadrumbs" />

    <section class="background" v-lazy:background-image="require('~/assets/img/bg.jpg')">
      <v-container class="py-5"></v-container>
    </section>
  </div>
</template>

<script>
import PageHeader from "~/components/PageHeader";

export default {
  data() {
    return {
      title: "Корзина",
      breadrumbs: [
        {
          to: "/",
          text: "Главная"
        },
        {
          to: "/basket",
          text: "Корзина"
        }
      ]
    };
  },
  async asyncData(ctx) {
    // async asyncData(ctx) {
    // const generalData = await ctx.store.dispatch("fetchGeneralInfo");
    // // console.log("TCL: //Data -> generalData", generalData);
    // return {
    //   contacts: generalData.contacts
    // };
  },
  components: { PageHeader },
  computed: {
    // contacts() {
    //   return this.$store.state.generalInfo.contacts;
    // }
  }
};
</script>
<style lang="stylus" scoped>
.link {
  color: rgba(0, 0, 0, 0.87);

  &:hover {
    color: #d50000;

    i {
      color: #d50000 !important;
    }
  }
}

a {
  text-decoration: none;
}
</style>

