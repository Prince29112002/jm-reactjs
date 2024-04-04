import axios from "axios";
import Config from "app/fuse-configs/Config";

export const UpdateRetailerNarration = async (body) => {

    const data = await axios.put(Config.getCommonUrl() + "retailerProduct/api/voucherentry/voucher/narration", body)
    return data;

}