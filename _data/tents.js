module.exports = async function () {
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
          path: `/tents`,
        },
      }),
    },
  ).then((res) => res.json());

  return result?.data?.catalogue?.children ?? [];
};