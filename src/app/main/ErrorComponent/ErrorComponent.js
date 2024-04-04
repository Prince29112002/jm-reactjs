import * as Actions from "app/store/actions";
import * as authActions from "app/auth/store/actions";
import jwtService from "app/services/jwtService";

const handleError = (error, dispatchMethod, params) => {
  if (!error.response) {
    dispatchMethod(
      Actions.showMessage({ message: error.message, variant: "error" })
    );
  } else if (error.response.status === 400) {
    let msg = error.response.data.hasOwnProperty("error")
      ? Array.isArray(error.response.data.error)
        ? error.response.data.error[0].message
        : error.response.data.error.message
      : error.response.data.message;
    dispatchMethod(Actions.showMessage({ message: msg, variant: "error" }));
  } else if (error.response.status === 401) {
    let msg = error.response.data.hasOwnProperty("error")
      ? Array.isArray(error.response.data.error)
        ? error.response.data.error[0].message
        : error.response.data.error.message
      : error.response.data.message;

    dispatchMethod(
      Actions.showMessage({
        message: msg,
        variant: "error", // Array.isArray(error.response.data.error) ?  error.response.data.error[0].message :  error.response.data.error.message
      })
    );
    dispatchMethod(authActions.logoutUser("unauthorized", params));
  } else if (error.response.status === 404) {
    dispatchMethod(
      Actions.showMessage({ message: "Api Not Found", variant: "error" })
    );
  } else if (error.response.status === 409) {
    let msg = error.response.data.hasOwnProperty("error")
      ? Array.isArray(error.response.data.error)
        ? error.response.data.error[0].message
        : error.response.data.error.message
      : error.response.data.message;

    dispatchMethod(
      Actions.showMessage({
        message: msg,
        variant: "error", // Array.isArray(error.response.data.error) ?  error.response.data.error[0].message :  error.response.data.error.message
      })
    );
  } else if (error.response.status === 422) {
    // dispatchMethod(
    //     Actions.showMessage({ message: error.response.data.message })
    // );
    let msg = error.response.data.hasOwnProperty("error")
      ? Array.isArray(error.response.data.error)
        ? error.response.data.error[0].message
        : error.response.data.error.message
      : error.response.data.message;

    dispatchMethod(
      Actions.showMessage({
        message: msg,
        variant: "error", // Array.isArray(error.response.data.error) ?  error.response.data.error[0].message :  error.response.data.error.message
      })
    );
  } else if (error.response.status === 440) {
    //token expired
    // dispatchMethod(Actions.showMessage({ message: "Session Refreshed" ,variant:"error"}));
    jwtService.refreshtokenApi(dispatchMethod);
  } else if (error.response.status === 500) {
    let msg = error.response.data.hasOwnProperty("error")
      ? Array.isArray(error.response.data.error)
        ? error.response.data.error[0].message
        : error.response.data.error.message
      : error.response.data.message;
    dispatchMethod(
      Actions.showMessage({
        message: msg,
        variant: "error", // Array.isArray(error.response.data.error) ?  error.response.data.error[0].message :  error.response.data.error.message
      })
    );
  } else {
    let msg = error.response.data.hasOwnProperty("error")
      ? Array.isArray(error.response.data.error)
        ? error.response.data.error[0].message
        : error.response.data.error.message
      : error.response.data.message;
    dispatchMethod(
      Actions.showMessage({
        message: msg,
        variant: "error", // Array.isArray(error.response.data.error) ?  error.response.data.error[0].message :  error.response.data.error.message
      })
    );
  }
};

export default handleError;
