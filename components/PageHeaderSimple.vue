<template>
    <div
        class="header-wrapper d-flex"
        style="background-image: url(/images/promo_crop.jpg);"
    >
        <v-container class="header-inner fluid"
                     fill-height
                     fluid
        >
            <slot name="breadcrumbs">
                <breadcrumbs
                    v-if="breadrumbs.length"
                    :items="breadrumbs"
                    large
                    class="breadcrumbs-wrap pt-6 py-3"
                />
            </slot>
            <slot name="header">
                <div class="header-text-wrapper">
                    <h1 class="header-text" v-text="title">

                    </h1>
                </div>
            </slot>
            <slot name="bottom" />
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
        breadrumbs: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            isLoading: true,
        };
    },
};
</script>
<style lang="scss" scoped>
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
            margin-bottom: auto !important;
        }
    }

    .relative-header-sceleton {
        display: inline-flex !important;
        width: 300px !important;
        height: 100% !important;
    }

    .breadcrumbs-wrap {
        padding-top: 24px;
        padding-bottom: 12px;
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
            height: 400px;
            min-height: 400px;
            padding-right: 24px !important;
            padding-left: 24px !important;
            flex-direction: column;

            .header-text-wrapper {
                @include center;

                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                text-align: center;

                .header-text {
                    position: relative;
                    display: inline;
                    width: 100%;
                    margin-top: 0 !important;
                    margin-bottom: 0 !important;
                    padding-right: 12px;
                    padding-left: 12px;
                    text-align: center;
                    font-size: 2.2rem;
                    line-height: 1.2;
                    color: $white;

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
