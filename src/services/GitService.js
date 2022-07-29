/* eslint-disable */

import {OrganizationConfig} from "@/models/Config.model";
import {GitOrganization, GitUser} from "@/models/Git.model";

export default class GitService {

    getSelfUser(): GitUser {}

    async getOrganization(orgInfo: OrganizationConfig): GitOrganization {}

}