import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App"; 

const LogoutButton = () => {
    const { setIsAuthenticated, setIsAdmin, setUser } = useContext(AuthContext);
    const navigate = useNavigate(); // ✅ Moved inside the component

    const handleLogout = () => {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUser(null);
        localStorage.clear();
        sessionStorage.clear();
        navigate("/login"); // ✅ Redirect after logout
    };

    return (
        <button 
            style={{
                padding: "10px 15px",
                fontSize: "16px",
                fontWeight: "bold",
                backgroundColor: "#d9534f",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s ease"
            }}
            onClick={handleLogout}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#c9302c")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#d9534f")}
        >
            Logout
        </button>
    );
};

export default LogoutButton;
