const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const pages = fs.readdirSync(root).filter(function (file) { return file.endsWith('.html'); });

it.each(pages)('%s has an ordered heading outline and consistent sharing metadata', function (file) {
	const page = new DOMParser().parseFromString(fs.readFileSync(path.join(root, file), 'utf8'), 'text/html');
	expect(page.querySelectorAll('h1')).toHaveLength(1);
	const headings = Array.from(page.querySelectorAll('h1, h2, h3, h4, h5, h6'));
	expect(headings[0].tagName).toBe('H1');
	headings.forEach(function (heading, index) {
		expect(heading.textContent.trim()).not.toBe('');
		if (index) expect(Number(heading.tagName.slice(1))).toBeLessThanOrEqual(Number(headings[index - 1].tagName.slice(1)) + 1);
	});
	const meta = function (attribute, key) {
		const tags = page.head.querySelectorAll('meta[' + attribute + '="' + key + '"]');
		expect(tags).toHaveLength(1);
		return tags[0].getAttribute('content');
	};
	const title = page.title;
	const description = meta('name', 'description');
	expect(meta('property', 'og:title')).toBe(title);
	expect(meta('name', 'twitter:title')).toBe(title);
	expect(meta('property', 'og:description')).toBe(description);
	expect(meta('name', 'twitter:description')).toBe(description);
	expect(meta('property', 'og:url')).toBe(page.head.querySelector('link[rel="canonical"]').getAttribute('href'));
	expect(meta('property', 'og:type')).toBe('website');
	expect(meta('property', 'og:site_name')).toBe('Foxy Furniture');
	expect(meta('name', 'twitter:card')).toBe('summary');
	const imageUrl = new URL(meta('property', 'og:image'));
	expect(imageUrl.origin).toBe('https://www.foxyfurniture.net');
	expect(fs.existsSync(path.join(root, imageUrl.pathname))).toBe(true);
	expect(meta('name', 'twitter:image')).toBe(imageUrl.href);
	const alt = meta('property', 'og:image:alt');
	expect(alt.trim()).not.toBe('');
	expect(meta('name', 'twitter:image:alt')).toBe(alt);
	expect(Number(meta('property', 'og:image:width'))).toBeGreaterThan(0);
	expect(Number(meta('property', 'og:image:height'))).toBeGreaterThan(0);
});
