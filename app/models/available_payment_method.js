const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class available_payment_method extends Model {
    /**
     * @swagger
     * components:
     *   schemas:
     *     available payment method:
     *       type: object
     *       required:
     *         - payment_methodId
     *         - productId
     *       properties:
     *         payment_methodId:
     *           type: string
     *           format: uuidv4
     *           description: id of an existing payment method
     *         productId:
     *           type: string
     *           format: uuidv4
     *           description: id of an existing product
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
