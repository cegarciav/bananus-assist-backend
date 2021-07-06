const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class call extends Model {
    /**
     * @swagger
     * components:
     *   schemas:
     *     call:
     *       type: object
     *       required:
     *         - id
     *         - calls
     *         - date
     *         - userId
     *       properties:
     *         id:
     *           type: integer
     *           unique: true
     *         calls:
     *           type: integer
     *           minimum: 0
     *         date:
     *           type: string
     *           format: date-time
     *         userId:
     *           type: string
     *           format: uuidv4
     *           description: id of an existing user
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user, { foreignKey: 'userId' });
    }
  }

  call.init({
    calls: DataTypes.INTEGER,
    date: DataTypes.DATE,

  }, {
    sequelize,
    modelName: 'call',
    timestamps: false,
  });
  return call;
};
