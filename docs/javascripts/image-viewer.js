function ensureImageViewerDialog() {
  let dialog = document.querySelector("[data-image-viewer-dialog]");
  if (dialog) {
    return dialog;
  }

  dialog = document.createElement("dialog");
  dialog.className = "image-viewer";
  dialog.dataset.imageViewerDialog = "true";
  dialog.innerHTML = `
    <button class="image-viewer__close" type="button" aria-label="Close enlarged diagram">&times;</button>
    <figure class="image-viewer__figure">
      <div class="image-viewer__content"></div>
      <figcaption class="image-viewer__caption"></figcaption>
    </figure>
  `;

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  dialog.querySelector(".image-viewer__close").addEventListener("click", () => {
    dialog.close();
  });

  document.body.appendChild(dialog);
  return dialog;
}

function openImageViewer(sourceElement) {
  const dialog = ensureImageViewerDialog();
  const content = dialog.querySelector(".image-viewer__content");
  const caption = dialog.querySelector(".image-viewer__caption");

  content.replaceChildren();

  if (sourceElement.tagName.toLowerCase() === "img") {
    const image = document.createElement("img");
    image.src = sourceElement.currentSrc || sourceElement.src;
    image.alt = sourceElement.alt || "Enlarged diagram";
    content.appendChild(image);
    caption.textContent = sourceElement.alt || "";
  } else {
    const clone = sourceElement.cloneNode(true);
    clone.removeAttribute("width");
    clone.removeAttribute("height");
    clone.setAttribute("aria-label", sourceElement.getAttribute("aria-label") || "Enlarged diagram");
    content.appendChild(clone);
    caption.textContent = sourceElement.closest(".mermaid")?.getAttribute("aria-label") || "";
  }

  if (!dialog.open) {
    dialog.showModal();
  }
}

function decorateZoomableSvg(svgElement) {
  if (svgElement.dataset.imageViewerReady === "true") {
    return;
  }

  svgElement.dataset.imageViewerReady = "true";
  svgElement.classList.add("js-image-viewer-target");
  svgElement.setAttribute("tabindex", "0");
  svgElement.setAttribute("role", "button");
  svgElement.setAttribute("title", "Click to enlarge");
  svgElement.setAttribute("aria-label", svgElement.getAttribute("aria-label") || "Enlarge diagram");

  svgElement.addEventListener("click", () => openImageViewer(svgElement));
  svgElement.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openImageViewer(svgElement);
    }
  });
}

function decorateZoomableSvgs() {
  const svgImages = [
    ...document.querySelectorAll(".md-content img[src$='.svg'], .md-content img[src*='.svg?']")
  ];
  const inlineSvgs = [...document.querySelectorAll(".md-content .mermaid svg")];

  [...svgImages, ...inlineSvgs].forEach(decorateZoomableSvg);
}

window.decorateZoomableSvgs = decorateZoomableSvgs;

if (typeof document$ !== "undefined" && typeof document$.subscribe === "function") {
  document$.subscribe(decorateZoomableSvgs);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", decorateZoomableSvgs, { once: true });
} else {
  decorateZoomableSvgs();
}
