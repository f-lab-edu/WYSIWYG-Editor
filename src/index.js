import "./style.css"; // css파일 불러오기

function component() {
  const element = document.createElement("div");

  element.innerHTML = "Hello World";

  return element;
}

document.body.appendChild(component());
