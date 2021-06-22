<template>
    <v-slide-group class="slider-wrapper">
        <v-slide-item v-for="(item, index) in items" :key="`multi-slide${index}`">
            <nuxt-link
                :to="`/manufacturers/${item.slug}`"
                :title="item.name"
                class="pa-3"
            >
                <v-img
                    contain
                    class="manuf-img"
                    :src="
                        require(`~/assets/images/manufacturers/${item.slug}.png?resize&size=200`)
                    "
                    :alt="item.name"
                    :title="item.name"
                />
            </nuxt-link>
        </v-slide-item>
    </v-slide-group>
</template>

<style lang="scss" scoped>
    .slider-wrapper {
        ::v-deep .v-slide-group__next {
            position: absolute;
            top: 0;
            right: -52px;
            bottom: 0;
        }

        ::v-deep .v-slide-group__prev {
            position: absolute;
            top: 0;
            bottom: 0;
            left: -52px;
        }
    }

    .manuf-img {
        width: 80px;
        height: 80px;
        transform: perspective(1px);
        transition: all .2s;
        filter: saturate(.5);

        &:hover {
            transform: scale(1.05);
            filter: none;
        }
    }

    @media (min-width: 576px) {
        .manuf-img {
            width: 100px;
            height: 100px;
        }
    }

    @media (min-width: 1199px) {
        .manuf-img {
            width: 120px;
            height: 120px;
        }
    }
</style>

<script>
export default {
    props: ['items'],
    data() {
        return {
            imageBaseUrl: process.env.imageBaseUrl,
        };
    },
};
</script>
