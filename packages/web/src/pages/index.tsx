import {Inter} from 'next/font/google'
import Map from "@/components/Map";
import MapProvider from "@/contexts/MapProvider";
import MainSheet from "@/components/MainSheet";
import StoreSheet from "@/components/StoreSheet";
import {useState} from "react";
import {Store} from "@otoge.app/shared";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    const [selectedStore, setSelectedStore] = useState<Store | undefined>()
    const onSelectStore = (data: Store) => {
        setSelectedStore(data)
    }
    const onStoreSheetClose = () => {
        setSelectedStore(undefined)
    }
  return (
    <MapProvider>
      <main
          className={`${inter.className}`}
      >
          <div className="absolute left-0 bottom-0 w-full h-full">
              <Map
                  center={{
                      lat: 35.6793168,
                      lng: 139.761269
                  }}
                  zoom={13}
              />
          </div>
          <MainSheet onSelectStore={onSelectStore} className={`${selectedStore != null ? "hidden" : ""}`} />
          {/*<StoreSheet data={selectedStore} isOpen={selectedStore != null} onClose={onStoreSheetClose} />*/}
      </main>
    </MapProvider>
  )
}
