import axios from "axios"
import { Text } from "domhandler"
import * as cheerio from "cheerio"
import { existsSync } from "fs"
import * as fs from "fs/promises"
import { CabinetInfo, GameEnum, Store } from "@otoge.app/shared"
// TODO: Provide kuroshiro and kuromoji type definitions
// @ts-ignore
import Kuroshiro from "kuroshiro"
// @ts-ignore
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji"

const outputDir = "../../data"

const countryIdMapping: { [ct: string]: string } = {
  "1000": "JP",
  "1001": "TW",
  "1002": "HK",
  "1003": "SG",
  "1004": "MY",
  "1005": "KR",
  "1006": "TH",
  "1007": "ID",
  "1008": "MO",
  "1009": "US",
  "1010": "PH",
  "1011": "VN",
  "1012": "AU",
  "1013": "MM",
  "1014": "NZ",
}

const gameIdMapping: { [gm: string]: GameEnum } = {
  "34": GameEnum.HATSUNE_MIKU_PROJECT_DIVA_ARCADE,
  "58": GameEnum.CHUNITHM,
  "88": GameEnum.ONGEKI,
  "90": GameEnum.MAIMAI,
  "96": GameEnum.MAIMAI_DX,
  "98": GameEnum.MAIMAI_DX_INTERNATIONAL,
  "104": GameEnum.CHUNITHM_NEW_INTERNATIONAL,
  "109": GameEnum.CHUNITHM_NEW,
}

