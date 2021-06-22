<template>
    <div>
        <LazyHydrate when-idle>
            <page-header-simple title="Производители" :breadrumbs="breadrumbs" />
        </LazyHydrate>
        <div class="background-with-transparent">
            <v-container class="py-16" grid-list-lg>
                <LazyHydrate
                    v-for="(item, index) in manufacturers"
                    :key="`manufacturer-${index}`"
                    when-visible
                >
                    <vertical-card :item="item"
                                   type="manufacturers"
                                   class="mb-6"
                    />
                </LazyHydrate>
            </v-container>
        </div>
    </div>
</template>


<script>
import gql from 'graphql-tag';
import LazyHydrate from 'vue-lazy-hydration';

export default {
    components: { LazyHydrate },
    async asyncData({ app }) {
        const {
            data: manufacturerData,
        } = await app.apolloProvider.defaultClient.query({
            query: gql`
        query ManufacturersQuery {
          manufacturers(sort: "name:asc", limit: 999) {
            name
            slug
            description
            img {
              url
            }
          }
        }
      `,
        });
        return {
            manufacturers: manufacturerData.manufacturers,
        };
    },
    head() {
        return {
            title: 'Производители (мясокомбинаты)',
        };
    },
    computed: {
        breadrumbs() {
            return [
                {
                    to: '/',
                    text: 'Главная',
                },
                {
                    to: '/manufacturers',
                    text: 'Производители',
                },
            ];
        },
    },
};
</script>
