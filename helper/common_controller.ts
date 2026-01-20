import { ApiUrl } from "@/config/api/apiUrls";
import httpRequest from "@/config/api/AxiosInterseptor";

export class CommonController {
  async uploadSingleImage(payload: any) {
    const formData = new FormData();
    formData.append("file", payload);
    const data = await httpRequest.post("", formData);
    return data?.data;
  }
  async deleteSingleImage(payload: string) {
    const data = await httpRequest.delete("");
    return data?.data;
  }
}
