const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class assistant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  assistant.init({
    userId: DataTypes.UUID,
    storeId: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'assistant',
  });
  return assistant;
};
