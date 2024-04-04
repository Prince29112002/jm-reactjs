import React, { useState, useEffect } from "react";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Select, { createFilter } from "react-select";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { TextField, Checkbox, FormControl, FormControlLabel } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import handleError from "app/main/ErrorComponent/ErrorComponent";

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

const CreateSubGroup = (props) => {
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
      setGroupName(props.data.sub_group_name);
      getDataForEdit()
    }
    getGroupList();
  }, [dispatch])


  function getGroupList() {
    axios.get(Config.getCommonUrl() + "api/group?isparent=1")
      .then((res) => {
        console.log(res);
        setUnderGroupList(res.data.data);
        if (props.data) {
          const groupArr = res.data.data;
          const groupId = props.data.group_id
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
        handleError(error, dispatch, {api : "api/group?isparent=1"})

      })
  }


  function getDataForEdit() {
    const id = props.data.group_id;
    axios.get(Config.getCommonUrl() + `api/group/${id}`)
      .then((res) => {
        console.log(res);
        const ledData = res.data.data[0];
        setAccountType(ledData.account_type);
        if (ledData.account_type === 1) {
          setIsAccChecked({ trading: true, placc: false })
        } else {
          setIsAccChecked({ trading: false, placc: true })
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {api : `api/group/${id}`})

      })
  }

  const handleClose = () => {
    setOpen(false);
    props.modalColsed();
  };

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
      setGroupNameErrTxt("Please Enter Group Name");
      return false;
    }
    return true;
  }

  function groupSelectValidate() {
    if (selectedGroup === "") {
      setUnderGroupErrTxt("Please Select Group");
      return false;
    }
    return true;
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (groupNameValidate() && groupSelectValidate()) {
      props.data ? callUpdateSubGroupApi() : callAddSubGroupApi();
    }
  }

  function callUpdateSubGroupApi() {
    const id = props.data.sub_group_id;
    const body = {
      name: groupName,
      groups_id: selectedGroup.value,
      main_groups_id: selectedGroup.value,
      account_type: accountType
    }
    axios.put(Config.getCommonUrl() + `api/subgroup/${id}`, body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setGroupName("");
          setSelectedGroup("");
          dispatch(Actions.showMessage({ message: "Sub Group Updated Successfully", variant: "success"}));
          handleClose();
        } else {
          dispatch(Actions.showMessage({ message: response.data.message,  variant: "error"}));
        }
      })
      .catch((error) => {
        handleError(error, dispatch,{api:`api/subgroup/${id}`, body: body})

      })
  }

  function callAddSubGroupApi() {
    axios.post(Config.getCommonUrl() + "api/subgroup", {
      name: groupName,
      groups_id: selectedGroup.value,
      account_type: accountType
    })
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setGroupName("");
          setSelectedGroup("");
          dispatch(Actions.showMessage({ message: "Sub Group Added Successfully", variant: "success"}));
          handleClose();
        } else {
          dispatch(Actions.showMessage({ message: response.data.message, variant: "error"}));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {api : "api/subgroup", body :{
          name: groupName,
          groups_id: selectedGroup.value,
          account_type: accountType
        }})

      })
  }

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <div style={modalStyle} className={classes.paper}>
          <h5
            className="p-5"
            style={{
              textAlign: "center",
              backgroundColor: "black",
              color: "white",
            }}
          >
            {props.data ? "Edit Sub Group" : "Create Ledger"}
          </h5>
          <div className="p-5 pl-16 pr-16">

            <TextField
              className="mt-16"
              label="Group Name"
              name="groupName"
              value={groupName}
              error={groupNameErrTxt.length > 0 ? true : false}
              helperText={groupNameErrTxt}
              onChange={(e) => handleInputChange(e)}
              autoFocus
              variant="outlined"
              fullWidth
            />

            <Select
              className="mt-16"
              classes={classes}
              styles={selectStyles}
              options={underGroupList.map((group) => ({
                value: group.id,
                label: group.name,
              }))}
              value={selectedGroup}
              filterOption={createFilter({ ignoreAccents: false })}
              onChange={handleChangeGroup}
              placeholder="Select Group"
            />

            <span style={{ color: "red" }}>
              {underGroupErrTxt.length > 0 ? underGroupErrTxt : ""}
            </span>

            <FormControl
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
            </FormControl>

            <Button
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
              {props.data ? "Update Sub Group" : "SAVE"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateSubGroup;