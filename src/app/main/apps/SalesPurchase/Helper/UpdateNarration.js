import axios from "axios";
import Config from "app/fuse-configs/Config";

export const UpdateNarration = async (body) => {

    const data = await axios.put(Config.getCommonUrl() + "api/admin/voucher", body)
    return data;

}