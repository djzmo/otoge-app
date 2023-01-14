import express from "express"
import cors from "cors"
import { Client } from "redis-om"
import StoreRepository from "./repository/StoreRepository"
import StoreService from "./service/StoreService"
;(async () => {
  const client = await new Client().open(
    process.env.REDIS_URL || "redis://redis:6379"
  )
  await client.execute(["FLUSHALL"])
  const storeRepository = new StoreRepository(client)
  const storeService = new StoreService(storeRepository)

  const app = express()
  const port = process.env.PORT || 3000

  app.use(express.json())
  app.use(cors())

  app.get("/store/searchByText", async (req, res) => {
    const { query } = req.query
    if (typeof query !== "string" || query.length < 2) {
      res.json([])
    } else {
      const result = await storeService.searchByQueryString(query)
      res.json(result)
    }
  })

  app.get("/store/searchByPosition", async (req, res) => {
    const { lat, lng } = req.query
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      res.json([])
    } else {
      const result = await storeService.searchByPosition(
        parseFloat(lat as string),
        parseFloat(lng as string)
      )
      res.json(result)
    }
  })

  app.listen(port, () => {
    console.log(`Listening at ${port}`)
  })
})()
