const inputCamp = document.querySelector("#autoComplete");

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

    console.log('Latitude: ' + latitude);
    console.log('Longitude: ' + longitude);
  }
}

/* ----------------------------- Injetando Google Autocomplete na DOM --------------------------------------- */

window.initAutocomplete = initAutocomplete;
const script = document.createElement('script');
script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAEDRwghEZTHUbsv_KI9agYe0bN0EDO3N8&language=pt_BR&libraries=places&callback=initAutocomplete";
script.async = true;
script.defer = true;
document.head.appendChild(script);
