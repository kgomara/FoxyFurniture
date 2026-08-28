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
  carousels, and builds the product-page download panels.
- `js/ff-gallery.js` converts Gallery image lists into a responsive CSS grid
  and provides the custom lightbox behavior.
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
4. Load `js/ff-scripts.js`.
5. Include empty `<div id="header"></div>` and `<div id="footer"></div>`
   placeholders in the page body.

When the page loads, `js/ff-scripts.js` fetches `js/shared/header.html` and
`js/shared/footer.html` and inserts them into those placeholders. This keeps the
navigation and footer in one place instead of duplicating that markup across
every page.

Because the shared header and footer are fetched by the browser, local preview
should be done through a local web server rather than by opening the HTML files
directly from Finder.

## Product Pages

The product pages use ordinary Bootstrap rows and columns, plus project-specific
classes from `ff-styles.css`.

Each product page includes:

- A Bootstrap carousel using the shared `ff-carousel-os-controls` styling.
- A product description section written directly in the page HTML.
- A `<div class="ff-download-plans"></div>` placeholder.

`js/ff-scripts.js` looks at the current page filename and replaces the download
placeholder with the correct plan download buttons. The same script also sends
Simple Analytics download events when those buttons are clicked.

The VersaHorse page follows the same general pattern, but has additional
component-description content and local links because it is a more complex
product.

## Gallery

The Gallery has two layers:

- `gallery.html` shows the main Gallery categories.
- Each `gallery-*.html` page contains a plain list of images for one category.

On Gallery detail pages, `js/ff-gallery.js` finds the image list, applies a CSS
grid class, and turns each image into a lightbox trigger. The lightbox itself is
created by JavaScript only when needed. It supports:

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

The ThisBecomesThis.mov is tricky to edit. The iMovie project on Mac won't save in portrait. THe workaround is use Photos:

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
<link href="css/ff-styles.css?v=3.0.1.a1" rel="stylesheet" />
```

Use the version helper to update the shared CSS and JavaScript references across
the top-level HTML files:

```sh
set-ff-version 3.0.1.a1
```

## Version strings

- Use a x.y.z format where x,y,z = major,minor,bug: e.g., v3.0.1
- For development, append numbered .d, .a, .b for development, alpha, beta builds: e.g., v3.0.1.b1

## Releasing new versions to production

- Anything pushed to Git Master will be automatically published immediately.
- It should have a new, unique Git Named Version with (at least) version bug string incremented.
- The new (release) version string should be applied to the assets - see Asset Versioning.

Changing the version string makes the browser treat the referenced asset URL as new, which helps visitors receive updated CSS and JavaScript after a release.

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
