import gql from "graphql-tag";
const baseUrl = process.env.baseUrl
export const state = () => ({
  // basket: new Map(),
  loading: false,
  sortFilter: {},
  manufacturerFilter: {},
  pageFilter: {},
  benefits: [{
    title: "Опыт",
    text: "Работаем с 1996 года - гарантия надежности",
    img: {
      url: require('~/assets/benefits/thinking.svg')
    }
  }, {
    title: "Цены",
    text: "Цены заводов-производителей - гарантия низкой стоимости",
    img: {
      url: require('~/assets/benefits/thinking.svg')
    }
  }, {
    title: "Склады",
    text: "Специализированные термо-склады - храниение в рекомендуемых темпиратурных условиях",
    img: {
      url: require('~/assets/benefits/thinking.svg')
    }
  }, {
    title: "Доставка",
    text: "Доставка по всей России и СНГ - удобная логистика до дверей",
    img: {
      url: require('~/assets/benefits/thinking.svg')
    }
  }, {
    title: "Наличие",
    text: "Продукция всегда в наличии - собираем самые сложные заявки",
    img: {
      url: require('~/assets/benefits/thinking.svg')
    }
  }, {
    title: "Новинки",
    text: "Узнаем о новинках первыми - вы получаете новинки, как только они сойдут с конвеера",
    img: {
      url: require('~/assets/benefits/thinking.svg')
    }
  }],
  category: {},
  promo: [{
      header: "Пс, у нас тут ежемесячные акции, заходи- успей купить!",
      content: `Самые актуальные и свежие акции от компании Альянс Фуд, принимайте участие и получите удовольствие от покупок по выгодным ценам.`,
      buttontext: "В каталог",
      href: "/catalog",
      image: require("@/assets/img/promo.jpg")
    },
    {
      header: "20 мясных производителей. Каждый найдет то, что ищет. ",
      content: `Наша компания дорожит своими клиентами, и предоставляет широкий ассортимент продукции первоклассных мясокомбинатов, убедитесь сами, соберите первую корзину.`,
      buttontext: "Смотреть",
      href: "/manufacturers",
      image: require("@/assets/img/promo3.jpg")
    }
  ],
  generalInfo: {},
  products: {
    items: [],
    count: 0
  }
})
