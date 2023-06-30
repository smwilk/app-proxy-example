/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */


const { onRequest } = require("firebase-functions/v2/https");
const axios = require('axios');
const logger = require("firebase-functions/logger");

const Shopify = require('shopify-api-node');

exports.appproxy = onRequest(async (req, res) => {
    // Your existing Shopify configuration
    const shopify = new Shopify({
        shopName: process.env.SHOP_DOMAIN,
        accessToken: process.env.ACCESS_TOKEN
    });

    // Your existing getProducts function
    async function getCustomer(id) {
        try {
            return await shopify.customer.get(id)
        } catch (error) {
            logger.error('Error fetching customer:', error.message);
            return null
        }
    }

    logger.info("Customer ID!", req.body.customerId);
    const customer = await getCustomer(req.body.customerId)
    logger.info("Hello customer!", customer.first_name);

    // Build a PDF based on the customer data here

    // Send a response to the app proxy
    if (customer) {
        // Return a PDF
        const url = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

        const response = await axios.get(url, { responseType: 'arraybuffer' });

        res.contentType("application/pdf");
        res.send(Buffer.from(response.data, 'binary'));
    } else {
        res.sendStatus(404)
    }
});
