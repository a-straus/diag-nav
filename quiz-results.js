// Full answer choices on dashboard.privateprep.com quiz results pages.
// The results page for a digital-content quiz assignment only shows the
// student's answer and the correct answer. The full choice list (A-D) is
// only rendered by the quiz-library preview at /quizzes/<id>/preview, and
// the results page carries no quiz id — only the quiz title. So: look the
// title up in the /quizzes index, fetch that quiz's preview, match its
// questions to the ones on this page by stem text, and inject the choices.

(() => {
  const onResultsPage = () =>
    /^\/students\/\d+\/digital_content_quiz_assignments\/[^/]+\/results/
      .test(location.pathname);

  const normalize = (el) =>
    (el ? el.textContent : "").replace(/\s+/g, " ").trim();

  // Matching key: textContent doesn't add spaces at <br>/<div> boundaries and
  // the two pages wrap the same content differently, so compare with all
  // whitespace removed. Math is wrapped in .quiz-katex-placeholder, whose
  // data-quiz-katex-source holds the raw LaTeX; the live page renders KaTeX
  // inside it (duplicating the text via MathML + HTML) while DOMParser'd
  // preview pages stay unrendered — so key on the source attribute, which is
  // identical on both.
  const key = (el) => {
    if (!el) return "";
    const clone = el.cloneNode(true);
    for (const m of clone.querySelectorAll(".quiz-katex-placeholder")) {
      m.replaceWith(m.getAttribute("data-quiz-katex-source") || "");
    }
    return clone.textContent.replace(/\s+/g, "");
  };

  const parseHTML = (text) =>
    new DOMParser().parseFromString(text, "text/html");

  async function fetchDoc(path) {
    try {
      const res = await fetch(path, { credentials: "same-origin" });
      if (!res.ok) return null;
      return parseHTML(await res.text());
    } catch {
      return null;
    }
  }

  // /quizzes lists every quiz; titles aren't unique in principle, so return
  // every id whose link text matches and let the caller verify by content.
  async function findQuizIds(title) {
    const doc = await fetchDoc("/quizzes");
    if (!doc) return [];
    const ids = [];
    for (const a of doc.querySelectorAll("a[href^='/quizzes/']")) {
      const m = a.getAttribute("href").match(/^\/quizzes\/(\d+)$/);
      if (m && normalize(a) === title && !ids.includes(m[1])) ids.push(m[1]);
    }
    return ids;
  }

  // Preview page -> [{stem, choices: [{letter, contentEl}]}]
  async function fetchPreviewQuestions(quizId) {
    const doc = await fetchDoc(`/quizzes/${quizId}/preview`);
    if (!doc) return null;
    const questions = [];
    for (const q of doc.querySelectorAll(".quiz-runner__question")) {
      const stem = q.querySelector(
        ".quiz-runner__question-body .quiz-rendered-content"
      );
      const choices = [...q.querySelectorAll(".quiz-runner__choice")].map(
        (c) => ({
          letter: normalize(c.querySelector(".quiz-runner__choice-bubble")),
          contentEl: c.querySelector(".quiz-runner__choice-content"),
        })
      );
      if (stem && choices.length) {
        questions.push({ stem: key(stem), choices });
      }
    }
    return questions.length ? questions : null;
  }

  function resultCards() {
    return [...document.querySelectorAll(
      "section.student-section .legacy-card[data-controller='quiz-content']"
    )].map((card) => {
      const dds = {};
      for (const dt of card.querySelectorAll("dl dt")) {
        const dd = dt.nextElementSibling;
        if (dd && dd.tagName === "DD") dds[normalize(dt)] = dd;
      }
      return {
        card,
        dl: card.querySelector("dl"),
        stem: key(card.querySelector(".quiz-rendered-content")),
        yourAnswer: key(dds["Your answer"]),
        correctAnswer: key(dds["Correct answer"]),
      };
    });
  }

  function injectChoices(result, question) {
    if (!result.dl || result.dl.querySelector(".diag-nav-choices")) return;
    const dt = document.createElement("dt");
    dt.className = "diag-nav-choices-label";
    dt.textContent = "All choices";
    const dd = document.createElement("dd");
    dd.className = "diag-nav-choices";
    for (const choice of question.choices) {
      const text = key(choice.contentEl);
      const isCorrect = text === result.correctAnswer;
      const isYours = text === result.yourAnswer;
      const row = document.createElement("div");
      row.style.cssText =
        "display:flex;gap:8px;align-items:baseline;padding:2px 0;";
      const bubble = document.createElement("strong");
      bubble.textContent = choice.letter;
      bubble.style.cssText = "min-width:1.2em;";
      const content = document.createElement("span");
      content.className = "quiz-rendered-content";
      content.append(...[...choice.contentEl.childNodes].map((n) =>
        document.importNode(n, true)
      ));
      // Preview HTML comes from DOMParser, so its math was never rendered.
      // Render it with the bundled KaTeX; the page's own KaTeX CSS/fonts
      // style the output. Fall back to the raw LaTeX source.
      for (const m of content.querySelectorAll(
        ".quiz-katex-placeholder:not([data-quiz-katex-rendered])"
      )) {
        const src = m.getAttribute("data-quiz-katex-source") || "";
        try {
          katex.render(src, m, {
            throwOnError: false,
            displayMode: m.getAttribute("data-quiz-katex-format") !== "inline",
          });
          m.setAttribute("data-quiz-katex-rendered", "true");
        } catch {
          if (!m.textContent.trim()) m.textContent = src;
        }
      }
      row.append(bubble, content);
      // Rows stay neutral so the list reads as a fresh multiple choice; the
      // review-mode buttons unhide these marks and color the rows on demand.
      if (isCorrect) row.dataset.diagCorrect = "1";
      if (isYours) row.dataset.diagYours = "1";
      if (isYours) {
        const mark = document.createElement("span");
        mark.className = "diag-nav-mark-yours";
        mark.hidden = true;
        row.append(mark);
      }
      if (isCorrect) {
        const mark = document.createElement("span");
        mark.className = "diag-nav-mark-correct";
        mark.hidden = true;
        mark.textContent = " ✓";
        row.append(mark);
      }
      dd.append(row);
    }
    result.dl.append(dt, dd);
    // Choices arrive after the reveal buttons exist; sync them to any
    // reveal state the tutor already toggled.
    result.card._diagNavRender?.();
  }

  // Tutoring review mode: the results page spoils every question (Incorrect
  // badge, "Your answer", "Correct answer") before the student can re-attempt
  // it. Hide all of that up front and add two per-question toggle buttons that
  // reveal the student's answer and the correct answer on demand. The
  // Correct/Incorrect badge only comes back once both are revealed, since
  // either one alone would give away whether the student was right.
  function setupReviewMode(card) {
    if (card.querySelector(".diag-nav-review-controls")) return;
    const dl = card.querySelector("dl");
    if (!dl) return;
    const badge = card.querySelector("header .badge");
    if (badge) badge.hidden = true;

    // dt/dd rows to hide, grouped by which button reveals them. "Time spent"
    // rides with the student's answer — a 5-second answer hints at a guess.
    const groups = { yours: [], correct: [] };
    for (const dt of dl.querySelectorAll("dt")) {
      const label = normalize(dt);
      const group =
        label === "Your answer" || label === "Time spent"
          ? "yours"
          : label === "Correct answer"
            ? "correct"
            : null;
      if (!group) continue;
      groups[group].push(dt);
      const dd = dt.nextElementSibling;
      if (dd && dd.tagName === "DD") groups[group].push(dd);
      for (const el of groups[group]) el.hidden = true;
    }

    // "choices" hides the injected A–D list too, turning the question into a
    // free response for when the choices make it too easy.
    const state = { yours: false, correct: false, choices: true };
    const btn = {};
    for (const name of ["yours", "correct", "choices"]) {
      btn[name] = document.createElement("button");
      btn[name].type = "button";
      btn[name].className = "small-button";
      btn[name].addEventListener("click", () => {
        state[name] = !state[name];
        render();
      });
    }

    function render() {
      for (const name of ["yours", "correct"]) {
        for (const el of groups[name]) el.hidden = !state[name];
        const what = name === "yours" ? "student's answer" : "correct answer";
        btn[name].textContent = (state[name] ? "Hide " : "Show ") + what;
      }
      if (badge) badge.hidden = !(state.yours && state.correct);

      btn.choices.textContent = state.choices ? "Hide choices" : "Show choices";
      const choicesLabel = card.querySelector(".diag-nav-choices-label");
      const choicesList = card.querySelector(".diag-nav-choices");
      if (choicesLabel) choicesLabel.hidden = !state.choices;
      if (choicesList) choicesList.hidden = !state.choices;
      btn.choices.hidden = !choicesList;

      const yoursRow = card.querySelector(".diag-nav-choices [data-diag-yours]");
      const correctRow = card.querySelector(
        ".diag-nav-choices [data-diag-correct]"
      );
      if (correctRow) {
        correctRow.style.color = state.correct ? "#146c43" : "";
        correctRow.querySelector(".diag-nav-mark-correct").hidden =
          !state.correct;
      }
      if (yoursRow) {
        const wrong = yoursRow !== correctRow;
        const mark = yoursRow.querySelector(".diag-nav-mark-yours");
        mark.hidden = !state.yours;
        mark.textContent =
          state.yours && state.correct && wrong
            ? " ✗ (student's answer)"
            : " (student's answer)";
        if (wrong) {
          yoursRow.style.color = !state.yours
            ? ""
            : state.correct
              ? "#b02a37"
              : "#0d6efd";
        } else if (state.yours && !state.correct) {
          yoursRow.style.color = "#0d6efd";
        }
      }
    }

    const controls = document.createElement("div");
    controls.className = "diag-nav-review-controls";
    controls.style.cssText = "display:flex;gap:8px;margin-top:12px;";
    controls.append(btn.yours, btn.correct, btn.choices);
    card.append(controls);
    card._diagNavRender = render;
    render();
  }

  function addLibraryLink(quizId) {
    const header = document.querySelector("header.inline-header");
    if (!header || header.querySelector(".diag-nav-quiz-link")) return;
    const a = document.createElement("a");
    a.className = "small-button primary diag-nav-quiz-link";
    a.href = `/quizzes/${quizId}`;
    a.textContent = "View in Quiz Library";
    header.appendChild(a);
  }

  async function init() {
    if (!onResultsPage()) return;
    const title = normalize(
      document.querySelector("header.inline-header h1.title")
    );
    const results = resultCards();
    // Hide the spoilers on every card immediately, even if the choice lookup
    // below fails — the reveal buttons then fall back to unhiding the page's
    // own "Your answer" / "Correct answer" rows.
    for (const r of results) setupReviewMode(r.card);
    if (!title || !results.length) return;

    for (const quizId of await findQuizIds(title)) {
      const questions = await fetchPreviewQuestions(quizId);
      if (!questions) continue;
      const matches = results.map((r) =>
        questions.find((q) => q.stem === r.stem)
      );
      // Same title, wrong quiz would match no stems; require a majority.
      if (matches.filter(Boolean).length * 2 <= results.length) continue;
      results.forEach((r, i) => matches[i] && injectChoices(r, matches[i]));
      addLibraryLink(quizId);
      return;
    }
  }

  // The dashboard is a Turbo app: in-app navigation swaps the <body> without
  // a real page load, so content scripts don't re-run. turbo:load fires on
  // the document after every Turbo visit (and once on initial load).
  document.addEventListener("turbo:load", init);
  init();
})();
