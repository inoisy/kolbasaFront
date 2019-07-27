import gql from "graphql-tag";
const baseUrl = process.env.baseUrl
export const state = () => ({
  // basket: new Map(),
  loading: false,
  sortFilter: {},
  manufacturerFilter: {},
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
      header: "Пс, у нас тут новая колбаска, бесплатные пробники до конца лета!",
      content: `Capitalise on low hanging fruit to identify a ballpark value added activity to beta test.
            <br>Override the digital divide with.`,
      buttontext: "Хочу колбаску!",
      href: "/catalog/varenaya",
      image: require("@/assets/img/promo.jpg")
    },
    {
      header: "Скидка на ветчину 20%!",
      content: `  Capi ta lise on low hanging fruit to identify a ballpark value added activity to beta test.
            <br>Override the digital divide with.`,
      buttontext: "Хочу ветчину!",
      href: "/catalog/vetchina",
      image: require("@/assets/img/promo1.jpg")
    }
  ],
  generalInfo: {},
  products: {
    items: [],
    count: 0
  }
})
