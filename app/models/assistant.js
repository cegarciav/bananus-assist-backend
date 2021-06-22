const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class assistant extends Model {
    /**
     * components:
     *   schemas:
     *     assistant:
     *       type: object
     *       required:
     *         - id
     *         - storeId
     *         - userId
     *       properties:
     *         id:
     *           type: string
     *           format: uuidv4
     *         userId:
     *           type: string
     *           format: uuidv4
     *           description: id of an existing user
     *         storeId:
     *           type: string
     *           format: uuidv4
     *           description: id of an existing store
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
