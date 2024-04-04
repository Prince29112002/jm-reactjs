import history from "@history";
import { setInitialSettings } from "app/store/actions/fuse";
import _ from "@lodash";
import store from "app/store";
import * as Actions from "app/store/actions";

import jwtService from "app/services/jwtService";

export const SET_USER_DATA = "[USER] SET DATA";
export const REMOVE_USER_DATA = "[USER] REMOVE DATA";
export const USER_LOGGED_OUT = "[USER] LOGGED OUT";


export function setUserDataAuth0(tokenData) {
  const user = {
    role: ["admin"],
    from: "auth0",
    data: {
      displayName: tokenData.username,
      photoURL: tokenData.picture,
      email: tokenData.email,
      settings:
        tokenData.user_metadata && tokenData.user_metadata.settings
          ? tokenData.user_metadata.settings
          : {},
      shortcuts:
        tokenData.user_metadata && tokenData.user_metadata.shortcuts
          ? tokenData.user_metadata.shortcuts
          : [],
    },
  };

  return setUserData(user);
}

/**
 * Set user data from Firebase data
 */
export function setUserDataFirebase(user, authUser) {
  if (
    user &&
    user.data &&
    user.data.settings &&
    user.data.settings.theme &&
    user.data.settings.layout &&
    user.data.settings.layout.style
  ) {
    // Set user data but do not update
    return setUserData(user);
  } else {
    // Create missing user settings
    return createUserSettingsFirebase(authUser);
  }
}

/**
 * Create User Settings with Firebase data
 */
export function createUserSettingsFirebase(authUser) {
  return (dispatch, getState) => {
    const guestUser = getState().auth.user;
    const fuseDefaultSettings = getState().fuse.settings.defaults;
    // const currentUser = firebase.auth().currentUser;

 
    const user = _.merge({}, guestUser, {
      uid: authUser.uid,
      from: "firebase",
      role: ["admin"],
      data: {
        displayName: authUser.displayName,
        email: authUser.email,
        settings: { ...fuseDefaultSettings },
      },
    });

    updateUserData(user);
    return dispatch(setUserData(user));
  };
}


export function setUserData(user) {
  return (dispatch) => {

   
    /*
        Set User Data
         */
    dispatch({
      type: SET_USER_DATA,
      payload: user,
    });
  };
}

export function updateUserSettings(settings) {
  return (dispatch, getState) => {
    const oldUser = getState().auth.user;
    const user = _.merge({}, oldUser, { data: { settings } });

    updateUserData(user);

    return dispatch(setUserData(user));
  };
}

/**
 * Update User Shortcuts
 */
export function updateUserShortcuts(shortcuts) {
  return (dispatch, getState) => {
    const user = getState().auth.user;
    const newUser = {
      ...user,
      data: {
        ...user.data,
        shortcuts,
      },
    };

    updateUserData(newUser);

    return dispatch(setUserData(newUser));
  };
}

/**
 * Remove User Data
 */
export function removeUserData() {
  return {
    type: REMOVE_USER_DATA,
  };
}

/**
 * Logout
 */
export function logoutUser(type, params) {
  return (dispatch, getState) => {
    const user = getState().auth.user;

    if (!user.role || user.role.length === 0) {
      // is guest
      return null;
    }

    history.push({
      pathname: "/login",
    });

    switch (user.from) {
      case "firebase": {
        // firebaseService.signOut();
        break;
      }
      case "auth0": {
        // auth0Service.logout();
        break;
      }
      default: {
        jwtService.logout(type, params);
      }
    }

    dispatch(setInitialSettings());

    dispatch({
      type: USER_LOGGED_OUT,
    });
  };
}

/**
 * Update User Data
 */
function updateUserData(user) {
  if (!user.role || user.role.length === 0) {
    // is guest
    return;
  }

  switch (user.from) {
    case "firebase": {
      break;
    }
    case "auth0": {
      break;
    }
    default: {
      jwtService
        .updateUserData(user)
        .then(() => {
          store.dispatch(
            Actions.showMessage({
              message: "User data saved with api",
              variant: "success",
            })
          );
        })
        .catch((error) => {
          store.dispatch(Actions.showMessage({ message: error.message }));
        });
      break;
    }
  }
}
