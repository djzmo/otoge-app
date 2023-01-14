import GameEnum from "./GameEnum"

export default interface CabinetInfo {
  game: GameEnum
  units?: number
  versionName?: string
  remarks?: string
}
