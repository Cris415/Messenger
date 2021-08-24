import { makeStyles } from "@material-ui/core/styles";
import Badge from "@material-ui/core/Badge";

const useStyles = makeStyles((theme) => ({
  root: { marginRight: "30px" },
  Badge: { fontWeight: "bolder" },
}));

const UnreadBadge = (props) => {
  const classes = useStyles();
  const { conversation } = props;
  return (
    <div className={classes.root}>
      <Badge
        color="primary"
        badgeContent={conversation.unreadMessageCount}
        max={999}
        classes={{ badge: classes.Badge }}
      />
    </div>
  );
};

export default UnreadBadge;
