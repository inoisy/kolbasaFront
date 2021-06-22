const fs = require('fs');
const path = require('path');
const axios = require('axios');
const query = require('../graphql/query/generalInfo');

async function downloadImage(url, dir, name) {
    const downloadPath = path.resolve(__dirname, dir, name);
    const writer = fs.createWriteStream(downloadPath);

    const response = await axios({
        url: encodeURI(url),
        method: 'GET',
        responseType: 'stream',
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

export default async function(ctx) {
    this.nuxt.hook('build:before', async ({ options }) => {
        try {
            const apiUrl = options.publicRuntimeConfig.baseUrl;
            if (!apiUrl) {
                throw new Error('no apiUrl');
            }
            const { data: { data: { contact, categories, manufacturers } } } = (await axios({
                url: apiUrl + '/graphql',
                method: 'post',
                data: {
                    query,
                },
            }));
            for (const manufacturer of manufacturers) {
                await downloadImage(apiUrl + manufacturer.img.url, '../assets/images/manufacturers', manufacturer.slug + manufacturer.img.ext);
            }
            await fs.writeFileSync(path.resolve(__dirname, '../static/data.json'), JSON.stringify({ contact, categories, manufacturers }));
        } catch (e) {
            throw new Error(e);
        }
    });
}
