<template>
  <v-dialog
    v-if="isProduct"
    v-model="dialog"
    scrollable
    :width="showCard ? 'auto' : '600px'"
    attach=".v-content__wrap"
    content-class="dialog-content-wrapper"
    :persistent="false"
  >
    <product-dialog
      :product="product"
      @closeProductDialog="dialog=false"
      @hanleOneClickBuy="(val)=>showCard=val"
    ></product-dialog>
  </v-dialog>
</template>
<script>
import ProductDialog from "~/components/ProductDialog";
export default {
  head() {
    let head;
    if (this.isProduct) {
      if (!this.product || !this.product.name) return;
      head = {
        title: `${this.product.name} оптом`,
        link: [
          {
            rel: "canonical",
            href:
              this.category && this.category.slug
                ? `https://prodaem-kolbasu.ru/catalog/${this.category.slug}/${this.product.slug}`
                : ""
          }
        ],
        meta: [
          // hid is used as unique identifier. Do not use `vmid` for it as it will not work
          {
            hid: "description",
            name: "description",
            content: this.product.description
              ? this.product.description.slice(0, 310)
              : `${this.product.name} оптом. ${this.product.name} от компании Альянс Фуд с доставкой по всей РФ и СНГ по самым выгодным оптовым ценам от производителя.`
          }
        ]
      };
      // console.log("head -> head", head);
      return head;
    } else {
      if (!this.category || !this.category.name) return;
      head = {
        title: `${this.category.name} оптом`,
        link: [
          {
            rel: "canonical",
            href: `https://prodaem-kolbasu.ru/catalog/${this.category.slug}`
          }
        ],
        meta: [
          {
            hid: "description",
            name: "description",
            content: this.category.description
              ? this.category.description.slice(0, 310)
              : `${this.category.name} оптом. ${this.category.name} от компании Альянс Фуд с доставкой по всей РФ и СНГ по самым выгодным оптовым ценам от производителя.`
          }
        ]
      };
      // console.log("head -> head", head);
      return head;
    }
  },
  components: {
    ProductDialog
  },
  async asyncData(ctx) {
    let product = {};
    if (ctx.params && !ctx.params.slug) return { product };

    // if (ctx.params && ctx.params.slug) {
    // await ctx.store.dispatch("fetchGeneralInfo");
    product = await ctx.store.dispatch("fetchProduct", {
      slug: ctx.params.slug,
      type: "catalog"
    });
    if (!product) {
      return ctx.error({
        statusCode: 404,
        message: "Продукт не найден"
      });
    }
    // }
    return {
      product
    };
  },
  watch: {
    dialog(val) {
      if (val === false) {
        this.$router.push({ params: { slug: null } });
        this.$emit("close");
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
      dialog: true,
      showCard: true
    };
  }
};
</script>

