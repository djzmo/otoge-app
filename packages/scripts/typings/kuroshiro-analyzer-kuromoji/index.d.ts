/* eslint-disable */
declare class KuromojiAnalyzer {
  constructor(dictPath?: { dictPath: string })
  init(): Promise<void>
  parse(str: string): Promise<any>
}
declare module "kuroshiro-analyzer-kuromoji" {
  export = KuromojiAnalyzer
}
