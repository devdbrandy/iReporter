class AuthAPI {
  static get uri() {
    return `${getEnv('API_URI')}/auth`;
  }

  /**
   * Make a POST request to signup user
   *
   * @param {Object} data user object parameters
   * @returns {Response} response to request
   */
  static async signup(data) {
    const res = await fetch(`${AuthAPI.uri}/signup`, {
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
    const res = await fetch(`${AuthAPI.uri}/login`, {
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
        UI.snackbar('Signup was successful, loading dashboard...');
        // Redirect user to dashboard
        const { user } = credentials;
        setTimeout(() => {
          window.location = getDashboard(user);
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
        UI.snackbar('Login was successful, loading dashboard...');
        // Redirect user to dashboard
        const { user } = credentials;
        setTimeout(() => {
          window.location = getDashboard(user);
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
