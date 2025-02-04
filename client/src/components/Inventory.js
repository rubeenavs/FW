import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Inventory = ({ userId }) => {
    const [groceries, setGroceries] = useState([]);

    useEffect(() => {
        if (userId) {
            fetchGroceries();
        }
    }, [userId]);

    const fetchGroceries = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/groceries/${userId}`);
            setGroceries(response.data);
        } catch (error) {
            console.error('Error fetching groceries:', error.response?.data || error.message);
        }
    };

    const handleDeleteGrocery = async (groceryId) => {
        try {
            await axios.delete(`http://localhost:5000/api/groceries/${userId}/${groceryId}`);
            setGroceries(groceries.filter((grocery) => grocery.groceryid !== groceryId));
            alert('Grocery deleted successfully!');
        } catch (error) {
            console.error('Error deleting grocery:', error.response?.data || error.message);
            alert('Failed to delete grocery. Please try again.');
        }
    };

    const styles = {
        container: {
            padding: '20px',
            marginTop: '30px',
            backgroundColor: 'white',
            borderRadius: '10px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
            maxWidth: '600px',
            margin: '0 auto',
        },
        title: {
            textAlign: 'center',
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#358856',
            marginBottom: '20px',
        },
        list: {
            listStyleType: 'none',
            padding: 0,
        },
        listItem: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px',
            borderBottom: '1px solid #ccc',
        },
        itemText: {
            fontSize: '16px',
            fontWeight: '500',
        },
        deleteButton: {
            padding: '5px 10px',
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: '#FF4D4D',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
        },
        deleteButtonHover: {
            backgroundColor: '#D32F2F',
        },
        emptyMessage: {
            textAlign: 'center',
            fontSize: '16px',
            color: '#666',
            marginTop: '20px',
        },
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Inventory</h2>
            {groceries.length > 0 ? (
                <ul style={styles.list}>
                    {groceries.map((grocery) => (
                        <li key={grocery.groceryid} style={styles.listItem}>
                            <span style={styles.itemText}>
                                {grocery.name} - {grocery.quantity} {grocery.unit}
                            </span>
                            <button
                                style={styles.deleteButton}
                                onMouseOver={(e) => (e.target.style.backgroundColor = styles.deleteButtonHover.backgroundColor)}
                                onMouseOut={(e) => (e.target.style.backgroundColor = styles.deleteButton.backgroundColor)}
                                onClick={() => handleDeleteGrocery(grocery.groceryid)}
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p style={styles.emptyMessage}>No groceries found. Start adding items!</p>
            )}
        </div>
    );
};

export default Inventory;
