import bodyParser from 'body-parser';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import { RegisterRoutes } from '../../../build/routes';
import swaggerDocument from '../../../build/swagger.json';

import { errorHandler } from './error-handler';

import config from './api.config';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

RegisterRoutes(app);

app.use(errorHandler);

const server = app.listen(config.port, () => {
  console.log(`Listening at http://localhost:${config.port}`);
});
server.on('error', console.error);
