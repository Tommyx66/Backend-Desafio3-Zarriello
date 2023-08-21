const express = require('express');
const path = require('path');
const ProductManager = require('./ProductManager'); // Ruta al archivo ProductManager.js

const app = express();
const PORT = process.env.PORT || 8080;

const productsFilePath = path.join(__dirname, 'products.json');
const productManager = new ProductManager(productsFilePath);

app.use(express.json());

// Ruta para obtener productos con límite opcional
app.get('/products', async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts(limit);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Ruta para obtener un producto por su id
app.get('/products/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productManager.getProductById(Number(productId));
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
