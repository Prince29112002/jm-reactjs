import React, { Component } from "react";
import { connect } from "react-redux";
import * as userActions from "app/auth/store/actions";
import { bindActionCreators } from "redux";
import * as Actions from "app/store/actions";
import jwtService from "app/services/jwtService";

class Auth extends Component {
  constructor(props) {
    super(props);

    this.jwtCheck();
  }

  jwtCheck = () => {
    jwtService.on("onAutoLogin", () => {
      const tempUser = {
        uuid: "XgbuVEXBU5gtSKdbQRP1Zbbby1i1",
        from: "custom-db",
        password: "admin",
        role: "admin",
        data: {
          displayName: localStorage.getItem("userName"),
          photoURL: "assets/images/avatars/Abbott.jpg",
          email: "admin",
          settings: {
            layout: {
              style: "layout1",
              config: {
                scroll: "content",
                navbar: {
                  display: true,
                  // folded  : true, to always open false, default is false
                  position: "left",
                },
                toolbar: {
                  display: true,
                  style: "fixed",
                  position: "above",
                },
                footer: {
                  display: true,
                  style: "fixed",
                  position: "below",
                },
                mode: "fullwidth",
              },
            },
            customScrollbars: false,
            theme: {
              main: "default",
              navbar: "default",
              toolbar: "default",
              footer: "default",
            },
          },
          shortcuts: ["calendar", "mail", "contacts"],
        },
      };
      this.props.setUserData(tempUser);
    });

    jwtService.on("onAutoLogout", (message) => {
      if (message) {
        // this.props.showMessage({message});
      }
      this.props.logout("Other", null);
    });

    jwtService.init();
  };

  render() {
    const { children } = this.props;

    return <React.Fragment>{children}</React.Fragment>;
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      logout: userActions.logoutUser,
      setUserData: userActions.setUserData,
      setUserDataAuth0: userActions.setUserDataAuth0,
      setUserDataFirebase: userActions.setUserDataFirebase,
      showMessage: Actions.showMessage,
      hideMessage: Actions.hideMessage,
    },
    dispatch
  );
}

export default connect(null, mapDispatchToProps)(Auth);
