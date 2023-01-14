import SearchResultItem from "./SearchResultItem"
import * as React from "react"
import { Box, Heading, Stack, StackProps } from "@chakra-ui/react"
import MapContext from "../context/MapContext"
import { useContext } from "react"
import { Store } from "@otoge.app/shared"

interface SearchResultProps extends StackProps {
  result?: Store[]
  query?: string
  isNearby?: boolean
}

export default function SearchResult({
  result,
  query,
  isNearby,
  ...props
}: SearchResultProps) {
  const { map, setSelectedStore, selectedStore } = useContext(MapContext)
  const handleClick = (store: Store) => {
    const { lat, lng } = store
    map?.panTo({ lat, lng })
    map?.setZoom(17)
    setSelectedStore(store)
  }
  return (
    <Stack {...props}>
      <Box p="5">
        {!isNearby && query && (
          <Heading fontSize="lg">
            {result?.length ? "Search result for" : "Nothing found for"} "
            {query}"
          </Heading>
        )}
        {isNearby && (
          <Heading fontSize="lg">
            {result?.length
              ? `Found ${result.length} locations nearby`
              : "Looks like there is none yet near you :("}
          </Heading>
        )}
      </Box>
      <Box overflowY="auto" height="100vh">
        {result?.map((store, index) => (
          <SearchResultItem
            key={index}
            index={index}
            storeName={store.storeName}
            isSelected={selectedStore === store}
            onClick={() => handleClick(store)}
          />
        ))}
      </Box>
    </Stack>
  )
}
