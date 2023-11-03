const { DataTypes } = require("sequelize");
const db = require("../db/conn");
const user = require("./user");

const tought = db.define("tought", {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
    require: true,
  },
});

//1 - n
tought.belongsTo(user);
user.hasMany(tought);

module.exports = tought;
