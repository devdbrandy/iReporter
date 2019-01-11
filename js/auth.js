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

class AuthAPI {
  static get uri() {
    return 'http://localhost:3000/auth';
  }

  /**
   * Make a POST request to signup user
   *
   * @param {Object} data user object parameters
   * @returns {Response} response to request
   */
  static async signup(data) {
    const res = await fetch(`${this.uri}/signup`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return res;
  }

  /**
   * Make a POST request to signup user
   *
   * @param {Object} data user object parameters
   * @returns {Response} response to request
   */
  static async login(data) {
    const res = await fetch(`${this.uri}/login`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return res;
  }
}

class AuthUI {
  /**
   * Handle signup form submit
   *
   * @param {Event} e Event object
   * @returns {Response} response to request
   */
  static async handleSignup(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    try {
      const res = await AuthAPI.signup(objectify(formData));
      const { status, data, error } = await res.json();

      if (error) throw error;
      if (status === 201) {
        const [credentials] = data;
        // Store credentials in localStorage
        localStorage.setItem('credentials', JSON.stringify(credentials));
        // Show notification message
        snackbar('Signup was successful, loading dashboard...');
        // Redirect user to dashboard
        setTimeout(() => {
          window.location = 'dashboard.html';
        }, 3000);
      }
    } catch (error) {
      // TODO: handle error preview
    }
  }

  /**
   * Handle signin form submit
   *
   * @param {Event} e Event object
   * @returns {Response} response to request
   */
  static async handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    try {
      const res = await AuthAPI.login(objectify(formData));
      const { status, data, error } = await res.json();

      if (error) throw error;
      if (status === 200) {
        const [credentials] = data;
        // Store credentials in localStorage
        localStorage.setItem('credentials', JSON.stringify(credentials));
        // Show notification message
        snackbar('Login was successful, loading dashboard...');
        // Redirect user to dashboard
        setTimeout(() => {
          window.location = 'dashboard.html';
        }, 3000);
      }
    } catch (error) {
      // TODO: handle error preview
    }
  }
}

/* HTMLFormElement */
const signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', AuthUI.handleSignup);

/* HTMLFormElement */
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', AuthUI.handleLogin);
}
