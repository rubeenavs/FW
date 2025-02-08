import React, { useContext, useState } from 'react';
import GroceryManager from './GroceryManager';
import Inventory from './Inventory';
import Calculator from './CookingManager';
import { AuthContext } from '../App';
import bgImage from './user_pic.webp'; 
import logoImage from './Logo.jpg'; 

const UserDashboard = () => {
    const { user } = useContext(AuthContext); 
    const [activeTab, setActiveTab] = useState('groceryManager'); 

    if (!user) {
        return <p>Loading user data...</p>; 
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'groceryManager':
                return <GroceryManager userId={user.id} />; 
            case 'inventory':
                return <Inventory userId={user.id} />; 
            case 'calculation':
                return <Calculator userId={user.id}/>;
            default:
                return null;
        }
    };

    const styles = {
        container: {
            //backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            minHeight: '100vh',
            fontFamily: `'Arial', sans-serif`,
            color: '#333',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center', 
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
        },
        logoContainer: {
            display: 'flex',
            alignItems: 'center',
        },
        logo: {
            height: '80px',
            width: '80px',
            marginRight: '15px',
            borderRadius: '100%',
        },
        title: {
          backgroundColor: 'white',
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#358856',
        },
        tabButtons: {
            display: 'flex',
            flexDirection: 'row',
            gap: '15px', 
        },
        button: (isActive) => ({
            padding: '10px 30px',
            backgroundColor: isActive ? '#007BFF' : '#f1f1f1',
            color: isActive ? '#fff' : '#000',
            border: isActive ? '2px solid #0056b3' : '1px solid #ccc',
            borderRadius: '100px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease, transform 0.2s ease, border 0.3s ease',
            boxShadow: isActive ? '0 4px 10px rgba(0, 0, 0, 0.2)' : 'none',
        }),
        buttonHover: {
            transform: 'scale(1.1)', 
        },
        content: {
            textAlign: 'center',
            width: '80%',
            marginTop: '20px', 
        },
        description: {
            fontSize: '20px',
            fontWeight: 'bold',
            lineHeight: '1.6',
            margin: '20px auto',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: '20px',
            borderRadius: '100px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        },
        aboutUs: {
            textAlign: 'center',
            marginTop: '20px',
            padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '80px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
        },
        aboutUsTitle: {
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: '#0056b3',
        },
    };

    return (
        <div style={styles.container}>
            
            <div style={styles.header}>
                
                <div style={styles.logoContainer}>
                    <img src={logoImage} alt="Logo" style={styles.logo} />
                    <h1 style={styles.title}>SUSTAINABLE BAO</h1>
                </div>

                
                <div style={styles.tabButtons}>
                    {['groceryManager', 'inventory', 'calculation'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                ...styles.button(activeTab === tab),
                            }}
                            onMouseOver={(e) =>
                                Object.assign(e.target.style, styles.buttonHover)
                            }
                            onMouseOut={(e) =>
                                Object.assign(e.target.style, styles.button(activeTab === tab))
                            }
                        >
                            {tab === 'groceryManager' && 'Grocery Manager'}
                            {tab === 'inventory' && 'Inventory'}
                            {tab === 'calculation' && 'Calculation Page'}
                        </button>
                    ))}
                </div>
            </div>

            
            <div style={styles.content}>
                <p style={styles.description}>
                    Welcome to Sustainable Bao! Your ultimate platform to manage groceries, track inventory, and reduce food waste while promoting sustainable living.
                </p>

                
                {/* <div style={styles.aboutUs}>
                    <h2 style={styles.aboutUsTitle}>ABOUT US</h2>
                    <p>
                        Sustainable Bao is designed to simplify food management while fostering sustainability.
                        Our app allows you to monitor groceries, maintain inventory, and calculate food usage efficiently.
                        By reducing waste and optimizing resource usage, we aim to help you live a greener lifestyle while saving money.
                    </p>
                </div> */}

                
                <div>{renderTabContent()}</div>
            </div>
        </div>
    );
};

export default UserDashboard;
