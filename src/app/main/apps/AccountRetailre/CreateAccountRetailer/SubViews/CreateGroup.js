import React, { useState, useEffect } from "react";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Select, { createFilter } from "react-select";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { TextField, Icon, IconButton } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import clsx from "clsx";

function getModalStyle() {
  const top = 50; //+ rand();
  const left = 50; //+ rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "cornflowerblue",
    color: "white",
  },
}));

const CreateGroup = (props) => {

  const [open, setOpen] = React.useState(true);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();

  const [groupName, setGroupName] = useState("");
  const [groupNameErrTxt, setGroupNameErrTxt] = useState("");

  const [underGroupList, setUnderGroupList] = useState([]);
  const [underGroupErrTxt, setUnderGroupErrTxt] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");

  const [accountType, setAccountType] = useState(1);
  const [isAccChecked, setIsAccChecked] = useState({ trading: true, placc: false });

  useEffect(() => {
    if (props.data) {
      getDataForEdit()
    }
    getMainGroupList()
  }, [dispatch])

  function getMainGroupList() {
    axios.get(Config.getCommonUrl() + "retailerProduct/api/maingroup")
      .then((res) => {
        console.log(res,"//////");
        setUnderGroupList(res.data.data);
        if (props.data) {
          const groupArr = res.data.data;
          const groupId = props.data.main_group_id
          groupArr.map((optn) => {
            if (optn.id === groupId) {
              setSelectedGroup({
                value: optn.id,
                label: optn.name
              })
            }
          })
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "retailerProduct/api/maingroup" })

      })
  }

  function getDataForEdit() {
    const id = props.data.group_id;
    axios.get(Config.getCommonUrl() + `retailerProduct/api/group/${id}`)
      .then((res) => {
        console.log(res);
        const ledData = res.data.data[0];
        setGroupName(ledData.name);
        setAccountType(ledData.account_type);
        if (ledData.account_type === 1) {
          setIsAccChecked({ trading: true, placc: false })
        } else {
          setIsAccChecked({ trading: false, placc: true })
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: `retailerProduct/api/group/${id}` })

      })
  }

  const handleClose = () => {
    setOpen(false);
    props.modalColsed();
  };

  const handleModalClose = () => {
    setOpen(false);
    props.headerClose();
  }

  const handleChangeGroup = (value) => {
    setUnderGroupErrTxt("");
    setSelectedGroup(value);
  }

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === "groupName") {
      setGroupNameErrTxt("");
      setGroupName(value)
    } else if (name === "tradingaccount") {
      setAccountType(value);
      setIsAccChecked({ trading: true, placc: false })
    } else if (name === "placcount") {
      setAccountType(value);
      setIsAccChecked({ trading: false, placc: true })
    }
  }

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  function groupNameValidate() {
    if (groupName === "") {
      setGroupNameErrTxt("Please enter group name");
      return false;
    }
    return true;
  }

  function groupSelectValidate() {
    if (selectedGroup === "" || selectedGroup === null) {
      setUnderGroupErrTxt("Please select group");
      return false;
    }
    return true;
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (groupNameValidate() && groupSelectValidate()) {
      props.data ? callUpdateGroupApi() : callAddGroupApi();
    }
  }

  function callAddGroupApi() {
    axios.post(Config.getCommonUrl() + "retailerProduct/api/group", {
      name: groupName,
      parent_id: selectedGroup.value,
      // account_type : accountType
    })
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setGroupName("");
          setSelectedGroup("");
          dispatch(Actions.showMessage({ message: "Group Added Successfully", variant: "success"}));
          handleClose();
        } else {
          dispatch(Actions.showMessage({ message: response.data.message, variant: "error"}));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/group", body: {
            name: groupName,
            parent_id: selectedGroup.value,
            // account_type : accountType
          }
        })

      })
  }

  function callUpdateGroupApi() {
    const id = props.data.group_id;
    const body = {
      name: groupName,
      main_groups_id: selectedGroup.value,
      account_type: accountType
    }
    axios.put(Config.getCommonUrl() + `retailerProduct/api/group/${id}`, body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setGroupName("");
          setSelectedGroup("");
          dispatch(Actions.showMessage({ message: "Group Updated Successfully",variant:"success"}));
          handleClose();
        } else {
          dispatch(Actions.showMessage({ message: response.data.message,variant:"error"}));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: `retailerProduct/api/group/${id}`, body: body })

      })
  }

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleModalClose();
          }
        }}
      >
        <div style={modalStyle}
          className={clsx(classes.paper, "rounded-8")}
        // className={classes.paper}
        >
          <h5
            className="popup-head p-5"
          /* style={{
            textAlign: "center",
            backgroundColor: "black",
            color: "white",
          }} */
          >
            {props.data ? "Edit Group" : "Create Group"}
            <IconButton
              style={{ position: "absolute", top: "0", right: "0" }}
              onClick={handleModalClose}
            ><Icon style={{ color: "white" }}>
                close
              </Icon></IconButton>
          </h5>
          <div className="pl-16 pr-16" style={{padding:"25px"}}>
          <Grid container spacing={1}>
              <Grid item xs={12}>
            <p className="popup-labl pb-1">Group name</p>
            <TextField
              placeholder="Group name"
              name="groupName"
              value={groupName}
              error={groupNameErrTxt.length > 0 ? true : false}
              helperText={groupNameErrTxt}
              onChange={(e) => handleInputChange(e)}
              autoFocus
              variant="outlined"
              fullWidth
            />
            </Grid>
            <Grid item xs={12}>
            <p className="popup-labl pb-1 mt-5">Select group</p>
            <Select
              classes={classes}
              styles={selectStyles}
              options={underGroupList.map((group) => ({
                value: group.id,
                label: group.name,
              }))}
              isClearable
              filterOption={createFilter({ ignoreAccents: false })}
              value={selectedGroup}
              onChange={handleChangeGroup}
              placeholder="Select group"

            />
            <span style={{ color: "red" }}>
              {underGroupErrTxt.length > 0 ? underGroupErrTxt : ""}
            </span>
            </Grid>

            <Grid>

              {/* <FormControl
            component="fieldset"
            className={classes.formControl}
            >
          <FormControlLabel  
            control={
            <Checkbox 
                value={1}
                name="tradingaccount"
                onChange={(e) => handleInputChange(e)}
                checked={isAccChecked.trading}
            />}
            label="Trading Account"
            />
            <FormControlLabel
            control={
            <Checkbox 
                value={0}
                name="placcount"
                onChange={(e) => handleInputChange(e)}
                checked={isAccChecked.placc}
            />}
            label="Profit or Loss Account"
            />
            </FormControl> */}

            </Grid>

            <Grid container spacing={2} style={{ marginTop: "10px" }}>
            <Grid
                item
                lg={12}
                xs={12}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  columnGap: "10px",
                }}
              >
              <Button
                variant="contained"
                className="cancle-button-css"
                onClick={handleModalClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                className="save-button-css"
                onClick={(e) => handleFormSubmit(e)}
              >
                {props.data ? "Update Group" : "SAVE"}
              </Button>
              </Grid>
            </Grid>

            {/* <Button
              variant="contained"
              color="primary"
              className="w-full mx-auto mt-16"
              style={{
                backgroundColor: "#4caf50",
                border: "none",
                color: "white",
              }}
              onClick={(e) => handleFormSubmit(e)}
            >
              {props.data ? "Update Group" : "SAVE"}
            </Button> */}
          </Grid>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateGroup;