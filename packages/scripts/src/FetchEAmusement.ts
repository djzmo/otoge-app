import axios from "axios"
import * as cheerio from "cheerio"
import { CabinetInfo, GameEnum, Store } from "@otoge.app/shared"
import { writeResult } from "./util/StoreUtil"
import { toHalfWidthAlphanumeric } from "./util/TextUtil"

const outputDir = "../../data"

const areaMapping: { [pref: string]: string } = {
  "JP-01": "北海道",
  "JP-02": "青森県",
  "JP-03": "岩手県",
  "JP-04": "宮城県",
  "JP-05": "秋田県",
  "JP-06": "山形県",
  "JP-07": "福島県",
  "JP-08": "茨城県",
  "JP-09": "栃木県",
  "JP-10": "群馬県",
  "JP-11": "埼玉県",
  "JP-12": "千葉県",
  "JP-13": "東京都",
  "JP-14": "神奈川県",
  "JP-15": "新潟県",
  "JP-16": "富山県",
  "JP-17": "石川県",
  "JP-18": "福井県",
  "JP-19": "山梨県",
  "JP-20": "長野県",
  "JP-21": "岐阜県",
  "JP-22": "静岡県",
  "JP-23": "愛知県",
  "JP-24": "三重県",
  "JP-25": "滋賀県",
  "JP-26": "京都府",
  "JP-27": "大阪府",
  "JP-28": "兵庫県",
  "JP-29": "奈良県",
  "JP-30": "和歌山県",
  "JP-31": "鳥取県",
  "JP-32": "島根県",
  "JP-33": "岡山県",
  "JP-34": "広島県",
  "JP-35": "山口県",
  "JP-36": "徳島県",
  "JP-37": "香川県",
  "JP-38": "愛媛県",
  "JP-39": "高知県",
  "JP-40": "福岡県",
  "JP-41": "佐賀県",
  "JP-42": "長崎県",
  "JP-43": "熊本県",
  "JP-44": "大分県",
  "JP-45": "宮崎県",
  "JP-46": "鹿児島県",
  "JP-47": "沖縄県",
}

const gameIdMapping: { [gm: string]: GameEnum } = {
  DAN: GameEnum.DANCERUSH_STARDOM,
  DDR: GameEnum.DANCEDANCEREVOLUTION,
  DDR20TH: GameEnum.DANCEDANCEREVOLUTION_20TH_ANNIVERSARY_MODEL,
  GITADORADM: GameEnum.GITADORA_DRUMMANIA,
  GITADORAGF: GameEnum.GITADORA_GUITARFREAKS,
  IIDX: GameEnum.BEATMANIA_IIDX,
  IIDX_LN: GameEnum.BEATMANIA_IIDX_LIGHTNING_MODEL,
  JUBEAT: GameEnum.JUBEAT,
  MUSECA: GameEnum.MUSECA,
  PMSP: GameEnum.POP_N_MUSIC,
  REFLECC: GameEnum.REFLEC_BEAT,
  SDVX: GameEnum.SOUND_VOLTEX,
  SDVX_VM: GameEnum.SOUND_VOLTEX_VALKYRIE_MODEL,
}

;(async () => {
  const gameId = process.argv.length >= 3 ? process.argv[2] : "SDVX_VM"

  if (!(gameId in gameIdMapping)) {
    console.error(`Game ID (${gameId}) not supported`)
    return
  }

  const gameEnum = gameIdMapping[gameId]
  const fetchList = [...Array(47).keys()].map(
    i => "JP-" + (i + 1).toString().padStart(2, "0")
  )
  const result: { [country: string]: Store[] } = {}

  // Fetch based on `fetchList` and store in `result`.
  // e.g. ["JP-01", "JP-02", ..., "JP-47"]
  for (const pref of ["JP-13"]) {
    let currentPage = 1
    let pageCount = 1

    while (currentPage <= pageCount) {
      process.stdout.write(
        `Fetching gkey=${gameId}, pref=${pref}, page=${currentPage} `
      )
      const { data } = await axios.get(
        `https://p.eagate.573.jp/game/facility/search/p/list.html?finder=area&gkey=${gameId}&pref=${pref}&page=${currentPage}`,
        {
          headers: {
            Cookie: "facility_dspcount=50",
          },
        }
      )
      const country = pref.substring(0, pref.indexOf("-"))
      const $prefPage = cheerio.load(data)
      const storeList = $prefPage(".cl_shop_bloc")

      currentPage++
      pageCount = $prefPage(".cl_pager_number").length
      if (pageCount === 0) {
        pageCount = 1
      }
      process.stdout.write(`of ${pageCount}..`)

      for (const store of storeList) {
        const fdesc = store.attribs["data-fdesc"]
        const storeName = toHalfWidthAlphanumeric(
          store.attribs["data-name"]
        ).replaceAll("−", "-")
        const address = toHalfWidthAlphanumeric(
          store.attribs["data-address"]
        ).replaceAll("−", "-")
        const access = store.attribs["data-access"]
        const openingHours = store.attribs["data-operationtime"]
        const lat = store.attribs["data-latitude"]
        const lng = store.attribs["data-longitude"]

        const area = areaMapping[pref]
        const cabinets: CabinetInfo[] = [{ game: GameEnum[gameEnum] }]

        const entry: Store = {
          country,
          area,
          storeName,
          address,
          access: access.length > 0 ? access : undefined,
          openingHours: openingHours.length > 0 ? openingHours : undefined,
          lat: parseFloat(lat),
          lng: parseFloat(lng),
          cabinets,
          context: {
            eAmusementFdesc: fdesc,
          },
        }

        if (!(country in result)) {
          result[country] = []
        }

        result[country].push(entry)
      }

      process.stdout.write("OK\n")
    }

    break
  }

  await writeResult(result, gameEnum, "eAmusementFdesc", outputDir)
})()
