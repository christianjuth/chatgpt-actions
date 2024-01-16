const fs = require('fs');

function getGroceries(offset, limit) {
  return {
    url: "https://www.traderjoes.com/api/graphql",
    method: "POST",
    body: {
      "operationName": "SearchProducts",
      "variables": {
        "storeCode": "TJ",
        "availability": "1",
        "published": "1",
        "categoryId": 2,
        "currentPage": Math.floor(offset / limit),
        "pageSize": limit
      },
      "query": `
        query SearchProducts($categoryId: String, $currentPage: Int, $pageSize: Int, $storeCode: String = "TJ", $availability: String = "1", $published: String = "1") {
          products(
            filter: {store_code: {eq: $storeCode}, published: {eq: $published}, availability: {match: $availability}, category_id: {eq: $categoryId}}
            currentPage: $currentPage
            pageSize: $pageSize
          ) {
            items {
              sku
              title: item_title
              categoryHierarchy: category_hierarchy {
                name
              }
              size: sales_size
              unitOfMeasurement: sales_uom_description
              retailPrice: retail_price
            }
            totalCount: total_count
          }
        }
      `
    }
  }
}

async function doFetch({ url, body, ...config }) {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json()
  return json
}

/**
 * Writes a JSON array to a file with formatting.
 *
 * @param {string} filePath - The path of the file where the JSON will be saved.
 * @param {Array} jsonArray - The JSON array to be written to the file.
 * @param {number} [indentation=2] - The number of spaces to use for indentation.
 */
function writeJsonArrayToFile(filePath, jsonArray, indentation = 2) {
  const formattedJson = JSON.stringify(jsonArray, null, indentation);

  fs.writeFile(filePath, formattedJson, 'utf8', function(err) {
    if (err) {
      console.error('An error occurred:', err);
      return;
    }
    console.log('JSON array saved to ' + filePath);
  });
}

async function main() {
  const items = []

  let limit = 200
  let offset = 0

  const firstPage = await doFetch(getGroceries(offset, limit))
  offset += limit

  let total = firstPage.data.products.totalCount
  items.push(...firstPage.data.products.items)

  const promisses = []

  while (offset < total) {
    if (offset + limit > total) {
      limit = total - offset
    }
    promisses.push(doFetch(getGroceries(offset, limit)))
    offset += limit
  }

  for (const page of await Promise.all(promisses)) {
    items.push(...page.data.products.items)
  }

  for (const item of items) {
    item.categoryHierarchy = item.categoryHierarchy.map(({ name }) => name)
    item.retailPrice = `$${item.retailPrice}`
  }

  console.log(total, items.length)

  writeJsonArrayToFile('data.json', items);
}

main()

