import bcrypt from "bcrypt";
import {format, subDays} from "date-fns";

const admin_password = await bcrypt.hash("1234", 10)
const customer_password = await bcrypt.hash("1234", 10)
const controller_password = await bcrypt.hash("1234", 10)
const collector_password = await bcrypt.hash("1234", 10)

export const productData = [
    {
        name: 'Wireless Gaming Mouse',
        description: 'High-performance mouse with customizable RGB lighting and programmable buttons.',
        price: 59.99,
        stockQuantity: 50,
        isFoodItem: 0
    },
    {
        name: 'Organic Green Tea',
        description: 'Premium loose-leaf green tea sourced from organic tea gardens in Japan.',
        price: 14.99,
        stockQuantity: 30,
        isFoodItem: 1
    },
    {
        name: 'Smart Home Security Camera',
        description: '1080p HD camera with motion detection and two-way audio for home monitoring.',
        price: 129.99,
        stockQuantity: 20,
        isFoodItem: 0
    },
    {
        name: 'Noise-Canceling Headphones',
        description: 'Over-ear headphones with active noise cancellation for an immersive audio experience.',
        price: 199.99,
        stockQuantity: 40,
        isFoodItem: 0
    },
    {
        name: 'Fitness Tracker Watch',
        description: 'Waterproof fitness tracker with heart rate monitoring and GPS functionality.',
        price: 79.99,
        stockQuantity: 60,
        isFoodItem: 0
    },
    {
        name: 'Stainless Steel Blender',
        description: 'Powerful blender for smoothies and shakes with durable stainless steel blades.',
        price: 89.99,
        stockQuantity: 25,
        isFoodItem: 0
    },
    {
        name: 'Designer Leather Wallet',
        description: 'Handcrafted leather wallet with multiple card slots and a sleek design.',
        price: 49.99,
        stockQuantity: 35,
        isFoodItem: 0
    },
    {
        name: '4K Ultra HD Smart TV',
        description: '65-inch smart TV with 4K resolution, HDR, and built-in streaming apps.',
        price: 799.99,
        stockQuantity: 45,
        isFoodItem: 0
    },
    {
        name: 'Professional Espresso Machine',
        description: 'Commercial-grade espresso machine with a built-in grinder and steam wand.',
        price: 499.99,
        stockQuantity: 55,
        isFoodItem: 0
    },
    {
        name: 'Luxury Fountain Pen',
        description: 'Elegant fountain pen with a gold nib and lacquered finish for a sophisticated writing experience.',
        price: 129.99,
        stockQuantity: 15,
        isFoodItem: 0
    },
    {
        name: 'Indoor Plants Set',
        description: 'Assortment of low-maintenance indoor plants in decorative pots for home decor.',
        price: 39.99,
        stockQuantity: 70,
        isFoodItem: 0
    },
    {
        name: 'Professional DSLR Camera',
        description: 'High-resolution DSLR camera with advanced autofocus and 4K video recording capabilities.',
        price: 1499.99,
        stockQuantity: 22,
        isFoodItem: 0
    },
    {
        name: 'Gourmet Chocolate Collection',
        description: 'Exquisite assortment of handcrafted chocolates made from premium cocoa beans.',
        price: 29.99,
        stockQuantity: 33,
        isFoodItem: 1
    },
    {
        name: 'Vintage Record Player',
        description: 'Classic record player with a wooden finish and built-in speakers for vinyl enthusiasts.',
        price: 299.99,
        stockQuantity: 18,
        isFoodItem: 0
    },
    {
        name: 'Leather Travel Backpack',
        description: 'Durable leather backpack with multiple compartments and a padded laptop sleeve for travelers.',
        price: 89.99,
        stockQuantity: 48,
        isFoodItem: 0
    },
];

export const roleData = [
    {roleName: 'admin'},
    {roleName: 'customer'},
    {roleName: 'controller'},
    {roleName: 'collector'}
];

export const userData = [
    {
        username: 'admin_user',
        password: admin_password,
        role: 1,  // admin role
        email: 'admin@example.com'
    },
    {
        username: 'customer_user',
        password: customer_password,
        role: 2,  // customer role
        email: 'customer@example.com'
    },
    {
        username: 'controller_user',
        password: controller_password,
        role: 3,  // controller role
        email: 'controller@example.com'
    },
    {
        username: 'collector_user',
        password: collector_password,
        role: 4,  // collector role
        email: 'collector@example.com'
    }, {
        username: 'collector_user2',
        password: collector_password,
        role: 4,  // collector role
        email: 'collector2@example.com'
    },
    {
        username: 'collector_user3',
        password: collector_password,
        role: 4,  // collector role
        email: 'collector3@example.com'
    },
    {
        username: 'controller_user2',
        password: controller_password,
        role: 3,  // controller role
        email: 'controller2@example.com'
    },{
        username: 'customer_user2',
        password: customer_password,
        role: 2,  // customer role
        email: 'customer2@example.com'
    }


];

