<template>
  <div class="contentWrapper" v-html="content"></div>
</template>
<style lang="scss" scoped >
.contentWrapper {
  color: $black;
  overflow-x: auto;
  overflow-y: hidden;
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
        // display: inline-block;
        // background: #f3f3f3;
        // width: 30px;
        // height: 30px;
        // -webkit-border-radius: 30px;
        // border-radius: 30px;
        // text-align: center;
        // line-height: 30px;
        // font-size: 15px;
        // font-weight: 700;
        // margin: 0 10px 10px 0;
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
  }

  ::v-deep h2:not(:first-child) {
    margin-top: 3rem;
  }

  ::v-deep table {
    border-spacing: 0;
    max-width: 100%;
    width: 100%;

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