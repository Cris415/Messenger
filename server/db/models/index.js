const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const LastRead = require("./lastRead");

// associations

User.hasMany(Conversation);
Conversation.belongsTo(User, { as: "user1" });
Conversation.belongsTo(User, { as: "user2" });
Message.belongsTo(Conversation);
LastRead.belongsTo(Conversation);
Conversation.hasMany(Message);
Conversation.hasMany(LastRead);

module.exports = {
  User,
  Conversation,
  Message,
  LastRead,
};
