import * as db from "../database/database.js";
import statusCodes from "http-status-codes";


export function getAllReturnItems(req, res) {
    return res.json(db.selectAllRMAItems());
}




export function getAllReturnItemsForUser(req, res) {
    const userId = req.params.id;
    const returnId = req.params.returnId;

    const returnItems = db.selectRMAItemsByUserIdAndReturnId(userId, returnId);
    if (returnItems) {
        return res.json(returnItems);
    } else {
        return res.status(statusCodes.NOT_FOUND).json({error: "UserId or ReturnId not found."});
    }
}



export function getDamageImageByRMAItemID(req, res) {
    const rmaItemId = req.params.rmaItemId;
    const damageImage = db.selectDamageImageByRMAItemID(rmaItemId);

    if (damageImage !== null) {
        res.json({ damageImage: damageImage });
    } else {
        res.status(404).json({ message: 'DamageImage not found' });
    }
}


export function addReturnItem(req, res) {
    const returnItem = req.body;
    const imageFile = req.file;
    const errors = checkReturnItemForErrors(returnItem);

    if (errors.length > 0) {
        return res.status(statusCodes.BAD_REQUEST).json({error: errors})
    }

    db.insertRMAItem(returnItem.rmaId, returnItem.productId, returnItem.productStatus, returnItem.processStatus, returnItem.damageDescription, imageFile.filename);
    return res.status(statusCodes.CREATED).json({message: "Return-item successfully created"});
}


export async function editReturnItem(req, res) {
    const returnItemId = req.params.rmaItemId;
    const editedReturnItem = req.body;
    const errors = checkReturnItemForErrors(editedReturnItem);
    const user = req.user;


    // Restriction to approve/decline refund only once

    const oldReturnItem = db.selectRMAItemById(returnItemId);
    if (oldReturnItem) {
        const rmaOfReturnItem = db.selectRMAById(oldReturnItem.rmaId);
        if ((rmaOfReturnItem.controller !== null && user.role === 3) && (oldReturnItem.processStatus === 'Approved' || oldReturnItem.processStatus === 'Declined')){
            errors.push("Item has already been approved/declined!");
        }
    }




    // Lock mechanism, one collector and controller editing an item at a time
    const rmaOfReturnItem = db.selectRMAById(editedReturnItem.rmaId);
    console.log(rmaOfReturnItem);
    console.log(user);
        //Collector
    if (rmaOfReturnItem.collectorId !== null && user.role === 4) {
        if (rmaOfReturnItem.controllerId !== null) {
            // If a rma has a controller assigned to it, it is not in the hands of a collector anymore
            errors.push("The return item is already being handled by a controller, it is not accessible for collectors anymore");
        }
        if (user.id !== rmaOfReturnItem.collectorId) {
            // See if another collector is already processing the return item
            errors.push("The return item is being managed by a collector with id " + rmaOfReturnItem.collectorId);
        }
    }
        //Controller
    if (rmaOfReturnItem.controllerId !== null && user.role === 3) {
        if (rmaOfReturnItem.collectorId == null) {
            //If a rma doesn't have a collector assigned to it means it is still not ready for processing
            errors.push("The return item should be processed by a collector first");
        }
        if (user.id !== rmaOfReturnItem.controllerId) {
            // See if another controller is already processing the return item
            errors.push("The return item is being managed by a controller with id " + rmaOfReturnItem.controllerId);
        }
    }

    if (errors.length > 0 ){
        return res.status(statusCodes.BAD_REQUEST).json({error: errors});
    }



    // If controller doesn't process return in more than 2 minutes reset lock
    if (rmaOfReturnItem.controllerId === null && user.role === 3) {
        console.log("I will start the time out")
        setTimeout(() => {
            console.log("The time out is over now")
            // after time is over see if the return is still
            const futureReturn = db.selectRMAById(rmaOfReturnItem.rmaId);
            if (futureReturn.status === "received") {
                rmaOfReturnItem.controllerId = null;
                rmaOfReturnItem.status = "received";
                // editReturn(req, res); // see if using a database call is not better.
                db.updateRMA(rmaOfReturnItem.rmaId, rmaOfReturnItem.orderId, rmaOfReturnItem.customerId, rmaOfReturnItem.createdDate, rmaOfReturnItem.status, rmaOfReturnItem.collectorId, rmaOfReturnItem.controllerId);
            }
        }, 120000)
    }

    if (rmaOfReturnItem.controllerId === null && user.role === 3 && rmaOfReturnItem.collectorId !== null) {
        rmaOfReturnItem.controllerId = user.id;
        console.log("Look at: ", rmaOfReturnItem);
        console.log("Im here!")
        await db.updateRMA(rmaOfReturnItem.rmaId, rmaOfReturnItem.orderId, rmaOfReturnItem.customerId, rmaOfReturnItem.createdDate, rmaOfReturnItem.status, rmaOfReturnItem.collectorId, rmaOfReturnItem.controllerId);
    }

    db.updateRMAItem(returnItemId,editedReturnItem.rmaId, editedReturnItem.productId, editedReturnItem.productStatus, editedReturnItem.processStatus, editedReturnItem.damageDescription, editedReturnItem.damageImage);
    return res.status(statusCodes.OK).json({message: "Return-item with id " + returnItemId + " successfully updated"});
}

export function deleteReturnItem(req, res) {
    const returnItemId = req.params.returnItemId;

    db.deleteRMAItem(returnItemId);
    return res.status(statusCodes.OK).json({message: "Return-item with id " + returnItemId + " successfully deleted"});
}


function checkReturnItemForErrors(returnItem) {
    const errors = [];

    if (!("rmaId" in returnItem) || returnItem.rmaId < 0 || typeof returnItem.rmaId !== 'number') {
        errors.push("rmaId field missing or invalid");
    }
    if (!("productId" in returnItem) || returnItem.productId === '' || typeof returnItem.productId !== 'number'){
        errors.push("ProductId field missing or invalid");
    }
    if (!("productStatus" in returnItem) || returnItem.productStatus === ''){
        errors.push("No product status in return-item");
    }
    if (!("processStatus" in returnItem) || returnItem.processStatus === ''){
        errors.push("No process status in return-item");
    }
    // if (!("damageDescription" in returnItem) || returnItem.damageDescription === '') {
    //     errors.push("No damageDescription in return-item");
    // }
    // if (!("damageImage" in returnItem)){
    //     errors.push("No damageImage in return-item");
    // }

    return errors;
}

