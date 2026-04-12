function bindTabs(root: ParentNode): void {
  const tabRoots = root.querySelectorAll<HTMLElement>(".rt-tabs");
  tabRoots.forEach((tabRoot) => {
    if (tabRoot.dataset.rtBound === "true") {
      return;
    }

    tabRoot.dataset.rtBound = "true";
    tabRoot.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest<HTMLButtonElement>(".rt-tabs__button");
      if (!button) {
        return;
      }

      const index = Number(button.dataset.rtTabIndex);
      if (!Number.isInteger(index)) {
        return;
      }

      const buttons = Array.from(tabRoot.querySelectorAll<HTMLButtonElement>(".rt-tabs__button"));
      const panels = Array.from(tabRoot.querySelectorAll<HTMLElement>(".rt-tabs__panel"));

      buttons.forEach((btn, btnIndex) => {
        btn.classList.toggle("rt-tabs__button--active", btnIndex === index);
      });

      panels.forEach((panel, panelIndex) => {
        const isActive = panelIndex === index;
        panel.classList.toggle("rt-tabs__panel--active", isActive);
      });
    });
  });
}

function bindAccordion(root: ParentNode): void {
  const accordionRoots = root.querySelectorAll<HTMLElement>(".rt-accordion");
  accordionRoots.forEach((accordionRoot) => {
    if (accordionRoot.dataset.rtBound === "true") {
      return;
    }

    accordionRoot.dataset.rtBound = "true";
    accordionRoot.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null;
      const trigger = target?.closest<HTMLButtonElement>(".rt-accordion__trigger");
      if (!trigger) {
        return;
      }

      const panelId = trigger.dataset.rtAccordionTarget;
      if (!panelId) {
        return;
      }

      const allowMultiple = accordionRoot.dataset.rtAccordionMulti === "true";
      const panel = accordionRoot.querySelector<HTMLElement>(`#${panelId}`);
      if (!panel) {
        return;
      }

      const nextExpanded = panel.hasAttribute("hidden");

      if (!allowMultiple) {
        const allTriggers = accordionRoot.querySelectorAll<HTMLButtonElement>(".rt-accordion__trigger");
        const allPanels = accordionRoot.querySelectorAll<HTMLElement>(".rt-accordion__panel");
        allTriggers.forEach((button) => button.setAttribute("aria-expanded", "false"));
        allPanels.forEach((currentPanel) => currentPanel.setAttribute("hidden", ""));
      }

      trigger.setAttribute("aria-expanded", String(nextExpanded));
      if (nextExpanded) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "");
      }
    });
  });
}

function bindClickReveal(root: ParentNode): void {
  const cardRoots = root.querySelectorAll<HTMLElement>(".rt-click-reveal");
  cardRoots.forEach((cardRoot) => {
    if (cardRoot.dataset.rtBound === "true") {
      return;
    }

    cardRoot.dataset.rtBound = "true";
    cardRoot.addEventListener("click", (event) => {
      const target = event.target as HTMLElement | null;
      const trigger = target?.closest<HTMLButtonElement>(".rt-click-reveal__trigger");
      if (!trigger) {
        return;
      }

      const panelId = trigger.dataset.rtRevealTarget;
      if (!panelId) {
        return;
      }

      const panel = cardRoot.querySelector<HTMLElement>(`#${panelId}`);
      if (!panel) {
        return;
      }

      const nowRevealed = panel.hasAttribute("hidden");
      trigger.setAttribute("aria-expanded", String(nowRevealed));
      if (nowRevealed) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "");
      }
    });
  });
}

export function bindRuntimeInteractions(root: ParentNode): void {
  bindTabs(root);
  bindAccordion(root);
  bindClickReveal(root);
}
