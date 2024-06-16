import Database from 'better-sqlite3';
import * as queries from "./queries.js";
import * as dummyData from "./database-dummydata.js"

let db;


try {
    db = new Database('src/database/data.db');

} catch (e) {
    console.error('Error while initializing db!', e);
    throw e;
}
let lastInsertedId = null;


let recordUpdated = false;
let recordDeleted = false;
db.prepare(queries.createProductTableStatement).run(); //create table
insertProductData() //populate table
db.prepare(queries.createRoleTableStatement).run();
insertRoleData()
db.prepare(queries.createUserTableStatement).run()
insertUserData()
db.prepare(queries.createOrderTableStatement).run()
insertOrderData()
db.prepare(queries.createOrderDetailsTableStatement).run()
insertOrderDetailsData()
db.prepare(queries.dropRMAItemStatement).run()
db.prepare(queries.createRMATableStatement).run()
insertRMAData()
db.prepare(queries.createRMAItemTableStatement).run()
insertRMADetailsData()

function insertProductData() {
    const checkExistingData = db.prepare('SELECT COUNT(*) as count FROM Product').get();
    //check if the table is empty
    if (checkExistingData.count === 0) {
        const stmt = db.prepare(queries.insertProductStatement);

        dummyData.productData.forEach(({name, description, price, stockQuantity, isFoodItem}) => {
            stmt.run(name, description, price, stockQuantity, isFoodItem);
        });

        console.log('Dummy product data inserted into the Product table.');
    } else {
        console.log('Product table already contains data. Skipping insertion.');
    }
}

function insertRoleData() {
    const checkExistingData = db.prepare('SELECT COUNT(*) as count FROM Role').get();

    if (checkExistingData.count === 0) {
        const stmt = db.prepare(queries.insertRoleStatement);

        dummyData.roleData.forEach(({roleName}) => {
            stmt.run(roleName)
        });

        console.log('Dummy role data inserted into the Product table.');
    } else {
        console.log('Role table already contains data. Skipping insertion.');
    }
}

function insertUserData() {
    const checkExistingData = db.prepare('SELECT COUNT(*) as count FROM User').get();

    if (checkExistingData.count === 0) {
        const stmt = db.prepare(queries.insertUserStatement);

        dummyData.userData.forEach(({username, password, role, email}) => {
            stmt.run(username, password, role, email);
        });
        console.log('Dummy user data inserted into the Product table.');
    } else {
        console.log('User table already contains data. Skipping insertion.');
    }
}

function insertOrderData() {
    const checkExistingData = db.prepare('SELECT COUNT(*) as count FROM "Order"').get();

    if (checkExistingData.count === 0) {
        const stmt = db.prepare(queries.insertOrderStatement);

        dummyData.orderData.forEach(({customerId, orderDate}) => {
            stmt.run(customerId, orderDate);
        });

        console.log('Dummy order data inserted into the Order table.');
    } else {
        console.log('Order table already contains data. Skipping insertion.');
    }
}

function insertOrderDetailsData() {
    const checkExistingData = db.prepare('SELECT COUNT(*) as count FROM OrderDetails').get();

    if (checkExistingData.count === 0) {
        const stmt = db.prepare(queries.insertOrderDetailStatement);

        dummyData.orderDetailsData.forEach(({orderId, productId, quantity}) => {
            stmt.run(orderId, productId, quantity);
        });

        console.log('Dummy order details data inserted into the OrderDetails table.');
    } else {
        console.log('OrderDetails table already contains data. Skipping insertion.');
    }
}

function insertRMAData() {
    const checkExistingData = db.prepare('SELECT COUNT(*) as count FROM RMA').get();

    if (checkExistingData.count === 0) {
        const stmt = db.prepare(queries.insertRMAStatement);

        dummyData.rmaData.forEach(({
                                       orderId, customerId, createdDate, status, collectorId, controllerId
                                   }) => {
            stmt.run(orderId, customerId, createdDate, status, collectorId, controllerId);
        });

        console.log('Dummy RMA data inserted into the RMA table.');
    } else {
        console.log('RMA table already contains data. Skipping insertion.');
    }
}

function insertRMADetailsData() {
    const checkExistingData = db.prepare('SELECT COUNT(*) as count FROM RMAItem').get();

    if (checkExistingData.count === 0) {
        const stmt = db.prepare(queries.insertRMAItemStatement);

        dummyData.rmaItemData.forEach(({rmaId, productId, productStatus, processStatus, damageDescription, damageImage}) => {
            try {
                stmt.run(rmaId, productId, productStatus, processStatus, damageDescription, damageImage);
            } catch (error) {
                console.error("SQLite Error:", error.message);
            }

        });

        console.log('Dummy RMAItem data inserted into the RMAItem table.');
    } else {
        console.log('RMAItem table already contains data. Skipping insertion.');
    }
}

