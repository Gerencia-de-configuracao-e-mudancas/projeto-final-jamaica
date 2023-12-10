import { fetchPersonagem, createPersonagemObjects, objectsIntoHTML } from './utils/personagemScript.js';
import turnLoader from './utils/loaderScript.js';

const butao = document.querySelector("#btnProcurar");
const input = document.querySelector("#inputPersonagem");
const personagensDiv = document.querySelector(".personagensDiv");
const loader = document.querySelector('.loader');

window.addEventListener("load", async () => {
  butao.disabled = true;
  input.value = "";

  turnLoader(loader,personagensDiv,'block');
  const initialCharacters = await fetchPersonagem("Rick");
  if (initialCharacters == undefined) {
    alert("Erro ao carregar personagens!");
    window.location.reload();
  }

  const arrayObjs = createPersonagemObjects(initialCharacters);
  const htmlElement = objectsIntoHTML(arrayObjs);
  personagensDiv.innerHTML = htmlElement;
  turnLoader(personagensDiv,loader,'block');

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

  turnLoader(loader,personagensDiv,'block');
  const info = await fetchPersonagem(input.value);
  if (info == undefined) {
    alert("Personagem não encontrado!");
    turnLoader(personagensDiv,loader,'block');
    return;
  }

  const arrayObjs = createPersonagemObjects(info);
  const htmlElement = objectsIntoHTML(arrayObjs);

  personagensDiv.innerHTML = htmlElement;

  input.value = "";
  e.disabled = true;
  turnLoader(personagensDiv,loader,'block');
});
