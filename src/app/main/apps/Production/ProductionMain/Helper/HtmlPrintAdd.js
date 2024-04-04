import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import handleError from "app/main/ErrorComponent/ErrorComponent";

export const HtmlPrintAddApi = (
  dispatch,
  printedContent,
  printObj,
  print_html_two
) => {
  const acArr = [];
  printObj.map((temp) => {
    acArr.push(temp.activityNumber);
  });
  const body = {
    activityNumber: acArr,
    // print_html : printedContent
  };
  if (print_html_two === "print_html_two") {
    body.print_html_two = printedContent;
  } else {
    body.print_html = printedContent;
  }
  axios
    .put(
      Config.getCommonUrl() +
        `api/productionOrder/printHtml/productionLog/edit`,
      body
    )
    .then(function (response) {
      if (response.data.success) {
        console.log(response.data.data);
      } else {
        dispatch(
          Actions.showMessage({
            message: response.data.message,
            variant: "error",
          })
        );
      }
    })
    .catch((error) => {
      handleError(error, dispatch, {
        api: `api/productionOrder/printHtml/productionLog/edit`,
        body,
      });
    });
};
