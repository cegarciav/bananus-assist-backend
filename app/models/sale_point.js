const {
  Model,
} = require('sequelize');

module.exports = (sequelize) => {
  class sale_point extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.store);
      // define association here
    }
  }
  sale_point.init({
  }, {
    sequelize,
    modelName: 'sale_point',
  });
  return sale_point;
};
