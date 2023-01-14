import * as React from "react"
import { ReactNode, useState } from "react"
import MapContext from "./MapContext"

export default function MapProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState()
  const [markers, setMarkers] = useState()
  const [stores, setStores] = useState()
  const [selectedStore, setSelectedStore] = useState()
  const [query, setQuery] = useState()
  return (
    <MapContext.Provider
      value={{
        map,
        setMap,
        markers,
        setMarkers,
        stores,
        setStores,
        selectedStore,
        setSelectedStore,
        query,
        setQuery,
      }}
    >
      {children}
    </MapContext.Provider>
  )
}
