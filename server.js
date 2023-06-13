const express = require('express');
const Shopify = require('shopify-api-node');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Your existing Shopify configuration
const shopify = new Shopify({
    shopName: process.env.SHOP_DOMAIN,
    accessToken: process.env.ACCESS_TOKEN
});

// Your existing getProducts function
async function getProducts() {
    try {
        const products = await shopify.product.list();
        const customers = await shopify.customer.list();
        console.log(customers);

    } catch (error) {
        console.error('Error fetching products:', error.message);
    }
}

// Add a new route to handle app proxy requests
app.get('/app-proxy', async (req, res) => {
    // Call the getProducts function
    await getProducts();
    // Send a response to the app proxy
    res.send('Customer information fetched successfully.');
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});