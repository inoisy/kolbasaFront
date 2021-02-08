<template>
  <div :class="$style.contentWrapper" v-html="content"></div>
</template>
<style lang="scss" scoped module>
.contentWrapper {
  color: $black;
  // a {
  //   color: $black;
  //   text-decoration: none;

  //   &:hover {
  //     color: $accent;
  //   }
  // }

  ::v-deep h2 {
    margin-bottom: 2rem;
  }

  ::v-deep h3 {
    margin-bottom: 1rem;
  }

  ::v-deep ul,
  ol {
    li {
      margin-bottom: 1rem;
    }
  }

  ::v-deep ul {
    list-style: square inside url("/bullet_min.svg");
    padding-left: 5px !important;
  }

  ::v-deep h2:not(:first-child) {
    margin-top: 3rem;
  }

  ::v-deep h2,
  h3,
  h4,
  h5,
  ul,
  table {
    margin-bottom: 1rem;
  }

  ::v-deep h2,
  h3 {
    line-height: 125%;
  }

  ::v-deep table {
    border-spacing: 0;
    max-width: 100%;

    tr:not(:last-child) td {
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }

    tr td:not(:last-child),
    td:only-child {
      border-right: 1px solid rgba(0, 0, 0, 0.12);
    }

    tr {
      td {
        padding-right: 16px;
        padding-top: 10px;
        padding-bottom: 10px;
      }

      td:only-child:not([rowspan]) {
        padding-left: 16px;
        // padding-right: 16px;
      }

      td:not(:first-child) {
        padding-left: 16px;
        // padding-right: 16px;
      }
    }

    td,
    th {
      height: 36px;
    }
  }
}
</style>
<script>
export default {
  props: {
    content: {
      type: String,
      default: "",
    },
  },
};
</script>