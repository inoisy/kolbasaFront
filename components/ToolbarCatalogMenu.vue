<template>
    <v-menu
        v-model="showMenu"
        offset-y
        left
        content-class="catalog-menu-inner"
        :activator="activator"
    >
        <v-list dense>
            <template v-for="(child, index) in items">
                <template v-if="child.children && child.children.length">
                    <v-menu
                        :key="`${child.name}-${index}`"
                        close-delay="50"
                        offset-x
                        open-on-hover
                        right
                        class="catalog-second-level-menu-wrapper"
                        content-class="catalog-second-level-menu-inner"
                    >
                        <template #activator="{ on, attrs }">
                            <v-list-item
                                v-bind="attrs"
                                :to="`/${parentSlug}/${child.slug}`"
                                v-on="on"
                            >
                                <v-list-item-title>{{ child.name }}</v-list-item-title>

                                <div class="ml-auto pl-3">
                                    <v-icon style="transform: rotate(270deg);">

                                        $dropdown
                                    </v-icon>
                                </div>
                            </v-list-item>
                        </template>
                        <template v-if="child.children && child.children.length">
                            <v-list dense>
                                <v-list-item
                                    v-for="(grandChild, index) in child.children"
                                    :key="`${grandChild.name}-${index}`"
                                    :to="`/${parentSlug}/${grandChild.slug}`"
                                >
                                    <v-list-item-title>
                                        {{ grandChild.name }}
                                    </v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </template>
                    </v-menu>
                </template>
                <template v-else>
                    <v-list-item
                        :key="`${child.name}-${index}`"
                        :to="`/${parentSlug}/${child.slug}`"
                    >
                        <v-list-item-title> {{ child.name }}</v-list-item-title>
                    </v-list-item>
                </template>
            </template>
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
            default: 'catalog',
        },
        activator: {
            type: String,
            default: '#catalog',
        },
    },
    data() {
        return {

            showMenu: false,
        };
    },
    watch: {
        '$route.path'() {
            this.showMenu = false;
        },
    },
    beforeDestroy() {
        this.showMenu = false;
    },
};
</script>

<style lang="scss" scoped>
    .catalog-second-level-menu-inner {
        min-width: 210px !important;
        max-width: 280px;
    }

    .catalog-menu-inner {
        min-width: 180px;
        max-width: 280px;
    }
</style>
