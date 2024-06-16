export default class DataService {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    fetchRMATableData() {
        return fetch(`${this.baseUrl}/returns`)
            .then(response => response.json())
            .catch(error => console.error('Error fetching RMA table data:', error));
    }

    fetchReturnItems(rmaId) {
        return fetch(`${this.baseUrl}/returns/${rmaId}/return-items`)
            .then(response => response.json())
            .catch(error => console.error('Error fetching return items:', error));
    }
}