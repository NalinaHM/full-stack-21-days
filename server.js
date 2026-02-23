const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory product data
const products = [
  { id: 1, name: 'Nebula Ultrabook 14”', price: 1499, stock: 5 },
  { id: 2, name: 'Quantum Headphones', price: 279, stock: 15 },
  { id: 3, name: 'Luminous Keyboard', price: 189, stock: 8 },
  { id: 4, name: 'Galaxy Mouse', price: 79, stock: 20 }
];

// REST API endpoints
app.get('/products', (req, res) => {
  res.json(products);
});

app.get('/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = products.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Serve frontend
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});