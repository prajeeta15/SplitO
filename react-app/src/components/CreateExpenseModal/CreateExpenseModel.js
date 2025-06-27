// src/components/CreateExpenseModal/CreateExpenseModal.js
import React, { useState } from "react";
import { Modal } from "../../context/Modal";
import CreateExpense from "./CreateExpense"; //  This is form component

const CreateExpenseModal = ({ expense, setHasSubmitted }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)} className="individual-charge-button">
        Add Individual Expense
      </button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <CreateExpense
            setShowModal={setShowModal}
            expense={expense}
            setHasSubmitted={setHasSubmitted}
          />
        </Modal>
      )}
    </>
  );
};

export default CreateExpenseModal;
