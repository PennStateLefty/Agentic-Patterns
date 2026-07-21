async function renderMermaidBlocks() {
  if (typeof mermaid === "undefined") {
    return;
  }

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose"
  });

  const blocks = document.querySelectorAll("pre.mermaid-source");
  let index = 0;

  for (const block of blocks) {
    if (block.dataset.mermaidRendered === "true") {
      continue;
    }

    const code = block.querySelector("code");
    const source = (code ? code.textContent : block.textContent || "").trim();
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

document$.subscribe(() => {
  renderMermaidBlocks();
});
