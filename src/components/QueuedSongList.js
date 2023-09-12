import {
  Avatar,
  IconButton,
  Typography,
  makeStyles,
  useMediaQuery
} from "@material-ui/core";

import { ADD_OR_REMOVE_FROM_QUEUE } from "../graphql/mutations";
import { Delete } from "@material-ui/icons";
import React from "react";
import {useMutation} from "@apollo/react-hooks";

function QueuedSongList({queue}) {
  const greaterThanMd = useMediaQuery(theme => theme.breakpoints.up("md"));

  return (
    greaterThanMd && (
      <div style={{ margin: "10px 0" }}>
        <Typography color="textSecondary" variant="button">
          QUEUE ({queue.length})
        </Typography>
        {queue.map(song => (
          <QueuedSong key={song.id} song={song} />
        ))}
      </div>
    )
  );
}

const useStyles = makeStyles({
  avatar: {
    width: 44,
    height: 44
  },
  text: {
    textOverflow: "ellipsis",
    overflow: "hidden"
  },
  container: {
    display: "grid",
    gridAutoFlow: "column",
    gridTemplateColumns: "50px auto 50px",
    gridGap: 12,
    alignItems: "center",
    marginTop: 10
  },
  songInfoContainer: {
    overflow: "hidden",
    whiteSpace: "nowrap"
  }
});

function QueuedSong({ song }) {
  const classes = useStyles();
  const { thumbnail, artist, title } = song;
  const [addOrRemoveFromQueue]=useMutation(ADD_OR_REMOVE_FROM_QUEUE,{onCompleted: data => {
    localStorage.setItem('queue', JSON.stringify(data.addOrRemoveFromQueue))
  }});

  function handleAddOrRemoveQueue(){
    addOrRemoveFromQueue({
      variables:{input:{...song, __typename: 'Song'}}
    });
  }

  return (
    <div className={classes.container}>
      <Avatar src={thumbnail} alt="Song thumbnail" className={classes.avatar} />
      <div className={classes.songInfoContainer}>
        <Typography variant="subtitle2" className={classes.text}>
          {title}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
          className={classes.text}
        >
          {artist}
        </Typography>
      </div>
      <IconButton onClick={handleAddOrRemoveQueue}>
        <Delete color="error" />
      </IconButton>
    </div>
  );
}

export default QueuedSongList;
