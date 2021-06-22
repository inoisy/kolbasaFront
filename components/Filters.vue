<template>
    <div :class="$style.chipsWrapper">
        <div :class="$style.chipHeader">
            <div style="position: relative;">
                <span :style="!isData && 'visibility: hidden'" v-text="filterName" />
                <v-skeleton-loader
                    v-if="!isData"
                    :class="$style.headerSceleton"
                    class="header-sceleton"
                    type="text"
                    :boilerplate="boilerplate"
                />
            </div>
        </div>

        <filter-item
            :text="`Все ${filterName}`"
            :filter-slug="filterSlug"
            :item="null"
            :disabled="filterAllDisabled"
            :boilerplate="boilerplate"
            :is-data="isData"
            @change="change(null)"
        />
        <!-- @click.native="change(null)" -->
        <!-- <div
      :class="$style.chipItemWrapper"
       :disabled="false"
       filterItems
    > -->
        <!-- @click.native="change(item)" -->
        <filter-item
            v-for="item in items"
            :key="`filter-${filterSlug}-${item._id}`"
            :text="item.name"
            :filter-slug="filterSlug"
            :item="item"
            :boilerplate="boilerplate"
            :is-data="isData"
            @change="change(item)"
        />
    </div>
    <!--</div> -->
    <!-- :boilerplate="boilerplate" -->
    <!-- <div :class="$style.chipItemWrapper"> -->
    <!-- <nuxt-link
        :style="!isData && 'visibility: hidden'"
        :class="[$style.chipItem, filterAllDisabled && $style.chipDisabled]"
        :exact-active-class="$style.chipSelected"
        :to="{ query: false }"
      > -->
    <!-- @click.native="change(null)" -->
    <!--
        Все {{ filterName }}
      </nuxt-link>
      <v-skeleton-loader
        v-if="!isData"
        :class="$style.chipItemSceleton"
        class="chip-item-sceleton"
        type="chip"
        :boilerplate="boilerplate"
      />-->
    <!-- </div>  -->
    <!-- <nuxt-link
        :style="!isData && 'visibility: hidden'"
        :class="$style.chipItem"
        :exact-active-class="$style.chipSelected"
        exact
        :to="{ query: { [filterSlug]: item.slug } }"
        @click.native="change(item)"
      >
        {{ item.name }}
      </nuxt-link>
      <v-skeleton-loader
        v-if="!isData"
        :class="$style.chipItemSceleton"
        class="chip-item-sceleton"
        type="chip"
        :boilerplate="boilerplate"
      /> -->
</template>

<script>
export default {
    props: {
        items: {
            type: Array,
            required: true,
        },
        filterName: {
            type: String,
            required: true,
        },
        filterSlug: {
            type: String,
            required: true,
        },
        // filterObject: {
        //   type: String,
        //   required: true,
        // },
        filterAllDisabled: {
            type: Boolean,
            required: true,
        },
        isData: {
            type: Boolean,
            default: true,
        },
        boilerplate: {
            type: Boolean,
            default: true,
        },
    },
    // mounted() {
    //   console.log("mounted");
    //   this.isMounted = true;
    // },
    // created() {
    //   console.log("created");
    // },
    // computed: {
    //   filterItems() {
    //     return this.$store.state.sessionStorage.categoryPage.category[
    //       this.filterObject
    //     ];
    //   },
    // },
    // data() {
    //   return {
    //     isMounted: false,
    //   };
    // },
    methods: {
        change(item) {
            this.$emit('change', item);
        },
    },
};
</script>
<style lang="scss" scoped>
    .header-sceleton {
        ::v-deep .v-skeleton-loader__text {
            width: 100% !important;
            height: 100% !important;
            margin-bottom: 0 !important;
        }
    }

    .chip-item-sceleton {
        ::v-deep .v-skeleton-loader__chip {
            width: 100% !important;
            height: 100% !important;
        }
    }
</style>
<style lang="scss" scoped module>
    .headerSceleton {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }

    .chipsWrapper {
        position: relative;
        display: flex;
        flex: 1 0 auto;
        //   white-space: normal;
        flex-wrap: wrap;
        max-width: 100%;
        padding: 8px 0;
        transition: .3s cubic-bezier(.25, .8, .5, 1);

        .chipHeader {
            display: flex;
            align-items: center;
            width: 100%;
            height: 48px;
            text-transform: uppercase;
            font-family: $heading-font-family;
            font-size: 16px;
            font-weight: bold;
            color: $black;
            // padding: 0 16px 0 16px;
        }
    }

</style>
