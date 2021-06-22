<template>
    <div>
        <v-btn
            id="sort"
            style="position: relative;"
            block
            :disabled="!isData || !isMounted"
        >
            <v-icon left dark>{{ sortIcon }}</v-icon>
            <span :style="!isData || !isMounted ? 'visibility: hidden' : ''">
                {{ sort.title }}
            </span>
        </v-btn>

        <v-menu v-if="isData && isMounted"
                activator="#sort"
                offset-y
        >
            <v-list>
                <v-list-item
                    v-for="(item, index) in sortItems"
                    :key="`sort-${index}`"
                    :disabled="sort.title === item.title"
                    @click="change(item)"
                >
                    <v-list-item-title>
                        {{ item.title }}
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<script>
import { mdiSortVariant } from '@mdi/js';

export default {
    props: {
        isData: {
            type: Boolean,
            default: true,
        },
        boilerplate: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            sortIcon: mdiSortVariant,
            sortItems: this.$store.state.category.sortItems,
            isMounted: false,
        };
    },
    computed: {
        sort() {
            return this.$store.state.category.sort;
        },
    },
    mounted() {
        this.isMounted = true;
    },
    methods: {
        change(item) {
            if (this.sort.value !== item.value) {
                this.$emit('change', item);
            }
        },
    },
};
</script>
