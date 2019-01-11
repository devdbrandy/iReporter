// Set environment configuration
window.env = {
  APP_ENV: 'prod',
  API_URI: 'https://irepot.herokuapp.com',
};

if (
  window.location.hostname === 'localhost'
  || window.location.protocol === 'file:'
) {
  window.env.APP_ENV = 'develop';
  window.env.API_URI = 'http://localhost:3000';
}

// Helper functions

/**
 * Get environment config value
 *
 * @param {String} key env config key
 * @returns {String} env config value
 */
function getEnv(key) {
  return window.env[key];
}

/**
 * Validate user authentication
 *
 * @returns {Boolean}
 */
function auth() {
  return JSON.parse(localStorage.getItem('credentials'));
}

/**
 * Get the current URI path
 *
 * @returns {String} uri path
 */
function getPath() {
  const paths = window.location.pathname.split('/');
  return paths[paths.length - 1];
}

// End Helper functions

/* Toggle Modal */
const modal = document.getElementById('modal');
const modalBtn = document.getElementById('modal-open');
const closeBtn = document.querySelector('.modal-close');
const cancelBtn = document.querySelector('.modal--footer .btn.cancel');

const openModal = () => { modal.style.display = 'flex'; };
const closeModal = () => { modal.style.display = 'none'; };

if (modalBtn) {
  modalBtn.addEventListener('click', openModal);
}

if (modal) {
  closeBtn.addEventListener('click', closeModal);
  cancelBtn.addEventListener('click', closeModal);

  window.onclick = (event) => {
    if (event.target === modal) closeModal();
  };
}
/* End Modal trigger */

/* Initialize Map */
async function lookupAddress(cordinates) {
  const token = 'AIzaSyCpEcFz1UgCJxC70IVCs2JnBOctCcZkmSA';
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${cordinates}&key=${token}`);
  const address = await response.json();
  return address;
}

let map;
const mapContainer = document.getElementById('map');
async function initMap(cordinates) {
  const [lat, lng] = cordinates.split(',');

  map = new google.maps.Map(mapContainer, {
    center: { lat: parseFloat(lat), lng: parseFloat(lng) },
    zoom: 8,
  });
  const { results } = await lookupAddress('6.6200756,3.478314599999976');
  const [location] = results;
  return location.formatted_address;
}
/* End Initialize Map */

/* Listing Uploaded Files */
const mediaFiles = document.getElementById('media-files');
if (mediaFiles) {
  mediaFiles.addEventListener('change', UI.listMedaiUpload);
}
