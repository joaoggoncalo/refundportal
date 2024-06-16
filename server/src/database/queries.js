// RMA
export const createRMATableStatement = `
    CREATE TABLE IF NOT EXISTS RMA
    (
        rmaId
        INTEGER
        PRIMARY
        KEY
        AUTOINCREMENT,
        orderId
        INTEGER,
        customerId
        INTEGER,
        createdDate
        TEXT,
        status
        TEXT,
        collectorId
        INTEGER,
        controllerId
        INTEGER,
        FOREIGN
        KEY
    (
        orderId
    ) REFERENCES "Order"
    (
        orderId
    ),
        FOREIGN KEY
    (
        customerId
    ) REFERENCES User
    (
        userId
    ),
        FOREIGN KEY
    (
        collectorId
    ) REFERENCES User
    (
        userId
    ),
        FOREIGN KEY
    (
        controllerId
    ) REFERENCES User
    (
        userId
    )
        );
`;

export const selectAllRMAsStatement = `SELECT *
                                       FROM RMA`;

export const selectRMAByIdStatement = `SELECT *
                                       FROM RMA
                                       WHERE rmaId = ?`;
export const getUsernameByUserId = `SELECT username
                                    FROM User
                                    WHERE userId = ?`;

export const selectRMAsByUserId = `SELECT *
                                   FROM RMA
                                   WHERE customerId = ?`;
export const selectRMAsByCollectorIdAndNotFinished = `
    SELECT *
    FROM RMA
    WHERE collectorId = ?;
`;
export const selectRMAsByControllerIdAndNotFinished = `
    SELECT *
    FROM RMA
    WHERE controllerId = ?
      AND status NOT IN ('approved', 'rejected');
`;

export const insertRMAStatement = `
    INSERT INTO RMA (orderId, customerId, createdDate, status, collectorId, controllerId)
    VALUES (?, ?, ?, ?, ?, ?)
`;

export const updateRMAStatement = `
    UPDATE RMA
    SET orderId      = ?,
        customerId   = ?,
        createdDate  = ?,
        status       = ?,
        collectorId  = ?,
        controllerId = ?
    WHERE rmaId = ?
`;

export const deleteRMAStatement = `DELETE
                                   FROM RMA
                                   WHERE rmaId = ?`;

// RMAItem
export const createRMAItemTableStatement = `
    CREATE TABLE IF NOT EXISTS RMAItem
    (
        rmaItemId
        INTEGER
        PRIMARY
        KEY
        AUTOINCREMENT,
        rmaId
        INTEGER,
        productId
        INTEGER,
        productStatus
        TEXT,
        processStatus
        TEXT,
        damageDescription
        TEXT,
        damageImage
        TEXT,
        FOREIGN
        KEY
    (
        rmaId
    ) REFERENCES RMA
    (
        rmaId
    ),
        FOREIGN KEY
    (
        productId
    ) REFERENCES Product
    (
        productId
    )
        );
`;

export const selectAllRMAItemsStatement = `SELECT *
                                           FROM RMAItem`;

export const selectRMAItemByIdStatement = `SELECT *
                                           FROM RMAItem
                                           WHERE rmaItemId = ?`;

export const selectRMAItemByRMAId = `SELECT *
                                     FROM RMAItem
                                              INNER JOIN Product ON RMAItem.productId = Product.productId
                                     WHERE RMAItem.rmaId = ?`

export const selectRMAItemsByUserIdAndReturnId = `SELECT *
                                                  FROM RMAItem
                                                           INNER JOIN RMA ON RMAItem.rmaId = RMA.rmaId
                                                  WHERE RMA.customerId = ?
                                                    AND RMA.rmaId = ?`;

export const insertRMAItemStatement = `
    INSERT INTO RMAItem (rmaId, productId, productStatus, processStatus, damageDescription, damageImage)
    VALUES (?, ?, ?, ?, ?, ?)`;

export const dropRMAItemStatement = `
    DROP TABLE IF EXISTS RMAItem`;

export const updateRMAItemStatement = `
    UPDATE RMAItem
    SET rmaId             = ?,
        productId         = ?,
        productStatus     = ?,
        processStatus     = ?,
        damageDescription = ?,
        damageImage       = ?
    WHERE rmaItemId = ?
`;

export const deleteRMAItemStatement = `DELETE
                                       FROM RMAItem
                                       WHERE rmaItemId = ?`;

export const deleteRMAItemsByIdStatement = `DELETE
                                            FROM RMAItem
                                            WHERE rmaId = ?`;

// User
export const createUserTableStatement = `
    CREATE TABLE IF NOT EXISTS User
    (
        userId
        INTEGER
        PRIMARY
        KEY
        AUTOINCREMENT,
        username
        TEXT,
        password
        TEXT,
        role
        INTEGER,
        email
        TEXT,
        FOREIGN
        KEY
    (
        role
    ) REFERENCES Role
    (
        roleID
    )
        );
`;

export const selectAllUsersStatement = `SELECT *
                                        FROM User`;
export const selectUsersByRole = `SELECT userId, username, role, email
                                  FROM User
                                  WHERE role = ?`;

export const selectUserByIdStatement = `SELECT *
                                        FROM User
                                        WHERE userId = ?`;
export const selectUserByUsername = `SELECT *
                                     FROM User
                                     WHERE username = ?`;

export const insertUserStatement = `
    INSERT INTO User (username, password, role, email)
    VALUES (?, ?, ?, ?)
`;

