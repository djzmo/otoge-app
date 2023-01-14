import * as React from "react"
import { ChakraProvider, theme } from "@chakra-ui/react"
import IndexPage from "./page/IndexPage"
import GoogleFontLoader from "react-google-font-loader"

export const App = () => (
  <ChakraProvider theme={theme}>
    <GoogleFontLoader fonts={[{ font: "Nabla" }]} />
    <IndexPage />
  </ChakraProvider>
)
