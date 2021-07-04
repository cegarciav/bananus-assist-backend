const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class call extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user, {foreignKey: 'userId'});
    }
  };
  call.init({
    calls: DataTypes.INTEGER,
    date: DataTypes.DATE

  }, {
    sequelize,
    modelName: 'call',
    timestamps: false
  });
  return call;
};