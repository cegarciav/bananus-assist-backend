const bcrypt = require('bcrypt');

const PASSWORD_SALT = parseInt(process.env.PASSWORD_SALT, 10);

async function buildPasswordHash(instance) {
  if (instance.changed('password')) {
    const hash = await bcrypt.hash(instance.password, PASSWORD_SALT);
    instance.set('password', hash);
  }
}

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class device extends Model {
    /**
     * @swagger
     * components:
     *   schemas:
     *     device:
     *       type: object
     *       required:
     *         - id
     *         - serialNumber
     *       properties:
     *         id:
     *           type: string
     *           format: uuidv4
     *         serialNumber:
     *           type: string
     *         password:
     *           type: string
     *         token:
     *           type: string
     */
    static associate(models) {
      this.belongsTo(models.central_tablet, { foreignKey: 'central_tabletId' });
      // define association here
    }
  }
  device.init({
    serialNumber: DataTypes.STRING,
    password: DataTypes.STRING,
    token: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'device',
  });
  device.beforeUpdate(buildPasswordHash);
  device.beforeCreate(buildPasswordHash);

  device.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.password);
  };

  return device;
};
