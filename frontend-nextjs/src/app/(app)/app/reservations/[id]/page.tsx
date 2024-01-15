import { Box, Typography } from "@mui/joy";
import * as React from "react";
import FormReservation from "./formReservation";
import User from "@/src/resources/user/user-model";

function Reservation({ params }: { params: { id: string } }) {
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
          Reservation
        </Typography>
      </Box>
      <FormReservation idReservation={Number(params.id)} />
    </>
  );
}

export default Reservation;
