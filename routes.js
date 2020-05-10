const axios = require('axios')
const backendUrl = process.env.BACKEND_URL || "https://api.prodaem-kolbasu.ru"

async function main() {
  let routes = []
  const {
    data: pages
  } = await axios.get(backendUrl + '/pages?_limit=99999')
  for (let item of pages) {
    routes.push(`${item.slug}`)
  }
  const {
    data: manufacturers
  } = await axios.get(backendUrl + '/manufacturers?_limit=99999')
  for (let item of manufacturers) {
    routes.push(`/manufacturers/${item.slug}`)
  }
  const {
    data: categories
  } = await axios.get(backendUrl + '/categories?_limit=99999')
  for (let item of categories) {
    routes.push(`/catalog/${item.slug}`)
  }
  const {
    data: products
  } = await axios.get(backendUrl + '/products?_limit=99999')

  for (let product of products) {
    if (product.category && product.category.slug && product.slug) {
      routes.push(`/catalog/${product.category.slug}/${product.slug}`)
    } else {
      console.log("no category", product.name)
    }


  }
  return routes
}
module.exports = main
