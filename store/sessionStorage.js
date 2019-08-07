import gql from "graphql-tag";
const baseUrl = process.env.baseUrl
export const state = () => ({
  // basket: new Map(),
  loading: false,
  sortFilter: {},
  manufacturerFilter: {},
  pageFilter: {},

  category: {},
  // promo: [{
  //     header: "Хотите высокое качество по низкой цене? Успейте купить по акции!",
  //     content: `«Альянс Фуд» предлагает первоклассные продукты по реально выгодной стоимости. Участвуйте в ежемесячных акциях и получайте выгодно свежайшие и вкуснейшие колбасы, сосиски, сардельки, мясные деликатесы.`,
  //     buttontext: "Хочу скидки!",
  //     href: "/catalog/discount",
  //     image: require("@/assets/img/promo.jpg")
  //   },
  //   {
  //     header: "Большой выбор производителей. У нас каждый находит то, что ищет!",
  //     content: `Нам важно, чтобы наши клиенты получали лучшую продукцию. Поэтому мы тщательно выбираем производителей и сотрудничаем только с проверенными временем мясокомбинатами. Не верьте нам на слово, а убедитесь сами – соберите свою первую продуктовую корзину прямо сейчас.`,
  //     buttontext: "Смотреть",
  //     href: "/manufacturers",
  //     image: require("@/assets/img/promo3.jpg")
  //   }
  // ],
  generalInfo: {},
  products: {
    items: [],
    count: 0
  }
})
