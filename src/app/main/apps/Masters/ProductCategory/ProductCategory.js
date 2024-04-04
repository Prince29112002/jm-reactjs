import React, { useState, useEffect } from "react";
import { InputBase, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Icon, IconButton, Checkbox } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Modal from "@material-ui/core/Modal";
import { TextField } from "@material-ui/core";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Select, { createFilter } from "react-select";
import Loader from "../../../Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import SearchIcon from "@material-ui/icons/Search";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(4),
    outline: "none",
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
  tabroot: {
    // width: "fit-content",
    // marginTop: theme.spacing(3),
    // overflowX: "auto",
    // overflowY: "auto",
    // height: "100%",
    // height: "90%",
  },
  table: {
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  formControl: {
    // margin: theme.spacing(3),
  },
  group: {
    margin: theme.spacing(1, 0),
    flexDirection: "row",
  },
  edtSelectBox: {
    width: "100%",
    padding: 10,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    width: "340px",
    height: "37px",
    color: "#CCCCCC",
    opacity: 1,
    letterSpacing: "0.06px",
    font: "normal normal normal 14px/17px Inter",
  },
  search: {
    display: "flex",
    border: "1px solid #cccccc",
    float: "right",
    height: "38px",
    width: "340px",
    borderRadius: "7px !important",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    opacity: 1,
    padding: "2px 4px",
    alignItems: "center",
  },
  iconButton: {
    width: "19px",
    height: "19px",
    opacity: 1,
    color: "#CCCCCC",
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

const ProductCategory = (props) => {
  // const [defaultView, setDefaultView] = useState("1");
  const [selectedIdForEdit, setSelectedIdForEdit] = useState("");
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  const [apiData, setApiData] = useState([]);
  const [apiSearchData, setApiSearchData] = useState([]);
  const [mainCatDropData, setMainCatDropData] = useState([]);

  const [modalStyle] = useState(getModalStyle);
  const [modalOpen, setModalOpen] = useState(false);

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const [categoryNm, setCategoryNm] = useState("");
  const [categoryNmErr, setCategoryNmErr] = useState("");

  const [billCatName, setBillCatName] = useState("");
  const [billCatNameErr, setBillCatNameErr] = useState("");

  const [categoryCode, setCategoryCode] = useState("");
  const [categoryCodeErr, setCategoryCodeErr] = useState("");

  const [HSNMasterData, setHSNMasterData] = useState([]); // hsn details dropdown
  const [HSNMasterErrTxt, setHSNMasterErrTxt] = useState("");
  const [hsnSelected, setHsnSelected] = useState("");

  const [processLineData, setProcessLineData] = useState([])
  const [selectedProcess, setSelectedProcess] = useState("");
  const [selectedProcessErr, setSelectedProcessErr] = useState("");

  const [GSTNumber, setGSTNumber] = useState("");
  const [GstNumErrTxt, setGstNumErrTxt] = useState("");
  // const [hsnNumber, setHsnNumber] = useState("");
  // const [hsnNumberErr, setHsnNumberErr] = useState("");

  const [categoryType, setCategoryType] = useState(""); //main category or sub category
  const [categoryTypeErr, setCategoryTypeErr] = useState("");

  const [IsChecked, setIsChecked] = useState(false);

  const [imageUrl, setImageUrl] = useState("");
  const [imgFile, setImgFile] = useState("");

  const [mainCatName, setMainCatName] = useState("");
  const [mainCatNameErr, setMainCatNameErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState("");
  const theme = useTheme();

  const [orderType, setOrderType] = useState("");
  const [categoryPCS, setcategoryPCS] = useState("1");
  const [categoryPCSErr, setcategoryPCSErr] = useState("");
  const [orderTypeErr, setOrderTypeErr] = useState("");

  const [isView, setIsView] = useState(false);

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
    NavbarSetting("Master", dispatch);
    //eslint-disable-next-line
  }, []);

  function handleCatTypeChange(event) {
    // 1 means main category
    // 0 means sub category
    setCategoryType(event.target.value);
    setCategoryTypeErr("");
  }

  function handleModalClose(call) {
    console.log("handle close", categoryNm);
    setModalOpen(false);
    setOrderTypeErr("")
    setcategoryPCSErr("")
    setIsChecked(false);
    setCategoryTypeErr("")
    setCategoryNmErr("")
    setSelectedProcess("")
    setSelectedProcessErr("")
    setHSNMasterErrTxt("")
    setBillCatNameErr("")
    setGstNumErrTxt("")
    setCategoryCodeErr("")
    setOrderType("")
    setCategoryNm("");
    setMainCatNameErr("")
    setBillCatName("");
    setCategoryCode("");
    setcategoryPCS("")
    setHsnSelected("");
    setCategoryType("");
    setMainCatName("");
    setSelectedIdForEdit("");
    setIsEdit(false);
    setIsView(false);
    setImageUrl("")
    if (call) {
      getProductCategories();
    }
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "categoryNm") {
      setCategoryNm(value);
      setCategoryNmErr("");
    } else if (name === "billCatNm") {
      setBillCatName(value);
      setBillCatNameErr("");
    } else if (name === "categoryCode") {
      setCategoryCode(value);
      setCategoryCodeErr("");
    } else if (name === "orderType") {
      if (!isNaN(value) && value.length < 7) {
        setOrderType(value);
        setOrderTypeErr("")
      } else {
        setOrderType(value);
        setOrderTypeErr("Enter valid numeric value")
      }
    }
    else if (name === "categorypcs") {
      setcategoryPCS(value);
      if (value === "1" || value === "2") {
        setcategoryPCSErr("")
      }
      else {
        setcategoryPCS("");
        setcategoryPCSErr("Input should only contain 1, or 2")
      }
    }
  }

  function categoryNmValidation() {
    if (categoryNm === "") {
      setCategoryNmErr("Enter category name");
      return false;
    }
    return true;
  }
  function CategoryPCS() {
    // var Regex = /^[a-zA-Z0-9 ]+$/;
    // if (!categoryNm || Regex.test(categoryNm) === false) {
    if ((categoryPCS == "1" || categoryPCS == "2")) {
      setcategoryPCSErr("")
      return true;
    }
    else {
      setcategoryPCSErr("Input should only contain 1, or 2")
      return false;

    }
    // return true;  1 == "1"
  }

  function billCatNmValidation() {
    if (billCatName === "") {
      setBillCatNameErr("Enter bill category name");
      return false;
    }
    return true;
  }

  function catCodeValidation() {
    if (categoryCode === "") {
      setCategoryCodeErr("Enter category code");
      return false;
    }
    return true;
  }

  function HsnNumValidation() {
    if (hsnSelected === "") {
      setHSNMasterErrTxt("Enter Valid HSN Number");
      return false;
    }
    return true;
  }

  function processValidation() {
    if (selectedProcess === "") {
      setSelectedProcessErr("Select process line");
      return false;
    }
    return true;
  }

  function checkforRadio() {
    if (categoryType === "") {
      setCategoryTypeErr("Please Select Category Type");
      return false;
    }
    return true;
  }

  function validCateSelected() {
    if (mainCatName === "") {
      setMainCatNameErr("Please Select Valid Main Category Name");
      return false;
    }
    return true;
  }

  function checkIsError() {
    if (orderTypeErr !== "") {
      return false;
    }
    return true;
  }

  const checkforUpdate = (evt) => {
    evt.preventDefault();
    if (
      categoryNmValidation() &&
      billCatNmValidation() &&
      catCodeValidation() &&
      HsnNumValidation() &&
      CategoryPCS() &&
      processValidation() &&
      checkIsError() &&
      checkforRadio()
    ) {
      if (categoryType === "0") {
        console.log("if");

        //sub then check for
        //  check here if main category selected or not? if not then throw error
        if (validCateSelected()) {
          console.log("validCateSelected");
          if (isEdit === true) {
            //edit
            callEditProdCatApi();
          } else {
            //add
            callAddCategoryApi();
          }
        }
      } else {
        //call api to add
        console.log("else");
        if (isEdit === true) {
          //edit
          callEditProdCatApi();
        } else {
          //add
          callAddCategoryApi();
        }
      }
    }
  };

  function callAddCategoryApi() {
    const formData = new FormData();
    formData.append("category_name", categoryNm.trim());
    formData.append("billing_category_name", billCatName.trim());
    formData.append("category_code", categoryCode);
    formData.append("hsn_number_id", hsnSelected.value);
    formData.append("is_main", categoryType);
    formData.append("is_category_pcs", categoryPCS);
    formData.append("parent_category_id", categoryType === "0" ? parseInt(mainCatName.value) : 0,);
    formData.append("is_collection_category", IsChecked ? "1" : "0");
    formData.append("order_by", orderType);
    formData.append("process_line_id", selectedProcess.value);
    console.log(...formData);
    formData.append("image", imgFile);
    axios
      .post(Config.getCommonUrl() + "api/productcategory", formData)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          // Data stored successfully
          dispatch(Actions.showMessage({ message: response.data.message }));
          handleModalClose(true);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: "api/productcategory",
          body: JSON.stringify(formData),
        });
      });
  }

  function callEditProdCatApi() {
    const formData = new FormData();
    formData.append("category_name", categoryNm);
    formData.append("billing_category_name", billCatName);
    formData.append("category_code", categoryCode);
    formData.append("hsn_number_id", hsnSelected.value);
    formData.append("is_main", categoryType);
    formData.append("is_category_pcs", categoryPCS);
    formData.append("parent_category_id", categoryType === "0" ? parseInt(mainCatName.value) : 0,);
    formData.append("is_collection_category", IsChecked ? "1" : "0");
    formData.append("order_by", orderType);
    formData.append("process_line_id", selectedProcess.value);
    console.log(...formData);
    formData.append("image", imgFile);
    axios
      .put(Config.getCommonUrl() + "api/productcategory/" + selectedIdForEdit, formData)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          dispatch(Actions.showMessage({ message: response.data.message }));
          handleModalClose(true);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/productcategory/" + selectedIdForEdit,
          body: JSON.stringify(formData),
        });;
      });
  }

  function editHandler(id, isEditCall, isViewCall) {
    setSelectedIdForEdit(id);
    setIsEdit(isEditCall);
    setIsView(isViewCall)
    //find index and set data to modal form

    const index = apiData.findIndex((element) => element.id === id);
    console.log(apiData[index]);
    // let Name = "";
    if (index > -1) {
      setModalOpen(true);
      setCategoryNm(apiData[index].category_name);
      setBillCatName(apiData[index].billing_category_name);
      setCategoryCode(apiData[index].category_code);
      setIsChecked(apiData[index].is_collection_category === 1 ? true : false)
      setImageUrl(apiData[index].imageURL)
      setOrderType(apiData[index].order_by)
      setcategoryPCS(apiData[index].is_category_pcs)
      if (apiData[index].hsn_master !== null) {
        setHsnSelected({
          value: apiData[index].hsn_master.id,
          label: apiData[index].hsn_master.hsn_number,
        });

        setGSTNumber(apiData[index].hsn_master.gst);
      }
      setCategoryType(apiData[index].is_main.toString());
      // console.log(apiData[index]);
      // 1 means main category
      // 0 means sub category
      if (apiData[index].is_main === 0) {
        // console.log(mainCatDropData);
        const idx = mainCatDropData.findIndex(
          (item) => item.id === apiData[index].mainCategoryname.id
        );
        // console.log(idx);
        if (idx > -1) {
          setMainCatName({
            value: mainCatDropData[idx].id,
            label: mainCatDropData[idx].category_name,
          });
        }
      }
    }
  }

  function deleteHandler(id) {
    console.log("deleteHandler", id);
    setSelectedIdForDelete(id);
    setOpen(true);
  }

  function handleClose() {
    setSelectedIdForDelete("");
    setOpen(false);
  }

  function handleChangeMainCat(data) {
    setMainCatName(data); //dont change
    setMainCatNameErr("");
    console.log(data); //here id of selected
  }

  function onSearchHandler(sData) {
    // console.log("Search on", sData);
    setSearchData(sData);
    // let newArr = data
    //   .filter(
    //     (temp) =>
    //     temp.stockGroupName.toLowerCase().includes(searchData.toLowerCase()) ||
    //     temp.variantName.toLowerCase().includes(searchData.toLowerCase())
    //   )
    //   .map(({ stockGroupName, variantName }) => ({ stockGroupName, variantName }));
    // console.log(newArr);

    // const filteredPersons = details.filter(
    //   person => {
    //     return (
    //       person
    //       .name
    //       .toLowerCase()
    //       .includes(searchField.toLowerCase()) ||
    //       person
    //       .email
    //       .toLowerCase()
    //       .includes(searchField.toLowerCase())
    //     );
    //   }
    // );
  }

  function callDeleteCategoryApi() {
    axios
      .delete(
        Config.getCommonUrl() + "api/productcategory/" + selectedIdForDelete
      )
      .then(function (response) {
        console.log(response);
        setOpen(false);
        if (response.data.success === true) {
          // selectedIdForDelete

          // const findIndex = apiData.findIndex(
          //   (a) => a.id === selectedIdForDelete
          // );

          // findIndex !== -1 && apiData.splice(findIndex, 1);
          handleModalClose(true);
          dispatch(Actions.showMessage({ message: response.data.message }));
          setSelectedIdForDelete("");
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/productcategory/" + selectedIdForDelete,
        });
      });
  }

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  useEffect(() => {
    console.log("useEffect");
    getProductCategories();
    // getMainCategories();
    getHSNData();
    getProcessLine();

    //dropdown popup in add and edit data

    //eslint-disable-next-line
  }, [dispatch]);

  function getProductCategories() {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + "api/productcategory")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setApiData(response.data.data);
          setMainCatDropData(response.data.data);

          // setData(response.data);
          let tempData = response.data.data;

          let data = tempData.map((row) => {
            return {
              id: row.id,
              mainCategoryname:
                row.mainCategoryname !== null
                  ? row.mainCategoryname.category_name
                  : "-",
              billing_category_name: row.billing_category_name,
              category_name: row.category_name,
              category_code: row.category_code,
              hsn_number: row.hsn_master.hsn_number,
              order_by : row.order_by,
              parentCount:row.parentCount,
              is_category_pcs:row.is_category_pcs
            };
          });
          setApiSearchData(data);
          setLoading(false);
          // console.log(data);
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: "api/productcategory" });
      });
  }

  // function getMainCategories() {
  //   axios
  //     .get(Config.getCommonUrl() + "api/productcategory/main/category")
  //     .then(function (response) {
  //       if (response.data.success === true) {
  //         console.log(response);
  //         setMainCatDropData(response.data.data);
  //       }
  //     })
  //     .catch(function (error) {
  // handleError(error, dispatch)

  //     });
  // }

  function getProcessLine() {
    axios
      .get(Config.getCommonUrl() + "api/processline")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setProcessLineData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/processline" });
      });
  }

  function getHSNData() {
    axios
      .get(Config.getCommonUrl() + "api/hsnmaster")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setHSNMasterData(response.data.data);
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
        handleError(error, dispatch, { api: "api/hsnmaster" });
      });
  }

  function handleChangeHsnNum(value) {
    // console.log(value);
    setHsnSelected(value);
    setHSNMasterErrTxt("");
    // value.value is id field so we have to get index of this id and set gst number from index array

    const findIndex = HSNMasterData.findIndex((a) => a.id === value.value);
    // console.log(findIndex);
    if (findIndex > -1) {
      // console.log(HSNMasterData[findIndex]);
      setGSTNumber(HSNMasterData[findIndex].gst);
      setGstNumErrTxt("");
    }
  }

  const handleChangeProcess = (value) => {
    setSelectedProcess(value);
    setSelectedProcessErr("")
  }

  const classes = useStyles();

  function handelColChange(event) {
    const target = event.target;
    const value = target.value;
    console.log(event.target.checked);
    setIsChecked(event.target.checked);
    if (event.target.checked === true) {
      setcategoryPCS("1")
      setcategoryPCSErr("")
    }
  }

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  const hiddenFileInput = React.useRef(null);


  function setImages(imgFile) {
    console.log(imgFile);
    setImageUrl(URL.createObjectURL(imgFile));
    setImgFile(imgFile);
    // let tempImgArr = [...imageUploadFile]
    // tempImgArr[index].img = imgFile;
    // tempImgArr[index].dispImg = URL.createObjectURL(imgFile)
    // console.log(tempImgArr)

    // setImageUploadFile(tempImgArr)
  }


  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
          <div className="flex flex-1 flex-col min-w-0">
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={4} sm={4} md={4} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Product Category
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>

              <Grid
                item
                xs={8}
                sm={8}
                md={8}
                key="2"
                style={{ textAlign: "right" }}
              >
                {/* <Link
                  to="/dashboard/masters/addemployee"
                  style={{ textDecoration: "none", color: "inherit" }}
                > */}
                <Button
                  className={classes.button}
                  size="small"
                  onClick={(event) => {
                    setModalOpen(true);
                    setImgFile("");
                    setCategoryNmErr("");
                    setBillCatNameErr("");
                    setCategoryCodeErr("");
                    setCategoryTypeErr("");
                      setcategoryPCSErr("")
                      setImageUrl("");
                    setOrderTypeErr("");
                    setHsnSelected("");
                    setMainCatNameErr("");
                    setGstNumErrTxt("");
                    setGSTNumber("");
                    setIsChecked(false);
                  }}
                >
                  Add New
                </Button>

                {/* </Link> */}
              </Grid>
            </Grid>
            <div className="main-div-alll ">
              <div>
                <div
                  style={{ borderRadius: "7px !important" }}
                  component="form"
                  className={classes.search}
                >
                  <InputBase
                    className={classes.input}
                    placeholder="Search"
                    inputProps={{ "aria-label": "search" }}
                    value={searchData}
                    onChange={(event) => setSearchData(event.target.value)}
                  />
                  <IconButton
                    type="submit"
                    className={classes.iconButton}
                    aria-label="search"
                  >
                    <SearchIcon />
                  </IconButton>
                </div>
              </div>
              {loading && <Loader />}
              <div className="mt-56 department-tbl-mt-dv">
                <Paper
                  className={clsx(
                    classes.tabroot,
                    "table-responsive product_cate_tabel "
                  )}
                  id="product_cate_tabel_dv"
                >
                  {/* <div
                  className="table-responsive product_cate_tabel "
                // style={{ marginBottom: "10%" }}
                > */}
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableRowPad}>
                          ID
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          DB ID
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Main Category Name
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Category Name
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Billing Category Name
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Category Code
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          HSN Number
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Order Numbering
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Category PCS
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Parent Count
                        </TableCell>
                        <TableCell className={classes.tableRowPad} style={{textAlign:"left"}} align="left">
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {apiSearchData
                        .filter(
                          (temp) =>
                            temp.mainCategoryname
                              .toLowerCase()
                              .includes(searchData.toLowerCase()) ||
                            temp.billing_category_name
                              .toLowerCase()
                              .includes(searchData.toLowerCase()) ||
                            temp.category_name
                              .toLowerCase()
                              .includes(searchData.toLowerCase()) ||
                            temp.category_code
                              .toLowerCase()
                              .includes(searchData.toLowerCase()) ||
                            temp.hsn_number
                              .toLowerCase()
                              .includes(searchData.toLowerCase()) ||
                            temp.order_by.toString()
                              .toLowerCase()
                              .includes(searchData.toLowerCase())||
                              temp.is_category_pcs.toString()
                              .toLowerCase()
                              .includes(searchData.toLowerCase()) ||
                              temp.parentCount.toString()
                              .toLowerCase()
                              .includes(searchData.toLowerCase()) 
                        )
                        .map((row, i) => (
                          <TableRow key={row.id}>
                            <TableCell className={classes.tableRowPad}>
                              {i + 1}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {row.id}
                            </TableCell>
                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.mainCategoryname}
                            </TableCell>

                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.category_name}
                            </TableCell>
                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.billing_category_name}
                            </TableCell>

                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.category_code}
                            </TableCell>

                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.hsn_number}
                            </TableCell>

                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.order_by}
                            </TableCell>

                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.is_category_pcs}
                            </TableCell>

                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.parentCount}
                            </TableCell>  
                            <TableCell style={{textAlign:"left"}} className={classes.tableRowPad}>
                            <IconButton
                                style={{ padding: "0" }}
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  ev.stopPropagation();
                                  editHandler(row.id, false, true);
                                }}
                              >
                                <Icon
                                  className="mr-8"
                                  style={{ color: "dodgerblue" }}
                                >
                                  visibility
                                </Icon>
                              </IconButton>

                              <IconButton
                                style={{ padding: "0" }}
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  ev.stopPropagation();
                                  editHandler(row.id, true, false);
                                }}
                              >
                                <Icon className="mr-8 edit-icone">
                                  <img src={Icones.edit} alt="" />
                                </Icon>
                              </IconButton>

                              <IconButton
                                style={{ padding: "0" }}
                                onClick={(ev) => {
                                  ev.preventDefault();
                                  ev.stopPropagation();
                                  deleteHandler(row.id);
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
                  {/* </div> */}
                </Paper>
              </div>
            </div>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title" className="popup-delete">
                {"Alert!!!"}
                <IconButton
                  style={{
                    position: "absolute",
                    marginTop: "-5px",
                    right: "15px",
                  }}
                  onClick={handleClose}
                >
                  <img
                    src={Icones.cross}
                    className="delete-dialog-box-image-size"
                    alt=""
                  />
                </IconButton>
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this record ?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleClose}
                  className="delete-dialog-box-cancle-button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={callDeleteCategoryApi}
                  className="delete-dialog-box-delete-button"
                >
                  Delete
                </Button>
              </DialogActions>
            </Dialog>

            <Modal
              // disableBackdropClick
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={modalOpen}
              onClose={(_, reason) => {
                if (reason !== "backdropClick") {
                  handleModalClose(false);
                }
              }}
            >
              <div
                style={modalStyle}
                className={clsx(classes.paper, "rounded-8")}
              >
                <h5 className="popup-head p-20">
                  {isEdit === true ? "Edit Category" : isView ? "View Category" : "Add New Category"}
                  <IconButton
                    style={{ position: "absolute", top: "3px", right: "6px" }}
                    onClick={handleModalClose}
                  >
                    <Icon>
                      <img src={Icones.cross} alt="" />
                    </Icon>
                  </IconButton>
                </h5>
                <div
                  className="pl-32 pr-32 pt-10 pb-10 overflow-y-scroll"
                  style={{ height: "73vh" }}
                >
                  <p className="popup-labl pb-4">Category name*</p>
                  <TextField
                    className="mb-6 input-select-bdr-dv"
                    placeholder="Enter category name"
                    name="categoryNm"
                    value={categoryNm}
                    error={categoryNmErr.length > 0 ? true : false}
                    helperText={categoryNmErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    required
                    fullWidth
                    disabled={isView}
                  />

                  <p className="popup-labl pb-4 pt-12">
                    Billing category name*
                  </p>
                  <TextField
                    className="mb-20 input-select-bdr-dv"
                    placeholder="Enter billing category name"
                    name="billCatNm"
                    value={billCatName}
                    error={billCatNameErr.length > 0 ? true : false}
                    helperText={billCatNameErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                    required
                    disabled={isView}
                  />

                  <p className="popup-labl pb-4 pt-12">Category code*</p>
                  <TextField
                    className="mb-20 input-select-bdr-dv"
                    placeholder="Enter category code"
                    name="categoryCode"
                    value={categoryCode}
                    error={categoryCodeErr.length > 0 ? true : false}
                    helperText={categoryCodeErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                    required
                    disabled={isView}
                  />

                  {/* <TextField
                    className="mb-16"
                    label="HSN Number"
                    name="hsnNumber"
                    value={hsnNumber}
                    error={hsnNumberErr.length > 0 ? true : false}
                    helperText={hsnNumberErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                    required
                  /> */}

                  <p className="popup-labl pb-4 pt-12">HSN</p>
                  <Select
                    className="mb-20 input-select-bdr-dv"
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    options={HSNMasterData.map((suggestion) => ({
                      value: suggestion.id,
                      label: suggestion.hsn_number,
                    }))}
                    // components={components}
                    value={hsnSelected}
                    onChange={handleChangeHsnNum}
                    placeholder="Enter hsn"
                    isDisabled={isView}
                  />
                  <span style={{ color: "red" }}>
                    {HSNMasterErrTxt.length > 0 ? HSNMasterErrTxt : ""}
                  </span>

                  <p className="popup-labl pb-4 pt-12">GST</p>
                  <TextField
                    className="pb-20 input-select-bdr-dv"
                    placeholder="Enter gst"
                    name="gstNum"
                    value={GSTNumber}
                    error={GstNumErrTxt.length > 0 ? true : false}
                    helperText={GstNumErrTxt}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                    disabled
                  />

                  <p className="popup-labl pb-4 pt-12">Order Numbering</p>
                  <TextField
                    className="pb-20 input-select-bdr-dv"
                    placeholder="Order Numbering"
                    name="orderType"
                    value={orderType}
                    error={orderTypeErr.length > 0 ? true : false}
                    helperText={orderTypeErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                    disabled={isView}
                  />

                  <p className="popup-labl pb-4 pt-12">Category PCS</p>
                   <TextField
                    className="pb-20 input-select-bdr-dv"
                    name="categorypcs"
                    value={categoryPCS}
                    error={categoryPCSErr.length > 0 ? true : false}
                    helperText={categoryPCSErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                    // disabled={IsChecked}
                    disabled={isView}
                  />

                   <p className="popup-labl pt-12">Process Line</p>
                    <Select
                    className="input-select-bdr-dv"
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    options={processLineData.map((suggestion) => ({
                      value: suggestion.id,
                      label: suggestion.process_line_name,
                    }))}
                    // components={components}
                    value={selectedProcess}
                    onChange={handleChangeProcess}
                    placeholder="Process Line"
                    isDisabled={isView}
                  />
                  <span style={{ color: "red" }}>
                    {selectedProcessErr.length > 0 ? selectedProcessErr : ""}
                  </span>

                  <FormControl
                    id="redio-input-dv"
                    component="fieldset"
                    className={classes.formControl}
                  >
                    {/* <FormLabel component="legend">Salary Paid By :</FormLabel> */}
                    <RadioGroup
                      aria-label="Gender"
                      name="categoryType"
                      className={classes.group}
                      value={categoryType}
                      onChange={handleCatTypeChange}
                      disabled={isView}
                    >
                      <FormControlLabel
                        value="1"
                        control={<Radio />}
                        label="Main category"
                        disabled={isView}
                      />
                      <FormControlLabel
                        value="0"
                        control={<Radio />}
                        label="Sub category"
                        disabled={isView}
                      />
                    </RadioGroup>
                    <span style={{ color: "red" }}>
                      {categoryTypeErr.length > 0 ? categoryTypeErr : ""}
                    </span>
                  </FormControl>

                  {categoryType === "0" && (
                    <div>
                      <p className="popup-labl pb-4 pt-12">
                        Main category name
                      </p>
                      <Select
                        className="mb-20 input-select-bdr-dv"
                        filterOption={createFilter({ ignoreAccents: false })}
                        classes={classes}
                        styles={selectStyles}
                        options={mainCatDropData
                          .filter((item) => item.id !== selectedIdForEdit)
                          .map((suggestion) => ({
                            value: suggestion.id,
                            label: suggestion.category_name,
                          }))}
                        // components={components}
                        value={mainCatName}
                        onChange={handleChangeMainCat}
                        placeholder="Select main category name"
                        isDisabled={isView}
                      />
                      <span style={{ color: "red" }}>
                        {mainCatNameErr.length > 0 ? mainCatNameErr : ""}
                      </span>
                    </div>
                    // <select
                    //   className={classes.edtSelectBox}
                    //   required
                    //   value={mainCatName}
                    //   onChange={(e) => {
                    //     setMainCatName(e.target.value);
                    //     // setIsItemTypeErr(false);
                    //     // setItemTypeErrTxt("");
                    //   }}
                    // >
                    //   <option hidden value="0">
                    //     Main Category Name
                    //   </option>
                    //   {mainCatDropData.map((item) => (
                    //     <option key={item.id} value={item.id}>
                    //       {item.category_name}
                    //     </option>
                    //   ))}
                    //   ;
                    // </select>
                  )}

                  <FormControl
                    id="checkbox-input-dv"
                    component="fieldset"
                    className={clsx(classes.formControl, "pb-5")}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="is_collection_category"
                          checked={IsChecked}
                          onChange={(e) => handelColChange(e)}
                          disabled={isView}
                        />
                      }
                      label="Is combination category"
                    />
                  </FormControl>
                  <br />
                  <FormControl style={{ width: "320px", height: "37px" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      style={{
                        border: "1px solid #CCCCCC",
                        backgroundColor: "#FFFFFF",
                        color: "#415BD4",
                      }}
                      // className="w-224 mx-auto "
                      onClick={handleClick}
                      disabled={isView}
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
                  </FormControl>

                  {imageUrl !== "" && imageUrl !== null && (
                    <img
                      src={imageUrl}
                      style={{
                        width: "340px",
                        height: "120px",
                        marginTop: "20px",
                        borderRadius: "7px",
                      }}
                      className="mt-16"
                      alt=""
                    />
                  )}

                  <div className="popup-button-div">
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
                      onClick={(e) => checkforUpdate(e)}
                      disabled={isView}
                    >
                      Save
                    </Button>
                  </div>

                </div>
              </div>
            </Modal>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default ProductCategory;
