"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = process.env.PORT || 5000;
const options = {
    swaggerDefinition: '3.0.0',
    info: {
        title: 'Authentication and authorization API',
        version: '1.0.0',
        description: 'API ตัวอย่างสำหรับ Auth',
    },
    servers: [
        {
            url: `http://localhost:${port}`,
            descripotion: 'Development server'
        },
    ],
    apis: ['./src/server.ts'],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.default = swagger_ui_express_1.default;
