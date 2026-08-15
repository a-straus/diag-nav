// Keyboard navigation for Private Prep diagnostic review pages.
// Left/Right arrows: prev/next question. Digits + Enter: jump to question number.
// On score report pages (/scores/<uuid>): adds a deep link next to each question
// number in the answer sheet that opens that question in the review flow.

(() => {
  if (location.pathname.startsWith("/scores/")) {
    initScoreReportLinks();
    return;
  }
  let buffer = "";
  let bufferTimer = null;
  let toast = null;

  const isTyping = () => {
    const el = document.activeElement;
    return el && (el.tagName === "INPUT" && el.type === "text" ||
                  el.tagName === "TEXTAREA" || el.isContentEditable);
  };

  const findByText = (text) =>
    [...document.querySelectorAll("a.nav-modal-button")].find(
      (a) => a.textContent.trim() === text
    );

  const questionLinks = () => {
    // Bottom pager: anchors whose text is a plain number
    const map = {};
    for (const a of document.querySelectorAll("a[href*='/questions/']")) {
      const t = a.textContent.trim();
      if (/^\d+$/.test(t)) map[t] = a;
    }
    return map;
  };

  const showToast = (msg) => {
    if (!toast) {
      toast = document.createElement("div");
      Object.assign(toast.style, {
        position: "fixed", bottom: "70px", right: "20px",
        background: "rgba(0,0,0,0.8)", color: "#fff",
        padding: "8px 14px", borderRadius: "6px",
        font: "14px sans-serif", zIndex: 99999,
        pointerEvents: "none", transition: "opacity .2s",
      });
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = "1";
    clearTimeout(toast._hide);
    toast._hide = setTimeout(() => (toast.style.opacity = "0"), 1500);
  };

  const clearBuffer = () => {
    buffer = "";
    clearTimeout(bufferTimer);
  };

  document.addEventListener("keydown", (e) => {
    if (isTyping() || e.metaKey || e.ctrlKey || e.altKey) return;

    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      const link = findByText(e.key === "ArrowLeft" ? "Prev" : "Next");
      if (link) {
        e.preventDefault();
        link.click();
      }
      return;
    }

    if (/^\d$/.test(e.key)) {
      e.preventDefault();
      buffer += e.key;
      showToast("Go to question: " + buffer);
      clearTimeout(bufferTimer);
      bufferTimer = setTimeout(clearBuffer, 3000);
      return;
    }

    if (e.key === "Enter" && buffer) {
      e.preventDefault();
      const n = String(parseInt(buffer, 10));
      const link = questionLinks()[n];
      if (link) {
        showToast("→ question " + n);
        link.click();
      } else {
        // Not in the visible pager window: the Nav modal lists every
        // question with a real link, so open it and click there.
        const navBtn = document.querySelector("button.nav-modal-button");
        if (navBtn) {
          navBtn.click();
          setTimeout(() => {
            const modalLink = questionLinks()[n];
            if (modalLink) {
              showToast("→ question " + n);
              modalLink.click();
            } else {
              showToast("Can't find question " + n);
              navBtn.click(); // close the modal again
            }
          }, 300);
        } else {
          showToast("Can't find question " + n);
        }
      }
      clearBuffer();
      return;
    }

    if (e.key === "Escape" && buffer) {
      clearBuffer();
      showToast("Cancelled");
    }
  });

  // ---- Score report deep links ----
  // The review app embeds its state as JSON in #app[data-initial-state]:
  // /review/<uuid>/begin lists every section (id + key matching the score
  // page's section element ids; adaptive module 2 appears as -lower/-higher
  // variants with sectionCompleted marking the one taken), and each section's
  // /instructions page carries sectionQuestionIds in question-position order.

  async function fetchReviewState(path) {
    try {
      const res = await fetch(path, { credentials: "same-origin" });
      if (!res.ok) return null;
      const doc = new DOMParser().parseFromString(await res.text(), "text/html");
      const app = doc.getElementById("app");
      const json = app && app.getAttribute("data-initial-state");
      return json ? JSON.parse(json) : null;
    } catch {
      return null;
    }
  }

  function addLinks(moduleEl, uuid, sectionId, questionIds) {
    for (const cell of moduleEl.querySelectorAll(
      ".AnswerSheetDetails__table__body .row__question"
    )) {
      if (cell.querySelector(".diag-nav-review-link")) continue;
      const n = parseInt(cell.textContent, 10);
      if (!n || !questionIds[n - 1]) continue;
      const a = document.createElement("a");
      a.className = "diag-nav-review-link";
      a.href = `/review/${uuid}/sections/${sectionId}/questions/${questionIds[n - 1]}`;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = "↗";
      a.title = `Review question ${n}`;
      Object.assign(a.style, { marginLeft: "6px", textDecoration: "none" });
      cell.appendChild(a);
    }
  }

  async function initScoreReportLinks() {
    const uuid = location.pathname.split("/")[2];
    if (!uuid) return;
    const begin = await fetchReviewState(`/review/${uuid}/begin`);
    const sections = (begin && begin.test && begin.test.sections) || [];
    for (const moduleEl of document.querySelectorAll("section.SectionScore[id]")) {
      const key = moduleEl.id;
      const sec =
        sections.find((s) => s.key === key) ||
        sections.find((s) => s.key.startsWith(key + "-") && s.sectionCompleted);
      if (!sec) continue;
      const state = await fetchReviewState(
        `/review/${uuid}/sections/${sec.id}/instructions`
      );
      const questionIds = state && state.sectionQuestionIds;
      if (!questionIds || !questionIds.length) continue;
      addLinks(moduleEl, uuid, sec.id, questionIds);
      // The answer sheet re-renders when its filters change; re-add as needed.
      new MutationObserver(() =>
        addLinks(moduleEl, uuid, sec.id, questionIds)
      ).observe(moduleEl, { childList: true, subtree: true });
    }
  }
})();
