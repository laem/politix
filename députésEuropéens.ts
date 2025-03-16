import * as xml_parser from "jsr:@melvdouc/xml-parser"

// https://fr.wikipedia.org/wiki/Groupe_politique_du_Parlement_europ%C3%A9en#2024-2029
export const groupesAbrevEurope = {
  "Groupe du Parti populaire européen (Démocrates-Chrétiens)": "PPE",
  "Groupe de l'Alliance Progressiste des Socialistes et Démocrates au Parlement européen":
    "S&D",
  "Groupe Patriotes pour l’Europe": "Patriots",
  "Groupe des Conservateurs et Réformistes européens": "CRE",
  "Groupe Renew Europe": "RE",
  "Groupe des Verts/Alliance libre européenne": "Verts/ALE",
  "Le groupe de la gauche au Parlement européen - GUE/NGL": "GUE/NGL",
  "Groupe «L'Europe des nations souveraines» (ENS)": "ENS",
  "Non-inscrits": "NI",
}

// depuis https://www.europarl.europa.eu/meps/fr/full-list/all
// datant du 08/03/2025
const XMLEuropean = Deno.readTextFileSync("data/députés-européens.xml")
// const XMLEuropean = Deno.readTextFileSync("data/test-europe.xml")

export const europeanMembersRandomOrder = xml_parser.parse(
  XMLEuropean,
  "text/xml",
)[1].children
  .filter(({ kind }) => kind != "COMMENT_NODE")
  .reduce((memo, { children }) => {
    let children_json = {}
    children.forEach(({ tagName, children: c }) => {
      if (tagName === "fullName") {
        const nameSplit = c[0].value.split(" ")
        children_json["prenom"] = nameSplit[0]
        children_json["nom"] = nameSplit.slice(1).join(" ")
      } else {
        children_json[tagName] = c[0].value
      }
    })
    children_json.groupeAbrev = groupesAbrevEurope[children_json.politicalGroup]
    memo.push(children_json)
    return memo
  }, [])
  .map((value) => ({ value, sort: Math.random() }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ value }) => value)

export default europeanMembersRandomOrder
