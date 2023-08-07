import { GameEnum, Store } from "@otoge.app/shared"
import StoreRepository from "../repository/StoreRepository"

export default class StoreService {
  private repository: StoreRepository

  constructor(repository: StoreRepository) {
    this.repository = repository
  }

  async searchByQueryString(
    query: string,
    gameFilter: GameEnum[] = []
  ): Promise<Store[]> {
    return this.repository.searchByQueryString(query, gameFilter)
  }

  async searchByPosition(
    lat: number,
    lng: number,
    gameFilter: GameEnum[] = []
  ): Promise<Store[]> {
    const tryRadius = [2, 5, 10]
    for (const radius of tryRadius) {
      const result = await this.repository.searchByPosition(
        lat,
        lng,
        radius,
        gameFilter
      )
      if (result.length > 0) {
        return result
      }
    }
    return []
  }
}
