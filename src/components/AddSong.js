import { AddBoxOutlined, Link } from "@material-ui/icons";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
  makeStyles,
} from "@material-ui/core";

import { ADD_SONGS } from './../graphql/mutations';
import React from "react";
import ReactPlayer from "react-player";
import SoundcloudPlayer from "react-player/lib/players/SoundCloud";
import YoutubePlayer from "react-player/lib/players/YouTube";
import { useMutation } from "@apollo/client";

// import { Add } from "@material-ui/icons";


const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    marginTop: "75px",
  },
  urlInput: {
    margin: theme.spacing(1),
  },
  addSongButton: {
    margin: theme.spacing(1),
  },
  dialog: {
    textAlign: "center",
  },
  thumbnail: {
    width: "90%",
  },
}));

const DEFAULT_SONG = {duration: 0,
  title: "",
  artist: "",
  thumbnail: "",}

function AddSong() {
  const classes = useStyles();
  const [addSong, {error}] = useMutation(ADD_SONGS);
  const [url, SetUrl] = React.useState("");
  const [dialog, setDialog] = React.useState(false);
  const [playable, setPlayable] = React.useState(false);
  const [song, setSong] = React.useState({
    duration: 0,
    title: "",
    artist: "",
    thumbnail: "",
  });

  React.useEffect(() => {
    const isPlayable =
      SoundcloudPlayer.canPlay(url) || YoutubePlayer.canPlay(url);
    setPlayable(isPlayable);
  }, [url]);

  async function handleEditSong({ player }) {
    const nestedPlayer = player.player.player;
    let songData;
    console.log(nestedPlayer);
    if (nestedPlayer.getVideoData) {
      songData = getYoutubeInfo(nestedPlayer);
      console.log(songData);
    } else if (nestedPlayer.getCurrentSound) {
      songData = await getSoundcloudInfo(nestedPlayer);
    }
    setSong({ ...songData, url });
  }

  async function handleAddSong(){
    try{
      const {url,thumbnail,duration,artist,title} = song
      await addSong(
        {variables:
        {
          url: url.length > 0 ? url : null,
          thumbnail: thumbnail.length > 0 ? thumbnail: null,
          duration: duration > 0 ? duration: 0,
          title: title.length > 0 ? title:null,
          artist: artist.length> 0 ? artist:null,
        }
        }
      )
      handleCloseDialog()
      setSong(DEFAULT_SONG)
      SetUrl('')
    }
    
    catch (error){
      console.error("Error adding song",error)
    }
  }

  function getYoutubeInfo(player) {
    const duration = Number(player.getDuration);
    console.log(player.getVideoData());
    const { title, video_id, author } = player.getVideoData();
    const thumbnail = `http://img.youtube.com/vi/${video_id}/0.jpg`;
    return {
      duration: duration > 0 ? duration : 0,
      title,
      artist: author,
      thumbnail,
    };
  }

  function getSoundcloudInfo(player) {
    return new Promise((resolve) => {
      player.getCurrentSound((songData) => {
        console.log(songData);
        if (songData) {
          resolve({
            duration: Number(songData.duration / 1000),
            title: songData.title,
            artist: songData.user.username,
            thumbnail: songData.artwork_url.replace("-large", "-t500x500"),
          });
        }
      });
    });
  }

  function handleChangeSong(event) {
    const { name, value } = event.target;
    setSong((prevSong) => ({
      ...prevSong,
      [name]: value,
    }));
  }

  function handleCloseDialog() {
    setDialog(false);
  }

  function handleError(field) {
    return error?.graphQLErrors[0]?.extensions?.path.includes(field);
  }
  
  const { thumbnail, title, artist } = song;
  return (
    <div className={classes.container}>
      <Dialog
        className={classes.dialog}
        open={dialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Edit Song</DialogTitle>
        <DialogContent>
          <img
            src={thumbnail}
            alt="Song thumbnail"
            className={classes.thumbnail}
          />
          <TextField
            value={title}
            onChange={handleChangeSong}
            margin="dense"
            name="title"
            label="Title"
            fullWidth
            error={handleError('title')}
            helperText={handleError('title') && 'Fill out the field'}
          />
          <TextField
            value={artist}
            onChange={handleChangeSong}
            margin="dense"
            name="artist"
            label="Artist"
            fullWidth
            error={handleError('artist')}
            helperText={handleError('artist') && 'Fill out the field'}
          />
          <TextField
            value={thumbnail}
            onChange={handleChangeSong}
            margin="dense"
            name="thumbnail"
            label="Thumbnail"
            fullWidth
            error={handleError('thumbnail')}
            helperText={handleError('thumbnail') && 'Fill out the field'}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddSong} variant="outlined" color="primary">
            Add Song
          </Button>
        </DialogActions>
      </Dialog>
      <TextField
        className={classes.urlInput}
        placeholder="Add Youtube or Soundcloud Url"
        onChange={(event) => SetUrl(event.target.value)}
        value={url}
        fullWidth
        margin="normal"
        type="url"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Link />
            </InputAdornment>
          ),
        }}
      />
      <Button
        disabled={!playable}
        className={classes.addSongButton}
        onClick={() => setDialog(true)}
        variant="contained"
        color="primary"
        endIcon={<AddBoxOutlined />}
      >
        Add
      </Button>
      <ReactPlayer url={url} hidden onReady={handleEditSong} />
    </div>
  );
}

export default AddSong;
