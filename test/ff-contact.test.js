const fs = require('node:fs');
const { initContactForm } = require('../js/ff-contact');
const page = fs.readFileSync(require('node:path').join(__dirname, '../contact.html'), 'utf8');
let form;
let status;
function submit() {
 form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}
beforeEach(function () {
 document.body.innerHTML = page.slice(page.indexOf('<body>'));
 form = document.querySelector('form');
 status = form.querySelector('[data-contact-status]');
 form.elements.email.value = 'builder@example.com';
 form.elements.product.value = 'VersaHorse';
 form.elements.topic.value = 'Build question';
 form.elements.message.value = 'A build question';
 window.turnstile = { getResponse: vi.fn(() => 'test-token'), reset: vi.fn() };
 global.fetch = vi.fn().mockResolvedValue({ ok: true });
 initContactForm();
});
afterEach(function () {
 vi.restoreAllMocks();
 vi.useRealTimers();
 delete global.fetch;
 delete window.turnstile;
 document.body.replaceChildren();
});
it('requires completed verification before sending', function () {
 window.turnstile.getResponse.mockReturnValue('');
 submit();
 expect(fetch).not.toHaveBeenCalled();
 expect(status.textContent).toContain('verification');
 delete window.turnstile;
 submit();
 expect(fetch).not.toHaveBeenCalled();
});
it('rejects invalid fields and honeypot submissions', function () {
 form.elements.email.value = '';
 submit();
 expect(fetch).not.toHaveBeenCalled();
 form.elements.email.value = 'builder@example.com';
 form.elements._gotcha.value = 'spam';
 submit();
 expect(fetch).not.toHaveBeenCalled();
});
it('posts to the configured endpoint and resets only after success', async function () {
 submit();
 await vi.waitFor(() => expect(status.textContent).toContain('Thanks!'));
 expect(fetch.mock.calls[0][0]).toBe('https://formspree.io/f/xyewzpwl');
 const options = fetch.mock.calls[0][1];
 expect(options.method).toBe('POST');
 expect(options.body.get('message')).toBe('A build question');
 expect(options.headers.Accept).toBe('application/json');
 expect(form.elements.message.value).toBe('');
 expect(window.turnstile.reset).toHaveBeenCalledOnce();
});
it.each([400, 429, 500])('preserves the message on HTTP %s', async function (code) {
 fetch.mockResolvedValue({ ok: false, status: code });
 submit();
 await vi.waitFor(() => expect(status.textContent).toContain('could not confirm'));
 expect(form.elements.message.value).toBe('A build question');
 expect(form.querySelector('button').disabled).toBe(false);
});
it('prevents duplicate sends and preserves text on network failure', async function () {
 let reject;
 fetch.mockReturnValue(new Promise((_resolve, fail) => { reject = fail; }));
 initContactForm();
 submit();
 submit();
 expect(fetch).toHaveBeenCalledOnce();
 expect(form.querySelector('button').disabled).toBe(true);
 reject(new Error('offline'));
 await vi.waitFor(() => expect(status.textContent).toContain('could not confirm'));
 expect(form.elements.message.value).toBe('A build question');
});

it('handles a widget that has not finished rendering', function () {
 window.turnstile.getResponse.mockImplementation(() => { throw new Error('No widget'); });
 submit();
 expect(fetch).not.toHaveBeenCalled();
 expect(status.textContent).toContain('verification');
});
it('times out a stalled request without clearing the message', async function () {
 vi.useFakeTimers();
 fetch.mockImplementation((_url, options) => new Promise((_resolve, reject) => {
  options.signal.addEventListener('abort', () => reject(new Error('aborted')));
 }));
 submit();
 await vi.advanceTimersByTimeAsync(30000);
 expect(status.textContent).toContain('could not confirm');
 expect(form.elements.message.value).toBe('A build question');
 expect(form.querySelector('button').disabled).toBe(false);
});
