const serverless = require("serverless-http");
const app = require("../server"); // Use Express app

module.exports = serverless(app);
