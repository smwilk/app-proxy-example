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
const PDFDocument = require('pdfkit');

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
    logger.info("Hello customer!", customer?.first_name);

    // Build a PDF based on the customer data here

    // Send a response to the app proxy
    // if (customer) {
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=your-bill.pdf`);
    const doc = new PDFDocument();
    doc
        .fontSize(24)
        .text("Receipt")
        .fontSize(16)
        .moveDown(2)
        .text("This is your receipt!" + customer?.first_name);
    doc.pipe(res);
    doc.end();
    // } else {
    //     res.sendStatus(404)
    // }
});
