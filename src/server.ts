import express, { Request, Response } from 'express';
import bodyParser from 'body-parser'
import auth  from './routes/api/auth'
import swaggerUi, { swaggerSpec }  from "./swagger"

const app = express();
const port = 5000;



app.use(bodyParser.json())
app.get('/', (req: Request, res: Response) => console.log('Hello world'))
app.use('/api/auth', auth);
app.use(
    '/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)
)

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});