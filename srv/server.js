const cds = require("@sap/cds");
const express = require("express"); // Import express
const cov2ap = require("@cap-js-community/odata-v2-adapter");

// Increase the body size limit to handle larger file uploads
cds.on("bootstrap", (app) => {
  app.use(cov2ap());

  // Set max body size limit to 10MB
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
});

module.exports = cds.server;