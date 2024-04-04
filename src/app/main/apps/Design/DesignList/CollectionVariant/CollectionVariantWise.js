import React, { useState, useEffect } from "react";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import {
  TextField,
  Typography,
  Switch,
  FormGroup,
  Icon,
  IconButton,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Select, { createFilter } from "react-select";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import clsx from "clsx";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Autocomplete from "@material-ui/lab/Autocomplete";
import History from "@history";
import { FuseAnimate } from "@fuse";

import Loader from "app/main/Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import sampleFile from "app/main/SampleFiles/DesignModule/Design_Comb_Variant.csv";
import Icones from "assets/fornt-icons/Mainicons";

// function getModalStyle() {
//     const top = 50; //+ rand();
//     const left = 50; //+ rand();

//     return {
//         top: `${top}%`,
//         left: `${left}%`,
//         transform: `translate(-${top}%, -${left}%)`,
//     };
// }

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    width: 600,
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

const CollectionVariantWise = (props) => {
  // const [open, setOpen] = React.useState(true);
  // const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [variantFile, setVariantFile] = useState(null);
  const [variantFileErr, setVariantFileErr] = useState("");

  const [radioValue, setRadioValue] = useState("1");

  const [design_num, setDesignNum] = useState("");
  const [designNumErr, setDesignNumErr] = useState("");

  const [settingMehodList, setSettingMehodList] = useState([]);
  const [settingmethod, setSettingMethod] = useState("");
  const [settingmethodErr, setSettingMethodErr] = useState("");

  const [productCategory, setProductCategory] = useState([]);
  const [selectedProdCat, setSelectedProdCat] = useState("");
  const [prodCatErr, setProdCatErr] = useState("");

  const [prodCategoryGroup, setProdCategoryGroup] = useState([]);
  const [selectedProdCatGrp, setSelectedProdCatGrp] = useState("");
  const [prodCatGrpErr, setProdGrpCatErr] = useState("");

  const [size, setSize] = useState(""); //OPTIONAL
  const [remarks, setRemarks] = useState(""); //optional

  const [searchData, setSearchData] = useState("");

  const [designSearchList, setDesignSearchList] = useState([]); //search suggestion api
  const [SelectedDesignVariant, setSelectedDesignVariant] = useState(""); //selected in auto suggest search box

  const [designVariantList, setDesignVariantList] = useState([]); //showing data in table

  const [manualImgList, setManualImgList] = useState([]);
  const [manualImgErr, setManualImgErr] = useState("")

  const [imgUrlList, setImgUrlList] = useState([]);
  const [show_in_app, set_show_in_app] = useState(1);

  const handleRadioInputChange = (e) => {
    const value = e.target.value;
    setRadioValue(value);
    setSettingMethod("");
    setSelectedProdCat("");
    setSelectedProdCatGrp("");
    setSize("");
    setRemarks("");
    setSearchData("");
    setDesignSearchList([]);
    setSelectedDesignVariant("");
    setDesignVariantList([]);
  };

  useEffect(() => {
    NavbarSetting("Design", dispatch);
  }, []);

  const handleMethodChange = (method) => {
    setSettingMethod(method);
    setSettingMethodErr("");
  };

 

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "design_num") {
      setDesignNum(value);
      setDesignNumErr("");
    } else if (name === "size") {
      setSize(value);
    } else if (name === "remarks") {
      setRemarks(value);
    }
  }

  const handleCategoryChange = (e) => {
    setSelectedProdCat({
      value: e.value,
      label: e.label,
    });
    setProdCatErr("");
  };

  const handleCategoryGroupChange = (e) => {
    setSelectedProdCatGrp({
      value: e.value,
      label: e.label,
    });
    setProdGrpCatErr("");
    getCombinationCategories(e.value);
  };

  const HandleFile = (e) => {
    setVariantFile(e.target.files);
    setVariantFileErr("");
  };

  const HandleManualFile = (e) => {
    let TempFiles = e.target.files;
    setManualImgList(e.target.files);
    let tempUrl = [];
    for (let i = 0; i < TempFiles.length; i++) {
      tempUrl.push(URL.createObjectURL(TempFiles[i]));
    }
    setImgUrlList(tempUrl);
    setManualImgErr("")

  };

  const handleDelete = (index) => {
    let tempImg = [...manualImgList];
    let tempImgsurl = [...imgUrlList];

    tempImg.splice(index, 1);
    tempImgsurl.splice(index, 1);

    setManualImgList(tempImg);
    setImgUrlList(tempImgsurl);
  };

  const handleManualAdd = (e) => {
    e.preventDefault();
    if (
      settingMethodValidation() &&
      categoryGroupValidation() &&
      categoryValidation() &&
      DesignVariantValidation()
    ) {
      if (designVariantList.length === 0) {
        dispatch(
          Actions.showMessage({
            message: "Variants Required",
            variant: "error",
          })
        );
      } else {
        if (manualImgList.length <= 5) {
          setLoading(true);
          addSizeCombinationApi();
        } else {
          dispatch(
            Actions.showMessage({
              message: "Max 5 Images Allowed",
              variant: "error",
            })
          );
        }
      }
    }
  };

  const handleChangeToggle = (event, id) => {
    const status = event.target.checked;
    if (status) {
      set_show_in_app(1);
    } else if (!status) {
      set_show_in_app(0);
    }
  };

  function addSizeCombinationApi() {
    const formData = new FormData();
    for (let i = 0; i < manualImgList.length; i++) {
      formData.append("image_files", manualImgList[i]);
    }
    let designData = designVariantList.map((x) => {
      return x.id;
    });
    formData.append("design_id", JSON.stringify(designData));
    formData.append("variant_number", design_num);
    formData.append("size", size);
    formData.append("setting_method_id", settingmethod.value);
    formData.append("category_id", selectedProdCat.value);
    formData.append("category_group_id", selectedProdCatGrp.value);
    formData.append("remark", remarks);
    formData.append("show_in_app", show_in_app);

 
    axios
      .post(Config.getCommonUrl() + "api/design/combination", formData)
      .then((response) => {
        console.log(response);
        setLoading(false);

        if (response.data.success) {
          History.push("/dashboard/design", { view: 2 });
          // handleClose();
          dispatch(
            Actions.showMessage({
              message: response.data.message,
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
          if(document.getElementById("fileinput")){
            document.getElementById("fileinput").value = "";
        }
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: "api/design/combination",
          body: formData,
        });
      });
      if(document.getElementById("fileinput")){
        document.getElementById("fileinput").value = "";
    }
  }

  function categoryValidation() {
    if (selectedProdCat === "") {
      setProdCatErr("Please Select Category");
      return false;
    }

    return true;
  }

  function categoryGroupValidation() {
    if (selectedProdCatGrp === "") {
      setProdGrpCatErr("Please Select Category Group");
      return false;
    }
    return true;
  }

  function settingMethodValidation() {
    if (settingmethod === "") {
      setSettingMethodErr("Please Select Setting Method");
      return false;
    }

    return true;
  }

  function DesignVariantValidation() {
    if (design_num === "") {
      setDesignNumErr("Enter valid Design Variant");
      return false;
    }
    return true;
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchData) {
        getVariantSearch(searchData);
      } else {
        setDesignSearchList([]);
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
    //eslint-disable-next-line
  }, [searchData]);

  function getVariantSearch(sData) {
    axios
      .get(Config.getCommonUrl() + `api/design/search/variant/${sData}`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setDesignSearchList(response.data.data);
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
          api: `api/design/search/variant/${sData}`,
        });
      });
  }

  const handleVariantSelect = (val) => {
    let filteredArray = designSearchList.filter(
      (item) => item.variant_number === val
    );

    if (filteredArray.length > 0) {
      setSelectedDesignVariant(val);
      let list = [...designVariantList];

      let index = list.findIndex((item) => item.id == filteredArray[0].id);
      if (index == -1) {
        getDesignVariantDetails(filteredArray[0].id);
      }
      // }
    }
  };

  const getDesignVariantDetails = (id) => {
    axios
      .get(Config.getCommonUrl() + `api/design/variant/info/${id}`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);

          let list = [...designVariantList];
          // if (list.length === 0) {
          //     setSelectedDefDesign(response.data.design?.id)
          // }
          list.push(response.data.design);
          setDesignVariantList(list);
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
          api: `api/design/variant/info/${id}`,
        });
      });
  };

  const handleFileUpload = (e) => {
    e.preventDefault();
    if(variantFile && variantFile.length > 0) {
        if (radioValue === "1") {
            if (variantFile === null) {
                setVariantFileErr("Please choose file")
            } else {
                const formData = new FormData();
                for (let i = 0; i < variantFile.length; i++) {
                    formData.append("file", variantFile[i]);
                }
                callFileUploadApi(formData);
            }
        } else {
            if (variantFile === null) {
                setVariantFileErr("Please choose file")
            } else {
                const formData = new FormData();
                for (let i = 0; i < variantFile.length; i++) {
                    formData.append("file", variantFile[i]);
                }
                callUpdateFileUploadApi(formData);
            }
        }
    }else{
        setVariantFileErr("Please choose file")
    }
}

