import gql from "graphql-tag";
const baseUrl = process.env.baseUrl
export const state = () => ({
  // basket: new Map(),
  loading: false,
  sortFilter: {},
  manufacturerFilter: {},
  pageFilter: {},
  // benefits: [{
  //   title: "Опыт",
  //   text: "Работаем с 1996 года - гарантия надежности",
  //   img: {
  //     url: require('~/assets/benefits/thinking.svg')
  //   }
  // }, {
  //   title: "Цены",
  //   text: "Цены заводов-производителей - гарантия низкой стоимости",
  //   img: {
  //     url: require('~/assets/benefits/thinking.svg')
  //   }
  // }, {
  //   title: "Склады",
  //   text: "Специализированные термо-склады - храниение в рекомендуемых темпиратурных условиях",
  //   img: {
  //     url: require('~/assets/benefits/thinking.svg')
  //   }
  // }, {
  //   title: "Доставка",
  //   text: "Доставка по всей России и СНГ - удобная логистика до дверей",
  //   img: {
  //     url: require('~/assets/benefits/thinking.svg')
  //   }
  // }, {
  //   title: "Наличие",
  //   text: "Продукция всегда в наличии - собираем самые сложные заявки",
  //   img: {
  //     url: require('~/assets/benefits/thinking.svg')
  //   }
  // }, {
  //   title: "Новинки",
  //   text: "Узнаем о новинках первыми - вы получаете новинки, как только они сойдут с конвеера",
  //   img: {
  //     url: require('~/assets/benefits/thinking.svg')
  //   }
  // }],
  category: {},
  promo: [{
      header: "Хотите высокое качество по низкой цене? Успейте купить по акции!",
      content: `«Альянс Фуд» предлагает первоклассные продукты по реально выгодной стоимости. Участвуйте в ежемесячных акциях и получайте выгодно свежайшие и вкуснейшие колбасы, сосиски, сардельки, мясные деликатесы.`,
      buttontext: "Хочу скидки!",
      href: "/catalog/discount",
      image: require("@/assets/img/promo.jpg")
    },
    {
      header: "Большой выбор производителей. У нас каждый находит то, что ищет!",
      content: `Нам важно, чтобы наши клиенты получали лучшую продукцию. Поэтому мы тщательно выбираем производителей и сотрудничаем только с проверенными временем мясокомбинатами. Не верьте нам на слово, а убедитесь сами – соберите свою первую продуктовую корзину прямо сейчас.`,
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
