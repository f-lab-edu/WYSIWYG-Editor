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
    this.selection = null;

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
    const textWrapper = document.createElement("div");

    textWrapper.id = "textWrapper";

    textWrapper.style.border = "1px solid black";
    textWrapper.style.borderTop = "none";
    textWrapper.style.outline = "none";
    textWrapper.style.padding = "5px 5px";
    textWrapper.style.height = "100%";

    window.addEventListener("keydown", (keyboardEvent) => {
      if (!this.isFocusedTextarea) return;
      // console.log(keyboardEvent.metaKey);

      // if (keyboardEvent.metaKey) {
      //   if (keyboardEvent.key === "a") {
      //     keyboardEvent.preventDefault();
      //     if (!this.selection) return;

      //     const range = document.createRange();

      //     range.selectNodeContents(textWrapper);
      //     this.selection.removeAllRanges();
      //     this.selection.addRange(range);
      //   }
      //   return;
      // } else if (keyboardEvent.ctrlKey || keyboardEvent.altKey) return;

      if (
        keyboardEvent.metaKey ||
        keyboardEvent.ctrlKey ||
        keyboardEvent.altKey
      )
        return;

      if (keyboardEvent.code === "Space") textWrapper.innerText += "\u00A0";
      else if (keyboardEvent.code === "Enter") textWrapper.innerHTML += "<br/>";
      else textWrapper.innerHTML += keyboardEvent.key;
    });

    this.editorFrame.addEventListener("click", (pointerEvent) => {
      if (!!pointerEvent && pointerEvent.target === textWrapper)
        this.isFocusedTextarea = true;
      else this.isFocusedTextarea = false;
    });

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
  createFileInputTag(buttonName: string) {
    const inputWrapper = document.createElement("div");
    const input = document.createElement("input");
    const label = document.createElement("label");
    const icon = document.createElement("img");

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
  getEditorButtonWrapperElementByNames(buttonNames: string[]): HTMLElement {
    const buttonWrapper = document.createElement("article");
    buttonWrapper.style.display = "grid";
    buttonWrapper.style.gridTemplateColumns = `repeat(auto-fit, minmax(5px, 1fr))`;

    buttonNames.forEach((buttonName) => {
      const isPictureButton = buttonName === "picture";
      const button = isPictureButton
        ? this.createFileInputTag(buttonName)
        : document.createElement("button");
      const icon = document.createElement("img");

      button.style.background = "none";
      button.style.border = "none";
      button.style.display = "grid";
      button.style.marginRight = "10px";
      button.style.marginLeft = "10px";
      button.style.marginTop = "5px";
      button.style.marginBottom = "5px";
      button.style.borderRadius = "15%";

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
            const textWrapper = document.getElementById("textWrapper");
            const image = document.createElement("img");

            image.src = imageUrl;

            textWrapper!.appendChild(image);
            textWrapper!.innerHTML += "<br>";
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
        this.handleClickButtonStyle(button);

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
              const parentClassName = parentElement.className;

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

              const textWrapper = document.getElementById("textWrapper");
              const textList = selectedText.split("\n");
              let innerText = "";
              for (let textItem of textList) {
                innerText += `${textItem}<br>`;
              }
              textWrapper!.innerHTML += innerText;
            }

            this.selection.removeAllRanges();
          }
        }
      });
    });
    return buttonWrapper;
  }
  createTextTag(
    textStyle: string,
    parentElement: HTMLElement,
    selectedText: string
  ) {
    const spanTag = document.createElement("span");

    spanTag.className = textStyle;
    spanTag.textContent = selectedText;

    this.updateTextStyle(textStyle, parentElement, spanTag);

    return spanTag;
  }
  updateTextStyle(
    textStyle: string,
    parentElement: HTMLElement,
    spanTag: HTMLElement
  ) {
    const isOverlapedTextStyle = parentElement.className === textStyle;
    switch (textStyle) {
      case "bold":
        spanTag.style.cssText +=
          isOverlapedTextStyle && parentElement.style.fontWeight === "bold"
            ? "font-weight: normal"
            : "font-weight: bold";
        break;
      case "italic":
        spanTag.style.cssText +=
          isOverlapedTextStyle && parentElement.style.fontStyle === "italic"
            ? "font-style: normal"
            : "font-style: italic";
        break;
      case "underline":
        spanTag.style.cssText +=
          isOverlapedTextStyle &&
          parentElement.style.textDecoration === "underline"
            ? "text-decoration: none"
            : "text-decoration: underline";
        break;
      case "overline":
        spanTag.style.cssText += isOverlapedTextStyle;
        parentElement.style.textDecoration === "line-through"
          ? "text-decoration: none"
          : "text-decoration: line-through";
        break;
    }
  }
  createListTag(listType: "ol" | "ul", selectedText: string) {
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
    codeArea.style.cssText = `
      width: calc(100% - 12px);
      height: auto;
      border: 1px solid gray;
      padding: 5px;
      margin: 3px auto;
      text-align: left;
      background: lightgray;
    `;

    codeArea.innerText = selectedText;

    return codeArea;
  }
  createPicture(selectedText: string) {
    const pictureTag = document.createElement("picture");
  }
  handleClickButtonStyle(button: HTMLElement) {
    button.style.background = "#495057";

    setTimeout(() => {
      button.style.background = "#808C99";
    }, 150);
  }
}
const editor = new Editor();
editor.setEditorArea();
editor.setTextarea();
