const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class available_payment_method extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.payment_method, { foreignKey: 'payment_methodId' });
      this.belongsTo(models.product, { foreignKey: 'productId' });
    }
  }

  available_payment_method.init({
    payment_methodId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: true,
        isUUID: 4,
      },
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        notEmpty: true,
        isUUID: 4,
      },
    },
  }, {
    sequelize,
    modelName: 'available_payment_method',
  });
  return available_payment_method;
};
