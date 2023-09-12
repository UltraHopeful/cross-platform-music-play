import { Grid, Hidden, useMediaQuery } from "@material-ui/core";

import AddSong from "./components/AddSong";
import Header from "./components/Header";
import React from "react";
import SongList from "./components/SongList";
import SongPlayer from "./components/SongPlayer";
import songReducer from "./reducer";

export const SongContext = React.createContext({
  song:{
    id:"ece77fc5-221a-499f-a56e-52aac83f2c8f",
    title:"શ્રી મદનમોહનજી મોરલી ધરી | Shree Madanmohanji Morli Dhari | Shrinathji Bhajan",
    artist:"Hemant Chauhan",
    thumbnail:"http://img.youtube.com/vi/QDpo9wongv0/0.jpg",
    url:"https://youtu.be/QDpo9wongv0?feature=shared",
    duration:0,
  },
  isPlaying:false,
})

function App() {
const initialSongState = React.useContext(SongContext)
const [state,dispatch] = React.useReducer(songReducer, initialSongState)
const greaterThanSm = useMediaQuery(theme => theme.breakpoints.up("sm"));
const greaterThanMd = useMediaQuery(theme => theme.breakpoints.up("md"));

return (
  <SongContext.Provider value={{state,dispatch}}>
    <Hidden only="xs">
      <Header />
    </Hidden>
    <Grid container sx={{p:3}} >
      <Grid
        style={{
          paddingTop: greaterThanSm ? 80 : 10
        }}
        item
        xs={12}
        md={7}
      >
        <AddSong />
        <SongList />
      </Grid>
      <Grid
        style={
          greaterThanMd
            ? {
                position: "fixed",
                width: "100%",
                right: 0,
                top: 70
              }
            : {
                position: "fixed",
                width: "100%",
                left: 0,
                bottom: 0
              }
        }
        item
        p={7}
        xs={12}
        md={5}
      >
        <SongPlayer />
      </Grid>
    </Grid>
  </SongContext.Provider>
);
}

export default App;
