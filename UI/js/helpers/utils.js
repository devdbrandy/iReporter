// Set environment configuration
window.env = {
  APP_ENV: 'prod',
  API_URI: 'https://irepot-demo.herokuapp.com',
};

if (
  window.location.hostname === 'localhost'
  || window.location.protocol === 'file:'
) {
  window.env.APP_ENV = 'develop';
  window.env.API_URI = 'http://localhost:3000';
}

/**
 * Validate and returns authenticated user credentials
 *
 * @returns {Object} user credentials
 */
function auth() {
  return JSON.parse(localStorage.getItem('credentials'));
}

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

/**
 * Determine and returns user dashboard page based on user's role
 *
 * @param {Object} user - User object
 * @returns {String} dashboard page
 */
const getDashboard = () => {
  const { user } = auth();
  return user.isAdmin ? 'admin-dashboard.html' : 'dashboard.html';
};

/**
 * Generate the fullname of a user resource
 *
 * @param {Object} user - User object
 * @returns {String} Fullname string
 */
const getFullname = (user) => {
  const { firstname, lastname } = user;
  return `${firstname} ${lastname}`;
};

/**
 * Generate an overview of records
 *
 * @param {Array} records - List of records resources
 * @returns {Object} An overview of records
 */
const generateOverview = (records) => {
  const overview = {
    total: records.length,
    draft: 0,
    published: 0,
    'under-investigation': 0,
    resolved: 0,
    rejected: 0,
  };

  if (records.length > 0) {
    records.forEach((record) => {
      const { status } = record;
      overview[status] += 1;
    });
  }
  localStorage.setItem('overview', JSON.stringify(overview));
  return overview;
};

/**
 * Get records overview from localStorage
 *
 * @returns {Object} Record overview
 */
const getOverview = () => JSON.parse(localStorage.getItem('overview'));

const Toastr = (timer, position = 'top-end') => {
  const Toast = Swal.mixin({
    toast: true,
    showConfirmButton: false,
    position,
    timer,
  });
  return Toast;
};

/**
 * Generate icon tag
 *
 * @param {Array} - Fontawesome icon classes
 * @returns {HTMLElement} Element with `fa` class
 */
const generateIcon = (classes) => {
  const icon = document.createElement('i');
  icon.className = 'fa';
  icon.classList.add(...classes);
  return icon;
};

/**
 * Render button preloader
 *
 * @param {HTMLElement} el - The target element
 */
const toggleBtnLoader = (el, hide = false) => {
  const classes = ['fa-spinner', 'fa-spin'];
  const elWidth = el.offsetWidth;

  if (hide) {
    const [icon] = el.children;
    icon.classList.remove(...classes);
    icon.classList.add('fa-check');
  } else {
    el.innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
    el.style.width = `${elWidth}px`;
  }
};

/**
 * Toggle preloader
 */
const togglePreloader = () => {
  document.querySelector('.preloader').classList.toggle('hide');
};
