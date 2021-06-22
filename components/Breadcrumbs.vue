<template>
    <ul :class="[$style.breadcrumbs, dark && $style.dark, large && $style.large]">
        <!-- {{
      itemsMapped
    }} -->
        <li
            v-for="item in itemsMapped"
            :key="item.to"
            :class="$style.breadcrumbsItem"
        >

            <nuxt-link
                v-if="item.to"
                :class="$style.breadcrumbsItemLink"
                :to="item.to"
                nuxt
                exact
                :title="item.text"
            >
                {{ item.text }}
            </nuxt-link>
            <div
                v-else
                :class="[$style.breadcrumbsItemLink, $style.breadcrumbsItemDisabled]"
            >
                {{ item.text }}
            </div>
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        items: {
            type: Array,
            default: () => [],
        },
        dark: {
            type: Boolean,
            default: false,
        },
        large: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        itemsMapped() {
            const length = this.items.length - 1;


            return this.items.map((item, index) => {
                if (index === length) {
                    return {
                        text: item.text,
                    };
                }
                return item;
            });
        },
        length() {
            return this.items.length - 1;
        },
    },
};
</script>

<style style lang="scss" scoped module>
    .breadcrumbs {
        --delimiter-padding: 2px;
        --font-size: 12px;

        @include md {
            font-size: var(--font-size);

            --delimiter-padding: 5px;
        }

        padding-left: 0;
        list-style-type: none;
        font-size: var(--font-size);

        &.large {
            --font-size: 14px;
            --delimiter-padding: 3px;

            @include md {
                --font-size: 16px;
                --delimiter-padding: 8px;
            }
        }

        .breadcrumbsItem {
            display: inline;

            &:not(:last-child) {
                &:after {
                    content: "/";
                    display: inline;
                    padding: 0 var(--delimiter-padding);
                    font-size: var(--font-size);
                    color: rgba($white, .5);
                }
            }

            .breadcrumbsItemLink {
                display: inline;
                text-align: center;
                text-decoration: none;
                color: $white;

                &:hover {
                    color: $accent;
                }
            }

            .breadcrumbsItemDisabled {
                color: rgba($white, .5);
                pointer-events: none;
            }
        }
    }

    .dark.breadcrumbs {
        .breadcrumbsItem {
            color: $darkLink;

            &:after {
                color: rgba($darkLink, .45);
            }

            .breadcrumbsItemLink {
                color: $darkLink;

                &:hover {
                    color: $accent;
                }
            }

            .breadcrumbsItemDisabled {
                color: rgba($darkLink, .5);
            }
        }
    }
</style>
