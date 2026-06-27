async function run() {
  const url = "https://www.netmeds.com/prescriptions/dabur-chyawanprash-awaleha-1kg";
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    // Search for images with "dabur-chyawanprash" in their name or find the main image
    const matches = html.match(/https:\/\/[^"\s]+dabur-chyawanprash[^"\s]+/g);
    console.log("Found matches:", matches ? [...new Set(matches)] : "none");
    
    // Also print any large image URLs that look like CDN images
    const cdnMatches = html.match(/https:\/\/www\.netmeds\.com\/images\/product-v2\/images\/[^"\s]+/g);
    console.log("Found CDN matches:", cdnMatches ? [...new Set(cdnMatches)] : "none");
  } catch (err) {
    console.error("Failed to parse Netmeds:", err.message);
  }
}

run();
