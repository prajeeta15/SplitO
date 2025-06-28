const API_BASE = process.env.REACT_APP_API_URL || "";

const GET_ALL_EXPENSES = "expenses/GET_ALL_EXPENSES";
const GET_ONE_EXPENSE = "expenses/GET_ONE_EXPENSE";
const EDIT_ONE_EXPENSE = "expenses/EDIT_ONE_EXPENSE";
const CREATE_EXPENSE = "expenses/CREATE_ONE_EXPENSE";
const DELETE_EXPENSE = "expenses/DELETE_ONE_EXPENSE";
const CREATE_GROUP_EXPENSE = "expenses/CREATE_GROUP_EXPENSE";

// Action creators
const loadAllExpenses = (allExpenses) => ({
  type: GET_ALL_EXPENSES,
  allExpenses,
});

const loadOneExpense = (oneExpense) => ({
  type: GET_ONE_EXPENSE,
  oneExpense,
});

const editExpense = (edited) => ({
  type: EDIT_ONE_EXPENSE,
  edited,
});

const postExpense = (newCharge) => ({
  type: CREATE_EXPENSE,
  newCharge,
});

const postGroupExpense = (newGroupCharge) => ({
  type: CREATE_GROUP_EXPENSE,
  newGroupCharge,
});

const delExpense = (expenseId) => ({
  type: DELETE_EXPENSE,
  expenseId,
});

const CLEAR_EXPENSES = "expenses/CLEAR_EXPENSES";
export const clearExpenses = () => ({
  type: CLEAR_EXPENSES,
});

// Thunks
export const getAllExpenses = () => async (dispatch) => {
  try {
    const response = await fetch(`${API_BASE}/api/expenses/current`, {
      credentials: 'include',
    });
    const res = await response.json();
    dispatch(loadAllExpenses(res));
  } catch (err) {
    console.error("Failed to fetch all expenses:", err);
  }
};

export const getOneExpense = (expenseId) => async (dispatch) => {
  try {
    const response = await fetch(`${API_BASE}/api/expenses/${expenseId}`, {
      credentials: 'include',
    });
    const res = await response.json();
    dispatch(loadOneExpense(res));
  } catch (err) {
    console.error("Failed to fetch expense:", err);
  }
};

export const editOneExpense = (info, expenseId) => async (dispatch) => {
  try {
    const response = await fetch(`${API_BASE}/api/expenses/${expenseId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(info),
    });

    const data = await response.json();
    if (!response.ok) return { errors: data.errors || ["Unexpected error"] };

    dispatch(editExpense(data));
    return data;
  } catch (err) {
    return { errors: ['Network error. Please try again.'] };
  }
};

export const createExpense = (expenseData) => async (dispatch) => {
  try {
    const res = await fetch(`${API_BASE}/api/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(expenseData),
    });

    let data;
    try {
      data = await res.json();
    } catch (err) {
      data = null;
    }

    if (!res.ok) {
      return { errors: data?.errors || ['An unexpected error occurred.'] };
    }

    dispatch(postExpense(data));
    return data;
  } catch (err) {
    return { errors: ['Network error. Please try again.'] };
  }
};

export const createGroupExpense = (info) => async (dispatch) => {
  try {
    const { group_id } = info;
    const response = await fetch(`${API_BASE}/api/groups/${group_id}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(info),
    });

    const data = await response.json();
    if (!response.ok) return { errors: data.errors || ["Unexpected error"] };

    dispatch(postGroupExpense(data));
    return data;
  } catch (err) {
    return { errors: ['Network error. Please try again.'] };
  }
};

export const deleteExpense = (expenseId) => async (dispatch) => {
  try {
    const response = await fetch(`${API_BASE}/api/expenses/${expenseId}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.ok) {
      dispatch(delExpense(expenseId));
    }
  } catch (err) {
    console.error("Failed to delete expense:", err);
  }
};

// Reducer
const initialState = { oneExpense: {}, payableExpenses: {}, receivableExpenses: {} };

const expensesReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_ALL_EXPENSES:
      newState = {
        ...state,
        oneExpense: {},
        payableExpenses: {},
        receivableExpenses: {},
      };
      action.allExpenses["Payable Expenses"].forEach((expense) => {
        newState.payableExpenses[expense.id] = expense;
      });
      action.allExpenses["Receivable Expenses"].forEach((expense) => {
        newState.receivableExpenses[expense.id] = expense;
      });
      return newState;

    case GET_ONE_EXPENSE:
      return {
        ...state,
        oneExpense: action.oneExpense,
      };

    case EDIT_ONE_EXPENSE:
      return {
        ...state,
        oneExpense: action.edited,
      };

    case CREATE_EXPENSE:
      return {
        ...state,
        oneExpense: action.newCharge,
      };

    case DELETE_EXPENSE:
      newState = {
        ...state,
        oneExpense: {},
        payableExpenses: { ...state.payableExpenses },
        receivableExpenses: { ...state.receivableExpenses },
      };
      delete newState.payableExpenses[action.expenseId];
      delete newState.receivableExpenses[action.expenseId];
      return newState;

    case CREATE_GROUP_EXPENSE:
      return { ...state };

    case CLEAR_EXPENSES:
      return {
        oneExpense: {},
        payableExpenses: {},
        receivableExpenses: {},
      };

    default:
      return state;
  }
};

export default expensesReducer;
