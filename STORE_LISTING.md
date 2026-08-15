# Chrome Web Store submission — copy/paste material

Everything you need for the Developer Dashboard listing. Upload
`diag-nav.zip` (in this folder) as the package.

## Basic info

**Name:** Private Prep Diagnostic Navigator

**Summary (132 chars max):**
Keyboard shortcuts for navigating questions in Private Prep reviews and College Board's SAT Suite Educator Question Bank.

**Category:** Productivity → Tools

**Language:** English

## Description

Adds keyboard navigation to diagnostic test review pages on tests.privateprep.com, built by tutors for tutors.

Shortcuts:
• Right / Left arrow — next / previous question
• Type a question number, then Enter — jump straight to it (e.g. 2, 4, Enter for question 24). Works for every question in the section, including ones not shown in the bottom number strip.
• Esc — cancel a partially typed number

A small on-screen indicator shows the number as you type it. Shortcuts are automatically disabled while your cursor is in a text field.

On the SAT Suite Educator Question Bank, open a question from your results and
use Left / Right arrow to activate the modal's Back / Next buttons. Press Space
to add the question to, or remove it from, your PDF selection.

The extension runs only on the listed Private Prep and College Board sites. It
collects no data and activates controls already on the page.

## Privacy tab

**Single purpose description:**
Provides keyboard shortcuts to navigate between questions on supported tutoring and test-preparation review pages.

**Permission justifications:**
- Content script on `https://tests.privateprep.com/*`: required to listen for keyboard shortcuts and activate the page's existing navigation links. This is the extension's sole function.
- Content script on `https://dashboard.privateprep.com/*`: required to show the full answer choices already available in the authenticated quiz library on quiz results pages.
- Content script on `https://satsuiteeducatorquestionbank.collegeboard.org/*`: required to map arrow keys and Space to the question modal's existing navigation and PDF-selection buttons.

**Data usage:** Select "This item does not collect or use user data." The extension has no storage and no analytics. Its Private Prep quiz-results feature makes same-site requests using the user's existing authenticated session; no data leaves the site or browser tab.

**Remote code:** No, all code is packaged in the extension.

## Distribution

**Visibility:** Unlisted — recommended, so only tutors with the link can install
it (it's a tool for one company's internal site). Can be switched to Public later.

## Assets still needed from you

- At least one **screenshot, 1280×800 or 640×400** (required by the store).
  Easiest: open a review page with the extension active, press a digit so the
  "Go to question" toast is visible, and screenshot the window.
- Icon is already in the package (icons/icon128.png).
