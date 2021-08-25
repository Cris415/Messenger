const countUnread = (conversation) => {
  const { messages, lastreads } = conversation;
  // iterate over messages and count the ones that have been sent after last read
  if (!lastreads) return 0;
  return messages.reduce((acc, curr) => {
    const lastReadDate = new Date(lastreads.date).getTime();
    const currMessageDate = new Date(curr.createdAt).getTime();

    // Count messages that belong to other user and sent after last read conversation
    if (lastreads.userId !== curr.senderId && currMessageDate > lastReadDate) {
      return acc + 1;
    }
    return acc;
  }, 0);
};

export default countUnread;
