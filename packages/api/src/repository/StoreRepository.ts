import { GameEnum, Store } from "@otoge.app/shared"
import { Client } from "redis-om"
import { StoreSchema } from "../schema/StoreSchema"
import { readdirSync, readFileSync } from "fs"
import path from "path"

export default class StoreRepository {
  private client: Client
  private readonly masterData: Store[] = []
  // Temporary workaround until redis-om supports embedded objects
  // https://github.com/redis/redis-om-node/issues/46
  private masterIndexMapping: { [id: string]: number } = {}
  private innerRepository

  constructor(client: Client) {
    const dataDir = "./data"
    const jsonFiles = readdirSync(dataDir).filter(
      file => path.extname(file) === ".json"
    )
    this.masterData = jsonFiles.flatMap(file =>
      JSON.parse(readFileSync(path.join(dataDir, file), "utf8"))
    )

    this.client = client
    this.innerRepository = client.fetchRepository(StoreSchema)
    this.innerRepository.createIndex().then(async () => {
      for (const value of this.masterData) {
        const index = this.masterData.indexOf(value)
        const {
          country,
          area,
          alternateArea,
          storeName,
          alternateStoreName,
          address,
          alternateAddress,
          lat,
          lng,
        } = value
        const location = { latitude: lat, longitude: lng }
        const entry = this.innerRepository.createEntity({
          index,
          country,
          area,
          storeName,
          address,
          location: lat || lng ? location : null,
          alternateArea: alternateArea || null,
          alternateStoreName: alternateStoreName || null,
          alternateAddress: alternateAddress || null,
        })
        const id = await this.innerRepository.save(entry)
        this.masterIndexMapping[id] = index
      }
    })
  }

  async searchByQueryString(
    query: string,
    gameFilter: GameEnum[] = []
  ): Promise<Store[]> {
    const ids = await this.innerRepository
      .search()
      .where("storeName")
      .matches(query + "*")
      .or("alternateStoreName")
      .matches(query + "*")
      .or("address")
      .matches(query + "*")
      .or("alternateAddress")
      .matches(query + "*")
      .or("area")
      .matches(query + "*")
      .or("alternateArea")
      .matches(query + "*")
      .or("country")
      .matches(query + "*")
      .returnAllIds()
    const result = ids.map(id => this.masterData[this.masterIndexMapping[id]])
    return this.filterItemsByGame(result, gameFilter)
  }

  async searchByPosition(
    lat: number,
    lng: number,
    radiusInKm: number,
    gameFilter: GameEnum[] = []
  ): Promise<Store[]> {
    try {
      const ids = await this.innerRepository
        .search()
        .where("location")
        .inRadius(
          circle => circle.origin(lng, lat).radius(radiusInKm).kilometers
        )
        .returnAllIds()
      const result = ids.map(id => this.masterData[this.masterIndexMapping[id]])
      return this.filterItemsByGame(result, gameFilter)
    } catch (e) {
      console.error(e)
      return []
    }
  }

  private filterItemsByGame(
    items: Store[],
    gameFilter: GameEnum[] = []
  ): Store[] {
    return gameFilter.length > 0
      ? items.filter(store =>
          gameFilter.every(game =>
            store.cabinets.some(cabinet => cabinet.game === game)
          )
        )
      : items
  }
}
