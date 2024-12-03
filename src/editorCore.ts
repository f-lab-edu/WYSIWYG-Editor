const formatButtons = ["bold", "italic", "underline", "overline"];
const otherButtons = ["picture", "code"];
const listButtons = ["ol", "ul"];

class Editor {
  editorFrame: HTMLElement;
  constructor() {
    this.editorFrame = document.getElementById("editor");
    this.editorFrame.style.display = "grid";
  }
  setTextarea() {
    const textarea = document.createElement("textarea");

    textarea.style.border = "1px solid black";
    textarea.style.borderTop = "none";
    textarea.style.outline = "none";
    textarea.style.padding = "5px 5px";

    this.editorFrame.appendChild(textarea);
  }

  setEditorArea() {
    const editorArea = document.createElement("div");

    editorArea.style.border = "1px solid black";
    editorArea.style.display = "grid";
    editorArea.style.gridTemplateColumns = `2fr 1fr 1fr`;
    editorArea.style.gap = "10px";

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
    buttonWrapper.style.gap = "10px";
    buttonWrapper.style.borderLeft = "0.5px solid gray";
    buttonWrapper.style.borderRight = "0.5px solid gray";

    buttonNames.forEach((buttonName) => {
      const button = document.createElement("button");
      const icon = document.createElement("img");

      icon.src = `/icons/${buttonName}-button.png`;
      icon.style.width = "30px";

      button.style.background = "none";
      button.style.border = "none";
      button.style.display = "grid";
      button.style.margin = "auto";

      button.appendChild(icon);
      buttonWrapper.appendChild(button);
    });
    return buttonWrapper;
  }
}
const editor = new Editor();
editor.setEditorArea();
editor.setTextarea();
