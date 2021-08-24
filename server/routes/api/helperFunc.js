const countUnread = (conversation, userId, date) => {
  const { messages } = conversation;

  // iterate over messages and count the ones that have been sent after last read
  return messages.reduce((acc, curr) => {
    const lastReadDate = new Date(date).getTime();
    const currMessageDate = new Date(curr.createdAt).getTime();

    // Count messages that belong to other user and sent after last read conversation
    if (userId !== curr.senderId && lastReadDate < currMessageDate) {
      return acc + 1;
    }
    return acc;
  }, 0);
};

module.exports = countUnread;
