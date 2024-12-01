import swaggerJSDoc, { SwaggerDefinition } from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express"
import dotnev from 'dotenv'


dotnev.config()

const port = process.env.PORT || 5000;

const options: SwaggerDefinition = {
    swaggerDefinition: '3.0.0',
    info: {
        title: 'Authentication and authorization API',
        version: '1.0.0',
        description: 'API ตัวอย่างสำหรับ Auth',
    },
    servers: [
        {
            url: `http://localhost:5000`,
            descripotion: 'Development server'
        },
    ],
    apis: ['./server.ts'],
}

export const swaggerSpec = swaggerJSDoc(options);
export default swaggerUi
