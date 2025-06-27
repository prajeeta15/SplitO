// constants
const SET_USER = 'session/SET_USER';
const REMOVE_USER = 'session/REMOVE_USER';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://splito.onrender.com'
    : 'http://localhost:8000'; // fallback for local dev

// actions
const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

const removeUser = () => ({
  type: REMOVE_USER,
});

const initialState = { user: null };

// helpers
const handleJSONResponse = async (response) => {
  try {
    return await response.json();
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Failed to parse JSON response', err);
    }
    return { errors: ['Unexpected server response.'] };
  }
};

// thunks
export const authenticate = () => async (dispatch) => {
  const response = await fetch(`${BASE_URL}/api/auth/`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (response.ok) {
    const data = await handleJSONResponse(response);
    if (!data.errors) dispatch(setUser(data));
  }
};

export const login = (email, password) => async (dispatch) => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  const data = await handleJSONResponse(response);

  if (response.ok) {
    dispatch(setUser(data));
    return null;
  } else if (response.status < 500) {
    return data.errors || ['Login failed'];
  } else {
    return ['An error occurred. Please try again.'];
  }
};

export const logout = () => async (dispatch) => {
  const response = await fetch(`${BASE_URL}/api/auth/logout`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (response.ok) {
    dispatch(removeUser());
  }
};

export const signUp = (username, email, password, first_name, last_name, nickname) => async (dispatch) => {
  const response = await fetch(`${BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      username,
      email,
      password,
      first_name,
      last_name,
      nickname,
    }),
  });

  const data = await handleJSONResponse(response);

  if (response.ok) {
    dispatch(setUser(data));
    return null;
  } else if (response.status < 500) {
    return data.errors || ['Signup failed'];
  } else {
    return ['An error occurred. Please try again.'];
  }
};

// reducer
export default function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return { user: action.payload };
    case REMOVE_USER:
      return { user: null };
    default:
      return state;
  }
}
