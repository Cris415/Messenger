const { DataTypes, Sequelize } = require("sequelize");
const db = require("../db");

const LastRead = db.define("lastread", {
  date: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  conversationId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = LastRead;