;(async () => {
  const kuroshiro = new Kuroshiro()
  await kuroshiro.init(new KuromojiAnalyzer())
  const romanizationOptions = {
    to: "romaji",
    mode: "spaced",
    romajiSystem: "passport",
  }

  const gameId = process.argv.length >= 3 ? process.argv[2] : "96"

  if (!(gameId in gameIdMapping)) {
    console.error(`Game ID (${gameId}) not supported`)
    return
  }

  const gameEnum = gameIdMapping[gameId]
  const { data: areaPageData } = await axios.get(
    `https://location.am-all.net/alm/location?lang=en&gm=${gameId}`
  )
  const $areaPage = cheerio.load(areaPageData)
  const countries = $areaPage('select[name="ct"] > option:not(:disabled)')
    .map((i, option) => [
      [option.attribs["value"], (option.firstChild as Text).data],
    ])
    .toArray()
  const areaIds = $areaPage('select[name="at"] > option:not(:disabled)')
    .map((i, option) => option.attribs["value"])
    .toArray()
  const fetchList = countries.flatMap((t): { ct: string; at?: string }[] =>
    t[0] === "1000" ? areaIds.map(vv => ({ ct: t[0], at: vv })) : [{ ct: t[0] }]
  )
  const result: { [country: string]: Store[] } = {}

  // Fetch based on `fetchList` and store in `result`.
  // e.g. [{ ct: "1000", at: "0" }, ..., { ct: "1001" }, ...]
  for (const item of fetchList) {
    const { ct, at } = item

    process.stdout.write(`Fetching gm=${gameId}, ct=${ct}, at=${at}.. `)
    let hasWarn = false

    const { data } = await axios.get(
      `https://location.am-all.net/alm/location?gm=${gameId}&lang=en&ct=${ct}&at=${at}`
    )
    const $areaPage = cheerio.load(data)
    const area = $areaPage(".content_box.mb_20 > h3 > span:first").text()
    const storeList = $areaPage("ul.store_list > li")
    for (const store of storeList) {
      const li = cheerio.load(store)
      const storeName = li("span.store_name").text()
      const address = li("span.store_address").text()

      const detailsUrlStrMatches = li(".bt_details_en")
        .attr("onclick")
        ?.match(/'(.*?)'/)
      const mapUrlStrMatches = li("button.store_bt_google_map_en")
        .attr("onclick")
        ?.match(/'(.*?)'/)

      if (detailsUrlStrMatches == null || mapUrlStrMatches == null) {
        process.stdout.write(
          `\ninvalid details/map URL for ${storeName}.. SKIPPED`
        )
        hasWarn = true
        continue
      }

      const detailsParams = new URLSearchParams(detailsUrlStrMatches[0])
      const sid = detailsParams.get("sid")

      if (sid == null) {
        process.stdout.write(`\nsid is null for ${storeName}.. SKIPPED`)
        hasWarn = true
        continue
      }

      const mapUrl = new URL("https:" + mapUrlStrMatches[1])
      const mapLatLng = mapUrl.searchParams.get("q")?.split("@")[1]?.split(",")

      if (mapLatLng == null) {
        process.stdout.write(`\nlat/lng is null for ${storeName}.. SKIPPED`)
        hasWarn = true
        continue
      }

      const cabinets: CabinetInfo[] = [{ game: GameEnum[gameEnum] }]

      const country: string = countryIdMapping[ct]
      const entry: Store = {
        country,
        area,
        storeName,
        address,
        lat: parseFloat(mapLatLng[0]),
        lng: parseFloat(mapLatLng[1]),
        cabinets,
        context: {
          allNetCt: ct,
          allNetAt: at,
          allNetSid: sid || undefined,
        },
      }

      if (ct === "1000") {
        entry.alternateArea = (
          await kuroshiro.convert(area, romanizationOptions)
        )
          .normalize("NFKC")
          .toUpperCase()
          .trim()
          .replace(/ +(?= )/g, "")
        entry.alternateStoreName = (
          await kuroshiro.convert(storeName, romanizationOptions)
        )
          .normalize("NFKC")
          .toUpperCase()
          .trim()
          .replace(/ +(?= )/g, "")
        entry.alternateAddress = (
          await kuroshiro.convert(address, romanizationOptions)
        )
          .normalize("NFKC")
          .toUpperCase()
          .trim()
          .replace(/ +(?= )/g, "")
      }

      if (!(country in result)) {
        result[country] = []
      }

      result[country].push(entry)
    }

    process.stdout.write(hasWarn ? "\n" : "OK\n")
  }

  // Merge strategy: if a store is already in the database, we only update the
  // null fields except for `cabinets`. Otherwise, we add to the database.
  for (const country in result) {
    const targetFile = `${outputDir}/${country}.json`
    const existingData = existsSync(targetFile)
      ? await fs.readFile(targetFile, "utf8")
      : null
    const newData = result[country]

    if (existingData) {
      const existingDataParsed: Store[] = JSON.parse(existingData)
      const existingWithSid = existingDataParsed.filter(
        store => store.context.allNetSid != undefined
      )
      const existingWithoutSid = existingDataParsed.filter(
        store => store.context.allNetSid == undefined
      )

      const existingBySid: { [sid: string]: Store } = Object.fromEntries(
        existingWithSid.map(store => [store.context.allNetSid, store])
      )
      const newBySid: { [sid: string]: Store } = Object.fromEntries(
        newData.map(store => [store.context.allNetSid, store])
      )

      const existingSids = Object.keys(existingBySid)
      const newSids = Object.keys(newBySid)
      const differenceSids = newSids.filter(sid => !existingSids.includes(sid))

      for (const sid of existingSids) {
        const cabinets = existingBySid[sid].cabinets.filter(
          (cabinet: CabinetInfo) => cabinet.game === gameEnum
        )

        if (newSids.includes(sid)) {
          if (cabinets.length === 0) {
            existingBySid[sid].cabinets.push({ game: gameEnum })
          }
          if (existingBySid[sid].alternateStoreName == null) {
            existingBySid[sid].alternateStoreName =
              newBySid[sid].alternateStoreName
          }
          if (existingBySid[sid].alternateArea == null) {
            existingBySid[sid].alternateArea = newBySid[sid].alternateArea
          }
          if (existingBySid[sid].alternateAddress == null) {
            existingBySid[sid].alternateAddress = newBySid[sid].alternateAddress
          }
        } else if (cabinets.length > 0) {
          existingBySid[sid].cabinets = existingBySid[sid].cabinets.filter(
            (cabinet: CabinetInfo) => cabinet.game !== gameEnum
          )
        }
      }

      const difference = differenceSids.map(sid => newBySid[sid])
      const mergedData: Store[] = [
        ...Object.values(existingBySid),
        ...existingWithoutSid,
        ...difference,
      ]
      const sortedData = mergedData.sort((a: Store, b: Store) =>
        a.storeName.localeCompare(b.storeName)
      )
      await fs.writeFile(targetFile, JSON.stringify(sortedData, null, "\t"))
    } else {
      const sortedData = newData.sort((a: Store, b: Store) =>
        a.storeName.localeCompare(b.storeName)
      )
      await fs.writeFile(targetFile, JSON.stringify(sortedData, null, "\t"))
    }
  }
})()
