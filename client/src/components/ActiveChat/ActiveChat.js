import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { connect } from "react-redux";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 8,
    flexDirection: "column",
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between",
  },
}));

const ActiveChat = (props) => {
  const classes = useStyles();
  const { user, lastMessageRead } = props;
  const conversation = props.conversation || {};

  let lastMessageReadId;
  if (lastMessageRead && lastMessageRead.length > 0) {
    lastMessageReadId = lastMessageRead.pop().id;
  } else {
    lastMessageReadId = null;
  }

  return (
    <Box className={classes.root}>
      {conversation.otherUser && (
        <>
          <Header
            username={conversation.otherUser.username}
            online={conversation.otherUser.online || false}
          />
          <Box className={classes.chatContainer}>
            <Messages
              messages={conversation.messages}
              otherUser={conversation.otherUser}
              userId={user.id}
              lastMessageReadId={lastMessageReadId}
            />
            <Input
              otherUser={conversation.otherUser}
              conversationId={conversation.id}
              user={user}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => {
  let conversation =
    state.conversations &&
    state.conversations.find(
      (conversation) =>
        conversation.otherUser.username === state.activeConversation
    );
  return {
    user: state.user,
    conversation,
    lastMessageRead:
      conversation &&
      conversation.messages.filter((message) => {
        const messageDate = new Date(message.createdAt).getTime();
        const lastReadDate = new Date(
          conversation.otherUser.lastread
        ).getTime();
        return state.user.id === message.senderId && lastReadDate > messageDate;
      }),
  };
};

export default connect(mapStateToProps, null)(ActiveChat);
