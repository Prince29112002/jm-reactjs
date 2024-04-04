import React, { useState, useEffect, useContext } from "react";
import { Icon, IconButton } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import { TextField, Checkbox, FormControlLabel } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import History from "@history";
import Select, { createFilter } from "react-select";
import axios from "axios";
import * as Actions from "app/store/actions";
import Config from "app/fuse-configs/Config";
import AppContext from "app/AppContext";
import handleError from "app/main/ErrorComponent/ErrorComponent";

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

function getModalStyle() {
  const top = 50; //+ rand();
  const left = 50; //+ rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const GroupMerging = (props) => {
  const [open, setOpen] = React.useState(true);
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [checkAll, setCheckAll] = useState(true);
  const [stone, setStone] = useState(1);
  const [solitry, setSolitary] = useState(1);
  const [silver, setSilver] = useState(1);
  const [beads, setBeads] = useState(1);
  const [other, setOther] = useState(1);
  const [lotNo, setLotNo] = useState("");
  const [lotNoErr, setLotNoErr] = useState("");

  const [lotArrList, setLotArrList] = useState([]);
  const [selectedLotNo, setSelectedLotNo] = useState("");
  const [selectedLotNoErr, setSelectedLotNoErr] = useState("");

  const [mainCat, setMainCat] = useState("");
  const [mainCatErr, setMainCatErr] = useState("");

  const [groupCat, setGroupCat] = useState("");
  const [groupCatErr, setGroupCatErr] = useState("");

  const [subCatVariant, setSubCatVariant] = useState("");
  const [subCatVariantErr, setSubCatVariantErr] = useState("");

  const [mainCatList, setMainCatList] = useState([]);
  const [groupCatList, setGroupCatList] = useState([]);
  const [subVariantCatList, setSubVariantList] = useState([]);
  const appContext = useContext(AppContext);

  const { selectedDepartment } = appContext;

  useEffect(() => {
    getMainCatList();
    getGroupCatList();
    setLotArrList(props.lot_id);
    setSelectedLotNo(
      props.lot_id.map((l) => ({
        value: l.id,
        label: l.stockname,
      }))
    );
  }, [dispatch]);

  function getMainCatList() {
    axios
      .get(Config.getCommonUrl() + "api/productcategory/common/main/category")
      .then((res) => {
        console.log(res);
        setMainCatList(res.data.data);
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/productcategory/common/main/category",
        });
      });
  }

  function getGroupCatList() {
    axios
      .get(Config.getCommonUrl() + "api/productcategory/common/sub/category")
      .then((res) => {
        console.log(res);
        setGroupCatList(res.data.data);
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/productcategory/common/sub/category",
        });
      });
  }

  function getSubCatVariantList(id) {
    axios
      .get(
        Config.getCommonUrl() + `api/productcategory/sub/parent/category/${id}`
      )
      .then((res) => {
        console.log(res);
        setSubVariantList(res.data.data);
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/productcategory/sub/parent/category/${id}`,
        });
      });
  }

  const handleSubCatVariant = (value) => {
    setSubCatVariant(value);
    setSubCatVariantErr("");
  };

  const handleGroupCat = (value) => {
    setGroupCat(value);
    setGroupCatErr("");
    getSubCatVariantList(value.value);
  };

  const handleMainCat = (value) => {
    setMainCat(value);
    setMainCatErr("");
  };

  const handleSelectLot = (value) => {
    setSelectedLotNo(value);
    setSelectedLotNoErr("");
  };

  const handleChangeAll = (event) => {
    const value = event.target.checked;
    setCheckAll(value);
    setStone(value === true ? 1 : 0);
    setSolitary(value === true ? 1 : 0);
    setSilver(value === true ? 1 : 0);
    setBeads(value === true ? 1 : 0);
    setOther(value === true ? 1 : 0);
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value =
      event.target.type === "checkbox"
        ? event.target.checked
        : event.target.value;
    if (name === "stone") {
      setStone(value === true ? 1 : 0);
      setCheckAll(false);
    } else if (name === "silver") {
      setSilver(value === true ? 1 : 0);
      setCheckAll(false);
    } else if (name === "solitry") {
      setSolitary(value === true ? 1 : 0);
      setCheckAll(false);
    } else if (name === "other") {
      setOther(value === true ? 1 : 0);
      setCheckAll(false);
    } else if (name === "beads") {
      setBeads(value === true ? 1 : 0);
      setCheckAll(false);
    } else if (name === "lotNo") {
      setLotNo(value);
      var Regex = /^(?=[A-Za-z]*[0-9])[A-Za-z0-9]+(?:\.[A-Za-z0-9]+)+$/;
      if (Regex.test(value) === true && value.length < 20) {
        setLotNoErr("");
      } else {
        setLotNoErr("Enter valid lot Number");
      }
    }
  };

  function validateMainCat() {
    if (mainCat === "") {
      setMainCatErr("Select Main Category");
      return false;
    }
    return true;
  }
  function validateGroupCat() {
    if (groupCat === "") {
      setGroupCatErr("Select Group Category");
      return false;
    }
    return true;
  }
  function validateSubCat() {
    if (subCatVariant === "") {
      setSubCatVariantErr("Select Sub Category Variant");
      return false;
    }
    return true;
  }

  function validateLot() {
    if (lotNo === "" || lotNoErr) {
      setLotNoErr("Enter valid lot number");
      return false;
    }
    return true;
  }

  function validateselectedlot() {
    if (
      selectedLotNo === "" ||
      selectedLotNo === null ||
      selectedLotNo.length === 0
    ) {
      setSelectedLotNoErr("Select lot number");
      return false;
    }
    return true;
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // if(validateMainCat() && validateGroupCat() && validateSubCat()){
    //    // callGroupMergingApi();
    // }
    if (validateLot() && validateselectedlot() && validateMainCat()) {
      callGroupMergingApi();
    }
  };

  const handleClose = () => {
    setOpen(false);
    props.getData();
    History.push("/dashboard/stock");
  };

  function callGroupMergingApi() {
    const lotId = selectedLotNo.map((l) => {
      return l.value;
    });
    const body = {
      lot_id: lotId,
      lot_number: lotNo,
      product_category_id: groupCat.value,
      variant_id: subCatVariant.value,
      sub_category_id: groupCat.value,
      design_batch: checkAll === true ? 1 : 0,
      stone: stone,
      solitary: solitry,
      silver: silver,
      beads: beads,
      other: other,
      department_id: selectedDepartment.value.split("-")[1],
    };
    axios
      .post(Config.getCommonUrl() + "api/groupmerging/", body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setOpen(false);
          props.getData();
          History.push("/dashboard/stock");
          dispatch(
            Actions.showMessage({
              message: "Group Merging Added Successfully",
              variant: "success",
            })
          );
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
        handleError(error, dispatch, { api: "api/groupmerging/", body });
      });
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

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0">
            {open === true && (
              <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={(_, reason) => {
                  if (reason !== "backdropClick") {
                    handleClose();
                  }
                }}
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
                    Group Merging
                    <IconButton
                      style={{ position: "absolute", top: "0", right: "0" }}
                      onClick={handleClose}
                    >
                      <Icon style={{ color: "white" }}>close</Icon>
                    </IconButton>
                  </h5>
                  <div className="p-5 pl-16 pr-16">
                    <TextField
                      className="mt-16"
                      label="Lot No"
                      name="lotNo"
                      value={lotNo}
                      error={lotNoErr.length > 0 ? true : false}
                      helperText={lotNoErr}
                      onChange={handleChange}
                      variant="outlined"
                      fullWidth
                    />

                    <Select
                      className="mt-16"
                      classes={classes}
                      styles={selectStyles}
                      options={lotArrList.map((i) => ({
                        value: i.id,
                        label: i.stockname,
                      }))}
                      filterOption={createFilter({ ignoreAccents: false })}
                      value={selectedLotNo}
                      isMulti
                      onChange={handleSelectLot}
                      placeholder="Selcted Lot No"
                    />

                    <span style={{ color: "red" }}>
                      {selectedLotNoErr.length > 0 ? selectedLotNoErr : ""}
                    </span>

                    <Select
                      className="mt-16"
                      classes={classes}
                      styles={selectStyles}
                      options={mainCatList.map((group) => ({
                        value: group.parent_category_id,
                        label: group.category_name,
                      }))}
                      filterOption={createFilter({ ignoreAccents: false })}
                      value={mainCat}
                      onChange={handleMainCat}
                      placeholder="Main Category"
                    />

                    <span style={{ color: "red" }}>
                      {mainCatErr.length > 0 ? mainCatErr : ""}
                    </span>

                    <Select
                      className="mt-16"
                      classes={classes}
                      styles={selectStyles}
                      options={groupCatList.map((group) => ({
                        value: group.id,
                        label: group.category_name,
                      }))}
                      filterOption={createFilter({ ignoreAccents: false })}
                      value={groupCat}
                      onChange={handleGroupCat}
                      placeholder="Group Category"
                    />

                    {/* <span style={{ color: "red" }}>
                                {groupCatErr.length > 0 ? groupCatErr : ""}
                                </span> */}

                    <Select
                      className="mt-16"
                      classes={classes}
                      styles={selectStyles}
                      options={subVariantCatList.map((group) => ({
                        value: group.id,
                        label: group.category_name,
                      }))}
                      filterOption={createFilter({ ignoreAccents: false })}
                      value={subCatVariant}
                      onChange={handleSubCatVariant}
                      placeholder="Sub Category Variant"
                    />

                    {/* <span style={{ color: "red" }}>
                                {subCatVariantErr.length > 0 ? subCatVariantErr : ""}
                                </span> */}

                    <FormControlLabel
                      label="Design & Batch"
                      control={
                        <Checkbox
                          checked={checkAll}
                          // indeterminate={checked[0] !== checked[1]}
                          onChange={handleChangeAll}
                        />
                      }
                    />

                    <Grid style={{ paddingLeft: 20 }}>
                      <FormControlLabel
                        label="Stone"
                        control={
                          <Checkbox
                            name="stone"
                            checked={stone === 1 ? true : false}
                            // indeterminate={checked[0] !== checked[1]}
                            onChange={handleChange}
                          />
                        }
                      />

                      <FormControlLabel
                        label="Silver"
                        control={
                          <Checkbox
                            name="silver"
                            checked={silver === 1 ? true : false}
                            // indeterminate={checked[0] !== checked[1]}
                            onChange={handleChange}
                          />
                        }
                      />
                    </Grid>
                    <Grid style={{ paddingLeft: 20 }}>
                      <FormControlLabel
                        label="Solitry"
                        control={
                          <Checkbox
                            name="solitry"
                            checked={solitry === 1 ? true : false}
                            // indeterminate={checked[0] !== checked[1]}
                            onChange={handleChange}
                          />
                        }
                      />

                      <FormControlLabel
                        label="Other"
                        control={
                          <Checkbox
                            name="other"
                            checked={other === 1 ? true : false}
                            // indeterminate={checked[0] !== checked[1]}
                            onChange={handleChange}
                          />
                        }
                      />
                    </Grid>

                    <Grid style={{ paddingLeft: 20 }}>
                      <FormControlLabel
                        label="Beads"
                        control={
                          <Checkbox
                            name="beads"
                            checked={beads === 1 ? true : false}
                            // indeterminate={checked[0] !== checked[1]}
                            onChange={handleChange}
                          />
                        }
                      />
                    </Grid>
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
                      SAVE
                    </Button>
                  </div>
                </div>
              </Modal>
            )}
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default GroupMerging;
