const axios = require('axios');

module.exports = async function () {
  return axios({
    method: 'post',
    url: 'https://api.crystallize.com/infoworks/catalogue',
    data: {
      query: `
        query ($language: String!, $path: String!) {
          catalogue(language: $language, path: $path) {
            children {
              path
              name
              ... on Product {
                variants {
                  name
                  price
                  images {
                    url
                    altText
                    key
                  }
                }
              }
            }
          }
        }
        `,
      variables: {
        language: 'en',
        path: `/backpacks`,
      },
    }
  }).then(res => res.data?.data?.catalogue?.children ?? []);  
};