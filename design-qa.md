# Portfolio design QA

Date: 2026-10-29

final result: passed

## Reference and scope

- Source: https://www.apple.com/macbook-pro/liquid-retina-xdr-display/
- Source visual truth: `tmp/portfolio-review/reference.png`.
- Implementation: http://localhost:3012/portfolio
- Implementation screenshot: `tmp/portfolio-review/final-hero-1440.png`.
- Full-view comparison: `tmp/portfolio-review/reference-comparison.png`.
- Both desktop captures are 1440 × 1000 pixels, CSS viewport 1440 × 1000, device scale factor 1. The comparison places the captures side by side without rescaling.
- State: initial page, dark portfolio presentation, completed heading animation.
- The reference supplies art direction: black background, generous spacing, large type and dimensional imagery. The implementation intentionally retains HAON's header, Korean copy, font and real project imagery; this is an adaptation rather than a pixel-identical Apple page.

## Required visual checks

- Typography: existing Noto Sans KR retained; display title, supporting text and metadata remain distinct and readable. Heading wrapping inspected at 1440, 768, 390 and 320 pixels.
- Spacing: checked hero image bounds, stacking, section spacing, sticky media and mobile flow. No horizontal overflow at the tested widths.
- Colors: black stage, white headings, gray secondary text and existing brand accents are consistent. Captions have a solid background when layered over imagery.
- Images: nine screen crops come from existing portfolio thumbnails. No fabricated projects or placeholder artwork. Local crops are used only while the original thumbnail matches; uploaded replacements use the current thumbnail.
- Copy: existing project names and descriptions retained. Project totals and category counts come from the portfolio data.
- Focused evidence: `tmp/portfolio-review/focus-fields.png` and `tmp/portfolio-review/focus-spotlight.png`; image boundaries, caption contrast and the project link are visible at readable scale.

## Comparison history

1. P2: the category artwork caption overlapped the front screenshot. Initial evidence: `tmp/portfolio-review/chapter-390.png`. Fixed by reserving an opaque footer for the caption. Verified in `tmp/portfolio-review/final-chapter-390.png`.
2. P2: the spotlight's fixed aspect ratio clipped the footer. Initial evidence: `tmp/portfolio-review/spotlight-1440.png`. Fixed with content-based height, explicit gaps and a nonshrinking screen. Verified in `tmp/portfolio-review/final-spotlight-1440.png` and `tmp/portfolio-review/final-spotlight-390.png`; the footer lies inside the panel.
3. P2: the mobile hero's rear image reached the scroll link. Initial evidence: `tmp/portfolio-review/desktop-390.png`. Fixed the artwork height and rear screen position. Final screenshots: `tmp/portfolio-review/final-hero-390.png` and `tmp/portfolio-review/final-hero-320.png`. Measured clearances are approximately 19 and 14 pixels respectively.

## Functional checks

- All 90 projects are present. Each of the seven category filters returns only its category, with one selected button and the correct live count. Details: `tmp/portfolio-review/checks.json`.
- The hero's index link reaches `#all-works` with approximately 104 pixels of clearance for the header.
- Clicking the hero project opens `/portfolio/90` and its matching project title.
- Reduced-motion mode shows the complete heading, leaves content visible and disables the gallery's scroll animation.
- No broken images or JavaScript exceptions during the browser checks.
- `npx tsc --noEmit`, `npm run build` and `git diff --check` passed. The production build generated all 145 pages successfully.

## Completion

- [x] Four hatched image areas replaced with actual project artwork.
- [x] Desktop, tablet and mobile layouts inspected.
- [x] Caption and link overlap findings fixed and recaptured.
- [x] Primary links, category filters and reduced motion checked.
- [x] Production build passed.

No remaining actionable P0, P1 or P2 findings.
