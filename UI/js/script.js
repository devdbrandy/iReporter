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

/* RecordAPI class */
class RecordAPI {
  static get uri() {
    return `${getEnv('API_URI')}/api/v1`;
  }

  static async fetchRecords(type = '') {
    const { token } = auth();
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(`${RecordAPI.uri}/${type}`, options);
    const { data } = await response.json();
    return data;
  }

  static fetchRecord(type, id) {}

  static deleteRecord(type, id) {}
}

/* UI class */
class UI {
  static async showRecords() {
    if (getPath() !== 'dashboard.html') {
      return false;
    }

    // TODO: show preloader

    try {
      const records = await RecordAPI.fetchRecords('red-flags');
      if (records) {
        // TODO: hide preloader
        return records.forEach(record => UI.addRecordToList(record));
      }
      return true;
    } catch (err) {
      UI.snackbar('Unable to fetch data, retry in 10 secs...');
      return setTimeout(() => {
        UI.showRecords();
      }, 10000);
    }
  }

  static addRecordToList(record) {
    const list = document.getElementById('record-list');
    const row = document.createElement('tr');

    row.innerHTML = `
      <td class="title">${record.title}</td>
      <td><span class="tag tag-${record.type}">${record.type}</span></td>
      <td>${record.createdOn}</td>
      <td><span class="tag">${record.status}</span></td>
      <td>
        <div class="wrapper">
          <button class="btn btn-info action-btn view"><i class="far fa-eye"></i>
            <span class="text">View</span>
          </button>
          <a href="edit-record.html" class="btn btn-success action-btn edit">
            <i class="far fa-edit"></i>
            <span class="text">Edit</span>
          </a>
          <button class="btn btn-danger action-btn delete"><i class="far fa-trash-alt"></i>
            <span class="text">Delete</span>
          </button>
        </div>
      </td>`;
    row.setAttribute('data-record', JSON.stringify(record));
    list.appendChild(row);

    row.querySelector('button.view').addEventListener('click', (e) => {
      UI.showRecord(row);
    });

    row.querySelector('button.delete').addEventListener('click', (e) => {
      UI.removeRecord(row);
    });
  }

  static async showRecord(el) {
    const {
      title,
      comment,
      location,
    } = JSON.parse(el.getAttribute('data-record'));

    const modalBody = document.querySelector('.modal--body');
    modalBody.querySelector('.title h4').innerText = title;
    modalBody.querySelector('.comment').innerText = comment;

    const place = await initMap(location);
    modalBody.querySelector('.location .text').innerText = place;
    openModal();
  }

  static removeRecord(el) {
    console.log('REMOVE RECORD');
  }

  static goBack() {
    window.history.back();
  }

  static listMedaiUpload() {
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
  }

  static snackbar(text, ms = 3000) {
    const snackbar = UI.createSnackbar(text);

    document.body.appendChild(snackbar);
    setTimeout(() => {
      snackbar.classList.remove('show');
    }, ms);
  }

  static createSnackbar(text) {
    const div = document.createElement('div');
    div.setAttribute('id', 'snackbar');
    div.innerText = text;
    div.classList.add('show');
    return div;
  }
}

/* Event: Load list of records */
document.addEventListener('DOMContentLoaded', UI.showRecords);

/* Go Back History */
const btnBack = document.querySelector('.btn-back');
if (btnBack) {
  btnBack.addEventListener('click', UI.goBack);
}

/* Listing Uploaded Files */
const mediaFiles = document.getElementById('media-files');
if (mediaFiles) {
  mediaFiles.addEventListener('change', UI.listMedaiUpload);
}
