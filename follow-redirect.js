import https from 'https';

const url = "https://www.google.com/aclk?sa=L&ai=DChsSEwigp4GE-aSVAxV3hGYCHaHfAHgYACICCAEQARoCc20&co=1&ase=2&gclid=Cj0KCQjwxvjRBhC2ARIsAI7KJa3Qx1c82y2x6AO19aqyuqDzvs80xpH9u_2y6JmonHYs2WCvNAd6LH0aAkfkEALw_wcB&cid=CAAS0gHkaBU1aFqF_f_GWrUbGAmf1TVw0_4gDLOVSRkleli9YdmQtmRpgVgw9v-QP8ocSFXLt1QDe9mmYh_Y7Z_5oKaOxwE85Pnub0Xc93OszABVvn_TbW980hWTeywZD9yNRbsAxhVyBF0FT7t8q4ZJz9-d4LKK8_48t8mEJ6Lv1gjPXHMF8NnIomf9agjV0MZOfOKJzOzi2hvtM1dzZl5SmunY3SoeB-VbaqP1BEvUfeYSazNVbdluAQzRwzc7jH-yxaWXqqJDcK5y2ZDQ0Ah7UpzUki8&cce=2&category=acrcp_v1_32&sig=AOD64_1qa2Y_zDm4QMQM7_KQTelgyotqmA&ctype=5&q=&nis=4&ved=2ahUKEwi4-vuD-aSVAxVhcGwGHVZkDKcQ9aACKAB6BAgKEBA&adurl=";

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  }
}, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log("HTML Body:");
    console.log(data);
  });
});
