"""Genereer lokale SVG-, draw.io- en Mermaid-bronnen zonder dependencies.

Uitvoeren: python "products/system context/generate_diagrams.py"
De diagrammen delen onderstaande rollen en use cases. Er gaan geen data naar buiten.
"""

from html import escape
from math import sqrt
from pathlib import Path

ROOT = Path(__file__).resolve().parent

# ---------------------------------------------------------------- use cases
# Zelfde notatie als het VeloVault-UCD (car-auction-assignment_team11):
# zwart-wit UML, actoren buiten de grens, tijdactor rechts, «include»/«extend»
# alleen waar gedrag gedeeld of optioneel is. Bewerkbare bron: use-case-diagram.drawio.
UC_W, UC_H, UC_H_EXT = 260, 60, 92
LEFT_X, RIGHT_X = 345, 725
BOX = (300, 30, 730, 900)
UCD_TITLE = "GIFTS4U Control Tower"

# id: (label, x, y) — draw.io-umlActor van 30×60
ACTORS = {
    "beheerder": ("Control Tower-|beheerder", 50, 455),
    "tijd": ("Tijd (klok)", 1110, 490),
}

# id, labelregels (Title Case, FDS Class 1 dia 36), kolom-x, middelpunt-y, extension point, actor
UCD = [
    ("uc01", ["Orderoverzicht", "Raadplegen (UC01)"], LEFT_X, 110, None, "beheerder"),
    ("uc02", ["Uitzondering En Impact", "Beoordelen (UC02)"], LEFT_X, 200, "herstelscenario gewenst", "beheerder"),
    ("uc09", ["Ketenverstoring Simuleren", "(Demo, UC09)"], LEFT_X, 300, None, "beheerder"),
    ("uc03", ["Corrigerend Besluit", "Vastleggen (UC03)"], LEFT_X, 380, None, "beheerder"),
    ("uc04", ["Opvolging En Logboek", "Raadplegen (UC04)"], LEFT_X, 460, None, "beheerder"),
    ("uc05", ["Voorraad En Import", "Volgen (UC05)"], LEFT_X, 540, None, "beheerder"),
    ("uc06", ["Productie En Transport", "Volgen (UC06)"], LEFT_X, 620, None, "beheerder"),
    ("uc07", ["Klantcommunicatie", "Coördineren (UC07)"], LEFT_X, 700, None, "beheerder"),
    ("uc08", ["Meldingen En KPI's", "Bewaken (UC08)"], LEFT_X, 780, None, "beheerder"),
    ("uc11", ["Batchaantal Hongkong", "Verhogen (UC11)"], LEFT_X, 860, None, "beheerder"),
    ("herstel", ["Herstelscenario Vergelijken"], RIGHT_X, 110, None, None),
    ("getroffen", ["Getroffen Orders Bepalen"], RIGHT_X, 250, None, None),
    ("uc10", ["Leverlooptijd Bewaken (UC10)"], RIGHT_X, 520, "looptijd > 120% van belofte", "tijd"),
    ("alarm", ["Vertragingsalarm Tonen"], RIGHT_X, 680, None, None),
]

