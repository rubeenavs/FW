import React from "react";
import ReactDOM from "react-dom";
import "./Modal.css"; // Keep styles separate
import GroceryForm from "./GroceryForm";

const Modal = ({ isOpen, onClose, selectedGrocery, onSave  }) => {
    console.log(' isopen :' + isOpen);
    console.log(' selectedGrocery :' + selectedGrocery);
  if (!isOpen || !selectedGrocery) return null;

   // Ensure modal-root exists before rendering
   const modalRoot = document.getElementById("modal-root");
   if (!modalRoot) {
     console.error("❌ Error: #modal-root not found in index.html");
     return null;
   }

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={onClose}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
    <button className="close-button" onClick={onClose}>✖</button>
      <h2>Edit Item</h2>
      <GroceryForm grocery={selectedGrocery}  onSubmit={(updatedGrocery) => {
    console.log("Saving grocery:", updatedGrocery);
    onSave(updatedGrocery);
    onClose();
  }} isEdit={true} onClose={onClose}/>
   </div>
  </div>,
  modalRoot  // Ensure modal renders directly inside <body>
  );
};

export default Modal;