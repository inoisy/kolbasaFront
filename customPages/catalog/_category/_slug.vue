<template>
    <div
        v-if="isProduct"
        ref="modal"
        class="modal"
        tabindex="0"
        @keydown.esc="handleClose"
    >
        <div class="modal-mask" @click="handleClose" />
        <div class="modal-inner" :class="!showProductCard && 'formShowed'">
            <LazyHydrate when-idle>
                <div class="toolbar">
                    <v-btn
                        v-if="!showProductCard"
                        class="fabButton backButton my-auto"
                        color="gray"
                        fab
                        title="Назад"
                        @click="showProductCard = true"
                    >
                        <v-icon>$arrowLeft</v-icon>
                    </v-btn>
                    <breadcrumbs class="pr-3 my-auto"
                                 :items="breadcrumbs"
                                 dark
                    />
                    <v-btn class="fabButton ml-auto my-auto"
                           fab
                           @click="handleClose"
                    >
                        <v-icon>$close</v-icon>
                    </v-btn>
                </div>
            </LazyHydrate>
            <template v-if="$fetchState.pending">
                <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                    style=" height: 50vh; min-height: 300px;"
                >
                    <v-progress-circular indeterminate
                                         color="accent"
                                         size="200"
                    />
                </v-row>
            </template>
            <template v-else>
                <template v-if="showProductCard">
                    <LazyHydrate when-idle>
                        <div
                            class="dialog-product"
                            itemscope
                            itemtype="http://schema.org/Product"
                        >
                            <h1 itemprop="name"
                                class="productTitle"
                                v-text="product.name"
                            />
                            <div class="content-right">
                                <v-card
                                    id="imgWrapper"
                                    class="image-wrapper"
                                    :outlined="!showImageDialog"
                                    :disabled="!showImageDialog"
                                    @click="handleImageDialog"
                                >
                                    <div class="mini-imgs-wrapper pr-3 pt-3">
                                        <div ref="manufImage">
                                            <v-btn
                                                id="manufacturer-img"
                                                :outlined="isManufacturerDesctiption"
                                                width="55px"
                                                height="55px"
                                                class="pa-0"
                                                color="rgba(0,0,0,0.4)"
                                                :text="!isManufacturerDesctiption"
                                                :disabled="!isManufacturerDesctiption"
                                            >
                                                <img
                                                    class="manufacturer-img"
                                                    :src="manufacturerImgMin"
                                                    :alt="product.manufacturer.name"
                                                    height="50px"
                                                    width="50px"
                                                />
                                            </v-btn>

                                            <v-menu
                                                v-if="isManufacturerDesctiption"
                                                activator="#manufacturer-img"
                                                attach="#imgWrapper"
                                                z-index="205"
                                                absolute
                                                eager
                                                max-width="100%"
                                            >
                                                <v-sheet class="tooltip-inner">
                                                    {{ product.manufacturer.description }}
                                                </v-sheet>
                                            </v-menu>
                                        </div>
                                        <img
                                            v-if="product.isHalal"
                                            class="halal-img mt-2 mx-auto"
                                            src="/images/halal-min.png"
                                            alt="Халяльная продукция"
                                            title="Халяльная продукция"
                                            height="50px"
                                            width="50px"
                                        />
                                    </div>
                                    <div class="image-inner">
                                        <div
                                            :style="`padding-top: ${
                                                (imgThumbnail.height / imgThumbnail.width) * 100
                                            }%`"
                                        />
                                        <img
                                            itemscope="itemscope"
                                            itemprop="image"
                                            class="item-img"
                                            :src="$config.imageBaseUrl + imgThumbnail.url"
                                            :alt="product.name"
                                            contain
                                        />
                                    </div>
                                </v-card>
                                <price
                                    class="productPricesWrapper"
                                    :price-num="product.priceNum"
                                    :is-discount="product.isDiscount"
                                    :discount-price="product.discountPrice"
                                    :piece="product.piece"
                                    :weight="product.weight"
                                    :minimum-order="product.minimumOrder"
                                />
                                <product-add
                                    v-if="product.priceNum"
                                    :id="product._id"
                                    class="productAdd"
                                    style="height: 48px;"
                                    @add="handleAdd"
                                />
                                <v-btn
                                    class="mt-3 fill-width"
                                    dark
                                    color="#d50000"
                                    height="48px"
                                    large
                                    outlined
                                    block
                                    title="Купить в один клик"
                                    @click="handleOneClickBuy"
                                >
                                    Купить в один клик
                                </v-btn>
                            </div>
                            <div v-if="product.manufacturer" class="manufacturer">
                                Производитель:
                                <nuxt-link
                                    class="underline-on-hover"
                                    :to="`/manufacturers/${product.manufacturer.slug}`"
                                    :title="product.manufacturer.name"
                                    v-text="product.manufacturer.name"
                                />
                            </div>
                            <content-wrapper :content="contentFull" />
                            <meta
                                itemprop="description"
                                :content="`${product.name} купить в Альянс Фуд за ${product.priceNum}`"
                            />
                        </div>
                    </LazyHydrate>
                    <LazyHydrate v-if="related.length" when-visible>
                        <div class="grey lighten-3" style="clear: both;">
                            <h2 class="mb-2 pl-5 pt-4">Похожие товары</h2>

                            <v-row no-gutters class="pa-3">
                                <v-col
                                    v-for="product in related"
                                    :key="product.id"
                                    class="pa-2"
                                    cols="12"
                                    sm="6"
                                    md="4"
                                    lg="3"
                                >
                                    <lazy-product-card
                                        v-if="related.length"
                                        :product="product"
                                        grandparent="catalog"
                                        :parent="product.category.slug"
                                    />
                                </v-col>
                            </v-row>
                        </div>
                    </LazyHydrate>
                </template>
                <div v-else class="dialog-form-wrapper">
                    <LazyHydrate on-interaction>
                        <lazy-contact-form
                            v-if="!showProductCard"
                            :one-click-buy="true"
                            :product-name="product.name"
                        >
                            <h2 class="dialog-form-wrapper-header">
                                Купить "{{ product.name }}" в один клик
                            </h2>
                        </lazy-contact-form>
                    </LazyHydrate>
                </div>
            </template>
        </div>
        <lazy-dialog-image
            v-if="showImageDialog && dialogImg"
            ref="imageDialog"
            class="imageDialog"
            :img="imgDialog"
            :value="dialogImg"
            :alt="product.name"
            @close="dialogImg = false"
            @loaded="loadingEnd"
        />
    </div>
</template>
<script>
import LazyHydrate from 'vue-lazy-hydration';
import gql from 'graphql-tag';

export default {
    name: 'Child',
    components: {
        LazyHydrate,
    },
    transition: 'dialog',
    loading: false,

    props: {
        breadcrumbsBase: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            showProductCard: true,
            dialogImg: false,
            product: {
                manufacturer: {},
            },
            contentFull: '',
            breadcrumbs: this.breadcrumbsBase,
            showImageDialog: false,
            imgThumbnail: {},
            imgDialog: null,
            related: [],
            isShowManufacturerInfo: false,
            manufacturerImgMin: null,
        };
    },
    async fetch() {
        if (!this.isProduct) {
            return;
        }
        this.loadingStart();
        const {
            data: {
                products: [product],
            },
        } = await this.$apollo.query({
            query: gql`
        fragment relatedProduct on Product {
          name
          slug
          weight
          isDiscount
          isHalal
          priceNum
          discountPrice
          minimumOrder
          piece
          manufacturer {
            slug
            name
          }
          category {
            slug
          }
          img {
            url
            formats
          }
        }
        query ProductQuery($slug: String!) {
          products(where: { slug: $slug }) {
            _id
            description
            name
            slug
            content
            weight
            isDiscount
            isHalal
            priceNum
            discountPrice
            minimumOrder
            piece
            category {
              name
              slug
            }
            img {
              url
              formats
              width
              height
            }
            manufacturer {
              name
              slug
              description
            }
            relatedProducts {
              ...relatedProduct
            }
            productsRelated {
              ...relatedProduct
            }
          }
        }
      `,
            variables: {
                slug: this.$route.params.slug,
            },
        });

        if (!product) {
            return this.$nuxt.error({
                statusCode: 404,
                message: 'Товар не найден',
                type: 'catalog',
            });
        }
        const { content, description, ...productData } = product;
        this.product = productData;
        this.breadcrumbs = [...this.breadcrumbsBase, { text: product.name }];

        const phone = this.$store.state.info.data.contacts.phone;
        let contentFull = '';
        if (description) {
            contentFull += `<p>${description}</p>`;
        } else {
            contentFull += `<p> ${product.name}, представленная на нашем сайте продается по максимально выгодным ценам при условии оптовой покупки. Мы заботимся о вашем здоровье, предлагая качественные продукты отечественного производства. </p><p> ${product.name} c быстрой доставкой по Москве и МО. Доставка заказов также осуществляется во все регионы России и в страны СНГ. </p><p> Для оформления заказа воспользуйтесь формой на сайте или звоните по телефону <a style="white-space: nowrap;" :href="tel:${phone}">${phone}</a> </p>`;
        }
        if (content) {
            contentFull += content;
        }
        this.contentFull = contentFull;
        const relatedProducts = product.relatedProducts || [];
        const productsRelated = product.productsRelated || [];
        this.related = [...relatedProducts, ...productsRelated];
        this.manufacturerImgMin = require(`~/assets/images/manufacturers/${product.manufacturer.slug}.png?resize&size=50`);
        await this.caclulateImage(product.img);
        this.loadingEnd();
    },
    head() {
        if (this.isProduct && this.product.name && this.product.slug) {
            return {
                htmlAttrs: {
                    class: this.isProduct && 'm-open',
                },
                title: `${this.product.name} оптом`,
                link: [
                    {
                        rel: 'canonical',
                        href: `https://prodaem-kolbasu.ru/catalog/${this.product.category.slug}/${this.product.slug}`,
                    },
                ],
                meta: [
                    {
                        hid: 'description',
                        name: 'description',
                        content: this.product.description ?
                            this.product.description.slice(0, 310) :
                            `${this.product.name} оптом. ${this.product.name} от компании Альянс Фуд с доставкой по всей РФ и СНГ по самым выгодным оптовым ценам от производителя.`,
                    },
                ],
            };
        }
    },
    computed: {
        isManufacturerDesctiption() {
            return Boolean(this.product.manufacturer.description);
        },
        isProduct: {
            get() {
                return Boolean(this.$route.params.slug);
            },
            set(val) {
                if (!val) {
                    this.handleClose();
                }
            },
        },
    },
    watch: {
        '$route.params.slug': '$fetch',
    },
    fetchDelay: 0,
    methods: {
        caclulateImage(imageObject) {
            if (!imageObject) {
                this.imgUrl = '/no-image.png';
                return;
            }
            let thumbnailImageObject = imageObject;
            if (imageObject.formats.small) {
                thumbnailImageObject = imageObject.formats.small;
            } else {
                thumbnailImageObject = imageObject.formats.thumbnail;
            }
            this.imgThumbnail = {
                width: thumbnailImageObject.width,
                height: thumbnailImageObject.height,
                url: thumbnailImageObject.url,
            };
            if (imageObject.width > 500) {
                this.showImageDialog = true;
                this.imgDialog = {
                    width: imageObject.width,
                    height: imageObject.height,
                    url: imageObject.url,
                };
            }
        },
        loadingStart() {
            if (!process.client) {
                return;
            }
            this.$nuxt.$loading.start();
        },
        loadingEnd() {
            if (!process.client) {
                return;
            }
            this.$nuxt.$loading.finish();
        },
        async handleClose() {
            this.$refs.modal.classList.add('dialog-leave-to');
            setTimeout(async () => {
                this.$refs.modal.classList.remove('dialog-leave-to');
                this.showProductCard = true;
                await this.$emit('close');
            }, 200);
        },
        async handleAdd() {
            this.$store.dispatch('cart/addToCart', this.product);
        },
        handleImageDialog(event) {
            if (
                !this.showImageDialog ||
                (this.isManufacturerDesctiption &&
                    this.$refs.manufImage.contains(event.target))
            ) {
                return;
            }
            this.loadingStart();
            this.dialogImg = true;
        },
        handleOneClickBuy() {
            this.showProductCard = false;
        },
    },
};
</script>
<style lang="scss">
    .dialog-enter,
    .dialog-leave-to {
        .modal-mask {
            opacity: 0;
        }

        .modal-inner {
            opacity: 0;
            transform: scale(.5);
        }
    }

    .dialog-enter-to,
    .dialog-leave {
        .modal-mask {
            opacity: 1;
        }

        .modal-inner {
            opacity: 1;
            transform: scale(1);
        }
    }
