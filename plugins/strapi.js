export default ({ $strapi, app, $vuetify }) => {
    $strapi.hook('error', error => {
        app.$toast.error(error.message, {
            action: {
                text: 'Закрыть',
                onClick: (e, toastObject) => {
                    toastObject.goAway(0);
                },
            },
            icon: el => {
                el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true" class="v-icon__svg" style="width:27px; height:27px;  margin-right: 15px;"><path d="${$vuetify.icons.values.error}"></svg>`;
                return el;
            },
        });
    });
};
