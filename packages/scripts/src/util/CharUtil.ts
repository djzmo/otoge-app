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
