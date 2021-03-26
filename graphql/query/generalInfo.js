module.exports = `
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
      name
      slug
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
  manufacturers(sort: "name:asc", limit: 999) {
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