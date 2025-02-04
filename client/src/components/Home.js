import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the Impact Calculator App</h1>
      <p>Choose what you want to manage:</p>

      <div style={{ marginTop: '30px' }}>
        <Link to="/groceries" style={{ textDecoration: 'none', marginRight: '20px' }}>
          <button style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
            Grocery Manager
          </button>
        </Link>
        <Link to="/recipes" style={{ textDecoration: 'none', marginRight: '20px' }}>
          <button style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
            Recipe Manager
          </button>
        </Link>
        <Link to="/calculator" style={{ textDecoration: 'none' }}>
          <button style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
            Calculator
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Home;