/* Go Back History */
const btnBack = document.querySelector('.btn-back');
const goBack = () => window.history.back();
if (btnBack) {
  btnBack.addEventListener('click', goBack);
}

/* Listing Uploaded Files */
const mediaFiles = document.getElementById('mediaFiles');
const dbTest = document.getElementById('dbtest');

if (mediaFiles) {
  mediaFiles.addEventListener('change', (e) => {
    const mediaList = document.querySelector('.media-list');
    const { files } = e.target;
    const ul = document.createElement('ul');

    for (let i = 0; i < files.length; i += 1) {
      const li = document.createElement('li');
      const fileDetails = document.createTextNode(files[i].name);
      const span = document.createElement('span');
      const iTag = document.createElement('i');
      iTag.className = 'fas fa-check';
      span.appendChild(iTag);

      li.appendChild(fileDetails);
      li.appendChild(span);
      ul.appendChild(li);
    }
    mediaList.appendChild(ul);
  });
}

/* Warning on delete button */
const deleteButton = document.querySelectorAll('.delete');
if (deleteButton.length > 0) {
  deleteButton.forEach((button) => {
    button.addEventListener('click', () => {
      window.confirm('Hey Captain, sure you wanna do that?');
    });
  });
}

/* Modal toggler */
const modal = document.getElementById('modal');
const modalBtn = document.getElementById('modalBtn');
const closeBtn = document.querySelector('.modal--close');
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

/* Snackbar */
const createSnackbar = (text) => {
  const div = document.creatediv('div');
  div.setAttribute('id', 'snackbar');
  div.innerText = text;
  div.classList.add('show');
  return div;
};

const snackbar = (text = 'Hey Snack', secs = 3) => {
  const ms = secs * 1000;
  const snackbar = createSnackbar(text);

  document.body.appendChild(snackbar);
  setTimeout(() => {
    snackbar.classList.remove('show');
  }, ms);
};
/* End Snackbar */

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

if (geoautocomplete) {
  geoautocomplete.addEventListener('change', () => {
    if (geoautocomplete.value === '') locationField.value = '';
  });
}
/* End Geo Autocomplete */

/* Initialize Map */
let map;
const mapContainer = document.getElementById('map');
function initMap(lat, lng) {
  map = new google.maps.Map(mapContainer, {
    center: { lat, lng },
    zoom: 8,
  });
}
/* End Initialize Map */
