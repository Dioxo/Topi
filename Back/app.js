import express from 'express';
import path from 'path';
import logger from 'morgan';
import { router as indexRouter } from './routes/index.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import cors from 'cors';

export const app = express();

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);

const options = {
    definition: {
        info: {
            title: 'Topi Swagger',
            version: '1.0.0',
        },
    },
    apis: ['./routes/*.js'], // files containing annotations as above
};
const swaggerSpec = swaggerJsdoc(options);
app.get('/api-docs/swagger.json', (req, res) => {
    console.log(swaggerSpec);
    res.json(swaggerSpec);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
