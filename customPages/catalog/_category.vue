<template>
  <div>
    <NuxtChild @close="handleClose" />
    <LazyHydrate when-idle>
      <!-- never :trigger-hydration="!noLoad" -->
      <page-header
        :title="metaInfo.name"
        :breadrumbs="breadcrumbs"
        :fluid="true"
        :isPadding="true"
        class="pos-relative"
        :no-load="noLoad"
      >
        <!--  :imageSource="'https://api.prodaem-kolbasu.ru/uploads/031ba5905e18488794851c8d512b1227_5642513f3d.jpeg'" :loadingImage="require('~/assets/images/promo_crop.jpg?lqip')" :loading="!initialPageData" require('~/assets/images/promo_crop.jpg') -->
        <!-- <template v-slot:breadcrumbs>
          <div
            v-if="!initialPageData && isProductRoute"
            style="
              color: rgba(255, 255, 255, 0.5);
              display: flex;
              position: absolute;
              top: 24px;
              left: 0;
              right: 0;
              justify-content: center;
            "
          >
            <v-skeleton-loader
              type="button"
              height="21px"
              width="64px"
              :boilerplate="!fetchState"
              dark
            />
            <span style="padding: 0 12px">/</span>
            <v-skeleton-loader
              type="button"
              height="21px"
              width="64px"
              :boilerplate="!fetchState"
              dark
            />
            <span style="padding: 0 12px">/</span>
            <v-skeleton-loader
              type="button"
              height="21px"
              width="64px"
              :boilerplate="!fetchState"
              dark
            /></div
        ></template> -->
        <!-- <template #header>
          <v-skeleton-loader
            v-if="noLoad || !metaInfo.name"
            class="d-flex justify-center"
            dark
            type="heading"
            min-height="24px"
            min-width="300px"
            width="100%"
            :boilerplate="!fetchState"
          />
        </template> -->
        <template #bottom>
          <!-- v-if="!noLoad" <template v-if="noLoad">
            <v-skeleton-loader
              class="mx-1"
              dark
              type="button"
              height="48px"
              width="100%"
              min-width="120px"
              :boilerplate="!fetchState"
            />
          </template> -->
          <!-- <template v-else> -->
          <!-- {{ subcategories }} -->
          <!-- <template v-if="!noLoad"> -->
          <!-- <div class="mt-3">  -->
          <div style="max-width: 100%">
            <lazy-subcategories
              v-if="!isProductRoute && subcategories && subcategories.length"
              :subcategories="subcategories"
            />
          </div>
          <!-- -->
          <!-- <div class="mt-3">
              <v-chip
                v-for="child in subcategories"
                :to="`/catalog/${child.slug}`"
                class="subcategory-btn ma-0 px-3"
                :key="`subcategory-${child.id}`"
                :title="child.name"
                text-color="white"
                color="transparent"
                label
                link
                nuxt
                style="height: 36px"
              >
                <span class="d-inline-block text-truncate text-uppercase">
                  {{ child.name }}
                </span>
              </v-chip>
            </div> -->
          <!-- </template> -->
          <!-- text color="white"-->
          <!-- </div> -->
          <!-- </page-header> -->
          <!-- </template> -->
          <!-- <v-tabs
            v-else
            background-color="transparent"
            dark
            show-arrows
            center-active
            centered
            slider-color="accent"
            slider-size="3"
          >
            <v-tab
              v-for="child in subcategories"
              :to="`/catalog/${child.slug}`"
              :key="`subcategory-${child.slug}`"
              :title="child.name"
              nuxt
            >
              {{ child.name }}
            </v-tab>
          </v-tabs> -->
        </template>
      </page-header>
    </LazyHydrate>

    <div
      :class="$style.categoryWrapper"
      class="background-with-transparent pa-3"
      :style="`background-image: url(${image})`"
      id="contentWrapper"
    >
      <!-- {{ !noLoad }}
      {{ !isProductRoute }} -->
      <div :class="$style.container">
        <!-- <LazyHydrate never :trigger-hydration="true"> -->
        <LazyHydrate never :trigger-hydration="isMounted && !noLoad">
          <div :class="$style.products">
            <!-- <LazyHydrate
            when-visible
           
          > -->
            <div
              v-for="(product, index) in products"
              :key="`product-${index}`"
              class="flex xs12 sm6 md4 lg3 xl2 pa-2"
              :class="$style.product"
            >
              <product-card
                :class="$style.productInner"
                :product="product"
                grandparent="catalog"
                :parent="category.slug"
                :loading="fetchState"
              />
              <!-- :show="index < 10" -->
            </div>
            <!-- </LazyHydrate>
          <LazyHydrate when-visible> -->
            <lazy-products-infinity
              style="width: 100%"
              v-if="isMounted && pageData && products.length >= limit"
              @load="onInfinite"
            />
            <!-- </LazyHydrate> -->
          </div>
        </LazyHydrate>
        <!-- </LazyHydrate> -->

        <!-- <LazyHydrate never :trigger-hydration="load">:content-class="$style.sortMenu" -->

        <div :class="$style.filters">
          <!-- <LazyHydrate never :trigger-hydration="!isProductRoute"> -->
          <lazy-filtersSort
            v-if="!isProductRoute"
            :sortItems="sortItems"
            :selectedItemTitle="sort.title"
            @change="(val) => sortChange(val)"
          />
          <lazy-filters-sort-sceleton v-else :boilerplate="!fetchState" />
          <!-- </LazyHydrate> -->
          <LazyHydrate never :trigger-hydration="isMounted && !noLoad">
            <div>
              <!-- <template v-else>
              <v-skeleton-loader
                type="button"
                height="36px"
                :boilerplate="!fetchState"
              />
            </template> -->
              <!-- <template v-if="initialPageData"> -->
              <lazy-filters
                v-if="
                  initialPageData &&
                  !!category.product_types &&
                  category.product_types.length
                "
                filterSlug="type"
                filterName="виды"
                :filterAllDisabled="!!manufacturer || !productType"
                :items="category.product_types"
                @change="(val) => productTypeChange(val)"
              />

              <lazy-filters
                v-if="initialPageData && !!category.manufacturers"
                filterSlug="manufacturer"
                filterName="производители"
                :filterAllDisabled="!!productType || !manufacturer"
                :items="category.manufacturers"
                @change="(val) => manufacturerChange(val)"
              />
              <lazy-filters-sceleton v-else :boilerplate="!fetchState" />
            </div>
          </LazyHydrate>
        </div>
      </div>
    </div>
    <section class="grey lighten-3" v-if="metaInfo.content">
      <LazyHydrate never>
        <v-container class="py-16">
          <v-row>
            <v-col cols="12">
              <content-wrapper :content="metaInfo.content" />
            </v-col>
          </v-row>
        </v-container>
      </LazyHydrate>
    </section>
  </div>
