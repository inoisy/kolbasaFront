import gql from 'graphql-tag';

const categoryLimit = 20;
export const state = () => ({
    category: {
        parent: [],
        product_types: [],
        manufacturers: [],
    },
    limit: categoryLimit,
    manufacturerSelected: null,
    productTypeSelected: null,
    categoryMinimal: {
        parent: [],
    },

});


export const getters = {
    getProductTypeBySlug(state) {
        return state.category.product_types.reduce((out, item) => {
            out[item.slug] = item;
            return out;
        }, {});
    },
    isChildCategory(state) {
        const category = state.categoryMinimal;

        if (category.parent.length) {
            return true;
        }
        return false;
    },
    categoriesIds(state, getters) {
        const category = state.categoryMinimal;
        if (getters.isChildCategory) {
            return [category.id];
        }
        return getters.categorySubcategoriesIDs;
    },
    rootCategory(state, getters, rootState, rootGetters) {
        const category = state.categoryMinimal;

        if (!category.id) {
            return {};
        }
        if (getters.isChildCategory) {
            return rootGetters['info/getCategoryBySlug'][category.parent[0].slug];
        }
        return category;
    },
    categorySubcategories(state, getters) {
        const rootCategory = getters.rootCategory;
        if (!rootCategory || !rootCategory.children || !rootCategory.children.length) {
            return [];
        }
        return rootCategory.children.reduce((acc, val) => {
            acc.push(val);
            return acc;
        }, [{
            slug: rootCategory.slug,
            name: `Все ${rootCategory.name}`,
            id: rootCategory.id,
        }]);
    },
    categorySubcategoriesIDs(state, getters) {
        return getters.categorySubcategories.map(item => item.id);
    },
    categoryMeta(state) {
        const { category: { name: categoryName, metaDescription, content: categoryContent }, manufacturerSelected, productTypeSelected } = state;
        if (!categoryName) {
            return {};
        }
        let name = `${categoryName} оптом`;
        let description = metaDescription || `${name} от компании Альянс Фуд с доставкой по всей РФ и СНГ по самым выгодным оптовым ценам от производителя.`;
        let content = categoryContent;

        if (manufacturerSelected) {
            name = `${categoryName} ${manufacturerSelected.name} оптом`;
            description = `${name}. ${description}`;
        } else if (productTypeSelected) {
            name = `${productTypeSelected.name} оптом`;
            description = `${name}. ${description}`;
            if (productTypeSelected.content) {
                content = productTypeSelected.content.concat(categoryContent);
            }
        }
        return {
            name,
            description,
            content,
        };
    },

    categoryBreadcrumbs(state, getters) {
        const { name: rootName, slug: rootSlug } = getters.rootCategory;
        if (!rootSlug) {
            return [];
        }
        const { name, slug } = state.categoryMinimal;
        const items = [
            {
                to: '/',
                text: 'Главная',
            },
            {
                to: '/catalog',
                text: 'Каталог',
            },
            {
                to: `/catalog/${rootSlug}`,
                text: rootName,
            },
        ];

        if (slug !== rootSlug) {
            items.push({
                to: `/catalog/${slug}`,
                text: name,
            });
        }
        return items;
    },
};
export const mutations = {

    category(state, item) {
        state.category = item;
    },
    setCategoryMinimal(state, category) {
        state.categoryMinimal = category;
    },
    setFilters(state, { manufacturer = null, productType = null }) {
        state.manufacturerSelected = manufacturer;
        state.productTypeSelected = productType;
    },
};
export const actions = {

    async changeCategory({ commit, state, rootGetters }, slug) {
        const category = rootGetters['info/getCategoryBySlug'][slug];
        if (!category) {
            return false;
        }
        if (state.categoryMinimal.id !== category.id) {
            await commit('setCategoryMinimal', category);
        }

        return category.id;
    },

    async fetchProductTypeBySlug(state, slug) {
        const {
            data: { productTypes: [productType] },
        } = await this.app.apolloProvider.defaultClient.query({ variables: {
            slug,
        },
        query: gql`
        query ProductTypeQuery($slug: String!) {
          productTypes(where:{ slug: $slug}) {
            _id
            id
            name
            slug
            content
          }
        }
      ` });
        return productType;
    },
    async fetchProductType(state, id) {
        const {
            data: { productType },
        } = await this.app.apolloProvider.defaultClient.query({
            variables: {
                id,
            },
            query: gql`
          query ProductTypeQuery($id: ID!) {
            productType(id: $id) {
              _id
              id
              name
              slug
              content
            }
          }
        `,
        });
        return productType;
    },
    async fetchAndSetFilters({ commit, dispatch, getters, rootGetters }, query) {
        const { manufacturer, type } = query;
        let manufacturerSelected; let productTypeSelected;
        if (manufacturer) {
            manufacturerSelected = rootGetters['info/getManufacturerBySlug'][manufacturer];
        }
        if (type) {
            productTypeSelected = await dispatch('fetchProductTypeBySlug', type);
        }
        await commit('setFilters', { productType: productTypeSelected, manufacturer: manufacturerSelected });
    },
    async fetchCategory({ commit }, id) {
        const {
            data: { category },
        } = await this.app.apolloProvider.defaultClient.query({
            query: gql`
          query CategoryQuery($id: ID!) {
            category(id: $id) {
              id
              description
              metaDescription
              name
              slug
              content
              manufacturers(sort: "name:asc") {
                _id
                name
                slug
              }
              parent {
                slug
                name
                children {
                  id
                  name
                  slug
                }
              }
              children {
                id
                name
                slug
              }
              product_types(sort: "name:asc") {
                _id
                name
                slug
              }
            }
          }
        `,
            variables: {
                id,
            },
        });
        await commit('category', category);
    },

    async fetchCategoryProducts({ getters, state, rootState }, start = 0) {
        const { limit, manufacturerSelected, productTypeSelected } = state;
        const sort = rootState.category.sort;
        const {
            data: { products },
        } = await this.app.apolloProvider.defaultClient.query({
            query: gql`
          query productsQuery(
            $manufacturer: ID
            $category: [ID!]
            $product_type: ID
            $sort: String
            $limit: Int
            $start: Int
          ) {
            products(
              limit: $limit
              start: $start
              sort: $sort
              where: {
                manufacturer: $manufacturer
                category: $category
                product_type: $product_type
              }
            ) {
              id
              name
              slug
              weight
              isDiscount
              isHalal
              priceNum
              discountPrice
              rating
              minimumOrder
              piece
              manufacturer {
                name
                slug
              }
              category {
                name
                slug
              }
              img {
                url
                name
                formats
              }
            }
          }
        `,
            variables: {
                start,
                category: getters.categoriesIds,

                limit,
                sort: sort.value,
                ...(Boolean(manufacturerSelected) && {
                    manufacturer: manufacturerSelected._id,
                }),
                ...(Boolean(productTypeSelected) && {
                    product_type: productTypeSelected._id,
                }),
            },
        });
        return products;
    },
    async cleanFilters({ commit }) {
        await commit('setFilters', {});
    },
    async changeProductType({ commit, dispatch }, item) {
        let productTypeNew = null;
        if (item) {
            productTypeNew = await dispatch('fetchProductType', item);
        }
        await commit('setFilters', { productType: productTypeNew });
    },
    async changeManufacturer({ commit }, manufacturer) {
        await commit('setFilters', { manufacturer });
    },
};
