const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const header = fs.readFileSync(path.join(root, 'js/shared/header.html'), 'utf8').trim();
const pages = fs.readdirSync(root).filter(function (file) { return file.endsWith('.html'); });
const { initSharedLayout, initDownloadPlans } = require('../js/ff-scripts');

afterEach(function () {
	document.body.replaceChildren();
	delete global.fetch;
});

describe('published HTML without JavaScript', function () {
	it.each(pages)('%s includes the shared navigation and working page links', function (file) {
		const html = fs.readFileSync(path.join(root, file), 'utf8');
		expect(html).toContain('<!-- ff-header:start -->\n' + header + '\n<!-- ff-header:end -->');
		const page = new DOMParser().parseFromString(html, 'text/html');
		const menu = page.querySelector('nav[aria-label="Main navigation"] details');
		expect(menu.querySelector('summary').getAttribute('aria-label')).toBe('Open navigation menu');
		const hrefs = Array.from(menu.querySelectorAll('a'), function (a) { return a.getAttribute('href'); });
		expect(hrefs.sort()).toEqual(pages.slice().sort());
		expect(menu.querySelector('[data-bs-toggle]')).toBeNull();
	});

	it.each(['criss-cross.html', 'pandoras-chest.html', 'powerpole.html', 'versahorse.html'])('%s exposes downloads and models before initialization', function (file) {
		const html = fs.readFileSync(path.join(root, file), 'utf8');
		const page = new DOMParser().parseFromString(html, 'text/html');
		const panel = page.querySelector('.ff-download-plans');
		const download = panel.querySelector('a[download]');
		expect(fs.existsSync(path.join(root, download.getAttribute('href')))).toBe(true);
		expect(page.querySelectorAll('iframe[name="ffDownloadFrame"]')).toHaveLength(1);
		expect(panel.querySelectorAll('.ff-model-links a').length).toBe(file === 'versahorse.html' ? 3 : 1);
		panel.querySelectorAll('.ff-model-links a').forEach(function (link) {
			expect(link.getAttribute('href')).toMatch(/^https:\/\/app\.sketchup\.com\/share\//);
			expect(fs.existsSync(path.join(root, link.querySelector('img').getAttribute('src')))).toBe(true);
		});
	});
});

describe('navigation enhancement', function () {
	beforeEach(function () { document.body.innerHTML = header + '<button id="outside">Outside</button>'; });

	it('supports arrows, Home/End, and Escape with focus returned to the summary', function () {
		const menu = document.querySelector('details');
		const summary = menu.querySelector('summary');
		const links = Array.from(menu.querySelectorAll('a'));
		const key = function (name) { document.activeElement.dispatchEvent(new KeyboardEvent('keydown', {key: name, bubbles: true, cancelable: true})); };
		summary.focus();
		key('ArrowDown');
		expect(menu.open).toBe(true);
		expect(document.activeElement).toBe(links[0]);
		key('ArrowDown');
		expect(document.activeElement).toBe(links[1]);
		key('End');
		expect(document.activeElement).toBe(links[links.length - 1]);
		key('Home');
		expect(document.activeElement).toBe(links[0]);
		key('Escape');
		expect(menu.open).toBe(false);
		expect(document.activeElement).toBe(summary);
		key('ArrowUp');
		expect(document.activeElement).toBe(links[links.length - 1]);
	});

	it('dismisses on an outside click or when Tab leaves navigation', function () {
		const menu = document.querySelector('details');
		menu.open = true;
		document.querySelector('#outside').click();
		expect(menu.open).toBe(false);
		menu.open = true;
		document.querySelector('#outside').focus();
		document.activeElement.dispatchEvent(new KeyboardEvent('keyup', {key: 'Tab', bubbles: true}));
		expect(menu.open).toBe(false);
	});

	it('dismisses on link activation without preventing navigation', function () {
		const menu = document.querySelector('details');
		menu.open = true;
		// Clicking an image inside a link must behave like clicking its text.
		const event = new Event('click', {bubbles: true, cancelable: true});
		menu.querySelector('a img').dispatchEvent(event);
		expect(menu.open).toBe(false);
		expect(event.defaultPrevented).toBe(false);
	});

	it.each([false, true])('dismisses when a page is shown (restored from cache: %s)', function (persisted) {
		const menu = document.querySelector('details');
		menu.open = true;
		window.dispatchEvent(new PageTransitionEvent('pageshow', {persisted}));
		expect(menu.open).toBe(false);
	});
});

it('preserves embedded navigation and downloads if the footer fetch fails', async function () {
	document.body.innerHTML = fs.readFileSync(path.join(root, 'powerpole.html'), 'utf8');
	const menu = document.querySelector('[data-site-menu]');
	const download = document.querySelector('[data-download-event]');
	global.fetch = vi.fn().mockRejectedValue(new Error('offline'));
	await expect(initSharedLayout()).rejects.toThrow('offline');
	initDownloadPlans();
	initDownloadPlans();
	initDownloadPlans();
	expect(fetch).toHaveBeenCalledTimes(1);
	expect(fetch.mock.calls[0][0]).toContain('js/shared/footer.html');
	expect(document.querySelector('[data-site-menu]')).toBe(menu);
	expect(document.querySelector('[data-download-event]')).toBe(download);
	expect(document.querySelectorAll('iframe[name="ffDownloadFrame"]')).toHaveLength(1);
});
