import { ApiUrl } from "@/config/api/apiUrls"
import httpRequest from "@/config/api/AxiosInterseptor"

// ==========role apis =====================================//

interface addRole {
    name: string,
    is_active: boolean
}

export class RoleApis {
    async getRoleNames() {
        const { data } = await httpRequest.get(ApiUrl.ROLE_NAMES_URL)
        return data;
    }
    async AddRoleNames(body: addRole) {
        const { data } = await httpRequest.post(ApiUrl.ROLE_NAMES_URL, body)
        return data;
    }

    async editRoleNames({ body, id }: { body: addRole, id: string }) {
        const { data } = await httpRequest.put(`${ApiUrl.ROLE_NAMES_URL}/${id}`, body)
        return data;
    }

    async getRoleModules() {
        const { data } = await httpRequest.get(ApiUrl.ROLE_MODULES_URL)
        return data;
    }

}

