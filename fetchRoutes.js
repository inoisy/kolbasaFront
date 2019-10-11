const axios = require('axios')
const backendUrl = process.env.BACKEND_URL || "http://localhost:1337"

async function main() {
  let routes = []
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
  for (let category of categories) {
    //  routes.push(`/catalog/${item.slug}`)
    for (let product of category.products) {
      routes.push(`/catalog/${category.slug}/${product.slug}`)
    }
  }
  // console.log("TCL: main -> routes", routes)

}
main()
