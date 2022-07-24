/* eslint-disable */

import {OrganizationConfig} from "@/models/Config.model";
import {GitOrganization} from "@/models/Git.model";

export default class GitService {

    async getOrganization(orgInfo: OrganizationConfig): GitOrganization {}

}