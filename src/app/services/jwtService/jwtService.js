import axios from "axios";
import jwtDecode from "jwt-decode";
import FuseUtils from "@fuse/FuseUtils";
import Config from "app/fuse-configs/Config";
import handleError from "app/main/ErrorComponent/ErrorComponent";

import * as authActions from "app/auth/store/actions";

class jwtService extends FuseUtils.EventEmitter {
  init() {
    this.handleAuthentication();
  }

  handleAuthentication = () => {
    let authToken = this.getAccessToken();
    if (!authToken) {
      return;
    }

    if (this.isAuthTokenValid(authToken)) {
      this.setSession(authToken, null, null);
      this.emit("onAutoLogin", true);
    } else {
      this.setSession(null, "invalid_internal_check", null);
      this.emit("onAutoLogout", "authToken expired");
    }
  };

  createUser = (data) => {
    return new Promise((resolve, reject) => {
      axios.post("/api/auth/register", data).then((response) => {
        if (response.data.user) {
          resolve(response.data.user);
        } else {
          reject(response.data.error);
        }
      });
    });
  };

  signInWithEmailAndPassword = (email, password) => {
    return new Promise((resolve, reject) => {
      axios
        .get("/api/auth", {
          data: {
            email,
            password,
          },
        })
        .then((response) => {
          if (response.data.user) {
            this.setSession(response.data.authToken, null, null);
            resolve(response.data.user);
          } else {
            reject(response.data.error);
          }
        });
    });
  };

  signInWithToken = () => {
    return new Promise((resolve, reject) => {
      axios
        .get("/api/auth/access-token", {
          data: {
            authToken: this.getAccessToken(),
          },
        })
        .then((response) => {
          if (response.data.user) {
            this.setSession(response.data.authToken, null, null);
            resolve(response.data.user);
          } else {
            reject(response.data.error);
          }
        });
    });
  };

  updateUserData = (user) => {
    return axios.post("/api/auth/user/update", {
      user: user,
    });
  };

  setSession = (authToken, type, params) => {
    const ipAddress = localStorage.getItem("ip");
    if (authToken) {
      localStorage.setItem("authToken", authToken);
      axios.defaults.headers.common["Authorization"] = "Bearer " + authToken;
      axios.defaults.headers.common["x-real-ip"] = ipAddress;
      axios.defaults.headers.common["x-forwarded-for"] = ipAddress;
    } else {
      let authTo = this.getAccessToken();
      const userId = localStorage.getItem("userId");
      this.logOutLogsAPI(authTo, userId, params, type);

      localStorage.removeItem("authToken");
      // delete axios.defaults.headers.common["Authorization"];
    }
  };

  setRefreshToken = (refreshtoken) => {
    localStorage.setItem("refreshToken", refreshtoken);
  }

  getRefreshToken = () => {
    return window.localStorage.getItem("refreshToken");
  }

  refreshtokenApi = (dispatchMethod) => {
    let data = {
      "refresh_token": this.getRefreshToken()
    };

    axios
      .post(Config.getCommonUrl() + "admin/token", data)
      .then((response) => {
        if (response.data.success === true) {
          this.setSession(response.data.authToken)
        }
      })
      .catch((error) => {
        dispatchMethod(authActions.logoutUser("token logout", null));

        handleError(error, dispatchMethod, {
          api: "admin/token",
          body: data,
        });
      });
  }

  logOutLogsAPI = (authToken, userId, params, type) => {
    // const dispatch = useDispatch();

    let data = {
      api_end_point: params?.api,
      user_id: userId,
      type: type,
      token: authToken,
      body: params?.hasOwnProperty("body") ? params.body : "",
    };

    axios
      .post(Config.getCommonUrl() + "api/logs/logout-logs", data)
      .then((response) => {
        if (response.data.success === true) {

        }
      })
      .catch((error) => {
        console.log(error);

      });
  };

  setNavigation = (navigation) => {
    // const navigation = window.localStorage.getItem("navigation");

    if (navigation) {
      localStorage.setItem("navigation", JSON.stringify(navigation));
    } else {
      localStorage.removeItem("navigation");
    }
  };

  getNavigation = () => {
    return JSON.parse(window.localStorage.getItem("navigation"));
  };

  setLayoutSettings = (settings) => {
    if (settings) {
      localStorage.setItem("settings", JSON.stringify(settings));
    } else {
      localStorage.removeItem("settings");
    }
  };

  getLayoutSettings = () => {
    return JSON.parse(window.localStorage.getItem("settings"));
  };

  logout = (type, params) => {
    this.setSession(null, type, params);
    localStorage.removeItem("SelectedDepartment")
    localStorage.removeItem("selDeptNm")
    localStorage.removeItem("userName")
    localStorage.removeItem("userId")
    localStorage.removeItem("isDesigner")
    localStorage.removeItem("permission")
    localStorage.removeItem("oppositeAccount")
    localStorage.removeItem("siteSetting")
    localStorage.removeItem("headingName")
    localStorage.removeItem("clientSelected")
    localStorage.removeItem("firmSelected")
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('navigation')
    localStorage.removeItem('allDepartments')
    localStorage.removeItem('settings')
    localStorage.removeItem('ip')
    localStorage.removeItem('isChainRetailer')
    localStorage.removeItem('isSchemeRetailer')
    localStorage.removeItem('isPasswordTwo')
    localStorage.removeItem('isSuperAdmin')
  };

  isAuthTokenValid = (authToken) => {
    if (!authToken) {
      return false;
    }
    const decoded = jwtDecode(authToken);
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn("access token expired");
      this.setSession(null, "invalid_internal_check", null);
      // history.push({
      //   pathname: "/login",
      // });
      this.emit("onAutoLogout", "authToken expired");
      return false;
    } else {
      return true;
    }
  };

  getAccessToken = () => {
    return window.localStorage.getItem("authToken");
  };
}

const instance = new jwtService();

export default instance;
