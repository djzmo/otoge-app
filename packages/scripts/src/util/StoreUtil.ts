import { CabinetInfo, GameEnum, Store } from "@otoge.app/shared"
import { normalize } from "@geolonia/normalize-japanese-addresses"
import {
  createRomanization,
  normalizeSymbols,
  toHalfWidthAlphanumeric,
} from "./TextUtil"
import { existsSync } from "fs"
import fs from "fs/promises"
import { compareTwoStrings } from "string-similarity"
import { asyncFilter } from "./CollectionUtil"

export const updateStore = (
  existing: Store,
  candidate: Store,
  gameEnum: GameEnum,
  updateStoreName = false
): Store => {
  const merged = Object.assign({}, existing)
  const cabinets = merged.cabinets.filter(
    (cabinet: CabinetInfo) => cabinet.game === gameEnum
  )
  const existingNameHw = normalizeSymbols(
    toHalfWidthAlphanumeric(existing.storeName)
  )
  const candidateNameHw = normalizeSymbols(
    toHalfWidthAlphanumeric(candidate.storeName)
  )
  const existingAddressHw = normalizeSymbols(
    toHalfWidthAlphanumeric(existing.address)
  )
  const candidateAddressHw = normalizeSymbols(
    toHalfWidthAlphanumeric(candidate.address)
  )
  if (cabinets.length === 0) {
    merged.cabinets.push({ game: gameEnum })
  }
  if (updateStoreName) {
    merged.storeName = candidateNameHw
    merged.alternateStoreName = candidate.alternateStoreName
  } else {
    if (
      existingNameHw === candidateNameHw &&
      existing.storeName !== candidate.storeName
    ) {
      merged.storeName = candidateNameHw
    }
    if (existing.alternateStoreName == null) {
      merged.alternateStoreName = candidate.alternateStoreName
    }
  }
  if (
    existingAddressHw === candidateAddressHw &&
    existing.address !== candidate.address
  ) {
    merged.address = candidateAddressHw
  }
  if (existing.access == null) {
    merged.access = candidate.access
  }
  if (existing.openingHours == null) {
    merged.openingHours = candidate.openingHours
  }
  if (existing.alternateArea == null) {
    merged.alternateArea = candidate.alternateArea
  }
  if (existing.alternateAddress == null) {
    merged.alternateAddress = candidate.alternateAddress
  }
  merged.context = Object.assign(existing.context, candidate.context)
  return merged
}

