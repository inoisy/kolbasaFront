<template >
  <div class="contentWrapper" v-html="content" />
</template>
<style lang="scss" scoped >
.contentWrapper {
  color: $black;
  :last-child {
    margin-bottom: 0;
  }
  ::v-deep a {
    color: darken($accent, 20%);
    text-decoration: none;

    &:hover {
      color: $accent;
      text-decoration: underline;
    }
  }

  ::v-deep h2 {
    margin-bottom: 2rem;
  }

  ::v-deep h3 {
    margin-bottom: 1rem;
  }
  ::v-deep h4 {
    margin-bottom: 0.7rem;
  }

  ::v-deep ul,
  ol {
    li {
      margin-bottom: 1rem;
    }
  }

  ::v-deep ol {
    counter-reset: my-awesome-counter;
    list-style: none;
    padding-left: 40px;
    li {
      margin-bottom: 1rem;
      counter-increment: my-awesome-counter;

      position: relative;
      &:before {
        content: counter(my-awesome-counter);
        color: white;
        font-size: 1.1rem;
        font-weight: bold;
        position: absolute;
        $size: 1.8rem;
        left: calc(-1 * #{$size} - 10px);
        line-height: #{$size};
        width: #{$size};
        height: #{$size};
        top: 0;
        background: $black;
        border-radius: 50%;
        text-align: center;
        box-shadow: 1px 1px 0 #999;
      }
    }
  }

  ::v-deep ul {
    list-style: square inside url("/bullet_min.svg");
    padding-left: 5px !important;
    margin-bottom: 1.5rem;
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
    border-spacing: 0;
    // max-width: 100%;
    // width: calc(100% - 2px);
    border-collapse: collapse;
    border-style: hidden;

    td {
      border: thin solid #e0e0e0;
      padding-top: 5px;
      padding-bottom: 5px;
      padding-right: 16px;
      height: 36px;
      @include md {
        height: 48px;
      }
      &:not(:first-child),
      &:only-child:not([rowspan]) {
        padding-left: 16px;
        padding-right: 16px;
      }
    }
    // td:not(:first-child),
    // td:only-child:not([rowspan]) {
    //   padding-left: 16px;
    // }
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