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
  --delimiter-padding: 2px;
  --font-size: 12px;

  @include md {
    font-size: var(--font-size);
    --delimiter-padding: 5px;
  }
  font-size: var(--font-size);

  &.large {
    --font-size: 14px;
    --delimiter-padding: 3px;
    // font-size: 14px !important;
    @include md {
      --font-size: 16px;
      --delimiter-padding: 8px;
      // font-size: 16px !important;
    }
    //     &:not(:last-child) {
    //       &:after {
    // padding: 0 6px;
    //         @include md {
    //           padding: 0 12px;
    //         }
    //       }
    //     }
  }
  list-style-type: none;
  padding-left: 0;
  .breadcrumbsItem {
    display: inline;
    &:not(:last-child) {
      &:after {
        content: "/";
        font-size: var(--font-size);
        display: inline;
        color: rgba($white, 0.5);
        padding: 0 var(--delimiter-padding);
        // @include md {
        //   padding: 0 8px;
        // }
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