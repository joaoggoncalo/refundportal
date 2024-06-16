import statusCodes from "http-status-codes";
import * as db from "../database/database.js";
import {generateQRCode} from "../utils/utils.js";


export function getAllReturns(req, res) {
    const rmaData = db.selectAllRMAs();
    return res.json(rmaData);
}


export function getSpecificReturn(req, res) {
    const returnId = req.params.returnId;
    console.log(returnId)
    const wantedReturn = db.selectRMAById(returnId);
    if (wantedReturn) {
        wantedReturn.items = db.selectRMAItemsForReturn(returnId)
        return res.status(statusCodes.OK).json(wantedReturn);
    } else {
        return res.status(statusCodes.NOT_FOUND).json({error: "Return with this id is not found"});
    }
}


export async function getQRCodeForReturn(req, res) {
    const returnId = req.params.returnId;

    const targetReturn = db.selectRMAById(returnId);
    if (targetReturn) {
        const qrCode = await generateQRCode(JSON.stringify({id: targetReturn.rmaId}));
        return res.json(qrCode);
    } else {
        return res.status(statusCodes.NOT_FOUND).json({error: "Return with this id is not found"});
    }
}

export function getAllReturnsAssociatedWithUser(req, res) {
    const userId = Number(req.params.userId);
    const foundReturns = db.selectRMAsByUserId(userId);

    if (foundReturns) {
        return res.json(foundReturns);
    } else {
        return res.status(statusCodes.NOT_FOUND).json({error: "No returns found linked to that userId"});
    }
}


export function addReturn(req, res) {
    const newReturn = req.body;
    const errors = checkReturnForErrors(newReturn);

    if (errors.length > 0) {
        return res.status(statusCodes.BAD_REQUEST).json({error: errors});
    }

    db.insertRMA(newReturn.orderId, newReturn.customerId, newReturn.createdDate, newReturn.status, newReturn.collectorId, newReturn.controllerId);
    return res.status(statusCodes.CREATED).json({message: "Return successfully created"});
}


export function editReturn(req, res) {
    const returnId = req.params.returnId;
    const editedReturn = req.body;
    const errors = checkReturnForErrors(editedReturn);
    const user = req.user;
    const unchangedReturn = db.selectRMAById(returnId);

    //Collector
    if (editedReturn.collectorId !== null && user.role === 4) {
        if (unchangedReturn.controllerId !== null) {
            // If a rma has a controller assigned to it, it is not in the hands of a collector anymore
            errors.push("The return is already being handled by a controller, it is not accessible for collectors anymore");
        }
        if (user.id !== unchangedReturn.collectorId && unchangedReturn.collectorId !== null) {
            // See if another collector is already processing the return
            errors.push("The return is being managed by a collector with id " + unchangedReturn.collectorId);
        }

    }

    //Controller
    if (unchangedReturn.controllerId !== null && user.role === 3) {
        if (unchangedReturn.collectorId == null) {
            //If n rma doesn't have a collector assigned to it, it means it is still not ready for processing
            errors.push("The return should be processed by a collector first");
        }
        if (user.id !== unchangedReturn.controllerId) {
            // See if another controller is already processing the return item
            errors.push("The return is being managed by a controller with id " + unchangedReturn.controllerId);
        }
    }

    // Return all errors and exit if any
    if (errors.length > 0) {
        return res.status(statusCodes.BAD_REQUEST).json({error: errors});
    }


    // If collector doesn't process return in more than 2 minutes reset lock
    if (unchangedReturn.collectorId === null && user.role === 4) {
        setTimeout(() => {
            // after time is over see if the return is still
            const futureReturn = db.selectRMAById(returnId);
            if (futureReturn.status === "in-process") {
                editedReturn.collectorId = null;
                editedReturn.status = "in transit";
                // req.body = editedReturn;
                // editReturn(req, res); // see if using a database call is not better.
                db.updateRMA(returnId, editedReturn.orderId, editedReturn.customerId, editedReturn.createdDate, editedReturn.status, editedReturn.collectorId, editedReturn.controllerId);
            }
        }, 120000);

    }
    // If controller doesn't process return in more than 2 minutes reset lock
    // else if (unchangedReturn.controllerId === null && user.role === 3) {
    //     setTimeout(() => {
    //         // after time is over see if the return is still
    //         const futureReturn = db.selectRMAById(returnId);
    //         if (futureReturn.status === "received") {
    //             editedReturn.controllerId = null;
    //             editedReturn.status = "received";
    //             req.body = editedReturn;
    //             // editReturn(req, res); // see if using a database call is not better.
    //             db.updateRMA(returnId, editedReturn.orderId, editedReturn.customerId, editedReturn.createdDate, editedReturn.status, editedReturn.collectorId, editedReturn.controllerId);
    //         }
    //     }, 120000)
    // }

    db.updateRMA(returnId, editedReturn.orderId, editedReturn.customerId, editedReturn.createdDate, editedReturn.status, editedReturn.collectorId, editedReturn.controllerId);
    return res.status(statusCodes.OK).json({message: "Return with id " + returnId + " successfully edited"});
}

