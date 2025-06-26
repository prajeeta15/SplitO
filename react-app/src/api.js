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

export const fetchWithCSRF = async (url, options = {}) => {
  const csrfToken = await getCSRFToken();

  const opts = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
      ...(options.headers || {}),
    },
    credentials: "include", // needed for cookies/session
  };

  const response = await fetch(`${BASE_URL}${url}`, opts);
  if (!response.ok) throw new Error("API request failed");
  return response.json();
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
