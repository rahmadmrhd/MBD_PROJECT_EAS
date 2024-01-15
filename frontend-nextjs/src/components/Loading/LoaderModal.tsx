"use client";
import { Modal, Box } from "@mui/joy";
import React from "react";
import "./Loading.css";

interface Properties {
  open: boolean;
}

function LoaderModal({ open }: Properties) {
  return (
    <Modal open={open} style={{ zIndex: 10005 }}>
      <Box
        className='hidefocus'
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pt: 8,
          px: 8,
          pb: 8,
        }}
      >
        <svg className='circular' viewBox='25 25 50 50'>
          <circle
            className='path'
            cx='50'
            cy='50'
            r='20'
            fill='none'
            strokeWidth='2'
            strokeMiterlimit='10'
          />
        </svg>
      </Box>
    </Modal>
  );
}

export default LoaderModal;
