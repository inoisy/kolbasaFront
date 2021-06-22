<template>
    <v-card
        ripple
        flat
        color="transparent"
        class="category-wrapper"
        :to="`/catalog/${item.slug}`"
        :title="item.name"
    >
        <div class="category-img-wrapper">
            <v-img
                v-if="item.img"
                class="category-img ma-auto mb-2"
                contain
                :src="imageBaseUrl + item.img.url"
                :alt="item.name"
                :title="item.name"
            />
        </div>
        <div class="heading-font category-text text-center mb-0 primary--text">
            {{ item.name }}
        </div>
    </v-card>
</template>
<style lang="scss" scoped>
    .category-wrapper {
        display: flex;
        flex-direction: column;
        height: 100%;

        .category-text {
            text-transform: uppercase;
            font-size: 1rem;
            font-weight: bold;
            line-height: 1.2;
            transition: all .2s;
        }

        .category-img-wrapper {
            .category-img {
                display: block;
                max-width: 100%;
                height: 75px;
                margin: auto;
                transition: all .2s;
                filter: grayscale(50%);
                object-fit: contain;
            }
        }

        &:hover {
            .category-text {
                color: #d50000 !important;
                transition: all .3s ease-in-out;
            }

            .category-img-wrapper {
                .category-img {
                    transform: scale(1.05);
                    transition: all .3s ease-in-out;
                    filter: none !important;
                }
            }
        }
    }

    @media (min-width: 600px) {
        .category-wrapper {
            .category-img-wrapper {
                .category-img {
                    height: 100px;
                }
            }
        }
    }

    @media (min-width: 960px) {
        .category-wrapper {
            .category-img-wrapper {
                .category-img {
                    height: 130px;
                }
            }
        }
    }
</style>
<script>
export default {
    props: ['item'],
    data() {
        return {
            imageBaseUrl: process.env.imageBaseUrl,
        };
    },
};
</script>
