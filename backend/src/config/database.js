module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'mblabs',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
