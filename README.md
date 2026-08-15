# Private Prep Diagnostic Navigator

A tiny Chrome extension for diagnostic tests on **tests.privateprep.com**:
keyboard shortcuts for moving between questions on review pages, and deep links
from the score report's answer sheet straight to each question in review mode.
No more clicking the tiny Prev/Next buttons or hunting through the number strip.

It also improves quiz results pages on **dashboard.privateprep.com**: every
question gets its full A–D answer choice list, not just the student's answer
and the correct one.

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

## Score report deep links

On a score report page (`tests.privateprep.com/scores/...`), open a module's
**View All Answers** table. Each question number gets a small **↗** link that
opens that exact question in the review flow, in a new tab — no more counting
your way through the section by hand. Adaptive Module 2 links point at the
variant (Lower/Higher) the student actually took.

## Full answer choices on quiz results

On a digital quiz results page (`dashboard.privateprep.com/students/.../
digital_content_quiz_assignments/.../results`), each question normally shows
only the student's answer and the correct answer — the other choices are
missing. The extension adds an **All choices** list (A–D) to every question,
with the correct answer marked ✓ and the student's wrong pick marked ✗, plus
a **View in Quiz Library** link in the header that goes to the quiz's admin
page.

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
- On score report pages it instead fetches the review section pages (same site,
  same login) and reads the question order the review app embeds in its own
  HTML, then adds a link next to each question number in the answer sheet.

A second content script, `quiz-results.js`, runs on dashboard quiz results
pages. The results page doesn't carry the quiz's id, only its title, so the
script looks the title up in the `/quizzes` library index, fetches that quiz's
student preview page (`/quizzes/<id>/preview`, the only page that renders all
answer choices), matches each preview question to the on-page questions by
their text, and injects the full choice list. If two quizzes share a title it
picks the one whose questions actually match. All fetches are same-site with
your existing login.

No background scripts, no permissions beyond running on the two Private Prep
sites, no data collection of any kind.