export function createRMATable() {
    const stmt = db.prepare(queries.createRMATableStatement);
    stmt.run();
}


export function selectAllRMAs() {
    const rmas = db.prepare(queries.selectAllRMAsStatement).all();

    for (const rma of rmas) {
        rma.items = db.prepare(queries.selectRMAItemByRMAId).all(rma.rmaId);
    }

    return rmas;
}

export function selectDamageImageByRMAItemID(rmaItemId) {
    try {
        const query = `
            SELECT DamageImage
            FROM RMAItem
            WHERE RMAItemID = ?`;
        const stmt = db.prepare(query);
        const result = stmt.get(rmaItemId);

        return result ? result.DamageImage : null;
    } catch (error) {
        console.error('Error fetching DamageImage:', error);
        return null;
    }
}

export function selectRMAById(rmaId) {
    return db.prepare(queries.selectRMAByIdStatement).get(rmaId);
}

export async function getUsernameByUserId(userId) {
    return db.prepare(queries.getUsernameByUserId).get(userId);
}

export function selectRMAsByUserId(userId) {
    const rmas = db.prepare(queries.selectRMAsByUserId).all(userId);
    rmas.map(el => {
        el.items = db.prepare(queries.selectRMAItemByRMAId).all(el.rmaId);
    })
    return rmas
}

export async function insertRMA(orderId, customerId, createdDate, status, collectorId, controllerId) {
    const stmt = db.prepare(queries.insertRMAStatement);
    const result = await stmt.run(orderId, customerId, createdDate, status, collectorId, controllerId);

    if (result.changes) {
        const insertedRowId = result.lastInsertRowid;
        return await db.prepare("SELECT * FROM RMA WHERE rmaId = ?").get(insertedRowId);
    }
}

export async function updateRMA(rmaId, orderId, customerId, createdDate, status, collectorId, controllerId) {
    try {
        const stmt = db.prepare(queries.updateRMAStatement);
        const result = await stmt.run(orderId, customerId, createdDate, status, collectorId, controllerId, rmaId);
        const recordUpdated = result.changes > 0;

        if (!recordUpdated) {
            console.error(`No records updated for RMA with ID ${rmaId}`);
        }

        return recordUpdated;
    } catch (error) {
        console.error('Error updating RMA:', error);
        throw error; // Rethrow the error to handle it in the calling function
    }
}

export async function deleteRMA(rmaId) {
    const deleteRmaStmt = db.prepare(queries.deleteRMAStatement);
    const deleteRmaItemsStmt = db.prepare(queries.deleteRMAItemsByIdStatement);
    await deleteRmaItemsStmt.run(rmaId);
    const result = await deleteRmaStmt.run(rmaId);
    recordDeleted = result.changes > 0;
}


// RMAItem
export async function createRMAItemTable() {
    const stmt = db.prepare(queries.createRMAItemTableStatement);
    await stmt.run();
}

export function selectAllRMAItems() {
    const stmt = db.prepare(queries.selectAllRMAItemsStatement);
    return stmt.all();
}

export function selectRMAItemById(rmaItemId) {
    const stmt = db.prepare(queries.selectRMAItemByIdStatement);
    return stmt.get(rmaItemId);
}

export async function selectRMAByCollectorIdAndNotFinished(userId) {
    const stmt = db.prepare(queries.selectRMAsByCollectorIdAndNotFinished);
    return await stmt.get(userId);
}

export async function selectRMAByControllerIdAndNotFinished(userId) {
    const stmt = db.prepare(queries.selectRMAsByControllerIdAndNotFinished);
    return await stmt.get(userId);
}

export function selectRMAItemsForReturn(rmaId) {
    return db.prepare(queries.selectRMAItemByRMAId).all(rmaId);
}

export async function selectRMAItemByCustomerId(customerId) {
    const stmt = db.prepare(queries.selectRMAItemByCustomerId);
    return await stmt.get(customerId);
}

export function selectRMAItemsByUserIdAndReturnId(userId, returnId) {
    return db.prepare(queries.selectRMAItemsByUserIdAndReturnId).all(userId, returnId);
}

