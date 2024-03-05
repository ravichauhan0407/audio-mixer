import { Box, Grid, IconButton, Stack } from "@mui/material";
import React, { useContext, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import colors from "../colors";
import { MdCancel } from "react-icons/md";
import { MusicContext } from "../Context/MusicContext";
import { GridItem } from "react-grid-dnd";
import { FaPause, FaPlay } from "react-icons/fa";

const ChunkCard = (props) => {
  const {
    data,
    index,
    isPlaying,
    handleOnClick = () => {},
    handleDelete = () => {},
  } = props;

  return (
    <Box
      className="grid-item-content"
      width="100%"
      height="100%"
      bgcolor={colors.white}
      borderRadius={2}
      sx={{
        cursor: "pointer",
        ":hover": {
          "& .remove-icon": {
            opacity: 1,
          },
        },
        position: "relative",
      }}
      p={1}
    >
      <IconButton
        onClick={handleOnClick}
        sx={{
          background: `${colors.primary}!important`,
          position: "absolute",
          left: 8,
          top: 8,
        }}
      >
        {!isPlaying && (
          <FaPlay style={{ fontSize: 20, color: colors.secondary2 }} />
        )}
        {isPlaying && (
          <FaPause style={{ fontSize: 20, color: colors.secondary2 }} />
        )}
      </IconButton>
      <IconButton
        className="remove-icon"
        sx={{
          opacity: 0,
          p: 0,
          position: "absolute",
          right: 0,
          top: 0,
          transform: "translate(50%,-50%)",
          background: `${colors.white}!important`,
        }}
        onClick={handleDelete}
      >
        <MdCancel color={colors.red} />
      </IconButton>
      <Stack
        alignItems="center"
        justifyContent="center"
        color={colors.secondary1}
        fontWeight={600}
      >
        {data?.name}
      </Stack>
    </Box>
  );
};

export default ChunkCard;
