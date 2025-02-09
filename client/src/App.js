import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Registration";
import Home from "./components/Home"; // ✅ Import Home Component
import GroceryManager from "./components/GroceryManager";
import RecipeManager from "./components/RecipeManager";
import CookingManager from "./components/CookingManager";
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

  const handleLogout = () => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUser(null);
    localStorage.clear();
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isAdmin, setIsAdmin, user, setUser, handleLogout }}>
      <Router>
        <Routes>
          {/* ✅ Home Page as Default */}
          <Route path="/" element={<Home />} />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* User Protected Routes */}
          <Route path="/user-dashboard" element={isAuthenticated ? <UserDashboard /> : <Navigate to="/login" />} />
          <Route path="/groceries" element={isAuthenticated ? <GroceryManager userId={user?.id} /> : <Navigate to="/login" />} />
          <Route path="/cooking" element={isAuthenticated ? <CookingManager userId={user?.id} /> : <Navigate to="/login" />} />
          <Route path="/recommended-recipes" element={isAuthenticated ? <RecommendedRecipes userId={user?.id} /> : <Navigate to="/login" />} />

          {/* Admin Protected Routes */}
          <Route path="/admin-dashboard/*" element={isAuthenticated && isAdmin ? <AdminDashboard /> : <Navigate to="/user-dashboard" />} />
          <Route path="/admin-dashboard/recipes" element={isAuthenticated && isAdmin ? <RecipeManager /> : <Navigate to="/user-dashboard" />} />
          <Route path="/admin-dashboard/manage-users" element={isAuthenticated && isAdmin ? <UserManagement /> : <Navigate to="/user-dashboard" />} />
          <Route path="/admin-dashboard/inventory" element={isAuthenticated && isAdmin ? <RecipeInventory /> : <Navigate to="/user-dashboard" />} />

          {/* Redirect all unknown routes to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
