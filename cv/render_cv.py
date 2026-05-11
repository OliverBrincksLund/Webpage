from __future__ import annotations

import html
import re
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape


ROOT = Path(__file__).resolve().parent
TEMPLATE_NAME = "template.html.j2"
SIDEBAR_HEADINGS = {
    "Education",
    "Uddannelse",
    "Tools",
    "Værktøjer",
    "VÃ¦rktÃ¸jer",
    "Tekniske værktøjer",
    "Tekniske vÃ¦rktÃ¸jer",
    "Faglige kompetencer",
    "Kompetencer",
    "Faglige highlights",
    "Udvalgte faglige highlights",
}
LINK_RE = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
STRONG_RE = re.compile(r"\*\*([^*]+)\*\*")
EM_RE = re.compile(r"\*([^*]+)\*")


def parse_inline(text: str) -> str:
    escaped = html.escape(text)
    escaped = LINK_RE.sub(r'<a href="\2">\1</a>', escaped)
    escaped = STRONG_RE.sub(r"<strong>\1</strong>", escaped)
    escaped = EM_RE.sub(r"<em>\1</em>", escaped)
    return escaped


def flush_paragraph(paragraph_lines: list[str], target_blocks: list[dict]) -> None:
    if not paragraph_lines:
        return
    html_lines = [parse_inline(line.rstrip()) for line in paragraph_lines]
    target_blocks.append({"type": "paragraph", "html": "<br>".join(html_lines)})
    paragraph_lines.clear()


def parse_markdown(path: Path) -> dict:
    lines = path.read_text(encoding="utf-8").splitlines()
    document: dict = {
        "title": "",
        "lead_blocks": [],
        "sections": [],
        "lang": "en" if path.suffixes[-2:] == [".en", ".md"] else "da",
        "markdown_filename": path.name,
    }

    current_section: dict | None = None
    paragraph_lines: list[str] = []
    in_list = False
    list_items: list[str] = []

    def current_blocks() -> list[dict]:
        if current_section is None:
            return document["lead_blocks"]
        return current_section["blocks"]

    def flush_list() -> None:
        nonlocal in_list, list_items
        if in_list and list_items:
            current_blocks().append(
                {"type": "list", "items": [parse_inline(item) for item in list_items]}
            )
        in_list = False
        list_items = []

    for raw_line in lines:
        line = raw_line.rstrip()

        if line.startswith("# "):
            flush_paragraph(paragraph_lines, current_blocks())
            flush_list()
            document["title"] = parse_inline(line[2:].strip())
            continue

        if line.startswith("## "):
            flush_paragraph(paragraph_lines, current_blocks())
            flush_list()
            current_section = {"heading": parse_inline(line[3:].strip()), "blocks": []}
            document["sections"].append(current_section)
            continue

        if not line.strip():
            flush_paragraph(paragraph_lines, current_blocks())
            flush_list()
            continue

        if line.startswith("- "):
            flush_paragraph(paragraph_lines, current_blocks())
            in_list = True
            list_items.append(line[2:].strip())
            continue

        if in_list:
            flush_list()

        paragraph_lines.append(line)

    flush_paragraph(paragraph_lines, current_blocks())
    flush_list()

    document["main_sections"] = [
        section for section in document["sections"] if section["heading"] not in SIDEBAR_HEADINGS
    ]
    document["side_sections"] = [
        section for section in document["sections"] if section["heading"] in SIDEBAR_HEADINGS
    ]
    return document


def render_file(path: Path) -> Path:
    env = Environment(
        loader=FileSystemLoader(str(ROOT)),
        autoescape=select_autoescape(["html", "xml"]),
    )
    template = env.get_template(TEMPLATE_NAME)
    document = parse_markdown(path)
    output_path = path.with_suffix(".html")
    output_path.write_text(template.render(doc=document), encoding="utf-8")
    return output_path


def main() -> None:
    for markdown_path in sorted(ROOT.glob("oliver-b-lund.*.md")):
        output = render_file(markdown_path)
        print(f"Rendered {output.name}")


if __name__ == "__main__":
    main()
