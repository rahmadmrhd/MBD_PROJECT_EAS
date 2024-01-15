import { Box, Typography } from "@mui/joy";
import * as React from "react";
import FormMenu from "../formMenu";

function AddMenu() {
  return (
    <>
      <Box
        sx={{
          display: { md: "flex", xs: "none" },
          mb: 1,
          gap: 1,
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "start", sm: "center" },
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Typography level='h2' component='h1' className=''>
          Menu
        </Typography>
      </Box>
      <FormMenu />
    </>
  );
}

export default AddMenu;
