const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('your-mongodb-connection-string', { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Define Recipe Schema and Model
const recipeSchema = new mongoose.Schema({
  name: String,
  type: String,
  country: String,
  image: String,
  mealType: [String],
  description: String,
  ingredients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' }],
  instructions: String,
  prepTime: Number,
  cookTime: Number,
  totalTime: Number,
  servings: Number,
  tags: [String],
  rating: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

// Define Ingredient Schema and Model
const ingredientSchema = new mongoose.Schema({
  name: String,
  category: String
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

// Define RecipeIngredient Schema and Model
const recipeIngredientSchema = new mongoose.Schema({
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
  ingredientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' },
  quantity: String,
  unit: String
});

const RecipeIngredient = mongoose.model('RecipeIngredient', recipeIngredientSchema);

// Routes for Recipes
app.get('/api/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('ingredients');
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/recipes', async (req, res) => {
  const recipe = new Recipe(req.body);
  try {
    const newRecipe = await recipe.save();
    res.status(201).json(newRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('ingredients');
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Routes for Ingredients
app.get('/api/ingredients', async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/ingredients', async (req, res) => {
  const ingredient = new Ingredient(req.body);
  try {
    const newIngredient = await ingredient.save();
    res.status(201).json(newIngredient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/ingredients/:id', async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    if (!ingredient) return res.status(404).json({ message: 'Ingredient not found' });
    res.json(ingredient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/ingredients/:id', async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ingredient) return res.status(404).json({ message: 'Ingredient not found' });
    res.json(ingredient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/ingredients/:id', async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndDelete(req.params.id);
    if (!ingredient) return res.status(404).json({ message: 'Ingredient not found' });
    res.json({ message: 'Ingredient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Routes for RecipeIngredients
app.get('/api/recipe-ingredients', async (req, res) => {
  try {
    const recipeIngredients = await RecipeIngredient.find().populate('recipeId ingredientId');
    res.json(recipeIngredients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/recipe-ingredients', async (req, res) => {
  const recipeIngredient = new RecipeIngredient(req.body);
  try {
    const newRecipeIngredient = await recipeIngredient.save();
    res.status(201).json(newRecipeIngredient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/recipe-ingredients/:id', async (req, res) => {
  try {
    const recipeIngredient = await RecipeIngredient.findById(req.params.id).populate('recipeId ingredientId');
    if (!recipeIngredient) return res.status(404).json({ message: 'RecipeIngredient not found' });
    res.json(recipeIngredient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/recipe-ingredients/:id', async (req, res) => {
  try {
    const recipeIngredient = await RecipeIngredient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!recipeIngredient) return res.status(404).json({ message: 'RecipeIngredient not found' });
    res.json(recipeIngredient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/recipe-ingredients/:id', async (req, res) => {
  try {
    const recipeIngredient = await RecipeIngredient.findByIdAndDelete(req.params.id);
    if (!recipeIngredient) return res.status(404).json({ message: 'RecipeIngredient not found' });
    res.json({ message: 'RecipeIngredient deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});