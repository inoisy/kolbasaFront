<template>
    <div :class="$style.chipItemWrapper">
        <nuxt-link
            :style="!isData && 'visibility: hidden'"
            :class="[$style.chipItem, disabled && $style.chipDisabled]"
            :exact-active-class="$style.chipSelected"
            exact
            :to="{ query: query }"
            @click.native="change(item)"
        >


            {{ text }}
        </nuxt-link>
        <v-skeleton-loader
            v-if="!isData"
            :class="$style.chipItemSceleton"
            class="chip-item-sceleton"
            type="chip"
            :boilerplate="boilerplate"
        />
    </div>
</template>

<script>
export default {
    props: {
        text: {
            type: String,
            required: true,
        },
        filterSlug: {
            type: String,
            required: true,
        },
        item: {

            required: true,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        boilerplate: {
            type: Boolean,
            default: true,
        },
        isData: {
            type: Boolean,
            default: true,
        },
    },
    computed: {
        query() {
            return this.item ? { [this.filterSlug]: this.item.slug } : false;
        },
    },
    methods: {
        change(item) {
            this.$emit('change', item);
        },
    },
};
</script>
<style lang="scss" scoped>
    .chip-item-sceleton {
        ::v-deep .v-skeleton-loader__chip {
            width: 100% !important;
            height: 100% !important;
        }
    }
</style>
<style lang="scss" scoped module>
    .chipItemWrapper {
        position: relative;
        height: 30px;
        margin: 3px 8px 3px 0;
        border-radius: 4px;

        .chipSelected {
            background-color: #4a4a4a !important;
            color: #f5f5f5 !important;
        }

        .chipDisabled {
            opacity: .4;
            pointer-events: none;
            user-select: none;
        }

        .chipItemSceleton {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 0;
            width: 100%;
            height: 100%;
        }

        .chipItem {
            --font-size: 12px;
            --padding-y: 8px;

            @include md {
                --font-size: 13px;
            }

            position: relative;
            z-index: 3;
            overflow: hidden;
            display: inline-block;
            max-width: 300px;
            height: 30px;
            padding: calc((30px - var(--font-size)) / 2) var(--padding-y);
            border-radius: 4px;
            background-color: $white;
            text-decoration: none;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: var(--font-size);
            line-height: 1;
            color: $black;

            &:hover {
                background-color: $black;
                color: $white;
            }
        }
    }
</style>
