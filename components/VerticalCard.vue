<template>
    <v-card
        :class="$style.cardWrapper"
        :to="`/${type}/${item.slug}`"
        color="white"
        hover
        ripple
        class="pa-3 d-flex"
        :title="item.name"
    >
        <div class="xs12 md4 lg3 flex" :class="$style.cardImgWrapper">
            <v-img
                :class="$style.cardImg"
                class="d-block ma-auto"
                width="250px"
                max-width="100%"
                contain
                :src="item.img ? imageBaseUrl + item.img.url : '/no-image.png'"
                :alt="item.name"
                :title="item.name"
            />
        </div>

        <div class="xs12 md8 lg9 flex" :class="$style.cardTextWrapper">
            <h2 class="card-header mb-3">{{ item.name }}</h2>
            <div class="cardText mb-0" v-text="item.description"></div>
        </div>
    </v-card>
</template>

<script>
export default {
    props: ['item', 'type'],
    data() {
        return {
            imageBaseUrl: process.env.imageBaseUrl,
        };
    },
};
</script>

<style lang="scss" scoped module>
    .cardWrapper {
        flex-wrap: wrap;
        border-radius: 10px;

        .cardImgWrapper {
            display: flex;
            max-width: 250px;
            min-height: 140px;
            margin-top: 10px;
            margin-right: auto;
            margin-bottom: 20px;
            margin-left: auto;

            .cardImg {
                height: 140px;
            }

            @include md {
                margin-top: 0;
                margin-bottom: 0;
                padding: 15px 45px 15px 25px;
            }
        }

        .cardTextWrapper {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 5px;

            @include md {
                padding: 15px 45px 15px 25px;
            }

            .cardText {
                max-width: 90%;
            }
        }
    }
</style>
