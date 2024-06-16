import express from "express";
import * as returnItemController from "../controller/return-item-controller.js";
import multer from 'multer';
import {isLoggedIn} from "../middleware.js";

const router = express.Router();

// File (image) upload middleware
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const filename = `${timestamp}_${file.originalname}`;
        cb(null, filename);
    },
});

const upload = multer({storage});


//API requests linked to controller to execute
router.get('/', returnItemController.getAllReturnItems);
router.get('/damage-image/:rmaItemId', returnItemController.getDamageImageByRMAItemID); //FIXME this is probably redundant
// router.post('/', returnItemController.addReturnItem);
router.patch('/:rmaItemId', isLoggedIn,  returnItemController.editReturnItem);
router.delete('/:returnItemId', returnItemController.deleteReturnItem);
router.post('/', upload.single('damageImage'), returnItemController.addReturnItem);
router.delete('/:returnItemId', returnItemController.deleteReturnItem);

export default router;