</style>
<style lang="scss" scoped module>
</style>

<style lang="scss" scoped>
    .modal {
        --card-padding: 18px;

        @include md {
            --card-padding: 24px;
        }

        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 200;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        height: 100%;
        padding-right: var(--dialog-margin);
        padding-left: var(--dialog-margin);
        transition: .2s cubic-bezier(.25, .8, .25, 1);
        flex-direction: column;

        .modal-mask {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 199;
            background-color: rgba(51, 51, 51, .5);
            transition: opacity 0e ease;
        }

        .modal-inner {
            position: relative;
            z-index: 200;
            overflow-y: auto;
            width: 100%;
            max-width: var(--dialog-width);
            margin-top: calc(var(--toolbar-height) + var(--dialog-margin));
            margin-bottom: var(--dialog-margin);
            border-radius: 4px;
            border-color: #fff;
            background-color: #fff;
            outline: none;
            color: rgba(0, 0, 0, .87);
            transform-origin: center center;
            transition: .3s cubic-bezier(.25, .8, .25, 1);
            box-shadow:
                0 11px 15px -7px rgb(0 0 0 / 20%),
                0 24px 38px 3px rgb(0 0 0 / 14%),
                0 9px 46px 8px rgb(0 0 0 / 12%);

            &.formShowed {
                max-width: 600px;
            }

            .toolbar {
                z-index: 4;
                display: flex;
                align-content: center;
                padding-top: 10px;
                padding-right: var(--card-padding);
                padding-bottom: 10px;
                padding-left: var(--card-padding);
                border-color: #e0e0e0;
                background-color: #e0e0e0;

                @supports ((position: -webkit-sticky) or (position: sticky)) {
                    position: -webkit-sticky;
                    position: sticky;
                    top: -1px;
                    right: 0;
                    left: 0;
                    transform: translateY(0);
                    contain: layout;
                }

                .fabButton {
                    width: var(--fab-button-size) !important;
                    height: var(--fab-button-size) !important;
                }

                .backButton {
                    margin-right: 10px;
                    margin-left: -5px;

                    @include sm {
                        margin-right: var(--card-padding);
                        margin-left: 0;
                    }
                }
            }

            .dialog-product {
                overflow: hidden;
                padding: var(--card-padding);

                .productPricesWrapper {
                    --font-size: 26px;
                    --reduced-font-size: 1rem;

                    margin-bottom: calc(var(--card-padding) - 10px);
                }

                .productTitle {
                    margin-bottom: var(--card-padding);
                    font-size: 1.5rem;
                    font-weight: bold;
                    line-height: normal;
                }

                .image-wrapper {
                    position: relative;
                    margin-bottom: var(--card-padding);
                    padding: 12px;

                    .image-inner {
                        position: relative;
                        overflow: hidden;
                        max-height: 180px;

                        @include sm {
                            max-height: 200px;
                        }

                        @include md {
                            max-height: 250px;
                        }

                        .item-img {
                            position: absolute;
                            top: 0;
                            right: 0;
                            bottom: 0;
                            left: 0;
                            display: block;
                            max-width: 100%;
                            height: 100%;
                            max-height: 100%;
                            margin-right: auto;
                            margin-left: auto;
                            border-radius: 4px;
                            object-fit: contain;
                        }
                    }

                    .tooltip-inner {
                        padding: 10px 16px;
                        border-radius: 4px;
                        background: rgb(39 39 39 / 90%);
                        font-size: 12px;
                        color: rgb(255, 255, 255);
                        pointer-events: none;
                    }

                    .mini-imgs-wrapper {
                        position: absolute;
                        top: 0;
                        right: 0;
                        z-index: 1;
                        pointer-events: all;
                        user-select: all;

                        .halal-img {
                            display: block;
                            object-fit: contain;
                        }

                        .manufacturer-img {
                            display: block;
                            object-fit: contain;
                        }
                    }
                }

                .manufacturer {
                    margin-top: var(--card-padding);
                    margin-bottom: 12px;
                }

                .productAdd {
                    height: 48px !important;

                    --product-add-background: #d50000;
                    --product-add-color: #{$white};
                    --product-add-font-size: 14px;
                    --quantity-border-radius: 0;
                    --quantity-btn-margin: 12px;
                }

                @include md {
                    .content-right {
                        float: right;
                        width: 260px;
                        margin-bottom: 15px;
                        margin-left: 30px;
                    }
                }

                @include lg {
                    .content-right {
                        width: 310px;
                        margin-bottom: 20px;
                        margin-left: 45px;
                    }
                }
            }

            .dialog-form-wrapper {
                display: flex;
                justify-content: center;
                max-width: 600px;
                min-height: 60vh;
                margin: auto;
                padding-top: var(--card-padding);
                padding-right: var(--card-padding);
                padding-bottom: var(--card-padding);
                padding-left: var(--card-padding);
                flex-direction: column;

                .dialog-form-wrapper-header {
                    margin-bottom: var(--card-padding);
                    font-size: 18px;
                    font-weight: bold;
                    line-height: 125%;

                    @include md {
                        font-size: 1.5rem;
                    }
                }
            }
        }
    }
</style>
