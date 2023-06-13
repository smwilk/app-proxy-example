/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */


const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const Shopify = require('shopify-api-node');

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

exports.appproxy = onRequest(async (request, response) => {
    // Your existing Shopify configuration
    const shopify = new Shopify({
        shopName: process.env.SHOP_DOMAIN,
        accessToken: process.env.ACCESS_TOKEN
    });

    // Your existing getProducts function
    async function getProducts() {
        try {
            return await shopify.customer.list();
        } catch (error) {
            logger.error('Error fetching products:', error.message);
            return null
        }
    }
    logger.info("Hello logs!", { structuredData: true });

    // Call the getProducts function
    const products = await getProducts();

    // Send a response to the app proxy
    if (products) {
        response.send('Customer information fetched successfully.');
    } else {
        response.send('Customer information could not be fetched')
    }
});
