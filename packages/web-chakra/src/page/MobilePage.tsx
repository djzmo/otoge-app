import PageShell from "../component/PageShell"
import * as React from "react"
import Map from "../component/Map"
import MapProvider from "../context/MapProvider"
import {Box} from "@chakra-ui/react";

export default function MobilePage() {
    return (
        <MapProvider>
            <Box pos="absolute" left={0} bottom={0} width="100%">
                <Map
                    center={{
                        lat: 35.6793168,
                        lng: 139.761269,
                    }}
                    zoom={13}
                />
            </Box>
        </MapProvider>
    )
}
