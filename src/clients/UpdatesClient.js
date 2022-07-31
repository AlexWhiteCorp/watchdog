import ApiClient from "@/clients/ApiClient";

class UpdatesClient extends ApiClient {

    constructor(apiUrl) {
        super(UpdatesClient, null, apiUrl);
    }

    getLastVersions() {
        return this.api
            .get('/versions.json')
            .then(response => response.data)
    }

}

export default UpdatesClient