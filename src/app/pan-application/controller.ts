import { ApiUrl } from "@/config/api/apiUrls";
import httpRequest from "@/config/api/AxiosInterseptor";

export type PancardPayload = {
  id: string;
  assementyear: string;
  everify: string;
  name: string;
  father_name: string;
  dob: string;
  taxpayble: string;
  account_number: string;
  ifsc: string;
  panno: string;
  mobile: string;
  adhaarno: string;
  itrcharge: string;
  everifyt: string;
  itr_fee: string;
  payable_tax_fee: string;
  olt_itr_fee: string;
  totalamt: string;
  proof: string;
  itr_application: string;
  message: string;
};

export class PancardApis {
  async addPancard(body: Partial<PancardPayload>) {
    const { data } = await httpRequest.post(ApiUrl.PANCARD_ADD_URL, body);
    return data;
  }

  async editPancard({
    body,
    id,
  }: {
    body: Partial<PancardPayload>;
    id: string;
  }) {
    const { data } = await httpRequest.post(
      `${ApiUrl.PANCARD_EDIT_URL}/${id}`,
      body,
    );
    return data;
  }
}
