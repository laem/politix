//https://fr.wikipedia.org/wiki/Assembl%C3%A9e_nationale_(France)
export const partyColors = {
  RN: "#0d378a",
  EPR: "#ffeb00",
  DR: "#0066cc",
  DEM: "#ff9900",
  HOR: "#0001b8",
  "LFI-NFP": "#cc2443",
  SOC: "#ff8080",
  ECOS: "#00c000",
  LIOT: "#e1a5e1",
  GDR: "#dd0000",
  UDR: "#162561",
  NI: "#dddddd",
}

export function findContrastedTextColor(color: string, simple: boolean) {
  const r = hexToR(color),
    g = hexToG(color),
    b = hexToB(color)

  if (simple) {
    // The YIQ formula
    return r * 0.299 + g * 0.587 + b * 0.114 > 128 ? "#000000" : "#ffffff"
  } // else complex formula
  const uicolors = [r / 255, g / 255, b / 255],
    c = uicolors.map((c) =>
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    ),
    L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]

  return L > 0.179 ? "#000000" : "#ffffff"
}
/*
	Hex to RGB conversion:
 	http://www.javascripter.net/faq/hextorgb.htm
*/
const cutHex = (h: string) => (h.startsWith("#") ? h.substring(1, 7) : h),
  hexToR = (h: string) => parseInt(cutHex(h).substring(0, 2), 16),
  hexToG = (h: string) => parseInt(cutHex(h).substring(2, 4), 16),
  hexToB = (h: string) => parseInt(cutHex(h).substring(4, 6), 16)
