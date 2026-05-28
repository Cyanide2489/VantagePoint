#!/usr/bin/env python3
"""Merge the English assessment JSON with a Traditional-Chinese translation map
into the final bilingual file consumed by the Nuxt app.

Inputs:
  - app/data/soc-cmm.en.json          (from extract.py)
  - app/data/i18n.zh.json             { "<english string>": "<繁體中文>" }

Output:
  - app/data/soc-cmm.json             every translatable field becomes
                                        { "en": "...", "zh": "..." }
                                        (zh falls back to en when missing)

Run after editing i18n.zh.json to regenerate the bilingual bundle.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EN = ROOT / "app" / "data" / "soc-cmm.en.json"
ZH = ROOT / "app" / "data" / "i18n.zh.json"
ZH_DIR = ROOT / "app" / "data" / "i18n"
OUT = ROOT / "app" / "data" / "soc-cmm.json"


def load_translations():
    """Base i18n.zh.json (structural) plus every app/data/i18n/*.json fragment."""
    zh = {}
    if ZH.exists():
        zh.update(json.loads(ZH.read_text(encoding="utf-8")))
    if ZH_DIR.exists():
        for f in sorted(ZH_DIR.glob("*.json")):
            zh.update(json.loads(f.read_text(encoding="utf-8")))
    return zh


def main():
    en = json.loads(EN.read_text(encoding="utf-8"))
    zh = load_translations()
    missing = []

    def bi(s):
        if not s:
            return {"en": s or "", "zh": s or ""}
        t = zh.get(s)
        if not t:
            missing.append(s)
            t = s  # fallback to English
        return {"en": s, "zh": t}

    domains = []
    for dom in en["domains"]:
        sections = []
        for sec in dom["sections"]:
            questions = []
            for q in sec["questions"]:
                questions.append({
                    "code": q["code"],
                    "text": bi(q["text"]),
                    "category": bi(q["category"]) if q["category"] else None,
                    "importance": q["importance"],
                    "nist": q["nist"],
                    "levels": [
                        {"value": l["value"], "label": l["label"],
                         "scenario": bi(l["scenario"])}
                        for l in q["levels"]
                    ],
                })
            sections.append({"no": sec["no"], "title": bi(sec["title"]),
                             "questions": questions})
        domains.append({"letter": dom["letter"], "title": bi(dom["title"]),
                        "sections": sections})

    nist = {}
    for code, n in en["nist"].items():
        nist[code] = {
            "code": code,
            "function": bi(n["function"]),
            "category": bi(n["category"]),
            "subcategory": bi(n["subcategory"]),
            "questions": n["questions"],
        }

    out = {"meta": en["meta"], "domains": domains, "nist": nist}
    OUT.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")

    uniq_missing = sorted(set(missing))
    print(f"merged -> {OUT}")
    print(f"translated: {len(set(zh))} keys | missing zh: {len(uniq_missing)} unique strings")
    if uniq_missing:
        (ROOT / "scripts" / "missing_zh.json").write_text(
            json.dumps(uniq_missing, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"  -> wrote scripts/missing_zh.json ({len(uniq_missing)} strings to translate)")


if __name__ == "__main__":
    main()
