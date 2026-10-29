const fs = require('node:fs');
const path = require('node:path');
const footer = fs.readFileSync(path.join(__dirname, '../js/shared/footer.html'), 'utf8');

describe('shared footer', function () {
	beforeEach(function () {
		document.body.innerHTML = footer;
	});

	it('links the Simple Analytics badge to the actual site with safe new-tab behavior', function () {
		const link = document.querySelector('.ff-analytics-badge');
		const url = new URL(link.href);
		expect(url.origin).toBe('https://www.simpleanalytics.com');
		expect(url.searchParams.get('utm_source')).toBe('www.foxyfurniture.net');
		expect(url.searchParams.get('utm_content')).toBe('badge');
		expect(link.target).toBe('_blank');
		expect(link.rel).toBe('noopener');
		expect(link.getAttribute('referrerpolicy')).toBe('origin');
	});

	it('preserves the supplied badge size, appearance and image privacy settings', function () {
		const image = document.querySelector('.ff-analytics-badge img');
		const url = new URL(image.src);
		expect(url.origin).toBe('https://simpleanalyticsbadges.com');
		expect(url.pathname).toBe('/www.foxyfurniture.net');
		expect(Object.fromEntries(url.searchParams)).toEqual({background: 'transparent', text: '677779', logo: 'ff4f64', radius: '3', counter: 'false'});
		expect(image.getAttribute('width')).toBe('168');
		expect(image.getAttribute('height')).toBe('40');
		expect(image.alt).toBe('Simple Analytics');
		expect(image.getAttribute('loading')).toBe('lazy');
		expect(image.getAttribute('referrerpolicy')).toBe('no-referrer');
		expect(image.getAttribute('crossorigin')).toBe('anonymous');
	});

	it('retains the copyright and removes AddToAny scripts and markup', function () {
		expect(document.querySelector('footer').textContent).toContain('©2005-2026 Foxy Furniture');
		expect(document.querySelectorAll('footer script')).toHaveLength(0);
		expect(footer).not.toMatch(/addtoany|a2a_config|a2a_dd/i);
	});

	it('keeps the footer side by side at the small breakpoint without a copyright bottom gap', function () {
		const columns = document.querySelector('footer > .row').children;
		expect(columns).toHaveLength(2);
		Array.from(columns).forEach(function (column) {
			expect(column.classList.contains('col-sm-6')).toBe(true);
			expect(column.classList.contains('col-12')).toBe(true);
		});
		expect(document.querySelector('footer p').classList.contains('mb-0')).toBe(true);
	});
});
