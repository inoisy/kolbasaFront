<template>
  <v-dialog
    v-if="isChildPage"
    v-model="dialog"
    scrollable
    :width="showCard ? 'auto' : '500px'"
    class="mt-12"
    content-class="dialog-content-wrapper"
    :persistent="false"
  >
    <product-dialog :product="product" :isManufacturer="true"></product-dialog>
  </v-dialog>
</template>

<script>
import gql from "graphql-tag";
import ProductDialog from "~/components/ProductDialog";
import ContactForm from "~/components/ContactForm";
export default {
  head() {
    return {
      title: this.isChildPage
        ? this.product && this.product.name
          ? this.product.name
          : ""
        : this.manufacturer && this.manufacturer.name
        ? `Мясокомбинат ${this.manufacturer.name}. Купить колбасы ${this.manufacturer.name} оптом.`
        : "",
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: "description",
          name: "description",
          content: this.isChildPage
            ? this.product && this.product.description
              ? this.product.description.slice(0, 310)
              : `${this.product.name} оптом. ${this.product.name} от компании Альянс Фуд с доставкой по всей РФ и СНГ по самым выгодным оптовым ценам от производителя.`
            : this.manufacturer && this.manufacturer.description
            ? this.manufacturer.description.slice(0, 310)
            : `${this.manufacturer.name} оптом. ${this.manufacturer.name} от компании Альянс Фуд с доставкой по всей РФ и СНГ по самым выгодным оптовым ценам от производителя.`
        }
      ],
      link: [
        {
          rel: "canonical",
          href:
            this.product && this.product.category && this.product.category.slug
              ? `https://prodaem-kolbasu.ru/catalog/${this.product.category.slug}/${this.product.slug}`
              : ""
        }
      ]
    };
  },
  components: { ContactForm, ProductDialog },
  async asyncData(ctx) {
    let product = {};
    if (ctx.params && ctx.params.productSlug) {
      await ctx.store.dispatch("fetchGeneralInfo");
      product = await ctx.store.dispatch("fetchProduct", {
        slug: ctx.params.productSlug
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
    isChildPage() {
      return this.$route.params && this.$route.params.productSlug;
    },
    manufacturer() {
      return this.isChildPage
        ? this.product.manufacturer
          ? this.product.manufacturer
          : {}
        : this.$store.state.sessionStorage.manufacturer;
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
    //     }
    //     // {
    //     //   to: `/catalog/${this.$store.state.sessionStorage.category.slug}`,
    //     //   text: this.$store.state.se ssionStorage.category.name
    //     // }
    //   ];
    // },
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
  watch: {
    // dialog(val) {
    //   if (val === false) {
    //     this.$router.push({ params: { productSlug: null } });
    //   }
    // }
    // weight_selected(val) {
    //   console.log("TCL: weight_selected -> val", val, this.mySwiper);
    //   this.mySwiper.slideTo(val, 1000, false);
    //   // console.log(val)
    // }
  },
  methods: {
    handleClickOutside() {
      // console.log(
      //   "TCL: handleClickOutside -> handleClickOutside",
      //   this.$refs.portalTarget
      // );
      // const capture = this.$refs.productCardActions.contains(event.target);
    },
    handleOneClickBuy() {
      this.showCard = false;
    },
    async addToBasket(event) {
      await this.$store.commit("addToBasket", this.product);
    },
    async removeFromBasket(event) {
      await this.$store.commit("removeFromBasket", this.product);
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

