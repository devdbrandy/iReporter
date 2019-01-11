/* Geo Autocomplete */
let autocomplete;
const geoautocomplete = document.getElementById('geoautocomplete');
const locationField = document.getElementById('location');

const getCordinates = ({ lat, lng }) => `${lat()},${lng()}`;

const extractCordinates = () => {
  const place = autocomplete.getPlace();

  if (!place.geometry) {
    locationField.value = '';
  } else {
    const { geometry: { location } } = place;
    locationField.value = getCordinates(location);
  }
};

function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(geoautocomplete, { types: ['geocode'] });
  autocomplete.setFields(['geometry']);
  autocomplete.addListener('place_changed', extractCordinates);
}

geoautocomplete.addEventListener('change', () => {
  if (geoautocomplete.value === '') locationField.value = '';
});
