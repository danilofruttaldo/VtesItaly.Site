#!/usr/bin/env node
/**
 * Fetches all content from wp.vtesitaly.com WP REST API and saves to JSON files.
 * Usage: node fetch-wp-content.cjs
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = __dirname;

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const totalPages = parseInt(res.headers['x-wp-totalpages'] || '1');
        const total = parseInt(res.headers['x-wp-total'] || '0');
        resolve({ data, totalPages, total, statusCode: res.statusCode });
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function fetchAll(baseUrl, filename) {
  let allItems = [];
  let page = 1;
  let totalPages = 1;

  do {
    const sep = baseUrl.includes('?') ? '&' : '?';
    const url = `${baseUrl}${sep}per_page=100&page=${page}`;
    console.log(`Fetching: ${url}`);
    const result = await fetchJSON(url);
    if (result.statusCode !== 200) {
      console.log(`  Status ${result.statusCode} - stopping pagination`);
      break;
    }
    totalPages = result.totalPages;
    console.log(`  Total: ${result.total}, TotalPages: ${totalPages}, Page: ${page}, Size: ${result.data.length}`);
    const items = JSON.parse(result.data);
    allItems = allItems.concat(items);
    page++;
  } while (page <= totalPages);

  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(allItems, null, 2), 'utf8');
  console.log(`Wrote ${allItems.length} items to ${filepath}\n`);
}

async function main() {
  console.log('=== Fetching WordPress content from wp.vtesitaly.com ===\n');

  await fetchAll('https://wp.vtesitaly.com/wp-json/wp/v2/pages', 'pages.json');
  await fetchAll('https://wp.vtesitaly.com/wp-json/wp/v2/posts', 'posts.json');
  await fetchAll('https://wp.vtesitaly.com/wp-json/wp/v2/categories', 'categories.json');
  await fetchAll('https://wp.vtesitaly.com/wp-json/wp/v2/tags', 'tags.json');
  await fetchAll('https://wp.vtesitaly.com/wp-json/wp/v2/media', 'media.json');

  console.log('=== Done! ===');
}

main().catch(e => { console.error(e); process.exit(1); });
