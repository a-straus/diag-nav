# Private Prep Diagnostic Navigator

Chrome extension adding keyboard navigation to `tests.privateprep.com` review pages.

## Shortcuts

- **← / →** — previous / next question
- **Type a question number, then Enter** — jump straight to it (e.g. `2` `4` `Enter`). Works even for questions outside the visible bottom pager (it uses the Nav modal's links).
- **Esc** — cancel a partially typed number

Shortcuts are ignored while you're typing in a text field.

## Install

1. Open `chrome://extensions`
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked** and select this folder (`~/dev/tools/diag-nav`)

After changing `nav.js`, hit the reload icon on the extension card and refresh the test page.
