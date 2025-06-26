const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

export const fetchExpenses = async () => {
  const res = await fetch(`${BASE_URL}/api/expenses`);
  return res.json();
};

