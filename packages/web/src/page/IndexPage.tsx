import PageShell from "../component/PageShell"
import * as React from "react"
import Map from "../component/Map"
import MapProvider from "../context/MapProvider"

export default function IndexPage() {
  return (
    <MapProvider>
      <PageShell>
        {/* Defaults to Tokyo */}
        <Map
          center={{
            lat: 35.6793168,
            lng: 139.761269,
          }}
          zoom={13}
        />
      </PageShell>
    </MapProvider>
  )
}
