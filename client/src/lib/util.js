import {sessionTimeout, token, user} from "../store.js";
import page from "page"

export const roles = ["Admin", "Customer", "Controller", "Collector"]
export const nameToRole = {
    "Admin": 1, "Customer": 2, "Controller": 3, "Collector": 4
}

export const roleToName = {
    1: "Admin", 2: "Customer", 3: "Controller", 4: "Collector"
}

export const fetchData = async (url, auth) => {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + auth
        }
    });

    if (!response.ok) {
        throw new Error('Fetch failed. Status ' + response.status + '. Message' + response.statusMessage);
    }

    return await response.json();
}

export const postData = async (url, auth, body) => {
    if (body) body = JSON.stringify(body)
    const response = await fetch(url, {
        method: "POST",
        body: body,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + auth
        }
    });

    return await response.json();
}

export const patchData = async (url, auth, body) => {
    if (body) body = JSON.stringify(body)
    const response = await fetch(url, {
        method: "PATCH",
        body: body,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + auth
        }
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error('Fetch failed. Status ' + response.status + '. Message' + error.error);
    }


    return await response.json();
}

export const deleteData = async (url, auth) => {
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + auth
        }
    });

    if (!response.ok) {
        throw new Error('Delete failed. Status ' + response.status + '. Message' + response.statusMessage);
    }

    return await response.json();
}

export const logOut = () => {
    token.set("");
    user.set("");
    sessionStorage.setItem("token", "");
    sessionStorage.setItem("user", "");
    page.redirect("../login")
}

export const timeOut = () => {
    const timeoutDuration = 2 * 60 * 60 * 1000; // 2 hours
    sessionTimeout.set(null);

    const resetSessionTimeout = () => {
        sessionTimeout.set(setTimeout(() => {
            console.log('User logged out due to inactivity.');
            logOut();
            page.redirect("../login")
        }, timeoutDuration));
    };

    resetSessionTimeout();


}


export const changeRmaStatus = async (status, rmaNumber, token) => {
    try {
        const response = await fetch(`http://localhost:3000/returns/${rmaNumber}`);

        if (response.ok) {
            try {
                const resultReturn = await response.json();
                if (resultReturn) {
                    let payload = resultReturn;
                    payload.status = status;
                    await patchData(`http://localhost:3000/returns/${rmaNumber}`, token, payload);

                }
            } catch (error) {
                console.error('RMA API request failed:', response.status);
            }
        }
    } catch (error) {
        console.error('Error fetching rma: ', error);
    }
}