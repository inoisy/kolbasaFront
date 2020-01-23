<template>
  <v-dialog
    v-if="isProduct"
    v-model="dialog"
    scrollable
    :width="showCard ? 'auto' : '500px'"
    style="margin-top: 120px;"
    attach=".v-content__wrap"
    content-class="dialog-content-wrapper"
    persistent
    no-click-animation
  >
    <product-dialog :product="product"></product-dialog>
  </v-dialog>
</template>


<script>
import gql from "graphql-tag";
// import ContactForm from "~/components/ContactForm";
import ProductDialog from "~/components/ProductDialog";
export default {
  head() {
    return {
      title: this.isProduct
        ? this.product && this.product.name
          ? `${this.product.name} оптом`
          : ""
        : this.category && this.category.name
        ? `${this.category.name} оптом`
        : "",
      link: [
        {
          rel: "canonical",
          href: this.isProduct
            ? this.category &&
              this.category.slug &&
              this.product &&
              this.product.slug
              ? `https://prodaem-kolbasu.ru/catalog/${this.category.slug}/${this.product.slug}`
              : ""
            : this.category && this.category.slug
            ? `https://prodaem-kolbasu.ru/catalog/${this.category.slug}`
            : ""
        }
      ],
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: "description",
          name: "description",
          content: this.isProduct
            ? this.product && this.product.description
              ? this.product.description.slice(0, 310)
              : `${this.product.name} оптом. ${this.product.name} от компании Альянс Фуд с доставкой по всей РФ и СНГ по самым выгодным оптовым ценам от производителя.`
            : this.category && this.category.description
            ? this.category.description.slice(0, 310)
            : ""
        }
      ]
    };
  },
  components: {
    // ContactForm,
    ProductDialog
  },
  async asyncData(ctx) {
    let product = {};
    if (ctx.params && ctx.params.slug) {
      await ctx.store.dispatch("fetchGeneralInfo");
      product = await ctx.store.dispatch("fetchProduct", {
        slug: ctx.params.slug
      });
      if (!product) {
        return ctx.error({
          statusCode: 404,
          message: "Продукт не найден"
        });
      }
    }
    return {
      product: product
    };
  },
  computed: {
    // product() {
    //   return this.$store.state.sessionStorage.product;
    // },
    // manufacturer() {
    //   return this.product && this.product.manufacturer
    //     ? this.product.manufacturer
    //     : {};
    // },
    category() {
      return this.isProduct
        ? this.product.category
          ? this.product.category
          : {}
        : this.$store.state.sessionStorage.category;
    },
    isProduct() {
      return this.$route.params && this.$route.params.slug;
    }
    // breadcrumbs() {
    //   return [
    //     {
    //       to: "/",
    //       text: "Главная"
    //     },
    //     {
    //       to: "/catalog",
    //       text: "Каталог"
    //     },
    //     {
    //       to:
    //         this.product && this.product.category
    //           ? `/catalog/${this.product.category.slug}`
    //           : "",
    //       text:
    //         this.product && this.product.category
    //           ? this.product.category.name
    //           : ""
    //     }
    //   ];
    // }
    // busket() {
    //   return this.$store.state.localStorage.basket[this.product.id]
    //     ? this.$store.state.localStorage.basket[this.product.id].count
    //     : null;
    // },
    // price() {
    //   return this.product.isDiscount && this.product.discountPrice
    //     ? this.product.discountPrice
    //     : this.product.priceNum;
    // }
  },
  // watch: {
  //   dialog(val) {
  //     if (val === false) {
  //       this.$router.push({ params: { slug: null } });
  //     }
  //   }
  // },
  // methods: {
  //   handleOneClickBuy() {
  //     this.showCard = false;
  //   },
  //   async addToBasket(event) {
  //     await this.$store.commit("addToBasket", this.product);
  //   },
  //   async removeFromBasket(event) {
  //     await this.$store.commit("removeFromBasket", this.product);
  //   }
  // },
  props: ["products"],
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      dialogm1: "",
      dialog: true,
      // weight_selected: 0,
      activeTab: null,
      showCard: true
    };
  }
};
</script>

