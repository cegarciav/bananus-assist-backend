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
  class user extends Model {
    /**
     * @swagger
     * components:
     *   schemas:
     *     user:
     *       type: object
     *       required:
     *         - id
     *         - email
     *         - name
     *         - password
     *         - rol
     *       properties:
     *         id:
     *           type: string
     *           format: uuidv4
     *         name:
     *           type: string
     *         email:
     *           type: string
     *           format: email
     *           unique: true
     *         password:
     *           type: string
     *         rol:
     *           type: string
     *           enum: [administrator, supervisor, assistant]
     *         token:
     *           type: string
     *         storeId:
     *           type: string
     *           format: uuidv4
     *           description: id of an existing store
     */
    static associate(models) {
      this.belongsToMany(models.store, { through: models.assistant });
      this.belongsTo(models.store);
      this.hasMany(models.call, { foreignKey: 'userId' });
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

  user.prototype.checkPassword = function checkPassword(password) {
    return bcrypt.compare(password, this.password);
  };

  return user;
};