export const orderData = [
    {
        customerId: 1,
        orderDate: '2023-12-01'
    },
    {
        customerId: 2,
        orderDate: format(new Date(), "yyyy-MM-dd")
    },
    {
        customerId: 3,
        orderDate: '2023-12-03'
    },
    {
        customerId: 4,
        orderDate: '2023-06-04'
    },
    {
        customerId: 2,
        orderDate: format(subDays(new Date(), 15), "yyyy-MM-dd")
    },
    {
        customerId: 2,
        orderDate: '2024-06-21'
    },
];

export const orderDetailsData = [
    // Order 1
    {orderId: 1, productId: 2, quantity: 3},
    {orderId: 1, productId: 6, quantity: 2},
    {orderId: 1, productId: 9, quantity: 1},

    // Order 2
    {orderId: 2, productId: 3, quantity: 1},

    // Order 3
    {orderId: 3, productId: 1, quantity: 2},
    {orderId: 3, productId: 5, quantity: 1},
    {orderId: 3, productId: 10, quantity: 3},

    // Order 4
    {orderId: 4, productId: 7, quantity: 1},

    // Order 5
    {orderId: 5, productId: 6, quantity: 2},
    {orderId: 5, productId: 3, quantity: 4},

    //Order 6
    {orderId: 6, productId: 1, quantity: 1},
    {orderId: 6, productId: 3, quantity: 1},
    {orderId: 6, productId: 4, quantity: 1},
    {orderId: 6, productId: 5, quantity: 1},
];

export const rmaData = [
    {
        orderId: 1,
        customerId: 2,
        createdDate: '2023-12-05',
        status: 'in transit',
        returnReason: 'Defective product',
        collectorId: null,
        controllerId: null,
    },
    {
        orderId: 3,
        customerId: 2,
        createdDate: '2023-12-06',
        status: 'received',
        returnReason: 'Changed mind',
        collectorId: 1,
        controllerId: null,
    },
    {
        orderId: 2,
        customerId: 2,
        createdDate: '2023-12-07',
        status: 'in transit',
        returnReason: 'No longer needed',
        collectorId: 4,
        controllerId: 3,
    },
    {
        orderId: 5,
        customerId: 3,
        createdDate: '2023-12-07',
        status: 'processed',
        returnReason: 'No longer needed',
        collectorId: 4,
        controllerId: 3,
    },
    {
        orderId: 4,
        customerId: 2,
        createdDate: '2023-12-07',
        status: 'in transit',
        returnReason: 'No longer needed',
        collectorId: 5,
        controllerId: 7,
    },
    {
        orderId: 6,
        customerId: 4,
        createdDate: '2024-01-21',
        status: 'in transit',
        returnReason: 'No longer needed',
        collectorId: null,
        controllerId: null,
    },
];
export const rmaItemData = [
    {
        rmaId: 1,
        productId: 3,
        productStatus: 'Available',
        processStatus: null,
        damageDescription: null,
        damageImage: null,
    },
    {
        rmaId: 2,
        productId: 9,
        productStatus: 'Missing',
        processStatus: null,
        damageDescription: 'Faulty power button',
        damageImage: null,
    },
    {
        rmaId: 2,
        productId: 6,
        productStatus: 'Damaged',
        processStatus: null,
        damageDescription: 'Blade broken',
        damageImage: 'https://www.cpsc.gov/s3fs-public/styles/recall_product/public/rp_LARGE_Blender%2520Broken%2520Blade%2520with%2520Piece.jpg?VersionId=2DRozaqyrgB1zVmgztIRQKpYf2JXTwaA&itok=f8YRcs9k'
    },
    {
        rmaId: 3,
        productId: 11,
        productStatus: 'Damaged',
        processStatus: null,
        damageDescription: 'missing accessories upon return',
        damageImage: 'https://www.independentliving.co.uk/wp-content/uploads/2022/07/pexels-cottonbro-6717606.jpg',
    },
    {
        rmaId: 4,
        productId: 7,
        productStatus: 'Available',
        processStatus: 'Declined',
        damageDescription: 'Only dust remains',
        damageImage: null,
    },
    {
        rmaId: 4,
        productId: 6,
        productStatus: 'Missing',
        processStatus: 'Declined',
        damageDescription: 'Scratched surface',
        damageImage: 'https://example.com/scratched-surface-image.jpg',
    },
    {
        rmaId: 4,
        productId: 1,
        productStatus: 'Missing',
        processStatus: 'Declined',
        damageDescription: '',
        damageImage: '',
    },
    {
        rmaId: 5,
        productId: 15,
        productStatus: 'Available',
        processStatus: null,
        damageDescription: 'Cracked screen',
        damageImage: 'https://example.com/cracked-screen-image.jpg',
    },
    {
        rmaId: 6,
        productId: 1,
        productStatus: null,
        processStatus: null,
        damageDescription: null,
        damageImage: null,
    },{
        rmaId: 6,
        productId: 3,
        productStatus: null,
        processStatus: null,
        damageDescription: null,
        damageImage: null,
    },{
        rmaId: 6,
        productId: 4,
        productStatus: null,
        processStatus: null,
        damageDescription: null,
        damageImage: null,
    },{
        rmaId: 6,
        productId: 5,
        productStatus: null,
        processStatus: null,
        damageDescription: null,
        damageImage: null,
    },

];