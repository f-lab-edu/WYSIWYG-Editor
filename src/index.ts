const editorFrame = document.getElementById("editor");
editorFrame.style.display = "grid";

function getEditorArea() {
  const element = document.createElement("div");

  element.innerHTML = "EDITOR";
  element.style.border = "1px solid black";

  return element;
}

function getTextarea() {
  const element = document.createElement("textarea");

  element.style.border = "1px solid black";
  element.style.borderTop = "none";
  element.style.outline = "none";
  element.style.padding = "5px 5px";

  return element;
}

editorFrame.appendChild(getEditorArea());
editorFrame.appendChild(getTextarea());
