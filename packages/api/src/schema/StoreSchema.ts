import { Entity, Schema } from "redis-om"

interface StoreEntity {
  index: number
  country: string
  area: string
  alternateArea: string
  storeName: string
  alternateStoreName: string
  address: string
  alternateAddress: string
  location: { latitude: number; longitude: number }
}

class StoreEntity extends Entity {}

export const StoreSchema = new Schema(StoreEntity, {
  index: { type: "number" },
  country: { type: "text" },
  area: { type: "text" },
  alternateArea: { type: "text" },
  storeName: { type: "text" },
  alternateStoreName: { type: "text" },
  address: { type: "text" },
  alternateAddress: { type: "text" },
  location: { type: "point" },
})
