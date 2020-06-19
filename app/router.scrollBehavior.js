export default (to, from, savedPosition) => {
  if (to.hash) {
    return {
      selector: to.hash
    }
  } else if (savedPosition) {
    return savedPosition
  } else if (to.name === "catalog-category-slug" && from.name === "catalog-category-slug" || to.name === "manufacturers-slug-productSlug" && from.name === "manufacturers-slug-productSlug") {
    return
  } else {
    return {
      x: 0,
      y: 0
    }
  }
}
