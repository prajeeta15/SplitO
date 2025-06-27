const SET_USER = 'session/SET_USER';
const REMOVE_USER = 'session/REMOVE_USER';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_BASE_URL
    : 'http://localhost:5000';

const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

const removeUser = () => ({
  type: REMOVE_USER,
});

const initialState = { user: null };

const fetchCSRF = async () => {
  await fetch(`${BASE_URL}/api/auth/csrf-token`, {
    credentials: 'include',
  });
};

export const authenticate = () => async (dispatch) => {
  await fetchCSRF(); // fetch token first
  const response = await fetch(`${BASE_URL}/api/auth/`, {
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (response.ok) {
    const data = await response.json();
    if (!data.errors) dispatch(setUser(data));
  }
};

export const login = (email, password) => async (dispatch) => {
  await fetchCSRF(); // fetch token first
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
    if (data.errors) return data.errors;
  } else {
    return ['An error occurred. Please try again.'];
  }
};

export const logout = () => async (dispatch) => {
  await fetchCSRF(); // optional, good for consistency
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

export const signUp = (username, email, password, firstName, lastName, nickname) => async (dispatch) => {
  await fetchCSRF(); 
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
    if (data.errors) return data.errors;
  } else {
    return ['An error occurred. Please try again.'];
  }
};

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
