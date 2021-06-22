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
  class central_tablet extends Model {
    /**
     * @swagger
     * components:
     *   schemas:
     *     central tablet:
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
      this.belongsTo(models.sale_point, { foreignKey: 'sale_pointId' });
      this.hasMany(models.device, { foreignKey: 'central_tabletId' });
      // define association here
    }
  }
  central_tablet.init({
    serialNumber: DataTypes.STRING,
    password: DataTypes.STRING,
    token: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'central_tablet',
  });
  central_tablet.beforeUpdate(buildPasswordHash);
  central_tablet.beforeCreate(buildPasswordHash);

  central_tablet.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.password);
  };
  return central_tablet;
};
