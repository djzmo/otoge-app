import express from "express"
import cors from "cors"
import { Client } from "redis-om"
import winston from "winston";
import StoreRepository from "./repository/StoreRepository"
import StoreService from "./service/StoreService"

(async () => {
  const client = await new Client().open(
    process.env.REDIS_URL || "redis://redis:6379"
  )
  const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "debug",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console()
    ]
  })
  await client.execute(["FLUSHALL"])
  const storeRepository = new StoreRepository(client)
  const storeService = new StoreService(storeRepository)

  const app = express()
  const port = process.env.PORT || 3000

  app.use(express.json())
  app.use(cors())

  app.get("/store/searchByText", async (req, res) => {
    try {
      const { query } = req.query
      if (typeof query !== "string" || query.length < 2) {
        await res.json([])
      } else {
        const result = await storeService.searchByQueryString(query.trim())
        await res.json(result)
      }
    } catch (e) {
      const meta = e instanceof Error ? [e.name, e.message, e.stack] : [e]
      logger.error("Error during searchByText", meta)
      await res.status(500).json([])
    }
  })

  app.get("/store/searchByPosition", async (req, res) => {
    try {
      const { lat, lng } = req.query
      if (Number.isNaN(lat) || Number.isNaN(lng)) {
        await res.json([])
      } else {
        const result = await storeService.searchByPosition(
            parseFloat(lat as string),
            parseFloat(lng as string)
        )
        await res.json(result)
      }
    } catch (e) {
      const meta = e instanceof Error ? [e.name, e.message, e.stack] : [e]
      logger.error("Error during searchByPosition", meta)
      await res.status(500).json([])
    }
  })

  app.listen(port, () => {
    console.log(`Listening at ${port}`)
  })
})()
