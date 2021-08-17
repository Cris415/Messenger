import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId } = props;
  // console.log(messages)
  return (
    <Box>
      {messages
        .sort((a, b) => {
          let dateA = new Date(a.createdAt);
          let dateB = new Date(b.createdAt);
          return dateA.getTime() > dateB.getTime();
        })
        .map((message) => {
          const time = moment(message.createdAt).format("h:mm");

          return message.senderId === userId ? (
            <SenderBubble key={message.id} text={message.text} time={time} />
          ) : (
            <OtherUserBubble
              key={message.id}
              text={message.text}
              time={time}
              otherUser={otherUser}
            />
          );
        })}
    </Box>
  );
};

export default Messages;
