import { Button, Grid, Stack } from "@mui/material";
import React, { useContext, useState } from "react";
import { MusicContext } from "../Context/MusicContext";
import ChunkCard from "./ChunkCard";
import { MusicChunksContext } from "../Context/MusicChunksContext";
import colors from "../colors";
import { GridContextProvider, GridDropZone, GridItem } from "react-grid-dnd";
import "./index.css";
import _ from "lodash";
import concatAudioBuffers from "concat-audio-buffers";
import audioBufferToWav from "audiobuffer-to-wav";
import { FaPause, FaPlay } from "react-icons/fa";

function swap(arr, source, target) {
  const c = arr[source];
  arr[source] = arr[target];
  arr[Math.min(target, arr?.length - 1)] = c;
  return arr;
}

const ReArranageArea = () => {
  const { musicChunks, setMusicChunks } = useContext(MusicChunksContext);
  const [finalMusic, setFinalMusic] = useState();
  const [currentPlayingChunk, setCurrentPlayingChunk] = useState();
  const { audioContext } = useContext(MusicContext);

  const handleOnClick = (data) => {
    if (currentPlayingChunk?.id === data?.id) {
      currentPlayingChunk?.source?.stop();
      setCurrentPlayingChunk(null);
      return;
    }
    if (currentPlayingChunk) {
      currentPlayingChunk?.source?.stop();
    }
    const audioSource = audioContext.createBufferSource();
    setCurrentPlayingChunk({ source: audioSource, id: data?.id });
    audioSource.buffer = data?.src;
    audioSource.connect(audioContext.destination);
    audioSource.start(0);
  };

  const handleDelete = (id) => {
    setMusicChunks((prev) => prev.filter((item) => item?.id !== id));
    if (currentPlayingChunk?.id === id) {
      if (typeof currentPlayingChunk?.stop === "function") {
        currentPlayingChunk?.stop();
      }
      setCurrentPlayingChunk(null);
    }
  };

  function onChange(sourceId, sourceIndex, targetIndex, targetId) {
    console.log(targetId, sourceId);
    console.log(sourceIndex, targetIndex);

    setMusicChunks(swap(_.cloneDeep(musicChunks), sourceIndex, targetIndex));
  }

  function useBuffer(error, combinedBuffer) {
    if (error) {
      console.log(error);
    } else {
      const audioSource = audioContext.createBufferSource();
      audioSource.buffer = combinedBuffer;
      audioSource.connect(audioContext.destination);
      audioSource.start();
      setFinalMusic(audioSource);
    }
  }

  const handlePlayAll = () => {
    if (finalMusic) {
      finalMusic.stop();
      setFinalMusic(null);
    } else {
      const newbuff = musicChunks?.map((item) => item?.src);
      concatAudioBuffers(newbuff, 2, useBuffer);
    }
  };

  return (
    <Stack p={2}>
      <GridContextProvider onChange={onChange}>
        <div className="container">
          <GridDropZone
            className="dropzone left"
            id="left"
            boxesPerRow={4}
            rowHeight={150}
          >
            {musicChunks?.map((item, index) => (
              <GridItem key={item?.id} id={item?.id}>
                <div className="grid-item">
                  <div className="grid-item-content">
                    <ChunkCard
                      data={item}
                      isPlaying={currentPlayingChunk?.id === item?.id}
                      index={index}
                      handleOnClick={() => handleOnClick(item)}
                      handleDelete={(e) => {
                        handleDelete(item?.id);
                        e.stopPropagation();
                      }}
                    />
                  </div>
                </div>
              </GridItem>
            ))}
          </GridDropZone>
        </div>
      </GridContextProvider>
      <Button
        startIcon={finalMusic ? <FaPause /> : <FaPlay />}
        variant="contained"
        onClick={handlePlayAll}
        sx={{
          background: `${colors.primary}!important`,
          position: "absolute",
          bottom: 16,
          right: 16,
          width: 150,
        }}
      >
        {finalMusic ? "Pause All" : "Play All"}
      </Button>
    </Stack>
  );
};

export default ReArranageArea;
