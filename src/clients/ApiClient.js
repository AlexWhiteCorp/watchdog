import axios from "axios";

class ApiClient {

    constructor(clientClass, authHeader, baseUrl) {
        this.api = axios.create({
            baseURL: baseUrl,
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
            },
            timeout: 10000
        })

        this.api.interceptors.request.use(
            (config) => {
                const url = config.baseURL
                const method = config.method.toUpperCase()
                const path = config.url
                window.logger.debug(clientClass.name, `${method} ${url}${path}`)
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

}

export default ApiClient