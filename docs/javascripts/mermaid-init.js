async function renderMermaidBlocks() {
  if (typeof mermaid === "undefined") {
    return;
  }

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose"
  });

  const blocks = [...document.querySelectorAll("pre > code")];
  let index = 0;
  const mermaidPrefix =
    /^(flowchart|graph|sequenceDiagram|classDiagram|stateDiagram(?:-v2)?|erDiagram|journey|gantt|pie|mindmap|timeline|gitGraph|quadrantChart|xychart-beta|sankey-beta|requirementDiagram|block-beta)\b/;

  for (const code of blocks) {
    const block = code.parentElement;
    if (!block || block.dataset.mermaidRendered === "true") {
      continue;
    }

    const source = (code.textContent || "").trim();
    if (!source) {
      continue;
    }
    if (!mermaidPrefix.test(source)) {
      continue;
    }

    const wrapper =
      block.parentElement && block.parentElement.classList.contains("highlight")
        ? block.parentElement
        : block;

    const target = document.createElement("div");
    target.className = "mermaid";
    const id = `mermaid-${Date.now()}-${index++}`;

    try {
      const { svg } = await mermaid.render(id, source);
      target.innerHTML = svg;
      wrapper.replaceWith(target);
    } catch (error) {
      console.error("Mermaid render failed for one diagram:", error);
    } finally {
      wrapper.dataset.mermaidRendered = "true";
    }
  }
}

const runMermaidRender = () => {
  void renderMermaidBlocks();
};

if (typeof document$ !== "undefined" && typeof document$.subscribe === "function") {
  document$.subscribe(runMermaidRender);
}

runMermaidRender();
