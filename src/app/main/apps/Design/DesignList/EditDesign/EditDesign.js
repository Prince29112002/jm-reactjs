import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import BreadcrumbsHelper from "../../../../BreadCrubms/BreadcrumbsHelper";
import clsx from "clsx";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as authActions from "app/auth/store/actions";
import * as Actions from "app/store/actions";
import {
  TextField,
  Card,
  CardContent,
  Icon,
  IconButton,
  ImageListItem,
  ImageList,
  Switch,
  FormGroup,
  FormControlLabel,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import History from "@history";
import { Typography } from "@material-ui/core";
import DisplayImage from "../SubViews/DisplayImage";
import Loader from "../../../../Loader/Loader";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Modal from "@material-ui/core/Modal";
import TableFooter from "@material-ui/core/TableFooter";
import Select, { createFilter } from "react-select";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
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
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "cornflowerblue",
    color: "white",
  },
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    height: "100%",
  },
  table: {
    //  minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  tableFooter: {
    padding: 7,
    backgroundColor: "#E3E3E3",
  },
  searchBox: {
    padding: 6,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
  },
  hoverClass: {
    // backgroundColor: "#fff",
    color: "#1e90ff",
    "&:hover": {
      // backgroundColor: "#999",
      cursor: "pointer",
    },
  },
}));

