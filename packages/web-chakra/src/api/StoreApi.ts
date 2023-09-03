import { Store } from "@otoge.app/shared"
import { api } from "./config/axios"

export default abstract class StoreApi {
  static async searchByText(query: string): Promise<Store[]> {
    const response = await api.get(`/store/searchByText?query=${query}`)
    return response.data
  }

  static async searchByPosition(lat: number, lng: number): Promise<Store[]> {
    const response = await api.get(
      `/store/searchByPosition?lat=${lat}&lng=${lng}`
    )
    return response.data
  }
}
