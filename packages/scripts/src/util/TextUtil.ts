import Kuroshiro from "kuroshiro"
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

const kuroshiro: Kuroshiro = new Kuroshiro()
kuroshiro.init(new KuromojiAnalyzer())

export const createRomanization = async (text: string) => {
  return (
    await kuroshiro.convert(text, {
      to: "romaji",
      mode: "spaced",
      romajiSystem: "passport",
    })
  )
    .normalize("NFKC")
    .toUpperCase()
    .trim()
    .replace(/ +(?= )/g, "")
}

export const normalizeSymbols = (text: string) => {
  return (
    text
      .replaceAll(/([—−])/g, "-")
      // eslint-disable-next-line no-irregular-whitespace
      .replaceAll(/(　)/g, " ")
  )
}
