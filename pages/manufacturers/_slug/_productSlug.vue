<template>
  <v-dialog
    v-if="isChildPage"
    v-model="dialog"
    scrollable
    class="mt-12"
    content-class="dialog-content-wrapper"
    :persistent="false"
    :width="showCard ? 'auto' : '600px'"
  >
    <product-dialog
      :product="product"
      @closeProductDialog="dialog = false"
      @hanleOneClickBuy="(val) => (showCard = val)"
    ></product-dialog>
  </v-dialog>
</template>

<script>
import ProductDialog from "~/components/ProductDialog";
import ContactForm from "~/components/ContactForm";
export default {
  head() {
    if (this.isChildPage) {
      if (!this.product || !this.product.name) return;
      return {
        title: this.product.name,
        meta: [
          {
            hid: "description",
            name: "description",
            content: this.product.description
              ? this.product.description.slice(0, 310)
              : `${this.product.name} оптом. ${this.product.name} от компании Альянс Фуд с доставкой по всей РФ и СНГ по самым выгодным оптовым ценам от производителя.`,
          },
        ],
        link: [
          {
            rel: "canonical",
            href:
              this.product.category && this.product.category.slug
                ? `https://prodaem-kolbasu.ru/catalog/${this.product.category.slug}/${this.product.slug}`
                : "",
          },
        ],
      };
    } else {
      if (!this.manufacturer || !this.manufacturer.name) return;
      return {
        title: `Мясокомбинат ${this.manufacturer.name}. Купить колбасы ${this.manufacturer.name} оптом.`,
        meta: [
          {
            hid: "description",
            name: "description",
            content:
              this.manufacturer.metaDescription ||
              `${this.manufacturer.name} оптом. ${this.manufacturer.name} от компании Альянс Фуд с доставкой по всей РФ и СНГ по самым выгодным оптовым ценам от производителя.`,
          },
        ],
      };
    }
  },
  components: { ContactForm, ProductDialog },
  async asyncData(ctx) {
    let product = {};
    if (!ctx.params || !ctx.params.productSlug) return { product };
    product = await ctx.store.dispatch("fetchProduct", ctx.params.productSlug);

    if (!product) {
      return ctx.error({
        statusCode: 404,
        message: "Продукт не найден",
        type: "manufacturer",
      });
    }
    return { product };
  },
  computed: {
    isChildPage() {
      return this.$route.params && this.$route.params.productSlug;
    },
    manufacturer() {
      return this.isChildPage
        ? this.product.manufacturer
          ? this.product.manufacturer
          : {}
        : this.$store.state.sessionStorage.manufacturer;
    },
  },
  watch: {
    dialog(val) {
      if (val === false) {
        console.log(this.product.category.slug);
        this.$emit("close", this.product._id, this.product.category.slug);
        this.$router.push({ params: { productSlug: null } });
      }
    },
  },
  props: ["products"],
  data() {
    return {
      imageBaseUrl: process.env.imageBaseUrl,
      dialog: true,
      showCard: true,
    };
  },
};
</script>

