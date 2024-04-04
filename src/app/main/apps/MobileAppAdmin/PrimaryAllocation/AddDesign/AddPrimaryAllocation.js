import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import clsx from "clsx";
import { FuseAnimate } from "@fuse";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { TablePagination, TextField, Typography } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import Loader from "app/main/Loader/Loader";
import Select, { createFilter } from "react-select";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import History from "@history";
import sampleFile from "app/main/SampleFiles/PrimaryAllocation/Staging.csv";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
  paper: {
    position: "absolute",
    // width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
  },
  tabroot: {
    // width: "fit-content",
    // marginTop: theme.spacing(3),
    overflowX: "auto",
    overflowY: "auto",
    // height: "100%",
    height: "100%",
  },
  table: {
    minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  selectBox: {
    // marginTop: 8,
    // padding: 8,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    width: "100%",
    // marginLeft: 15,
  },
}));


const AddPrimaryAllocation = (props) => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [MasterChecked, setMasterChecked] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);

  const [productCategory, setProductCategory] = useState([]);
  const [selectedProdCat, setSelectedProdCat] = useState("");

  const [prodCatErr, setProdCatErr] = useState("");

  const [designData, setDesignData] = useState([]);
  const [uniqueDesign, setUniqueDesign] = useState([]);

  const [nameErr, setNameErr] = useState("");
  const [name, setName] = useState("");

  const [catId, setCatId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsView] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  const [searchData, setSearchData] = useState({
    category: "",
    desingNo: "",
    showInApp: "",
  });
  const theme = useTheme();

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  const hiddenFileInput = React.useRef(null);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handlefilechange = (event) => {
    handleFile(event);
    console.log("handlefilechange");
  };

  function handleFile(e) {
    e.preventDefault();
    console.log("handleFile");
    var files = e.target.files,
      f = files[0];
    uploadfileapicall(f); // data not set properly from api
  }

  function uploadfileapicall(f) {
    const formData = new FormData();
    formData.append("file", f);

    setLoading(true);
    axios
      .post(Config.getCommonUrl() + "api/designMobile/design/Upload", formData)
      .then(function (response) {
        console.log(response);
        setLoading(false);
        if (response.data.success === true) {
          let tempData = response.data.data.map((item) => {
            return {
              ...item,
              status: item.show_in_app == 1 ? "Yes" : "No",
              uploaded: true,
            };
          });
          setDesignData([...designData, ...tempData]);
        } else {
          if (response.data.hasOwnProperty("csvError")) {
            if (response.data.csvError === 1) {
              // console.log("csverror");
              if (response.data.hasOwnProperty("url")) {
                let downloadUrl = response.data.url;
                console.log(downloadUrl);
                window.open(downloadUrl);
              }
              document.getElementById("fileinput").value = "";
            }
          }
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        setLoading(false);
        document.getElementById("fileinput").value = "";
        handleError(error, dispatch, {
          api: "api/designMobile/design/Upload",
          body: JSON.stringify(formData),
        });
      });
  }

  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
    //eslint-disable-next-line
  }, []);

  const idToBeEdited = props.location.state;

  useEffect(() => {
    console.log("idToBeEdited", idToBeEdited);
    if (idToBeEdited !== undefined) {
      setCatId(idToBeEdited.id);
      setIsView(idToBeEdited.isViewOnly);
      setIsEdit(idToBeEdited.isEdit);
      if (idToBeEdited.id !== "") {
        setFilters();
      }
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isEdit || isView) {
      setDesignData([]);
      setCount(0);
      setPage(0);
      setFilters();
    }
  }, [searchData]);

  const getRecordView = (url) => {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          let tempData = response.data.data;
          setName(tempData.name);
          setCount(Number(response.data.count));
          let designDatatemp = tempData.stageDesign.map((x) => {
            return {
              ...x,
              Category: {
                billing_category_name: x.Category.category_name,
              },
              variant_number: x.Design.variant_number,
              selected: false,
              status: x.Design.show_in_app == 1 ? "Yes" : "No",
              image_files: [
                {
                  image_file: x.Design.ImageURL,
                },
              ],
              category_id: x.Category.id,
            };
          });
          if (designData.length === 0) {
            setDesignData(designDatatemp);
          } else {
            setDesignData((designData) => [...designData, ...designDatatemp]);
          }
          setLoading(false);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
          setLoading(false);
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, { api: url });
      });
  };

  function setFilters(tempPageNo) {
    const id = idToBeEdited.id;
    let url = `api/designStaging/${id}?`;

    if (page !== "") {
      if (!tempPageNo) {
        url = url + "page=" + 1;
      } else {
        url = url + "page=" + tempPageNo;
      }
    }
    if (searchData.category !== "") {
      url = url + "&category_name=" + searchData.category;
    }
    if (searchData.desingNo !== "") {
      url = url + "&variant_number=" + searchData.desingNo;
    }
    if (searchData.showInApp !== "") {
      url = url + "&show_in_app=" + searchData.showInApp.value;
    }

    console.log(url, "---------", tempPageNo);
    if (!tempPageNo) {
      getRecordView(url);
    } else {
      if (count > designData.length) {
        getRecordView(url);
      }
    }
  }
  function handleChangePage(event, newPage) {
    console.log(1)
    let tempPage = page;
    setPage(newPage);
    if (newPage > tempPage && (newPage + 1) * 10 > designData.length) {
      setFilters(Number(newPage + 1));
    }
  }

  const handleSearchData = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    // const searchItem = searchData;
    setSearchData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "name") {
      setName(value);
      setNameErr("");
    }
  }

  let handleCategoryChange = (e) => {
    setSelectedProdCat({
      value: e.value,
      label: e.label,
    });
    setProdCatErr("");
    setDesignData([]);
    setCount(0);
    setPage(0);
    getDesignDataFromCategory(`api/design/searchbycategory/variant/${e.value}`)
  };

  function handleChangeAddNewPage(e,newPage) {
    console.log(2)
    setPage(newPage)
}

  function getDesignDataFromCategory(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        setLoading(false);
        if (response.data.success === true) {
          console.log(response);
          let tempData = response.data.data;
          let tempApiData = tempData.map((x) => {
            return {
              ...x,
              selected: false,
              status: x.show_in_app == 1 ? "Yes" : "No",
            };
          });
          setCount(Number(response.data.count));
          if (designData.length === 0) {
            setDesignData(tempApiData);
          } else {
            setDesignData((designData) => [...designData, ...tempApiData]);
          }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, {
          api: url,
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
    //eslint-disable-next-line
  }, [dispatch]);

  function getProductCategories() {
    axios
      .get(Config.getCommonUrl() + "api/productcategory/all/list/new")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setProductCategory(response.data.data);
        }
      })
      .catch(function (error) {
        handleError(error, dispatch, {
          api: "api/productcategory/all/list/new",
        });
      });
  }

  function onMasterCheck(e) {
    let tempList = designData;
    // Check/ UnCheck All Items
    tempList.map((user) => (user.selected = e.target.checked));

    //Update State
    setMasterChecked(e.target.checked);
    setDesignData(tempList);

    console.log(tempList);
  }

  // Update List Item's state and Master Checkbox State
  function onItemCheck(e, item) {
    // console.log("onItemCheck---------", item)

    let tempList = designData; //this.state.List;
    let temp = tempList.map((row) => {
      // console.log(row)
      if (row.id === item.id) {
        console.log("match");
        row.selected = e.target.checked;
      }
      return row;
    });

    const totalItems = designData.length;
    const totalCheckedItems = temp.filter((e) => e.selected).length;
    setDesignData(temp);
    setMasterChecked(totalItems === totalCheckedItems);
  }

  function NameValidation() {
    // var Regex = /^[a-zA-Z\s]*$/;
    if (name === "") {
      setNameErr("Enter Valid Name");
      return false;
    }
    return true;
  }

  function handleFormSubmit(ev) {
    ev.preventDefault();

    if (NameValidation()) {
      if (
        designData.filter((item) => {
          return item.selected;
        }).length === 0
      ) {
        dispatch(Actions.showMessage({ message: "Please Select Any Design" }));
      } else {
        console.log("else");
        // props.handleSubmit(name, designData.filter(item => { return item.selected }))
        if (isEdit) {
          updateStagingDesign(
            designData.filter((item) => {
              return item.selected;
            })
          );
        } else {
          addStagingDesign(
            designData.filter((item) => {
              return item.selected;
            })
          );
        }
      }
    }
  }

  function updateStagingDesign(listData) {
    console.log(listData);
    axios
      .put(Config.getCommonUrl() + `api/designStaging/${idToBeEdited.id}`, {
        name: name,
        design_ids: listData.map((x) => {
          return {
            design_id: x.Design ? x.Design.id : x.id,
            category_id: x.category_id,
          };
        }),
      })
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          dispatch(Actions.showMessage({ message: response.data.message }));
          // History.goBack();
          idToBeEdited.apiData.splice(idToBeEdited.page * 10)
          History.push('/dashboard/mobappadmin/primaryallocation', { iseditView: true, page: idToBeEdited.page, search: idToBeEdited.search, apiData: idToBeEdited.apiData, count: idToBeEdited.count })
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "" });
      });
  }

  function addStagingDesign(listData) {
    console.log(listData, "adddd");
    let data = {
      name: name,
      design_ids: listData.map((x) => {
        return {
          design_id: x.Design ? x.Design.id : x.id,
          category_id: x.category_id,
        };
      }),
    };
    axios
      .post(Config.getCommonUrl() + "api/designStaging", data)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          dispatch(Actions.showMessage({ message: response.data.message }));
          History.goBack();
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/designStaging", body: data });
      });
  }

  function deleteHandler() {
    designData.splice((page*rowsPerPage))
    setDesignData(designData)
    axios
      .delete(Config.getCommonUrl() + `api/designStaging/delete/${deleteId}`)
      .then((response) => {
        if (response.data.success) {
          dispatch(Actions.showMessage({ message: response.data.message }));
          setDeleteModal(false);
          setDeleteId("");
          setFilters(Number(page+1),catId);
         
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/designStaging/delete/${deleteId}`,
        });
      });
  }
  function hadelExport(e) {
    axios
      .get(Config.getCommonUrl() + `api/designStaging/csv/${idToBeEdited.id}`)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          let downloadUrl = response.data.url;
          window.open(downloadUrl);
          setLoading(false);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/designStaging/csv/${idToBeEdited.id}`,
        });
      });
  }

  const handlegenderChange = (value) => {
    setSearchData((prevState) => ({
      ...prevState,
      ["showInApp"]: value ? value : "",
    }));
  };

  const genderArr = [
    { value: 0, label: "No" },
    { value: 1, label: "Yes" },
  ];

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20 ">
            <Grid
              className="department-main-dv"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={7} sm={7} md={7} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    {isEdit
                      ? "Edit Primary Allocation"
                      : "Add Primary Allocation"
                      ? isView
                        ? "View Primary Allocation"
                        : "Add Primary Allocation"
                      : "Add Primary Allocation"}
                  </Typography>
                </FuseAnimate>
              </Grid>

              <Grid
                item
                xs={5}
                sm={5}
                md={5}
                key="2"
                style={{ textAlign: "right" }}
              >
                <div className="btn-back">
                  <Button
                    id="btn-back"
                    size="small"
                    // onClick={(event) => { History.goBack() }}

                    onClick={(event) => {
                      isEdit || isView
                        ? History.push(
                            "/dashboard/mobappadmin/primaryallocation",
                            {
                              page: idToBeEdited.page,
                              search: idToBeEdited.search,
                              apiData: idToBeEdited.apiData,
                              count: idToBeEdited.count,
                            }
                          )
                        : History.goBack();
                    }}
                  >
                      <img
                         className="back_arrow"
                         src={Icones.arrow_left_pagination}
                         alt=""/>
                  
                    Back
                  </Button>
                </div>
              </Grid>
            </Grid>

            {loading && <Loader />}
            <div className="main-div-alll ">
              <div
                className=" salesdomestic-work-pt"
                style={{ marginBottom: "10%" }}
              >
                <Grid
                  // className="department-main-dv"
                  container
                  spacing={12}
                  alignItems="stretch"
                  style={{ margin: 0 }}
                >
                  <Grid
                    item
                    xs={3}
                    sm={3}
                    md={3}
                    style={{ padding: 5, paddingLeft: "0px" }}
                  >
                    <label> Name</label>

                    <TextField
                      className="mt-1"
                      // label="Name"
                      name="name"
                      value={name}
                      error={nameErr.length > 0 ? true : false}
                      helperText={nameErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                      disabled={isView}
                      placeholder={"Enter name"}
                    />
                  </Grid>

                  {isView && (
                    <Grid item xs={9} sm={9} md={9} style={{ padding: 5 }}>
                      <Button
                        style={{ marginTop: "22px" }}
                        variant="contained"
                        className={clsx(classes.button, "float-right")}
                        onClick={(e) => {
                          hadelExport(e);
                        }}
                        size="small"
                      >
                        Export
                      </Button>
                    </Grid>
                  )}

                  <Grid item xs={3} sm={3} md={3} style={{ padding: 5 }}>
                    {!isView && (
                      <>
                        <label>Category name</label>
                        <Select
                          className={clsx(
                            classes.selectBox,
                            "mt-1",
                            "purchase-select-dv selectsales-dv",
                            "border-none"
                          )}
                          filterOption={createFilter({
                            ignoreAccents: false,
                          })}
                          // className={clsx(classes.selectBox, "ml-2")}
                          // classes={classes}
                          // className="ml-2"
                          styles={{ selectStyles }}
                          options={productCategory.map((suggestion) => ({
                            value: suggestion.id,
                            label: suggestion.category_name,
                          }))}
                          // components={components}
                          value={selectedProdCat}
                          onChange={(e) => {
                            handleCategoryChange(e);
                          }}
                          placeholder="Category Name"
                          // isDisabled={isView}
                        />
                        <span style={{ color: "red" }}>
                          {prodCatErr.length > 0 ? prodCatErr : ""}
                        </span>
                      </>
                    )}
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    sm={6}
                    md={6}
                    style={{
                      padding: 5,
                      justifyContent: "end",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {!isView && (
                      <>
                        <Button
                          id="btn-save"
                          className="ml-16 mx-auto mr-16"
                          onClick={handleClick}
                          size="small"
                        >
                          Upload File
                        </Button>

                        <a
                          style={{ float: "right", color: "#415BD4" }}
                          href={sampleFile}
                          download="Staging.csv"
                        >
                          Download Sample{" "}
                        </a>

                        <Button
                          id="btn-save"
                          className="ml-16 mx-auto mr-16"
                          onClick={(e) => {
                            hadelExport(e);
                           }}
                           size="small"
                        >
                          Export
                        </Button>
          
                      </>
                    )}

                    <input
                      type="file"
                      id="fileinput"
                      // accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      accept=".csv"
                      ref={hiddenFileInput}
                      onChange={handlefilechange}
                      style={{ display: "none" }}
                    />
                  </Grid>

                </Grid>

                <div className="mt-16  custom_stocklist_dv lotview-modelpopup-dv">

                <TablePagination
                  labelRowsPerPage=""
                  component="div"
                  count={ count }
                  rowsPerPage={10}
                  page={ page }
                  backIconButtonProps={{
                    "aria-label": "Previous Page",
                  }}
                  nextIconButtonProps={{
                    "aria-label": "Next Page",
                  }}
                  onPageChange={isView || !selectedProdCat ? handleChangePage : handleChangeAddNewPage}
                /> 

                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell className={classes.tableRowPad}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={MasterChecked}
                            id="mastercheck"
                            disabled={isView}
                            onChange={(e) => onMasterCheck(e)}
                          />
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Image
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Categories
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Design No
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          Show In App
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className={classes.tableRowPad}></TableCell>
                        <TableCell className={classes.tableRowPad}></TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {/* Categories */}
                          <TextField
                            name="category"
                            onChange={handleSearchData}
                            inputProps={{ className: "all-Search-box-data" }}
                          />
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          {/* Design No. */}
                          <TextField
                            name="desingNo"
                            onChange={handleSearchData}
                            inputProps={{ className: "all-Search-box-data" }}
                          />
                        </TableCell>
                        <TableCell className={classes.tableRowPad} align="left">
                          {/* Show in app. */}
                          <TextField
                            className="float-right"
                            name="showInApp"
                            onChange={handleSearchData}
                            inputProps={{ className: "all-Search-box-data" }}
                          />
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {designData
                        .filter((temp) => {
                          // category: "",
                          // desingNo: "",
                          if (searchData.category) {
                            return temp.Category.billing_category_name
                              .toLowerCase()
                              .includes(searchData.category.toLowerCase());
                          } else if (searchData.desingNo) {
                            return temp.variant_number
                              .toLowerCase()
                              .includes(searchData.desingNo.toLowerCase());
                          } else if (searchData.showInApp) {
                            return temp.status
                              .toString()
                              .toLowerCase()
                              .includes(searchData.showInApp.toLowerCase());
                          } else {
                            return temp;
                          }
                        })
                        .slice(page * rowsPerPage ,  page * rowsPerPage + rowsPerPage) 
                        .map((row) => (
                          <TableRow key={row.id}>
                            {/* component="th" scope="row" */}
                            <TableCell className={classes.tableRowPad}>
                              <input
                                type="checkbox"
                                checked={row.selected}
                                className="form-check-input"
                                id="rowcheck{user.id}"
                                disabled={isView}
                                onChange={(e) => onItemCheck(e, row)}
                              />
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <img
                                src={
                                  row.image_files
                                    ? row.image_files[0]?.image_file
                                    : ""
                                }
                                height={50}
                                width={50}
                                alt=""
                              />
                            </TableCell>
                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.Category.billing_category_name}
                            </TableCell>

                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.variant_number}
                            </TableCell>
                            <TableCell
                              align="left"
                              className={classes.tableRowPad}
                            >
                              {row.status}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>

                  <TablePagination
                  labelRowsPerPage=""
                  component="div"
                  count={ count }
                  rowsPerPage={10}
                  page={ page }
                  backIconButtonProps={{
                    "aria-label": "Previous Page",
                  }}
                  nextIconButtonProps={{
                    "aria-label": "Next Page",
                  }}
                  onPageChange={isView || !selectedProdCat ? handleChangePage : handleChangeAddNewPage}
                /> 

                </div>

                <Grid item xs={12} sm={12} md={12} style={{ padding: 5 }}>
                  {!isView && (
                    <Button
                      id="btn-save"
                      color="primary"
                      style={{ float: "right", backgroundColor: "limegreen" }}
                      className="mx-auto mt-16"
                      aria-label="Register"
                      // disabled={isView}
                      // type="submit"
                      onClick={(e) => {
                        handleFormSubmit(e);
                      }}
                    >
                      Submit
                    </Button>
                  )}
                </Grid>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AddPrimaryAllocation;
