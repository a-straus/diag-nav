# Chrome Web Store submission — copy/paste material

Everything you need for the Developer Dashboard listing. Upload
`diag-nav.zip` (in this folder) as the package.

## Basic info

**Name:** Private Prep Diagnostic Navigator

**Summary (132 chars max):**
Keyboard shortcuts for Private Prep diagnostic review pages: arrow keys for prev/next, type a question number + Enter to jump.

**Category:** Productivity → Tools

**Language:** English

## Description

Adds keyboard navigation to diagnostic test review pages on tests.privateprep.com, built by tutors for tutors.

Shortcuts:
• Right / Left arrow — next / previous question
• Type a question number, then Enter — jump straight to it (e.g. 2, 4, Enter for question 24). Works for every question in the section, including ones not shown in the bottom number strip.
• Esc — cancel a partially typed number

A small on-screen indicator shows the number as you type it. Shortcuts are automatically disabled while your cursor is in a text field.

The extension runs only on tests.privateprep.com. It collects no data and simply activates the same navigation links already on the page.

## Privacy tab

**Single purpose description:**
Provides keyboard shortcuts to navigate between questions on tests.privateprep.com diagnostic review pages.

**Permission justifications:**
- Content script on `https://tests.privateprep.com/*`: required to listen for keyboard shortcuts and activate the page's existing navigation links. This is the extension's sole function.

**Data usage:** Select "This item does not collect or use user data." The extension has no storage, no network requests, no analytics.

**Remote code:** No, all code is packaged in the extension.

## Distribution

**Visibility:** Unlisted — recommended, so only tutors with the link can install
it (it's a tool for one company's internal site). Can be switched to Public later.

## Assets still needed from you

- At least one **screenshot, 1280×800 or 640×400** (required by the store).
  Easiest: open a review page with the extension active, press a digit so the
  "Go to question" toast is visible, and screenshot the window.
- Icon is already in the package (icons/icon128.png).
