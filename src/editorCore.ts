type buttonFormat =
  | "bold"
  | "italic"
  | "underline"
  | "line-through"
  | "picture"
  | "code"
  | "ol"
  | "ul";

const BUTTON_FORMAT = {
  bold: "bold",
  italic: "italic",
  underline: "underline",
  lineThrough: "line-through",
  picture: "picture",
  code: "code",
  ol: "ol",
  ul: "ul",
};

const EDITOR_FRAME_STYLE = `
#editor {
  display: grid;
  grid-template-rows: 1fr 15fr;
  width: 100%;
  height: 95vh;
}
`;
const EDITOR_STYLE = `
  #editorArea {
    border: 1px solid black;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr
  }
`;
const TEXT_WRAPPER_STYLE = `
#textWrapper {
  border: 1px solid black;
  border-top: none;
  outline: none;
  padding: 5px 5px;
  height: 100%;
}
`;
const BUTTON_WRAPPER_STYLE = `
#buttonWrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(5px, 1fr));
}
`;
// background: #808C99;
const BUTTON_STYLE = `
  .button {
    background: none;
    border: none;
    display: grid;
    margin: 5px 10px;
    border-radius: 15%;
    }
    .button:active {
      background: #495057;
    }
`;
const WEBCODE_STYLE = `
  .code {
    width: calc(100% - 12px);
    height: auto;
    border: 1px solid gray;
    padding: 5px;
    margin: 3px auto;
    text-align: left;
    background: lightgray;
  }
`;

const formatButtons: buttonFormat[] = [
  "bold",
  "italic",
  "underline",
  "line-through",
];
const otherButtons: buttonFormat[] = ["picture", "code"];
const listButtons: buttonFormat[] = ["ol", "ul"];

class Editor {
  editorFrame: HTMLElement;
  isFocusedTextarea: boolean;
  selection: Selection | null;
  textWrapper: HTMLElement;

  constructor() {
    this.editorFrame = document.getElementById("editor") as HTMLElement;
    this.textWrapper = document.getElementById("textWrapper") as HTMLElement;

    this.isFocusedTextarea = false;
    this.selection = null;

    const style = document.createElement("style");
    style.innerHTML =
      EDITOR_STYLE +
      EDITOR_FRAME_STYLE +
      BUTTON_STYLE +
      BUTTON_WRAPPER_STYLE +
      TEXT_WRAPPER_STYLE +
      WEBCODE_STYLE;
    document.head.append(style);

    document.addEventListener("selectionchange", () => {
      const selction = window.getSelection();

      if (!selction) {
        this.selection = null;
        return;
      }

      this.selection = selction;
    });
  }

  setTextarea() {
    this.textWrapper = document.createElement("div");
    this.textWrapper.id = "textWrapper";

    window.addEventListener("keydown", (keyboardEvent) => {
      if (!this.isFocusedTextarea) return;

      if (
        keyboardEvent.metaKey ||
        keyboardEvent.ctrlKey ||
        keyboardEvent.altKey
      )
        return;

      if (keyboardEvent.code === "Space")
        this.textWrapper.innerText += "\u00A0";
      else if (keyboardEvent.code === "Enter")
        this.textWrapper.innerHTML += "<br/>";
      else this.textWrapper.innerHTML += keyboardEvent.key;
    });

    this.editorFrame.addEventListener("click", (pointerEvent) => {
      if (!!pointerEvent && pointerEvent.target === this.textWrapper)
        this.isFocusedTextarea = true;
      else this.isFocusedTextarea = false;
    });

    this.editorFrame.appendChild(this.textWrapper);
  }

