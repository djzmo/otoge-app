// TODO: Provide kuroshiro and kuromoji type definitions
// @ts-ignore
import Kuroshiro from "kuroshiro"
// @ts-ignore
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji"

export const toHalfWidthAlphanumeric = (text: string) => {
  const convertChar = (char: string) => {
    const fullWidthChars =
      "　！＂＃＄％＆＇（）＊＋，－．／０１２３４５６７８９：；＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝～"
    const halfWidthChars =
      " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~"
    const index = fullWidthChars.indexOf(char)
    return index !== -1 ? halfWidthChars.charAt(index) : char
  }
  return text.replace(/[！-～]/g, char => convertChar(char))
}

let kuroshiro: Kuroshiro = null
const romanizationOptions = {
  to: "romaji",
  mode: "spaced",
  romajiSystem: "passport",
}

export const createRomanization = (text: string) => {
  if (kuroshiro == null) {
    kuroshiro = new Kuroshiro()
    kuroshiro.init(new KuromojiAnalyzer())
  }
  return kuroshiro
    .convert(text, romanizationOptions)
    .normalize("NFKC")
    .toUpperCase()
    .trim()
    .replace(/ +(?= )/g, "")
}

export const normalizeDashes = (text: string) => {
  return text.replaceAll(/([—−])/g, "-")
}
