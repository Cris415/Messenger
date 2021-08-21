import { makeStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";

const useStyles = makeStyles((theme) => ({
  root: { marginRight: "30px" },
  Badge: { fontWeight: "bolder" },
}));

// count unread messages based on the time the conversation was last read
// function accepts conversation object and returns a count (number)
export const countUnread = (conversation) => {
  const { otherUser, messages, lastRead } = conversation;

  return messages.reduce((acc, curr) => {
    const lastReadDate = new Date(lastRead).getTime();
    const currConvoDate = new Date(curr.createdAt).getTime();

    // Count messages that belong to other user and sent after last read conversation
    if (otherUser.id === curr.senderId && lastReadDate < currConvoDate) {
      return acc + 1;
    }
    return acc;
  }, 0);
};

const UnreadChat = (props) => {
  const classes = useStyles();
  const { conversation } = props;
  const count = countUnread(conversation);
  return (
    <div className={classes.root}>
      <Badge
        color="primary"
        badgeContent={count}
        max={999}
        classes={{ badge: classes.Badge }}
      />
    </div>
  );
};

export default UnreadChat;
