import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";
import { Button, TextField } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CheckboxTree from "react-checkbox-tree";
import "react-checkbox-tree/lib/react-checkbox-tree.css";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting"
import handleError from "app/main/ErrorComponent/ErrorComponent";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const CreateDesignerRole = (props) => {
  const isEdit = props.isEdit; //if comes from edit
  const idToBeEdited = props.editID;
  const [apiData, setApiData] = useState([]);
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [uNmErrTxt, setUNmErrTxt] = useState("");
  const [isPermissionErr, setPermissionErr] = useState(false);
  const [permissionErrTxt, setPermissionErrTxt] = useState("");
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);

  useEffect(() => {
    NavbarSetting('Master', dispatch);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!isEdit) {
      setUserName("");
      setChecked([]);
      setExpanded([]);
    }
    axios
      .get(Config.getCommonUrl() + "admin/permission/designer")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          const tempdata = [];

          var apiRes = response.data.data;

          Object.keys(apiRes).forEach(function (key) {
            var mainKeys = apiRes[key];

            const tempSubData = [];
            Object.keys(mainKeys).forEach(function (subkey) {
              var sKey = mainKeys[subkey];
              const tempSubKey = [];
              for (const item of sKey) {
                tempSubKey.push({ value: parseInt(item.id), label: item.name });
              }
              tempSubData.push({
                value: subkey,
                label: subkey,
                children: tempSubKey,
              });
            });

            tempdata.push({
              value: key,
              label: key,
              children: tempSubData,
            });
          });
          setApiData(tempdata);      
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {api : "admin/permission/designer"})

      });

    if (isEdit === true) {
      axios
        .get(Config.getCommonUrl() + "api/adminrole/" + idToBeEdited)
        .then(function (response) {
          if (response.data.success === true) {
            console.log(response.data.data);
            const tempdata = [];
            setUserName(response.data.data.role_name);
            // setChecked()
            let tempArray = response.data.data.role_permission;
            for (const id of tempArray) {
              //getting only id from array
              tempdata.push(id.permission_id);
            }
            setChecked(tempdata);
          }
        })
        .catch(function (error) {
          handleError(error, dispatch, {api : "api/adminrole/" + idToBeEdited})

        });
    }
    //eslint-disable-next-line
  }, [dispatch, isEdit, idToBeEdited]);

  const classes = useStyles();

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "userName") {
      setUNmErrTxt("");
      setUserName(value);
    }
  }

  function emailValidation() {
    //username
    var usernameRegex = /^[A-Za-z0-9 ]*[A-Za-z]+[A-Za-z0-9 ]*$/;
    if (!userName || usernameRegex.test(userName) === false) {
      setUNmErrTxt("User name is not valid");
      return false;
    }
    return true;
  }

  function validatePermission() {
    if (checked.length === 0) {
      setPermissionErr(true);
      setPermissionErrTxt("You must provide permission to creat user");
      return false;
    }
    return true;
  }

  function checkPermissions() {
    // add new flow
    if (!isEdit && validatePermission() && emailValidation()) {
      callCreateAdminApi();

    }
    if (isEdit && validatePermission() && emailValidation()) {
      callUpdateAdminApi();
     
    }
  }

  //regestering new admin user
  function callCreateAdminApi() {
    axios
      .post(Config.getCommonUrl() + "api/adminrole", {
        // name: ,
        role_name: userName,
        is_design_master : 1,
        permission: checked.map(Number), //converting to integer
      })
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          // Data stored successfully
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          setUserName("");
          setChecked([]);
          setExpanded([]);
          props.changeView();
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {api : "api/adminrole",body: {
          // name: ,
          role_name: userName,
          is_design_master : 1,
          permission: checked.map(Number), //converting to integer
        }})

      });
  }

  function callUpdateAdminApi() {
    axios
      .put(Config.getCommonUrl() + "api/adminrole/" + idToBeEdited, {
        // name: ,
        role_name: userName,
        permission: checked.map(Number), //converting to integer
      })
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          dispatch(Actions.showMessage({ message: response.data.message,variant:"success" }));
          setUserName("");
          setChecked([]);
          setExpanded([]);
          props.changeView();
        }  else {
          dispatch(Actions.showMessage({ message: response.data.message,variant: "error" }));
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {api : "api/adminrole/" + idToBeEdited, body : {
          // name: ,
          role_name: userName,
          permission: checked.map(Number), //converting to integer
        }})

      });
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0">
            <div className="pb-32">
              <div style={{ width: "340px" }}>
                {/* <Typography variant="h6" className="mt-16 mb-16">
                  {isEdit === false ? "CREATE AN ACCOUNT" : "EDIT AN ACCOUNT"}
                </Typography> */}
                  <label className="mt-16"> User name* </label>
                  <br></br>
                <TextField
                  className="mb-16"
                  // label="User Name"
                  autoFocus
                  type="name"
                  name="userName"
                  value={userName}
                  error={uNmErrTxt.length > 0 ? true : false}
                  helperText={uNmErrTxt}
                  onChange={(e) => handleInputChange(e)}
                  variant="outlined"
                  required
                  fullWidth
                  placeholder="Enter user name"
                />
              </div>
              <div className="account-li-dv" style={{ marginBottom: "10%" }}>
              <label className="mt-16 "> Select </label>
              <br></br>
                <CheckboxTree
                style={{width:"340px"}}
                  nodes={apiData}
                  checked={checked}
                  expanded={expanded}
                  onCheck={(checked) => {
                    setChecked(checked);
                    setPermissionErr(false);
                  }}
                  onExpand={(expanded) => setExpanded(expanded)}
                  showNodeIcon={false}
                />
                {isPermissionErr === true && (
                  <div className="mt-16">
                    <span style={{ color: "red" }}>{permissionErrTxt}</span>
                  </div>
                )}
                <Button
                style={{float:"right",backgroundColor: "#415BD4"}}
                  variant="contained"
                  color="primary"
                  className=" mx-auto mt-16 "
                  onClick={(e) => checkPermissions(e)}
                >
                  {isEdit === false ? "Create User Role" : "Update User Role"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default CreateDesignerRole;
