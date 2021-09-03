const countUnread = (conversation) => {
  const { messages, lastread, otherUser } = conversation;
  // iterate over messages and count the ones that have been sent after last read

  if (!lastread) return 0;

  const lastReadDate = new Date(lastread).getTime();
  return messages.reduce((acc, curr) => {
    const currMessageDate = new Date(curr.createdAt).getTime();
    // Count messages that belong to other user and sent after last read conversation
    if (otherUser.id === curr.senderId && currMessageDate > lastReadDate) {
      return acc + 1;
    }
    return acc;
  }, 0);
};

export default countUnread;
