import {
  Card,
  CardHeader,
  Text,
  Link,
  CardProps,
  Badge,
} from "@chakra-ui/react"
import * as React from "react"

interface SearchResultItemProps extends CardProps {
  storeName: string
  index: number
  isSelected?: boolean
  onClick: () => void
}

export default function SearchResultItem({
  storeName,
  index,
  isSelected,
  onClick,
  ...props
}: SearchResultItemProps) {
  return (
    <Link
      href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
      onClick={onClick}
    >
      <Card
        mx="2"
        my="2"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        backgroundColor={isSelected ? "cyan.500" : "white"}
        textColor={isSelected ? "white" : "black"}
        _hover={
          !isSelected
            ? {
                backgroundColor: "gray.100",
              }
            : {}
        }
        {...props}
      >
        <CardHeader>
          <Text size="md" as="b">
            <Badge colorScheme="red">{index + 1}</Badge> {storeName}
          </Text>
        </CardHeader>
      </Card>
    </Link>
  )
}
