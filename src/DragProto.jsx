import React, { useRef, useState } from "react";
import Draggable from "react-draggable";

const PARENT_SIZE = 400;
const INTIAL_WINDOW_SIZE = 100;

function secondsToMinutes(totalSeconds) {
  var minutes = Math.floor(totalSeconds / 60);
  var seconds = Number(totalSeconds % 60).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

const ResizeHandler = ({ position }) => {
  return (
    <div
      style={{
        width: 2,
        height: "100%",
        position: "absolute",
        backgroundColor: "#fff",
        cursor: "e-resize",
        ...position,
      }}
    ></div>
  );
};

const DragProto = ({ seconds = 120 }) => {
  const parentRef = useRef();
  const childRef = useRef();
  const [currentWindowSize, setCurrentWidowSize] = useState(INTIAL_WINDOW_SIZE);
  const [duration, setDuration] = useState({
    start: 0,
    end: secondsToMinutes(seconds * (currentWindowSize / PARENT_SIZE)),
  });

  const handleDrag = () => {
    const { left: left1, right: right1 } =
      parentRef?.current?.getBoundingClientRect();
    const { left: left2, right: right2 } =
      childRef?.current?.getBoundingClientRect();

    setDuration({
      start: secondsToMinutes(((left2 - left1) / PARENT_SIZE) * seconds),
      end: secondsToMinutes(((right2 - left1) / PARENT_SIZE) * seconds),
    });
  };

  return (
    <div
      ref={parentRef}
      style={{
        width: 400,
        height: 100,
        backgroundColor: "grey",
      }}
    >
      <Draggable bounds="parent" onDrag={handleDrag}>
        <div
          ref={childRef}
          style={{
            height: 100,
            width: 100,
            backgroundColor: "rgb(54, 69, 79)",
            position: "relative",
          }}
        >
          <ResizeHandler position={{ left: 0 }} />
          <ResizeHandler position={{ right: 0 }} />

          <div
            style={{ position: "absolute", resize: "both", left: 2, bottom: 0 }}
          >
            {duration?.start}
          </div>
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              transform: "translate(100%,0%)",
            }}
          >
            {duration?.end}
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default DragProto;
