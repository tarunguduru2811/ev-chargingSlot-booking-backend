// src/config/swagger.ts

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EV Charging API",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:5000/api" }],
    components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  },
  apis: ["./src/modules/**/*.ts"], // 🔥 scans your files
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app: any) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};