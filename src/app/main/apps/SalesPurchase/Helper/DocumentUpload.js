import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import handleError from "app/main/ErrorComponent/ErrorComponent";

export const callFileUploadApi = async (
  fileData,
  purchase_flag,
  purchase_flag_id
) => {
  const formData = new FormData();
  for (let i = 0; i < fileData.length; i++) {
    formData.append("files", fileData[i]);
  }
  formData.append("purchase_flag", purchase_flag);
  if (purchase_flag_id) {
    formData.append("purchase_flag_id", purchase_flag_id);
  }
  const body = formData;
  const data = await axios.post(
    Config.getCommonUrl() + "api/salespurchasedocs/upload",
    body
  );
  return data;

};
