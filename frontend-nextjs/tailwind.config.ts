import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  important: "#__next",
  corePlugins: {
    preflight: false,
  },
  plugins: [],
  prefix: "tw-",
  mode: "jit", // Add this line to enable Just-in-Time (JIT) mode
};
export default config;
