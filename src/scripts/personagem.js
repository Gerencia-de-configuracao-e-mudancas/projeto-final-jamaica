import { fetchPersonagem, createPersonagemObjects, objectsIntoHTML } from './personagemScript.js';

const butao = document.querySelector("#btnProcurar");
const input = document.querySelector("#inputPersonagem");
const personagensDiv = document.querySelector(".personagensDiv");

window.addEventListener("load", async () => {
  butao.disabled = true;
  input.value = "";

  const initialCharacters = await fetchPersonagem("Rick");
  const arrayObjs = createPersonagemObjects(initialCharacters);
  const htmlElement = objectsIntoHTML(arrayObjs);
  personagensDiv.innerHTML = htmlElement;

});

input.addEventListener("change", () => {
  if (input.value == "") {
    butao.disabled = true;
  } else {
    butao.disabled = false;
  }
});

butao.addEventListener("click", async (e) => {
  e.preventDefault();

  const info = await fetchPersonagem(input.value);
  if (info == undefined) {
    alert("Personagem não encontrado!");
    return;
  }

  const arrayObjs = createPersonagemObjects(info);
  const htmlElement = objectsIntoHTML(arrayObjs);

  personagensDiv.innerHTML = htmlElement;

  input.value = "";
  e.disabled = true;
});
