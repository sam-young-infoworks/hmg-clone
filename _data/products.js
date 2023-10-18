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
          query ($language: String!, $path: String!) {
            catalogue(language: $language, path: $path) {
              children {
                path
                name
                ... on Folder {
                  name
                  path
                  children {
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

  const folders = result?.data?.catalogue?.children ?? [];
  console.log(folders);

  let products = [];

  folders.forEach(folder => {
    // console.log(folder.children);
    const productArray = folder?.children.map(variantsItem => {
      return variantsItem.variants[0];
    });

    // add productArray items to products
    const updatedProducts = [...products, ...productArray];
    products = updatedProducts;
  });

  console.log(products);

  return products;
};