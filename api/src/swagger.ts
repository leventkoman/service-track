import swaggerJSDoc from 'swagger-jsdoc';
import {Express} from "express";
import swaggerUi from "swagger-ui-express";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Demo API',
            version: '1.0.0',
            description: 'Express + TypeScript API Documentation',
        },
        servers: [
            {
                url: 'http://localhost:8080',
            },
        ],
    },
    apis: ['./src/routes/**/*.ts', './src/db/schema/**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
    // Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Servizo API Docs'
    }));

    // Swagger JSON
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
};

export default swaggerSpec;