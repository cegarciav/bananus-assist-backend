const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class payment_method extends Model {
    /**
     * @swagger
     * components:
     *   schemas:
     *     payment method:
     *       type: object
     *       required:
     *         - id
     *         - name
     *       properties:
     *         id:
     *           type: string
     *           format: uuidv4
     *         name:
     *           type: string
     *           unique: true
     */
    static associate(models) {
      this.belongsToMany(
        models.product,
        {
          through: models.available_payment_method,
          foreignKey: 'payment_methodId',
          as: 'products',
        },
      );
    }
  }

  payment_method.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
  }, {
    sequelize,
    modelName: 'payment_method',
  });
  return payment_method;
};
