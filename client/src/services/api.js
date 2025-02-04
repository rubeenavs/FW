import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Grocery APIs
export const getGroceries = () => axios.get(`${API_URL}/groceries`);
export const addGrocery = (data) => axios.post(`${API_URL}/groceries`, data);
export const deleteGrocery = (id) => axios.delete(`${API_URL}/groceries/${id}`);
export const updateGrocery = (id, data) => axios.put(`${API_URL}/groceries/${id}`, data); // Added updateGrocery

// Recipe APIs
export const getRecipes = () => axios.get(`${API_URL}/recipes`);
export const addRecipe = (data) => axios.post(`${API_URL}/recipes`, data);
export const deleteRecipe = (id) => axios.delete(`${API_URL}/recipes/${id}`);
export const updateRecipe = (id, data) => axios.put(`${API_URL}/recipes/${id}`, data); // Added updateRecipe

// Calculator API
export const calculateLeftovers = (recipeId) => axios.get(`${API_URL}/calculator/${recipeId}/leftovers`);
