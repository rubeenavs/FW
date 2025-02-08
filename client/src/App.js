import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Registration";
import GroceryManager from "./components/GroceryManager";
import RecipeManager from "./components/RecipeManager";
import CookingManager from "./components/CookingManager"; // Renamed from Calculator
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
import UserManagement from "./components/UserManagement";
import RecipeInventory from "./components/RecipeInventory";
import RecommendedRecipes from "./components/RecommendedRecipes";

export const AuthContext = createContext();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const savedAuth = localStorage.getItem("isAuthenticated");
      const savedAdmin = localStorage.getItem("isAdmin");

      if (savedUser && savedAuth) {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(JSON.parse(savedAuth));
        setIsAdmin(JSON.parse(savedAdmin));
      }
    } catch (error) {
      console.error("Error initializing state from localStorage:", error.message);
    }
  }, []);

  // Save to localStorage whenever the user state changes
  useEffect(() => {
    try {
      if (isAuthenticated) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
        localStorage.setItem("isAdmin", JSON.stringify(isAdmin));
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("isAdmin");
      }
    } catch (error) {
      console.error("Error saving to localStorage:", error.message);
    }
  }, [user, isAuthenticated, isAdmin]);

  const handleLogin = (role, loggedInUser, rememberMe) => {
    setIsAuthenticated(true);
    setIsAdmin(role === "Admin");
    setUser(loggedInUser);

    try {
      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        localStorage.setItem("isAuthenticated", JSON.stringify(true));
        localStorage.setItem("isAdmin", JSON.stringify(role === "admin"));
      } else {
        sessionStorage.setItem("user", JSON.stringify(loggedInUser));
        sessionStorage.setItem("isAuthenticated", JSON.stringify(true));
        sessionStorage.setItem("isAdmin", JSON.stringify(role === "admin"));
      }
    } catch (error) {
      console.error("Error during login state storage:", error.message);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);

    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  const ProtectedRoute = ({ children, requiredRole }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
    if (requiredRole === "Admin" && !isAdmin) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        isAdmin,
        setIsAdmin,
        user,
        setUser,
        handleLogout,
      }}
    >
      <Router>
        <div
          style={{
            padding: "10px",
            background: "#f8f9fa",
            borderBottom: "1px solid #ddd",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {isAuthenticated ? (
            <>
              <span>Welcome, {user?.username || "User"}!</span>
              <button
                onClick={handleLogout}
                style={{
                  cursor: "pointer",
                  padding: "5px 10px",
                  background: "#ff4d4d",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>

        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />

          {/* User Protected Routes */}
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute requiredRole="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/groceries"
            element={
              <ProtectedRoute requiredRole="user">
                <GroceryManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cooking"
            element={
              <ProtectedRoute requiredRole="user">
                <CookingManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommended-recipes"
            element={
              <ProtectedRoute requiredRole="user">
                <RecommendedRecipes />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin-dashboard/*"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="recipes" element={<RecipeManager />} />
            <Route path="manage-users" element={<UserManagement />} />
            <Route path="inventory" element={<RecipeInventory />} />
          </Route>

          {/* Redirect all unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
