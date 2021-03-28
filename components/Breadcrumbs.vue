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
      <!-- !item.disable &&  :event="i === length ? '' : 'click'"  (item, i)-->
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
      // console.log(
      //   "🚀 ~ file: Breadcrumbs.vue ~ line 42 ~ itemsMapped ~ length",
      //   length
      // );
      // const mapped =
      return this.items.map((item, index) => {
        if (index === length) {
          return {
            text: item.text,
          };
        }
        return item;
      });
      // console.log(
      //   "🚀 ~ file: Breadcrumbs.vue ~ line 51 ~ mapped ~ mapped",
      //   mapped
      // );
      // return mapped;
    },
    length() {
      return this.items.length - 1;
    },
  },
};
</script>

<style style lang="scss" scoped module>
.breadcrumbs {
  font-size: 12px;
  @include md {
    font-size: 14px;
  }

  &.large {
    font-size: 14px !important;
    @include md {
      font-size: 16px !important;
    }
  }

  // align-content: center;
  // display: flex;
  // flex-wrap: wrap;
  // flex: 0 1 auto;
  list-style-type: none;
  // margin: 0;
  padding-left: 0;
  // padding: 18px 12px;
  // font-size: 16px;
  // &:last-child.dark {
  //   .breadcrumbsItemLink {
  //     color: rgba($darkLink, 0.5);
  //   }
  // }

  .breadcrumbsItem {
    // align-items: center;
    display: inline;
    // font-size: 14px;
    &:not(:last-child) {
      &:after {
        content: "/";
        display: inline;
        padding: 0 6px;
        color: rgba($white, 0.5);
        @include md {
          padding: 0 12px;
        }
      }
    }

    .breadcrumbsItemLink {
      color: $white;
      // align-items: center;
      display: inline;
      text-decoration: none;
      text-align: center;
      &:hover {
        color: $accent;
      }
    }
    //  &:last-child {
    .breadcrumbsItemDisabled {
      color: rgba($white, 0.5);
      pointer-events: none;
      // }
    }
  }
}

.dark.breadcrumbs {
  .breadcrumbsItem {
    color: $darkLink;
    &:after {
      color: rgba($darkLink, 0.45);
    }
    // &:last-child {

    // }
    .breadcrumbsItemLink {
      color: $darkLink;
      &:hover {
        color: $accent;
      }
    }
    .breadcrumbsItemDisabled {
      color: rgba($darkLink, 0.5);
    }
  }
}
</style>