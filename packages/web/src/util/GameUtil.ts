import GameEnum from "@/domain/GameEnum";
import Store from "@/domain/Store";

export function filterStoreByGame(stores: Store[], gameFilter: GameEnum) {
  return stores.filter(
    (store) =>
      store.cabinets.filter((cabinet) => cabinet.game === gameFilter).length >
      0,
  );
}

export function toGameTitle(gameEnum: GameEnum) {
  const dict = {
    [GameEnum.HATSUNE_MIKU_PROJECT_DIVA_ARCADE]:
      "Hatsune Miku Project DIVA Arcade",
    [GameEnum.MAIMAI]: "maimai FiNALE",
    [GameEnum.MAIMAI_DX]: "maimai DX",
    [GameEnum.MAIMAI_DX_INTERNATIONAL]: "maimai DX (International)",
    [GameEnum.CHUNITHM]: "CHUNITHM PARADISE LOST",
    [GameEnum.CHUNITHM_NEW]: "CHUNITHM NEW",
    [GameEnum.CHUNITHM_NEW_INTERNATIONAL]: "CHUNITHM NEW (International)",
    [GameEnum.ONGEKI]: "オンゲキ - O.N.G.E.K.I.",
    [GameEnum.DANCERUSH_STARDOM]: "DANCERUSH STARDOM",
    [GameEnum.DANCEDANCEREVOLUTION]: "DanceDanceRevolution",
    [GameEnum.DANCEDANCEREVOLUTION_20TH_ANNIVERSARY_MODEL]:
      "DanceDanceRevolution 20th anniversary model",
    [GameEnum.GITADORA_DRUMMANIA]: "GITADORA DrumMania",
    [GameEnum.GITADORA_GUITARFREAKS]: "GITADORA GuitarFreaks",
    [GameEnum.BEATMANIA_IIDX]: "beatmania IIDX",
    [GameEnum.BEATMANIA_IIDX_LIGHTNING_MODEL]: "beatmania IIDX LIGHTNING MODEL",
    [GameEnum.JUBEAT]: "jubeat",
    [GameEnum.MUSECA]: "MUSECA",
    [GameEnum.POP_N_MUSIC]: "pop'n music",
    [GameEnum.REFLEC_BEAT]: "REFLEC BEAT",
    [GameEnum.SOUND_VOLTEX]: "SOUND VOLTEX",
    [GameEnum.SOUND_VOLTEX_VALKYRIE_MODEL]: "SOUND VOLTEX -Valkyrie model-",
    [GameEnum.POLARIS_CHORD]: "ポラリスコード - Polaris Chord",
  };
  return dict[gameEnum];
}

export function toShortenedGameTitle(gameEnum: GameEnum) {
  const dict = {
    [GameEnum.HATSUNE_MIKU_PROJECT_DIVA_ARCADE]: "Project DIVA",
    [GameEnum.MAIMAI]: "maimai FiNALE",
    [GameEnum.MAIMAI_DX]: "maimai DX",
    [GameEnum.MAIMAI_DX_INTERNATIONAL]: "maimai DX (Intl.)",
    [GameEnum.CHUNITHM]: "CHUNITHM",
    [GameEnum.CHUNITHM_NEW]: "CHUNITHM NEW",
    [GameEnum.CHUNITHM_NEW_INTERNATIONAL]: "CHUNITHM NEW (Intl.)",
    [GameEnum.ONGEKI]: "オンゲキ",
    [GameEnum.DANCERUSH_STARDOM]: "DANCERUSH",
    [GameEnum.DANCEDANCEREVOLUTION]: "DDR",
    [GameEnum.DANCEDANCEREVOLUTION_20TH_ANNIVERSARY_MODEL]: "DDR (20th)",
    [GameEnum.GITADORA_DRUMMANIA]: "DrumMania",
    [GameEnum.GITADORA_GUITARFREAKS]: "GuitarFreaks",
    [GameEnum.BEATMANIA_IIDX]: "IIDX",
    [GameEnum.BEATMANIA_IIDX_LIGHTNING_MODEL]: "IIDX (LM)",
    [GameEnum.JUBEAT]: "jubeat",
    [GameEnum.MUSECA]: "MUSECA",
    [GameEnum.POP_N_MUSIC]: "pop'n",
    [GameEnum.REFLEC_BEAT]: "REFLEC BEAT",
    [GameEnum.SOUND_VOLTEX]: "SDVX",
    [GameEnum.SOUND_VOLTEX_VALKYRIE_MODEL]: "SDVX (Valkyrie)",
    [GameEnum.POLARIS_CHORD]: "ポラリスコード",
  };
  return dict[gameEnum];
}
