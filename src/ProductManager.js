const fs = require('fs').promises;
const path = require('path');

class ProductManager {
    constructor(productsFilePath) {
        this.products = [];
        this.productIdCounter = 1;
        this.productsFilePath = productsFilePath;
        this.loadProducts();
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.productsFilePath, 'utf8');
            this.products = JSON.parse(data);
            this.productIdCounter = Math.max(...this.products.map(product => product.id), 0) + 1;
        } catch (error) {
            this.products = [];
        }
    }

    async saveProducts() {
        await fs.writeFile(this.productsFilePath, JSON.stringify(this.products, null, 2), 'utf8');
    }

    addProduct(product) {
        if (!this.validateProduct(product)) {
            throw new Error("Invalid product data");
        }

        if (this.isCodeDuplicate(product.code)) {
            throw new Error("Product code is already taken");
        }

        const newProduct = {
            ...product,
            id: this.productIdCounter++
        };

        this.products.push(newProduct);
        this.saveProducts();
    }

    getProducts(limit) {
        if (limit) {
            return this.products.slice(0, limit);
        } else {
            return this.products;
        }
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            throw new Error("Product not found");
        }
    }

    updateProduct(id, updatedFields) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            this.products[productIndex] = {
                ...this.products[productIndex],
                ...updatedFields
            };
            this.saveProducts();
        } else {
            throw new Error("Product not found");
        }
    }

    deleteProduct(id) {
        const productIndex = this.products.findIndex(product => product.id === id);
        if (productIndex !== -1) {
            this.products.splice(productIndex, 1);
            this.saveProducts();
        } else {
            throw new Error("Product not found");
        }
    }

    validateProduct(product) {
        const requiredFields = ["title", "description", "price", "thumbnail", "code", "stock"];
        return requiredFields.every(field => product[field] !== undefined && product[field] !== "");
    }

    isCodeDuplicate(code) {
        return this.products.some(product => product.code === code);
    }
}

module.exports = ProductManager;