const EditDesign = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [modalView, setModalView] = useState(false);
  const [displayImage, setDisplayImage] = useState("");
  const [cad_number, setCardNumber] = useState("");
  const [design_num, setDesignNum] = useState("");
  const [remark, setRemark] = useState("");
  const [categorygroup, setCategoryGroup] = useState("");
  const [category, setCategory] = useState("");
  const [collection, setCollection] = useState("");
  const [variant_attribute, setVariantAttribute] = useState("");
  const [netWeightInclude, setNetWeightInclude] = useState(0);
  const [settingmethod, setSettingMethod] = useState("");
  const [settingmethodErr, setSettingMethodErr] = useState("");
  const [showinapp, setShowInApp] = useState("");
  const [manuallyshowinapp, setManuallyShowInApp] = useState("");
  const [variantCollection, setVariantCollection] = useState([]);
  const [parentVariantCollection, setParentVariantCollection] = useState("");
  const [sizeCollection, setSizeCollection] = useState([]);
  const [sizeParentCollection, setSizeParentCollection] = useState("");
  const [settingMehodList, setSettingMehodList] = useState([]);
  const [size, setSize] = useState("");
  const [catMainGroup, setCatMainGroup] = useState("");
  const [image_file, setImageFile] = useState([]);
  const [imageUploadFile, setImageUploadFile] = useState(null);

  const [designArr, setDesignArr] = useState([]);
  const [moldDetails, setMoldDetails] = useState([]);
  const [stoneData, setStoneData] = useState([]);
  const [findingData, setFindingData] = useState([]);
  const [findingSilverData, setFindingSilverData] = useState([]);
  const [otherData, setOtherData] = useState([]);
  const [loading, setLoading] = useState(true);

  let [totalStonePcs, setTotalStonePcs] = useState(0);
  let [stoneActWgt, setStoneActWgt] = useState(0);
  let [weightToShow, setWeightToShow] = useState(0);
  let [totalAmount, setTotalAmount] = useState(0);

  let [totalMoldPcs, setTotalMoldPcs] = useState(0);
  let [totalMoldVolume, setTotalMoldVolume] = useState(0);

  let [totalOtherWgt, setTotalOtherWgt] = useState(0);
  let [totalSilverwgt, setTotalSilverwgt] = useState(0);

  const [goldFinding, setGoldFinding] = useState("");
  const [silverFinding, setSilverFinding] = useState("");
  const [otherFinding, setOtherFinding] = useState("");

  const [stockList, setStockList] = useState([]);
  const [baggingList, setBaggingList] = useState([]);
  const [typeOfSettingList, setTypeOfSettingList] = useState([]);

  const [viewStatus, setViewStatus] = useState("");
  const [viewStatusId, setViewStatusId] = useState("");

  const [karatWiseWgtArr, setkaratWiseWgtArr] = useState([]);

  const [isView, setIsView] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  let [forteenKaratTotal, setForteenKaratTotal] = useState(0);
  let [eighteenKaratTotal, setEighteenKaratTotal] = useState(0);
  let [twentyTwoKaratTotal, setTwentyTwoKaratTotal] = useState(0);
  let [twentyFourKaratTotal, setTwentyFourKaratTotal] = useState(0);

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
    getStockCode();
    getDroupDown(1);
    getDroupDown(2);
    getDroupDown(3);
    getDesignData();
    if (props.location && props.location.state) {
      setIsView(props.location.state.isView);
      setIsEdit(props.location.state.isEdit);
    }
  }, []);

  useEffect(() => {
    NavbarSetting("Design", dispatch);
  }, []);

  useEffect(() => {
    if (viewStatusId) {
      callUpdateDesignApi();
    }
  }, [viewStatus]);

  const handleChangeToggle = (event, id) => {
    const status = event.target.checked;
    if (status) {
      setViewStatus(1);
    } else if (!status) {
      setViewStatus(0);
    }
  };

  function editHandler(variant_number) {
    getDesignData(variant_number);
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
          } else if (flag === 2) {
            setBaggingList(arrData);
          } else if (flag === 3) {
            setTypeOfSettingList(arrData);
          }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        console.log(error);
        handleError(error, dispatch, {
          api: `api/designDropDown?flag=${flag}`,
        });
      });
  }

  function getStockCode() {
    axios
      .get(Config.getCommonUrl() + "api/stockname/stone")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          const stockData = response.data.data;
          setStockList(stockData);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        console.log(error);
        handleError(error, dispatch, { api: "api/stockname/stone" });
      });
  }

  function getDesignData(id) {
    setLoading(true);
    const v_id = id
      ? id
      : props.location.state
      ? props.location.state.id
      : props.location.pathname?.split("/")[4];
    if (v_id) {
      axios
        .get(Config.getCommonUrl() + `api/design/${v_id}`)
        .then((res) => {
          const designData = res.data.design;
          setDesignArr(designData);
          setCardNumber(
            designData.CadNumber ? designData.CadNumber.cad_number : ""
          );
          setDesignNum(
            designData.variant_number ? designData.variant_number : ""
          );
          setVariantAttribute(
            designData.variant_attribute ? designData.variant_attribute : ""
          );
          setRemark(designData.remark ? designData.remark : "");
          setCategoryGroup(
            designData.Category ? designData.Category.category_code : ""
          );
          setCatMainGroup(
            designData.CategoryGroup
              ? designData.CategoryGroup.category_group_name
              : ""
          );
          setCategory(
            designData.Category ? designData.Category.category_name : ""
          );
          setCollection(designData.collection ? designData.collection : "");
          setSettingMethod({
            value: designData.SettingMethod.id,
            label: designData.SettingMethod.method,
          });
          setShowInApp(designData.show_in_app);
          setManuallyShowInApp(designData.manual_show_in_app);
          setVariantCollection(
            designData.MainVariantCombination
              ? designData.MainVariantCombination
              : []
          );
          setParentVariantCollection(
            designData.ParentVariantCombination
              ? designData.ParentVariantCombination
              : ""
          );
          setSizeCollection(
            designData.MainSizeCombination ? designData.MainSizeCombination : []
          );
          setSizeParentCollection(
            designData.ParentSizeCombination
              ? designData.ParentSizeCombination
              : ""
          );
          setSize(designData.size ? designData.size : "");
          setNetWeightInclude(designData.netWeightToBeIncluded);
          let moldVol = 0;
          let moldpcs = 0;
          const moldData = designData.design_molds.map((item) => {
            moldpcs += item.mold_pcs;
            moldVol += item.total_volume;
            return {
              ...item,
              errors: {},
            };
          });
          setMoldDetails(moldData);
          setTotalMoldVolume(moldVol);
          setTotalMoldPcs(moldpcs);
          if (
            designData.CategoryGroup &&
            designData.CategoryGroup.category_group_name !== "PL"
          ) {
            const stoneViewData = [];
            let stonpcs = 0;
            let stonwgt = 0;
            let tamount = 0;
            let wgttoshow = 0;
            designData.design_mold_stocks.map((item) => {
              if (item.hasOwnProperty("stone") && item.stone === 1) {
                stonpcs += item.stone_pcs;
                stonwgt += parseFloat(item.actual_weight);
                wgttoshow += parseFloat(item.weightToShow);
                tamount += parseFloat(item.amount);
                stoneViewData.push({ ...item, errors: {} });
              }
            });
            setStoneData(stoneViewData);
            setStoneActWgt(stonwgt);
            setWeightToShow(wgttoshow);
            setTotalStonePcs(stonpcs);
            setTotalAmount(tamount);
          }
          let findingGold = [];
          let findingSilver = [];
          let otherRaw = [];
          designData.design_findings.filter((item) => {
            if (item.hasOwnProperty("findings") && item.findings === 1) {
              setGoldFinding(item.findings);
              if (Object.keys(item.karatWiseGoldFindings)[0] === "Yellow") {
                findingGold.push({ ...item });
              } else if (
                Object.keys(item.karatWiseGoldFindings)[0] === "Rose"
              ) {
                findingGold.push({ ...item });
              } else if (
                Object.keys(item.karatWiseGoldFindings)[0] === "White"
              ) {
                findingGold.push({ ...item });
              }
            } else if (item.hasOwnProperty("findings") && item.findings === 2) {
              setSilverFinding(item.findings);
              findingSilver = [...findingSilver, ...item.silverFindings];
            } else if (item.hasOwnProperty("findings") && item.findings === 3) {
              setOtherFinding(item.findings);
              otherRaw = [...otherRaw, ...item.otherRawMaterial];
            }
          });
          let totherwgt = 0;
          let tsilverwgt = 0;
          otherRaw.map((item) => (totherwgt += parseFloat(item.weight)));
          findingSilver.map((item) => (tsilverwgt += parseFloat(item.weight)));
          let forteen = 0;
          let eighteen = 0;
          let twenty = 0;
          let twentyTwo = 0;

          findingGold.map((item) => {
            const keydata = Object.keys(item.karatWiseGoldFindings)[0];
            item.karatWiseGoldFindings[keydata].map((temp) => {
              if (temp.karat == 14 && temp.weight !== null) {
                forteen += parseFloat(temp.weight);
              } else if (temp.karat == 18 && temp.weight !== null) {
                eighteen += parseFloat(temp.weight);
              } else if (temp.karat == 20 && temp.weight !== null) {
                twenty += parseFloat(temp.weight);
              } else if (temp.karat == 22 && temp.weight !== null) {
                twentyTwo += parseFloat(temp.weight);
              }
            });
          });
          setForteenKaratTotal(forteen);
          setEighteenKaratTotal(eighteen);
          setTwentyTwoKaratTotal(twenty);
          setTwentyFourKaratTotal(twentyTwo);
          setTotalSilverwgt(tsilverwgt);
          setTotalOtherWgt(totherwgt);
          setFindingData(findingGold);
          setFindingSilverData(findingSilver);
          setOtherData(otherRaw);

          setkaratWiseWgtArr(designData.design_weights);
          setImageFile(designData.image_files ? designData.image_files : "");
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          handleError(error, dispatch, { api: `api/design/${v_id}` });
        });
    }
  }

  const handleMethodChange = (method) => {
    console.log(method);
    setSettingMethod(method);
    setSettingMethodErr("");
  };

  const handleStockChange = (stock, index) => {
    console.log(stock);
    const dataArr = [...stoneData];

    dataArr[index].stock_name.stock_code = stock.label;
    dataArr[index].stock_name.id = stock.value;
    if (dataArr[index].errors.stockCode) {
      dataArr[index].errors.stockCode = "";
    }
    setStoneData(dataArr);
  };

  const handleFirstSelect = (stock, index) => {
    console.log(stock);
    const dataArr = [...stoneData];

    dataArr[index].BaggingMaster.bagging = stock.label;
    dataArr[index].BaggingMaster.id = stock.value;
    if (dataArr[index].errors.bagging) {
      dataArr[index].errors.bagging = "";
    }
    setStoneData(dataArr);
  };

  const handleSecoundSelect = (stock, index) => {
    console.log(stock);
    const dataArr = [...stoneData];

    dataArr[index].TypeOfSettingMaster.type = stock.label;
    dataArr[index].TypeOfSettingMaster.id = stock.value;
    if (dataArr[index].errors.type_of_setting) {
      dataArr[index].errors.type_of_setting = "";
    }
    setStoneData(dataArr);
  };

  const validateEmptyError = (data) => {
    let flag = true;
    data.map((item) => {
      if (!errorCheck(item.errors)) {
        flag = false;
      }
    });
    return flag;
  };

  const errorCheck = (error) => {
    let valid = true;
    Object.values(error).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  function validateSettingmethod() {
    if (settingmethod === "") {
      setSettingMethodErr("Select Setting Method");
      return false;
    }
    return true;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateSettingmethod() && validateEmptyError(stoneData)) {
      callUpdateDesignApi();
    }
  };

  function callUpdateDesignApi() {
    const v_id = designArr.id;
    const formData = new FormData();
    if (imageUploadFile !== null) {
      const newObj = image_file;
      for (let i = 0; i < imageUploadFile.length; i++) {
        formData.append("image_files", imageUploadFile[i]);
        newObj.push({
          image_file_name: imageUploadFile[i].name,
        });
      }
      setImageFile(newObj);
    }

    const moldStock = stoneData.map((item) => {
      return {
        id: item.id,
        type_of_setting_id: item.TypeOfSettingMaster.id,
        bagging_id: item.BaggingMaster.id,
        stock_name_id: item.stock_name.id,
      };
    });
    formData.append("design_images", JSON.stringify(image_file));
    formData.append("setting_method_id", settingmethod.value);
    formData.append("show_in_app", showinapp);
    formData.append("manual_show_in_app", manuallyshowinapp);
    formData.append("design_mold_stocks", JSON.stringify(moldStock));
    formData.append("size", size);
    formData.append("remark", remark);
    axios
      .put(Config.getCommonUrl() + `api/design/update/${v_id}`, formData)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          History.push("/dashboard/design", { view: 2 });
          dispatch(Actions.showMessage({ message: "Edited SuccessFully" }));
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        console.log(error);
        handleError(error, dispatch.apply, {
          api: `api/design/update/${v_id}`,
          body: JSON.stringify(formData),
        });
      });
  }

  const handleCloseImage = () => {
    setModalView(false);
  };

  const handleDelete = (e, img) => {
    if (window.confirm("Are you sure you want to delete this image ?")) {
      let imgArr = image_file.filter((s) => {
        if (s.image_file !== img.image_file) return s;
        return false;
      });
      setImageFile(imgArr);
      callImageDeleteApi(img);
    }
  };

  function callImageDeleteApi(img) {
    const v_id = designArr.id;
    const body = {
      id: img.id,
      design_id: v_id,
      image_file: img.image_file_name,
    };
    console.log(body);
    axios
      .post(Config.getCommonUrl() + `api/design/deleteImage`, body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          dispatch(
            Actions.showMessage({ message: "Image deleted Successfully" })
          );
        }
      })
      .catch((error) => {
        console.log(error);
        handleError(error, dispatch, {
          api: `api/design/deleteImage`,
          body: body,
        });
      });
  }

  const getCaratWeight = (karat, finding) => {
    let weight = "";
    finding.karatWiseGoldFindings[
      Object.keys(finding.karatWiseGoldFindings)[0]
    ].map((i) => {
      if (i.karat == karat) {
        weight = i.weight == null ? "-" : i.weight;
      }
    });
    return weight;
  };

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0  makeStyles-root-1 pt-20">
            <Grid
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={4} md={3} key="1" style={{ padding: 0 }}>
              <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Design Update
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper /> <b>{isView ? "View" : "Update"}</b> */}
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                md={9}
                key="2"
                style={{ textAlign: "right", paddingRight: "47px" }}
              >
                 <div className="btn-back mt-4">
                  {" "}
                  <img src={Icones.arrow_left_pagination} alt="" />
                  <Button
                    id="btn-back"
                    size="small"
                    onClick={(event) => {
                      History.push("/dashboard/design", { view: 2 });
                    }}
                  >
                    Back
                  </Button>
                </div>
                {isEdit && (
                  <Button
                    id="btn-save"
                    variant="contained"
                  className={clsx(classes.button, "mr-5, float-right")}
                    size="small"
                    style={{
                      backgroundColor: "#4caf50",
                      border: "none",
                      color: "white",
                    }}
                    onClick={handleSubmit}
                  >
                    Save
                  </Button>
                )}
              </Grid>
            </Grid>
            <Grid
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={6} sm={4} md={3} style={{ padding: 10 }}>
                 <label>Cad number</label>
                  <TextField
                    className="mb-16 mt-1"
                    placeholder="Cad number"
                    autoFocus
                    name="cad_number"
                    value={cad_number}
                    variant="outlined"
                    required
                    fullWidth
                    disabled
                  />
              </Grid>
              <Grid item xs={6} sm={4} md={3} style={{ paddingLeft: 20 }}>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={showinapp === 1 ? true : false}
                        disabled
                        onChange={() => setShowInApp(showinapp === 1 ? 0 : 1)}
                      />
                    }
                    label="Display in App"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={manuallyshowinapp === 1 ? true : false}
                        disabled={isView}
                        onChange={() =>
                          setManuallyShowInApp(manuallyshowinapp === 1 ? 0 : 1)
                        }
                      />
                    }
                    label="Manually Display in App"
                  />
                </FormGroup>
              </Grid>
            </Grid>
            {loading && <Loader />}
            <Grid
              className="editdesign-main-blg"
              style={{ backgroundColor: "#F5F5F5" }}
            >
              <Grid className="editdesign-mb" container spacing={3}>
                <Grid item xs={3} style={{ padding: 5 }}>
                  <Grid container spacing={3}>
                    {image_file.length > 0 && (
                      <Grid item xs={12} style={{ position: "relative" }}>
                        <img
                          alt="img"
                          src={image_file[0].image_file}
                          style={{ width: "500px", height: "auto" }}
                          onClick={() => {
                            setModalView(true);
                            setDisplayImage(image_file[0].image_file);
                          }}
                        />
                        <a
                          href={image_file[0].image_file}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Icon>get_app</Icon>
                        </a>
                        {isEdit && (
                          <IconButton
                            size="small"
                            onClick={(e) => handleDelete(e, image_file[0])}
                            className="icone-circle"
                            style={{ backgroundColor: "red" }}
                          >
                            <Icon style={{ color: "white" }}>close</Icon>
                          </IconButton>
                        )}
                      </Grid>
                    )}

                    {image_file.length > 1 &&
                      image_file.map((img, i) => {
                        if (i === 0) {
                          return null;
                        }
                        return (
                          <>
                            <Grid
                              item
                              xs={4}
                              key={i}
                              style={{ position: "relative" }}
                            >
                              <img
                                src={img.image_file}
                                style={{ width: "100px", height: "100px" }}
                                onClick={() => {
                                  setModalView(true);
                                  setDisplayImage(img.image_file);
                                }}
                              />
                              {console.log(img.image_file)}
                              <a
                                href={img.image_file}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Icon>get_app</Icon>
                              </a>

                              {isEdit && (
                                <IconButton
                                  size="small"
                                  onClick={(e) => handleDelete(e, img)}
                                  style={{ backgroundColor: "red" }}
                                  className="icone-circle"
                                >
                                  <Icon style={{ color: "white" }}>close</Icon>
                                </IconButton>
                              )}
                            </Grid>
                          </>
                        );
                      })}

                    {modalView === true && (
                      <DisplayImage
                        modalColsed={handleCloseImage}
                        image={displayImage}
                      />
                    )}
                    {!isView && (
                      <Grid
                        item
                        xs={12}
                        sm={10}
                        md={10}
                        style={{ textAlign: "center" }}
                      >
                        <Typography className="mb-4">
                          <b>
                            {imageUploadFile
                              ? `${imageUploadFile.length} File selected`
                              : ""}
                          </b>
                        </Typography>
                        <Button
                          variant="contained"
                          component="span"
                          style={{ backgroundColor: "#283428", color: "white" }}
                        >
                          <label htmlFor="contained-button-file">
                            <input
                              id="contained-button-file"
                              type="file"
                              style={{ display: "none" }}
                              onChange={(event) => {
                                setImageUploadFile(event.target.files);
                              }}
                              multiple
                            />
                            Upload Image
                          </label>
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </Grid>

                <Grid item xs={9}>
                  <Grid
                    container
                    spacing={3}
                    style={{ backgroundColor: "#F5F5F5" }}
                  >
                    <Grid item xs={12}>
                      <Card>
                        <CardContent>
                          <Grid container spacing={3}>
                            <Grid item xs={2} md={4} sm={4} col={12}>
                            <label>Design number</label>
                              <TextField
                                className="mb-16 mt-1"
                                name="design_num"
                                value={design_num}
                                variant="outlined"
                                required
                                fullWidth
                                disabled
                              />
                            </Grid>
                            <Grid item xs={2} md={4} sm={4} col={12}>
                            <label>Variant attribute</label>
                              <TextField
                                className="mb-16 mt-1"
                                name="variant_attribute"
                                value={variant_attribute}
                                variant="outlined"
                                fullWidth
                                disabled
                              />
                            </Grid>
                            <Grid item xs={2} md={4} sm={4} col={12}>
                            <label>Setting method</label>
                              <Select
                                filterOption={createFilter({
                                  ignoreAccents: false,
                                })}
                                className={classes.selectBox}
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
                                isDisabled={isView}
                              />
                              <span style={{ color: "red" }}>
                                {settingmethodErr.length > 0
                                  ? settingmethodErr
                                  : ""}
                              </span>
                            </Grid>
                            <Grid item xs={2} md={4} sm={4} col={12}>
                            <label>Category group</label>
                              <TextField
                                className="mb-16 mt-1"
                                name="categorygroup"
                                value={categorygroup}
                                variant="outlined"
                                required
                                fullWidth
                                disabled
                              />
                            </Grid>
                            <Grid item xs={2} md={4} sm={4} col={12}>
                            <label>Category</label>
                              <TextField
                                className="mb-16 mt-1"
                                name="category"
                                value={category}
                                variant="outlined"
                                required
                                fullWidth
                                disabled
                              />
                            </Grid>
                            <Grid item xs={2} md={4} sm={4} col={12}>
                            <label>Collection</label>
                              <TextField
                                className="mb-16 mt-1"
                                name="collection"
                                value={collection}
                                variant="outlined"
                                required
                                fullWidth
                                disabled
                              />
                            </Grid>
                            <Grid item xs={2} md={4} sm={4} col={12}>
                            <label>Size</label>
                              <TextField
                                className="mb-16 mt-1"
                                name="size"
                                value={size}
                                onChange={(e) => setSize(e.target.value)}
                                variant="outlined"
                                required
                                fullWidth
                                disabled={isView}
                              />
                            </Grid>
                            <Grid item xs={8} md={8} sm={8}>
                            <label>Remarks</label>
                              <TextField
                                className="mb-16 mt-1"
                                name="remark"
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                                variant="outlined"
                                fullWidth
                                disabled={isView}
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  <div
                    id="inner-createpacket-tbl-dv"
                    className="mt-16 table-responsive"
                  >
                    <MaUTable className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            className={classes.tableRowPad}
                          ></TableCell>

                          {karatWiseWgtArr.map((items) => (
                            <TableCell
                              colSpan={2}
                              className={classes.tableRowPad}
                              style={{ textAlign: "center" }}
                            >
                              {items.karat} Karat
                            </TableCell>
                          ))}
                        </TableRow>
                        <TableRow>
                          <TableCell
                            className={classes.tableRowPad}
                          ></TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Actual Wgt
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Show in Wgt
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Actual Wgt
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Show in Wgt
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Actual Wgt
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Show in Wgt
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Actual Wgt
                          </TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Show in Wgt
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {karatWiseWgtArr.length > 0 && (
                          <>
                            <TableRow>
                              <TableCell
                                className={classes.tableRowPad}
                                component="th"
                              >
                                Net Weight
                              </TableCell>
                              {karatWiseWgtArr.map((item) => {
                                if (item.karat === 14) {
                                  return (
                                    <>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {item.net_weight < 0
                                          ? "0.000"
                                          : item.net_weight}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {item.net_weight_show < 0
                                          ? "0.000"
                                          : item.net_weight_show}
                                      </TableCell>
                                    </>
                                  );
                                } else if (item.karat === 18) {
                                  return (
                                    <>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {item.net_weight < 0
                                          ? "0.000"
                                          : item.net_weight}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {item.net_weight_show < 0
                                          ? "0.000"
                                          : item.net_weight_show}
                                      </TableCell>
                                    </>
                                  );
                                } else if (item.karat === 20) {
                                  return (
                                    <>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {item.net_weight < 0
                                          ? "0.000"
                                          : item.net_weight}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {item.net_weight_show < 0
                                          ? "0.000"
                                          : item.net_weight_show}
                                      </TableCell>
                                    </>
                                  );
                                } else if (item.karat === 22) {
                                  return (
                                    <>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {item.net_weight < 0
                                          ? "0.000"
                                          : item.net_weight}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {item.net_weight_show < 0
                                          ? "0.000"
                                          : item.net_weight_show}
                                      </TableCell>
                                    </>
                                  );
                                }
                              })}
                            </TableRow>
                            <TableRow>
                              <TableCell
                                className={classes.tableRowPad}
                                component="th"
                              >
                                Gross Weight
                              </TableCell>
                              {karatWiseWgtArr.map((item) => {
                                if (item.karat === 14) {
                                  return (
                                    <>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {item.gross_weight < 0
                                          ? "0.000"
                                          : item.gross_weight}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {item.gross_weight_show < 0
                                          ? "0.000"
                                          : item.gross_weight_show}
                                      </TableCell>
                                    </>
                                  );
                                } else if (item.karat === 18) {
                                  return (
                                    <>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {item.gross_weight < 0
                                          ? "0.000"
                                          : item.gross_weight}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {item.gross_weight_show < 0
                                          ? "0.000"
                                          : item.gross_weight_show}
                                      </TableCell>
                                    </>
                                  );
                                } else if (item.karat === 20) {
                                  return (
                                    <>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {item.gross_weight < 0
                                          ? "0.000"
                                          : item.gross_weight}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {item.gross_weight_show < 0
                                          ? "0.000"
                                          : item.gross_weight_show}
                                      </TableCell>
                                    </>
                                  );
                                } else if (item.karat === 22) {
                                  return (
                                    <>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {item.gross_weight < 0
                                          ? "0.000"
                                          : item.gross_weight}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {item.gross_weight_show < 0
                                          ? "0.000"
                                          : item.gross_weight_show}
                                      </TableCell>
                                    </>
                                  );
                                }
                              })}
                            </TableRow>
                          </>
                        )}
                      </TableBody>
                    </MaUTable>
                  </div>

                  <Grid container spacing={3}>
                    <Grid item xs={4}>
                      <Typography className="mt-16">
                        <b>Mold Details</b>
                      </Typography>
                    </Grid>
                  </Grid>
                  {moldDetails.length > 0 && (
                    <div
                      id="inner-createpacket-tbl-dv"
                      className={
                        moldDetails.length >= 5
                          ? `table-responsive hallmarkrejection-firsttabel`
                          : `table-responsive`
                      }
                    >
                      <MaUTable className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.tableRowPad}>
                              Mold Number
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Mold Volume
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Mold Pieces
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Total Volume
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {moldDetails.map((mData, i) => (
                            <TableRow key={i}>
                              <TableCell className={classes.tableRowPad}>
                                {mData.mold_number}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {mData.mold_volume}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {mData.mold_pcs}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {parseFloat(mData.total_volume).toFixed(3)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell
                              className={classes.tableFooter}
                            ></TableCell>
                            <TableCell
                              className={classes.tableFooter}
                            ></TableCell>
                            <TableCell className={classes.tableFooter}>
                              <b>{totalMoldPcs}</b>
                            </TableCell>
                            <TableCell className={classes.tableFooter}>
                              <b>{totalMoldVolume.toFixed(3)}</b>
                            </TableCell>
                          </TableRow>
                        </TableFooter>
                      </MaUTable>
                    </div>
                  )}
                  {goldFinding === 1 && (
                    <Grid container spacing={3}>
                      <Grid item xs={6}>
                        <Typography className="mt-16">
                          <b>Gold Finding Details</b>
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                  {goldFinding === 1 && (
                    <div
                      id="inner-createpacket-tbl-dv"
                      className={
                        findingData.length >= 5
                          ? `table-responsive hallmarkrejection-firsttabel`
                          : `table-responsive`
                      }
                    >
                      <MaUTable className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.tableRowPad}>
                              Finding Name
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Finding Color
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              14 Karat
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              18 Karat
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              20 Karat
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              22 Karat
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {findingData.map((finding, i) => (
                            <TableRow key={i}>
                              <TableCell className={classes.tableRowPad}>
                                {finding.finding_name}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {finding.karatWiseGoldFindings
                                  ? Object.keys(
                                      finding.karatWiseGoldFindings
                                    )[0]
                                  : ""}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {getCaratWeight(14, finding)}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {getCaratWeight(18, finding)}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {getCaratWeight(20, finding)}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {getCaratWeight(22, finding)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell
                              className={classes.tableFooter}
                            ></TableCell>
                            <TableCell
                              className={classes.tableFooter}
                            ></TableCell>
                            <TableCell className={classes.tableFooter}>
                              <b>{forteenKaratTotal.toFixed(3)}</b>
                            </TableCell>
                            <TableCell className={classes.tableFooter}>
                              <b>{eighteenKaratTotal.toFixed(3)}</b>
                            </TableCell>
                            <TableCell className={classes.tableFooter}>
                              <b>{twentyTwoKaratTotal.toFixed(3)}</b>
                            </TableCell>
                            <TableCell className={classes.tableFooter}>
                              <b>{twentyFourKaratTotal.toFixed(3)}</b>
                            </TableCell>
                          </TableRow>
                        </TableFooter>
                      </MaUTable>
                    </div>
                  )}

                  {stoneData.length > 0 && (
                    <>
                      <Grid container spacing={3}>
                        <Grid item xs={4}>
                          <Typography className="mt-16">
                            <b>Stone Details</b>
                          </Typography>
                        </Grid>
                      </Grid>
                      <div
                        id="inner-createpacket-tbl-dv"
                        className={
                          stoneData.length > 5
                            ? `table-responsive hallmarkrejection-firsttabel`
                            : `table-responsive`
                        }
                        style={{ overflowX: "inherit", height: "500px" }}
                      >
                        <MaUTable className={classes.table}>
                          <TableHead>
                            <TableRow>
                              <TableCell
                                className={classes.tableRowPad}
                                width={180}
                              >
                                Stock ID
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Stock Name
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Discription
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Color
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Shape
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Size
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Pieces
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Actual Weight
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Weight To Show
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                width={150}
                              >
                                WAX/Metal Bagging
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                width={150}
                              >
                                Type Of Setting
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                Amount
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {stoneData.map((sData, i) => (
                              <TableRow key={i}>
                                <TableCell
                                  className={classes.tableRowPad}
                                  width={150}
                                >
                                  <Select
                                    filterOption={createFilter({
                                      ignoreAccents: false,
                                    })}
                                    className={classes.selectBox}
                                    classes={classes}
                                    styles={selectStyles}
                                    options={stockList.map((suggestion) => ({
                                      value: suggestion.stock_name_code.id,
                                      label:
                                        suggestion.stock_name_code.stock_code,
                                    }))}
                                    value={
                                      sData.stock_name
                                        ? {
                                            value: sData.stock_name.id,
                                            label: sData.stock_name.stock_code,
                                          }
                                        : ""
                                    }
                                    onChange={(e) => {
                                      handleStockChange(e, i);
                                    }}
                                    isDisabled={isView}
                                  />
                                  <span style={{ color: "red" }}>
                                    {sData.errors.stockCode
                                      ? sData.errors.stockCode
                                      : ""}
                                  </span>
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {sData.stock_name &&
                                  sData.stock_name.stock_name_code
                                    ? sData.stock_name.stock_name_code
                                        .stock_name
                                    : ""}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {sData.stock_name &&
                                  sData.stock_name.stock_description
                                    ? sData.stock_name.stock_description
                                        .description
                                    : ""}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {sData.stock_name &&
                                  sData.stock_name.stone_color
                                    ? sData.stock_name.stone_color.name
                                    : ""}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {sData.stock_name &&
                                  sData.stock_name.stone_shape
                                    ? sData.stock_name.stone_shape.name
                                    : ""}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {sData.stock_name &&
                                  sData.stock_name.stone_size
                                    ? sData.stock_name.stone_size.size
                                    : ""}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {sData.stone_pcs}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {sData.actual_weight
                                    ? sData.actual_weight
                                    : ""}
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {sData.weightToShow ? sData.weightToShow : ""}
                                </TableCell>
                                <TableCell
                                  className={classes.tableRowPad}
                                  width={150}
                                >
                                  <Select
                                    filterOption={createFilter({
                                      ignoreAccents: false,
                                    })}
                                    className={classes.selectBox}
                                    classes={classes}
                                    styles={selectStyles}
                                    options={baggingList.map((suggestion) => ({
                                      value: suggestion.id,
                                      label: suggestion.bagging,
                                    }))}
                                    value={
                                      sData.BaggingMaster
                                        ? {
                                            value: sData.BaggingMaster.id,
                                            label: sData.BaggingMaster.bagging,
                                          }
                                        : ""
                                    }
                                    onChange={(e) => {
                                      handleFirstSelect(e, i);
                                    }}
                                    isDisabled={isView}
                                  />
                                  <span style={{ color: "red" }}>
                                    {sData.errors.bagging
                                      ? sData.errors.bagging
                                      : ""}
                                  </span>
                                </TableCell>
                                <TableCell
                                  className={classes.tableRowPad}
                                  width={150}
                                >
                                  <Select
                                    filterOption={createFilter({
                                      ignoreAccents: false,
                                    })}
                                    className={classes.selectBox}
                                    classes={classes}
                                    styles={selectStyles}
                                    options={typeOfSettingList.map(
                                      (suggestion) => ({
                                        value: suggestion.id,
                                        label: suggestion.type,
                                      })
                                    )}
                                    value={
                                      sData.TypeOfSettingMaster
                                        ? {
                                            value: sData.TypeOfSettingMaster.id,
                                            label:
                                              sData.TypeOfSettingMaster.type,
                                          }
                                        : ""
                                    }
                                    onChange={(e) => {
                                      handleSecoundSelect(e, i);
                                    }}
                                    isDisabled={isView}
                                  />
                                  <span style={{ color: "red" }}>
                                    {sData.errors.type_of_setting
                                      ? sData.errors.type_of_setting
                                      : ""}
                                  </span>
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  {/* {sData.weightToShow ? (sData.weightToShow*1000).toFixed(3) : ''} */}
                                  {sData.amount.toFixed(3)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                          <TableFooter>
                            <TableRow>
                              <TableCell
                                className={classes.tableFooter}
                              ></TableCell>
                              <TableCell
                                className={classes.tableFooter}
                              ></TableCell>
                              <TableCell
                                className={classes.tableFooter}
                              ></TableCell>
                              <TableCell
                                className={classes.tableFooter}
                              ></TableCell>
                              <TableCell
                                className={classes.tableFooter}
                              ></TableCell>
                              <TableCell
                                className={classes.tableFooter}
                              ></TableCell>
                              <TableCell className={classes.tableFooter}>
                                <b>{totalStonePcs}</b>
                              </TableCell>
                              <TableCell className={classes.tableFooter}>
                                <b>{stoneActWgt.toFixed(3)}</b>
                              </TableCell>
                              <TableCell className={classes.tableFooter}>
                                <b>{weightToShow.toFixed(3)}</b>
                              </TableCell>
                              <TableCell
                                className={classes.tableFooter}
                              ></TableCell>
                              <TableCell
                                className={classes.tableFooter}
                              ></TableCell>
                              <TableCell className={classes.tableFooter}>
                                <b>{totalAmount.toFixed(3)}</b>
                              </TableCell>
                            </TableRow>
                          </TableFooter>
                        </MaUTable>
                      </div>
                    </>
                  )}

                  {silverFinding === 2 && (
                    <Grid container spacing={3}>
                      <Grid item xs={6}>
                        <Typography className="mt-16">
                          <b>Silver Finding Details</b>
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                  {silverFinding === 2 && (
                    <div
                      id="inner-createpacket-tbl-dv"
                      className={
                        findingSilverData.length >= 5
                          ? `table-responsive hallmarkrejection-firsttabel`
                          : `table-responsive`
                      }
                    >
                      <MaUTable className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.tableRowPad}>
                              Stock Code
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Stock Name
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Stock Description
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Color
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Weight
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {findingSilverData.map((finding, i) => (
                            <TableRow key={i}>
                              <TableCell className={classes.tableRowPad}>
                                {finding.stock_code}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {finding.stock_name_code
                                  ? finding.stock_name_code.stock_name
                                  : ""}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {finding.stock_description
                                  ? finding.stock_description.description
                                  : ""}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {finding.gold_color
                                  ? finding.gold_color.name
                                  : ""}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {finding.weight ? finding.weight : ""}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell
                              className={classes.tableFooter}
                            ></TableCell>
                            <TableCell
                              className={classes.tableFooter}
                            ></TableCell>
                            <TableCell
                              className={classes.tableFooter}
                            ></TableCell>
                            <TableCell
                              className={classes.tableFooter}
                            ></TableCell>
                            <TableCell className={classes.tableFooter}>
                              <b>{totalSilverwgt.toFixed(3)}</b>
                            </TableCell>
                          </TableRow>
                        </TableFooter>
                      </MaUTable>
                    </div>
                  )}

                  {otherFinding === 3 && (
                    <Grid container spacing={3}>
                      <Grid item xs={6}>
                        <Typography className="mt-16">
                          <b>Other Raw Material Details</b>
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                  {otherFinding === 3 && (
                    <div
                      id="inner-createpacket-tbl-dv"
                      className={
                        findingSilverData.length >= 5
                          ? `table-responsive hallmarkrejection-firsttabel`
                          : `table-responsive`
                      }
                    >
                      <MaUTable className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.tableRowPad}>
                              Stock Code
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Stock Name
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Stock Description
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Color
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Shape
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Size
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Weight
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {otherData.map((finding, i) => (
                            <TableRow key={i}>
                              <TableCell className={classes.tableRowPad}>
                                {finding.stock_code}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {finding.stock_name_code
                                  ? finding.stock_name_code.stock_name
                                  : ""}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {finding.stock_description
                                  ? finding.stock_description.description
                                  : ""}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {finding.stone_color
                                  ? finding.stone_color.name
                                  : ""}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {finding.stone_shape
                                  ? finding.stone_shape.name
                                  : ""}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {finding.stone_size
                                  ? finding.stone_size.size
                                  : ""}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {finding.weight ? finding.weight : ""}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell
                              className={classes.tableFooter}
                            ></TableCell>
                            <TableCell
                              className={classes.tableFooter}
                            ></TableCell>
                            <TableCell
                              className={classes.tableFooter}
                            ></TableCell>
                            <TableCell
                              className={classes.tableFooter}
                            ></TableCell>
                            <TableCell
                              className={classes.tableFooter}
                            ></TableCell>
                            <TableCell
                              className={classes.tableFooter}
                            ></TableCell>
                            <TableCell className={classes.tableFooter}>
                              <b>{totalOtherWgt.toFixed(3)}</b>
                            </TableCell>
                          </TableRow>
                        </TableFooter>
                      </MaUTable>
                    </div>
                  )}
                  {variantCollection.length > 0 && (
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <Typography className="mt-16">
                          <b>Collection Details</b>
                        </Typography>
                      </Grid>
                    </Grid>
                  )}

                  {variantCollection.length > 0 && (
                    <div
                      id="inner-createpacket-tbl-dv"
                      className={
                        variantCollection.length >= 5
                          ? `table-responsive hallmarkrejection-firsttabel`
                          : `table-responsive`
                      }
                    >
                      <MaUTable className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.tableRowPad}>
                              Variant Number
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Variant Image
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Combination Category
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {variantCollection.map((VData, i) => (
                            <TableRow key={i}>
                              <TableCell
                                className={clsx(
                                  classes.tableRowPad,
                                  classes.hoverClass
                                )}
                              >
                                <span
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    editHandler(
                                      VData.ParentVariant.variant_number
                                    );
                                  }}
                                >
                                  {VData.ParentVariant.variant_number}
                                </span>
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                <img
                                  src={
                                    VData.ParentVariant.image_files.length > 0
                                      ? Config.getS3Url() +
                                        `vkjdev/design/image/${VData.ParentVariant.image_files[0].image_file}`
                                      : ""
                                  }
                                  height={50}
                                  width={50}
                                />
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {VData.ParentVariant.Category.category_name}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </MaUTable>
                    </div>
                  )}
                  {parentVariantCollection && (
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <Typography className="mt-16">
                          <b>Main Collection Details</b>
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                  {parentVariantCollection && (
                    <div
                      id="inner-createpacket-tbl-dv"
                      className="table-responsive"
                    >
                      <MaUTable className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.tableRowPad}>
                              Variant Number
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Variant Image
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Combination Category
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell
                              className={clsx(
                                classes.tableRowPad,
                                classes.hoverClass
                              )}
                            >
                              <span
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  ev.stopPropagation();
                                  editHandler(
                                    parentVariantCollection.ChildVariant
                                      .variant_number
                                  );
                                }}
                              >
                                {
                                  parentVariantCollection.ChildVariant
                                    .variant_number
                                }
                              </span>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <img
                                src={
                                  parentVariantCollection.ChildVariant
                                    .image_files.length > 0
                                    ? Config.getS3Url() +
                                      `vkjdev/design/image/${parentVariantCollection.ChildVariant.image_files[0].image_file}`
                                    : ""
                                }
                                height={50}
                                width={50}
                              />
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {
                                parentVariantCollection.ChildVariant.Category
                                  .category_name
                              }
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </MaUTable>
                    </div>
                  )}
                  {sizeCollection.length > 0 && (
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <Typography className="mt-16">
                          <b>Size Collection Details</b>
                        </Typography>
                      </Grid>
                    </Grid>
                  )}

                  {sizeCollection.length > 0 && (
                    <div
                      id="inner-createpacket-tbl-dv"
                      className={
                        sizeCollection.length >= 5
                          ? `table-responsive hallmarkrejection-firsttabel`
                          : `table-responsive`
                      }
                    >
                      <MaUTable className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.tableRowPad}>
                              Variant Number
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Variant Image
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Size
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {sizeCollection.map((VData, i) => (
                            <TableRow key={i}>
                              <TableCell
                                className={clsx(
                                  classes.tableRowPad,
                                  classes.hoverClass
                                )}
                              >
                                <span
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    editHandler(
                                      VData.ParentVariantSize.variant_number
                                    );
                                  }}
                                >
                                  {VData.ParentVariantSize.variant_number}
                                </span>
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {/* <img src={`https://vkjdev.s3.ap-south-1.amazonaws.com/vkjdev/design/image/${VData.ParentVariantSize.image_files[0].image_file}`} height={50} width={50}/>
                                 */}
                                <img
                                  src={
                                    VData.ParentVariantSize.image_files.length >
                                    0
                                      ? `${VData.ParentVariantSize.image_files[0].image_file}`
                                      : ""
                                  }
                                  height={50}
                                  width={50}
                                />
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {VData.ParentVariantSize.size}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </MaUTable>
                    </div>
                  )}
                  {sizeParentCollection && (
                    <Grid container spacing={3}>
                      <Grid item xs={4}>
                        <Typography className="mt-16">
                          <b>Main Size Collection Details</b>
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                  {sizeParentCollection && (
                    <div
                      id="inner-createpacket-tbl-dv"
                      className="table-responsive"
                    >
                      <MaUTable className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell className={classes.tableRowPad}>
                              Variant Number
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Variant Image
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Size
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell
                              className={clsx(
                                classes.tableRowPad,
                                classes.hoverClass
                              )}
                            >
                              <span
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  ev.stopPropagation();
                                  editHandler(
                                    sizeParentCollection.ChildVariantSize
                                      .variant_number
                                  );
                                }}
                              >
                                {
                                  sizeParentCollection.ChildVariantSize
                                    .variant_number
                                }
                              </span>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {/* <img src={`https://vkjdev.s3.ap-south-1.amazonaws.com/vkjdev/design/image/${sizeParentCollection.ChildVariantSize.image_files[0].image_file}`} height={50} width={50}/>
                               */}
                              <img
                                src={
                                  sizeParentCollection.ChildVariantSize
                                    .image_files.length > 0
                                    ? `${sizeParentCollection.ChildVariantSize.image_files[0].image_file}`
                                    : ""
                                }
                                height={50}
                                width={50}
                              />
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {sizeParentCollection.ChildVariantSize.size}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </MaUTable>
                    </div>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default EditDesign;
