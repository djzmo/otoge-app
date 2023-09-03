import { convertToGameTitle, Store } from "@otoge.app/shared"
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardProps,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react"
import { FiMap, FiMapPin } from "react-icons/all"

interface StoreCardProps extends CardProps {
  store: Store
}

export default function StoreCard({ store, ...props }: StoreCardProps) {
  const handleClickViewOnGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`,
      "_blank"
    )
  }
  return (
    <Card backgroundColor="white" {...props}>
      <CardBody lineHeight="2">
        <Heading fontSize="xl" as="h2">
          {store.storeName}
        </Heading>
        {store.alternateStoreName && (
          <Text fontSize="md" color="gray">
            ({store.alternateStoreName})
          </Text>
        )}
        <Text display="inline-block">
          <FiMapPin style={{ display: "inline", verticalAlign: "middle" }} />{" "}
          {store.address}
        </Text>
        <Flex direction={{ base: "column-reverse", md: "row" }} wrap="wrap">
          {store.cabinets.map(cabinet => (
            <Badge mr="1" marginBottom={{ base: "1", md: 0 }}>
              {convertToGameTitle(cabinet.game)}
            </Badge>
          ))}
        </Flex>
      </CardBody>
      <CardFooter p="0">
        <Button
          flex="1"
          variant="ghost"
          py="6"
          leftIcon={<FiMap />}
          onClick={handleClickViewOnGoogleMaps}
        >
          View on Google Maps
        </Button>
      </CardFooter>
    </Card>
  )
}
