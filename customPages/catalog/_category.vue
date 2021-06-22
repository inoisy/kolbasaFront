<template>
    <div>
        <NuxtChild :breadcrumbs-base="breadcrumbs" @close="handleClose" />
        <LazyHydrate when-idle>
            <page-header
                :load="!noLoad"
                :breadcrumbs="breadcrumbs"
                :is-loading="isLoading"
                :title="metaInfo.name"
            >
                <template #bottom>
                    <lazy-subcategories
                        v-if="!noLoad && !!subcategories.length"
                        class="mt-auto"
                        style="width: 100%;"
                        :subcategories="subcategories"
                    />
                </template>
            </page-header>
        </LazyHydrate>
        <div
            id="contentWrapper"
            :class="$style.categoryWrapper"
            class="background-repeat background-fixed"
            :style="isMounted && !noLoad && `background-image: url(/images/bg.jpg)`"
        >
            <div :class="$style.container">
                <LazyHydrate never :trigger-hydration="!noLoad">
                    <div ref="products" :class="$style.products">
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
                                :parent="$route.params.category"
                                :loading="isLoading"
                            />
                        </div>
                        <lazy-products-infinity
                            v-if="isMounted && !noLoad && products.length >= limit"
                            style="width: 100%;"
                            @load="onInfinite"
                        />
                    </div>
                </LazyHydrate>
                <div :class="$style.filters">
                    <div :class="$style.filtersInner">
                        <filtersSort
                            :is-data="!noLoad"
                            :boilerplate="!isLoading"
                            @change="(val) => sortChange(val)"
                        />
                        <lazy-filters
                            v-if="productTypes.length > 1"
                            filter-slug="type"
                            filter-name="виды"
                            :filter-all-disabled="!!manufacturer || !productType"
                            :items="productTypes"
                            :is-data="initialPageData"
                            :boilerplate="!isLoading"
                            @change="(val) => productTypeChange(val)"
                        />

                        <lazy-filters
                            v-if="manufacturers.length > 1"
                            filter-slug="manufacturer"
                            filter-name="производители"
                            :filter-all-disabled="!!productType || !manufacturer"
                            :items="manufacturers"
                            :is-data="initialPageData"
                            :boilerplate="!isLoading"
                            @change="(val) => manufacturerChange(val)"
                        />
                    </div>
                </div>
            </div>
        </div>
        <LazyHydrate v-if="metaInfo.content" never>
            <section class="grey lighten-3">
                <v-container class="py-16">
                    <v-row>
                        <v-col cols="12">
                            <content-wrapper :content="metaInfo.content" />
                        </v-col>
                    </v-row>
                </v-container>
            </section>
        </LazyHydrate>
    </div>
</template>

<script>
import LazyHydrate from 'vue-lazy-hydration';

