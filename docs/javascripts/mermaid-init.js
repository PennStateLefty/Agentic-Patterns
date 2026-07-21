async function renderMermaidBlocks() {
  if (typeof mermaid === "undefined") {
    return;
  }

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose"
  });

  const blocks = [...document.querySelectorAll("pre.mermaid")];
  let index = 0;

  for (const block of blocks) {
    if (block.dataset.mermaidRendered === "true") {
      continue;
    }

    const source = (block.textContent || "").trim();
    if (!source) {
      continue;
    }

    const target = document.createElement("div");
    target.className = "mermaid";
    const id = `mermaid-${Date.now()}-${index++}`;

    try {
      const { svg } = await mermaid.render(id, source);
      target.innerHTML = svg;
      block.replaceWith(target);
    } catch (error) {
      console.error("Mermaid render failed for one diagram:", error);
    } finally {
      block.dataset.mermaidRendered = "true";
    }
  }
}

const runMermaidRender = () => {
  void renderMermaidBlocks();
};

if (typeof document$ !== "undefined" && typeof document$.subscribe === "function") {
  document$.subscribe(runMermaidRender);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", runMermaidRender, { once: true });
} else {
  runMermaidRender();
}

