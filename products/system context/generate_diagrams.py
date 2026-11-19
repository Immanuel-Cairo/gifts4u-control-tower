"""Genereer lokale SVG-, PlantUML- en Mermaid-bronnen zonder dependencies.

Uitvoeren: python "products/system context/generate_diagrams.py"
De diagrammen delen onderstaande rollen en use cases. Er gaan geen data naar buiten.
"""

from html import escape
from math import sqrt
from pathlib import Path

ROOT = Path(__file__).resolve().parent

# Rol, twee gebruikersdoelen. De requirementkoppeling staat in README.md.
ROWS = [
    ("manager", "Manager / ketenregisseur", [("UC01", "Ketenoverzicht", "raadplegen"), ("UC02", "Uitzonderingen en", "impact beoordelen")]),
    ("directeur", "Directeur / eigenaar", [("UC03", "Corrigerend besluit", "vastleggen en toewijzen"), ("UC04", "Besluit en opvolging", "controleren")]),
    ("importCoordinator", "Importcoördinator", [("UC05", "Importpartijen", "registreren en volgen"), ("UC06", "Importvertraging", "registreren")]),
    ("magazijn", "Magazijnmedewerker", [("UC07", "Voorraad ontvangen,", "plannen en reserveren"), ("UC08", "Overdracht naar", "Printz bevestigen")]),
    ("printz", "Printz-medewerker", [("UC09", "Printopdracht uitvoeren", "en kwaliteit vrijgeven"), ("UC10", "Printstoring of", "capaciteitstekort melden")]),
    ("dhl", "DHL-medewerker", [("UC11", "Zending volgen en", "gebeurtenissen bevestigen"), ("UC12", "Transportcapaciteit", "plannen")]),
    ("service", "Klantenservice / accountmanager", [("UC13", "Klantupdate opstellen", "en afhandeling vastleggen"), ("UC14", "Personalisatieklacht", "registreren en opvolgen")]),
    ("klant", "Klant (B2B / B2C)", [("UC15", "Bestelling plaatsen", "met personalisatie"), ("UC16", "Orderupdates", "ontvangen")]),
]

# ---------------------------------------------------------------- DFD
# Stromen t.o.v. proces 0; alleen onderbouwde uitgaande stromen opnemen.
FLOWS = [
    ("beheerder", "Control Tower-beheerder", "F01", "Filters, besluiten en demo-events", "F02", "Overzicht, meldingen en log"),
    ("webshop", "Webshop / orderservice", "F03", "Orders en leverbeloften", "", ""),
    ("importService", "Leverancier Hongkong / import", "F04", "Partijen, ETA en 'Delayed'", "F13", "Verhoogd batchaantal"),
    ("voorraad", "Magazijn / voorraadservice", "F05", "Voorraad en voorraadevents", "", ""),
    ("printz", "Printz / productiegegevens", "F06", "Ontvangen, productie, gereed, verzonden", "F07", "Toegewezen herstelactie"),
    ("dhl", "DHL / transportgegevens", "F08", "Transportstatus en ETA", "F09", "Toegewezen herstelactie"),
    ("communicatie", "Klantcommunicatie", "F10", "Berichtstatus en klachten", "F11", "Update en opdracht"),
    ("klok", "Tijd / klok", "F12", "Huidige datum en tijd", "", ""),
]


def text(x, y, lines, size=18, fill="#151612", anchor="middle", weight="400"):
    if isinstance(lines, str):
        lines = [lines]
    spans = "".join(f'<tspan x="{x}" dy="{0 if i == 0 else size * 1.35}">{escape(line)}</tspan>' for i, line in enumerate(lines))
    return f'<text x="{x}" y="{y}" font-size="{size}" fill="{fill}" text-anchor="{anchor}" font-weight="{weight}">{spans}</text>'


