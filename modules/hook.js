
const axios = require("axios")
const fs = require('fs')
const path = require('path')

async function downloadImage(url, dir, name) {
  // console.log("🚀 ~ file: hook.js ~ line 7 ~ downloadImage ~ url", encodeURI(url))
  // const url = 'https://unsplash.com/photos/AaEQmoufHLk/download?force=true'
  const downloadPath = path.resolve(__dirname, dir, name)
  // console.log("🚀 ~ file: hook.js ~ line 9 ~ downloadImage ~ downloadPath", downloadPath)
  const writer = fs.createWriteStream(downloadPath)

  const response = await axios({
    url: encodeURI(url),
    method: 'GET',
    responseType: 'stream'
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}
const query = `
          {
            contact {
              phone
              email
              addressText
              addressCoords
              accessTime
            }
            categories(sort: "name:asc", limit: 999) {
              id
              name
              slug
              parent {
                id
              }
              children {
                id
                name
                slug
                img {
                  url
                }
              }
              img {
                url
              }
            }
            manufacturers(sort: "name:asc", limit:999) {
              _id
              id
              name
              slug
              img {
                url
                ext
              }
            }
          }
        `
export default async function (ctx) {
  // console.log("🚀 ~ file: hook.js ~ line 50 ~ p", Object.keys(ctx));

  this.nuxt.hook('build:before', async ({ options }) => {
    try {

      const apiUrl = options.publicRuntimeConfig.baseUrl
      if (!apiUrl) {
        throw Error("no apiUrl")
      }
      // console.log("🚀 ~ file: hook.js ~ line 45 ~ nuxt", options.publicRuntimeConfig.baseUrl);
      // const query = 
      const { data: { data: { contact, categories, manufacturers } } } = (await axios({
        url: apiUrl + '/graphql',
        method: 'post',
        data: {
          query: query
        }
      }))
      // console.log("data: ", contact)
      for (let manufacturer of manufacturers) {
        // console.log(manufacturer.img)
        await downloadImage(apiUrl + manufacturer.img.url, "../assets/images/manufacturers", manufacturer.slug + manufacturer.img.ext)
      }
      await fs.writeFileSync(
        path.resolve(__dirname, "../static/data.json"),
        JSON.stringify({ contact, categories, manufacturers }),
      );
    } catch (e) {
      throw new Error(e)
    }
  })
}

