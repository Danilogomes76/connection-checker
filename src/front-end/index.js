const { ipcRenderer } = require("electron");

const form = document.querySelector("form");
const buttonUpdate = document.querySelector("#buttonUpdate");
const buttonSecondPlan = document.querySelector("#secondPlan");
const modal = document.querySelector("#modal");
const tbody = document.querySelector("#tbody");
const table = document.querySelector("#table");
const lastUpdate = document.querySelector("#lastUpdate");
const imgBox = document.querySelector("#imgBox");

//adiciona o evento que ao enviar(submit) ele rode a função de seta, que previne o comportamento padrão do form, que é recarregar a página
form.addEventListener("submit", (e) => {
  e.preventDefault();
});

ipcRenderer.send("checkNetworks");
//faz com que o modal apareça removendo a class hidden dele e colocando a flex, tmb adiciona animação.
buttonUpdate.addEventListener("click", () => {
  buttonUpdate.classList.add("disabled:opacity-75");
  modal.classList.remove("hidden");
  modal.classList.add("flex");
  imgBox.children[0].classList.add("animate-spin");
  imgBox.children[1].innerHTML = "Loading...";

  //ENVIA(send) uma mensagem para o back-end, com uma mensagem.
  ipcRenderer.send("checkNetworks");
});

buttonSecondPlan.addEventListener("click", () => {
  ipcRenderer.send("hideProgram");
});

//RECEBE(on) uma mensagem do back-end, ao receber a mensagem ele capta a resposta que o back-end enviou.
ipcRenderer.on("networks", (e, response) => {
  //Se houver resposta.
  if (response) {
    //esconde o modal e mostra a tabela montada.
    buttonUpdate.classList.remove("disabled:opacity-75");
    modal.classList.add("hidden");
    imgBox.classList.add("hidden");
    table.classList.remove("hidden");

    //neste caso a response é um array de objetos, ele percorre este array(map), e para cada item ele pega a chave(nome) e valor do objeto
    response.map((i) => {
      const key = Object.keys(i)[0];
      const value = Object.values(i)[0];

      if (tbody.children.length > response.length) {
        while (tbody.firstChild) {
          tbody.removeChild(tbody.firstChild);
        }
        createTableRow(key, value);
      }
      createTableRow(key, value);
    });
  }
});

function createTableRow(key, value) {
  const dataAtual = new Date().toLocaleDateString("pt-BR");
  const horaAtual = new Date().toLocaleTimeString("pt-BR");

  const trElement = document.createElement("tr");
  trElement.classList.add(
    "bg-white",
    "dark:bg-gray-800",
    "hover:bg-gray-50",
    "dark:hover:bg-gray-600"
  );

  const thElement = document.createElement("th");
  thElement.setAttribute("scope", "row");
  thElement.classList.add(
    "flex",
    "items-center",
    "px-6",
    "py-4",
    "font-medium",
    "text-gray-900",
    "whitespace-nowrap",
    "dark:text-white"
  );

  const imgElement = document.createElement("img");
  imgElement.classList.add("w-8", "h-8");
  imgElement.setAttribute("src", "../dist/assets/globo-terrestre.png");
  imgElement.setAttribute("alt", "Globo Image");
  thElement.appendChild(imgElement);

  const divElement1 = document.createElement("div");
  divElement1.classList.add("pl-3");

  const divElement2 = document.createElement("div");
  divElement2.classList.add("text-base", "font-semibold", "cursor-default");
  divElement2.textContent = key;

  divElement1.appendChild(divElement2);
  thElement.appendChild(divElement1);

  const tdElement = document.createElement("td");
  tdElement.classList.add("px-6", "py-4");

  const divElement3 = document.createElement("div");
  divElement3.classList.add("flex", "items-center", "cursor-default");

  const divElement4 = document.createElement("div");
  divElement4.classList.add(
    "h-2.5",
    "w-2.5",
    "rounded-full",
    `bg-${value == "Online" ? "green" : "red"}-500`,
    "mr-2"
  );

  divElement3.appendChild(divElement4);
  divElement3.appendChild(document.createTextNode(value));

  tdElement.appendChild(divElement3);

  trElement.appendChild(thElement);
  trElement.appendChild(tdElement);

  lastUpdate.innerHTML = `Ultima Atualização: ${horaAtual} - ${dataAtual}`;

  tbody.appendChild(trElement);
}

setInterval(() => {
  ipcRenderer.send("checkNetworks");
}, 1800000); // 30 minutos
