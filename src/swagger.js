import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your API Title",
      version: "1.0.0",
      description: "Auto-generated API docs using Swagger",
    },
    servers: [
      {
        // url: "http://localhost:8080",

        url:"https://quote-backend-xqfm.onrender.com"
      },
    ],
  },
  apis: ["./src/routes/**/*.js"], 
};

export const swaggerSpec = swaggerJsdoc(options);
export const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
