// Keyboard navigation for question-detail modals in College Board's
// SAT Suite Educator Question Bank.
// Left/Right arrows activate the modal's own Back/Next buttons.

(() => {
  const isTyping = (target) => {
    const el = target instanceof Element ? target : document.activeElement;
    return Boolean(
      el &&
        (el.matches("input, textarea, select") || el.isContentEditable)
    );
  };

  const modalNavigationButton = (label) => {
    const modal = document.querySelector("#question-modal");
    if (!modal) return null;

    return [...modal.querySelectorAll("button")].find(
      (button) =>
        button.textContent.trim() === label &&
        !button.disabled &&
        button.getAttribute("aria-disabled") !== "true"
    );
  };

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

    const label =
      event.key === "ArrowLeft"
        ? "Back"
        : event.key === "ArrowRight"
          ? "Next"
          : null;
    if (!label) return;

    const button = modalNavigationButton(label);
    if (!button) return;

    event.preventDefault();
    button.click();
  });
})();
