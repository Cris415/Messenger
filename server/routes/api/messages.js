const router = require("express").Router();
const { Conversation, Message, LastRead } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      let lastreads = await LastRead.findAll({
        where: { conversationId },
      });
      if (lastreads.length < 2) {
        const lastreadUser1 = await LastRead.create({
          userId: senderId,
          conversationId,
        });
        const lastreadUser2 = await LastRead.create({
          userId: recipientId,
          conversationId,
        });

        lastreads = [lastreadUser1, lastreadUser2];
      }

      const message = await Message.create({ senderId, text, conversationId });
      return res.json({ message, sender, lastreads });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    let lastreads = await LastRead.findAll({
      where: { conversationId: conversation.id },
    });

    if (lastreads.length < 2) {
      const lastreadUser1 = await LastRead.create({
        userId: senderId,
        conversationId: conversation.id,
      });
      const lastreadUser2 = await LastRead.create({
        userId: recipientId,
        conversationId: conversation.id,
      });

      lastreads = [lastreadUser1, lastreadUser2];
    }

    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });
    res.json({ lastreads, message, sender });
  } catch (error) {
    next(error);
  }
});

module.exports = router;