const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Crowdfunding API",
      version: "1.0.0",
      description: "API documentation for the Crowdfunding platform",
    },
  },
  apis: ["./src/routes/*.js"], // Spécifie le chemin vers tes fichiers de routes pour la documentation
};

const specs = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};

module.exports = setupSwagger;
