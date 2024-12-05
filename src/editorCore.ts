const formatButtons = ["bold", "italic", "underline", "overline"];
const otherButtons = ["picture", "code"];
const listButtons = ["ol", "ul"];

class Editor {
  editorFrame: HTMLElement;
  isFocusedTextarea = false;
  constructor() {
    this.editorFrame = document.getElementById("editor") as HTMLElement;
    this.editorFrame.style.display = "grid";
    this.editorFrame.style.gridTemplateRows = "1fr 15fr";
    this.editorFrame.style.width = "100%";
    this.editorFrame.style.height = "95vh";

    this.isFocusedTextarea = false;
  }
  setTextarea() {
    const textDiv = document.createElement("div");

    textDiv.style.border = "1px solid black";
    textDiv.style.borderTop = "none";
    textDiv.style.outline = "none";
    textDiv.style.padding = "5px 5px";
    textDiv.style.height = "100%";

    this.editorFrame.addEventListener("click", (pointerEvent) => {
      if (!!pointerEvent && pointerEvent.target === textDiv) {
        console.log("focused textDiv");
        this.isFocusedTextarea = true;
      } else {
        console.log("out focus textDiv");
        this.isFocusedTextarea = false;
      }
    });

    this.editorFrame.appendChild(textDiv);
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
