const bcrypt = require('bcrypt');
const assistant = require('../models');

const PASSWORD_SALT = parseInt(process.env.PASSWORD_SALT, 10);

async function buildPasswordHash(instance) {
  if (instance.changed('password')) {
    const hash = await bcrypt.hash(instance.password, PASSWORD_SALT);
    instance.set('password', hash);
  }
}

async function destroyStoreAssistant(instance) {
  await assistant.destroy({ where: { userId: instance.id } });
}

const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.store, { through: models.assistant });
      this.belongsTo(models.store);
    }
  }
  user.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    rol: DataTypes.STRING,
    token: DataTypes.STRING,
    storeId: DataTypes.UUID,
  }, {
    sequelize,
    modelName: 'user',
  });

  user.beforeUpdate(buildPasswordHash);
  user.beforeCreate(buildPasswordHash);
  user.beforeDestroy(destroyStoreAssistant);

  user.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.password);
  };

  return user;
};
