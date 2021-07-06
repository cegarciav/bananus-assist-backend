const bcrypt = require('bcrypt');
const {
  Model,
} = require('sequelize');

const PASSWORD_SALT = parseInt(process.env.PASSWORD_SALT, 10);

async function buildPasswordHash(instance) {
  if (instance.changed('password')) {
    const hash = await bcrypt.hash(instance.password, PASSWORD_SALT);
    instance.set('password', hash);
  }
}

module.exports = (sequelize, DataTypes) => {
  class central_tablet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
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
