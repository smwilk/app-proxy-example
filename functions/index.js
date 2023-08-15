// This code is for reference and inspiration only, Please do not use it for production.

// Import necessary modules
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const PDFDocument = require('pdfkit');
const Shopify = require('shopify-api-node');

// Define your Firebase HTTP function
exports.appproxy = onRequest(async (req, res) => {
    // Initialize Shopify instance with your shop's domain and access token
    const shopify = new Shopify({
        shopName: process.env.SHOP_DOMAIN,
        accessToken: process.env.ACCESS_TOKEN
    });

    // Function to fetch customer data from Shopify
    async function getCustomer(id) {
        try {
            return await shopify.customer.get(id)
        } catch (error) {
            logger.error('Error fetching customer:', error.message);
            return null
        }
    }

    async function getCustomerOrders(id) {
        try {
            return await shopify.customer.orders(id)
        } catch (error) {
            logger.error('Error fetching orders:', error.message);
            return null
        }
    }

    // Fetch the customer using the received ID
    const customer = await getCustomer(req.body.customerId)

    // Fetch orders created by customer
    const orders = await getCustomerOrders(req.body.customerId)

    const order = orders.find(order => {
        return req.body.orderId == order.id
    });

    // Set response headers for PDF output
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=your-bill.pdf`);

    // Create a new PDF document
    const doc = new PDFDocument();

    // Add text to the PDF
    doc
        .fontSize(38)
        .text("Tax invoice")
        .fontSize(16)
        .moveDown(2)
        .text("Tax invoice for " + customer?.first_name + " " + customer?.last_name);

    // If order exists, add order details to the PDF
    if (order) {
        const address = order.billing_address;
        doc
            .moveDown()
            .text(`${address.first_name} ${address.last_name}`)
            .text(`Address: ${address.address1}, ${address.city}, ${address.zip}, ${address.province}, ${address.country}`)
            .moveDown()
            .text("Order details:");

        order.line_items.forEach(item => {
            doc
                .text(`Title: ${item.title}, Quantity: ${item.quantity}, Price: ${item.price}`);
        });

        doc
            .moveDown()
            .text(`Total amount: ${order.total_price}`)
            .text(`Tax amount: ${order.total_tax}`);
    }
    // Pipe the PDF into the response
    doc.pipe(res);
    doc.end();
});
