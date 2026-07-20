# Prompt for hosting the privacy policy (paste to the model with Cloudflare access)

Please host a static privacy policy page on my Cloudflare account (Cloudflare
Pages or a Worker serving plain HTML — whichever is simpler with my existing
setup). It's for a Chrome extension I'm publishing to the Chrome Web Store; the
store requires a public privacy policy URL. When done, give me the final public
URL.

Requirements:

- A single page (HTML is fine, minimal styling, readable on mobile) at a stable
  URL, e.g. `/diag-nav/privacy` or a dedicated subdomain path — your choice,
  just keep it permanent.
- No scripts, no analytics on the page itself.

Page content (use exactly this, filling in today's date):

---

# Privacy Policy — Private Prep Diagnostic Navigator

Last updated: [today's date]

Private Prep Diagnostic Navigator is a Chrome extension that adds keyboard
shortcuts for navigating between questions on diagnostic test review pages at
tests.privateprep.com.

**Data collection: none.** This extension does not collect, store, transmit,
sell, or share any user data of any kind. It has no analytics, no tracking, no
accounts, and makes no network requests of its own.

**How it works.** The extension runs a single content script only on pages
under tests.privateprep.com. The script listens for keyboard input on those
pages and activates navigation links that already exist on the page — the same
links a user would click manually. Nothing the script reads (key presses, page
content) ever leaves the browser tab.

**Permissions.** The extension requests access to tests.privateprep.com only.
This host permission exists solely so the content script can run on those pages
and perform the navigation described above.

**Third parties.** No data is shared with third parties, because no data is
collected.

**Changes.** If this policy ever changes, the updated version will be posted at
this URL.

**Contact.** Questions about this policy: a.straus1@gmail.com. Source code:
https://github.com/a-straus/diag-nav
