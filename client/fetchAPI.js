const baseUrl = 'http://localhost:3000';

async function addReturnItem(returnItem) {
    const url = `${baseUrl}/return-items`;

    const formData = new FormData();
    formData.append('rmaId', returnItem.rmaId);
    formData.append('productId', returnItem.productId);
    formData.append('status', returnItem.status);
    formData.append('damageDescription', returnItem.damageDescription);
    formData.append('damageImage', returnItem.damageImage);

    const response = await fetch(url, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
    }

    return response.json();
}

async function getDamageImage(filename) {
    const url = `${baseUrl}/images/${filename}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    return response.blob();
}

async function notifyCustomerOfRefundStatus(customerId, productId, productStatus, processStatus, damageDescription, damageImage) {
    const url = `${baseUrl}/users/${customerId}/notifications`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, productStatus, processStatus, damageDescription, damageImage }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
    }

    return response.json();
}

export { addReturnItem, getDamageImage, notifyCustomerOfRefundStatus };