export default {
    name: 'CategoryMain',
    components: { LazyHydrate },
    loading: false,
    data() {
        const limit = this.$store.state.categoryPage.limit;
        return {
            category: {},
            limit,
            isProductRoute: Boolean(this.$route.params.slug),
            products: new Array(limit).fill(false),
            initialPageData: false,
            isMounted: false,
            isLoading: false,
        };
    },

    async fetch() {
        this.isLoading = true;

        const categoryId = await this.$store.dispatch('categoryPage/changeCategory', this.$route.params.category);

        if (!categoryId) {
            return this.$nuxt.error({
                statusCode: 404,
                message: 'Категория не найдена',
                type: 'catalog',
            });
        }
        if (!this.initialPageData && !this.isProductRoute) {
            await this.$store.dispatch('categoryPage/fetchAndSetFilters', this.$route.query);
            this.products = (
                await Promise.all([
                    this.$store.dispatch('categoryPage/fetchCategoryProducts'),
                    this.$store.dispatch('categoryPage/fetchCategory', categoryId),
                ])
            )[0];

            this.initialPageData = true;
        }
        this.isLoading = false;
    },
    head() {
        if (!this.isProductRoute && Boolean(this.metaInfo) && this.metaInfo.name) {
            return {
                title: this.metaInfo.name,
                meta: [
                    {
                        hid: 'description',
                        name: 'description',
                        content: this.metaInfo.description,
                    },
                ],
            };
        }
    },
    computed: {
        noLoad() {
            return !this.initialPageData && this.isProductRoute;
        },
        breadcrumbs() {
            return this.$store.getters['categoryPage/categoryBreadcrumbs'];
        },

        manufacturer() {
            return this.$store.state.categoryPage.manufacturerSelected;
        },
        manufacturers() {
            if (this.noLoad) {
                return [];
            }
            return this.$store.state.categoryPage.category.manufacturers;
        },
        productType() {
            return this.$store.state.categoryPage.productTypeSelected;
        },

        productTypes() {
            if (this.noLoad) {
                return [];
            }
            return this.$store.state.categoryPage.category.product_types;
        },

        subcategories() {
            if (this.noLoad) {
                return [];
            }
            return this.$store.getters['categoryPage/categorySubcategories'];
        },
        metaInfo() {
            if (this.noLoad) {
                return {};
            }
            return this.$store.getters['categoryPage/categoryMeta'];
        },
    },
    watch: {
        isLoading(val) {
            if (!process.client) {
                return;
            }
            if (val) {
                this.$nuxt.$loading.start();
            } else {
                this.$nuxt.$loading.finish();
            }
        },
        '$route.params.slug'(val) {
            if (val) {
                this.isProductRoute = true;
            } else {
                this.isProductRoute = false;
                if (!this.initialPageData) {
                    this.$fetch();
                }
            }
        },
    },
    mounted() {
        this.isMounted = true;
    },
    methods: {
        async fetchAndRefillProducts() {
            this.isLoading = true;
            this.products = this.products.map(() => false);
            this.products = await this.$store.dispatch('categoryPage/fetchCategoryProducts');
            this.isLoading = false;
        },

        async scrollToProducts() {
            if (this.$vuetify.breakpoint.mobile) {
                return;
            }
            if (this.$refs.products.getBoundingClientRect().top >= 90) {
                return;
            }
            await this.$vuetify.goTo(this.$refs.products, {
                offset: 90,
            });
        },
        async sortChange(item) {
            await this.scrollToProducts();
            await this.$store.dispatch('category/changeSort', item);
            await this.fetchAndRefillProducts();
        },
        async productTypeChange(item) {
            const oldValue = this.productType && this.productType._id;
            const newValue = item && item._id;
            if (oldValue !== newValue) {
                await this.scrollToProducts();
                await this.$store.dispatch('categoryPage/changeProductType', newValue);
                await this.fetchAndRefillProducts();
            }
        },

        async manufacturerChange(item) {
            const oldValue = this.manufacturer && this.manufacturer._id;
            const newValue = item && item._id;
            if (oldValue !== newValue) {
                await this.scrollToProducts();
                await this.$store.dispatch('categoryPage/changeManufacturer', item);
                await this.fetchAndRefillProducts();
            }
        },

        async handleClose() {
            await this.$router.push({
                path: `/catalog/${this.$route.params.category}`,
                query: {
                    ...(this.manufacturer && { manufacturer: this.manufacturer.slug }),
                    ...(this.productType && { type: this.productType.slug }),
                },
            });
        },
        async onInfinite($state) {
            this.isLoading = true;
            const newProducts = await this.$store.dispatch('categoryPage/fetchCategoryProducts', this.products.length);
            if (newProducts && newProducts.length) {
                this.products = [...this.products, ...newProducts];
                await $state.loaded();
            } else {
                await $state.complete();
            }
            this.isLoading = false;
        },
    },
};
</script>
<style lang="scss" scoped>
    .header-sceleton {
        ::v-deep .v-skeleton-loader__text {
            width: 100% !important;
            height: 100% !important;
            margin-bottom: 0 !important;
        }
    }
</style>
<style lang="scss" scoped module>
    .headerSceleton {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }

    .chipsWrapper {
        position: relative;
        display: flex;
        flex: 1 0 auto;
        flex-wrap: wrap;
        max-width: 100%;
        padding: 8px 0;
        transition: .3s cubic-bezier(.25, .8, .5, 1);

        .chipHeader {
            display: flex;
            align-items: center;
            width: 100%;
            height: 48px;
            text-transform: uppercase;
            font-family: $heading-font-family;
            font-size: 16px;
            font-weight: bold;
            color: $black;
        }
    }

    .categoryWrapper {
        --indent: calc(var(--toolbar-height) + 20px);
        --height: calc(100vh - var(--indent) - 20px);

        position: relative;
        max-width: 100%;
        min-height: var(--height);
        $filtersWidthMd: 270px;
        $filtersWidthLg: 320px;

        .container {
            position: relative;
            display: flex;
            width: 100%;
            margin: 0 auto;
            padding: 12px;
            flex-direction: column-reverse;

            @include md {
                flex-direction: row;
            }

            .filters {
                width: 100%;
                padding: 8px;
                padding-left: 12px;

                @include md {
                    width: $filtersWidthMd;
                    min-width: $filtersWidthMd;
                }

                @include lg {
                    width: $filtersWidthLg;
                    min-width: $filtersWidthLg;
                }

                .filtersInner {
                    @include md {
                        @supports ((position: -webkit-sticky) or (position: sticky)) {
                            position: -webkit-sticky;
                            position: sticky;
                            top: var(--indent);
                            overflow-y: auto;
                            max-height: var(--height);

                            &::-webkit-scrollbar {
                                width: 10px;
                            }

                            &::-webkit-scrollbar-track {
                                border-radius: 10px;
                                box-shadow: inset 0 0 5px grey;
                            }

                            &::-webkit-scrollbar-thumb {
                                border-radius: 10px;
                                background-color: darkgrey;
                            }
                        }
                    }
                }
            }

            .products {
                display: flex;
                align-items: flex-start;
                align-content: flex-start;
                flex-grow: 1;
                flex-wrap: wrap;

                @include md {
                    max-width: calc(100% - #{$filtersWidthMd});
                }

                @include lg {
                    max-width: calc(100% - #{$filtersWidthLg});
                }
            }
        }
    }
</style>
