/* Dropdown */
const dropdownBtn = document.querySelector('.dropdown');
if (dropdownBtn) {
  dropdownBtn.addEventListener('click', () => {
    document.querySelector('.dropdown--menu').classList.toggle('show');
  });
}

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

/* Image Gallery */
/* HTMLElement */
const previewCloseBtn = document.querySelector('.gallery .close-btn');
if (previewCloseBtn) {
  previewCloseBtn.addEventListener('click', (e) => {
    e.target.parentElement.style.display = 'none';
  });
}

/**
 * Handle image preview
 *
 * @param {Event} e Event object
 */
const previewImages = (e) => {
  const image = e.target;
  const container = image.parentElement.parentElement.children;

  if (image.src) {
    if (container.length > 1) {
      /* HTMLElement */
      const previewedImage = document.getElementById('previewed-img');
      const galleryImages = document.querySelectorAll('.tabs img');
      for (let i = 0; i < galleryImages.length; i += 1) {
        galleryImages[i].style.opacity = 0.8;
      }

      previewedImage.src = image.src;
      previewedImage.parentElement.style.display = 'block';
    }
    image.style.opacity = 1;
  }
};

const galleryTab = document.querySelector('.gallery .tabs');
if (galleryTab) {
  galleryTab.addEventListener('click', previewImages);
}
/* End Image Gallery */

/* Status select options */
const getStatusOptions = (recordStatus) => {
  const statusOptions = [
    'published',
    'under-investigation',
    'resolved',
    'rejected',
  ];
  let statusSelectOpts = '';
  statusOptions.forEach((status) => {
    const selected = recordStatus === status ? 'selected' : '';
    const disabled = status === 'published' ? 'disabled' : '';
    statusSelectOpts += `<option value="${status}" ${selected} ${disabled}>${status}</option>`;
  });
  return statusSelectOpts;
};

/**
 * Lookup coordinates to addresses
 *
 * @param {String} cordinates - The location cordinates
 * @returns {String} The reverse geocode address
 */
