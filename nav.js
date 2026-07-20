// Keyboard navigation for Private Prep diagnostic review pages.
// Left/Right arrows: prev/next question. Digits + Enter: jump to question number.

(() => {
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
})();
