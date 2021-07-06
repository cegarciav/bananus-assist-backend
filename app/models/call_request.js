const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class call_request extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }

  call_request.init({
    calls: DataTypes.INTEGER,
    date: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'call_request',
    timestamps: false,
  });
  return call_request;
};
