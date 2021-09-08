const router = require("express").Router();
const { User, Conversation, Message, LastRead } = require("../../db/models");
const db = require("../../db");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id"],
      order: [[Message, "createdAt", "DESC"]],
      include: [
        { model: Message, order: ["createdAt", "DESC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: LastRead,
          attributes: ["date", "conversationId", "userId"],
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages[0].text;

      // reversing to display new messages at bottom
      convoJSON.messages = convoJSON.messages.reverse();

      // find dates that belong to each user
      if (convoJSON.lastreads.length > 0) {
        convoJSON.lastread = convoJSON.lastreads.filter(
          (lr) => lr.userId === userId
        )[0].date;

        convoJSON.otherUser.lastread = convoJSON.lastreads.filter(
          (lr) => lr.userId === convoJSON.otherUser.id
        )[0].date;
        delete convoJSON.lastreads;
      }

      conversations[i] = convoJSON;
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

// Update the conversation with the latest date given an id
router.patch("/:id", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const convoId = req.params.id;
    const userId = req.user.id;

    if (!convoId) {
      return res.sendStatus(404);
    }

    // find conversation last read time
    let lastRead = await LastRead.findOne({
      where: {
        conversationId: convoId,
        userId: userId,
      },
    });

    if (lastRead) {
      lastRead = await LastRead.update(
        { date: db.literal("CURRENT_TIMESTAMP") },
        {
          where: {
            conversationId: convoId,
            userId: userId,
          },
          returning: true,
          plain: true,
        }
      );
      lastRead = lastRead[1];
      res.json(lastRead);
    } else {
      lastRead = await LastRead.create({
        conversationId: convoId,
        userId: userId,
      });
      res.json(lastRead);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
