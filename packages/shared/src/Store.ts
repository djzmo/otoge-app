import CabinetInfo from "./CabinetInfo"
import ContextInfo from "./ContextInfo"

export default interface Store {
  country: string
  area: string
  alternateArea?: string
  storeName: string
  alternateStoreName?: string
  address: string
  alternateAddress?: string
  lat: number
  lng: number
  cabinets: CabinetInfo[]
  context: ContextInfo
}
