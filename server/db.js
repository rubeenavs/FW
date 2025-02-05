const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: __dirname + '/.env' });

// Initialize Supabase Client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Debugging: Check if Supabase is initialized
console.log("🔍 Supabase Initialized:", {
  url: process.env.SUPABASE_URL ? "✅ Loaded" : "❌ Not Found",
  anon_key: process.env.SUPABASE_ANON_KEY ? "✅ Loaded" : "❌ Not Found",
});

// Table names
const TABLES = {
  users: "users",
  groceries: "groceries",
  recipes: "recipes",
  calculations: "calculations",
  recommendations: "recommendations",
};

// ✅ Fetch all users
const getUsers = async () => {
  const { data, error } = await supabase.from(TABLES.users).select('*');
  if (error) console.error("❌ Error fetching users:", error.message);
  return data;
};

// ✅ Fetch all groceries for a specific user
const getGroceriesByUser = async (userid) => {
  const { data, error } = await supabase
    .from(TABLES.groceries)
    .select('*')
    .eq('userid', userid);
  if (error) console.error("❌ Error fetching groceries:", error.message);
  return data;
};

// ✅ Fetch all recipes
const getRecipes = async () => {
  const { data, error } = await supabase.from(TABLES.recipes).select('*');
  if (error) console.error("❌ Error fetching recipes:", error.message);
  return data;
};

// ✅ Fetch calculations for a user
const getCalculationsByUser = async (userid) => {
  const { data, error } = await supabase
    .from(TABLES.calculations)
    .select('*')
    .eq('userid', userid);
  if (error) console.error("❌ Error fetching calculations:", error.message);
  return data;
};

// ✅ Fetch recommendations for a user
const getRecommendationsByUser = async (userid) => {
  const { data, error } = await supabase
    .from(TABLES.recommendations)
    .select('*')
    .eq('userid', userid);
  if (error) console.error("❌ Error fetching recommendations:", error.message);
  return data;
};

// ✅ Insert new grocery item
const addGrocery = async (name, quantity, unit, userid) => {
  const { data, error } = await supabase.from(TABLES.groceries).insert([
    { name, quantity, unit, userid }
  ]);
  if (error) console.error("❌ Error adding grocery:", error.message);
  return data;
};

// ✅ Insert new recipe
const addRecipe = async (name, description, ingredients, instructions, ingredient_unit) => {
  const { data, error } = await supabase.from(TABLES.recipes).insert([
    { name, description, ingredients, instructions, ingredient_unit }
  ]);
  if (error) console.error("❌ Error adding recipe:", error.message);
  return data;
};

// ✅ Insert new calculation
const addCalculation = async (recipeid, userid, pax, portionwasted) => {
  const { data, error } = await supabase.from(TABLES.calculations).insert([
    { recipeid, userid, pax, portionwasted }
  ]);
  if (error) console.error("❌ Error adding calculation:", error.message);
  return data;
};

// ✅ Insert new recommendation
const addRecommendation = async (userid, recipeid, grocerymatched) => {
  const { data, error } = await supabase.from(TABLES.recommendations).insert([
    { userid, recipeid, grocerymatched }
  ]);
  if (error) console.error("❌ Error adding recommendation:", error.message);
  return data;
};

// ✅ Test connection - Fetch all users
(async () => {
  const users = await getUsers();
  if (users) {
    console.log("✅ Supabase connected successfully! Users found:", users.length);
  }
})();

module.exports = {
  supabase,
  getUsers,
  getGroceriesByUser,
  getRecipes,
  getCalculationsByUser,
  getRecommendationsByUser,
  addGrocery,
  addRecipe,
  addCalculation,
  addRecommendation,
};
