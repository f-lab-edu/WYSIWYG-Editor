const formatButtons = ["bold", "italic", "underline", "overline"];
const otherButtons = ["picture", "code"];
const listButtons = ["ol", "ul"];

class Editor {
  editorFrame: HTMLElement;
  isFocusedTextarea: boolean;
  selection: Selection | null;

  constructor() {
    this.editorFrame = document.getElementById("editor") as HTMLElement;
    this.editorFrame.style.display = "grid";
    this.editorFrame.style.gridTemplateRows = "1fr 15fr";
    this.editorFrame.style.width = "100%";
    this.editorFrame.style.height = "95vh";

    this.isFocusedTextarea = false;
    this.selection = window.getSelection();
  }
  setTextarea() {
    const textWrapper = document.createElement("div");
    const textArea = document.createElement("p");

    textWrapper.style.border = "1px solid black";
    textWrapper.style.borderTop = "none";
    textWrapper.style.outline = "none";
    textWrapper.style.padding = "5px 5px";
    textWrapper.style.height = "100%";

    window.addEventListener("keydown", (keyboardEvent) => {
      if (!this.isFocusedTextarea) return;
      console.log(keyboardEvent.metaKey);

      if (keyboardEvent.metaKey) {
        if (keyboardEvent.key === "a") {
          keyboardEvent.preventDefault();
          if (!this.selection) return;

          const range = document.createRange();

          range.selectNodeContents(textWrapper);
          this.selection.removeAllRanges();
          this.selection.addRange(range);
        }
        return;
      } else if (keyboardEvent.ctrlKey || keyboardEvent.altKey) return;

      if (keyboardEvent.code === "Space") textWrapper.innerText += "\u00A0";
      else if (keyboardEvent.code === "Enter") textWrapper.innerHTML += "<br/>";
      else textWrapper.innerText += keyboardEvent.key;
    });

    this.editorFrame.addEventListener("click", (pointerEvent) => {
      if (!!pointerEvent && pointerEvent.target === textWrapper) {
        console.log("focused textWrapper");
        this.isFocusedTextarea = true;
      } else {
        console.log("out focus textWrapper");
        this.isFocusedTextarea = false;
      }
    });

    textWrapper.appendChild(textArea);
    this.editorFrame.appendChild(textWrapper);
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
