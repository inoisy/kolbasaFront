<template>
    <v-card
        v-bind="{
            ripple: false,
            ...(isValue
                ? {
                    title: product.name,
                    to: `/${grandparent}/${parent}/${product.slug}`,
                    itemscope: true,
                    hover: true,
                    itemtype: 'http://schema.org/Product',
                }
                : {
                    disabled: true,
                }),
        }"
        class="product-wrapper"
        @click.capture="cardClick"
    >
        <template v-if="isValue">
            <div class="product-card-img-wrap">
                <v-img
                    itemprop="image"
                    class="d-block ma-auto product-img"
                    :title="product.name"
                    :alt="product.name"
                    :src="imgUrl"
                    contain
                />
                <div class="product-card-mini-imgs">
                    <v-img
                        v-if="product.isHalal"
                        class="mr-1"
                        src="/images/halal-min.png"
                        title="Халяльная продукция"
                        alt="Халяльная продукция"
                        width="40px"
                        contain
                    />
                    <v-img
                        v-if="product.manufacturer && product.manufacturer.slug"
                        class="d-block"
                        :title="product.manufacturer.name"
                        :alt="product.manufacturer.name"
                        :src="
                            require(`~/assets/images/manufacturers/${product.manufacturer.slug}.png?resize&size=50`)
                        "
                        contain
                        width="50px"
                    />
                </div>
            </div>
            <price
                class="product-prices-wrapper text-no-wrap display-flex"
                :price-num="product.priceNum"
                :is-discount="product.isDiscount"
                :discount-price="product.discountPrice"
                :piece="product.piece"
                :weight="product.weight"
                :minimum-order="product.minimumOrder"
            />
            <div itemprop="name" class="product-name mb-0">
                {{ product.name + (halal ? "&nbsp; халяль" : "") }}
            </div>
            <product-add
                :id="product._id || product.id"
                ref="productCardActions"
                class="product-busket-wrap"
                is-card
                @add="handleAdd"
            />
            <meta
                itemprop="description"
                :content="`${product.name} купить в Альянс Фуд за ${product.priceNum}`"
            />
        </template>
        <product-sceleton v-else :boilerplate="!loading" />
    </v-card>
</template>

<script>
import ProductSceleton from '~/components/ProductSceleton';
export default {
    components: { ProductSceleton },
    props: {
        product: [Object, Boolean],
        halal: {
            type: Boolean,
            default: false,
        },
        grandparent: {
            type: String,
            default: 'catalog',
        },
        parent: {
            type: String,
            default: '',
        },
        loading: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            imageBaseUrl: process.env.imageBaseUrl,
        };
    },
    computed: {
        isValue() {
            return Boolean(this.product);
        },
        isDiscount() {
            return this.product.isDiscount && this.product.discountPrice;
        },
        price() {
            return this.isDiscount ?
                this.product.discountPrice :
                this.product.priceNum;
        },
        imgUrl() {
            if (!this.product.img) {
                return '/no-image.png';
            }
            if (!this.product.img.formats) {
                return this.imageBaseUrl + this.product.img.url;
            }
            return this.imageBaseUrl + this.product.img.formats.thumbnail.url;
        },
    },
    methods: {
        async handleAdd() {
            await this.$store.dispatch('cart/addToCart', this.product);
        },
        cardClick(event) {
            if (this.$refs.productCardActions.$el.contains(event.target)) {
                event.preventDefault();
            }
        },
    },
};
</script>

<style lang="scss" scoped>
    .product-wrapper {
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        min-height: 290px;
        padding: 10px;
        flex-direction: column;

        @include lg {
            min-height: 300px;
        }

        &:before {
            color: white;
        }

        .product-prices-wrapper {
            --font-size: 16px;
            --reduced-font-size: 12px;
            --additional-price-display: flex;

            justify-content: space-between !important;
            min-height: 26px;
            white-space: nowrap;

            @include md {
                --additional-price-display: none;
            }

            @include lg {
                --font-size: 18px;
            }
        }

        .product-busket-wrap {
            --quantity-border-radius: 0;
            --quantity-justify: space-evenly;
            --product-add-background: #f2f2f2;
            --product-add-box-shadow: none;
            --product-add-font-size: 12px;

            height: 40px;
            margin-top: 10px;
            background-color: #f2f2f2;
        }

        .product-price {
            font-size: 1.1rem;
            font-weight: 700;
            color: #333;
        }

        .product-name {
            overflow: hidden;
            height: 40px;
            font-size: 15px;
            font-weight: 500;
            line-height: 20px;
            color: #333;
        }

        .product-card-img-wrap {
            position: relative;
            height: var(--card-img-heigth);
            margin-bottom: 10px;

            --card-img-heigth: 140px;

            @include lg {
                --card-img-heigth: 150px;
            }

            .product-img {
                height: var(--card-img-heigth);
            }

            .product-card-mini-imgs {
                position: absolute;
                right: 10px;
                bottom: 0;
                display: flex;

                img {
                    width: 3rem;
                    height: 3rem;
                    object-fit: contain;
                }
            }
        }
    }
</style>
