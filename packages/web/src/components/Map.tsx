import * as React from "react"
import MapContext from "../contexts/MapContext"
import { useCallback, useContext } from "react"
import {
  GoogleMap,
  GoogleMapProps,
  LoadScript,
  Marker,
} from "@react-google-maps/api"

interface MapProps {
  className?: string
}

export default function Map(props: GoogleMapProps | MapProps) {
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
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
    >
      <GoogleMap
        onLoad={onLoad}
        options={{
          streetViewControl: false,
          fullscreenControl: false,
          mapTypeControl: false,
          gestureHandling: 'greedy',
          zoomControl: false
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
      </GoogleMap>
    </LoadScript>
  )
}
