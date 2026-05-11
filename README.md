# Oliver B. Lund Portfolio

Static portfolio site and CV workspace.

## Active site structure

- `index.html`
  Main page markup. Long-form panel content still lives here.
- `css/base.css`
  Shared tokens, base styles, light-mode variable overrides.
- `css/layout.css`
  Shell layout, sidebar, panel layout, background scene styling.
- `css/components.css`
  Reusable content components, cards, galleries, lightbox, screenshot UI.
- `css/about.css`
  About/contact-specific styling.
- `js/site-content.js`
  Central registry for sidebar navigation labels, selected-work cards, and gallery metadata.
- `js/main.js`
  Runtime UI logic for navigation, panel switching, theme toggle, gallery rendering, and screenshot carousels.
- `js/contour-background.js`
  The live animated `ghost` background renderer.
- `sw.js`
  Service worker cache list for the active site assets.

## CV workflow

- `cv/oliver-b-lund.da.md`
  Danish CV source.
- `cv/oliver-b-lund.da.html`
  Rendered Danish CV.
- `cv/facts.md`
  Shared factual source material.
- `cv/render_cv.py`
  CV renderer.

Render the CV with:

```powershell
python Webpage\cv\render_cv.py
```

## Content updates

For a new project/software entry:

1. Add or update the long-form panel markup in `index.html`.
2. Add the navigation/card/gallery metadata in `js/site-content.js`.
3. Add any related images/documents under the relevant `Images/` or `Docs/` folder.

## Archived candidates

Unused legacy CSS/JS modules that are not part of the live page were moved to:

- `_unused-review/css/`
- `_unused-review/js/`

These are kept for review instead of being deleted outright.