function callUpdateFileUploadApi(formData) {
  setLoading(true);
  const body = formData

  var api = "api/design/update/combination/csv"

  axios.post(Config.getCommonUrl() + api, body)
  .then((response) => {
      console.log(response);
      if (response.data.success) {
          setVariantFile("");
          setVariantFileErr("");
          // handleClose();
          History.push('/dashboard/design', { view: 2 });
          dispatch(Actions.showMessage({ message: response.data.message }));
      } else {
          let downloadUrl = response.data.url;
          console.log(downloadUrl);
          window.open(downloadUrl);
          setVariantFile("");
          setVariantFileErr("");
          if(document.getElementById("fileinput")){
              document.getElementById("fileinput").value = "";
          }
          dispatch(Actions.showMessage({ message: response.data.message }));
      }
      setLoading(false);
  })
  .catch((error) => {
      setLoading(false);
      if(document.getElementById("fileinput")){
          document.getElementById("fileinput").value = "";
      }
      console.log(error);
      handleError(error, dispatch, { api: api, body: body })
  })
}

function callFileUploadApi(formData) {
  setLoading(true);
  const body = formData

  var api = "api/design/combination/csv"

  axios.post(Config.getCommonUrl() + api, body)
      .then((response) => {
          console.log(response);
          if (response.data.success) {
              setVariantFile("");
              setVariantFileErr("");
              // handleClose();
              History.push('/dashboard/design', { view: 2 });
              dispatch(Actions.showMessage({ message: response.data.message }));
          } else {
              let downloadUrl = response.data.url;
              console.log(downloadUrl);
              window.open(downloadUrl);
              setVariantFile("");
              setVariantFileErr("");
              if(document.getElementById("fileinput")){
                  document.getElementById("fileinput").value = "";
              }
              dispatch(Actions.showMessage({ message: response.data.message }));
          }
          setLoading(false);
      })
      .catch((error) => {
          setLoading(false);
          if(document.getElementById("fileinput")){
              document.getElementById("fileinput").value = "";
          }
          console.log(error);
          handleError(error, dispatch, { api: api, body: body })
      })
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

  useEffect(() => {
    getDroupDown(1);
    getProductCategoriesGroups();
  }, []);

  function getProductCategoriesGroups() {
    axios
      .get(Config.getCommonUrl() + "api/productcategory/main/category")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setProdCategoryGroup(response.data.data);
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: "api/productcategory/main/category",
        });
      });
  }

  function getCombinationCategories(id) {
    axios
      .get(Config.getCommonUrl() + `api/productcategory/main/category/${id}`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setProductCategory(response.data.data);
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: `api/productcategory/main/category/${id}`,
        });
      });
  }

  function getDroupDown(flag) {
    axios
      .get(Config.getCommonUrl() + `api/designDropDown?flag=${flag}`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          const arrData = response.data.data;
          if (flag === 1) {
            setSettingMehodList(arrData);
          }
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
          api: `api/designDropDown?flag=${flag}`,
        });
      });
  }

  const deleteHandler = (index) => {
    let list = [...designVariantList];
    list.splice(index, 1);
    setDesignVariantList(list);
  };

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20">
            <Grid
              className="design-nav-width"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={4} md={3} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                  Design Combination
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper /> */}
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                md={9}
                key="2"
                style={{ textAlign: "right" }}
              >
                <div className="btn-back mt-1">
                  {" "}
                  <img src={Icones.arrow_left_pagination} alt="" />
                  <Button
                    // variant="contained"
                    id="btn-back"
                    className=""
                    size="small"
                    onClick={(event) => {
                      History.push("/dashboard/design", { view: 2 });
                    }}
                  >
                    Back
                  </Button>
                </div>
                {/*  <Button
                                    variant="contained"
                                    className={classes.button}
                                    size="small"
                                    onClick={(event) => {
                                        History.push('/dashboard/design', { view: 2 });
                                    }}
                                >
                                    Back
                                </Button> */}
              </Grid>
            </Grid>
            {loading && <Loader />}
            <div className="main-div-alll">
              <div className="mt-8 mb-8 mr-8">
                <FormControl
                  id="redio-input-dv"
                  component="fieldset"
                  className={classes.formControl}
                >
                  <RadioGroup
                    aria-label="Gender"
                    id="radio-row-dv"
                    name="designAll"
                    className={classes.group}
                    // value={designAll}
                    onChange={handleRadioInputChange}
                  >
                    <Grid item xs={12} style={{ padding: 0 }}>
                      <FormControlLabel
                        value={"1"}
                        control={<Radio />}
                        label="Upload CSV"
                        checked={radioValue === "1"}
                      />
                      <FormControlLabel
                        value={"2"}
                        control={<Radio />}
                        label="Manual"
                        checked={radioValue === "2"}
                      />
                       <FormControlLabel
                        value={"3"}
                        control={<Radio />}
                        label="Update Combination CSV"
                        checked={radioValue === "3"}
                      />
                    </Grid>
                  </RadioGroup>
                </FormControl>

                {radioValue === "1" && (
                  <Grid container spacing={3}>
                    <Grid item lg={3} xs={4} style={{ paddingInline: "12px" }}>
                      <p className="popup-labl mt-10">Upload CSV Excel File</p>
                      <TextField
                        id="fileinput"
                        className="mt-1 mb-16"
                        // label="Upload CSV Excel File"
                        name="variantFile"
                        type="file"
                        error={variantFileErr.length > 0 ? true : false}
                        helperText={variantFileErr}
                        onChange={(e) => HandleFile(e)}
                        variant="outlined"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid lg={3} style={{ marginTop: "57px" }}>
                      <a href={sampleFile} download="Design_Comb_Variant.csv">
                        Download Sample{" "}
                      </a>
                    </Grid>
                    <Grid lg={12}>
                      <Button
                        className="float-right mr-8"
                        variant="contained"
                        color="primary"
                        id="btn-save"
                        // style={{
                        //     backgroundColor: "#415BD4",
                        //     border: "none",
                        //     color: "white",
                        // }}
                        onClick={(e) => handleFileUpload(e)}
                      >
                        Upload
                      </Button>
                    </Grid>
                  </Grid>
                )}

                {radioValue === "2" && (
                  <>
                    <Grid container spacing={3}>
                      <Grid
                        item
                        xs={4}
                        style={{
                          padding: 0,
                          paddingInline: "12px",
                          paddingRight: "0px",
                        }}
                      >
                        <p className="popup-button-div ">Setting Method</p>

                        <Select
                          filterOption={createFilter({ ignoreAccents: false })}
                          className={clsx(
                            classes.selectBox,
                            "mt-1",
                            "purchase-select-dv selectsales-dv"
                          )}
                          classes={classes}
                          styles={selectStyles}
                          options={settingMehodList.map((suggestion) => ({
                            value: suggestion.id,
                            label: suggestion.method,
                          }))}
                          value={settingmethod}
                          onChange={(e) => {
                            handleMethodChange(e);
                          }}
                          placeholder="Setting Method"
                        />
                        <span style={{ color: "red" }}>
                          {settingmethodErr.length > 0 ? settingmethodErr : ""}
                        </span>
                      </Grid>

                      <Grid
                        item
                        xs={4}
                        style={{
                          padding: 0,
                          paddingInline: "12px",
                          paddingRight: "0px",
                        }}
                      >
                        <p className="popup-button-div ">Category Group Name</p>
                        <Select
                          className={clsx(
                            classes.selectBox,
                            "mt-1",
                            "purchase-select-dv selectsales-dv"
                          )}
                          filterOption={createFilter({
                            ignoreAccents: false,
                          })}
                          styles={selectStyles}
                          options={prodCategoryGroup.map((suggestion) => ({
                            value: suggestion.id,
                            label: suggestion.category_name,
                          }))}
                          value={selectedProdCatGrp}
                          onChange={(e) => {
                            handleCategoryGroupChange(e);
                          }}
                          placeholder="Category Group Name"
                        />
                        <span style={{ color: "red" }}>
                          {prodCatGrpErr.length > 0 ? prodCatGrpErr : ""}
                        </span>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        style={{
                          padding: 0,
                          paddingInline: "12px",
                          paddingRight: "0px",
                        }}
                      >
                        <p className="popup-button-div ">Category Name</p>
                        <Select
                          className={clsx(
                            classes.selectBox,
                            "mt-1",
                            "purchase-select-dv selectsales-dv"
                          )}
                          filterOption={createFilter({
                            ignoreAccents: false,
                          })}
                          styles={selectStyles}
                          options={productCategory.map((suggestion) => ({
                            value: suggestion.id,
                            label: suggestion.category_name,
                          }))}
                          value={selectedProdCat}
                          onChange={(e) => {
                            handleCategoryChange(e);
                          }}
                          placeholder="Category Name"
                        />
                        <span style={{ color: "red" }}>
                          {prodCatErr.length > 0 ? prodCatErr : ""}
                        </span>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        style={{
                          padding: 0,
                          paddingInline: "12px",
                          paddingRight: "0px",
                        }}
                      >
                        <p className="popup-button-div ">Design Number</p>
                        <TextField
                          className="mt-1 mb-16"
                          placeholder="Design number"
                          name="design_num"
                          value={design_num}
                          variant="outlined"
                          required
                          fullWidth
                          error={designNumErr.length > 0 ? true : false}
                          helperText={designNumErr}
                          onChange={(e) => handleInputChange(e)}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        style={{
                          padding: 0,
                          paddingInline: "12px",
                          paddingRight: "0px",
                        }}
                      >
                        <p className="popup-button-div ">Search Variant</p>
                        <Autocomplete
                          id="free-solo-demo"
                          freeSolo
                          className="mt-1"
                          onChange={(event, newValue) => {
                            // setValue(newValue);

                            handleVariantSelect(newValue);
                          }}
                          onInputChange={(event, newInputValue) => {
                        
                            if (newInputValue !== "")
                              setSearchData(newInputValue);
                          }}
                          value={SelectedDesignVariant}
                          options={designSearchList.map(
                            (option) => option.variant_number
                          )}
                          renderInput={(params) => (
                            <TextField
                              className="cate-input-blg"
                              {...params}
                              placeholder="Search Variant"
                              variant="outlined"
                              style={{ padding: 0 }}
                            />
                          )}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        style={{
                          padding: 0,
                          paddingInline: "12px",
                          paddingRight: "0px",
                        }}
                      >
                        <p className="popup-button-div ">Size</p>
                        <TextField
                          className="mt-1"
                          placeholder="Size"
                          name="size"
                          value={size}
                          variant="outlined"
                          // required
                          fullWidth
                          // error={designNumErr.length > 0 ? true : false}
                          // helperText={designNumErr}
                          onChange={(e) => handleInputChange(e)}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        style={{
                          padding: 0,
                          paddingInline: "12px",
                          paddingRight: "0px",
                        }}
                      >
                        <p className="popup-button-div ">Remarks</p>
                        <TextField
                          className="mt-1"
                          placeholder="Remarks"
                          name="remarks"
                          value={remarks}
                          variant="outlined"
                          // required
                          fullWidth
                          // error={designNumErr.length > 0 ? true : false}
                          // helperText={designNumErr}
                          onChange={(e) => handleInputChange(e)}
                        />
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        style={{
                          padding: 0,
                          paddingInline: "12px",
                          paddingRight: "0px",
                        }}
                      >
                        {/* <Switch checked={show_in_app == 1 ? true : false} onChange={(e) => handleChangeToggle(e)} inputProps={{ 'aria-label': 'Display in App' }} /> */}
                        <FormGroup className="mt-16 popup-button-div">
                          <FormControlLabel
                            control={
                              <Switch
                                checked={show_in_app === 1 ? true : false}
                                onChange={(e) => handleChangeToggle(e)}
                              />
                            }
                            label="Display in App"
                          />
                        </FormGroup>
                      </Grid>
                      {/* <TextField
                                            className="mt-16"
                                            label="Upload Image Files"
                                            name="imgFile"
                                            type="file"
                                            // value={manualImgList}
                                            error={manualImgErr.length > 0 ? true : false}
                                            helperText={manualImgErr}
                                            onChange={(e) => HandleManualFile(e)}
                                            variant="outlined"
                                            fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            inputProps={{
                                                multiple: true
                                            }}
                                        /> */}
                      <Grid
                        item
                        xs={4}
                        style={{
                          padding: 0,
                          paddingInline: "12px",
                          paddingRight: "0px",
                        }}
                      >
                        <Button
                          variant="contained"
                          component="span"
                          style={{ backgroundColor: "#415BD4", color: "white" }}
                          className="mt-16"
                        >
                          <label htmlFor="contained-button-file">
                            <input
                              id="contained-button-file"
                              type="file"
                              style={{ display: "none" }}
                              onChange={(e) => {
                                HandleManualFile(e);
                              }}
                              multiple
                            />
                            Upload Image Files
                          </label>
                        </Button>
                        <label className="ml-16">Max 5 image </label>
                      </Grid>
                    </Grid>

                    <Grid container spacing={3} className=" mt-16">
                      {imgUrlList.map((item, index) => (
                        <Grid
                          item
                          xs={2}
                          style={{ position: "relative" }}
                          key={index}
                          className="ml-16 mt-16"
                        >
                          <img
                            src={item}
                            // style={{ width: "100px", height: "100px" }}
                            // onClick={() => { setModalView(true); setDisplayImage(image_file[0].image_file) }}
                          />

                          <IconButton
                            size="small"
                            onClick={(e) => handleDelete(index)}
                            className="icone-circle"
                            style={{ backgroundColor: "red" }}
                          >
                            <Icon style={{ color: "white" }}>close</Icon>
                          </IconButton>
                        </Grid>
                      ))}
                      {/* <div style={{ display: 'flex', flexDirection: 'row' }}>
                                            {imgUrlList.map((item, index) => (
                                                <div style={{ position: "relative" }} key={index} className="ml-16 mt-16">
                                                    <img src={item} style={{ width: "100px", height: "100px" }}
                                                    // onClick={() => { setModalView(true); setDisplayImage(image_file[0].image_file) }} 
                                                    />

                                                    <IconButton size="small"
                                                        onClick={(e) => handleDelete(index)}
                                                        className="icone-circle" style={{ backgroundColor: "red" }}>
                                                        <Icon style={{ color: "white" }}>close</Icon>
                                                    </IconButton>

                                                </div>
                                            ))}                                            
                                        </div> */}
                    </Grid>

                    <Grid container spacing={3} className=" mt-16">
                      <Grid
                        item
                        lg={12}
                        xs={4}
                        style={{
                          padding: 0,
                          paddingInline: "12px",
                          paddingRight: "0px",
                        }}
                      >
                        <Table className="mt-16">
                          <TableHead>
                            <TableRow>
                              <TableCell className={classes.tableRowPad}>
                                Image
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="center"
                              >
                                Design/Variant Number
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                align="center"
                              >
                                Action
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {designVariantList.map((row, index) => (
                              <TableRow key={index}>
                                {/* <TableCell className={classes.tableRowPad}>
                                                    <Checkbox type="checkbox" value={JSON.stringify(row)} onChange={handleDefaultSelect} checked={selectedDefDesign == row.id ? true : false} />
                                                </TableCell> */}
                                <TableCell className={classes.tableRowPad}>
                                  {row.image_files.length > 0 && (
                                    <img
                                      src={row.image_files[0].image_file}
                                      height={50}
                                      width={50}
                                    />
                                  )}
                                </TableCell>

                                <TableCell
                                  align="center"
                                  className={classes.tableRowPad}
                                >
                                  {row.variant_number}
                                </TableCell>
                                <TableCell
                                  align="center"
                                  className={classes.tableRowPad}
                                >
                                  <IconButton
                                    style={{ padding: "0" }}
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      ev.stopPropagation();
                                      deleteHandler(index);
                                    }}
                                  >
                                    <Icon className="mr-8 delete-icone">
                                      <img src={Icones.delete_red} alt="" />
                                    </Icon>
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Grid>
                      <Grid
                        item
                        xs={4}
                        lg={12}
                        className="mt-10"
                        style={{ padding: "0px" }}
                      >
                        <Button
                          className="float-right"
                          variant="contained"
                          color="primary"
                          id="btn-save"
                          style={{
                            backgroundColor: "#415BD4",
                            border: "none",
                            color: "white",
                          }}
                          onClick={(e) => handleManualAdd(e)}
                        >
                          Save
                        </Button>
                      </Grid>
                    </Grid>
                  </>
                )}
                 {radioValue === "3" &&
                      <Grid container spacing={3}>
                          <Grid item lg={3} xs={4} style={{ paddingInline: "12px" }}>
                          <p className="popup-labl mt-10">Upload CSV Combination Update Excel File</p>
                              <TextField
                              id="fileinput"
                                  className="mt-16 mb-16"
                                  // label="Upload CSV Combination Update Excel File"
                                  name="variantFile"
                                  type="file"
                                  error={variantFileErr.length > 0 ? true : false}
                                  helperText={variantFileErr}
                                  onChange={(e) => HandleFile(e)}
                                  variant="outlined"
                                  fullWidth
                                  InputLabelProps={{
                                      shrink: true,
                                  }}
                              />
                              </Grid>
                              <Grid lg={3} style={{ marginTop: "57px" }}>
                                <a href={sampleFile} download="Design_Comb_Variant.csv">
                                  Download Sample{" "}
                                </a>
                              </Grid>
                            <Grid lg={12}>
                            <Button
                              className="float-right mr-8"
                              variant="contained"
                              color="primary"
                              id="btn-save"
                              // style={{
                              //     backgroundColor: "#415BD4",
                              //     border: "none",
                              //     color: "white",
                              // }}
                              onClick={(e) => handleFileUpload(e)}
                            >
                              Upload
                            </Button>
                            </Grid>
                          </Grid>
                  }
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default CollectionVariantWise;
