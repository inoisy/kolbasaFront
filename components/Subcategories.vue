<template>
    <div :class="$style.subcategoriesWrapper">
        <nuxt-link
            v-for="child in subcategories"
            :key="`subcategory-${child.id}`"
            v-ripple
            :to="`/catalog/${child.slug}`"
            :class="$style.subcategory"
            :exact-active-class="$style.subcategorySelected"
            :title="child.name"
        >

            {{ child.name }}

        </nuxt-link>
    </div>
</template>

<script>
export default {
    props: {
        subcategories: {
            type: Array,
            required: true,
        },
    },
};
</script>

<style lang="scss" scoped module>
    .subcategoriesWrapper {
        display: flex;
        justify-content: center;
        flex-flow: wrap-reverse;
        max-width: 100%;

        .subcategory {
            --height: 36px;
            --font-size: 12px;
            --padding: 16px;

            @include sm {
                --height: 38px;
                --font-size: 14px;
                --padding: 19px;
            }

            @include md {
                --height: 44px;
                --font-size: 15px;
                --padding: 24px;
            }

            @include lg {
                --height: 48px;
                --font-size: 16px;
            }

            position: relative;
            overflow: hidden;
            display: inline-block;
            min-width: 64px;
            max-width: 100%;
            height: var(--height);
            padding: calc((var(--height) - var(--font-size)) / 2) var(--padding);
            border-radius: 4px !important;
            text-decoration: none;
            text-overflow: ellipsis;
            text-transform: uppercase;
            white-space: nowrap;
            font-size: var(--font-size);
            font-weight: 500;
            line-height: 1;
            color: $white;
            transition-duration: .28s;
            transition-property: box-shadow, opacity;
            transition-timing-function: cubic-bezier(.4, 0, .2, 1);

            &:before {
                content: "";
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                border-radius: inherit;
                background-color: currentColor;
                opacity: 0;
                pointer-events: none;
            }

            &:hover {
                &:before {
                    opacity: .12;
                }
            }
        }

        .subcategorySelected {
            &:before {
                opacity: .12;
            }
        }
    }
</style>
