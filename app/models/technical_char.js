const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class technical_char extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.product);
      // define association here
    }
  }
  technical_char.init({
    key: DataTypes.STRING,
    value: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'technical_char',
  });
  return technical_char;
};