export const updateUserStatement = `
    UPDATE User
    SET username = ?,
        password = ?,
        role     = ?,
        email    = ?
    WHERE userId = ?
`;
export const updateUserStatementUsernameEmailRole = `
    UPDATE User
    SET username = ?,
        email    = ?,
        role     = ?
    WHERE userId = ?
`;

export const deleteUserStatement = `DELETE
                                    FROM User
                                    WHERE userId = ?`;

// Product
export const createProductTableStatement = `
    CREATE TABLE IF NOT EXISTS Product
    (
        productId
        INTEGER
        PRIMARY
        KEY
        AUTOINCREMENT,
        name
        TEXT,
        description
        TEXT,
        price
        REAL,
        stockQuantity
        INTEGER,
        isFoodItem
        INTEGER
    );
`;

export const selectAllProductsStatement = `SELECT *
                                           FROM Product`;

export const selectProductByIdStatement = `SELECT *
                                           FROM Product
                                           WHERE productId = ?`;

export const insertProductStatement = `
    INSERT INTO Product (name, description, price, stockQuantity, isFoodItem)
    VALUES (?, ?, ?, ?, ?)
`;

export const updateProductStatement = `
    UPDATE Product
    SET Name          = ?,
        Description   = ?,
        Price         = ?,
        StockQuantity = ?,
        IsFoodItem    = ?
    WHERE productId = ?
`;

export const deleteProductStatement = `DELETE
                                       FROM Product
                                       WHERE productId = ?`;

// Role
export const createRoleTableStatement = `
    CREATE TABLE IF NOT EXISTS Role
    (
        roleID
        INTEGER
        PRIMARY
        KEY
        AUTOINCREMENT,
        roleName
        TEXT
    );
`;

export const selectAllRolesStatement = `SELECT *
                                        FROM Role`;

export const selectRoleByIdStatement = `SELECT *
                                        FROM Role
                                        WHERE roleID = ?`;
export const selectRoleIdByRoleName = `SELECT roleID
                                        FROM Role
                                        WHERE roleName = ?`;

export const insertRoleStatement = `
    INSERT INTO Role (roleName)
    VALUES (?)
`;

export const updateRoleStatement = `
    UPDATE Role
    SET roleName = ?
    WHERE roleID = ?
`;

export const deleteRoleStatement = `DELETE
                                    FROM Role
                                    WHERE roleID = ?`;

// Order
export const createOrderTableStatement = `
    CREATE TABLE IF NOT EXISTS "Order"
    (
        orderId
        INTEGER
        PRIMARY
        KEY
        AUTOINCREMENT,
        customerId
        INTEGER,
        orderDate
        TEXT,
        FOREIGN
        KEY
    (
        customerId
    ) REFERENCES User
    (
        userId
    )
        );
`;

export const selectAllOrdersStatement = `SELECT *
                                         FROM "Order"`;

export const selectOrderByIdStatement = ` SELECT *
                                          FROM "Order"
                                          WHERE orderId = ?;`;
export const selectOrderByCustomerId = ` SELECT *
                                         FROM "Order"
                                         WHERE customerId = ?;`
export const selectOrderNumberByCustomerId = ` SELECT orderId
                                         FROM "Order"
                                         WHERE customerId = ?;`

export const insertOrderStatement = `
    INSERT INTO "Order" (customerId, orderDate)
    VALUES (?, ?)
`;

export const updateOrderStatement = `
    UPDATE "Order"
    SET customerId = ?,
        orderDate  = ?
    WHERE orderId = ?
`;

export const deleteOrderStatement = `DELETE
                                     FROM "Order"
                                     WHERE orderId = ?`;

// OrderDetails
export const createOrderDetailsTableStatement = `
    CREATE TABLE IF NOT EXISTS OrderDetails
    (
        orderDetailId
        INTEGER
        PRIMARY
        KEY
        AUTOINCREMENT,
        orderId
        INTEGER,
        productId
        INTEGER,
        quantity
        INTEGER,
        FOREIGN
        KEY
    (
        orderId
    ) REFERENCES "Order"
    (
        orderId
    ),
        FOREIGN KEY
    (
        productId
    ) REFERENCES Product
    (
        productId
    )
        );
`;

export const selectAllOrderDetailsStatement = `SELECT *
                                               FROM OrderDetails`;

export const selectOrderDetailByIdStatement = `SELECT *
                                               FROM OrderDetails
                                               WHERE orderDetailId = ?`;

export const selectOrderDetailByOrderIdStatement = `SELECT od.orderDetailId,
                                                           od.orderId,
                                                           od.productId,
                                                           od.quantity,
                                                           p.name,
                                                           p.description,
                                                           p.price,
                                                           p.stockQuantity,
                                                           p.isFoodItem
                                                    FROM OrderDetails AS od
                                                             INNER JOIN
                                                         Product AS p ON od.productId = p.productId
                                                    WHERE od.orderId = ?;`;

export const insertOrderDetailStatement = `
    INSERT INTO OrderDetails (orderId, productId, quantity)
    VALUES (?, ?, ?)
`;

export const updateOrderDetailStatement = `
    UPDATE OrderDetails
    SET orderId   = ?,
        productId = ?,
        quantity  = ?
    WHERE orderDetailId = ?
`;

export const deleteOrderDetailStatement = `DELETE
                                           FROM OrderDetails
                                           WHERE orderDetailId = ?`;


