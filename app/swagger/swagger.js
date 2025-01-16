import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Define the Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'File Sharing & Storage API',
    version: '1.0.0',
    description: 'API documentation for managing users and files with authentication',
    termsOfService: 'http://localhost:3000/terms',
    contact: {
      name: 'Developer Support',
      url: 'http://localhost:3000/contact',
      email: 'support@localhost.com',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
    },
  ],
};

// Define the path to the API specs
const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'],  // Adjust based on your project structure
};

// Initialize Swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// Swagger documentation setup
const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swaggerDocs;
