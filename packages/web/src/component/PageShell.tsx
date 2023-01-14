import { Box, useColorModeValue, useDisclosure } from "@chakra-ui/react"
import MobileNavigation from "./MobileNavigation"
import * as React from "react"
import { ReactNode, useContext, useEffect } from "react"
import Sidebar from "./Sidebar"
import MapContext from "../context/MapContext"

export default function PageShell({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { selectedStore, query } = useContext(MapContext)
  useEffect(() => onClose(), [onClose, selectedStore])
  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <Sidebar
        onClose={onClose}
        display={{ base: isOpen ? "flex" : "none", md: "flex" }}
        w={{ base: "full", md: 96 }}
        zIndex="1"
        flexDirection="column"
      />
      <MobileNavigation
        display={{ base: "flex", md: "none" }}
        onOpen={onOpen}
        title={query}
      />
      <Box ml={{ base: 0, md: 96 }}>{children}</Box>
    </Box>
  )
}
