import { ApiUrl } from "@/config/api/apiUrls";
import httpRequest from "@/config/api/AxiosInterseptor";

export interface CreateRetailerPayload {
  name: string;
  shop_name?: string;
  register_pin: string;
  email: string;
  password: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  pan_no?: string;
  aadhar_no?: string;
  role: string;
}

export class RetailerController {
  async getActiveRetailerUsers() {
    const response = await httpRequest.get(`${ApiUrl.RETAILOR_URL}/1`);
    return response?.data?.data ?? response?.data ?? [];
  }

  async createRetailer(payload: CreateRetailerPayload) {
    const response = await httpRequest.post(
      `${ApiUrl.REGISTER_URL}?referral_id=3`,
      payload,
    );
    return response?.data;
  }
}
