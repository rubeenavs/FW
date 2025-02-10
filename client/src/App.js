import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import ChangePassword from "./components/ChangePassword";
import Inventory from "./components/Inventory";
import FoodWasteChart from "./components/FoodWasteChart";
 
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
 
  const handleLogin = (role, loggedInUser, rememberMe) => {
    const isUserAdmin = role.toLowerCase() === "admin";
    setIsAuthenticated(true);
    setIsAdmin(isUserAdmin);
    setUser(loggedInUser);
 
    try {
      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(loggedInUser));
        localStorage.setItem("isAuthenticated", JSON.stringify(true));
        localStorage.setItem("isAdmin", JSON.stringify(isUserAdmin));
      } else {
        sessionStorage.setItem("user", JSON.stringify(loggedInUser));
        sessionStorage.setItem("isAuthenticated", JSON.stringify(true));
        sessionStorage.setItem("isAdmin", JSON.stringify(isUserAdmin));
      }
    } catch (error) {
      console.error("Error during login state storage:", error.message);
    }
  };
 
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
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
 
          {/* User Protected Routes */}
          <Route path="/user-dashboard" element={isAuthenticated ? <UserDashboard /> : <Navigate to="/login" />} />
          <Route path="/groceries" element={isAuthenticated ? <GroceryManager userId={user?.id} /> : <Navigate to="/login" />} />
          <Route path="/inventory" element={isAuthenticated ? <Inventory /> : <Navigate to="/login" />} />
          <Route path="/cooking" element={isAuthenticated ? <CookingManager userId={user?.id} /> : <Navigate to="/login" />} />
          <Route path="/recommended-recipes" element={isAuthenticated ? <RecommendedRecipes userId={user?.id} /> : <Navigate to="/login" />} />
          <Route path="/food-waste-chart" element={isAuthenticated ? <FoodWasteChart userId={user?.id} /> : <Navigate to="/login" />} />
          <Route path="/change-password/:userId" element={<ChangePassword />} />
 
 
          {/* Admin Protected Routes */}
          <Route path="/admin-dashboard/*" element={isAuthenticated && isAdmin ? <AdminDashboard /> : <Navigate to="/user-dashboard" />} />
          <Route path="/admin-dashboard/recipes" element={isAuthenticated && isAdmin ? <RecipeManager /> : <Navigate to="/user-dashboard" />} />
          <Route
  path="/admin-dashboard/manage-users"
  element={isAuthenticated && isAdmin ? <UserManagement /> : <Navigate to="/user-dashboard" replace />}
/>
 
          <Route path="/admin-dashboard/inventory" element={isAuthenticated && isAdmin ? <RecipeInventory /> : <Navigate to="/user-dashboard" />} />
 
          {/* Redirect all unknown routes to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}
 
export default App;
 
