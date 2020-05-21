import Sequelize, { Model } from 'sequelize';

class Events extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        address: Sequelize.STRING,
        date: Sequelize.DATE,
        time: Sequelize.STRING,
        price: Sequelize.FLOAT,
        sold: Sequelize.INTEGER,
        unsold: Sequelize.INTEGER,
        category: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Events;
