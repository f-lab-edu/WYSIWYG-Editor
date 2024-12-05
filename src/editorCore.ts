const formatButtons = ["bold", "italic", "underline", "overline"];
const otherButtons = ["picture", "code"];
const listButtons = ["ol", "ul"];

class Editor {
  editorFrame: HTMLElement;
  constructor() {
    this.editorFrame = document.getElementById("editor");
    this.editorFrame.style.display = "grid";
    this.editorFrame.style.gridTemplateRows = "1fr 15fr";
    this.editorFrame.style.width = "100%";
    this.editorFrame.style.height = "95vh";
  }
  setTextarea() {
    const textarea = document.createElement("textarea");

    textarea.style.border = "1px solid black";
    textarea.style.borderTop = "none";
    textarea.style.outline = "none";
    textarea.style.padding = "5px 5px";
    textarea.style.height = "100%";

    this.editorFrame.appendChild(textarea);
  }

  setEditorArea() {
    const editorArea = document.createElement("div");

    editorArea.style.border = "1px solid black";
    editorArea.style.display = "grid";
    editorArea.style.gridTemplateColumns = `2fr 1fr 1fr`;

    const formatButtonsWrapper =
      this.getEditorButtonWrapperElementByNames(formatButtons);
    const listButtonsWrapper =
      this.getEditorButtonWrapperElementByNames(listButtons);
    const otherButtonsWrapper =
      this.getEditorButtonWrapperElementByNames(otherButtons);

    editorArea.appendChild(formatButtonsWrapper);
    editorArea.appendChild(listButtonsWrapper);
    editorArea.appendChild(otherButtonsWrapper);

    this.editorFrame.appendChild(editorArea);
  }

  getEditorButtonWrapperElementByNames(buttonNames: string[]): HTMLElement {
    const buttonWrapper = document.createElement("article");
    buttonWrapper.style.display = "grid";
    buttonWrapper.style.gridTemplateColumns = `repeat(auto-fit, minmax(5px, 1fr))`;

    buttonNames.forEach((buttonName) => {
      const button = document.createElement("button");
      const icon = document.createElement("img");

      icon.src = `/icons/${buttonName}-button.png`;
      icon.style.width = "30px";
      icon.style.aspectRatio = "1/1";
      icon.style.margin = "auto";

      button.style.background = "none";
      button.style.border = "none";
      button.style.display = "grid";
      button.style.marginRight = "10px";
      button.style.marginLeft = "10px";
      button.style.marginTop = "5px";
      button.style.marginBottom = "5px";
      button.style.borderRadius = "15%";

      button.addEventListener("mouseover", () => {
        button.style.background = "#808C99";
      });
      button.addEventListener("mouseout", () => {
        button.style.background = "transparent";
      });
      button.addEventListener("click", () => {
        button.style.background = "#495057";

        setTimeout(() => {
          button.style.background = "#808C99";
        }, 150);
      });

      button.appendChild(icon);
      buttonWrapper.appendChild(button);
    });
    return buttonWrapper;
  }
}
const editor = new Editor();
editor.setEditorArea();
editor.setTextarea();
