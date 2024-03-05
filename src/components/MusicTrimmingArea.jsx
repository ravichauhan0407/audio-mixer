import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import { color, motion, useAnimationControls } from "framer-motion";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import { FaPause, FaPlay } from "react-icons/fa";
import Draggable from "react-draggable";
import pointer from "../assets/pointer.png";
import ReactPlayer from "react-player";
import { MusicChunksContext } from "../Context/MusicChunksContext";
import colors from "../colors";
import { MusicContext } from "../Context/MusicContext";
import { v4 as uuidv4 } from "uuid";

const PARENT_SIZE = 400;
const INTIAL_WINDOW_SIZE = 100;

function secondsToMinutes(totalSeconds) {
  var minutes = Math.floor(totalSeconds / 60);
  var seconds = Number(totalSeconds % 60).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}
const strips = Array(40)?.fill(0);

const MusicTrimmingArea = () => {
  const { setMusicChunks, musicChunks } = useContext(MusicChunksContext);
  const {
    currentSelectedMusic: { src, name },
  } = useContext(MusicContext);

  const [audio] = useState(new Audio(src));
  const [seconds, setSeconds] = useState(0);
  const dragHandleRef1 = useRef();
  const dragHandleRef2 = useRef();

  const controls = useAnimationControls();
  const [isPlaying, setIsPlaying] = useState(false);
  const parentRef = useRef();
  const [currentTime, setCurrentTime] = useState(0);
  const [windowCordinate, setWindowCordinate] = useState({
    start: 0,
    end: INTIAL_WINDOW_SIZE,
  });
  const [duration, setDuration] = useState();

  const audioElement = useRef();

  const startFromGivenPoint = (point) => {
    audioElement.current.currentTime = point;
  };

  const handleDrag = (e) => {
    e.stopPropagation();
    const { left: lef1 } = parentRef.current?.getBoundingClientRect();
    const { left: lef2, width } =
      dragHandleRef1.current?.getBoundingClientRect();
    const { left: lef3 } = dragHandleRef2.current?.getBoundingClientRect();
    const leftExtreme = Math.min(lef2, lef3) - lef1 + width / 2;
    const rightExtreme = Math.max(lef2, lef3) - lef1 + width / 2;

    const start = secondsToMinutes((leftExtreme / PARENT_SIZE) * seconds);
    setDuration({
      start,
      end: secondsToMinutes((rightExtreme / PARENT_SIZE) * seconds),
    });
    setWindowCordinate({
      start: leftExtreme,
      end: rightExtreme,
    });
  };

  const togglePlayback = () => {
    if (audioElement.current.paused) {
      audioElement.current.currentTime = currentTime;
      controls.start((i) => ({
        scaleY: [0.5, (Math.random() * 10) % 2.4],
        transition: {
          repeat: Infinity,
          duration: 0.5,
        },
      }));
      audioElement.current.play();
    } else {
      audioElement.current.pause();
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioElement.current.currentTime);
  };

  const onLoadMetaData = (event) => {
    const totalTime = event.target.duration;
    setSeconds(totalTime);
    setDuration({
      start: secondsToMinutes(0),
      end: secondsToMinutes(
        totalTime *
          ((windowCordinate.end - windowCordinate.start) / PARENT_SIZE)
      ),
    });
  };

  const handleExtractChunk = async () => {
    const audioContext = new AudioContext();
    let audioBuffer = await fetch(src);
    audioBuffer = await audioBuffer.arrayBuffer();
    audioBuffer = await audioContext.decodeAudioData(audioBuffer);

    const start = (windowCordinate.start / PARENT_SIZE) * seconds;
    const end = (windowCordinate.end / PARENT_SIZE) * seconds;
    const startSample = Math.floor(start * audioBuffer.sampleRate);
    const endSample = Math.floor(end * audioBuffer.sampleRate);
    const duration1 = endSample - startSample;

    const newBuffer = audioContext.createBuffer(
      1,
      duration1,
      audioBuffer.sampleRate
    );
    const newChannelData = newBuffer.getChannelData(0);
    const channelData = audioBuffer.getChannelData(0);

    for (let i = 0; i < duration1; i++) {
      newChannelData[i] = channelData[i + startSample];
    }
    setMusicChunks((prev) => [
      ...prev,
      {
        src: newBuffer,
        id: uuidv4(),
        name: `${name} Chunk ${(musicChunks?.length || 0) + 1}`,
      },
    ]);
  };

  return (
    <Stack
      gap={4}
      py={4}
      width="100%"
      height="100%"
      position="relative"
      justifyContent="center"
      alignItems="center"
    >
      <audio
        ref={audioElement}
        src={audio.src}
        onLoadedMetadata={onLoadMetaData}
        onTimeUpdate={handleTimeUpdate}
        onPause={() => {
          controls.stop();
          setIsPlaying(false);
        }}
      />
      {!!name && (
        <Typography
          color={colors.primary}
          fontSize={18}
          fontWeight={600}
          sx={{ position: "absolute", top: 16, left: 16 }}
        >
          {name} (Editing)
        </Typography>
      )}
      <Stack direction="row" alignItems="center" gap={2}>
        <IconButton
          onClick={() => {
            togglePlayback();
            setIsPlaying((prev) => !prev);
          }}
          sx={{ background: `${colors.primary}!important` }}
        >
          {!isPlaying && (
            <FaPlay style={{ fontSize: 40, color: colors.secondary2 }} />
          )}
          {isPlaying && (
            <FaPause style={{ fontSize: 40, color: colors.secondary2 }} />
          )}
        </IconButton>
        <Stack
          direction="row"
          gap={1}
          alignItems="center"
          bgcolor={colors.secondary2}
          height={90}
          ref={parentRef}
          position="relative"
          width={PARENT_SIZE}
          onClick={(e) => {
            const { clientX } = e;
            const { left } = parentRef?.current?.getBoundingClientRect();

            startFromGivenPoint(((clientX - left) / PARENT_SIZE) * seconds);
          }}
        >
          <div
            style={{
              position: "absolute",
              height: 90,
              width: 4,
              left: (currentTime / seconds) * PARENT_SIZE,
              background: "green",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: 0,
                transform: "translate(0%,100%)",
                color: "#fff",
                background: "#000",
              }}
            >
              {secondsToMinutes(currentTime)}
            </div>
          </div>
          {strips?.map((item, index) => (
            <motion.div
              custom={index}
              animate={controls}
              style={{
                height: 10 * ((Math.random() * 10) % 4),
                width: 5,
                backgroundColor: colors.primary,
                borderRadius: 2.5,
                zIndex: 100,
              }}
            />
          ))}
          <div
            style={{
              height: 40,
              position: "absolute",
              left: -20,
              right: -20,
              top: 0,
              transform: "translate(0,-100%)",
            }}
            onClickCapture={(e) => e.stopPropagation()}
          >
            <Draggable bounds="parent" onDrag={handleDrag}>
              <img
                ref={dragHandleRef1}
                draggable="false"
                src={pointer}
                alt="pointer"
                style={{
                  height: 40,
                  width: 40,
                  left: 0,
                  position: "absolute",
                }}
              />
            </Draggable>
            <Draggable bounds="parent" onDrag={handleDrag}>
              <img
                ref={dragHandleRef2}
                draggable="false"
                src={pointer}
                alt="pointer"
                style={{
                  height: 40,
                  width: 40,
                  position: "absolute",
                  left: INTIAL_WINDOW_SIZE,
                }}
              />
            </Draggable>
          </div>

          <div
            style={{
              height: 90,
              left: windowCordinate.start,
              width: windowCordinate.end - windowCordinate.start,
              backgroundColor: "rgba(191,223,203,0.5)",
              position: "absolute",
            }}
          >
            <div
              style={{
                position: "absolute",
                resize: "both",
                left: 2,
                bottom: 0,
                background: "#fff",
              }}
            >
              <div>{duration?.start}</div>
            </div>
            <div
              style={{
                position: "absolute",
                right: 0,
                bottom: 0,
                transform: "translate(100%,0%)",
                background: "#fff",
              }}
            >
              {duration?.end}
            </div>
          </div>
        </Stack>
      </Stack>
      <Button
        variant="contained"
        onClick={handleExtractChunk}
        sx={{
          background: `${colors.primary}!important`,
          position: "absolute",
          bottom: 16,
          right: 16,
          width: 150,
        }}
      >
        Save
      </Button>
    </Stack>
  );
};

export default MusicTrimmingArea;