def start(title, subtitle, height, width=1440):
    return [f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">
<title id="title">{escape(title)}</title><desc id="desc">{escape(subtitle)}</desc>
<defs><marker id="arrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9" fill="#7855e9"/></marker></defs>
<g font-family="Arial, Helvetica, sans-serif">
<rect width="{width}" height="{height}" fill="#f4f5f0"/>
<rect width="{width}" height="150" fill="#151612"/>
<rect x="36" y="32" width="9" height="78" rx="4" fill="#daf352"/>''',
            text(64, 48, "GIFTS4U / SYSTEM CONTEXT", 14, "#daf352", "start", "700"),
            text(64, 87, title, 30, "white", "start", "700"),
            text(64, 120, subtitle, 16, "#d8dacf", "start")]


def write_svg(name, parts):
    (ROOT / name).write_text("\n".join(parts + ["</g></svg>\n"]), encoding="utf-8")


def role_lines(label):
    return label.split(" / ")


# Middelpunten in twee kolommen. De extra ruimte bij UC05 is voor de leverancier.
UCD_LAYOUT = {
    "manager": (440, 105, 140), "directeur": (850, 324, 355),
    "importCoordinator": (440, 324, 395), "magazijn": (440, 530, 566),
    "printz": (850, 500, 536), "dhl": (850, 676, 712),
    "service": (850, 852, 888), "klant": (440, 852, 888),
}
SYSTEM = "GIFTS4U-platform inclusief Control Tower"


def actor(x, y, label):
    lines = ["Klant", "(B2B / B2C)"] if label.startswith("Klant (") else role_lines(label)
    return (f'<g fill="none" stroke="black" stroke-width="1.5"><circle cx="{x}" cy="{y-23}" r="8"/>'
            f'<path d="M{x} {y-15}v27m-15 -19h30m-15 19l-15 20m15 -20l15 20"/></g>'
            + text(x, y+52, lines, 14, "black", weight="700"))


def oval(x, y, lines, extension=False):
    radius = 51 if extension else 32
    result = f'<ellipse cx="{x}" cy="{y}" rx="150" ry="{radius}" fill="white" stroke="black" stroke-width="1.3"/>'
    result += text(x, y-(22 if extension else (6 if len(lines)>1 else -4)), lines, 14, "black")
    if extension:
        result += (f'<path d="M{x-132} {y+4}h264" stroke="black"/>'
                   + text(x, y+20, "Uitbreidingspunt", 11, "black", weight="700")
                   + text(x, y+34, "Herstelopties gewenst", 11, "black"))
    return result


def use_cases():
    p = ['<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="1010" viewBox="0 0 1280 1010" role="img" aria-labelledby="title desc">',
         f'<title id="title">{SYSTEM}</title><desc id="desc">Negen rollen en zestien gebruikersdoelen. Een bestelling vereist een voorraadcontrole. Bij een uitzondering kan de manager herstelopties vergelijken.</desc>',
         '<defs><marker id="open" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="10" markerHeight="10" orient="auto"><path d="M1 1L9 5L1 9" fill="none" stroke="black"/></marker></defs>',
         '<g font-family="Arial, Helvetica, sans-serif"><rect width="1280" height="1010" fill="white"/>',
         '<rect x="235" y="26" width="820" height="955" fill="none" stroke="black" stroke-width="1.5"/>',
         text(645, 55, SYSTEM, 16, "black", weight="700")]
    uml = ["@startuml", "left to right direction", "skinparam monochrome true",
           "skinparam shadowing false", "skinparam BackgroundColor white",
           "skinparam usecaseBackgroundColor white", "skinparam actorBackgroundColor white"]
    associations = []
    for ident, label, _ in ROWS:
        uml.append(f'actor "{label}" as {ident}')
    uml += ['actor "Leveranciersmedewerker Hongkong" as leverancier', f'rectangle "{SYSTEM}" {{']
    for role, label, cases in ROWS:
        x, y, actor_y = UCD_LAYOUT[role]
        left = x == 440
        actor_x, origin, end = (115, 137, x-150) if left else (1165, 1143, x+150)
        p.append(actor(actor_x, actor_y, label))
        for i, (ident, first, second) in enumerate(cases):
            cy = y + i * (100 if role == "manager" else 77)
            p.append(f'<path d="M{origin} {actor_y}L{end} {cy}" fill="none" stroke="black"/>')
            p.append(oval(x, cy, [first, f"{second} ({ident})"], ident == "UC02"))
            extension = r"\n--\nUitbreidingspunt\nHerstelopties gewenst" if ident == "UC02" else ""
            uml.append(f'  usecase "{first}\\n{second} ({ident}){extension}" as {ident}')
            associations.append(f"{role} -- {ident}" if left else f"{ident} -- {role}")
    p += [actor(115, 265, "Leveranciersmedewerker / Hongkong"),
          '<path d="M137 265L290 324" stroke="black"/>',
          oval(850, 205, ["Herstelopties vergelijken"]),
          '<path d="M700 205H590" fill="none" stroke="black" stroke-dasharray="6 4" marker-end="url(#open)"/>',
          text(645, 196, "«extend»", 12, "black"),
          text(645, 225, "[herstelopties gewenst]", 10, "black"),
          oval(440, 731, ["Voorraad controleren"]),
          '<path d="M440 820V763" fill="none" stroke="black" stroke-dasharray="6 4" marker-end="url(#open)"/>',
          text(450, 795, "«include»", 12, "black", anchor="start")]
    uml += ['  usecase "Herstelopties vergelijken" as herstel',
            '  usecase "Voorraad controleren" as voorraad', '}', *associations,
            'leverancier -- UC05', 'herstel ..> UC02 : <<extend>>\\n[herstelopties gewenst]',
            'UC15 ..> voorraad : <<include>>', '@enduml']
    write_svg("use-case-diagram.svg", p)
    (ROOT / "use-case-diagram.puml").write_text("\n".join(uml) + "\n", encoding="utf-8")


def dfd():
    p = start("DFD · niveau 0", "Eén Control Tower, één beheerder, zes externe bronnen of diensten en de tijd als triggerbron.", 1380, width=1800)
    # FDS Class 3, dia 11/14 en Class 4, dia 6: één procescirkel voor de hele systeemgrens.
    cx, cy, radius = 900, 760, 420
    p += [f'<circle cx="{cx}" cy="{cy}" r="{radius}" fill="white" stroke="#7855e9" stroke-width="2.5"/>',
          text(cx, 620, "0", 36, "#7855e9", weight="700"),
          text(cx, 690, "Keten bewaken en bijsturen", 28, weight="700"),
          text(cx, 765, "GIFTS4U Control Tower", 26, weight="700"),
          text(cx, 845, ["Informatie samenbrengen", "Uitzonderingen en impact tonen", "Acties en besluiten vastleggen"], 19, "#747870")]
    mermaid = ['flowchart LR', '    platform(("0 · Keten bewaken en bijsturen / GIFTS4U Control Tower"))']
    for i, (ident, label, incoming, inlabel, outgoing, outlabel) in enumerate(FLOWS):
        left = i < 4
        row = i if left else i - 4
        y = 440 + row * 205
        x, center = (30, 160) if left else (1510, 1640)
        p.append(f'<rect x="{x}" y="{y - 60}" width="260" height="120" fill="white" stroke="#151612" stroke-width="1.5"/>')
        p.append(text(center, y - (9 if " / " in label else 0), role_lines(label), 18, weight="700"))
        # Beide pijlen raken exact de cirkelrand, elk op hun eigen hoogte.
        a = 290 if left else 1510
        sign = -1 if left else 1
        b = round(cx + sign * sqrt(radius**2 - (y - 24 - cy)**2), 2)
        out_b = round(cx + sign * sqrt(radius**2 - (y + 29 - cy)**2), 2)
        tx, out_tx = (a + b) / 2, (a + out_b) / 2
        p += [f'<path d="M{a} {y - 24}H{b}" stroke="#7855e9" stroke-width="1.8" marker-end="url(#arrow)"/>',
              text(tx, y - 51, incoming, 15, "#7855e9", weight="700"),
              text(tx, y - 33, inlabel, 14)]
        mermaid += [f'    {ident}["{label}"]', f'    {ident} -->|"{incoming}: {inlabel}"| platform']
        if outgoing:
            p += [f'<path d="M{out_b} {y + 29}H{a}" stroke="#7855e9" stroke-width="1.8" marker-end="url(#arrow)"/>',
                  text(out_tx, y + 4, outgoing, 15, "#7855e9", weight="700"),
                  text(out_tx, y + 22, outlabel, 14)]
            mermaid.append(f'    platform -->|"{outgoing}: {outlabel}"| {ident}')
    p += [text(40, 1260, "Leeswijzer", 18, anchor="start", weight="700"),
          text(40, 1292, "Rechthoek = externe entiteit. Cirkel 0 = volledige systeemgrens. Pijl = gegevens, geen fysieke goederen of navigatie.", 17, anchor="start"),
          text(40, 1322, "Externe partijen zijn gegevensbronnen of ontvangers van opdrachten; Tijd / klok levert de datum en tijd voor de looptijdcontrole.", 17, anchor="start"),
          text(40, 1352, "Geen interne services of gegevensopslag uitgewerkt op dit niveau. Gegevenswoordenboek: README.md.", 17, anchor="start")]
    write_svg("dfd-level-0.svg", p)
    (ROOT / "dfd-level-0.mmd").write_text("\n".join(mermaid) + "\n", encoding="utf-8")


if __name__ == "__main__":
    use_cases()
    dfd()
    print("Gegenereerd: 2 SVG-diagrammen, 1 PlantUML-bron en 1 Mermaid-bron.")
