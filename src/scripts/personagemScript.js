async function fetchPersonagem(nome) {
  try {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character/?name=${nome}`
    );
    const data = await response.json();
    let results = data.results.slice(0, 10);
    results = results.filter((result) => result !== undefined);
    return data.results;
  } catch (error) {
    return undefined;
  }
}

function createPersonagemObjects(array) {
  const newArray = [];
  array.forEach((element) => {
    const newObj = {
      name: element.name,
      status: element.status,
      specie: element.species,
      genero: element.gender,
      location: element.location.name,
      imgLink: element.image,
    };

    newArray.push(newObj);
  });

  return newArray;
}

function objectsIntoHTML(arrayObjs) {
  const arrayElements = arrayObjs
    .map((element) => {
      let isAliveColor;

      if (element.status == "Alive") {
        isAliveColor = "greenyellow";
      } else if (element.status == "Dead") {
        isAliveColor = "red";
      } else {
        isAliveColor = "gray";
      }
      return `
    <div class="cardWrapper">
    <div class="imgWrapper">
      <img class="imgCharacter" src="${element.imgLink}" />
    </div>
    <div class="textWrapper">
      <span id="name">${element.name}</span>
      <div class="infoWrapper">
        <div class="vivo-morto" style="background-color:${isAliveColor}"></div>
        <span class="isAlive">${element.status}</span>
        <span>-</span>
        <span class="type">${element.specie}</span>
      </div>
      <div class="atributWrapper">
        <span class="tagInfo">Last Known Location:</span>
        <span class="lastKnownLoc">${element.location}</span>
      </div>
      <div>
        <span class="tagInfo">Gender:</span>
        <span class="genero">${element.genero}</span>
      </div>
    </div>
  </div>
    `;
    })
    .join("");

  return arrayElements;
}
export {fetchPersonagem, objectsIntoHTML, createPersonagemObjects}