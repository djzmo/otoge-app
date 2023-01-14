import { createContext } from "react"
import { MarkerProps } from "@react-google-maps/api"
import { Store } from "@otoge.app/shared"

export interface MapContextValue {
  map?: google.maps.Map
  markers?: MarkerProps[]
  stores?: Store[]
  selectedStore?: Store
  query?: string
  setMap?: any
  setMarkers?: any
  setStores?: any
  setSelectedStore?: any
  setQuery?: any
}

const MapContext = createContext<MapContextValue>({})

export default MapContext
