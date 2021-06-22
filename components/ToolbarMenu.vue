<template>
    <v-menu
        open-on-hover
        offset-y
        left
        :activator="`#${parentSlug}`"
        content-class="menu-inner"
    >
        <v-list color="white"
                :class="isTwoColumns && 'two-columns'"
                dense
        >
            <v-list-item
                v-for="(child, index) in items"
                :key="'list-group' + index"
                :to="`/${parentSlug}/${child.slug}`"
                :title="child.name"
                class="list-item"
            >
                <v-list-item-title>
                    {{ child.name }}
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>
<script>
export default {
    props: {
        items: {
            type: Array,
            default: () => [],
        },
        parentSlug: {
            type: String,
            default: '',
        },
        isTwoColumns: {
            type: Boolean,
            default: false,
        },
    },


};
</script>
<style lang="scss" scoped>
    .menu-inner {
        top: $toolbar-mobile-height !important;

        @include md {
            top: $toolbar-desktop-height !important;
        }
    }

    .two-columns {
        position: relative;
        max-width: 27rem;
        column-count: 2;

        .list-item {
            float: left;
            width: 100%;
            height: 30px !important;
            min-height: 30px !important;
            font-size: 12px;
            page-break-inside: avoid;
            -moz-column-break-inside: avoid;
            break-inside: avoid;
        }

        .list-item-child {
            padding-left: 1rem;
        }
    }
</style>
