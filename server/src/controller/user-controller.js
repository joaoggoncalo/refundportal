import statusCodes from "http-status-codes";
import isEmail from 'validator/lib/isEmail.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {secret} from "../utils/utils.js";
import * as db from "../database/database.js"
import {sendEmail} from '../utils/utils.js';
import {differenceInDays, format, parse} from "date-fns"

export async function createNewUser(req, res) {
    const {email, password, role, username} = req.body
    const hash = await bcrypt.hash(password, 10)
    db.insertUser(username, hash, Number(role), email)
    res.status(statusCodes.CREATED)
}


export async function userLogin(req, res) {
    const {username, password} = req.body;
    const user = await db.selectUserByUsername(username);
    if (!user) {
        return res.status(404).send('Incorrect credentials 1');
    }
    if (!password) {
        return res.status(405).send('Password cannot be empty');
    }
    try {
        // console.log(password)
        // console.log(user.password)
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            const userObject = {username: user.username, role: user.role, id: user.userId, email: user.email};
            const accessToken = jwt.sign(userObject, secret);
            res.status(201).send({
                accessToken: accessToken,
                userObject: userObject
            });
        } else {
            res.status(404).send('Incorrect credentials 2');
        }
    } catch {
        res.status(500).send();
    }
}

export async function getCustomerOrders(req, res) {
    try {
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(401).json({error: 'Token is required'});
        } else {
            const decoded = jwt.verify(token, secret);
            const username = decoded.username;
            if (username !== req.user.username) {
                return res.status(401).json({error: 'Unauthorized access'});
            }
            const user = await db.selectUserByUsername(username);

            if (!user) {
                return res.status(404).json({error: 'User not found'});
            }

            const userId = user.userId;

            const orders = await db.selectOrdersByCustomerId(userId);

            if (!orders || orders.length === 0) {
                return res.status(404).json({error: 'No orders found for the user'});
            }

            res.status(200).send(orders);
        }
    } catch (error) {
        console.error('Error in getOrderPerCustomer:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

export async function createNewRMAByCustomer(req, res) {
    try {
        const {orderId, items} = req.body;
        const currentDate = format(Date.now(), "yyyy-MM-dd");


        //Auth
        const token = req.headers.authorization.split(' ')[1];
        if (!token)
            return res.status(statusCodes.UNAUTHORIZED).json({error: 'Token is required'});


        //get user obj
        const decoded = jwt.verify(token, secret);
        const username = decoded.username;
        const user = await db.selectUserByUsername(username);
        if (username !== decoded.username)
            return res.status(statusCodes.UNAUTHORIZED).json({error: 'Unauthorized access'});
        if (!user)
            return res.status(statusCodes.NOT_FOUND).json({error: 'User not found'});


        //validate order
        const validOrder = await db.selectOrderById(orderId)
        if (!validOrder)
            return res.status(statusCodes.NOT_FOUND).json({error: 'Order not found'});
        const daysSincePurchase = differenceInDays(Date.now(), parse(validOrder.orderDate, "yyyy-MM-dd", new Date()))
        if (daysSincePurchase > 14)
            return res.status(statusCodes.CONFLICT).json({error: 'Order return period of 14 days has run out'});


        //set up creation of RMA (vars)
        const customerId = user.userId;
        const status = "in transit";
        const collectorId = null;
        const controllerId = null;

        const rma = await db.insertRMA(
            orderId,
            customerId,
            currentDate,
            status,
            collectorId,
            controllerId
        );
        //filter products in order
        const validProducts = [];
        const invalidProducts = [];

        for (const item of items) {
            const {productId} = item;
            const selectedProduct = await db.selectProductById(productId);

            if (!selectedProduct)
                return res.status(404).json({error: 'Product with id ' + productId + ' not found'});

            if (selectedProduct.isFoodItem === 1)
                invalidProducts.push(item);
            else
                validProducts.push(item);
        }

        if (invalidProducts.length > 0) {
            return res.status(400).json({
                error: 'List of products contains non-returnable items (food items)',
                invalidProducts,
            });
        }

        // insert the items in the table
        const RMAItems = [];

        for (const product of validProducts) {
            const rmaItem = await db.insertRMAItem(rma.rmaId, product.productId, null, null, product.comments, product.image);
            RMAItems.push(rmaItem)
        }

        res.status(201).json({...rma, items: RMAItems});

    } catch (error) {
        console.error('Error in createNewRMAByCustomer:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

export async function notifyCustomerOfRefundStatus(req, res) {
    try {
        const customerId = req.params.id;
        const {status, productId, damageDescription, damageImage} = req.body;

        const customer = await db.selectUserById(customerId);
        if (!customer) {
            return res.status(404).json({error: 'Customer not found'});
        }

        const product = await db.selectProductById(productId);
        if (!product) {
            return res.status(404).json({error: 'Product not found'});
        }

        const notificationStatus = await sendEmail({
            recipientEmail: customer.email,
            subject: `Refund Status for ${product.name}`,
            html: `
            <h2>Refund Status: ${status}</h2>
            <h3>Damage Description:</h3>
            <p>${damageDescription}</p>`,
            attachments: [
                {
                    filename: `Christmas-Icon-with-Santa-Hat-Graphics-19877173-1.jpg`, // filename: `${damageImage}`,
                    path: `./images/Christmas-Icon-with-Santa-Hat-Graphics-19877173-1.jpg` // path: `./images/${damageImage}`
                }
            ]
        });

        if (notificationStatus.success) {
            res.status(200).json({message: 'Customer notified successfully'});
        } else {
            res.status(500).json({error: 'Failed to send notification'});
        }
    } catch (error) {
        console.error('Error in notifyCustomerOfRefundStatus:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

export async function getOrderData(req, res) {
    const customerId = req.params.customerId;
    const orderId = req.params.orderId;

    const customer = await db.selectUserById(customerId);
    if (!customer)
        return res.status(404).json({error: 'Customer not found'});

    const order = await db.selectOrderById(orderId);
    if (!order)
        return res.status(404).json({error: 'Order not found'});

    if (order.customerId !== req.user.id)
        return res.status(401).json({error: "Unauthorised"})

    return res.status(200).json(order)

}

export async function getUsersByRoleId(req, res) {
    try {
        console.log(req.params.roleId + " here")
        const roleId = parseInt(req.params.roleId);
        const users = await db.getUsersByRole(roleId);

        if (!users || users.length === 0) {
            return res.status(404).json({error: `No users found for role ${roleId}`});
        }

        let response;

        switch (roleId) {
            case 1:
                response = {admin: users};
                break;
            case 2:
                response = {customers: users};
                break;
            case 3:
                response = {controllers: users};
                break;
            case 4:
                response = {collectors: users};
                break;
            default:
                response = {users: users};
                break;
        }

        res.status(200).json(response);
    } catch (error) {
        console.error('Error in getUsersByRole:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

export async function getEmployees(req, res) {
    try {
        const employees = await db.getEmployees()
        if (!employees || employees.length === 0) {
            return res.status(404).json({error: `No employees found`});
        }
        let response = {employees :employees}
        res.status(200).json(response)
    } catch (error) {
        console.error('Error in getEmployees:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}
export async function getCustomers(req, res) {
    try {
        const customers = await db.getCustomers()
        if (!customers || customers.length === 0) {
            return res.status(404).json({error: `No customers found`});
        }
        let response = {customers :customers}
        res.status(200).json(response)
    } catch (error) {
        console.error('Error in customers:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

export async function getUsernameByUserId(req, res) {
    const userId = req.params.userId;
    try {
        const user = await db.getUsernameByUserId(userId)
        if (user) {
            return res.status(200).json(user);
        } else {
            return res.status(statusCodes.NOT_FOUND).json({error: "User with that id is not found"});
        }

    } catch (error) {
        console.error('Error in getUsernameByUserId:', error);
        res.status(500).json({error: 'Internal Server Error'});
        console.error('Error in getAllControllers:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

export async function getAllUsersByUsernameRoleAndId(req, res) {
    try {
        const users = await db.selectAllUsers();

        if (!users || users.length === 0) {
            return res.status(404).json({error: 'No users found'});
        }

        // Extracting required properties for each user
        const simplifiedUsers = users.map(user => ({
            role: user.role,
            id: user.userId,
            username: user.username,
        }));

        res.status(200).json({users: simplifiedUsers});
    } catch (error) {
        console.error('Error in getAllUsers:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

export async function editUser(req, res) {
    try {
        console.log(req.body)
        if (!req.body.username || !req.body.email) {
            return res.status(statusCodes.BAD_REQUEST).json({error: 'Username and email are required fields'});
        }
        if (!isEmail(req.body.email)) {
            return res.status(statusCodes.BAD_REQUEST).json({error: 'Email is not valid'});
        }

        const userId = req.params.userId;
        const username = req.body.username;
        const email = req.body.email;
        const roleId = req.body.role

        await db.updateUserEmailUsernameRole( username, email, roleId,userId);

        res.status(200).json({success: true});

    } catch (error) {
        console.error('Error in editUser:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

export async function deleteUser(req, res) {
    const userId = req.params.userId;

    if (req.user.role !== 1) {
        return res.status(statusCodes.UNAUTHORIZED).json({error: "Unauthorized access. Only administrators can delete users."});
    }

    const userToDelete = await db.selectUserById(userId);
    if (userToDelete) {
        await db.deleteUser(userId);
        return res.status(statusCodes.OK).json({error: `User with id ${userId} deleted successfully`});
    } else {
        return res.status(statusCodes.NOT_FOUND).json({error: `User with id ${userId} is not found`});
    }
}


