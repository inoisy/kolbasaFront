<template>
    <div
        id="sidebarContent"
        ref="sidebarContent"
        v-scroll="onScroll"
        v-resize="onResize"
        class="sidebarContent"
        :class="fixedTop ? 'fixed-top' : ''"
        :style="!breakpoint ? `max-height: ${sidebar.maxHeight}px;` : ''"
    >
        <slot></slot>
    </div>
</template>

<script>
export default {
    data() {
        return {
            offsetTop: 0,
            sidebar: {
                windowScrollTop: 0,
                offsetHeight: 0,
                bottomOffset: 1000,
            },
        };
    },
    computed: {
        breakpoint() {
            if (!this.$vuetify.breakpoint) {
                return false;
            }
            return this.$vuetify.breakpoint.smAndDown;
        },
        fixedTop() {
            return (
                !this.breakpoint &&
                this.sidebar.windowScrollTop > this.sidebar.offsetHeight &&
                this.sidebar.bottomOffset > 0
            );
        },
    },
    mounted() {
        const elem = this.$refs.sidebarContent ?
            this.$refs.sidebarContent.parentElement :
            null;
        this.sidebar.windowScrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
        this.sidebar.offsetHeight = elem.offsetTop;
        this.calculateSidebar();
    },
    methods: {
        onResize() {
            const elem = this.$refs.sidebarContent ?
                this.$refs.sidebarContent.parentElement :
                null;
            this.sidebar.offsetHeight = elem.offsetTop;
            this.calculateSidebar();
        },
        calculateSidebar() {
            const elem = this.$refs.sidebarContent ?
                this.$refs.sidebarContent.parentElement :
                null;
            const bottomOffset = elem.getBoundingClientRect().bottom - 85;
            const clientHeight = window.innerHeight - 85;
            this.sidebar.maxHeight =
                bottomOffset > clientHeight ? clientHeight : bottomOffset;
            this.sidebar.bottomOffset = bottomOffset;
        },
        onScroll() {
            if (this.breakpoint) {
                return;
            }
            this.sidebar.windowScrollTop =
                window.pageYOffset || document.documentElement.scrollTop;
            this.calculateSidebar();
        },
    },
};
</script>

<style lang="scss" scoped>
    .sidebarContent {
        width: 100%;

        &::-webkit-scrollbar {
            width: 16px;
        }

        &::-webkit-scrollbar-track {
            box-shadow: inset 0 0 5px grey;
            border-radius: 10px;
        }

        &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            background-color: darkgrey;
            outline: 1px solid slategrey;
        }
    }

    .fixed-bottom {
        position: fixed;
        overflow-y: auto;
        width: inherit;
        height: 100%;
    }

    .fixed-top {
        position: fixed;
        overflow-y: auto;
        width: inherit;
        height: 100%;
    }

    @media (min-width: 960px) {
        .fixed-top,
        .fixed-bottom {
            top: 80px;
        }
    }
</style>