export const mergeStores = async (
  master: Store[],
  candidates: Store[],
  gameEnum: GameEnum,
  contextIdKey: string
): Promise<Store[]> => {
  console.debug(
    `Merging result to master data... Candidates to process: ${candidates.length}`
  )

  const getContextId = (store: Store, contextKey: string) =>
    contextKey === "allNetSid"
      ? store.context.allNetSid
      : store.context.eAmusementFdesc

  const processedCandidateIndex: number[] = []

  const removeProcessed = () => {
    if (processedCandidateIndex.length === 0) {
      return
    }
    const processedCandidates = processedCandidateIndex.map(
      index => candidates[index]
    )
    for (const candidate of processedCandidates) {
      candidates.splice(candidates.indexOf(candidate), 1)
    }
    processedCandidateIndex.splice(0, processedCandidateIndex.length)
  }

  // By context ID
  console.debug(`Merging by context ID... Remaining: ${candidates.length}`)
  const candidateIdToIndex = Object.fromEntries(
    candidates.map((store, index) => [getContextId(store, contextIdKey), index])
  )
  const masterIdToIndex: { [id: string]: number } = {}
  const candidateById: { [id: string]: Store } = Object.fromEntries(
    candidates.map(store => [getContextId(store, contextIdKey), store])
  )
  const masterById: { [id: string]: Store } = Object.fromEntries(
    master.map((store, index) => {
      const contextId = getContextId(store, contextIdKey)
      if (contextId == null) {
        return []
      }
      masterIdToIndex[contextId] = index
      return [contextId, store]
    })
  )
  for (const [id, candidate] of Object.entries(candidateById)) {
    const existing = masterById[id]
    if (existing == null) {
      continue
    }
    const masterIndex = masterIdToIndex[id]
    const candidateIndex = candidateIdToIndex[id]
    master[masterIndex] = updateStore(existing, candidate, gameEnum)
    processedCandidateIndex.push(candidateIndex)
  }
  console.debug(`Merged ${processedCandidateIndex.length} store(s)`)

  removeProcessed()

  // By exact store name
  console.debug(
    `Merging by exact store name... Remaining: ${
      candidates.length - processedCandidateIndex.length
    }`
  )
  if (candidates.length > 0) {
    const candidateNameToIndex = Object.fromEntries(
      candidates.map((store, index) => [
        store.storeName.replaceAll(/\s+/g, ""),
        index,
      ])
    )
    const masterNameToIndex: { [storeName: string]: number } = {}
    const candidateByName = Object.fromEntries(
      candidates.map(store => [store.storeName.replaceAll(/\s+/g, ""), store])
    )
    const masterByName = Object.fromEntries(
      master.map((store, index) => {
        masterNameToIndex[store.storeName.replaceAll(/\s+/g, "")] = index
        return [store.storeName.replaceAll(/\s+/g, ""), store]
      })
    )
    for (const [storeName, candidate] of Object.entries(candidateByName)) {
      const existing = masterByName[storeName]
      if (existing == null) {
        continue
      }
      const masterIndex = masterNameToIndex[storeName]
      const candidateIndex = candidateNameToIndex[storeName]
      master[masterIndex] = updateStore(existing, candidate, gameEnum)
      processedCandidateIndex.push(candidateIndex)
    }
  }
  console.debug(`Merged ${processedCandidateIndex.length} store(s)`)

  removeProcessed()

  // By address
  console.debug(
    `Merging by address... Remaining: ${
      candidates.length - processedCandidateIndex.length
    }`
  )
  if (candidates.length > 0) {
    const masterByArea: { [area: string]: Store[] } = {}
    let currentCount = 1
    for (const candidate of candidates) {
      if (!(candidate.area in masterByArea)) {
        masterByArea[candidate.area] = master.filter(
          store => store.area === candidate.area
        )
      }
      process.stdout.write(
        `[${currentCount} / ${candidates.length}] Merging ${candidate.storeName}... `
      )
      const foundList = await asyncFilter(
        masterByArea[candidate.area],
        async (compare: Store) => {
          const compareNameNs = compare.storeName
            .toLowerCase()
            .replaceAll(/\s+/g, "")
          const candidateNameNs = candidate.storeName
            .toLowerCase()
            .replaceAll(/\s+/g, "")
          if (
            !compareNameNs.includes(candidateNameNs) &&
            !candidateNameNs.includes(compareNameNs)
          ) {
            if (compareTwoStrings(compareNameNs, candidateNameNs) < 0.6) {
              return false
            }
          }
          const compareAddrNs = compare.address.replaceAll(/\s+/g, "")
          const candidateAddrNs = candidate.address.replaceAll(/\s+/g, "")
          const compareAddr = await normalize(compareAddrNs)
          const candidateAddr = await normalize(candidateAddrNs)
          const chomeRegex = /([0-9]{1,4})-([0-9]{1,4})(?:-([0-9]{1,4}))?/
          const compareAddrMatch = chomeRegex.exec(compareAddrNs)
          const candidateAddrMatch = chomeRegex.exec(candidateAddrNs)
          if (
            compareAddrMatch != null &&
            candidateAddrMatch != null &&
            compareAddrMatch.length >= 3 &&
            candidateAddrMatch.length >= 3
          ) {
            const compareChome = compareAddrMatch[1]
            const candidateChome = candidateAddrMatch[1]
            const compareBanchi = compareAddrMatch[2]
            const candidateBanchi = candidateAddrMatch[2]
            const compareGo =
              compareAddrMatch.length > 3 ? compareAddrMatch[3] : null
            const candidateGo =
              candidateAddrMatch.length > 3 ? candidateAddrMatch[3] : null
            return (
              compareAddr.pref === candidateAddr.pref &&
              compareAddr.city === candidateAddr.city &&
              compareAddr.town === candidateAddr.town &&
              compareChome === candidateChome &&
              compareBanchi === candidateBanchi &&
              compareGo === candidateGo
            )
          } else {
            return (
              compareAddr.pref === candidateAddr.pref &&
              compareAddr.city === candidateAddr.city &&
              compareAddr.town === candidateAddr.town &&
              (compareAddr.addr.includes(candidateAddr.addr) ||
                candidateAddr.addr.includes(compareAddr.addr))
            )
          }
        }
      )
      if (foundList.length > 0) {
        const existing = foundList[0]
        const masterIndex = master.indexOf(existing)
        const candidateIndex = candidates.indexOf(candidate)
        master[masterIndex] = updateStore(existing, candidate, gameEnum)
        processedCandidateIndex.push(candidateIndex)
        if (foundList.length > 1) {
          process.stdout.write(
            "MERGED - Ambiguous: " + JSON.stringify({ candidate, foundList })
          )
        } else {
          process.stdout.write("MERGED")
        }
      } else {
        process.stdout.write("NEW")
      }
      process.stdout.write("\n")
      currentCount++
    }
  }
  console.debug(`Merged ${processedCandidateIndex.length} store(s)`)

  removeProcessed()

  console.debug(
    `Merge completed. ${candidates.length} new store(s) will be added.`
  )

  return [...master, ...candidates]
}

export const enrichStore = async (store: Store) => {
  if (store.lat == null || store.lng == null) {
    const result = await normalize(store.address)
    if (result != null && result.lat != null && result.lng != null) {
      store.lat = result.lat
      store.lng = result.lng
    }
  }
  if (store.country === "JP") {
    if (store.alternateArea == null) {
      store.alternateArea = await createRomanization(store.area)
    }
    if (store.alternateStoreName == null) {
      store.alternateStoreName = await createRomanization(store.storeName)
    }
    if (store.alternateAddress == null) {
      store.alternateAddress = await createRomanization(store.address)
    }
  }
  return store
}

export const writeResult = async (
  result: { [country: string]: Store[] },
  gameEnum: GameEnum,
  contextIdKey: string,
  outputDir: string
) => {
  for (const country in result) {
    const targetFile = `${outputDir}/${country}.json`
    const existingData = existsSync(targetFile)
      ? await fs.readFile(targetFile, "utf8")
      : null
    const newData = result[country]
    let sortedData: Store[] = existingData
      ? newData.sort((a: Store, b: Store) =>
          a.storeName.localeCompare(b.storeName)
        )
      : []

    if (existingData) {
      const existingDataParsed: Store[] = JSON.parse(existingData)
      const mergedData = await mergeStores(
        existingDataParsed,
        newData,
        gameEnum,
        contextIdKey
      )
      sortedData = mergedData.sort((a: Store, b: Store) =>
        a.storeName.localeCompare(b.storeName)
      )
    }
    const enrichedData = await Promise.all(sortedData.map(enrichStore))
    await fs.writeFile(targetFile, JSON.stringify(enrichedData, null, "\t"))
  }
}
