export default (to, from, savedPosition) => {
    if (to.hash) {
        return {
            selector: to.hash,
        };
    } else if (savedPosition) {
        return savedPosition;
    } else if (to.name === 'catalog-category-slug' && from.name === 'catalog-category-slug' ||
    to.name === 'manufacturers-manufSlug-slug' && from.name === 'manufacturers-manufSlug-slug' ||
    to.name === 'catalog-halal-slug' && from.name === 'catalog-halal-slug' ||
    to.name === 'catalog-discount-slug' && from.name === 'catalog-discount-slug') {

    } else {
        return {
            x: 0,
            y: 0,
        };
    }
};
