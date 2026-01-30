import httpRequest from "@/config/api/AxiosInterseptor";

export type PriceListPayload = {
  filledcomplete: number;
  pnamount: number;
  convfees: number;
  deliveryfees: number;
  agency_type_nsdl: number;
  affidavitproffatached: number;
  notaryproffatached: number;
  totalamountpancard: number;
  deliverinshop: number;
  itrcharge: number;
  everify: number;
  pvccharge: number;
  gstcharge: number;
  aadharcardaddress: number;
  olditr: number;
  mpmla: number;
  findpancard: number;
  findaadharcard: number;
};

export class PriceListController {
  async getPriceList() {
    const { data } = await httpRequest.get("https://dyementor.com/main/api/pricelist");
    return data;
  }

  async updatePriceList(body: PriceListPayload) {
    const { data } = await httpRequest.put(
      "https://dyementor.com/main/api/pricelist_update",
      body,
    );
    return data;
  }
}
