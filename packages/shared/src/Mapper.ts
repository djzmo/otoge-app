import GameEnum from "./GameEnum"

export function convertToGameTitle(gameEnum: GameEnum) {
  const dict = {
    [GameEnum.HATSUNE_MIKU_PROJECT_DIVA_ARCADE]:
      "Hatsune Miku Project DIVA Arcade",
    [GameEnum.MAIMAI]: "maimai FiNALE",
    [GameEnum.MAIMAI_DX]: "maimai DX",
    [GameEnum.MAIMAI_DX_INTERNATIONAL]: "maimai DX (International)",
    [GameEnum.CHUNITHM]: "CHUNITHM PARADISE LOST",
    [GameEnum.CHUNITHM_NEW]: "CHUNITHM NEW",
    [GameEnum.CHUNITHM_NEW_INTERNATIONAL]: "CHUNITHM NEW (International)",
    [GameEnum.ONGEKI]: "O.N.G.E.K.I.",
  }
  return gameEnum in dict ? dict[gameEnum] : null
}
