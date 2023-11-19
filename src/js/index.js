import CaixaDagua from './requisicoes.js';
import { ajustarHora } from './utils.js';
import { getChartConfig } from './grafico.js';

const weatheApiKey = "a24b06ebe4fc4a5c80b222503231811a24b06ebe4fc4a5c80b222503231811";
const getData = new CaixaDagua(weatheApiKey);

/* ----------------------------- Elementos que vão ser manipulados --------------------------------------- */
const inputCamp = document.querySelector("#autoComplete");
const buttonHoje = document.querySelector('#hojeBTN');
const amanhaBTN = document.querySelector('#amanhaBTN');
const dezDiasBTN = document.querySelector("#dezDiasBTN")

const data = document.querySelector("#data");
const cidadeNome = document.querySelector("#cidadeNome");
const temperatura = document.querySelector("#temperatura");
const sensacaoTermica = document.querySelector("#sensacaoTermica");
const chuva = document.querySelector("#chuva");
const maxTemp = document.querySelector("#maxTemp");
const minTemp = document.querySelector("#minTemp");
const icon = document.querySelector("#icon");
const status = document.querySelector("#status");

const loader = document.querySelector(".loader");
const prevWeatherDIV = document.querySelector('.prevWeatherDIV');
const grafico = document.querySelector("#myChart");

/* ----------------------------- variaveis de controle --------------------------------------- */
let InfosHoje = null;
let InfosAmanha = null;
let graficoConfigHoje = null;
let graficoConfigAmanha = null;
let myChart = null;
let prevWeatherList = [];

/* ----------------------------- Paginação --------------------------------------- */

buttonHoje.addEventListener('click', (e) => {
  e.preventDefault();
  if (buttonHoje.getAttribute('data-value') != 'true') {
    insertValues(InfosHoje);
    if (myChart) {
      myChart.destroy();
    }

    if (dezDiasBTN.getAttribute('data-value') == 'true') {
      prevWeatherDIV.style.display = 'none';
      document.querySelector('main').style.display = 'flex';
      document.querySelector('footer').style.display = 'block';
    }

    myChart = new Chart(grafico,graficoConfigHoje);

    buttonHoje.setAttribute('data-value', 'false');
    buttonHoje.classList.add('isActive');
    amanhaBTN.setAttribute('data-value', 'false');
    amanhaBTN.classList.remove('isActive');
    dezDiasBTN.setAttribute('data-value', 'false');
    dezDiasBTN.classList.remove('isActive');
  }
})

amanhaBTN.addEventListener('click', (e) => {
  e.preventDefault();
  if (amanhaBTN.getAttribute('data-value') != 'true' && InfosAmanha !== null) {
    insertValues(InfosAmanha);
    if (myChart) {
      myChart.destroy();
    }

    if (dezDiasBTN.getAttribute('data-value') == 'true') {
      prevWeatherDIV.style.display = 'none';
      document.querySelector('main').style.display = 'flex';
      document.querySelector('footer').style.display = 'block';
    }

    myChart = new Chart(grafico,graficoConfigAmanha);
    amanhaBTN.setAttribute('data-value', 'true');
    amanhaBTN.classList.add('isActive');
    buttonHoje.setAttribute('data-value', 'false');
    buttonHoje.classList.remove('isActive');
    dezDiasBTN.setAttribute('data-value', 'false');
    dezDiasBTN.classList.remove('isActive');
  }
})

dezDiasBTN.addEventListener('click', (e) => {
  e.preventDefault();
  if (dezDiasBTN.getAttribute('data-value') != 'true' && prevWeatherList.length > 0) {

    document.querySelector('main').style.display = 'none';
    document.querySelector('footer').style.display = 'none';

    prevWeatherDIV.replaceChildren()
    for (let i = 0; i < prevWeatherList.length; i++) {
      const obg = prevWeatherList[i];
      const node = criarPrevWeatherInfo(obg.data, obg.text, obg.icon, obg.tempMax, obg.tempMin);
      prevWeatherDIV.appendChild(node);
    }

    prevWeatherDIV.style.display = 'block';

    dezDiasBTN.setAttribute('data-value', 'true');
    dezDiasBTN.classList.add('isActive');
    amanhaBTN.setAttribute('data-value', 'false');
    amanhaBTN.classList.remove('isActive');
    buttonHoje.setAttribute('data-value', 'false');
    buttonHoje.classList.remove('isActive');
  }
})

