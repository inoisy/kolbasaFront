<template>
  <v-dialog
    v-if="isProduct"
    v-model="dialog"
    scrollable
    :width="showCard ? 'auto' : '500px'"
    attach=".v-content__wrap"
    content-class="dialog-content-wrapper"
    :persistent="false"
  >
    <product-dialog :product="product" @closeProductDialog="dialog=false"></product-dialog>
  </v-dialog>
</template>
<script>
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
            : `${this.category.name} оптом. ${this.category.name} от компании Альянс Фуд с доставкой по всей РФ и СНГ по самым выгодным оптовым ценам от производителя.`
        }
      ]
    };
  },
  components: {
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
  watch: {
    dialog(val) {
      if (val === false) {
        this.$router.push({ params: { slug: null } });
      }
    }
  },
  computed: {
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
  },
  props: ["products"],
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      // dialogm1: "",
      dialog: true,
      // weight_selected: 0,
      // activeTab: null,
      showCard: true
    };
  }
};
</script>