export async function insertRMAItem(rmaId, productId, productStatus, processStatus, damageDescription, damageImage) {
    const stmt = db.prepare(queries.insertRMAItemStatement);
    const result = await stmt.run(rmaId, productId, productStatus, processStatus, damageDescription, damageImage);

    if (result.changes) {
        const insertedRowId = result.lastInsertRowid;
        return await db.prepare("SELECT * FROM RMAItem WHERE rmaItemId = ?").get(insertedRowId);
    }
}

export function updateRMAItem(rmaItemId, rmaId, productId, productStatus, processStatus, damageDescription, damageImage) {
    const stmt = db.prepare(queries.updateRMAItemStatement);
    const result = stmt.run(rmaId, productId, productStatus, processStatus, damageDescription, damageImage, rmaItemId);
    recordUpdated = result.changes > 0;
}

export function deleteRMAItem(RMAItemID) {
    const stmt = db.prepare(queries.deleteRMAItemStatement);
    const result = stmt.run(RMAItemID);
    recordDeleted = result.changes > 0;
}

// User
export async function createUserTable() {
    const stmt = db.prepare(queries.createUserTableStatement);
    await stmt.run();
}

export async function selectAllUsers() {
    const stmt = db.prepare(queries.selectAllUsersStatement);
    return await stmt.all();
}

export async function getUsersByRole(roleId) {
    const stmt = db.prepare(queries.selectUsersByRole);
    return await stmt.all(roleId);
}
export async function getEmployees() {
    const employeeRoles = [1, 3, 4];
    const stmt = db.prepare(queries.selectUsersByRole);

    const employees = [];

    for (const roleId of employeeRoles) {
        const result = await stmt.all(roleId);
        employees.push(...result);
    }

    return employees;
}
export async function getCustomers() {
    const customerRole = 2;
    const stmt = db.prepare(queries.selectUsersByRole);
    const customers = await stmt.all(customerRole);
    return customers;
}

export async function selectUserById(userId) {
    const stmt = db.prepare(queries.selectUserByIdStatement);
    return await stmt.get(userId);
}

export async function selectUserByUsername(username) {
    const stmt = db.prepare(queries.selectUserByUsername);
    return await stmt.get(username)
}

export function insertUser(Username, Password, Role, Email) {
    const stmt = db.prepare(queries.insertUserStatement);
    const result = stmt.run(Username, Password, Role, Email);
    lastInsertedId = result.lastInsertRowId;
}

export async function updateUser(userId, Username, Password, Role, Email) {
    const stmt = db.prepare(queries.updateUserStatement);
    const result = await stmt.run(Username, Password, Role, Email, userId);
    recordUpdated = result.changes > 0;
}
export async function updateUserEmailUsernameRole(username, email, extractedRoleId, userId){
    const stmt = db.prepare(queries.updateUserStatementUsernameEmailRole);
    const result = await stmt.run(username, email, extractedRoleId, userId);
    recordUpdated = result.changes > 0;
}

export async function deleteUser(userId) {
    const stmt = db.prepare(queries.deleteUserStatement);
    const result = await stmt.run(userId);
    recordDeleted = result.changes > 0;
}

//Products
export function selectAllProducts() {
    try {
        const stmt = db.prepare(queries.selectAllProductsStatement);
        return stmt.all();
    } catch (error) {
        console.error('Error fetching Products:', error);
        return [];
    }
}

export async function selectProductById(productId) {
    try {
        const stmt = db.prepare(queries.selectProductByIdStatement);
        return await stmt.get(productId);
    } catch (error) {
        console.error('Error fetching Product:', error);
    }
}

export async function createProduct(product) {
    try {
        const stmt = db.prepare(queries.insertProductStatement);

        const result = await stmt.run(product.name, product.description, product.price, product.stockQuantity, product.isFoodItem);
        return result.lastInsertRowId;
    } catch (error) {
        console.error('Error creating product in the database:', error);
        throw error;
    }
}

export async function updateProductById(productId, updatedFields) {
    try {
        const {name, description, price, stockQuantity, isFoodItem} = updatedFields;
        const stmt = db.prepare(queries.updateProductStatement);
        await stmt.run(name, description, price, stockQuantity, isFoodItem, productId);
        return productId; // Indicates success

    } catch (error) {
        console.error('Error updating Product:', error);
        return false; // Indicates failure
    }
}

export async function deleteProductById(productId) {
    try {
        const stmt = db.prepare(queries.deleteProductStatement);
        await stmt.run(productId);
    } catch (error) {
        console.error('Error deleting product by ID:', error);
        throw error;
    }
}

// Role
export function createRoleTable() {
    const stmt = db.prepare(queries.createRoleTableStatement);
    return stmt.run();
}

export async function selectAllRoles() {
    const stmt = db.prepare(queries.selectAllRolesStatement);
    return await stmt.all();
}

