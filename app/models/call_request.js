const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class call_request extends Model {
    /**
     * @swagger
     * components:
     *   schemas:
     *     call request:
     *       type: object
     *       required:
     *         - id
     *         - calls
     *         - date
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
