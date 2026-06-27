async function run() {
  const url = "https://ayuvya.com/products/chyawanprash";
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    const urls = [];
    
    // Look for anything containing "cdn.shopify.com"
    const regex1 = /cdn\.shopify\.com\/s\/files\/[^"'\s>]+/g;
    let match;
    while ((match = regex1.exec(html)) !== null) {
      urls.push("https://" + match[0]);
    }
    
    // Look for any image tags or json references
    const regex2 = /\/\/cdn\.shopify\.com\/[^\s"']+/g;
    while ((match = regex2.exec(html)) !== null) {
      urls.push("https:" + match[0]);
    }
    
    console.log("Found matches:");
    const unique = [...new Set(urls)];
    unique.slice(0, 15).forEach(m => console.log(m));
  } catch (err) {
    console.error("Failed to parse Ayuvya:", err.message);
  }
}

run();
