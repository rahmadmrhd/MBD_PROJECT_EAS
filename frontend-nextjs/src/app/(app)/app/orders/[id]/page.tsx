import { Box, Typography } from "@mui/joy";
import * as React from "react";
import FormOrder from "./formOrder";

function Order({ params }: { params: { id: string } }) {
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
          Order
        </Typography>
      </Box>
      <FormOrder idOrder={Number(params.id)} />
    </>
  );
}

export default Order;
