<template>
    <div :class="$style.pricesWrapper">
        <div
            :class="$style.priceWrapper"
            itemprop="offers"
            itemscope
            itemtype="http://schema.org/Offer"
        >
            <div :class="$style.priceInner">
                <div
                    v-if="priceObject.isPrice"
                    :class="[$style.price, priceObject.isDiscount && $style.accent]"
                    class="d-inline-flex"
                >
                    <span itemprop="price" v-text="priceObject.price" />
                    <span itemprop="priceCurrency" content="RUB">&#8381;</span>
                </div>
                <div
                    v-if="priceObject.isDiscount"
                    :class="priceObject.isDiscount && $style.discount"
                    class="d-inline-flex ml-2"
                >
                    <span>{{ priceNum }}</span>
                    <span
                        :class="$style.priceCurrency"
                        itemprop="priceCurrency"
                        content="RUB"
                    >
                        &#8381;
                    </span>
                </div>
                <span
                    v-if="priceObject.isPrice && weight"
                    class="pl-1"
                    :class="$style.weight"
                >
                    за&nbsp;{{ weight }}&nbsp;{{ piece ? "шт." : "кг." }}
                </span>
            </div>
            <div
                v-if="priceObject.isDiscount"
                :class="$style.discountPriceProcent"
                class="ml-1"
            >
                -{{ priceObject.discountPriceProcent }}%
            </div>
        </div>
        <div
            v-if="minimumOrder > 1"
            :class="[$style.priceWrapper, $style.additionalPrice]"
        >
            <div :class="$style.price">
                <span :class="$style.price">
                    {{ Math.round(priceObject.price * minimumOrder) }}
                </span>
                <span :class="$style.priceCurrency">&#8381;</span>
            </div>

            <span :class="$style.weight">&nbsp;за&nbsp;{{ minimumOrder }}&nbsp;{{
                piece ? "шт." : "кг."
            }}</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        minimumOrder: {
            type: Number,
            default: 1,
        },
        isDiscount: {
            type: Boolean,
            default: false,
        },
        priceNum: {
            type: Number,
            default: null,
        },
        discountPrice: {
            type: String,
            default: null,
        },
        piece: {
            type: Boolean,
            default: false,
        },
        weight: {
            type: String,
            default: null,
        },
    },
    computed: {
        priceObject() {
            const object = {
                isDiscount: this.isDiscount && Boolean(this.discountPrice),
            };


            if (object.isDiscount) {
                object.discountPriceProcent = Math.round((100 * (this.priceNum - this.discountPrice)) / this.priceNum);
                object.price = this.discountPrice;
            } else {
                object.price = this.priceNum;
            }
            object.isPrice = Boolean(object.price);

            return object;
        },
    },
};
</script>

<style lang="scss" scoped module>
    .pricesWrapper {
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex-wrap: wrap;

        .priceWrapper {
            display: flex;
            align-items: flex-end;
            flex-wrap: wrap;
            margin-bottom: 10px;
            font-weight: 500;
            line-height: 1;
            color: $black;

            .priceInner {
                display: inline-flex;
                align-items: flex-end;
            }

            .discount {
                text-decoration: line-through;
                font-size: calc(var(--font-size) - 2px);
                color: rgba($black, .6);
            }

            .noPrice {
                font-size: 1.5rem;
            }

            .price {
                display: inline-flex;
                font-size: var(--font-size);
                font-weight: 700;

                &.accent {
                    font-weight: bold;
                    color: $accent;
                }
            }

            .weight {
                font-size: var(--reduced-font-size);
            }

            .discountPriceProcent {
                display: inline-flex;
                align-items: center;
                height: calc(var(--reduced-font-size) + 8px);
                padding: 0 calc(var(--reduced-font-size) / 2);
                border-radius: 9999px;
                border-color: $accent !important;
                background-color: $accent !important;
                font-size: var(--reduced-font-size);
                color: $white;
            }

            &.additionalPrice {
                display: var(--additional-price-display);
            }
        }
    }
</style>
