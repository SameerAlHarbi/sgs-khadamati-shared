const { URL } = require('url');
const fetch = require('node-fetch');

module.exports = class ApiClient {

    constructor (baseAddress, port) {
        this.baseAddress = baseAddress;
        this.port = port;
    }

    getURL(pathName = '', searchParams = null) {

        const url  = new URL(pathName, this.baseAddress);
        url.port = this.port;
    
        if(searchParams) {
            url.search = new URLSearchParams(searchParams);
        }
    
        return url;
    }

    async getData(pathName = '', searchParams = {}) {

        try {

            const apiUrl = this.getURL(pathName, searchParams);
            const response = await fetch(apiUrl);
    
            if (response.ok) {
                return await response.json();
            } else if(response.status === 404) {
                return null;
            }
    
            throw new Error('Error , status : ' + response.status + ' - text : ' + response.statusText);
            
        } catch(e) {
            throw e;
        }
    }

}