import React, { useState , useContext} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../App";
import Navbar from "./Navbar";

const ReviewBill = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { extractedData } = location.state || { extractedData: [] };

   // Ensure all date fields have default values
   const formattedData = extractedData.map(item => {
    console.log("Processing item:", item);
    return {
      ...item,
      date_of_expiry: item.date_of_expiry ? item.date_of_expiry.split("T")[0] : "",
      date_of_purchase: item.date_of_purchase ? item.date_of_purchase.split("T")[0] : "",
      original_expiry: item.date_of_expiry,
      isFresh: false,
    };
  });

  // Store the editable grocery data
  const [editedData, setEditedData] = useState(formattedData);

  // Handle input change for inline editing
  const handleChange = (index, field, value) => {
    const updatedItems = [...editedData];
    if (field === "isFresh") {
        if (value) {
            const expiryDate = new Date(updatedItems[index].original_expiry);
            expiryDate.setDate(expiryDate.getDate() + 3);
            updatedItems[index].date_of_expiry = expiryDate.toISOString().split("T")[0];
        }else {
            // If unchecked, revert back to the original expiry date
            updatedItems[index].date_of_expiry = updatedItems[index].original_expiry
        ? new Date(updatedItems[index].original_expiry).toISOString().split("T")[0]
        : "";
          }
        updatedItems[index].isFresh = value ; // Track selection
      } else {
        updatedItems[index][field] = value;
      }
  
    setEditedData(updatedItems);
  };

  // Handle bulk save
  const handleBulkSave = async () => {
    try {
        const formattedItems = editedData.map(item => ({
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            price: item.price,
            date_of_expiry: item.date_of_expiry ? new Date(item.date_of_expiry).toISOString() : null,
            date_of_purchase: item.date_of_purchase ? new Date(item.date_of_purchase).toISOString() : null
          }));

      await axios.post(`http://localhost:5000/api/groceries/${user.id}/bulk`, {
        items: formattedItems,
      });
      alert("Grocery items saved successfully!");
      navigate("/inventory");
    } catch (error) {
      console.error("Error saving items:", error);
      alert("Failed to save items.");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
            <Navbar />
    <div>
      <h2>Review Extracted Bill Details</h2>
      {editedData.length > 0 ? (
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: '#dff0d8' }}>
          <thead>
            <tr style={{ backgroundColor: '#4CAF50', color: 'white', fontWeight: 'bold' }}>
              <th>Name</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Price</th>
              <th>Expiry Date</th>
              <th>Fresh?</th>
              <th>Purchase Date</th>
            </tr>
          </thead>
          <tbody>
            {editedData.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleChange(index, "name", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleChange(index, "quantity", e.target.value)}
                  />
                </td>
                <td>
                  <select
                    value={item.unit}
                    onChange={(e) => handleChange(index, "unit", e.target.value)}
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="pcs">pcs</option>
                    <option value="L">L</option>
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    value={item.price}
                    onChange={(e) => handleChange(index, "price", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={item.date_of_expiry}
                    onChange={(e) => handleChange(index, "date_of_expiry", e.target.value)}
                  />  {console.log(`Row ${index} Expiry Date:`, item.date_of_expiry)}
                </td>
                <td style={{ textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={item.isFresh}
                      onChange={(e) => handleChange(index, "isFresh", e.target.checked)}
                      style={{ width: "20px", height: "20px" }}
                    />
                </td>
                <td>
                  <input
                    type="date"
                    value={item.date_of_purchase}
                    onChange={(e) => handleChange(index, "date_of_purchase", e.target.value)}
                  />  {console.log(`Row ${index} Purchase Date:`, item.date_of_purchase)}
                </td>
              </tr>
              
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data extracted. Please try again.</p>
      )}

      <button onClick={handleBulkSave}>Save All</button>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
    </div>
  );
};

export default ReviewBill;
