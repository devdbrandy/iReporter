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

/**
 * Convert a FormData to Object literal type
 *
 * @param {FormData} formData formdata object
 * @returns {Object} key value pairs
 */
function objectify(formData) {
  const result = {};
  for (const pairs of formData.entries()) {
    const [key, value] = pairs;
    result[key] = value;
  }
  return result;
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

  /**
   * Make a POST request to create a new record
   *
   * @param {Object} data user object parameters
   * @returns {Response} response to request
   */
  static async create(data) {
    const { token } = auth();
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    const record = objectify(data);
    const { media } = record;
    record.media = JSON.parse(media); // convert media string to array
    const { type } = record;
    const res = await fetch(`${RecordAPI.uri}/${type}s`, {
      method: 'post',
      headers,
      body: JSON.stringify(record),
    });
    return res;
  }

  /**
   * Make a PUT request to update a record
   *
   * @param {Object} data record object parameters
   * @returns {Response} response to request
   */
  static async update(data) {
    const { token } = auth();
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    const record = objectify(data);
    const { id, type } = record;
    const res = await fetch(`${RecordAPI.uri}/${type}s/${id}`, {
      method: 'put',
      headers,
      body: JSON.stringify(record),
    });
    return res;
  }

  /**
   * Make a DELETE request to destroy a given record type
   *
   * @static
   * @param {String} type record type
   * @param {Number} id record identification number
   * @returns {Response} response to request
   *
   * @memberOf RecordAPI
   */
  static async destroy(type, id) {
    const { token } = auth();
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const res = await fetch(`${RecordAPI.uri}/${type}s/${id}`, {
      method: 'delete',
      headers,
    });
    return res;
  }
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
    /* HTMLElement */
    const list = document.getElementById('record-list');
    const row = document.createElement('tr');
    const { type } = record;
    row.innerHTML = `
      <td class="title">${record.title}</td>
      <td><span class="tag tag-${type}">${type}</span></td>
      <td>${record.createdOn}</td>
      <td><span class="tag">${record.status}</span></td>
      <td>
        <div class="wrapper">
          <button class="btn btn-info action-btn view"><i class="far fa-eye"></i>
            <span class="text">View</span>
          </button>
          <a href="#!" class="btn btn-success action-btn edit">
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

    row.querySelector('a.edit').addEventListener('click', (e) => {
      UI.editRecord(row);
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

  /**
   * Handle create record form submit
   *
   * @static
   * @param {Event} e Event object
   *
   * @memberOf UI
   */
  static async handleCreateRecord(e) {
    const form = e.target;
    e.preventDefault();
    const formData = new FormData(form);

    try {
      const res = await RecordAPI.create(formData);
      const { status } = await res.json();

      if (status === 201) {
        // Show notification message
        UI.snackbar('Successfully created a new record.');
        // Clear fields
        UI.clearFields();
      }
    } catch (error) {
      // TODO: handle error preview
    }
  }

  /**
   * Clear input fields
   *
   * @static
   * @memberOf UI
   */
  static clearFields() {
    /* HTMLElement */
    document.querySelectorAll('.media-list li').forEach(item => item.remove());
    document.getElementById('title').value = '';
    document.getElementById('comment').value = '';
    document.getElementById('geoautocomplete').value = '';
    document.getElementById('location').value = '';
    document.getElementById('media').value = '[]';
  }

  /**
   * Handle record update
   *
   * @static
   * @param {HTMLElement} el Item list
   *
   * @memberOf UI
   */
  static async editRecord(el) {
    const record = el.getAttribute('data-record');
    localStorage.setItem('record', record);
    window.location = 'edit-record.html';
  }

  static async preloadData() {
    const {
      id,
      type,
      title,
      comment,
      location,
    } = JSON.parse(localStorage.getItem('record'));

    document.getElementById('id').value = id;
    document.getElementById('title').value = title;
    document.getElementById('comment').value = comment;
    document.getElementById('location').value = location;

    // Get location address
    const { results } = await lookupAddress(location);
    const [place] = results;
    document.getElementById('geoautocomplete').value = place.formatted_address;

    /* HTMLElement */
    document.querySelectorAll('input[name=type]').forEach((element) => {
      if (element.value === type) element.setAttribute('checked', true);
    });
  }

  /**
   * Handle update record form submit
   *
   * @static
   * @param {Event} e Event object
   *
   * @memberOf UI
   */
  static async handleUpdateRecord(e) {
    const form = e.target;
    e.preventDefault();
    const formData = new FormData(form);

    try {
      const res = await RecordAPI.update(formData);
      const { status } = await res.json();
      if (status === 200) {
        // Show notification message
        UI.snackbar('Record successfully updated.');
        // redirect to dashboard
        setTimeout(() => {
          window.location = 'dashboard.html';
        }, 3000);
      }
    } catch (error) {
      // TODO: handle error preview
    }
  }

  /**
   * Handle record removal
   *
   * @static
   * @param {HTMLElement} el Item list
   *
   * @memberOf UI
   */
  static async removeRecord(el) {
    const { id, type } = JSON.parse(el.getAttribute('data-record'));

    try {
      // Make api call
      const { status } = await RecordAPI.destroy(type, id);
      if (status === 200) {
        // Remove list item
        el.remove();
        // Show notification message
        UI.snackbar(`Record #${id} - Successfully removed`);
      }
    } catch (e) {
      // TODO: handle error preview
    }
  }

  static goBack() {
    window.history.back();
  }

  /**
   * Create a list of media files uploaded
   *
   * @static
   * @param {Object} media Media information
   *
   * @memberOf UI
   */
  static listMediaUpload(media) {
    /* HTMLElement */
    const filename = `${media.original_filename}.${media.format}`;
    const mediaList = document.querySelector('.media-list');
    const li = document.createElement('li');
    const text = document.createTextNode(filename);
    const span = document.createElement('span');
    const iTag = document.createElement('i');
    iTag.className = 'fas fa-check';
    span.appendChild(iTag);

    li.appendChild(text);
    li.appendChild(span);
    mediaList.appendChild(li);
  }

  static mediaUpload(error, result) {
    if (result && result.event === 'success') {
      const { info } = result;
      UI.listMediaUpload(info);
      /* HTMLInputElement */
      let values = [];
      const inputField = document.getElementById('media');
      const { value } = inputField;
      if (value && Array.isArray(JSON.parse(value))) {
        values = JSON.parse(value);
      }
      values.push(info.secure_url);
      inputField.value = JSON.stringify(values);
    }
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

/* Event: add new record */
const createRecordForm = document.getElementById('create-record-form');
if (createRecordForm) {
  createRecordForm.addEventListener('submit', UI.handleCreateRecord);
}

/* Event: update record */
const updateRecordForm = document.getElementById('update-record-form');
if (updateRecordForm) {
  UI.preloadData();
  updateRecordForm.addEventListener('submit', UI.handleUpdateRecord);
}

/* Cloudinary upload widget */
const uploadWidget = document.getElementById('upload_widget');
if (uploadWidget) {
  const myWidget = cloudinary.createUploadWidget({
    cloudName: 'devdb',
    uploadPreset: 'z48lneqb',
    maxFiles: 4,
    maxFileSize: 1500000, // 1.5MB
    folder: 'ireporter',
    tags: ['incidents'],
    clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif'],
  }, UI.mediaUpload);
  uploadWidget.addEventListener('click', () => myWidget.open(), false);
}

/* Go Back History */
const btnBack = document.querySelector('.btn-back');
if (btnBack) {
  btnBack.addEventListener('click', UI.goBack);
}
