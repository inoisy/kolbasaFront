<template>
    <div
        class="header-wrapper d-flex"
        style="background-image: url(/images/promo_crop.jpg);"
    >
        <!-- load &&  -->
        <v-container class="header-inner"
                     style="padding: 0 24px;"
                     fill-height
                     fluid
        >
            <div class="top-slot-wrapper">
                <breadcrumbs-sceleton v-if="!load" :boilerplate="!isLoading" />
                <breadcrumbs
                    v-else
                    :items="breadcrumbs"
                    large
                    class="breadcrumbs-wrap"
                />
            </div>
            <slot name="header">
                <div class="header-text-wrapper">
                    <h1 class="header-text">
                        <span
                            v-if="title"
                            :style="isLoading && 'visibility: hidden'"
                            v-text="title"
                        />
                        <v-skeleton-loader
                            v-if="isLoading"
                            :class="
                                !!title
                                    ? 'absolute-header-sceleton'
                                    : 'relative-header-sceleton'
                            "
                            dark
                            type="heading"
                            :boilerplate="false"
                        />
                    </h1>
                </div>
            </slot>

            <div class="bottom-slot-wrapper" style="width: 100%; min-width: 100%;">
                <slot name="bottom" />
            </div>
        </v-container>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            default: '',
        },
        breadcrumbs: {
            type: Array,
            default: () => [],
        },
        fluid: {
            type: Boolean,
            default: false,
        },
        load: {
            type: Boolean,
            default: true,
        },
        isLoading: {
            type: Boolean,
            default: false,
        },
    },
    // data() {
    //   return {
    //     isLoading: true,
    //     load: false,
    //   };
    // },
};
</script>
<style lang="scss" scoped>
    .top-slot-wrapper {
        display: flex;
        align-items: center;
        min-height: 100px;
        padding-top: 24px;
        padding-bottom: 70px;
    }

    .bottom-slot-wrapper {
        // max-width: 100%;
        // width: 100%;
        display: flex;
        min-height: 100px;
        padding-top: 30px;
    }

    .absolute-header-sceleton {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        display: flex;

        ::v-deep .v-skeleton-loader__heading {
            width: 100% !important;
            height: 85% !important;
            margin-top: auto;
            // width: 100%;
            // height: 100%;
            margin-bottom: auto !important;
        }
    }

    .relative-header-sceleton {
        display: inline-flex !important;
        width: 300px !important;
        height: 100% !important;

        ::v-deep .v-skeleton-loader__heading {
            width: 100% !important;
        }
    }

    .breadcrumbs-wrap {
        text-align: center;
    }

    .header-wrapper {
        position: relative;
        background-color: #131313;
        background-position: 70% center;
        background-repeat: no-repeat;
        background-size: cover;

        @include md {
            background-position: center;
        }

        .header-inner {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: nowrap;
            width: 100%;
            max-width: 100%;
            height: 100%;
            min-height: 400px;
            padding: 0 24px 0 24px;
            flex-direction: column;
            // @include md {
            //   min-height: 450px;
            // }
            .header-text-wrapper {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                // @include center;
                // min-width: 73%;
                min-height: 180px;
                text-align: center;

                .header-text {
                    position: relative;
                    display: inline;
                    text-align: center;
                    font-size: 2.2rem;
                    line-height: 1.2;
                    color: $white;
                    //       align-items: center;
                    // display: inline-flex;
                    // justify-content: center;
                    @include sm {
                        font-size: 2.7rem;
                    }

                    @include md {
                        font-size: 3rem;
                    }

                    @include lg {
                        font-size: 3.5rem;
                    }
                }
            }
        }
    }

</style>
