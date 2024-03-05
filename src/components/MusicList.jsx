import { Stack, Typography } from "@mui/material";
import React, { useContext } from "react";
import { dummyData } from "../demo-data";
import colors from "../colors";
import { MusicContext } from "../Context/MusicContext";

const MusicList = () => {
  const { currentSelectedMusic, setCurrentSelectedMusic } =
    useContext(MusicContext);

  return (
    <Stack gap={1.4}>
      <Stack height={60} p={1}>
        <Typography
          width="max-content"
          color={colors.primary}
          fontSize={24}
          fontWeight={600}
        >
         Camb.ai Music
        </Typography>
      </Stack>
      {dummyData?.map((item) => (
        <Stack
          key={item?.id}
          height={60}
          p={1}
          bgcolor={
            currentSelectedMusic?.id === item?.id
              ? colors.secondary2
              : colors.primary
          }
          sx={{
            cursor: "pointer",
            ":hover": {
              transform: "scaleY(1.1)",
            },
          }}
          onClick={() => setCurrentSelectedMusic(item)}
        >
          <Typography
            width="max-content"
            color={
              currentSelectedMusic?.id === item?.id
                ? colors.primary
                : colors.secondary2
            }
            fontSize={16}
            fontWeight={500}
          >
            {item?.name}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
};

export default MusicList;
