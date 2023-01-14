import * as React from "react"
import MapContext from "../context/MapContext"
import { useCallback, useContext } from "react"
import {
  GoogleMap,
  GoogleMapProps,
  LoadScript,
  Marker,
} from "@react-google-maps/api"
import { Box, Flex } from "@chakra-ui/react"
import StoreCard from "./StoreCard"

export default function Map(props: GoogleMapProps) {
  const { markers, setMap, selectedStore, setSelectedStore, stores } =
    useContext(MapContext)
  const onLoad = useCallback(
    (map: google.maps.Map) => {
      setMap(map)
    },
    [setMap]
  )
  const handleMarkerClick = (index: number) => {
    if (stores) {
      setSelectedStore(stores[index])
    }
  }
  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""}
    >
      <GoogleMap
        onLoad={onLoad}
        options={{
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
        }}
        mapContainerStyle={{ height: "100vh", width: "100wh" }}
        {...props}
      >
        {markers?.map((props, index) => (
          <Marker
            key={`storeMarker-${index}`}
            {...props}
            onClick={() => handleMarkerClick(index)}
          />
        ))}
        {selectedStore && (
          <Flex
            position="fixed"
            bottom="0"
            w={{ base: "95vw", md: "50vw", "2xl": "35vw" }}
          >
            <Box width="100%">
              <StoreCard
                store={selectedStore}
                marginLeft="5"
                marginBottom="5"
              />
            </Box>
          </Flex>
        )}
      </GoogleMap>
    </LoadScript>
  )
}
