import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import { MusicChunksContext } from "./Context/MusicChunksContext";
import { Grid, Stack } from "@mui/material";
import MusicTrimmingArea from "./components/MusicTrimmingArea";
import MusicList from "./components/MusicList";
import colors from "./colors";
import { MusicContext } from "./Context/MusicContext";
import ReArranageArea from "./components/ReArranageArea";

const audioContext = new AudioContext();


function App() {
  const [musicChunks, setMusicChunks] = useState([]);
  const [currentSelectedMusic, setCurrentSelectedMusic] = useState(null);

  return (
    <MusicChunksContext.Provider value={{ musicChunks, setMusicChunks }}>
      <MusicContext.Provider
        value={{ audioContext, currentSelectedMusic, setCurrentSelectedMusic }}
      >
        <div className="App" style={{ background: colors.secondary1 }}>
          <Stack direction="row" height="100vh">
            <Grid container>
              <Grid
                height="100%"
                item
                xs={4}
                md={4}
                lg={4}
                sx={{ borderRight: "1px solid #000" }}
              >
                <MusicList />
              </Grid>
              <Grid item xs={8} md={8} lg={8}>
                <Stack borderBottom="1px solid #000" height="40vh" width="100%">
                  {!!currentSelectedMusic && (
                    <MusicTrimmingArea key={currentSelectedMusic?.id} />
                  )}
                </Stack>
                <Stack height="60vh">
                  <ReArranageArea />
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </div>
      </MusicContext.Provider>
    </MusicChunksContext.Provider>
  );
}

export default App;
