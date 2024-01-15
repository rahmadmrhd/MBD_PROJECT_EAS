"use client";

import React from "react";
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import {
  experimental_extendTheme as materialExtendTheme,
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import CssBaseline from "@mui/joy/CssBaseline";

function MuiSetup({ children }: { children: React.ReactNode }) {
  const materialTheme = materialExtendTheme();
  return (
    <MaterialCssVarsProvider
      defaultMode='light'
      theme={{ [MATERIAL_THEME_ID]: materialTheme }}
    >
      <JoyCssVarsProvider defaultMode='light'>
        <CssBaseline enableColorScheme />
        {children}
      </JoyCssVarsProvider>
    </MaterialCssVarsProvider>
  );
}

export default MuiSetup;
