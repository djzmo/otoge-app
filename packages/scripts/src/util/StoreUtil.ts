import { CabinetInfo, GameEnum, Store } from "@otoge.app/shared"

export const updateStore = (
  existing: Store,
  candidate: Store,
  gameEnum: GameEnum
): Store => {
  const merged = Object.assign({}, existing)
  const cabinets = merged.cabinets.filter(
    (cabinet: CabinetInfo) => cabinet.game === gameEnum
  )
  if (cabinets.length === 0) {
    merged.cabinets.push({ game: gameEnum })
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
