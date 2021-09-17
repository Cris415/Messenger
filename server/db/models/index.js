const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const LastRead = require("./lastRead");
const Group = require("./group");

// associations

Conversation.belongsToMany(User, { through: Group });
User.belongsToMany(Conversation, { through: Group });
Message.belongsTo(Conversation);
LastRead.belongsTo(Conversation);
Conversation.hasMany(Message);
Conversation.hasMany(LastRead);

module.exports = {
  User,
  Conversation,
  Message,
  LastRead,
  Group
};