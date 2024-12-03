function component() {
  const element = document.createElement("div");

  element.innerHTML = "Hello Typescript";

  return element;
}

document.body.appendChild(component());
