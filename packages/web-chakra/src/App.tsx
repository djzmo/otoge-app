import * as React from "react"
import { ChakraProvider, theme } from "@chakra-ui/react"
import GoogleFontLoader from "react-google-font-loader"
import MobilePage from "./page/MobilePage";

export const App = () => (
  <ChakraProvider theme={theme}>
    <GoogleFontLoader fonts={[{ font: "Nabla" }]} />
    <MobilePage />
  </ChakraProvider>
)
