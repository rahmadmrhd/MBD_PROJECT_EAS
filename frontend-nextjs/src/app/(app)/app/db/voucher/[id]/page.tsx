import { Box, Typography } from "@mui/joy";
import * as React from "react";
import FormVoucher from "../formVoucher";

function EditVoucher({ params }: { params: { id: string } }) {
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
          Voucher
        </Typography>
      </Box>
      <FormVoucher idVoucher={Number(params.id)} />
    </>
  );
}

export default EditVoucher;