export async function selectRoleById(RoleID) {
    const stmt = db.prepare(queries.selectRoleByIdStatement);
    return await stmt.get(RoleID);
}
export async function selectRoleIDByRoleName(roleName) {
    const stmt = db.prepare(queries.selectRoleIdByRoleName);
    return await stmt.get(roleName);
}

export async function insertRole(RoleName) {
    const stmt = db.prepare(queries.insertRoleStatement);
    const result = await stmt.run(RoleName);
    lastInsertedId = result.lastInsertRowId;
}

export async function updateRole(RoleID, RoleName) {
    const stmt = db.prepare(queries.updateRoleStatement);
    const result = await stmt.run(RoleName, RoleID);
    recordUpdated = result.changes > 0;
}

export async function deleteRole(RoleID) {
    const stmt = db.prepare(queries.deleteRoleStatement);
    const result = await stmt.run(RoleID);
    recordDeleted = result.changes > 0;
}

// Order
export async function createOrderTable() {
    const stmt = db.prepare(queries.createOrderTableStatement);
    await stmt.run();
}

export async function selectAllOrders() {
    const stmt = db.prepare(queries.selectAllOrdersStatement);
    return await stmt.all();
}

export async function selectOrderById(orderId) {
    const ordersStmt = db.prepare(queries.selectOrderByIdStatement);
    const detailsStmt = db.prepare(queries.selectOrderDetailByOrderIdStatement);
    const order = await ordersStmt.get(orderId);
    order.items = await detailsStmt.all(order.orderId);
    return order;
}

export async function selectOrdersByCustomerId(customerId) {
    const ordersStmt = db.prepare(queries.selectOrderByCustomerId);
    const detailsStmt = db.prepare(queries.selectOrderDetailByOrderIdStatement);
    const orders = await ordersStmt.all(customerId);
    for (const order of orders) {
        order.items = await detailsStmt.all(order.orderId);
    }
    return orders;
}
export async function selectOrderNumberByCustomerId(customerId){
    const orderStmt = db.prepare(queries.selectOrderNumberByCustomerId)
    const result = await orderStmt.run(customerId)
    return result
}

export async function insertOrder(customerId, OrderDate, TotalAmount) {
    const stmt = db.prepare(queries.insertOrderStatement);
    const result = await stmt.run(customerId, OrderDate, TotalAmount);
    lastInsertedId = result.lastInsertRowId;
}

export async function updateOrder(orderId, customerId, OrderDate, TotalAmount) {
    const stmt = db.prepare(queries.updateOrderStatement);
    const result = await stmt.run(customerId, OrderDate, TotalAmount, orderId);
    recordUpdated = result.changes > 0;
}

export async function deleteOrder(orderId) {
    const stmt = db.prepare(queries.deleteOrderStatement);
    const result = await stmt.run(orderId);
    recordDeleted = result.changes > 0;
}

// OrderDetails
export async function createOrderDetailsTable() {
    const stmt = db.prepare(queries.createOrderDetailsTableStatement);
    await stmt.run();
}

export async function selectAllOrderDetails() {
    const stmt = db.prepare(queries.selectAllOrderDetailsStatement);
    return await stmt.all();
}

export async function selectOrderDetailById(OrderDetailID) {
    const stmt = db.prepare(queries.selectOrderDetailByIdStatement);
    return await stmt.get(OrderDetailID);
}

export async function selectOrderDetailsByOrderId(OrderId) {
    const stmt = db.prepare(queries.selectOrderDetailByOrderIdStatement);
    return await stmt.all(OrderId);
}

export async function insertOrderDetail(orderId, productId, Quantity, Subtotal) {
    const stmt = db.prepare(queries.insertOrderDetailStatement);
    const result = await stmt.run(orderId, productId, Quantity, Subtotal);
    lastInsertedId = result.lastInsertRowId;
}

export async function updateOrderDetail(OrderDetailID, orderId, productId, Quantity, Subtotal) {
    const stmt = db.prepare(queries.updateOrderDetailStatement);
    const result = await stmt.run(orderId, productId, Quantity, Subtotal, OrderDetailID);
    recordUpdated = result.changes > 0;
}

export async function deleteOrderDetail(OrderDetailID) {
    const stmt = db.prepare(queries.deleteOrderDetailStatement);
    const result = await stmt.run(OrderDetailID);
    recordDeleted = result.changes > 0;
}

export function getLastInsertedId() {
    return lastInsertedId;
}

export function isRecordUpdated() {
    return recordUpdated;
}

export function isRecordDeleted() {
    return recordDeleted;
}