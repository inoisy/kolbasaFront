export default (to, from, savedPosition) => {
  // console.log("to", to.name);
  // console.log("from", from.name)
  if (to.hash) {
    return {
      selector: to.hash
    }
  } else if (savedPosition) {
    return savedPosition
  } else if (to.name === "catalog-category-slug" && from.name === "catalog-category-slug" ||
    to.name === "manufacturers-slug-productSlug" && from.name === "manufacturers-slug-productSlug" ||
    to.name === "catalog-halal-slug" && from.name === "catalog-halal-slug" ||
    to.name === "catalog-discount-slug" && from.name === "catalog-discount-slug") {
    return
  } else {
    return {
      x: 0,
      y: 0
    }
  }
}
