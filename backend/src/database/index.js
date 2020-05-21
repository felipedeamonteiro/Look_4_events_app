// Aqui é feita a conexão com a base de dados.
// Carrego os models e faço a conexão com o init
import Sequelize from 'sequelize';

import User from '../app/models/User';
import File from '../app/models/File';
import Events from '../app/models/Events';

import databaseConfig from '../config/database';

// esse é o cara que recebe todos os models
const models = [User, File, Events];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models)); // para colocar a coluna de dados do avatar_id na tabela users
  }
}

export default new Database();
