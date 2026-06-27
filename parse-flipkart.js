const redirectUrl = "https://vertexaisearch.cloud.google.com/grounding-api-redirect/AUZIYQECLmfvpJrm2VOexJTstEIXOjrfBpkmI5b8s75RMnQzmc2VeCJgsghDqomO6fOev9Wmy344Q3xARgBzqvX1xHR00EkfsXZvJfbqL825mlk_3dbPdSsVq1fY_h4bgMnHIpHc7LgMSLQnjQ2l-q7sNz-qEYChQmSXk4iqGJsy8hhTkVHd6l0N-LZW8x5SoZb6bfd5lkF6RLQ8BsKHE_UP_xzC-CipIHBdrG00jHzYzg==";

async function run() {
  try {
    console.log("Resolving google redirect...");
    const res1 = await fetch(redirectUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    console.log("Flipkart URL:", res1.url);
    
    // Now fetch the Flipkart page
    const res2 = await fetch(res1.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await res2.text();
    
    // Parse flixcart images
    const matches = html.match(/https:\/\/rukminim2\.flixcart\.com\/image\/[^\s"']+/g);
    console.log("Matches found:", matches ? [...new Set(matches)].slice(0, 10) : "none");
  } catch (err) {
    console.error("Failed to run:", err.message);
  }
}

run();
