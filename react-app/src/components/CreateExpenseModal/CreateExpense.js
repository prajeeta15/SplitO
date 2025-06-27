import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllExpenses, createExpense } from "../../store/expense";
import { useHistory } from "react-router-dom";
import './CreateExpenseModal.css';

export default function CreateExpenseModal({ setShowModal, expense, setHasSubmitted }) {
  const dispatch = useDispatch();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const user = useSelector(state => state.session.user);
  const currentUserEmail = user?.email || '';
  const currentUserId = user?.id || null;
  const history = useHistory();

  const info = {
    description,
    amount,
    note,
    recipientEmail,
    user_id: currentUserId,
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (currentUserEmail === recipientEmail) {
      setErrors(['You really tried creating an expense on yourself?']);
      return;
    }

    const updatedExpense = await dispatch(createExpense(info));

    if (updatedExpense.errors) {
      setErrors(updatedExpense.errors);
    } else {
      setSuccessMessage('✅ Expense created and mail sent!');
      dispatch(getAllExpenses());

      setTimeout(() => {
        setSuccessMessage('');
        setShowModal(false);
      }, 1500);
    }
  };

  return (
    <div className="modal-expense-entire">
      <div className="modal-expense-header">Add New Expense</div>

      {errors.length > 0 && (
        <ul>
          {Object.values(errors).map((error, idx) => (
            <li key={idx} className="newexpense-error-list">{error}</li>
          ))}
        </ul>
      )}

      {successMessage && <div className="success-message">{successMessage}</div>}

      <form onSubmit={onSubmit} className="expense-form">
        <div className="expense-form-input">Description</div>
        <input
          required
          type="text"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          placeholder="Description"
        />

        <div className="expense-form-input">Request Amount</div>
        <input
          required
          type="number"
          min="0"
          step="0.01"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
          placeholder="Amount"
        />

        <div className="expense-form-input">Note</div>
        <input
          required
          type="text"
          onChange={(e) => setNote(e.target.value)}
          value={note}
          placeholder="Note"
        />

        <div className="expense-form-input">Recipient Email</div>
        <input
          required
          type="email"
          onChange={(e) => setRecipientEmail(e.target.value)}
          value={recipientEmail}
          placeholder="Recipient Email"
          className="expenses-last-form-element"
        />

        <button type="submit" className="expense-form-submit-button">Create Expense</button>
      </form>
    </div>
  );
}
