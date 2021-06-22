<template>
    <div>
        <LazyHydrate when-idle>
            <page-header-simple title="Каталог" :breadrumbs="breadrumbs" />
        </LazyHydrate>
        <div class="background-with-transparent">
            <v-container grid-list-lg class="py-12">
                <template v-for="(category, index) in categories">
                    <LazyHydrate
                        v-if="category.children.length === 0"
                        :key="index"
                        when-visible
                    >
                        <vertical-card
                            :item="category"
                            type="catalog"
                            class="mb-10 d-block"
                        />
                    </LazyHydrate>
                    <div
                        v-else
                        :key="index"
                        class="pa-3 mb-10 pb-4 pl-4"
                        style=" border-radius: 10px; border: 1px solid #c1c1c1;"
                    >
                        <nuxt-link
                            :to="`/catalog/${category.slug}`"
                            class="mb-6 d-block category-text heading-font font-weight-medium mb-0 primary--text fs-1-5 underline-on-hover"
                            :title="category.name"
                        >
                            {{ category.name }}
                        </nuxt-link>
                        <LazyHydrate
                            v-for="child in category.children"
                            :key="child.id"
                            when-visible
                        >
                            <vertical-card
                                class="catalog-card layout wrap mt-3"
                                :item="child"
                                type="catalog"
                            />
                        </LazyHydrate>
                    </div>
                </template>
            </v-container>
        </div>
    </div>
</template>

<script>
import LazyHydrate from 'vue-lazy-hydration';

import gql from 'graphql-tag';

export default {
    components: { LazyHydrate },
    async asyncData(ctx) {
        const client = ctx.app.apolloProvider.defaultClient;
        const { data: categoriesData } = await client.query({
            query: gql`
        {
          categories(sort: "name:asc") {
            id
            name
            slug
            description
            parent {
              id
            }
            children {
              id
              name
              slug
              description
              img {
                url
              }
            }
            img {
              url
            }
          }
        }
      `,
        });
        return {
            categories: categoriesData.categories
                .filter(item => item.parent.length === 0)
                .sort((a, b) => {
                    if (a.children.length > b.children.length) {
                        return 1;
                    }
                    if (a.children.length < b.children.length) {
                        return -1;
                    }
                    return 0;
                }),
        };
    },
    data() {
        return {
            imageBaseUrl: process.env.imageBaseUrl,
            breadrumbs: [
                {
                    to: '/',
                    text: 'Главная',
                },
                {
                    to: '/catalog',
                    text: 'Каталог',
                },
            ],
        };
    },
    head() {
        return {
            title: 'Каталог. Колбаса и другие мясные изделия оптом.',
            meta: [
                {
                    hid: 'description',
                    name: 'description',
                    content:
                        'Каталог Альянс Фуд. Колбаса и другие мясные изделия оптом по ценам производителя. Самовывоз со склада в Москве. Доставка по РФ',
                },
            ],
        };
    },
};
</script>
