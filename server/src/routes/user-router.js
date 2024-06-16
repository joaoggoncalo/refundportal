import express from "express";
import * as middleware from "../middleware.js"
import * as userController from "../controller/user-controller.js";
import * as returnController from "../controller/return-controller.js";
import * as returnItemController from "../controller/return-item-controller.js";

const router = express.Router();

// API requests linked to controller to execute
router.get('/:id/orders', middleware.isLoggedIn, middleware.hasRole('customer'), userController.getCustomerOrders);
router.get('/:userId/returns', middleware.isLoggedIn, returnController.getAllReturnsAssociatedWithUser);
router.get('/:userId/returns/:returnId/return-items', middleware.isLoggedIn, returnItemController.getAllReturnItemsForUser);
router.get('/:customerId/orders/:orderId', middleware.isLoggedIn, middleware.hasRole('customer'), userController.getOrderData);
router.get('/:userId', middleware.isLoggedIn, userController.getUsernameByUserId)
router.get('/role/employees', userController.getEmployees)
router.get('/role/customers', userController.getCustomers)
router.get('/', middleware.isLoggedIn, middleware.hasRole("admin"), userController.getAllUsersByUsernameRoleAndId)

router.patch('/:userId', userController.editUser)

router.post('/', middleware.isLoggedIn, middleware.hasRole('admin'), userController.createNewUser);
router.post('/:id/returns', middleware.isLoggedIn, middleware.hasRole('customer'), userController.createNewRMAByCustomer);
router.post('/:id/notifications', userController.notifyCustomerOfRefundStatus);

// Cannot delete with current setup because database does not allow to
// router.delete('/:userId', middleware.isLoggedIn, middleware.hasRole("admin"), userController.deleteUser);

export default router;