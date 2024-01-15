"use client";
import * as React from "react";
import { useColorScheme as useJoyColorScheme } from "@mui/joy/styles";
import { useColorScheme as useMaterialColorScheme } from "@mui/material/styles";
import IconButton, { IconButtonProps } from "@mui/joy/IconButton";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function ColorSchemeToggle(props: IconButtonProps) {
  const { onClick, sx, ...other } = props;
  const { mode, setMode: setMaterialMode } = useMaterialColorScheme();
  const { setMode: setJoyMode } = useJoyColorScheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return (
      <IconButton
        size='sm'
        variant='outlined'
        color='neutral'
        {...other}
        sx={sx}
        disabled
      />
    );
  }
  return (
    <IconButton
      id='toggle-mode'
      size='sm'
      variant='outlined'
      color='neutral'
      {...other}
      onClick={(event) => {
        if (mode === "light") {
          setMaterialMode("dark");
          setJoyMode("dark");
        } else {
          setMaterialMode("light");
          setJoyMode("light");
        }
        onClick?.(event);
      }}
      sx={[
        {
          "& > *:first-child": {
            display: mode === "dark" ? "none" : "initial",
          },
          "& > *:last-child": {
            display: mode === "light" ? "none" : "initial",
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Icon icon='mdi:brightness-2' />
      <Icon icon='material-symbols-light:brightness-7-rounded' />
    </IconButton>
  );
}