export function getAllReturnItemsOfReturn(req, res) {
    const rmaId = req.params.rmaId;


    const returnItems = db.selectRMAItemsForReturn(rmaId);
    if (returnItems) {
        return res.json(returnItems);
    } else {
        return res.status(statusCodes.NOT_FOUND).json({error: "Return with id " + rmaId + " was not found"});
    }
}

export async function deleteReturn(req, res) {
    const returnId = req.params.returnId;
    // if admin or customer
    if (req.user.role === 1) {
        await db.deleteRMA(returnId);
        return res.status(statusCodes.OK).json({message: "Return with id " + returnId + " successfully deleted"});
    } else if (req.user.role === 2) {
        const rma = await db.selectRMAById(returnId)
        if (rma.customerId !== req.user.id)
            return res.status(statusCodes.FORBIDDEN).json({message: "Unauthorised access. Only admins or customers that created the refund may delete it"})
        if (rma.status !== "in transit")
            return res.status(statusCodes.NOT_ACCEPTABLE).json({message: "Your package have already been received by the company. You can't cancel the refund anymore"})
        await db.deleteRMA(returnId);
        return res.status(statusCodes.OK).json({message: "Return with id " + returnId + " successfully deleted"});
    } else
        return res.status(statusCodes.FORBIDDEN).json({message: "Unauthorised access. Only admins or customers that created the refund may delete it"})
}

export async function getReturnByCollector(req, res) {
    const userId = req.params.userId
    const task = await db.selectRMAByCollectorIdAndNotFinished(userId)
    return res.status(200).json(task)
}

export async function getReturnByController(req, res) {
    const userId = req.params.userId
    const task = await db.selectRMAByControllerIdAndNotFinished(userId)
    return res.status(200).json(task)
}

function checkReturnForErrors(newReturn) {
    const errors = [];

    if (!("orderId" in newReturn) || newReturn.orderId < 0 || typeof newReturn.orderId !== 'number') {
        errors.push("OrderId field missing or invalid");
    }
    if (!("customerId" in newReturn) || newReturn.customerId === '' || typeof newReturn.customerId !== 'number') {
        console.log("customerId", newReturn.customerId);
        //
        //errors.push("CustomerId field missing or invalid");
    }
    if (!("createdDate" in newReturn) || newReturn.createdDate === '' || newReturn.createdDate === null) {
        errors.push("No createdDate in return");
    }
    if (!("status" in newReturn) || newReturn.status === '') {
        errors.push("No status in return");
    }
    // if (!("returnReason" in newReturn) || newReturn.returnReason === '' || newReturn.returnReason.length < 5) {
    //     errors.push("Return reason missing or invalid. Reason must be more than 5 characters long");
    // }
    if (!("collectorId" in newReturn)) {
        errors.push("No collectorId in return");
    }
    if (!("controllerId" in newReturn)) {
        errors.push("No controllerId in return");
    }

    return errors;
}
