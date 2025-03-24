import React, { useState} from "react";
import "./GroceryManager.css"; // Keep styles centralized

const GroceryForm = ({ grocery,  onSubmit, isEdit , onClose }) => {

    const [formData, setFormData] = useState(grocery);
  return (
    <div className="form-container">
      <div className="form-group">
        <label>Grocery Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => {console.log('clicking '); setFormData({ ...formData, name: e.target.value })}}
        />
      </div>

      <div className="form-group">
        <label>Quantity</label>
        <input
          type="number"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Unit</label>
        <select
          value={formData.unit}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
        >
          <option value="kg">kg</option>
          <option value="g">g</option>
          <option value="pcs">pcs</option>
          <option value="L">L</option>
        </select>
      </div>

      <div className="form-group">
        <label>Price</label>
        <input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Purchase Date</label>
        <input
          type="date"
          value={formData.date_of_purchase}
          onChange={(e) => setFormData({ ...formData, date_of_purchase: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Expiry Date</label>
        <input
          type="date"
          value={formData.date_of_expiry}
          onChange={(e) => setFormData({ ...formData, date_of_expiry: e.target.value })}
        />
      </div>

      <button onClick={() => onSubmit(formData)}>{isEdit ? "Save Changes" : "Add Grocery"}</button>
      <button onClick={onClose}>Close</button>
      
    </div>
  );
};

export default GroceryForm;
