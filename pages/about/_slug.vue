<template>
    <div>
        <LazyHydrate when-idle>
            <page-header-simple :title="title" :breadrumbs="breadrumbs" />
        </LazyHydrate>
        <div class="background-with-transparent">
            <v-container grid-list-lg class="pt-16 pb-15">
                <v-row no-gutters>
                    <v-col class="pa-3" cols="12">
                        <LazyHydrate never>
                            <content-wrapper v-html="page.content" />
                        </LazyHydrate>
                    </v-col>
                </v-row>
            </v-container>
        </div>
    </div>
</template>

<script>
import gql from 'graphql-tag';
import LazyHydrate from 'vue-lazy-hydration';


const pageName = 'Доставка';
export default {
    components: { LazyHydrate },
    async asyncData({
        app: {
            apolloProvider: { defaultClient },
        },
        params,
    }) {
        // console.log("🚀 ~ file: _slug.vue ~ line 79 ~ params.slug", params.slug);

        const {
            data: {
                pages: [page],
            },
        } = await defaultClient.query({
            query: gql`
        query PageQuery($slug: String!) {
          pages(where: { slug: $slug }) {
            content
            header
            metaDescription
          }
        }
      `,
            variables: {
                slug: params.slug,
            },
        });
        // console.log("🚀 ~ file: _slug.vue ~ line 70 ~ page", page);

        // console.timeEnd("fetchAsyncData");
        return {
            page,
        };
    },
    head() {
        return {
            title: this.title,
            ...(this.page.metaDescription ?
                {
                    meta: [
                        {
                            hid: 'description',
                            name: 'description',
                            content: this.page.metaDescription,
                        },
                    ],
                } :
                null),
        };
    },

    computed: {
        title() {
            return (this.page && this.page.header) || pageName;
        },
        breadrumbs() {
            return [
                {
                    to: '/',
                    text: 'Главная',
                },
                {
                    to: '/about',
                    text: 'О компании',
                },
                {
                    //   to: "/delivery",
                    text: this.title,
                },
            ];
        },
    },
};
</script>
