import { Box, Typography } from "@mui/joy";
import React from "react";
import Table from "./tableTabel";

function Home() {
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
          Table
        </Typography>
      </Box>
      <Table />
    </>
  );
}

export default Home;
