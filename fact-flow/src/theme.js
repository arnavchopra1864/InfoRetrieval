import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";

const theme = extendTheme(
  {
    colors: {
      brand: {
        50: "#BFD6EA",
        100: "#AAC9E3",
        200: "#95BBDB",
        300: "#80ADD4",
        400: "#6AA0CD",
        500: "#5592C6",
        600: "#4A80AD",
        700: "#406E95",
        800: "#355B7C",
        900: "#2B4963",
      },
    },
    styles: {
      global: {
        body: {
          fontFamily: "Spline Sans",
        },
      },
    },
  },
  withDefaultColorScheme({
    colorScheme: "brand",
    components: ["Button", "Tabs"],
  })
);

export default theme;
