import React, { useState, useEffect } from "react";
import { FuseAnimate } from "@fuse";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import axios from "axios";
import * as Actions from "app/store/actions";
import Config from "app/fuse-configs/Config";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Select, { createFilter } from "react-select";
import { TextField, Typography } from "@material-ui/core";
import Loader from "../../../../../../Loader/Loader";
// "../../../../../../BreadCrubms/BreadcrumbsHelper";
import History from "@history";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import moment from "moment";
import Icones from "assets/fornt-icons/Mainicons";

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
  inputBoxTEST: {
    "& input[type=number]": {
      "-moz-appearance": "textfield",
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#1FD319",
    color: "white",
  },
  button1: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "gray",
    color: "white",
  },
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    height: "100%",
  },
  table: {
    // minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  searchBox: {
    padding: 6,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
  },
}));

const CreateNewCollection = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();

  const [groupCatList, setGroupCatList] = useState([]);
  const [groupCat, setGroupCat] = useState("");
  const [groupCatErr, setGroupCatErr] = useState("");

  const [collectionName, setCollectionName] = useState("");
  const [collectionNameErr, setCollectionNameErr] = useState("");

  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState("");

  const [imageUrl, setImageUrl] = useState("");
  const [imgFile, setImgFile] = useState("");

  const [createdDate, setCreatedDate] = useState(moment().format("YYYY-MM-DD"));
  const [createdDateErr, setCreatedDateErr] = useState("");

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  useEffect(() => {
    NavbarSetting("Design", dispatch);
  }, []);

  useEffect(() => {
    if (props.location.state && props.location.state.edit) {
      setEdit(props.location.state.edit);
      setEditId(props.location.state.id);
      getDataForEdit(props.location.state.id);
    }
    getGroupCatList();
  }, [dispatch]);

  function getGroupCatList(catId) {
    axios
      .get(Config.getCommonUrl() + "api/productcategory/all/list")
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          const listArr = res.data.data;
          setGroupCatList(listArr);
          if (catId) {
            listArr.map((item) => {
              if (item.id === catId) {
                setGroupCat({
                  value: item.id,
                  label: item.category_name,
                });
              }
            });
          }
        } else {
          dispatch(Actions.showMessage({ message: res.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/productcategory/common/sub/category",
        });
      });
  }

  function getDataForEdit(id) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + `api/designcollection/${id}`)
      .then((res) => {
        console.log(res);
        setLoading(false);
        if (res.data.success) {
          const arrData = res.data.data;
          getGroupCatList(arrData.category_id);
          setCollectionName(arrData.name);
          setDescription(arrData.description);
          setImageUrl(arrData.imageURL);
          setCreatedDate(arrData.created_at);
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, { api: `api/designcollection/${id}` });
      });
  }

  const handleChangeGroupCat = (value) => {
    setGroupCat(value);
    setGroupCatErr("");
  };

  const handleInputChange = (e) => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    var today = moment().format("YYYY-MM-DD"); //new Date();

    if (name === "collectionName") {
      setCollectionName(value);
      setCollectionNameErr("");
    } else if (name === "description") {
      setDescription(value);
    } else if (name === "createdDate") {
      setCreatedDate(value);
      // today.setHours(0,0,0,0);
      let dateVal = moment(value).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD"); //new Date("01/01/1900");
      if (dateVal <= today && minDateVal < dateVal) {
        setCreatedDateErr("");
      } else {
        setCreatedDateErr("Enter Valid Date");
      }
    }
  };

  function validateCatSelect() {
    if (groupCat === "" || groupCat === null) {
      setGroupCatErr("Select Category");
      return false;
    }
    return true;
  }

  function validateCollectionName() {
    if (collectionName === "" || collectionName === null) {
      setCollectionNameErr("Enter collection name");
      return false;
    }
    return true;
  }

  function validateDate() {
    if (createdDate === "" || createdDate === null) {
      setCreatedDateErr("Enter Date");
      return false;
    }
    return true;
  }

  const handleFormSubmit = (event) => {
    event.preventDefault();

    if (validateCatSelect() && validateCollectionName() && validateDate()) {
      if (edit) {
        callUpdateCollectionApi();
      } else {
        // if(imageValidation())
        callCreateCollectionApi();
      }
    }
  };

  function callCreateCollectionApi() {
    setLoading(true);
    const formData = new FormData();
    formData.append("category_id", groupCat.value);
    formData.append("name", collectionName);
    formData.append("description", description);
    formData.append("image", imgFile);
    formData.append("created_at", createdDate);
    axios
      .post(Config.getCommonUrl() + "api/designcollection", formData)
      .then((response) => {
        setLoading(false);
        console.log(response);
        if (response.data.success) {
          History.push("/dashboard/design", { view: 1, sub: 1 });
          dispatch(
            Actions.showMessage({
              message: "Collection Added Successfully",
              variant: "success",
            })
          );
          setGroupCat("");
          setCollectionName("");
          setImageUrl("");
          setDescription("");
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
        setLoading(false);
        handleError(error, dispatch, {
          api: "api/designcollection",
          body: JSON.stringify(formData),
        });
      });
  }

  function callUpdateCollectionApi() {
    setLoading(true);
    const formData = new FormData();
    formData.append("category_id", groupCat.value);
    formData.append("name", collectionName);
    formData.append("description", description);
    formData.append("image", imgFile);
    formData.append("created_at", createdDate);
    axios
      .put(Config.getCommonUrl() + `api/designcollection/${editId}`, formData)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          History.push("/dashboard/design", { view: 1, sub: 1 });
          dispatch(
            Actions.showMessage({
              message: "Collection Updated Successfully",
              variant: "success",
            })
          );
          setGroupCat("");
          setCollectionName("");
          setImageUrl("");
          setDescription("");
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
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/designcollection/${editId}`,
          body: JSON.stringify(formData),
        });
      });
  }

  const onKeyDown = (e) => {
    e.preventDefault();
  };

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  const hiddenFileInput = React.useRef(null);

  function setImages(imgFile) {
    setImageUrl(URL.createObjectURL(imgFile));
    setImgFile(imgFile);
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20">
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={4} md={3} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    {edit ? "Edit Collection" : " Create New Collection"}
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper />{" "} */}
                {/* {edit ? "Edit Collection" : " Create New Collection"} */}
              </Grid>
              {loading && <Loader />}
              {/* <Grid
                item
                xs={12}
                sm={4}
                md={9}
                key="2"
                style={{ textAlign: "right" }}
              >
                <Button
                  id="voucher-list-btn"
                  variant="contained"
                  className={classes.button1}
                  size="small"
                  onClick={() => History.push(`/dashboard/design`,{ view: 1, sub: 1 })}
                >
                  Back
                </Button>
              </Grid> */}
              <Grid item xs={12} sm={4} md={9} key="2">
                <div className="btn-back">
                  {" "}
                  <img src={Icones.arrow_left_pagination} alt="" />
                  <Button
                    id="btn-back"
                    variant="contained"
                    size="small"
                    onClick={() =>
                      History.push(`/dashboard/design`, { view: 1, sub: 1 })
                    }
                  >
                    Back
                  </Button>
                </div>
              </Grid>
            </Grid>
            <div className="main-div-alll">
              <div className="pb-16 mt-16">
                <Grid container spacing={3}>
                  <Grid
                    item
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <label>Select category</label>
                    <Select
                      className="mt-1"
                      classes={classes}
                      styles={selectStyles}
                      options={groupCatList.map((group) => ({
                        value: group.id,
                        label: group.category_name,
                      }))}
                      autoFocus
                      filterOption={createFilter({ ignoreAccents: false })}
                      value={groupCat}
                      onChange={handleChangeGroupCat}
                      placeholder="Select category"
                    />
                    <span style={{ color: "red" }}>
                      {groupCatErr.length > 0 ? groupCatErr : ""}
                    </span>
                  </Grid>

                  <Grid
                    item
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <label>Enter collection name</label>
                    <TextField
                      className="mt-1"
                      placeholder="Enter collection name"
                      name="collectionName"
                      value={collectionName}
                      error={collectionNameErr.length > 0 ? true : false}
                      helperText={collectionNameErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <Grid
                    item
                    lg={4}
                    md={6}
                    sm={6}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <label>Date</label>
                    <TextField
                      className="mt-1"
                      type="date"
                      placeholder="Date"
                      name="createdDate"
                      value={createdDate}
                      error={createdDateErr.length > 0 ? true : false}
                      helperText={createdDateErr}
                      onChange={(e) => handleInputChange(e)}
                      // onKeyDown={onKeyDown}
                      variant="outlined"
                      fullWidth
                      inputProps={{
                        max: moment().format("YYYY-MM-DD"),
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid
                    container={true}
                    item
                    xs={3}
                    sm={3}
                    md={3}
                    style={{ padding: 6 }}
                  >
                    <Grid item xs={6} sm={6} md={6} style={{ padding: 0 }}>
                      <Button
                        id="btn-save"
                        variant="contained"
                        color="primary"
                        style={{
                          backgroundColor: "#283428",
                          color: "white",
                          width: "100%",
                        }}
                        // className="w-224 mx-auto "
                        onClick={handleClick}
                      >
                        Browse Image
                      </Button>

                      <input
                        type="file"
                        // id="fileinput"
                        ref={hiddenFileInput}
                        onChange={(event) => {
                          setImages(event.target.files[0]);
                        }}
                        accept="image/*"
                        style={{ display: "none" }}
                      />
                    </Grid>
                    {imageUrl !== "" && (
                      <img
                        src={imageUrl}
                        style={{ width: "300px", height: "200px" }}
                        className="mt-16"
                        alt=""
                      />
                    )}
                  </Grid>

                  <Grid
                    item
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    style={{ padding: 6 }}
                  >
                    <label>Design description</label>
                    <TextField
                      className="mt-1 Descriptionheight-dv"
                      placeholder="Design Description"
                      name="description"
                      value={description}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      fullWidth
                      multiline
                    />
                  </Grid>

                  <Grid
                    item
                    lg={12}
                    md={4}
                    sm={4}
                    xs={4}
                    style={{ padding: 6 }}
                  >
                    <Button
                      id="btn-save"
                      variant="contained"
                      className="w-128 mx-auto mt-36 float-right"
                      onClick={(e) => handleFormSubmit(e)}
                    >
                      {edit ? "UPDATE" : "SAVE"}
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default CreateNewCollection;
