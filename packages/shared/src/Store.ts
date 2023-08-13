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
  access?: string
  lat: number
  lng: number
  openingHours?: string
  cabinets: CabinetInfo[]
  context: ContextInfo
}
