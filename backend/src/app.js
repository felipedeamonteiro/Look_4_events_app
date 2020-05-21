import express from 'express';
import path from 'path';
import cors from 'cors';
import routes from './routes';

// importando a conexão com a base de dados
import './database';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(cors()); // O cors é uma lib que permite q outras aplicações acessem essa api
    this.server.use(express.json());
    // Aqui eu uso um recurso do express, que é o express.static que serve pra 'servir' arquivos estáticos (como arquivos de img)
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