# (soort, bron, doel, conditie) — de pijl wijst bij «include» naar het opgenomen
# geval en bij «extend» naar het basisgeval, net als in het VeloVault-UCD.
RELATIONS = [
    ("extend", "herstel", "uc02", "[herstelscenario gewenst]"),
    ("include", "uc02", "getroffen", ""),
    ("include", "uc09", "getroffen", ""),
    ("extend", "alarm", "uc10", "[looptijd > 120% van belofte]"),
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


# ---------------------------------------------------------------- UCD-tekenen
def ucd_geom(case):
    _, _, x, cy, ext, _ = case
    h = UC_H_EXT if ext else UC_H
    return x, cy - h / 2, UC_W, h


def ucd_center(case):
    x, y, w, h = ucd_geom(case)
    return x + w / 2, y + h / 2, w / 2, h / 2


def edge_point(case, towards):
    # Snijpunt van middelpunt→doel met de ellipsrand, zoals draw.io het verbindt.
    cx, cy, rx, ry = ucd_center(case)
    dx, dy = towards[0] - cx, towards[1] - cy
    t = 1 / sqrt((dx / rx) ** 2 + (dy / ry) ** 2)
    return round(cx + t * dx, 2), round(cy + t * dy, 2)


def relation_points(cases, src, dst):
    s_c, d_c = ucd_center(cases[src]), ucd_center(cases[dst])
    return edge_point(cases[src], d_c[:2]), edge_point(cases[dst], s_c[:2])


def ucd_text(x, y, lines, size=12, weight="400", style="normal", anchor="middle"):
    spans = "".join(f'<tspan x="{x}" dy="{0 if i == 0 else round(size * 1.25, 1)}">{escape(line)}</tspan>' for i, line in enumerate(lines))
    return (f'<text x="{x}" y="{y}" font-size="{size}" font-weight="{weight}" font-style="{style}" '
            f'text-anchor="{anchor}" dominant-baseline="middle" fill="#000">{spans}</text>')


def svg_actor(label, x, y):
    cx = x + 15
    return (f'<g stroke="#000" stroke-width="1.2" fill="none"><circle cx="{cx}" cy="{y + 7.5}" r="7.5"/>'
            f'<path d="M{cx} {y + 15}V{y + 40} M{x} {y + 25}H{x + 30} M{cx} {y + 40}L{x} {y + 60} M{cx} {y + 40}L{x + 30} {y + 60}"/></g>'
            + ucd_text(cx, y + 74, label.split("|"), 12, "700"))


def svg_case(case):
    _, lines, _, _, ext, _ = case
    cx, cy, rx, ry = ucd_center(case)
    p = [f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="#fff" stroke="#000" stroke-width="1"/>']
    if not ext:
        return p + [ucd_text(cx, cy - (len(lines) - 1) * 7.5, lines)]
    # UML-ellips met extension-point-compartiment (zoals Withdraw Listing in VeloVault).
    sep = cy + 4
    half = rx * sqrt(1 - ((sep - cy) / ry) ** 2) - 14
    return p + [ucd_text(cx, sep - 14 - (len(lines) - 1) * 15, lines),
                f'<path d="M{cx - half} {sep}H{cx + half}" stroke="#000" stroke-width="1"/>',
                ucd_text(cx, sep + 13, ["extension points"], 10, "700"),
                ucd_text(cx, sep + 26, [ext], 10)]


def label_box(a, b, cond):
    # Positie van «include»/«extend» en conditie: rechts naast een verticale pijl, anders erboven/eronder.
    mx, my = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2
    if abs(a[0] - b[0]) < 1:
        return (mx + 8, my - (7 if cond else 0), "start"), (mx + 8, my + 8, "start")
    return (mx, my - 14, "middle"), (mx, my + 20, "middle")


def use_cases():
    cases = {c[0]: c for c in UCD}
    width, height = 1240, 1010
    bx, by, bw, bh = BOX
    p = [f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}" role="img" aria-labelledby="title desc">
<title id="title">Use-casediagram GIFTS4U Control Tower</title><desc id="desc">Eén beheerder en de tijd als actoren; elf doelen met include- en extend-relaties.</desc>
<defs><marker id="open" markerWidth="12" markerHeight="12" refX="11" refY="6" orient="auto" markerUnits="userSpaceOnUse"><path d="M1 1 L11 6 L1 11" fill="none" stroke="#000" stroke-width="1.2"/></marker></defs>
<g font-family="Arial, Helvetica, sans-serif">
<rect width="{width}" height="{height}" fill="#fff"/>''',
         f'<rect x="{bx}" y="{by}" width="{bw}" height="{bh}" fill="none" stroke="#000" stroke-width="1.5"/>',
         ucd_text(bx + bw / 2, by + 22, [UCD_TITLE], 14, "700")]
    # Associaties zonder pijlpunt (FDS Class 1, dia 34–38).
    for case in UCD:
        if case[5]:
            _, ax, ay = ACTORS[case[5]]
            cx, cy, rx, _ = ucd_center(case)
            a, b = ((ax + 30, cx - rx) if ax < bx else (ax, cx + rx))
            p.append(f'<path d="M{a} {ay + 30}L{b} {cy}" stroke="#000" stroke-width="1.2" fill="none"/>')
    for kind, src, dst, cond in RELATIONS:
        a, b = relation_points(cases, src, dst)
        p.append(f'<path d="M{a[0]} {a[1]}L{b[0]} {b[1]}" stroke="#000" stroke-width="1.2" stroke-dasharray="6 4" fill="none" marker-end="url(#open)"/>')
        (lx, ly, anchor), (cx, cy, canchor) = label_box(a, b, cond)
        p.append(ucd_text(lx, ly, [f"«{kind}»"], 11, anchor=anchor))
        if cond:
            p.append(ucd_text(cx, cy, [cond], 10, style="italic", anchor=canchor))
    for case in UCD:
        p += svg_case(case)
    for label, ax, ay in ACTORS.values():
        p.append(svg_actor(label, ax, ay))
    p += [ucd_text(40, 960, ["Lijn = deelname van een actor (geen pijlpunt). Gestippelde pijl = «include» (altijd) of «extend» (alleen onder de conditie)."], 12, anchor="start"),
          ucd_text(40, 982, ["Partners en diensten bedienen de Control Tower niet; hun gegevensuitwisseling staat in het DFD niveau 0."], 12, anchor="start")]
    write_svg("use-case-diagram.svg", p)
    write_drawio(cases)


def write_drawio(cases):
    def cell(ident, value, style, geom=None, attrs=""):
        if geom:
            kind, g = 'vertex="1"', f'<mxGeometry x="{geom[0]}" y="{geom[1]}" width="{geom[2]}" height="{geom[3]}" as="geometry" />'
        else:
            kind, g = 'edge="1"', '<mxGeometry relative="1" as="geometry" />'
        return (f'        <mxCell id="{ident}" value="{escape(value)}" style="{style}" {kind} parent="1"{attrs}>\n'
                f'          {g}\n        </mxCell>')

    ell = "ellipse;html=1;whiteSpace=wrap;fontFamily=Arial;fontSize=12;"
    txt = "text;html=1;whiteSpace=wrap;fontFamily=Arial;align=center;verticalAlign=middle;fontColor=#000000;"
    line = "edgeStyle=none;html=1;rounded=0;strokeColor=#000000;strokeWidth=1.2;"
    bx, by, bw, _ = BOX
    out = [cell("system", "", "rounded=0;html=1;fillColor=none;strokeColor=#000000;strokeWidth=1.5;", BOX),
           cell("t_system", UCD_TITLE, txt + "fontSize=14;fontStyle=1;", (bx + bw / 2 - 150, by + 13, 300, 18))]
    for case in UCD:
        ident, lines, _, _, ext, _ = case
        label, style = "<br>".join(lines), ell
        if ext:
            label += f'<hr><b style="font-size:10px">extension points</b><br><span style="font-size:10px">{ext}</span>'
            style += "verticalAlign=top;spacingTop=4;"
        out.append(cell(ident, label, style, ucd_geom(case)))
    for ident, (label, ax, ay) in ACTORS.items():
        out.append(cell(ident, label.replace("|", "<br>"), "shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;fontStyle=1;fontFamily=Arial;", (ax, ay, 30, 60)))
    n = 0
    for case in UCD:
        if case[5]:
            left = ACTORS[case[5]][1] < bx
            ends = ("exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;" if left
                    else "exitX=0;exitY=0.5;exitDx=0;exitDy=0;entryX=1;entryY=0.5;entryDx=0;entryDy=0;")
            out.append(cell(f"e{n}", "", line + ends + "endArrow=none;startArrow=none;", attrs=f' source="{case[5]}" target="{case[0]}"'))
            n += 1
    for kind, src, dst, cond in RELATIONS:
        a, b = relation_points(cases, src, dst)
        out.append(cell(f"e{n}", "", line + "endArrow=open;endFill=0;startArrow=none;dashed=1;", attrs=f' source="{src}" target="{dst}"'))
        (lx, ly, anchor), (cx, cy, _) = label_box(a, b, cond)
        if anchor == "start":
            out.append(cell(f"l{n}", f"«{kind}»", txt + "align=left;fontSize=11;", (lx, ly - 7.5, 70, 15)))
            if cond:
                out.append(cell(f"c{n}", cond, txt + "align=left;fontSize=10;fontStyle=2;", (cx, cy - 7, 170, 14)))
        else:
            out.append(cell(f"l{n}", f"«{kind}»", txt + "fontSize=11;", (lx - 35, ly - 7.5, 70, 15)))
            if cond:
                out.append(cell(f"c{n}", cond, txt + "fontSize=10;fontStyle=2;", (cx - 85, cy - 7, 170, 14)))
        n += 1
    xml = ['<mxfile host="app.diagrams.net">',
           '  <diagram id="gifts4u_ucd" name="GIFTS4U Use-casediagram">',
           '    <mxGraphModel dx="1200" dy="800" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1240" pageHeight="960" background="#ffffff" math="0" shadow="0">',
           '      <root>', '        <mxCell id="0" />', '        <mxCell id="1" parent="0" />',
           *out, '      </root>', '    </mxGraphModel>', '  </diagram>', '</mxfile>']
    (ROOT / "use-case-diagram.drawio").write_text("\n".join(xml) + "\n", encoding="utf-8")


# ---------------------------------------------------------------- DFD
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
          text(40, 1322, "Externe partijen zijn gegevensbronnen of ontvangers van opdrachten; Tijd / klok komt overeen met de tijdactor in het UCD.", 17, anchor="start"),
          text(40, 1352, "Geen interne services of gegevensopslag uitgewerkt op dit niveau. Gegevenswoordenboek: README.md.", 17, anchor="start")]
    write_svg("dfd-level-0.svg", p)
    (ROOT / "dfd-level-0.mmd").write_text("\n".join(mermaid) + "\n", encoding="utf-8")


if __name__ == "__main__":
    use_cases()
    dfd()
    print("Gegenereerd: 2 SVG-diagrammen, 1 draw.io-bron en 1 Mermaid-bron.")
