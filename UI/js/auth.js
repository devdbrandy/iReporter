class AuthAPI {
  static get uri() {
    return `${getEnv('API_URI')}/auth`;
  }

  /**
   * Make a POST request to `auth` endpoint
   *
   * @static
   * @param {String} path - The path params
   * @param {Object} data - The data payload
   * @returns {Promise<Response>}
   *
   * @memberOf AuthAPI
   */
  static async request(path, data) {
    const response = await fetch(`${AuthAPI.uri}${path}`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response;
  }

  /**
   * Make request to signup user
   *
   * @param {Object} data - The data payload
   * @returns {Promise<Response>} Response object
   */
  static async signup(data) {
    const response = AuthAPI.request('/signup', data);
    return response;
  }

  /**
   * Make request to signup user
   *
   * @param {Object} data - The data payload
   * @returns {Promise<Response>} Response object
   */
  static async login(data) {
    const response = await AuthAPI.request('/login', data);
    return response;
  }
}

class AuthUI {
  /**
   * Handle signup form submit
   *
   * @param {Event} e - Event object
   * @returns {void}
   */
  static async handleSignup(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const timer = 3000;

    // Button loader
    const submitBtn = form.querySelector('button[type=submit]');
    toggleBtnLoader(submitBtn);

    try {
      const res = await AuthAPI.signup(objectify(formData));
      const { status, data, error } = await res.json();

      if (error) throw error;
      if (status === 201) {
        // Delay notification
        setTimeout(() => {
          // Togle button loader
          toggleBtnLoader(submitBtn, true);
          // Show notification message
          Toastr(timer).fire({
            type: 'success',
            title: 'Signup was successful, loading dashboard...',
          });
        }, timer - 1500);

        const [credentials] = data;
        // Store credentials in localStorage
        localStorage.setItem('credentials', JSON.stringify(credentials));
        // Redirect user to dashboard
        setTimeout(() => {
          window.location = getDashboard();
        }, timer);
      }
    } catch (error) {
      // Togle button loader
      toggleBtnLoader(submitBtn, true, error);
      const [err] = error;
      Toastr(timer).fire({
        type: 'error',
        title: err.msg || error,
      });
    }
  }

  /**
   * Handle signin form submit
   *
   * @param {Event} e - Event object
   * @returns {void}
   */
  static async handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const timer = 3000;

    // Button loader
    const submitBtn = form.querySelector('button[type=submit]');
    toggleBtnLoader(submitBtn);

    try {
      const fData = objectify(formData);
      const res = await AuthAPI.login(fData);
      const { status, data, error } = await res.json();

      if (error) throw error;
      if (status === 200) {
        // Delay notification
        setTimeout(() => {
          // Togle button loader
          toggleBtnLoader(submitBtn, true);
          // Show notification message
          Toastr(timer).fire({
            type: 'success',
            title: 'Login was successful, loading dashboard...',
          });
        }, timer - 1500);

        const [credentials] = data;
        // Store credentials in localStorage
        localStorage.setItem('credentials', JSON.stringify(credentials));
        // Redirect user to dashboard
        setTimeout(() => {
          window.location = getDashboard();
        }, timer);
      }
    } catch (error) {
      // Togle button loader
      toggleBtnLoader(submitBtn, true, error);
      const [err] = error;
      Toastr(timer).fire({
        type: 'error',
        title: err.msg || error,
      });
    }
  }

  /**
   * Toggle password visibility
   *
   * @static
   * @param {HTMLElement} el The target element
   *
   * @memberOf AuthUI
   */
  static togglePassword(el) {
    if (el.classList.contains('toggle-pwd')) {
      const input = el.parentElement.querySelector('input');
      if (input.type === 'password') {
        input.type = 'text';
        input.style.borderRight = 0;
        el.classList.replace('fa-eye', 'fa-eye-slash');
      } else {
        input.type = 'password';
        el.classList.replace('fa-eye-slash', 'fa-eye');
      }
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

/* Password visibility toggle */
const form = document.querySelectorAll('form');
if (form.length > 0) {
  form.forEach((el) => {
    el.addEventListener('click', (e) => {
      AuthUI.togglePassword(e.target);
    });
  });
}
