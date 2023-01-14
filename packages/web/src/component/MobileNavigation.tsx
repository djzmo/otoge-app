import { Button, Flex, FlexProps, useColorModeValue } from "@chakra-ui/react"
import * as React from "react"
import { Search2Icon } from "@chakra-ui/icons"

interface MobileNavigationProps extends FlexProps {
  title?: string
  onOpen: () => void
}

export default function MobileNavigation({
  title,
  onOpen,
  ...props
}: MobileNavigationProps) {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="flex-start"
      {...props}
    >
      <Button
        variant="outline"
        onClick={onOpen}
        flex="1"
        justifyContent="start"
        py="6"
      >
        <Search2Icon ml="1" mr="3" />
        {title ? title : "Search location"}
      </Button>
    </Flex>
  )
}
