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

Supporting files are grouped by purpose:

- `css/ff-styles.css` contains the site-specific layout, responsive behavior,
  carousel styling, Gallery grid, lightbox styling, and other visual rules.
- `js/ff-scripts.js` loads shared header/footer markup, initializes Bootstrap
  carousels, renders carousel slides from data, and builds the product-page
  download panels.
- `js/ff-product-data.js` contains the home page and product page carousel
  image paths, alt text, captions, and per-slide display options.
- `js/ff-gallery-data.js` contains the Gallery landing page and Gallery detail
  page image data.
- `js/ff-gallery.js` renders Gallery pages into responsive CSS grids and
  provides the custom lightbox behavior.
- `js/ff-videoplayer.js` handles the home page video play/pause overlay.
- `js/shared/header.html` and `js/shared/footer.html` contain repeated page
  markup that is fetched into each page at runtime.
- `img/` contains the existing image, icon, carousel, and Gallery assets.
- `plans/` contains downloadable plan archives.

## Page Loading Model

Most pages share the same basic structure:

1. Load Bootstrap from a CDN.
2. Load `css/ff-styles.css`.
3. Load Bootstrap's JavaScript bundle.
4. Load any page-specific data files, such as `js/ff-product-data.js` or
   `js/ff-gallery-data.js`.
5. Load page behavior, such as `js/ff-scripts.js`, `js/ff-gallery.js`, or
   `js/ff-videoplayer.js`.
6. Include empty `<div id="header"></div>` and `<div id="footer"></div>`
   placeholders in the page body.

When the page loads, `js/ff-scripts.js` fetches `js/shared/header.html` and
`js/shared/footer.html` and inserts them into those placeholders. This keeps the
navigation and footer in one place instead of duplicating that markup across
every page. The shared header/footer fetches also use an asset version query
string so browsers pick up header/footer changes during releases.

Because the shared header and footer are fetched by the browser, local preview
should be done through a local web server rather than by opening the HTML files
directly from Finder.

## Data Hooks

The site uses `data-*` attributes to connect simple HTML placeholders to shared
JavaScript behavior:

- `data-product-carousel="home"` or `data-product-carousel="powerPole"` tells
  `js/ff-scripts.js` which carousel data to render from `js/ff-product-data.js`.
- `data-download-plans="crissCross"` tells `js/ff-scripts.js` which plan
  download buttons to render.
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
- A `<div class="ff-download-plans" data-download-plans="..."></div>`
  placeholder.

`js/ff-scripts.js` renders the carousel slides from `js/ff-product-data.js`,
generates the Bootstrap carousel indicators and previous/next controls, and
replaces the download placeholder with the correct plan download buttons. The
same script also sends Simple Analytics download events when those buttons are
clicked.

The VersaHorse page follows the same general pattern, but has additional
component-description content and local links because it is a more complex
product.

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

```bash
./set-ff-version v3.0.4         # Set to the target for Production
git add .
git commit -m "Describe the change"
git push origin master
gh release create v3.0.4 --generate-notes --target master
git fetch --tags
```

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
