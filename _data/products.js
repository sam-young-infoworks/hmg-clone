const crystallize = require('@crystallize/js-api-client');

const CrystallizeClient = crystallize.createClient({
  tenantIdentifier: 'infoworks',
});

const query = `
  query getCataloguePaths{
    catalogue(language: "en", path: "/") {
      name
      children {
        name
        path
      }
    }
  }
`

module.exports = async function () {
  // const res = await CrystallizeClient.catalogueApi(query);
  // console.log(res.catalogue.children[0]);

  // return res.catalogue;

  const result = await fetch(
    'https://api.crystallize.com/infoworks/catalogue',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
            query($language: String!, $path: String!) {
              catalogue(language: $language, path: $path) {
                children {
                  path
                  name

                  ... on Folder {
                    name
                    path
                  }
                  
                  ... on Product {
                    defaultVariant {
                      firstImage {
                        url
                        altText
                      }
                      price
                      stock
                    }

                    variants {
                      name
                      price
                      isDefault
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
          path: `/`,
        },
      }),
    },
  ).then((res) => res.json());

  const products = result?.data?.catalogue?.children ?? [];
  // console.log(products);
  return products;
};