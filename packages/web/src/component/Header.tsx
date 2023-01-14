import { CloseButton, Flex, FlexProps, Text } from "@chakra-ui/react"
import * as React from "react"

interface HeaderProps extends FlexProps {
  onClose: () => void
}

export default function Header(props: HeaderProps) {
  return (
    <Flex
      h="20"
      alignItems="center"
      mx="8"
      mt="4"
      mb="2"
      justifyContent="space-between"
    >
      <Text fontSize="3xl" fontFamily="Nabla" fontWeight="bold">
        OTOGE.APP
      </Text>
      <CloseButton
        display={{ base: "flex", md: "none" }}
        onClick={props.onClose}
        ml="4"
      />
    </Flex>
  )
}
