import { CabinetInfo, GameEnum, Store } from "@otoge.app/shared"
import { normalize } from "@geolonia/normalize-japanese-addresses"
import {
  createRomanization,
  normalizeSymbols,
  toHalfWidthAlphanumeric,
} from "./TextUtil"
import { existsSync } from "fs"
import fs from "fs/promises"

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

export const mergeStores = (
  master: Store[],
  candidates: Store[],
  gameEnum: GameEnum,
  contextIdKey: string
): Store[] => {
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
    master[masterIndex] = updateStore(existing, candidate, gameEnum, true)
    processedCandidateIndex.push(candidateIndex)
  }

  removeProcessed()

  // By exact store name
  if (candidates.length > 0) {
    const candidateNameToIndex = Object.fromEntries(
      candidates.map((store, index) => [store.storeName, index])
    )
    const masterNameToIndex: { [storeName: string]: number } = {}
    const candidateByName = Object.fromEntries(
      candidates.map(store => [store.storeName, store])
    )
    const masterByName = Object.fromEntries(
      master.map((store, index) => {
        masterNameToIndex[store.storeName] = index
        return [store.storeName, store]
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

  removeProcessed()

  // By address
  if (candidates.length > 0) {
    for (const candidate of candidates) {
      const foundList = master.filter(compare => {
        return (
          (compare.address.includes(candidate.address) ||
            candidate.address.includes(compare.address)) &&
          (compare.storeName.includes(candidate.storeName) ||
            candidate.storeName.includes(compare.storeName))
        )
      })
      if (foundList.length === 1) {
        const existing = foundList[0]
        const masterIndex = master.indexOf(existing)
        const candidateIndex = candidates.indexOf(candidate)
        master[masterIndex] = updateStore(existing, candidate, gameEnum)
        processedCandidateIndex.push(candidateIndex)
      }
    }
  }

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
      const mergedData = mergeStores(
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
