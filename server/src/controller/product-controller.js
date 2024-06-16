import statusCodes from "http-status-codes";
import * as db from "../database/database.js";


export function getAllProducts(req, res) {
    const productData = db.selectAllProducts();
    return res.json(productData);
}
export async function getOneProduct(req, res) {
    try {
        const productId = req.params.productId;
        const product = await db.selectProductById(productId);

        if (product) {
            return res.json(product);
        } else {
            return res.status(statusCodes.NOT_FOUND).json({ error: 'Product with this id is not found' });
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch product' });
    }
}
export async function createProduct(req, res) {
    try {
        const { name, description, price, stockQuantity, isFoodItem } = req.body;
        const newProduct = {
            name,
            description,
            price,
            stockQuantity,
            isFoodItem,
        };
        if (!name || !price || !stockQuantity || isFoodItem === undefined) {
            return res.status(statusCodes.BAD_REQUEST).json({ error: 'Incomplete or invalid product details' });
        }

        const productId = await db.createProduct(newProduct);
        return res.status(statusCodes.CREATED).json({ productId });
    } catch (error) {
        console.error('Error creating product:', error);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create product' });
    }
}
export async function updateProduct(req, res) {
    try {
        const productId = req.params.productId;
        const { name, description, price, stockQuantity, isFoodItem } = req.body;
        console.log(isFoodItem)

        const existingProduct = await db.selectProductById(productId);
        if (!existingProduct) {
            return res.status(statusCodes.NOT_FOUND).json({ error: "Product with this id is not found" });
        }
        console.log(existingProduct.isFoodItem)
        const updatedFields = {
            name: name || existingProduct.name,
            description: description || existingProduct.description,
            price: price || existingProduct.price,
            stockQuantity: stockQuantity || existingProduct.stockQuantity,
            isFoodItem: isFoodItem !== undefined ? isFoodItem : existingProduct.isFoodItem,
        };
        await db.updateProductById(productId, updatedFields);

        return res.json({ message: "Product updated successfully" });
    } catch (error) {
        console.error('Error updating Product:', error);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
}
export async function deleteProduct(req, res) {
    const productId = req.params.productId;

    const existingProduct = await db.selectProductById(productId);
    if (!existingProduct) {
        return res.status(statusCodes.NOT_FOUND).json({ error: "Product with this id is not found" });
    }

    try {
        await db.deleteProductById(productId);
        return res.status(statusCodes.NO_CONTENT).send();
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
    }
}

