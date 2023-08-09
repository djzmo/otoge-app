import { CabinetInfo, GameEnum, Store } from "@otoge.app/shared"
import { toHalfWidthAlphanumeric } from "./CharUtil"

export const updateStore = (
  existing: Store,
  candidate: Store,
  gameEnum: GameEnum
): Store => {
  const merged = Object.assign({}, existing)
  const cabinets = merged.cabinets.filter(
    (cabinet: CabinetInfo) => cabinet.game === gameEnum
  )
  const existingNameHw = toHalfWidthAlphanumeric(existing.storeName)
  const candidateNameHw = toHalfWidthAlphanumeric(candidate.storeName)
  const existingAddressHw = toHalfWidthAlphanumeric(existing.address)
  const candidateAddressHw = toHalfWidthAlphanumeric(candidate.address)
  if (cabinets.length === 0) {
    merged.cabinets.push({ game: gameEnum })
  }
  if (
    existingNameHw === candidateNameHw &&
    existing.storeName !== candidate.storeName
  ) {
    merged.storeName = candidateNameHw
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
  if (existing.alternateStoreName == null) {
    merged.alternateStoreName = candidate.alternateStoreName
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
    store.context.allNetSid

  const processedCandidateIndex: number[] = []

  const removeProcessed = () => {
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
    master[masterIndex] = updateStore(existing, candidate, gameEnum)
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

  return [...master, ...candidates]
}
