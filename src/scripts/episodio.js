import {
  requisitarEpisodios,
  objectsToHTMLElements,
} from "./episodioScript.js";

const proximaPag = document.querySelector("#proximo");
const anteriorPag = document.querySelector("#anterior");
const cardWrapper = document.querySelector("#episodes");

let arrayEpisodios = [];
let episodiosAtuais = [];
let episodio = 0;

window.addEventListener("load", async () => {
  arrayEpisodios = await requisitarEpisodios();
  if (arrayEpisodios === undefined) {
    alert("Erro ao carregar episódios!");
    window.location.reload();
  }
  episodio = 0;
  anteriorPag.disabled = true;
  episodiosAtuais = arrayEpisodios.slice(0, 5);
  cardWrapper.replaceChildren(...objectsToHTMLElements(episodiosAtuais));
});

proximaPag.addEventListener("click", (e) => {
  e.preventDefault();
  if (episodio !== 20) {
    episodio += 5;

    episodiosAtuais = arrayEpisodios.slice(episodio, episodio + 5);

    cardWrapper.replaceChildren(...objectsToHTMLElements(episodiosAtuais));
    anteriorPag.disabled = false;

    episodio === 15
      ? (proximaPag.disabled = true)
      : (proximaPag.disabled = false);
  } else {
    proximaPag.disabled = true;
  }
});

anteriorPag.addEventListener("click", (e) => {
  e.preventDefault();
  if (episodio !== 0) {
    episodio -= 5;
    episodiosAtuais = arrayEpisodios.slice(episodio, episodio + 5);
    cardWrapper.replaceChildren(...objectsToHTMLElements(episodiosAtuais));
    proximaPag.disabled = false;

    episodio === 0
      ? (anteriorPag.disabled = true)
      : (anteriorPag.disabled = false);
  } else {
    anteriorPag.disabled = true;
  }
});

