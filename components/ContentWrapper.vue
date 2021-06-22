<template >
    <div class="contentWrapper" v-html="content" />
</template>
<script>
export default {
    props: {
        content: {
            type: String,
            default: '',
        },
    },
};
</script>
<style lang="scss" scoped >
    .contentWrapper {
        color: $black;

        :last-child {
            margin-bottom: 0;
        }

        ::v-deep a {
            text-decoration: none;
            color: darken($accent, 20%);

            &:hover {
                text-decoration: underline;
                color: $accent;
            }
        }

        ::v-deep h2 {
            margin-bottom: 2rem;
        }

        ::v-deep h3 {
            margin-bottom: 1rem;
        }

        ::v-deep h4 {
            margin-bottom: .7rem;
        }

        ::v-deep ul,
        ol {
            li {
                margin-bottom: 1rem;
            }
        }

        ::v-deep ol {
            padding-left: 40px;
            list-style: none;
            counter-reset: my-awesome-counter;

            li {
                position: relative;
                margin-bottom: 1rem;
                counter-increment: my-awesome-counter;

                &:before {
                    $size: 1.8rem;

                    content: counter(my-awesome-counter);
                    position: absolute;
                    top: 0;
                    left: calc(-1 * #{$size} - 10px);
                    width: #{$size};
                    height: #{$size};
                    border-radius: 50%;
                    background: $black;
                    text-align: center;
                    font-size: 1.1rem;
                    font-weight: bold;
                    line-height: #{$size};
                    color: white;
                    box-shadow: 1px 1px 0 #999;
                }
            }
        }

        ::v-deep ul {
            margin-bottom: 1.5rem;
            padding-left: 5px !important;
            list-style: square inside url("/bullet_min.svg");
        }

        ::v-deep h2:not(:first-child) {
            margin-top: 3rem;
        }

        ::v-deep figure.table {
            overflow-x: auto;

            table {
                width: calc(100% - 2px);
                max-width: 100%;
            }
        }

        ::v-deep table {
            border-style: hidden;
            border-spacing: 0;
            border-collapse: collapse;

            td {
                height: 36px;
                padding-top: 5px;
                padding-right: 16px;
                padding-bottom: 5px;
                border: thin solid #e0e0e0;

                @include md {
                    height: 48px;
                }

                &:not(:first-child),
                &:only-child:not([rowspan]) {
                    padding-right: 16px;
                    padding-left: 16px;
                }
            }
        }
    }
</style>
