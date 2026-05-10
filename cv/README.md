# CV Workflow

The source-of-truth CV files live here:

- `facts.md`
- `oliver-b-lund.en.md`
- `oliver-b-lund.da.md`
- `cv.css`
- `template.html.j2`
- `render_cv.py`

The goal is to keep each language version to a single A4 page.

## Edit rules

- Keep the profile paragraph to 2-3 sentences.
- Prefer 3-5 strong bullets over long responsibility lists.
- Use outcomes, tools, and domain context instead of generic claims.
- If a line does not help a recruiter decide quickly, cut it.

## Generate HTML

```bash
python3 cv/render_cv.py
```

## Generate PDF

Open the generated HTML in a browser and print to PDF.

Generated files:

- `oliver-b-lund.en.html`
- `oliver-b-lund.da.html`

## Notes

- The website should point to the printable HTML pages until a final PDF is exported.
- The Markdown files are intentionally concise so they can stay in sync with the site.
