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
tests.privateprep.com and question-detail modals in College Board's SAT Suite
Educator Question Bank. It also displays complete answer choices on authorized
Private Prep quiz-results pages using information already available to the
signed-in tutor in Private Prep's quiz library.

**Data collection: none.** This extension does not collect, store, transmit,
sell, or share any user data of any kind. It has no analytics, no tracking, and
no accounts.

**How it works.** The extension listens for keyboard input on supported review
pages and activates navigation controls that already exist on the page — the
same controls a user would click manually. On Private Prep quiz-results pages,
it makes same-site requests to Private Prep pages available through the tutor's
existing signed-in session so it can display the complete choices belonging to
that quiz. Nothing is sent to the extension developer or to any third party.

**Permissions.** The extension requests access only to tests.privateprep.com,
dashboard.privateprep.com, and
satsuiteeducatorquestionbank.collegeboard.org. These host permissions exist
solely so its content scripts can provide the features described above.

**Third parties.** No data is shared with third parties, because no data is
collected.

**Changes.** If this policy ever changes, the updated version will be posted at
this URL.

**Contact.** Questions about this policy: a.straus1@gmail.com. Source code:
https://github.com/a-straus/diag-nav
