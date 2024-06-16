import express from "express";
import * as returnController from "../controller/return-controller.js";
import {isLoggedIn} from "../middleware.js";

const router = express.Router();

//API requests linked to controller to execute
router.get('/', returnController.getAllReturns);
router.get('/:returnId', returnController.getSpecificReturn);
router.get('/:returnId/qr-code', returnController.getQRCodeForReturn);
router.get('/:rmaId/return-items', returnController.getAllReturnItemsOfReturn);
router.get('/collectors/:userId', returnController.getReturnByCollector)
router.get('/controllers/:userId', returnController.getReturnByController)
router.post('/', returnController.addReturn);
router.patch('/:returnId', isLoggedIn, returnController.editReturn);
router.delete('/:returnId', isLoggedIn, returnController.deleteReturn);

export default router;