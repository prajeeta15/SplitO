const BASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_BASE_URL
    : "http://localhost:5000"; // dev mode

const getCSRFToken = async () => {
  const res = await fetch(`${BASE_URL}/api/auth/csrf-token`, {
    credentials: "include",
  });
  const data = await res.json();
  return data.csrf_token;
};

const fetchWithCSRF = async (url, options = {}) => {
  const csrfToken = await getCSRFToken();

  const opts = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
      ...(options.headers || {}),
    },
    credentials: "include",
  };

  const response = await fetch(`${BASE_URL}${url}`, opts);

  const contentType = response.headers.get("content-type");

  if (!response.ok) {
    let errorMessage = `Error ${response.status}`;
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      errorMessage = data.message || JSON.stringify(data);
    }
    throw new Error(errorMessage);
  }

  if (contentType && contentType.includes("application/json")) {
    return response.json();
  } else {
    return null; // or throw error if you expect only JSON
  }
};

export const api = {
  login: async (email, password) =>
    fetchWithCSRF("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: async () =>
    fetchWithCSRF("/api/auth/logout", {
      method: "POST",
    }),

  signup: async (userInfo) =>
    fetchWithCSRF("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(userInfo),
    }),

  getCurrentUser: async () =>
    fetchWithCSRF("/api/auth/", {
      method: "GET",
    }),

  getExpenses: async () =>
    fetchWithCSRF("/api/expenses", {
      method: "GET",
    }),

  addExpense: async (expense) =>
    fetchWithCSRF("/api/expenses", {
      method: "POST",
      body: JSON.stringify(expense),
    }),

  deleteExpense: async (id) =>
    fetchWithCSRF(`/api/expenses/${id}`, {
      method: "DELETE",
    }),

  getFriends: async () =>
    fetchWithCSRF("/api/friends", {
      method: "GET",
    }),

  addFriend: async (email) =>
    fetchWithCSRF("/api/friends", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
};