async function lookupAddress(cordinates) {
  const token = 'AIzaSyCpEcFz1UgCJxC70IVCs2JnBOctCcZkmSA';
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${cordinates}&key=${token}`);
  const { results } = await response.json();
  const [place] = results;
  return place.formatted_address;
}

/**
 * Reverse geocoding of coordinates to addresses
 *
 * @param {google.maps.Geocoder} geocoder - Geocoder object
 * @param {google.maps.Map} map - Map object
 * @param {google.maps.InfoWindow} infowindow - InfoWindow object
 * @param {Object} location - Cordinates format: `lat,lng`
 * @param {HTMLElement} target - The target element to render reversed address
 */
function reverseGeocode(geocoder, map, infowindow, location, target) {
  geocoder.geocode({ location }, (results, status) => {
    if (status === 'OK') {
      const [result] = results;
      if (result) {
        map.setZoom(17);
        const marker = new google.maps.Marker({
          position: location,
          map,
        });
        target.innerText = result.formatted_address;
        infowindow.setContent(result.formatted_address);
        infowindow.open(map, marker);
      } else {
        Toastr(3000).fire({
          type: 'error',
          title: 'No results found',
        });
      }
    } else {
      Toastr(3000).fire({
        type: 'error',
        title: `Geocoder failed due to: ${status}`,
      });
    }
  });
}

/**
 * Initialize map
 *
 * @param {String} cordinates The location cordinates
 * @param {HTMLElement} target - The target element to render reversed address
 */
function initMap(cordinates, target) {
  const [lat, lng] = cordinates.split(',');
  const latLng = {
    lat: parseFloat(lat),
    lng: parseFloat(lng),
  };

  const mapContainer = document.getElementById('map');
  const map = new google.maps.Map(mapContainer, {
    center: latLng,
    zoom: 13,
  });

  const geocoder = new google.maps.Geocoder();
  const infowindow = new google.maps.InfoWindow();
  const args = [geocoder, map, infowindow, latLng, target];
  reverseGeocode(...args);
}
/* End Initialize Map */

class ApiBase {
  static get uri() {
    return `${getEnv('API_URI')}/api/v1`;
  }
}

class UserAPI extends ApiBase {
  static async fetchUser(id) {
    const { token } = auth();
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `${UserAPI.uri}/users/${id}`;
    const response = await fetch(url, options);
    const { data } = await response.json();
    return data;
  }

  /**
   * Make a PUT request to update a record
   *
   * @param {Object} data record object parameters
   * @returns {Response} response to request
   */
  static async update(data) {
    const { token, user: { id } } = auth();
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    const userData = objectify(data);
    const res = await fetch(`${UserAPI.uri}/users/${id}`, {
      method: 'put',
      headers,
      body: JSON.stringify(userData),
    });
    return res;
  }
}

/* RecordAPI class */
class RecordAPI extends ApiBase {
  /**
   * Make a GET request to fecth all records
   *
   * @static
   * @param {String} url - The request url
   * @returns {Promise<Response>} Response object
   *
   * @memberOf RecordAPI
   */
  static async fetchRecords(url) {
    const { token } = auth();
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await fetch(url, options);
    const { data } = await response.json();
    return data;
  }

  /**
   * Make a POST request to create a new record
   *
   * @param {Object} data - The data payload
   * @returns {Promise<Response>} Response object
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
      method: 'POST',
      headers,
      body: JSON.stringify(record),
    });
    return res;
  }

  /**
   * Make a PUT request to update a record
   *
   * @param {Object} data - The data payload
   * @returns {Promise<Response>} Response object
   */
  static async update(data) {
    const { token } = auth();
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    const record = objectify(data);
    const { media } = record;
    record.media = JSON.parse(media);
    const { id, type } = JSON.parse(localStorage.getItem('record'));
    const res = await fetch(`${RecordAPI.uri}/${type}s/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(record),
    });
    return res;
  }

  /**
   * Make a PUT request to update a record
   *
   * @param {Object} data - The data payload
   * @returns {Promise<Response>} Response object
   */
  static async updateStatus(record, status) {
    const { token } = auth();
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
    const { id, type } = record;
    const res = await fetch(`${RecordAPI.uri}/${type}s/${id}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status }),
    });
    return res;
  }

  /**
   * Make a DELETE request to destroy a given record type
   *
   * @static
   * @param {String} type - The record type
   * @param {Number} id - The record identification number
   * @returns {Promise<Response>} Response object
   *
   * @memberOf RecordAPI
   */
  static async destroy(type, id) {
    const { token } = auth();
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const res = await fetch(`${RecordAPI.uri}/${type}s/${id}`, {
      method: 'DELETE',
      headers,
    });
    return res;
  }
}

/* UI class */
class UI {
  static async showRecords() {
    // Toggle preloader
    togglePreloader();

    try {
      let userId;
      let records;
      let overview;
      let url;
      const baseUrl = RecordAPI.uri;

      switch (getPath()) {
        case 'admin-dashboard.html':
          url = `${baseUrl}/records?published=true&order=desc`;
          records = await RecordAPI.fetchRecords(url);
          overview = generateOverview([]);
          document.getElementById('total-records').innerText = overview.total;
          document.getElementById('investigation-count').innerText = overview['under-investigation'];
          document.getElementById('resolved-count').innerText = overview.resolved;
          break;
        case 'dashboard.html':
          userId = auth().user.id;
          url = `${baseUrl}/records?user=${userId}&order=desc`;
          records = await RecordAPI.fetchRecords(url);
          overview = generateOverview(records);

          // Assign record overview count
          document.getElementById('total-records').innerText = overview.total;
          document.getElementById('investigation-count').innerText = overview['under-investigation'];
          document.getElementById('resolved-count').innerText = overview.resolved;
          document.getElementById('rejected-count').innerText = overview.rejected;
          break;
        case 'records.html':
          url = `${baseUrl}/records?published=true&order=desc`;
          records = await RecordAPI.fetchRecords(url);

          return setTimeout(() => {
            // Toggle preloader
            togglePreloader();
            records.forEach(record => UI.listRecordCards(record));
          }, 2000);

          // return records.forEach(record => UI.listRecordCards(record));
        default:
          return false;
      }

      if (records) {
        setTimeout(() => {
          // Toggle preloader
          togglePreloader();
          records.forEach(record => UI.addRecordToList(record));
        }, 2000);
      }

      return true;
    } catch (err) {
      UI.snackbar('Unable to fetch data, retry in 10 secs...');
      return setTimeout(() => {
        UI.showRecords();
      }, 10000);
    }
  }

  static async listRecordCards(record) {
    /* HTMLElement */
    const container = document.querySelector('.records-list .row');
    const card = document.createElement('div');
    let statusIcon = '';
    const {
      type,
      location,
      status,
      images,
      author,
    } = record;

    let [coverImage] = images;
    if (!coverImage) coverImage = 'img/img_nature.jpg';

    if (status === 'resolved') {
      statusIcon = '<i class="fas fa-check-double"></i>';
    }

    // Get location address
    const place = await lookupAddress(location);

    card.innerHTML = `
      <div class="record-cover">
        <img src="${coverImage}">
        <div class="overlay"></div>
        <span class="author">By: <span class="name">${getFullname(author)}</span></span>
        <span class="tag tag-${type}">${type}</span>
      </div>
      <div class="record-body">
        <h4 class="record-title">${record.title}</h4>
        <p>${record.comment} </p>
        <span class="location"><i class="fas fa-map-marker-alt"></i> ${place}</span>
      </div>
      <div class="record-status">${status} ${statusIcon}</div>
    `;
    card.classList.add('card');
    card.setAttribute('data-record', JSON.stringify(record));
    container.appendChild(card);

    card.addEventListener('click', (e) => {
      UI.showRecord(card);
    });
  }

  static addRecordToList(record) {
    /* HTMLElement */
    const list = document.getElementById('record-list');
    const row = document.createElement('tr');
    const {
      type,
      status,
      createdOn,
      author,
    } = record;
    const dateCreated = moment(createdOn).format('D-MM-YYYY');

    if (getPath() === 'admin-dashboard.html') {
      // generate for admin user
      row.innerHTML = `
        <td>${record.title}</td>
        <td><span class="tag tag-${type}">${type}</span></td>
        <td>${getFullname(author)}</td>
        <td>
          <div class="wrapper">
            <select name="status" class="record-status">${getStatusOptions(status)}</select>
            <a class="action-sync" title="sync update"><i class="fas fa-sync-alt"></i></a>
          </div>
        </td>
        <td>
          <div class="wrapper">
            <button class="btn btn-info action-btn view"><i class="far fa-eye"></i>
              <span class="text">View</span>
            </button>
            <a href="edit-record.html" class="btn btn-success action-btn edit"><i class="far fa-edit"></i>
              <span class="text">Edit</span>
            </a>
            <button class="btn btn-danger action-btn delete"><i class="far fa-trash-alt"></i>
              <span class="text">Delete</span>
            </button>
          </div>
        </td>`;
    } else {
      // generate for regular user
      row.innerHTML = `
        <td class="title">${record.title}</td>
        <td><span class="tag tag-${type}">${type}</span></td>
        <td>${dateCreated}</td>
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
    }

    row.setAttribute('data-record', JSON.stringify(record));
    list.appendChild(row);

    row.querySelector('button.view').addEventListener('click', (e) => {
      UI.showRecord(row);
    });

    row.querySelector('a.edit').addEventListener('click', (e) => {
      UI.editRecord(row);
    });

    row.querySelector('button.delete').addEventListener('click', (e) => {
      Swal.fire({
        title: 'Hey Captain, are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.value) {
          UI.removeRecord(row);
        }
      });
    });

    const syncButton = row.querySelector('.action-sync');
    if (syncButton) {
      row.querySelector('.action-sync').addEventListener('click', async (e) => {
        const { value } = row.querySelector('select[name=status]');
        const icon = e.target;
        const timer = 3000;

        // Spin icon
        icon.classList.add('fa-spin');

        try {
          const res = await RecordAPI.updateStatus(record, value);
          const { status, error } = await res.json();

          if (error) throw error;
          if (status === 200) {
            // Delay notification
            setTimeout(() => {
              // Toggle spinner
              icon.classList.remove('fa-spin');
              // Show notification message
              Toastr(timer).fire({
                type: 'success',
                title: 'Record status successfully updated.',
              });
            }, timer - 2000);
          }
        } catch ({ error }) {
          Toastr(timer, 'bottom-end').fire({
            type: 'error',
            title: error,
          });
        }
      });
    }
  }

  static async showRecord(el) {
    const record = JSON.parse(el.getAttribute('data-record'));
    const {
      title,
      comment,
      location,
      images,
      author,
    } = record;

    const modalBody = document.querySelector('.modal--body');
    modalBody.querySelector('.title h4').innerText = title;
    modalBody.querySelector('.comment').innerText = comment;

    initMap(location, modalBody.querySelector('.location .text'));

    const authorField = modalBody.querySelector('.author a');
    if (authorField) {
      authorField.href = `profile.html?user=${record.createdBy}`;
      authorField.innerText = `${getFullname(author)}`;
    }

    // Load media files
    /* HTMLElement */
    const galleryTab = document.querySelector('.gallery .tabs');

    if (images.length < 1) {
      galleryTab.innerHTML = 'No media available';
    } else {
      galleryTab.innerHTML = ''; // reset container
      images.forEach((image) => {
        const column = document.createElement('div');
        const img = document.createElement('img');
        img.src = image;
        column.appendChild(img);
        galleryTab.appendChild(column);
      });

      const [previewImage] = images;
      document.getElementById('previewed-img').src = previewImage;
    }
    openModal();
  }

  /**
   * Handle create record form submit
   *
   * @static
   * @param {Event} e - Event object
   *
   * @memberOf UI
   */
  static async handleCreateRecord(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    // Button loader
    const submitBtn = form.querySelector('button[type=submit]');
    toggleBtnLoader(submitBtn);

    try {
      const res = await RecordAPI.create(formData);
      const { status, error } = await res.json();
      const timer = 3000;

      if (error) throw error;
      if (status === 201) {
        // Delay notification
        setTimeout(() => {
          // Togle button loader
          toggleBtnLoader(submitBtn, true);
          // Show notification message
          Toastr(timer).fire({
            type: 'success',
            title: 'Successfully created a new record.',
          });
          // Clear fields
          UI.clearFields();
        }, timer - 2000);
      }
    } catch ({ error }) {
      Toastr(3000).fire({
        type: 'error',
        title: error,
      });
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
   * @param {HTMLElement} el - Item list
   * @returns {void}
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
      status,
    } = JSON.parse(localStorage.getItem('record'));

    document.getElementById('id').value = id;
    document.getElementById('title').value = title;
    document.getElementById('comment').value = comment;
    document.getElementById('location').value = location;

    /* HTMLElement */
    document.querySelectorAll('input[name=type]').forEach((element) => {
      if (element.value === type) element.setAttribute('checked', true);
    });

    // /* HTMLElement */
    document.querySelectorAll('input[name=status]').forEach((element) => {
      if (element.value === status) element.setAttribute('checked', true);
      if (status !== 'draft') {
        element.setAttribute('disabled', true);
      }
    });

    if (status !== 'draft') {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'status';
      input.value = status;
      document.getElementById('status-container').appendChild(input);
    }

    if (status !== 'draft' && !auth().user.isAdmin) {
      document.querySelector('button[type=submit]').setAttribute('disabled', true);
    }

    // if (auth().user.isAdmin) {
    //   if (status !== 'draft' || status !== 'published') {
    //     const statusOptions = [
    //       'published',
    //       'under-investigation',
    //       'resolved',
    //       'rejected',
    //     ];
    //     let radioTags = '';
    //     statusOptions.forEach((statusOpt) => {
    //       const checked = statusOpt === status ? 'checked' : '';
    //       let disabled = '';
    //       if (status === 'published' && statusOpt === 'published') {
    //         disabled = 'disabled';
    //       }
    //       radioTags += `
    //         <label><input type="radio" name="status"
    //           value="${statusOpt}" ${checked} ${disabled}> ${statusOpt}</label>`;
    //     });
    //     document.getElementById('status-container').innerHTML = radioTags;
    //   }
    // }

    // // Get location address
    const place = await lookupAddress(location);
    document.getElementById('geoautocomplete').value = place;
  }

  /**
   * Handle update record form submit
   *
   * @static
   * @param {Event} e - Event object
   * @returns {void}
   *
   * @memberOf UI
   */
  static async handleUpdateRecord(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const timer = 3000;

    // Button loader
    const submitBtn = form.querySelector('button[type=submit]');
    toggleBtnLoader(submitBtn);

    try {
      const res = await RecordAPI.update(formData);
      const { status, error } = await res.json();

      if (error) throw error;
      if (status === 200) {
        // Delay notification
        setTimeout(() => {
          // Togle button loader
          toggleBtnLoader(submitBtn, true);
          // Show notification message
          Toastr(timer).fire({
            type: 'success',
            title: 'Record successfully updated.',
          });
        }, timer - 2000);

        // redirect to dashboard
        setTimeout(() => {
          window.location = getDashboard();
        }, timer);
      }
    } catch (error) {
      const [err] = error;
      Toastr(timer).fire({
        type: 'error',
        title: err.msg || error,
      });
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
        Swal.fire(
          'Deleted!',
          `Record #${id} - Successfully removed`,
          'success',
        );
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

  static avatarUpload(error, result) {
    if (result && result.event === 'success') {
      const { info } = result;
      document.querySelector('.profile-image img').src = info.secure_url;
      document.getElementById('avatar').value = info.secure_url;
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

  /**
   * Handle settings form submit
   *
   * @static
   * @param {Event} e Event object
   *
   * @memberOf UI
   */
  static async handleSettingsUpdate(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const timer = 3000;

    // Button loader
    const submitBtn = form.querySelector('button[type=submit]');
    toggleBtnLoader(submitBtn);

    try {
      const res = await UserAPI.update(formData);
      const { status, data: [row] } = await res.json();
      if (status === 200) {
        const { payload } = row;
        localStorage.setItem('credentials', JSON.stringify(payload));

        // Delay notification
        setTimeout(() => {
          // Togle button loader
          toggleBtnLoader(submitBtn, true);
          // Show notification message
          Toastr(timer, 'bottom-end').fire({
            type: 'success',
            title: 'Settings successfully updated.',
          });
        }, timer - 1500);
        // redirect to dashboard
        setTimeout(() => {
          window.location.reload();
        }, timer);
      }
    } catch ({ error }) {
      Toastr(timer, 'bottom-end').fire({
        type: 'error',
        title: error,
      });
    }
  }
}

/* User dashboard */
if (auth()) {
  const dashboardLink = document.getElementById('dashboard-link');
  dashboardLink.href = getDashboard();
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

/* Go Back History */
const btnBack = document.querySelector('.btn-back');
if (btnBack) {
  btnBack.addEventListener('click', UI.goBack);
}

/* User signout */
const logoutBtn = document.getElementById('logout');
if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    localStorage.clear();
    window.location = 'index.html';
  });
}

const logoutUsername = document.querySelector('#logout span');
if (logoutUsername) {
  logoutUsername.innerText = `(${auth().user.username})`;
}

/* Footer copyright year pre-filling */
const date = new Date();
const copyrightYear = document.getElementById('copyright-year');
if (copyrightYear) copyrightYear.innerText = date.getFullYear();

/* Cloudinary upload widget */
const uploadWidget = document.getElementById('upload-widget');
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

/* Input formating */
if (document.getElementById('phonenumber')) {
  const cleave = new Cleave('#phonenumber', {
    phone: true,
    phoneRegionCode: 'NG',
  });
}

/**
 * Render user profile with an overview
 *
 * @param {Object} user - User object
 * @param {Object} overview Overview object
 */
const renderProfile = (user, overview) => {
  const bio = !user.bio ? 'Bio not provided.' : user.bio;
  document.querySelector('.user--detail h3').innerText = getFullname(user);
  document.querySelector('.user--bio').innerText = bio;
  const registered = moment(user.registered).format('MMM Do, YYYY');
  document.querySelector('.user--registered').innerText = registered;
  document.querySelector('.user--avatar img').src = user.avatar;

  document.querySelector('.incident-total').innerText = overview.total;
  document.querySelector('.incident-resolved').innerText = overview.resolved;
  document.querySelector('.incident-rejected').innerText = overview.rejected;
};

/**
 * Handle user profile page operations
 */
async function profilePage() {
  if (getPath() === 'profile.html') {
    const params = new URLSearchParams(document.location.search.substring(1));
    let overview;
    if (params.has('user')) {
      // Hide edit button
      document.querySelector('a.edit').classList.add('hide');

      // Fetch user profile
      const id = params.get('user');
      const [user] = await UserAPI.fetchUser(id);
      // Fetch user records
      const baseUrl = RecordAPI.uri;
      const url = `${baseUrl}/records?user=${id}`;
      const records = await RecordAPI.fetchRecords(url);
      overview = generateOverview(records);
      renderProfile(user, overview);
    } else {
      const { user } = auth();
      overview = getOverview();
      renderProfile(user, overview);
    }
  }
}
profilePage();

/* User settings page */
if (getPath() === 'settings.html') {
  const { user } = auth();
  document.getElementById('username').value = `@${user.username}`;
  document.getElementById('email').value = user.email;
  document.getElementById('firstname').value = user.firstname;
  document.getElementById('lastname').value = user.lastname;
  document.getElementById('othernames').value = user.othernames;
  document.getElementById('phonenumber').value = user.phoneNumber;
  document.getElementById('bio').value = user.bio;
  document.getElementById('avatar').value = user.avatar;
  document.querySelector('.profile-image img').src = user.avatar;
  document.querySelectorAll('input[name=gender]').forEach((el) => {
    if (el.value === user.gender) el.setAttribute('checked', true);
  });

  const uploadWidget = document.getElementById('upload-avatar');
  const myWidget = cloudinary.createUploadWidget({
    cloudName: 'devdb',
    uploadPreset: 'z48lneqb',
    cropping: true,
    croppingAspectRatio: 1,
    multiple: false,
    maxFileSize: 1500000, // 1.5MB
    folder: 'avatar',
    tags: ['avatar', 'user'],
    resourceType: 'image',
  }, UI.avatarUpload);
  uploadWidget.addEventListener('click', () => myWidget.open(), false);

  /* Event: update settings */
  document.getElementById('settings-form')
    .addEventListener('submit', UI.handleSettingsUpdate);
}
