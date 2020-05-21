import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import IssuerController from './app/controllers/IssuerController';
import EventsController from './app/controllers/EventsController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const uploads = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

// middleware global usado após as rotas acima. Ela servirá para todas as rotas abaixo
// Desta maneira eu garanto que esta autenticação só verifica se o usuário está logado
routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/issuers', IssuerController.index);

routes.post('/files', uploads.single('file'), FileController.store);

routes.post('/events', EventsController.store);

routes.get('/events', EventsController.index);

export default routes;
