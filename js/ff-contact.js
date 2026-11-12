/*global document, window: false */

document.addEventListener('DOMContentLoaded', initContactForm);

function initContactForm() {
	const form = document.querySelector('[data-contact-form]');
	if (!form || form.dataset.initialized) return;
	form.dataset.initialized = 'true';
	const button = form.querySelector('[type="submit"]');
	const status = form.querySelector('[data-contact-status]');
	let sending = false;
	button.disabled = false;

	form.addEventListener('submit', async function (event) {
		event.preventDefault();
		if (sending || !form.reportValidity()) return;
		let token = '';
		try {
			token = window.turnstile ? window.turnstile.getResponse() : '';
		} catch (_error) {
			// The provider script may have loaded before its widget is ready.
		}
		if (!token) {
			status.textContent = 'Please wait for spam verification to finish, or complete the checkbox if shown. If verification is unavailable, reload this page or use FetLife above.';
			status.focus();
			return;
		}
		if (form.elements._gotcha.value) return;

		sending = true;
		button.disabled = true;
		button.textContent = 'Sending…';
		status.textContent = 'Sending your message…';
		const controller = new AbortController();
		const timeout = window.setTimeout(function () { controller.abort(); }, 30000);
		try {
			const response = await fetch(form.action, {
				method: 'POST',
				body: new FormData(form),
				headers: { Accept: 'application/json' },
				signal: controller.signal
			});
			if (!response.ok) throw new Error('Submission rejected');
			form.reset();
			status.textContent = 'Thanks! Your message has been submitted.';
		} catch (_error) {
			status.textContent = 'We could not confirm that your message was sent. Your message is still here. Please try again shortly or use FetLife above.';
		} finally {
			window.clearTimeout(timeout);
			sending = false;
			button.disabled = false;
			button.textContent = 'Send message';
			window.turnstile.reset();
			status.focus();
		}
	});
}

if (typeof module !== 'undefined') {
	module.exports = { initContactForm };
}
