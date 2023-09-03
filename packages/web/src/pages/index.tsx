import { Inter } from 'next/font/google'
import Map from "@/components/Map";
import MapProvider from "@/contexts/MapProvider";
import {FaMusic} from "react-icons/fa6";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
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
          <div className="absolute left-0 w-full">
              <div className="p-4">
                  <input type="text" id="hs-leading-icon" name="hs-leading-icon"
                         className="py-3 px-4 pl-11 block w-full border-gray-200 shadow-sm rounded-md text-sm rounded-3xl focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400"
                         placeholder="Search location or game name" />
                      <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-20 pl-8">
                          <FaMusic className="text-white" />
                      </div>
              </div>
          </div>
      </main>
    </MapProvider>
  )
}
