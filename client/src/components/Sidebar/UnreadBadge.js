import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import Badge from "@material-ui/core/Badge";

const useStyles = makeStyles((theme) => ({
  root: { marginRight: "30px" },
  Badge: { fontWeight: "bolder" },
}));

const UnreadBadge = (props) => {
  const classes = useStyles();
  const { conversation } = props;
  return (
    <Box className={classes.root}>
      <Badge
        color="primary"
        badgeContent={conversation.unreadMessageCount}
        max={999}
        classes={{ badge: classes.Badge }}
      />
    </Box>
  );
};

export default UnreadBadge;
