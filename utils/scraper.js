const axios = require('axios');
const cheerio = require('cheerio');

const extractMetadata = async (url) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $('head > title').text();
    const description = $('meta[name="description"]').attr('content') || '';
    const image = $('meta[property="og:image"]').attr('content') || '';
    const tags = $('meta[name="keywords"]').attr('content')?.split(',') || [];

    return { title, description, image, tags };
  } catch (error) {
    console.error('Error scraping URL:', error);
    throw error;
  }
};

module.exports = extractMetadata;
