import axios from "axios";

class ApiClient {

    constructor(clientClass, authHeader, baseUrl, headers) {
        const configHeaders = { ...headers }
        if(authHeader) configHeaders['Authorization'] = authHeader

        this.api = axios.create({
            baseURL: baseUrl,
            headers: configHeaders,
            timeout: 10000
        })

        /* istanbul ignore next */
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