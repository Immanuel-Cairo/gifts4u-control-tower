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


def actor(x, y, label):
    # Menselijke UML-actor met naam van de rol; geen concrete persoonsnaam.
    words = ["Klant", "(B2B / B2C)"] if label.startswith("Klant (") else role_lines(label)
    return f'<g stroke="#151612" stroke-width="2.5" fill="none"><circle cx="{x}" cy="{y - 33}" r="12"/><path d="M{x} {y - 21}v36 m-25 -22h50 m-25 22l-22 26 m22 -26l22 26"/></g>' + text(x, y + 66, words, 16, weight="700")


def use_cases():
    p = start("Use-casediagram · wie doet wat?", "Menselijke rollen buiten de grens; gebruikersdoelen binnen het GIFTS4U-platform.", 1650)
    p += ['<rect x="310" y="178" width="880" height="1340" rx="4" fill="white" stroke="#151612" stroke-width="2"/>',
          text(750, 213, "GIFTS4U-platform inclusief Control Tower", 20, weight="700")]
    uml = ['@startuml', 'left to right direction', 'skinparam shadowing false', 'skinparam packageStyle rectangle', 'skinparam actorStyle stickman', 'skinparam usecase {', '  BackgroundColor #F0EBFE', '  BorderColor #7855E9', '}', 'title GIFTS4U — systeemcontext en gebruikersrollen']
    for ident, label, _ in ROWS:
        uml.append(f'actor "{label}" as {ident}')
    uml += ['actor "Leveranciersmedewerker Hongkong" as leverancier', 'rectangle "GIFTS4U-platform inclusief Control Tower" {']
    for _, _, cases in ROWS:
        for ident, a, b in cases:
            uml.append(f'  usecase "{ident}\\n{a}\\n{b}" as {ident}')
    uml.append('}')
    for row, (role, label, cases) in enumerate(ROWS):
        y = 280 + row * 155
        p.append(actor(145, y, label))
        if row:
            p.append(f'<path d="M330 {y - 55}H1170" stroke="#e8e9e4"/>')
        p.append(f'<path d="M170 {y - 7}H190V{y}H370 M190 {y}V{y + 45}H800" stroke="#747870" fill="none" stroke-width="1.6"/>')
        for col, (ident, a, b) in enumerate(cases):
            cx, cy = (540, y) if col == 0 else (970, y + 45)
            p.append(f'<ellipse cx="{cx}" cy="{cy}" rx="170" ry="39" fill="#f0ebfe" stroke="#7855e9" stroke-width="1.5"/>')
            p.append(text(cx, cy - 5, [f"{ident} · {a}", b], 17))
            uml.append(f'{role} -- {ident}')
    # De leverancier ondersteunt de importregistratie; de coördinator is eigenaar.
    p.append(actor(1310, 545, "Leveranciersmedewerker / Hongkong"))
    p.append('<path d="M1285 538H1265V545H740V590H710" fill="none" stroke="#747870" stroke-width="1.6"/>')
    uml += ['leverancier -- UC05', '@enduml']
    p += [text(40, 1560, "Leeswijzer", 18, anchor="start", weight="700"),
          text(40, 1591, "Lijn = deelname aan een use case, geen procesvolgorde. Iedere use case heeft een primaire menselijke rol.", 17, anchor="start"),
          text(40, 1620, "UC02 bevat een optionele impactverkenner als ontwerpvoorstel. Rollen en requirementkoppelingen: README.md.", 17, anchor="start")]
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
