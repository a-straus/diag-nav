// Keyboard navigation for question-detail modals in College Board's
// SAT Suite Educator Question Bank.
// Left/Right arrows activate the modal's own Back/Next buttons.
// Space activates the modal's Add to PDF / Remove from PDF button.

(() => {
  const isTyping = (target) => {
    const el = target instanceof Element ? target : document.activeElement;
    return Boolean(
      el &&
        (el.matches("input, textarea, select") || el.isContentEditable)
    );
  };

  const enabledModalButton = (predicate) => {
    const modal = document.querySelector("#question-modal");
    if (!modal) return null;

    return [...modal.querySelectorAll("button")].find(
      (button) =>
        predicate(button) &&
        !button.disabled &&
        button.getAttribute("aria-disabled") !== "true"
    );
  };

  const modalNavigationButton = (label) =>
    enabledModalButton((button) => button.textContent.trim() === label);

  const modalPdfButton = () =>
    enabledModalButton((button) => button.classList.contains("pdf-btn"));

  document.addEventListener("keydown", (event) => {
    if (
      event.defaultPrevented ||
      isTyping(event.target) ||
      event.metaKey ||
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey
    ) {
      return;
    }

    let button = null;
    if (event.key === "ArrowLeft") {
      button = modalNavigationButton("Back");
    } else if (event.key === "ArrowRight") {
      button = modalNavigationButton("Next");
    } else if (event.key === " " || event.code === "Space") {
      button = modalPdfButton();
    } else {
      return;
    }

    if (!button) return;

    event.preventDefault();
    button.click();
  });
})();