</template>
<style lang="scss" scoped module>
// .fixed {
//   position: fixed;
//   top: 85px;
//   right: 5px;
//   max-height: calc(100vh - 85px);
//   overflow-y: auto;
// }
// .sortMenu {
//   top: 36px;
//   text-transform: none;
// }
// .categorySelected {
//   color: #ffffff !important;
//   caret-color: #ffffff !important;
//   // background-color: rgba($white, 0.5) !important;
// }
.categoryWrapper {
  max-width: 100%;
  $filtersWidthMd: 270px;
  $filtersWidthLg: 320px;
  .container {
    width: 100%;
    // padding: 25px 20px;
    margin: 0 auto;
    display: flex;
    flex-direction: column-reverse;
    @include md {
      flex-direction: row;
    }
    .filters {
      padding: 8px;
      width: 100%;
      @include md {
        width: $filtersWidthMd;
        min-width: $filtersWidthMd;
        // flex: 0 0 270px;
      }
      @include lg {
        width: $filtersWidthLg;
        min-width: $filtersWidthLg;
        // flex: 0 0 300px;
      }
    }
    .products {
      flex-grow: 1;
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      align-content: flex-start;
      // @debug ($filtersWidth);
      @include md {
        max-width: calc(100% - #{$filtersWidthMd});
        // @debug ($filtersWidth);
      }
      @include lg {
        max-width: calc(100% - #{$filtersWidthLg});
        // @debug ($filtersWidth);
      }
      // .sceletonCardWrapper {
      //   height: 310px;
      //   @include md {
      //     height: 300px;
      //   }
      // }max-width: calc(100% - 270px);
      .product {
        .productInner {
          height: 300px;
          @include md {
            height: 310px;
          }
        }

        // height: fit-content;
        // display: flex;
        // height: 310px;
        // @include md {
        //   height: 300px;
        // }
      }
    }
  }
}
</style>

<script>
import gql from "graphql-tag";
import LazyHydrate from "vue-lazy-hydration";

// function calculateImageUrl(imageObject, imageBaseUrl) {
//   // console.log(
//   //   "🚀 ~ file: _category.vue ~ line 364 ~ calculateImageUrl ~ imageObject",
//   //   imageObject
//   // );
//   if (!imageObject || !imageObject.url) return "/no-image.png";
//   if (!imageObject.formats) {
//     return imageBaseUrl + imageObject.url;
//   }

//   return imageBaseUrl + imageObject.formats.thumbnail.url;
// }

export default {
  name: "category-main",
  head() {
    if (!this.isProductRoute) {
      return {
        title: this.metaInfo.name,
        meta: [
          {
            hid: "description",
            name: "description",
            content: this.metaInfo.description,
          },
        ],
        // link: [
        //   {
        //     rel: "canonical",
        //     href: this.metaInfo.canonical,
        //   },
        // ],
      };
    }
  },
  components: { LazyHydrate },
  data() {
    const sortItems = [
      { title: "По алфавиту", value: "name:asc", slug: "name" },
      { title: "По популярности", value: "rating:desc", slug: "rating" },
      { title: "Cначала дорогие", value: "priceNum:desc", slug: "pricedesc" },
      { title: "Cначала дешевые", value: "priceNum:asc", slug: "priceasc" },
    ];
    return {
      imageBaseUrl: this.$config.imageBaseUrl,
      sortItems: sortItems,
      sort: sortItems[0],
      // sortIcon: mdiSortVariant,
      pageData: false,

      categoriesIds: [],
      category: {},
      limit: 20,
      productType: false,
      manufacturer: false,
      isProductRoute: !!this.$route.params.slug,
      products: new Array(20).fill(false),
      // manufacturerSelected: null,
      // productTypeSelected: null,
      initialPageData: false,
      metaInfo: {},
      imageSource: require("~/assets/images/bg.jpg?original"),
      image: "",
      bgLoaded: false,
      isMounted: false,
      // subcategories: [],
      // subcats: [],
      // rootCategory: null,
    };
  },

  mounted() {
    this.isMounted = true;
    this.loadImage();
  },
  async fetch() {
    if (!this.initialPageData && !this.isProductRoute) {
      const categoryFind = await this.findCategory(this.$route.params.category);
      if (!categoryFind) {
        this.$nuxt.error({
          statusCode: 404,
          message: "Категория не найдена",
          type: "catalog",
        });
      }

      this.categoriesIds.push(categoryFind.id);
      if (categoryFind.children && categoryFind.children.length > 0) {
        this.categoriesIds.push(
          ...categoryFind.children.map((item) => item.id)
        );
      }
      const category = await this.fetchCategory(categoryFind.id);
      this.category = category;
      const { manufacturer, type } = this.$route.query;
      if (manufacturer) {
        this.manufacturer = await this.getManufacturer(manufacturer);
      }
      if (type) {
        // const productTypeId = category.product_types.find(
        //   (item) => item.slug === type
        // )._id;
        this.productType = category.product_types.find(
          (item) => item.slug === type
        ); //await this.fetchProductType(productTypeId);
      }
      // const isChildCategory = !!category.parent.length;
      if (!!category.parent.length) {
        // isChildCategory

        this.$store.dispatch("setRootCategory", category.parent[0]);
      } else {
        // not ChildCategory
        const { children, name, slug } = this.category;
        this.$store.dispatch("setRootCategory", { children, name, slug });
      }
      // subcategories() {
      // },
      this.calculateMeta();

      this.initialPageData = true;
    } else if (this.isProductRoute) {
      const categoryFind = await this.findCategory(this.$route.params.category);
      if (!categoryFind) {
        this.$nuxt.error({
          statusCode: 404,
          message: "Категория не найдена",
          type: "catalog",
        });
      }
      this.category = categoryFind;
      this.$store.dispatch("setRootCategory", this.category);
    }

    if (!this.pageData && !this.isProductRoute) {
      const oldLength = this.products.length;
      // console.log(
      //   "🚀 ~ file: _category.vue ~ line 485 ~ fetch ~ oldLength",
      //   oldLength
      // );
      this.products = new Array(oldLength).fill(false);
      const products = await this.fetchProducts({
        category: this.categoriesIds,
        limit: this.limit,
        sort: this.sort.value,
        manufacturer: this.manufacturer && this.manufacturer._id,
        product_type: this.productType && this.productType._id,
      });
      const length = products.length;
      if (oldLength !== length) {
        this.products = this.products.slice(0, length);
      }

      // for (let index = 0; index < length; index++) {
      //   const { img, ...newProduct } = products[index];
      //   newProduct.imageUrl = calculateImageUrl(img, this.imageBaseUrl);
      //   // this.products[index] = products[index];
      //   this.products[index] = {
      //     value: Object.freeze(newProduct), // products[index]),
      //     __v: 0,
      //   };
      // }
      // .map((item) => {
      //   console.log("isFrozen", !Object.isFrozen(item));
      //   item.imageUrl = calculateImageUrl(item.img, this.imageBaseUrl);
      //   delete item.img;
      //   // console.log(
      //   //   "🚀 ~ file: _category.vue ~ line 713 ~ returnproducts.map ~ item.img",
      //   //   item.img
      //   // );

      //   return { value: Object.freeze(item), __v: 0 };
      // });
      this.products = products;

      this.pageData = true;
    }
  },
  watch: {
    noLoad(val) {
      // console.log("watch noLoad ~ val", val);
      if (!val) {
        this.loadImage();
      }
    },
    // "$route.query.manufacturer"(val) {
    //   console.log("manufacturer change", val);
    // },
  },
  computed: {
    noLoad() {
      return !this.initialPageData && this.isProductRoute;
    },
    fetchState() {
      return this.$fetchState.pending;
    },

    subcategories() {
      return this.$store.getters.subcategories;
    },

    breadcrumbs() {
      const rootCategory = this.$store.state.sessionStorage.rootCategory;
      let items = [
        {
          to: "/",
          text: "Главная",
        },
        {
          to: "/catalog",
          text: "Каталог",
        },
      ];
      items.push({
        to: `/catalog/${rootCategory.slug}`,
        text: rootCategory.name,
      });

      if (this.category.slug !== rootCategory.slug) {
        items.push({
          to: `/catalog/${this.category.slug}`,
          text: this.category.name,
          // disable: false,
        });
      }

      this.$store.dispatch("breadcrumbs", items);
      return items;
    },
  },
  methods: {
    loadImage() {
      // console.log("loadImage", !this.noLoad && !this.bgLoaded);
      if (!this.noLoad && !this.bgLoaded) {
        this.image = this.imageSource;
        this.bgLoaded = true;
      }
    },
    async calculateMeta() {
      let name = `${this.category.name} оптом`;
      let description = this.category.metaDescription
        ? this.category.metaDescription
        : `${name} от компании Альянс Фуд с доставкой по всей РФ и СНГ по самым выгодным оптовым ценам от производителя.`;
      // let canonical = `${this.$config.siteUrl}/catalog/${this.category.slug}`;
      let content = this.category.content;

      if (this.manufacturer) {
        name = `${this.category.name} ${this.manufacturer.name} оптом`;
        description = `${name}. ${description}`;
        // canonical = `${canonical}?manufacturer=${this.manufacturer.slug}`;
      } else if (this.productType) {
        const productType = await this.fetchProductType(this.productType._id);

        name = `${productType.name} оптом`;
        description = `${name}. ${description}`;
        // canonical = `${canonical}?type=${productType.slug}`;
        if (productType.content) {
          content = productType.content.concat(content);
        }
      }

      this.metaInfo = {
        name,
        description,
        // canonical,
        content,
      };
      // return ;
    },
    // cleanProducts(oldLength) {
    //   for (let index = 0; index < oldLength; index++) {
    //     this.products[index] = false;
    //   }
    // },
    findCategoryById(id) {
      if (!id) return null;
      const category = this.$store.state.sessionStorage.generalInfo.categories.find(
        (item) => item.id === id
      );
      if (!category) return null;
      return category;
    },
    findCategory(slug) {
      if (!slug) return null;
      const category = this.$store.state.sessionStorage.generalInfo.categories.find(
        (item) => item.slug === slug
      );
      if (!category) return null;
      return category;
    },
    async getManufacturer(slug) {
      if (!slug) return null;
      const manufacturer = this.$store.state.sessionStorage.generalInfo.manufacturers.find(
        (item) => item.slug === slug
      );
      if (!manufacturer) return null;
      return manufacturer;
    },
    async fetchProducts(params) {
      // console.log(
      //   "🚀 ~ file: _category.vue ~ line 665 ~ fetchProducts ~ params",
      //   params
      // );
      let {
        data: { products },
      } = await this.$apollo.query({
        query: gql`
          query productsQuery(
            $manufacturer: ID
            $category: [ID!]
            $product_type: ID
            $sort: String
            $limit: Int
            $start: Int
          ) {
            products(
              limit: $limit
              start: $start
              sort: $sort
              where: {
                manufacturer: $manufacturer
                category: $category
                product_type: $product_type
              }
            ) {
              id
              name
              slug
              weight
              isDiscount
              isHalal
              priceNum
              discountPrice
              rating
              minimumOrder
              piece
              manufacturer {
                name
                slug
              }
              category {
                name
                slug
              }
              img {
                url
                name
                formats
              }
            }
          }
        `,
        variables: {
          ...(params.manufacturer && {
            manufacturer: params.manufacturer,
          }),
          ...(params.product_type && {
            product_type: params.product_type,
          }),
          category: params.category,
          sort: params.sort || "name:asc",
          limit: params.limit || 20,
          start: params.start || 0,
        },
      });
      // console.log(
      //   "🚀 ~ file: _category.vue ~ line 710 ~ fetchProducts ~ products",
      //   products
      // );
      // return products.reduce((acc, item) => {
      //   item.img = calculateImageUrl(item.img, this.imageBaseUrl);
      //   console.log(
      //     "🚀 ~ file: _category.vue ~ line 707 ~ returnproducts.reduce ~ item.img",
      //     item
      //   );
      //   // console.log(
      //   //   "🚀 ~ file: _category.vue ~ line 713 ~ returnproducts.map ~ item.img",
      //   //   item.img
      //   // );
      //   acc.push({ value: Object.freeze(item), __v: 0 });

      //   return acc; //{ value: Object.freeze(item), __v: 0 };
      // }, []);
      return products.map((item) => {
        // console.log("isFrozen", !Object.isFrozen(item));
        // item.imageUrl = calculateImageUrl(item.img, this.imageBaseUrl);
        // delete item.img;
        // console.log(
        //   "🚀 ~ file: _category.vue ~ line 713 ~ returnproducts.map ~ item.img",
        //   item.img
        // );

        return Object.freeze(item); //{ value: Object.freeze(item), __v: 0 };
      });
    },
    // calculateImageUrl(imageObject,imageBaseUrl) {
    //   if (!imageObject || !imageObject.url) return "/no-image.png";
    //   if (!imageObject.formats) {
    //     return imageBaseUrl + imageObject.url;
    //   }

    //   return imageBaseUrl + imageObject.formats.thumbnail.url;
    // },
    async fetchProductType(id) {
      // const client = this.app.apolloProvider.defaultClient;
      const {
        data: { productType },
      } = await this.$apollo.query({
        variables: {
          id,
        },
        query: gql`
          query ProductTypeQuery($id: ID!) {
            productType(id: $id) {
              _id
              id
              name
              slug
              content
            }
          }
        `,
      });
      return productType;
    },
    async fetchCategory(id) {
      // const client = this.app.apolloProvider.defaultClient;
      const {
        data: { category },
      } = await this.$apollo.query({
        query: gql`
          query CategoryQuery($id: ID!) {
            category(id: $id) {
              id
              description
              metaDescription
              name
              slug
              content
              img {
                url
              }
              manufacturers(sort: "name:asc") {
                _id
                name
                slug
              }
              parent {
                slug
                name
                children {
                  id
                  name
                  slug
                }
              }
              children {
                id
                name
                slug
              }
              product_types(sort: "name:asc") {
                _id
                name
                slug
              }
            }
          }
        `,
        variables: {
          id,
        },
      });
      return category;
    },
    async sortChange(item) {
      // console.log(
      //   "🚀 ~ file: _category.vue ~ line 755 ~ sortChange ~ item",
      //   item
      // );
      if (this.sort.value !== item.value) {
        this.sort = item;
        this.pageData = false;
        await this.$fetch();
      }
    },
    async productTypeChange(item) {
      // console.log(
      //   "🚀 ~ file: _category.vue ~ line 772 ~ productTypeChange ~ item",
      //   item
      // );
      this.manufacturer = null;
      const oldValue = this.productType && this.productType._id;
      const newValue = item && item._id;
      if (oldValue !== newValue) {
        this.productType = item;
        this.pageData = false;
        await this.$fetch();
        await this.calculateMeta();
      }
    },
    async manufacturerChange(item) {
      // console.log(
      //   "🚀 ~ file: _category.vue ~ line 783 ~ manufacturerChange ~ item",
      //   item
      // );
      this.productType = null;
      const oldValue = this.manufacturer && this.manufacturer._id;
      const newValue = item && item._id;
      if (oldValue !== newValue) {
        this.manufacturer = item;
        this.pageData = false;
        await this.$fetch();
        await this.calculateMeta();
      }
    },

    async handleClose(isInCart, id) {
      // console.log(
      //   "🚀 ~ file: _category.vue ~ line 911 ~ handleClose ~ isInCart"
      // );
      const query = {
        ...(this.manufacturer && { manufacturer: this.manufacturer.slug }),
        ...(this.productType && { type: this.productType.slug }),
      };

      const { slug, ...params } = this.$route.params;
      const routeSplit = this.$route.path.replace(/\/$/, "").split("/");
      routeSplit.pop();
      const newRoute = { path: routeSplit.join("/"), params, query };

      await this.$router.push(newRoute); //.go(-1); //.push({ params: { params } });
      this.isProductRoute = false;

      if (!this.pageData) {
        await this.$fetch();
      }
      //  else {
      // if (isInCart) {
      //   try {
      //     const find = this.products.find(({ value }) => value.id === id);
      //     if (find) {
      //       find.__v = find.__v + 1;
      //     }
      //   } catch (error) {
      //     console.log(
      //       "🚀 ~ file: _category.vue ~ line 664 ~ handleClose ~ error",
      //       error
      //     );
      //   }
      // }
      // }
    },
    async onInfinite($state) {
      // const currentLength = this.products.length;
      const newProducts = await this.fetchProducts({
        category: this.categoriesIds,
        start: this.products.length,
        sort: this.sort.value,
        manufacturer: this.manufacturer && this.manufacturer._id,
        product_type: this.productType && this.productType._id,
      });
      // const length = newProducts.length;
      if (newProducts && newProducts.length) {
        // const newProductArr = newProducts.map((product) => {
        //   const { img, ...newProduct } = product;
        //   newProduct.imageUrl = calculateImageUrl(img, this.imageBaseUrl);
        //   return {
        //     value: Object.freeze(newProduct),
        //     __v: 0,
        //   };
        // });
        // for (let product of newProducts) {
        //   const { img, ...newProduct } = product;
        //   newProduct.imageUrl = calculateImageUrl(img, this.imageBaseUrl);
        //   console.log(
        //     "🚀 ~ file: _category.vue ~ line 932 ~ onInfinite ~ newProduct.imageUrl",
        //     newProduct
        //   );
        //   this.products.push({
        //     value: Object.freeze(newProduct),
        //     __v: 0,
        //   });
        // }
        this.products = [...this.products, ...newProducts];
        await $state.loaded();
      } else {
        await $state.complete();
      }
    },
  },
  // isManyProducts() {
  //   return this.products.length >= this.limit;
  // },
  // isMobile() {
  //   return this.$vuetify.breakpoint.xs;
  // },
  // metaInfo() {
  //   let name = `${this.category.name} оптом`;
  //   let description = this.category.metaDescription
  //     ? this.category.metaDescription
  //     : `${name} от компании Альянс Фуд с доставкой по всей РФ и СНГ по самым выгодным оптовым ценам от производителя.`;
  //   let canonical = `${this.$config.siteUrl}/catalog/${this.category.slug}`;
  //   let content = this.category.content;

  //   if (this.manuf) {
  //     name = `${this.category.name} ${this.manufacturer.name} оптом`;
  //     description = `${name}. ${description}`;
  //     canonical = `${canonical}?manufacturer=${this.manufacturer.slug}`;
  //   } else if (this.prodType) {
  //     name = `${this.productType.name} оптом`;
  //     description = `${name}. ${description}`;
  //     canonical = `${canonical}?type=${this.productType.slug}`;
  //     if (this.productType.content) {
  //       content = this.productType.content.concat(content);
  //     }
  //   }

  //   return {
  //     name,
  //     description,
  //     canonical,
  //     content,
  //   };
  // },
  // beforeDestroy() {
  //   console.log("beforeDestroy", this);
  //   this.products = [];
  //   this.metaInfo = {};
  // },
  //this.products.concat(newProducts);
  // console.log("this.products", this.products.length);
  // await $state.complete();
  // const length = newProducts.length;
  // console.log(
  //   "🚀 ~ file: _category.vue ~ line 684 ~ onInfinite ~ length",
  //   length
  // );
  // this.products = this.products.concat(newProducts);
  // $state.complete();
  // if (newProducts && newProducts.length) {
  //   // const newProductsMapped = newProducts.map((item) => {
  //   //   return { value: Object.freeze(item), __v: 0 };
  //   // });
  //   this.products.concat(newProducts); //= [...this.products, ...newProductsMapped];
  //   this.productsCount = this.products.length;
  //   $state.loaded();
  // } else {
  //   $state.complete();
  // }
  // if (!length) {
  //   $state.complete();
  // } else {
  //   console.log("onInfinite", length);
  //   for (let index = 0; index <= length - 1; index = index + 1) {
  //     console.log("onInfinite ~ forindex", index);
  //     console.log("onInfinite ~ newIndex", currentLength + index);
  //     this.products[currentLength + index] = {
  //       value: Object.freeze(newProducts[index]),
  //       __v: 0,
  //     };
  //   }
  //   $state.loaded();
  // }
  // const length = newProducts.length
  // console.log(
  //   "🚀 ~ file: _category.vue ~ line 686 ~ onInfinite ~ newProducts",
  //   newProducts
  // );

  //  for (let index = 0; index <= length - 1; index = index + 1) {
  //   this.products[index] = {
  //     value: Object.freeze(products[index]),
  //     __v: 0,
  //   };
  // }
  // console.log("recalculate subcategories");
  // console.log("subcategories", this.$store.getters.subcategories);
  // if (!this.initialPageData) {
  //   return false;
  // }
  // if (this.parentCategory) {
  //   const subcats = [
  //     {
  //       slug: this.parentCategory.slug,
  //       name: `Все ${this.parentCategory.name}`,
  //     },
  //   ].concat(this.parentCategory.children);
  //   return subcats;
  // } else {
  //   return [
  //     {
  //       slug: this.category.slug,
  //       name: `Все ${this.category.name}`,
  //     },
  //     ...this.category.children,
  //   ];
  // }
  // isProduct() {
  //   // await this.$nextTick(() => {});
  //   const isProduct = !!this.$route.params.slug;
  //   console.log("computed ~ isProduct", isProduct);
  //   return isProduct;
  // },
  // isProduct2: {
  //   // const isProduct = !!this.$route.params.slug;
  //   // console.log("computed ~ isProduct", isProduct);
  //   // return !!this.$route.params.slug;
  // },
  // async asyncData(ctx) {
  //   const categoryFind = await ctx.store.getters.getCategory(
  //     ctx.params.category
  //   );
  //   if (!categoryFind) {
  //     return ctx.error({
  //       statusCode: 404,
  //       message: "Категория не найдена",
  //       type: "catalog",
  //     });
  //   }
  //   let categoriesIds = [categoryFind.id];
  //   if (categoryFind.children && categoryFind.children.length > 0) {
  //     categoriesIds.push(...categoryFind.children.map((item) => item.id));
  //   }

  //   const isProductRoute = !!ctx.params.slug;
  //   console.log("asyncData ~ isProductRoute", isProductRoute);
  //   const initialPageData = false;
  //   let manufacturer, category, productType; //,
  //   let limit = 60;
  //   category = await ctx.store.dispatch("fetchCategory", categoryFind.id);

  //   if (ctx.query.manufacturer) {
  //     manufacturer = ctx.store.getters.getManufacturer(ctx.query.manufacturer);
  //   }

  //   if (ctx.query.type) {
  //     productType = await ctx.store.dispatch(
  //       "fetchProductType",
  //       category.product_types.find((item) => item.slug === ctx.query.type)._id
  //     );
  //   }

  //   return {
  //     categoriesIds: categoriesIds,
  //     category: category,
  //     // manufacturers: category.manufacturers,
  //     limit: limit,
  //     productType: productType || null,
  //     manufacturer: manufacturer || null,
  //     isProductRoute: isProductRoute,
  //     products: new Array(limit),
  //     manufacturerSelected: (manufacturer && manufacturer.id) || null,
  //     productTypeSelected: (productType && productType._id) || null,
  //     initialPageData: initialPageData,
  //   };
  // },
};
</script>
<style lang="scss" scoped>
// .chipSelected {
//   background-color: #252525 !important;
//   color: #f5f5f5 !important;
// }
#contentWrapper {
  min-height: 900px;
}

// .subcategories {
//   width: 100%;
//   justify-content: center;

//   .subcategory-btn {
//     font-size: 0.7rem;
//   }
// }

// @media (min-width: 960px) {
//   .subcategories {
//     .subcategory-btn {
//       font-size: 0.9rem;
//     }
//   }
// }
</style>
