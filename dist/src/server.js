"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const auth_1 = __importDefault(require("./controllers/auth"));
const app = (0, express_1.default)();
const port = 5000;
app.use(body_parser_1.default.json());
app.get('/', (req, res) => console.log('Hello world'));
app.use('/api/auth', auth_1.default);
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
