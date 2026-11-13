# FoxyFurniture Website

Code for [www.FoxyFurniture.net](https://www.foxyfurniture.net).

FoxyFurniture is a static, Bootstrap-based vanity site for a small set of
furniture projects. The site is intentionally simple: each top-level page is an
HTML file, with shared styling in CSS and a few small JavaScript files for
shared page behavior.

## How The Site Is Organized

The main pages live at the top level of the project:

- `index.html` is the home page.
- `criss-cross.html`, `pandoras-chest.html`, `powerpole.html`, and
  `versahorse.html` are the product pages.
- `gallery.html` is the Gallery landing page.
- `gallery-*.html` files are the Gallery detail pages.
- `about-us.html` is the About page.
- `contact.html` is the contact form, with FetLife as an alternative.

Supporting files are grouped by purpose:

- `css/ff-styles.css` contains the site-specific layout, responsive behavior,
  carousel styling, Gallery grid, lightbox styling, and other visual rules.
- `js/ff-scripts.js` loads any empty shared-layout placeholders, initializes Bootstrap
  carousels, renders carousel slides from data, and adds analytics to product-page
  download links.
- `js/ff-product-data.js` contains the home page and product page carousel
  image paths, alt text, captions, and per-slide display options.
- `js/ff-gallery-data.js` contains the Gallery landing page and Gallery detail
  page image data.
- `js/ff-gallery.js` renders Gallery pages into responsive CSS grids and
  provides the custom lightbox behavior.
- `js/ff-videoplayer.js` handles the home page video play/pause overlay.
- `js/shared/header.html` is the source for navigation embedded in every page.
  Run `npm run sync:header` after editing it; `sync-ff-header` copies it into the
  marked sections of the top-level HTML files. Commit the updated pages too.
- `js/shared/footer.html` contains footer markup fetched at runtime.
- `img/` contains the existing image, icon, carousel, and Gallery assets.
- `plans/` contains downloadable plan archives, including the current
  `versahorse-build-pack.zip`. These ZIPs are included in version control.

## Page Loading Model

Most pages share the same basic structure:

1. Load Bootstrap from a CDN.
2. Load `css/ff-styles.css`.
3. Load Bootstrap's JavaScript bundle.
4. Load any page-specific data files, such as `js/ff-product-data.js` or
   `js/ff-gallery-data.js`.
5. Load page behavior, such as `js/ff-scripts.js`, `js/ff-gallery.js`, or
   `js/ff-videoplayer.js`.
6. Include the shared navigation HTML inside `<div id="header">` and an empty
   `<div id="footer"></div>` placeholder.

Navigation is present in the initial response, so crawlers and visitors without
JavaScript can follow its links. Its native `details`/`summary` menu opens without
JavaScript; `js/ff-scripts.js` adds arrow-key navigation, Escape, and outside-click
and Tab dismissal. The existing header source remains the editing location:

```sh
npm run sync:header
node sync-ff-header --check
```

The second command checks for stale copies without writing files. Tests also
check every page's embedded header against the source. There is no deployment
build step or new dependency. New pages need the `ff-header:start` and
`ff-header:end` HTML comment markers before running the command.

`js/ff-scripts.js` fetches the footer at runtime, with an asset-version query
string for cache updates. It preserves already populated layout sections, and a
footer failure does not prevent navigation or download enhancement. Local
preview should still use a web server rather than opening HTML from Finder.

## Data Hooks

The site uses `data-*` attributes to connect simple HTML placeholders to shared
JavaScript behavior:

- `data-product-carousel="home"` or `data-product-carousel="powerPole"` tells
  `js/ff-scripts.js` which carousel data to render from `js/ff-product-data.js`.
- `data-download-plans="crissCross"` identifies a product's static download panel.
- `data-download-event="download_cc_build_pack"` tells `js/ff-scripts.js` which
  Simple Analytics event to send when an existing download link is clicked.
- `data-gallery-index` tells `js/ff-gallery.js` to render the Gallery landing
  page categories.
- `data-gallery="pandorasChest"` tells `js/ff-gallery.js` which Gallery detail
  images to render from `js/ff-gallery-data.js`.

Prefer `data-*` hooks for behavior and data keys. Use classes for styling and
layout.

## Product Pages

The product pages use ordinary Bootstrap rows and columns, plus project-specific
classes from `ff-styles.css`.

Each product page includes:

- A Bootstrap carousel placeholder using `data-product-carousel`.
- A product description section written directly in the page HTML.
- A complete `.ff-download-plans` section containing ordinary Build-Pack and
  3D viewer links, previews, and the package revision date.
- A hidden `ffDownloadFrame` iframe, available with or without JavaScript.

`js/ff-scripts.js` renders the carousel slides from `js/ff-product-data.js`,
generates the Bootstrap carousel indicators and previous/next controls, and adds
Simple Analytics events to the existing download links. It does not construct
or replace the download panels. Their content and links are available without
JavaScript.

The VersaHorse page follows the same general pattern, but has additional
component-description content and local links because it is a more complex
product.

## Build Packs and 3D Models

All four products use the Build-Pack presentation. The legacy Drawings/PDFs
panel and its separate analytics events have been retired; old ZIP files in
`plans/` remain available for existing external links.

The VersaHorse download panel contains:

- A Build-Pack button and the package revision date.
- Three linked Working-scene previews: Chest Rest, Pegasus Bench, and
  Pillory & Stock.
- A browser-viewing note and the existing conditional purchase information.

The button downloads `plans/versahorse-build-pack.zip` directly from
FoxyFurniture. It contains `START-HERE.pdf`, the BOM, construction instructions,
plywood and solid-wood cutting diagrams, and `DimensionedDrawings/`. The latter
includes dimensioned PDFs and the original DWGs in `VersaHorse-dwgs/`.
The original drawings predate the revisions; START-HERE explains how to use
them alongside the current build documents and models.

SketchUp models are hosted on Trimble, not in this repository or the Build Pack.
The website links to Trimble's browser-based 3D viewers; START-HERE contains
both viewing and model-download links. These are separate sharing links and
must be checked independently. Chest Rest has Working and Folded scenes; Pegasus Bench and
Pillory & Stock each have a Working scene.

Criss-Cross reuses the same panel with `plans/crisscross-build-pack.zip`, its
package revision date, and one linked preview for the model's Working and
Playing scenes. Its Build Pack includes the BOM, construction instructions,
Assembly Guide, cutting diagrams, drawing corrections, original dimensioned
PDFs/DWGs, two revised plate-fabrication DXFs, and START-HERE with separate
viewing/download links. Both products retain the Fetish Furniture purchase
link. The old Criss-Cross archives remain available for existing external
links but are no longer offered by the panel.

Pandora's Chest uses `plans/pandoraschest-build-pack.zip` and one linked model
preview. The model includes Mission and Raised Panel styles, each with Working,
Playing, Drawer Storage Detail and Leg Joint Detail scenes. Its pack contains
START-HERE, the combined BOM, construction instructions, Assembly Guide, plywood
and solid-wood cutting diagrams, annotated drawing PDFs, remaining drawing
corrections and the unchanged original DWGs. Its separate model-download link
is in START-HERE. The older plan ZIPs remain available for existing external links.

PowerPole uses `plans/powerpole-build-pack.zip`, revised November 11, 2026, and
one Working-scene preview linking to its seven-scene model. Its pack includes
START-HERE, BOM, construction instructions, plywood and solid-wood cutting
diagrams, four annotated dimensioned PDFs and four original DWGs. The separate
model-download link remains in START-HERE. PowerPole has no purchase referral.
The model and cutting diagrams use the BOM's stable Bxxx part references and
plain-English part names; instructions retain their stable Ixxx references.

### Sources and Published Files

Editable plans and reference material live outside this repository in the
sibling `FoxyFurniturePlans/` folder:

- `VersaHorse/` holds the editable START-HERE document and BOM/instruction
  workbooks.
- `VersaHorse/Build-Pack/` is the authoritative set of package contents.
- Each product configuration has its own SketchUp source and reference folders.
- `VersaHorse/ReleaseModels/` holds the prepared model uploads and packaged
  Build-Pack ZIP, not another editable, unpacked Build-Pack copy.
- `FF-Trimble-Links.xlsx` tracks public model links and verification results
  across products.
- `CrissCross/` follows the same source, `Build-Pack/`, and `ReleaseModels/`
  separation; `CrissCross-Model/SketchUp/CrissCross.skp` is its source master.
- `PandorasChest/` uses the same separation; its source master is
  `PandorasChest-Model/SketchUp/PandorasChest.skp`.
- `PowerPole/` uses the same separation; its source master is
  `PowerPole-Model/SketchUp/PowerPole-Fit-Study.skp`.

Only the prepared website assets and download ZIP belong in this repository.
The product viewer URLs, preview image paths, download paths, and displayed
revision date are written directly in each product page's `.ff-download-plans`
section.
Preview images are in `img/vh/models/`, `img/cc/models/`, `img/pc/models/` and
`img/pp/models/`. Keep their full-resolution source
pixels; CSS controls their displayed size.

### Replacing a Build Pack

1. Correct the editable source documents and regenerate any affected PDFs in
   `FoxyFurniturePlans/VersaHorse/Build-Pack/`.
2. ZIP that folder with a single `Build-Pack/` root. Exclude Finder metadata
   (`.DS_Store`, `__MACOSX`, and `._*` files), review drafts, archives, reference
   photos, and SketchUp files. Check for unintended duplicate drawings.
3. Keep the prepared ZIP in `ReleaseModels/`, then copy the same ZIP to this
   repository as `plans/versahorse-build-pack.zip`. Do not keep an unpacked
   `plans/VHPlans/` copy.
4. Update the revision `<time datetime="...">` and its displayed text in the
   product page's `.ff-download-plans` section, along with the corresponding
   date assertion in `test/ff-scripts.test.js`. This is the package revision
   date, separate from the website's release version.
5. Extract the ZIP into a temporary folder and open the included documents.
   Check its integrity, filenames, completeness, and START-HERE links. Confirm
   that the website downloads exactly the prepared ZIP.
6. Preview on desktop and phone, then follow the production release process
   below. After deployment, download the live ZIP and compare it with the
   prepared copy; a successful upload alone is not sufficient verification.

If model files or sharing links change, also update the link register,
START-HERE, and the website viewer URLs as applicable. Test both viewer and
download routes anonymously on desktop and phone. Do not assume a download
share follows future model versions automatically.

## Gallery

The Gallery has two layers:

- `gallery.html` contains a `data-gallery-index` placeholder for the main
  Gallery categories.
- Each `gallery-*.html` page contains a plain
  `<ul class="ff-gallery-list" data-gallery="..."></ul>` placeholder for one
  category.

`js/ff-gallery.js` renders the images from `js/ff-gallery-data.js`, applies a
CSS grid class, and turns each image into a lightbox trigger. The lightbox
itself is created by JavaScript only when needed. It supports:

- Responsive image sizing.
- Previous/next controls.
- Keyboard navigation with the left and right arrow keys.
- Touch swipe navigation on mobile.
- A visible image counter.

The Gallery intentionally uses the existing large images directly rather than
maintaining separate thumbnail directories.

## Home Page Video

The home page video is controlled by `js/ff-videoplayer.js`. The page contains
the video element and a custom play button. The script hides the button while
the movie is playing and shows it again when the movie is paused or ends.

The `ThisBecomesThis.mov` file is tricky to edit. The iMovie project on Mac
won't save in portrait. The workaround is to use Photos:

- When you're finished editing in iMovie, save the movie somewhere.
- Import it to Photos and open it.
- Tap Edit.
- Tap the Crop/rotate icon.
- Choose a 16:9 vertical aspect ratio (right pane) and portrait icon, or manually crop it tall.
- Save it!

## Local Development

Use the helper script to preview the site locally:

```sh
launch-ff
```

To preview from another device on the same local network, such as a phone:

```sh
launch-ff --lan
```

The script starts a small local web server from the project directory, chooses
an available port when needed, opens the site in the browser, and sends no-cache
headers to reduce stale browser-cache surprises during testing.

Use the URL printed by the script. The default is Mac-only; `--lan` allows
other devices on the same network to connect. Keep the Mac awake during phone
testing. Use LAN mode only on a trusted network: it serves the project
directory, not a filtered copy of the public website. The `~/Sites` folder
is not involved in this workflow.

## Testing

The project has a small Vitest unit test suite for the plain JavaScript behavior
in `js/`.

Run the tests with:

```sh
npm test
```

The test command uses jsdom, which gives the tests a browser-like `document` and
`window` without opening a real browser. This lets the tests exercise DOM
rendering, click handlers, keyboard events, touch events, and optional browser
globals such as `window.sa_event`.

Current test files:

- `test/ff-scripts.test.js` covers shared layout loading, carousel rendering and
  setup, actual product download markup, Simple Analytics download events, and
  repeated initialization behavior.
- `test/ff-navigation.test.js` checks navigation embedded in every HTML page,
  essential links available before JavaScript, keyboard/dismissal behavior, and
  resilience to footer loading failures.
- `test/ff-gallery.test.js` covers Gallery data rendering, modal behavior,
  keyboard navigation, touch swipes, guard clauses, and image-size calculation.
- `test/ff-videoplayer.test.js` covers the home page video play button,
  play/pause behavior, and end-of-video reset behavior.

These tests are intentionally focused on small, observable behavior. Prefer
adding tests near the behavior being changed, and keep the production code's
browser-safe CommonJS export guards in place so Vitest can import the functions
without changing how the scripts run in the browser.

## Sitemap

`sitemap.xml` lists the public HTML pages using HTTPS and the `www` hostname.
Keep it in sync when adding, removing, or renaming pages. The homepage uses `/`
instead of listing `/index.html` a second time. It intentionally omits optional
modification dates rather than estimating when each page's content changed.

During the November 12, 2026 crawler investigation (#79), Cloudflare reported
all ten unsuccessful ClaudeBot requests as HTTP 404 responses for
`/sitemap.xml`. Adding this file addresses that missing resource; the observed
failures did not require changing Cloudflare security policies. After publishing,
verify the live sitemap returns HTTP 200 and watch subsequent crawler requests.
The separate robots.txt work (#80) should advertise the sitemap URL.

## Contact Form

`contact.html` posts to Formspree using the small, dependency-free
`js/ff-contact.js` script. Submission feedback stays on FF. Failed or timed-out
requests preserve the visitor's text; the submit button is disabled while a
request is pending. The form accepts no attachments and includes a standard
`_gotcha` honeypot. JavaScript is required; FetLife is the fallback.

The Formspree endpoint and Cloudflare Turnstile site key in `contact.html` are
public identifiers. Keep the Turnstile **secret key only in Formspree's CAPTCHA
settings**, with Turnstile enabled so Formspree verifies tokens on its servers.
The destination email is verified and configured in Formspree, not in the site.
The Cloudflare widget should use Managed mode, with `foxyfurniture.net`,
`www.foxyfurniture.net`, and `localhost` allowed. The page shows the widget only
when interaction is needed. Keep spam filtering enabled in Formspree.

Preview through `launch-ff` using `localhost`. Unit tests mock delivery and
Turnstile; they send no emails. Before publishing, manually submit one test
message, check on-page confirmation and receipt in the destination inbox, and
verify spam protection is enabled in the Formspree dashboard. Repeat on the live
domain after an approved deployment. Monitor the account's submission quota;
filtered-spam quota handling has not been confirmed with Formspree.

## Asset Versioning

Browsers may cache CSS and JavaScript files aggressively. The project uses query
string versions on shared assets, such as:

```html
<link href="css/ff-styles.css?v=v3.0.4a1" rel="stylesheet" />
```

Use the version helper to update local CSS and JavaScript references across the
top-level HTML files:

```sh
./set-ff-version v3.0.4a1
```

The helper updates:

- `css/ff-styles.css`
- `js/ff-scripts.js`
- `js/ff-product-data.js`
- `js/ff-gallery-data.js`
- `js/ff-gallery.js`
- `js/ff-videoplayer.js`
- `js/ff-contact.js`
- the shared header/footer version constant inside `js/ff-scripts.js`

## Version strings

- Changing the version string makes the browser treat the referenced asset URL as new, which helps visitors receive updated CSS and JavaScript after a release.
- Use semantic versioning with a leading `v`: for example, `v3.0.4`.
- For development, append an alpha or beta prerelease marker: for example, `v3.0.4a1` or `v3.0.4b1`.
- Note that using Asset Versioning (above) does not require creating a named GitHub release for development. Again, the asset version strings are used for a "cache busting" strategy. If any of the files set-ff-version updates (see Asset Versioning), use set-ff-version to bump the string.

## Git Development Workflow

Check your current state before starting work:

```bash
git status
```

For feature work, use a branch:

```bash
git switch -c my-feature-branch
```

After feature work is complete:

```bash
./set-ff-version v3.0.4a3       # if version needs to be changed - see Asset Versioning
git add .
git commit -m "Describe the change"
git switch master
git pull --ff-only
git merge --ff-only my-feature-branch
```

If `git merge --ff-only` fails, stop and inspect before forcing the merge.

## Releasing new versions to production

- Anything pushed to Git master will be automatically published immediately.
- It should have a new, unique Git named version with at least the patch version number incremented.
- The new release version string should be applied to the assets. See Asset Versioning.
- Choose an unused version newer than the latest release, including for
  download-only corrections.

```bash
./set-ff-version v3.0.4         # Set to the target for Production
npm test
git diff --check
git add .
git commit -m "Describe the change"
git push origin master
gh release create v3.0.4 --generate-notes --target master
git fetch --tags
```

Review the files being committed before pushing. Confirm that GitHub's tests,
security checks, and deployment succeed, then check the live page and any
updated downloads. A documentation-only README edit does not require an asset
version change.

## Design Direction

The current development phase is a mobile-first redesign. Analytics showed that
most visitors are on mobile devices, so phone-sized layouts should be treated as
the primary experience and desktop layouts as the adaptation.

The existing media library is also a hard constraint. Redesign work should reuse
the images, icons, videos, and other media already present in the project rather
than depending on newly created assets.

Keep the site personal, understandable, and low-complexity. Prefer small,
iterative changes in HTML, CSS, Bootstrap, and plain JavaScript over large
rewrites or new frameworks.
