import { generateUUID } from "./session";
import type { ComponentContext } from "./types";

export interface DomTrackerOptions {
  onInteraction: (
    component: ComponentContext,
    interactionMetadata: Record<string, unknown>
  ) => void;
  maskPatterns?: RegExp[];
}

export class DomTracker {
  private onInteraction: DomTrackerOptions["onInteraction"];
  private maskPatterns: RegExp[];
  private isListening = false;

  private handleClickBound = this.handleClick.bind(this);
  private handleChangeBound = this.handleChange.bind(this);
  private handleSubmitBound = this.handleSubmit.bind(this);

  constructor(options: DomTrackerOptions) {
    this.onInteraction = options.onInteraction;
    this.maskPatterns = options.maskPatterns ?? [
      /password/i,
      /secret/i,
      /token/i,
      /aadhaar/i,
      /pan/i,
      /ssn/i,
      /credit[-_]?card/i,
      /cvv/i,
    ];
  }

  public start(): void {
    if (typeof document === "undefined" || this.isListening) return;
    document.addEventListener("click", this.handleClickBound, true);
    document.addEventListener("change", this.handleChangeBound, true);
    document.addEventListener("submit", this.handleSubmitBound, true);
    this.isListening = true;
  }

  public stop(): void {
    if (typeof document === "undefined" || !this.isListening) return;
    document.removeEventListener("click", this.handleClickBound, true);
    document.removeEventListener("change", this.handleChangeBound, true);
    document.removeEventListener("submit", this.handleSubmitBound, true);
    this.isListening = false;
  }

  private isSensitiveElement(el: HTMLElement): boolean {
    if (el.hasAttribute("data-track-ignore")) return true;

    if (el instanceof HTMLInputElement) {
      if (el.type === "password" || el.type === "hidden") return true;
      const name = el.name || el.id || "";
      for (const pattern of this.maskPatterns) {
        if (pattern.test(name)) return true;
      }
    }

    return false;
  }

  private findTrackableElement(target: EventTarget | null): HTMLElement | null {
    if (!target || !(target instanceof HTMLElement)) return null;

    // Check if target or any parent is explicitly ignored
    if (target.closest("[data-track-ignore]")) return null;

    // Find closest interactive element
    const trackable = target.closest<HTMLElement>(
      "button, a[href], input, select, textarea, [role='button'], [role='tab'], [role='menuitem'], [data-track-name]"
    );

    if (trackable && this.isSensitiveElement(trackable)) {
      return null;
    }

    return trackable;
  }

  private getElementAccessibleName(el: HTMLElement): string {
    const explicitName = el.getAttribute("data-track-name");
    if (explicitName) return explicitName;

    const ariaLabel = el.getAttribute("aria-label");
    if (ariaLabel) return ariaLabel.trim();

    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      if (el.placeholder) return el.placeholder.trim();
      if (el.name) return el.name;
    }

    const innerText = el.innerText || el.textContent;
    if (innerText && innerText.trim()) {
      return innerText.trim().replace(/\s+/g, " ").slice(0, 80);
    }

    return el.tagName.toLowerCase();
  }

  private collectJourneyMetadata(el: HTMLElement): Record<string, unknown> {
    const metadata: Record<string, unknown> = {};

    // Collect closest track area boundary attributes
    const area = el.closest<HTMLElement>("[data-track-area]");
    if (area) {
      const journey = area.getAttribute("data-track-area-journey");
      const step = area.getAttribute("data-track-area-step");
      const rawMeta = area.getAttribute("data-track-area-metadata");

      if (journey) metadata.journey = journey;
      if (step) metadata.step = step;
      if (rawMeta) {
        try {
          Object.assign(metadata, JSON.parse(rawMeta));
        } catch {
          // Ignore invalid json
        }
      }
    }

    // Collect element's own data-track-metadata
    const elMeta = el.getAttribute("data-track-metadata");
    if (elMeta) {
      try {
        Object.assign(metadata, JSON.parse(elMeta));
      } catch {
        // Ignore invalid json
      }
    }

    return metadata;
  }

  private resolveComponentContext(
    el: HTMLElement,
    interaction: "click" | "change" | "submit"
  ): ComponentContext {
    let componentId = el.getAttribute("data-component-id");
    if (!componentId) {
      componentId = `cmp_${generateUUID().slice(0, 12)}`;
      el.setAttribute("data-component-id", componentId);
    }

    const name = this.getElementAccessibleName(el);
    const type = el.getAttribute("role") || el.tagName.toLowerCase();

    return {
      id: componentId,
      name,
      type,
      interaction,
      interactionCount: 1, // Will be incremented by session manager
    };
  }

  private handleClick(event: MouseEvent): void {
    const el = this.findTrackableElement(event.target);
    if (!el) return;

    const component = this.resolveComponentContext(el, "click");
    const metadata = this.collectJourneyMetadata(el);
    this.onInteraction(component, metadata);
  }

  private handleChange(event: Event): void {
    const el = this.findTrackableElement(event.target);
    if (!el) return;

    const component = this.resolveComponentContext(el, "change");
    const metadata = this.collectJourneyMetadata(el);
    this.onInteraction(component, metadata);
  }

  private handleSubmit(event: SubmitEvent): void {
    const form = event.target instanceof HTMLFormElement ? event.target : null;
    if (!form || form.hasAttribute("data-track-ignore")) return;

    let formId = form.getAttribute("data-component-id");
    if (!formId) {
      formId = `form_${generateUUID().slice(0, 12)}`;
      form.setAttribute("data-component-id", formId);
    }

    const formName =
      form.getAttribute("data-track-name") ||
      form.getAttribute("name") ||
      form.getAttribute("id") ||
      "form";

    const component: ComponentContext = {
      id: formId,
      name: formName,
      type: "form",
      interaction: "submit",
      interactionCount: 1,
    };

    const metadata = this.collectJourneyMetadata(form);
    this.onInteraction(component, metadata);
  }
}
