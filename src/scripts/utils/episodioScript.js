async function requisitarEpisodios() {
  try {
    const response = await fetch(`https://rickandmortyapi.com/api/episode`);
    const data = await response.json();
    return data.results;
  } catch (error) {
    return undefined;
  }
}

function objectsToHTMLElements(array) {
  const epsElements = [];
  array.forEach((episodio) => {
    const card = document.createElement("div");
    card.classList.add("episode-card");
    card.innerHTML = `
      <h2 class="episode-name">${episodio.name}</h2>
      <p class="episode-air-date">Data de Lançamento: <i>${episodio.air_date}</i></p>
      <p class="episode-number">Ordem do episodio: <i>${episodio.episode}</i></p>
    `;
    epsElements.push(card);
  });
  return epsElements;
}

export { requisitarEpisodios, objectsToHTMLElements };
