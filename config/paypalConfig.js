const paypal = require("@paypal/checkout-server-sdk");
const client_id = process.env.PAYPAL_CLIENT_ID;
const client_secret = process.env.PAYPAL_CLIENT_SECRET;
let environment = new paypal.core.SandboxEnvironment(client_id, client_secret);
let client = new paypal.core.PayPalHttpClient(environment);
module.exports = { client };
