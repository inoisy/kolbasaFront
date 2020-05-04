<script>
export default {
  props: ["content"],
  render(createElement) {
    return createElement("div", this.$md.render(this.content));
  }
};
</script>