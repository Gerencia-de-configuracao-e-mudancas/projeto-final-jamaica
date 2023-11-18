import CaixaDagua from './requisicoes.js';
import { ajustarHora } from './utils.js';

const inputCamp = document.querySelector("#autoComplete");

const weatheApiKey = "INFORME SUA KEY PARA A WEATHER API";
const getData = new CaixaDagua(weatheApiKey);

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

    let latitude = place.geometry.location.lat();
    let longitude = place.geometry.location.lng();

    let horaCerta = ajustarHora(place.utc_offset_minutes)

    const result = await getData.getAllInfo(latitude, longitude, horaCerta);
    console.log(result);
  }
}
/* ----------------------------- Injetando Google Autocomplete na DOM --------------------------------------- */
const googleAPIKEY = "INFORME SUA KEY PARA A API DO GOOGLE";

window.initAutocomplete = initAutocomplete;
const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${googleAPIKEY}&language=pt_BR&libraries=places&callback=initAutocomplete`;
script.async = true;
script.defer = true;
document.head.appendChild(script);