  setEditorArea() {
    const editorArea = document.createElement("div");
    editorArea.id = "editorArea";

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
  createFileInputTag(buttonName: string) {
    const inputWrapper = document.createElement("div");
    const input = document.createElement("input");
    const label = document.createElement("label");
    const icon = document.createElement("img");

    inputWrapper.className = "button";

    input.style.display = "none";
    input.type = "file";
    input.id = "picture";

    label.htmlFor = "picture";
    label.style.margin = "auto";
    label.style.width = "30px";
    label.style.height = "30px";
    label.style.aspectRatio = "1/1";

    this.setButtonImageStyle(icon, buttonName);

    label.append(icon);

    inputWrapper.append(label);
    inputWrapper.append(input);

    return inputWrapper;
  }
  setButtonImageStyle(targetElement: HTMLImageElement, iconName: string) {
    targetElement.src = `/icons/${iconName}-button.png`;
    targetElement.style.width = "30px";
    targetElement.style.aspectRatio = "1/1";
    targetElement.style.margin = "auto";
    targetElement.style.zIndex = "10";
  }
  appendDepth3ElementWrapper(
    wrapperChild: HTMLElement,
    buttonChild: HTMLElement,
    imageElement: HTMLElement
  ) {
    buttonChild.appendChild(imageElement);
    wrapperChild.appendChild(buttonChild);
  }
  getEditorButtonWrapperElementByNames(
    buttonNames: buttonFormat[]
  ): HTMLElement {
    const buttonWrapper = document.createElement("article");

    buttonWrapper.id = "buttonWrapper";

    buttonNames.forEach((buttonName: buttonFormat) => {
      const isPictureButton = buttonName === "picture";
      const button = isPictureButton
        ? this.createFileInputTag(buttonName)
        : document.createElement("button");
      const icon = document.createElement("img");

      button.className = "button";
      if (!isPictureButton) this.setButtonImageStyle(icon, buttonName);
      else
        button.addEventListener("change", (e: Event) => {
          if (!e || !e.target) return;
          const eventTarget = e.target as HTMLInputElement;
          if (!eventTarget.files) return;

          const file = eventTarget.files[0];
          const reader = new FileReader();

          reader.readAsDataURL(file);
          reader.onload = () => {
            const imageUrl: string = reader.result as string;
            const image = document.createElement("img");

            image.src = imageUrl;

            this.textWrapper!.appendChild(image);
            this.textWrapper!.innerHTML += "<br>";
          };
        });

      this.appendDepth3ElementWrapper(buttonWrapper, button, icon);

      button.addEventListener("mouseover", () => {
        button.style.background = "#808C99";
      });
      button.addEventListener("mouseout", () => {
        button.style.background = "transparent";
      });
      button.addEventListener("click", () => {
        // this.handleClickButtonStyle(button);

        if (!this.selection) return;

        if (this.selection.rangeCount > 0) {
          const range = this.selection.getRangeAt(0);
          const selectedText = this.selection.toString();

          const parentNode = range.commonAncestorContainer;

          let parentElement = (
            parentNode.nodeType === Node.TEXT_NODE
              ? parentNode.parentNode
              : parentNode
          ) as HTMLElement;

          if (selectedText.trim() !== "") {
            let updatedTag = null;

            // text styling
            if (formatButtons.includes(buttonName))
              updatedTag = this.createTextTag(
                buttonName,
                parentElement,
                selectedText
              );
            // list styling
            else if (listButtons.includes(buttonName)) {
              const parentClassName = parentElement.className as buttonFormat;

              updatedTag = listButtons.includes(parentClassName)
                ? null
                : this.createListTag(buttonName as "ol" | "ul", selectedText);
            }
            // web code button
            else if (buttonName === "code")
              updatedTag = this.createCodeTag(selectedText);
            // picture button
            else if (buttonName === "picture") {
            }

            range.deleteContents();
            if (updatedTag) {
              range.insertNode(updatedTag);
            } else {
              if (listButtons.includes(buttonName)) {
                const listEls = Array.from(
                  document.getElementsByTagName(buttonName)
                );

                let removeElementId = null;
                for (let item of listEls) {
                  removeElementId =
                    item.id === parentElement.id ? item.id : removeElementId;
                }

                if (removeElementId) {
                  const removeElement =
                    document.getElementById(removeElementId);
                  if (removeElement) removeElement.remove();
                }
              }

              const textList = selectedText.split("\n");
              let innerText = "";
              for (let textItem of textList) {
                innerText += `${textItem}<br>`;
              }
              this.textWrapper!.innerHTML += innerText;
            }

            this.selection.removeAllRanges();
          }
        }
      });
    });
    return buttonWrapper;
  }
  createTextTag(
    textStyle: buttonFormat,
    parentElement: HTMLElement,
    selectedText: string
  ) {
    const spanTag = document.createElement("span");

    spanTag.className = textStyle as string;
    spanTag.textContent = selectedText;

    this.updateTextStyle(textStyle, parentElement, spanTag);

    return spanTag;
  }
  updateTextStyle(
    textStyle: buttonFormat,
    parentElement: HTMLElement,
    spanTag: HTMLElement
  ) {
    const isOverlapedTextStyle = parentElement.className === textStyle;
    switch (textStyle) {
      case BUTTON_FORMAT.bold:
        spanTag.style.cssText +=
          isOverlapedTextStyle &&
          parentElement.style.fontWeight === BUTTON_FORMAT.bold
            ? "font-weight: normal"
            : `font-weight: ${BUTTON_FORMAT.bold}`;
        break;
      case BUTTON_FORMAT.italic:
        spanTag.style.cssText +=
          isOverlapedTextStyle &&
          parentElement.style.fontStyle === BUTTON_FORMAT.italic
            ? "font-style: normal"
            : `font-style: ${BUTTON_FORMAT.italic}`;
        break;
      case BUTTON_FORMAT.underline:
        spanTag.style.cssText +=
          isOverlapedTextStyle &&
          parentElement.style.textDecoration === "underline"
            ? "text-decoration: none"
            : `text-decoration: ${BUTTON_FORMAT.underline}`;
        break;
      case BUTTON_FORMAT.lineThrough:
        spanTag.style.cssText += isOverlapedTextStyle;
        parentElement.style.textDecoration === "line-through"
          ? "text-decoration: none"
          : `text-decoration: ${BUTTON_FORMAT.lineThrough}`;
        break;
    }
  }
  createListTag(listType: buttonFormat, selectedText: string) {
    const listTag = document.createElement(listType);
    listTag.id = Date.now().toString();
    listTag.className = listType;

    const textList = selectedText.split("\n");

    for (let textItem of textList) {
      const li = document.createElement("li");
      li.className = Date.now().toString();
      li.innerText = textItem;
      listTag.appendChild(li);
    }

    return listTag;
  }
  createCodeTag(selectedText: string) {
    const codeArea = document.createElement("article");
    codeArea.style.cssText = WEBCODE_STYLE;

    codeArea.innerText = selectedText;

    return codeArea;
  }
  createPicture(selectedText: string) {
    const pictureTag = document.createElement("picture");
  }
  // handleClickButtonStyle(button: HTMLElement) {
  //   button.style.background = "#495057";

  //   setTimeout(() => {
  //     button.style.background = "#808C99";
  //   }, 150);
  // }
}

const editor = new Editor();
editor.setEditorArea();
editor.setTextarea();
