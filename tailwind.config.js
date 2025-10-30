/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        theme: "#2E2E2E",
        themeRed: "#E13743",
        themeBlue: "#1860CC",
        themeGreen: "#139013",
        themeGray: "#F4F5FA",
        themeLightGray: "#FFFFFF99",
        themeBorder: "#FFFFFF1F",
        themeBorderGray: "#00000099",
        themeInput: "#F4F4F4",
      },
      fontFamily: {
        switzer: ["Switzer", "sans-serif"],
        norms: ["TT Norms Pro", "sans-serif"],
      },
      boxShadow: {
        textShadow:
          "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          cardShadow:"0px 0px 6px 0px rgba(0, 0, 0, 0.08)",
          cardShadowHover:"0px 0px 6px 0px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [],
};
