import express from "express";
import * as productController from "../controller/product-controller.js";
import {isLoggedIn} from "../middleware.js";
import {hasRole} from "../middleware.js";

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:productId', productController.getOneProduct);
router.post('/', productController.createProduct);
router.patch('/:productId', productController.updateProduct);
router.delete('/:productId', productController.deleteProduct);
export default router;