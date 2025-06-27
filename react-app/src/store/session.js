function getCSRFToken() {
  const match = document.cookie.match(/csrf_token=([^;]+)/);
  return match ? match[1] : null;
}

const csrfToken = getCSRFToken();

const SET_USER = 'session/SET_USER';
const REMOVE_USER = 'session/REMOVE_USER';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://splito.onrender.com'
    : 'http://localhost:8000'; // Flask dev server

// Action Creators
const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

const removeUser = () => ({
  type: REMOVE_USER,
});

// Thunks
export const authenticate = () => async (dispatch) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/`, {
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      if (!data.errors) dispatch(setUser(data));
    }
  } catch (err) {
    console.error('Auth error:', err);
  }
};

export const login = (email, password) => async (dispatch) => {
  try {
    await fetch(`${BASE_URL}/api/auth/csrf-token`, { credentials: 'include' });
    const csrfToken = getCSRFToken();
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken(),
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(setUser(data));
      return null;
    } else if (response.status < 500) {
      const data = await response.json();
      return data.errors || ['Login failed'];
    } else {
      return ['An error occurred. Please try again.'];
    }
  } catch (err) {
    return ['Network error. Please try again.'];
  }
};

export const logout = () => async (dispatch) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) dispatch(removeUser());
  } catch (err) {
    console.error('Logout error:', err);
  }
};

export const signUp = (username, email, password, firstName, lastName, nickname) => async (dispatch) => {
  try {
    await fetch(`${BASE_URL}/api/auth/csrf-token`, { credentials: 'include' });
    const csrfToken = getCSRFToken();
    const response = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken(),
      },
      credentials: 'include',
      body: JSON.stringify({
        username,
        email,
        password,
        firstName,
        lastName,
        nickname,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(setUser(data));
      return null;
    } else if (response.status < 500) {
      const data = await response.json();
      return data.errors || ['Signup failed'];
    } else {
      return ['An error occurred. Please try again.'];
    }
  } catch (err) {
    return ['Network error. Please try again.'];
  }
};

// Reducer
const initialState = { user: null };

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { user: action.payload };
    case REMOVE_USER:
      return { user: null };
    default:
      return state;
  }
}