/* ----------------------------- Google Autocomplete --------------------------------------- */

let autocomplete;

function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(
    inputCamp,
    {
      types: ['(cities)'],
      fields: ['geometry', 'utc_offset_minutes']
    });

    autocomplete.addListener('place_changed', onPlaceChanged);
}

async function onPlaceChanged() {
  let place = autocomplete.getPlace();
  if (!place.geometry) {
    inputCamp.placeholder = 'Enter a place';
  } else {
    turnLoader(true);

    let latitude = place.geometry.location.lat();
    let longitude = place.geometry.location.lng();

    let horaCerta = ajustarHora(place.utc_offset_minutes);
  
    const result = await getData.getAllInfo(latitude, longitude, horaCerta);
    InfosHoje = result[0];
    graficoConfigHoje = getChartConfig(grafico, result[1]);
    InfosAmanha = result[2];
    graficoConfigAmanha = getChartConfig(grafico, result[3]);
    prevWeatherList = result[4];

    if (!result) {
      displayError();
    } else {
      insertValues(InfosHoje);
      if (myChart) {
        myChart.destroy();
      }
      myChart = new Chart(grafico,graficoConfigHoje);
    }
    turnLoader(false);    
    inputCamp.value = ""
  }
}


/* 
  Função para inserir os dados na pagina;
*/
function insertValues(object) {
  data.textContent = object.date;
  cidadeNome.textContent = object.cidadeNome + ' - ';
  maxTemp.textContent = 'Máxima: ' + object.tempMax + '°';
  minTemp.textContent = 'Mínima: ' + object.tempMin + '°';
  temperatura.textContent = object.temperatura ? object.temperatura +'°' : '';
  sensacaoTermica.textContent = 'Sensação térmica: ' + object.sensacaoTermica + '°';
  icon.src = object.icon;
  status.textContent = object.text;
  chuva.textContent = 'Chances de Chuva: ' + object.chuva +'%';
}

/* 
  Função para ligar/desligar loader
*/
function turnLoader(boolen){
  if (boolen){
    document.querySelector('main').style.display = 'none';
    loader.style.display = 'block';
  } else {
    loader.style.display = 'None';
    document.querySelector('main').style.display = 'flex';
  }
}
function criarPrevWeatherInfo(dia, texto, iconSrc, maxima, minima) {
  const prevWeatherInfo = document.createElement('div');
  prevWeatherInfo.className = 'prevWeatherInfo';

  const leftDiv = document.createElement('div');
  leftDiv.className = 'left';

  const spanDia = document.createElement('span');
  spanDia.className = 'prevWeatherSpan whiteSpan';
  spanDia.id = 'dia';
  spanDia.textContent = dia.replace(', 00:01', '');

  const spanTexto = document.createElement('span');
  spanTexto.className = 'prevWeatherSpan greySpan';
  spanTexto.id = 'text';
  spanTexto.textContent = texto;

  leftDiv.appendChild(spanDia);
  leftDiv.appendChild(spanTexto);

  const rightDiv = document.createElement('div');
  rightDiv.className = 'right';

  const imgIcon = document.createElement('img');
  imgIcon.src = iconSrc;
  imgIcon.alt = '';

  const rightSpanDiv = document.createElement('div');
  rightSpanDiv.className = 'rightSpan';

  const spanMaxima = document.createElement('span');
  spanMaxima.className = 'prevWeatherSpan whiteSpan';
  spanMaxima.id = 'maxima';
  spanMaxima.textContent = maxima + '°';

  const spanMinima = document.createElement('span');
  spanMinima.className = 'prevWeatherSpan greySpan';
  spanMinima.id = 'minima';
  spanMinima.textContent = minima + '°';

  rightSpanDiv.appendChild(spanMaxima);
  rightSpanDiv.appendChild(spanMinima);

  rightDiv.appendChild(imgIcon);
  rightDiv.appendChild(rightSpanDiv);

  prevWeatherInfo.appendChild(leftDiv);
  prevWeatherInfo.appendChild(rightDiv);

  return prevWeatherInfo;
}

/* ----------------------------- Injetando Google Autocomplete na DOM --------------------------------------- */
const googleAPIKEY = "AIzaSyDO8IVhZMPSVShrUGbvZqHauS_-girOn48 ";

window.initAutocomplete = initAutocomplete;
const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${googleAPIKEY}&language=pt_BR&libraries=places&callback=initAutocomplete`;
script.async = true;
script.defer = true;
document.head.appendChild(script);