import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react"
import * as React from "react"
import Footer from "./Footer"
import Header from "./Header"
import SearchPanel from "./SearchPanel"

interface SidebarProps extends BoxProps {
  onClose: () => void
}

export default function Sidebar({ onClose, ...props }: SidebarProps) {
  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      borderRight="1px"
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      pos="fixed"
      height="100%"
      {...props}
    >
      <Header onClose={onClose} />
      <SearchPanel />
      <Footer />
    </Box>
  )
}
