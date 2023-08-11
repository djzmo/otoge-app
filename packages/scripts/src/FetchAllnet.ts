import axios from "axios"
import { Text } from "domhandler"
import * as cheerio from "cheerio"
import { CabinetInfo, GameEnum, Store } from "@otoge.app/shared"
import { normalizeDashes, toHalfWidthAlphanumeric } from "./util/TextUtil"
import { writeResult } from "./util/StoreUtil"

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
      const storeName = normalizeDashes(
        toHalfWidthAlphanumeric(li("span.store_name").text())
      )
      const address = normalizeDashes(
        toHalfWidthAlphanumeric(li("span.store_address").text())
      )

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
      const mapLatLng = mapUrl.searchParams
        .get("q")
        ?.split("@")[1]
        ?.split(",")
        ?.map(val => parseFloat(val))
      const [lat, lng] = mapLatLng || [undefined, undefined]

      const cabinets: CabinetInfo[] = [{ game: GameEnum[gameEnum] }]

      const country: string = countryIdMapping[ct]
      const entry: Store = {
        country,
        area,
        storeName,
        address,
        lat,
        lng,
        cabinets,
        context: {
          allNetCt: ct,
          allNetAt: at,
          allNetSid: sid || undefined,
        },
      }

      if (!(country in result)) {
        result[country] = []
      }

      result[country].push(entry)
    }

    process.stdout.write(hasWarn ? "\n" : "OK\n")
  }

  await writeResult(result, gameEnum, "allNetSid", outputDir)
})()
