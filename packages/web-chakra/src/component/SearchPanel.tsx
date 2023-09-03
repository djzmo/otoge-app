import {
  Box,
  BoxProps,
  Button,
  Flex,
  FormControl,
  Spinner,
} from "@chakra-ui/react"
import SearchInput from "./SearchInput"
import { FiMapPin } from "react-icons/all"
import SearchResult from "./SearchResult"
import * as React from "react"
import { Store } from "@otoge.app/shared"
import { MarkerProps } from "@react-google-maps/api"
import StoreApi from "../api/StoreApi"
import { useContext, useState } from "react"
import MapContext from "../context/MapContext"

export default function SearchPanel(props: BoxProps) {
  const {
    map,
    setMarkers,
    setStores,
    setQuery: setContextQuery,
    setSelectedStore,
  } = useContext(MapContext)
  const [result, setResult] = useState<Store[]>([])
  const [query, setQuery] = useState<string>()
  const [isNearby, setIsNearby] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const applyResult = (stores: Store[]) => {
    setResult(stores)
    setStores(stores)
    if (stores.length > 0) {
      const markers: MarkerProps[] = []
      const bounds = new google.maps.LatLngBounds()
      stores.forEach((store, index) => {
        markers.push({
          position: {
            lat: store.lat,
            lng: store.lng,
          },
          label: (index + 1).toString(),
          options: {
            animation: google.maps.Animation.DROP,
          },
        })
        bounds.extend(new google.maps.LatLng(store.lat, store.lng))
      })
      setMarkers(markers)
      map?.fitBounds(bounds)
    } else {
      setMarkers([])
    }
  }

  const handleSearch = async (search: string) => {
    if (search === query || search.length < 2) {
      return
    }

    setIsNearby(false)
    setQuery(search)
    setContextQuery(search)
    setResult([])
    setIsLoading(true)
    const data = await StoreApi.searchByText(search)
    applyResult(data)
    setIsLoading(false)
    setSelectedStore(null)
  }

  const handleSearchNearby = async () => {
    setIsNearby(true)
    setResult([])
    setContextQuery(null)
    setIsLoading(true)
    navigator?.geolocation.getCurrentPosition(
      async ({ coords: { latitude: lat, longitude: lng } }) => {
        const data = await StoreApi.searchByPosition(lat, lng)
        applyResult(data)
        setIsLoading(false)
        setSelectedStore(null)
      },
      e => {
        alert(e.message)
        setIsLoading(false)
      }
    )
  }

  return (
    <Box {...props}>
      <Flex>
        <Box p="4" w="full">
          <FormControl>
            <SearchInput
              onSearch={handleSearch}
              isReadOnly={isLoading}
              autoFocus={true}
            />
          </FormControl>
          <Button
            w="full"
            mt="4"
            onClick={handleSearchNearby}
            isDisabled={isLoading}
          >
            <FiMapPin /> &nbsp; Search Nearby Locations
          </Button>
        </Box>
      </Flex>
      {isLoading && (
        <Flex justifyContent="center" py="5">
          <Spinner />
        </Flex>
      )}
      {!isLoading && (
        <SearchResult
          result={result}
          query={query}
          isNearby={isNearby}
          height="50vh"
        />
      )}
    </Box>
  )
}
