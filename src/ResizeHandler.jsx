import React, { useState } from "react";
import pointer from "./assets/pointer.png";

const ResizeHandler = ({ position, isLeft = true, handleChange }) => {
  const [isMoving, setIsMoving] = useState(false);

  return (
    <div
      style={{
        position: "absolute",
        ...position,
        transform: "translate(-50%,0%)",
      }}
      // onMouseDown={(e) => e.stopPropagation()}
    >
      <div style={{ width: 20, height: 40, background: "red" }}></div>
      {/* <img
        draggable="false"
        src={pointer}
        alt="pointer"
        style={{ height: 40 }}
      /> */}
    </div>
  );
};

export default ResizeHandler;
