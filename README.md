# Private Prep Diagnostic Navigator

A tiny Chrome extension that adds keyboard shortcuts for moving between questions
when reviewing diagnostic tests on **tests.privateprep.com**. No more clicking
the tiny Prev/Next buttons or hunting through the number strip.

## How to use it

Open any diagnostic review page (the ones with a question on screen and the
numbered strip along the bottom). The shortcuts are active automatically:

| Keys | What happens |
|---|---|
| **→** (right arrow) | Next question |
| **←** (left arrow) | Previous question |
| **number, then Enter** | Jump straight to that question — e.g. press `2` `4` `Enter` to go to question 24 |
| **Esc** | Cancel a number you started typing |

While you type a number, a small black toast appears in the bottom-right corner
showing what you've entered (e.g. "Go to question: 24") so you can see it
registered before you hit Enter.

A few details worth knowing:

- Jumping works for **every** question in the section, even ones not currently
  visible in the bottom number strip — the extension uses the site's own "Nav"
  menu behind the scenes to find the right link.
- Shortcuts are ignored whenever your cursor is in a text box, so they never
  interfere with typing.
- The extension only runs on `tests.privateprep.com` pages. It does not read,
  collect, or send any data anywhere — it just clicks the same links you would
  click by hand.

## Install (from the Chrome Web Store)

Install it from the Web Store link your team shared, then refresh any review
page you already had open.

## Install (from source, for development)

1. Download or clone this repository
2. Open `chrome://extensions` in Chrome
3. Turn on **Developer mode** (toggle in the top right)
4. Click **Load unpacked** and select this folder

After editing `nav.js`, hit the reload icon on the extension's card in
`chrome://extensions`, then refresh the test page.

## How it works (for the curious)

The whole extension is one content script, `nav.js`. It listens for keydown
events on review pages:

- Arrow keys find the page's own **Prev**/**Next** links and click them.
- For number jumps it first checks the bottom pager strip for a link with that
  number. If the question isn't in the visible window of the strip, it opens
  the site's **Nav** modal (which lists every question with a real link),
  clicks the matching question, and the page navigates normally. Question IDs
  in the URL are not sequential, so links from the page itself are the only
  reliable way to navigate.

No background scripts, no permissions beyond running on the one site, no data
collection of any kind.
