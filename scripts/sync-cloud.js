const fs = require('fs');
const path = require('path');

async function sync() {
  const dbPath = path.join(__dirname, '..', 'data', 'db.json');
  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

  console.log('Sending product update to https://jhthub.vercel.app/api/product...');
  const prodRes = await fetch('https://jhthub.vercel.app/api/product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dbData.product),
  });
  const prodJson = await prodRes.json();
  console.log('Product update response:', prodJson.success, prodJson.product?.productName);

  console.log('Sending settings update to https://jhthub.vercel.app/api/settings...');
  const setRes = await fetch('https://jhthub.vercel.app/api/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dbData.settings),
  });
  const setJson = await setRes.json();
  console.log('Settings update response:', setJson.success, setJson.settings?.storeName);
}

sync().catch(console.error);
