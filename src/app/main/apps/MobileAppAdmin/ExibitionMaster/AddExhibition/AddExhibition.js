import React, { useState, useEffect } from "react";
import { InputBase, TablePagination, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import axios from "axios";
import moment from "moment";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import History from "@history";
import { Icon, IconButton } from "@material-ui/core";
import Loader from "app/main/Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import Modal from "@material-ui/core/Modal";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import sampleFile from "app/main/SampleFiles/Exhibition/exhibition.csv";
import Icones from "assets/fornt-icons/Mainicons";
import SearchIcon from "@material-ui/icons/Search";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    // width: 400,
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
  searchBox: {
    padding: 8,
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

const AddExhibition = (props) => {
  const classes = useStyles();
  // const history = useHistory();
  const [modalStyle] = React.useState(getModalStyle);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [exhiName, setExhiName] = useState("");
  const [exhiNameErr, setExhiNameErr] = useState("");

  const [startDate, setStartDate] = useState("");
  const [startDtErr, setStartDtErr] = useState("");

  const [endDate, setEndDate] = useState("");
  const [endDtErr, setEndDtErr] = useState("");

  const [MasterChecked, setMasterChecked] = useState(false); //product

  const [designData, setDesignData] = useState([]);

  const hiddenFileInput = React.useRef(null);

  const [searchData, setSearchData] = useState("");

  const [isView, setIsView] = useState(false); //for view Only

  const [open, setOpen] = React.useState(false); //modal

  const [wtDetails, setWtDetails] = useState([]);

  const [openDelete, setOpenDelete] = useState(false); //delete dialog

  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  const dataToBeView = props.location.state;

  useEffect(() => {

    if (dataToBeView !== undefined) {
      setIsView(dataToBeView.isViewOnly);
      setFilters();

    }
    //eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    NavbarSetting("Mobile-app Admin", dispatch);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isView) {
      setDesignData([])
      setCount(0)
      setPage(0)
      setFilters();
    }

  }, [searchData])

  function getReadOneExhibitionApi(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          let tempData = response.data.data;

          setCount(Number(response.data.count))

          setEndDate(tempData.end_date);
          setStartDate(tempData.start_date);
          setExhiName(tempData.name);

          let tempApiData = tempData.ExhibitionMasterDesigns.map((x) => {
            return {
              ...x.ExhibitionDesigns,
              exhibition_design_barcode: x.exhibition_design_barcode,
              selected: false,
              image_file:
                x.ExhibitionDesigns.image_files.length > 0
                  ? x.ExhibitionDesigns.image_files[0].ImageURL
                  : "",
            };
          });
          setDesignData(tempApiData);

          setLoading(false);
          // setData(response.data);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, {
          api: url,
        });
      });
  }

  function setFilters(tempPageNo) {
    const id = dataToBeView.id
    let url = `api/exhibitionMaster/web/readOne/${id}?`

    if (page !== "") {
      if (!tempPageNo) {
        url = url + "page=" + 1

      } else {
        url = url + "page=" + tempPageNo
      }
    }

    url = url + "&search=" + searchData

    if (!tempPageNo) {
      getReadOneExhibitionApi(url);
    } else {
      if (count > designData.length) {
        getReadOneExhibitionApi(url);
      }
    }
  }
  function handleChangePage(event, newPage) {
    let tempPage = page;
    setPage(newPage);
    if (newPage > tempPage && (newPage + 1) * 10 > designData.length) {
      setFilters(Number(newPage + 1))
    }
  }

  function onMasterCheck(e) {
    let tempList = designData;
    // Check/ UnCheck All Items
    tempList.map((user) => (user.selected = e.target.checked));

    //Update State
    setMasterChecked(e.target.checked);
    setDesignData(tempList);

  }

  function onItemCheck(e, item) {
    let tempList = designData; //this.state.List;
    let temp = tempList.map((row) => {
      if (row.design_id === item.design_id) {
        row.selected = e.target.checked;
      }
      return row;
    });

    //To Control Master Checkbox State
    const totalItems = designData.length;
    const totalCheckedItems = temp.filter((e) => e.selected).length;
    setDesignData(temp);
    setMasterChecked(totalItems === totalCheckedItems);
  }

  function handleFormSubmit(ev) {
    ev.preventDefault();

    if (
      exhiNameValidation() &&
      startDtValidation() &&
      endDtValidation() &&
      validateBothDate()
    ) {
      if (designData.filter((e) => e.selected).length === 0) {
        dispatch(
          Actions.showMessage({
            message: "please Select Product",
            variant: "error",
          })
        );
        return;
      }

      AddExhibitionApi();
    }
  }

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (name === "exhiName") {
      setExhiName(value);
      setExhiNameErr("");
    } else if (name === "startDate") {
      setStartDate(value);
      setStartDtErr("");
    } else if (name === "endDate") {
      setEndDate(value);
      setEndDtErr("");
    }
  }

  function exhiNameValidation() {
    var Regex = /^[a-zA-Z\s]*$/;
    if (!exhiName || Regex.test(exhiName) === false) {
      setExhiNameErr("Enter Valid Exhibition Name");
      return false;
    }
    return true;
  }

  function startDtValidation() {
    if (startDate === "") {
      setStartDtErr("Please Enter Start Date");
      return false;
    }
    return true;
  }

  function endDtValidation() {
    if (endDate === "") {
      setEndDtErr("Please Enter End Date");
      return false;
    }
    return true;
  }

  function validateBothDate() {
    let startVal = moment(startDate).format("YYYY-MM-DD"); //new Date(value);
    let endVal = moment(endDate).format("YYYY-MM-DD"); //new Date(value);
    if (startVal > endVal) {
      dispatch(
        Actions.showMessage({
          message: "Start Date must be less than or equal to end Date",
          variant: "error",
        })
      );
      return false;
    }
    return true;
  }

  function AddExhibitionApi() {
    let product = designData
      .filter((x) => x.selected)
      .map((item) => {
        // if (item.selected === true) {
        return {
          design_id: item.design_id,
          exhibition_design_barcode: item.exhibition_design_barcode,
        };
        // }
      });

    let data = {
      name: exhiName,
      start_date: startDate,
      end_date: endDate,
      products: product,
      // "retailers": Retailer
    };

    axios
      .post(Config.getCommonUrl() + "api/exhibitionMaster", data)
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          History.goBack(); //.push("/dashboard/Masters/vendors");

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
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/exhibitionMaster",
          body: data,
        });
      });
  }

  const handleClick = (event) => {
    // if (isVoucherSelected) {
    // if (rateProfValidation()) {
    hiddenFileInput.current.click();
    // }
  };

  const handlefilechange = (event) => {
    handleFile(event);
  };

  function handleFile(e) {
    e.preventDefault();
    var files = e.target.files,
      f = files[0];
    uploadfileapicall(f); // data not set properly from api
  }

  function uploadfileapicall(f) {
    const formData = new FormData();
    formData.append("file", f);

    setLoading(true);
    axios
      .post(
        Config.getCommonUrl() + "api/exhibitionMaster/designUpload",
        formData
      )
      .then(function (response) {
        console.log(response);
        setLoading(false);
        if (response.data.success === true) {
          console.log(response);
          let tempData = response.data.data;
          let tempApiData = tempData.map((x) => {
            return {
              ...x,
              selected: false,
              image_file:
                x.image_files.length > 0 ? x.image_files[0].ImageURL : "",
            };
          });
          setDesignData(tempApiData);
        } else {
          if (response.data.hasOwnProperty("csverror")) {
            if (response.data.csverror === 1) {
              document.getElementById("fileinput").value = "";
            }
          }
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
        document.getElementById("fileinput").value = "";
        handleError(error, dispatch, {
          api: "api/exhibitionMaster/designUpload",
          body: JSON.stringify(formData),
        });
      });
  }

  function handleClear(event) {
    setExhiName("");
    setExhiNameErr("");

    setStartDate("");
    setStartDtErr("");

    setEndDate("");
    setEndDtErr("");
  }

  function deleteHandler(id) {
    setOpenDelete(true);
    setSelectedIdForDelete(id);
  }

  function handleCloseDelete() {
    setSelectedIdForDelete("");
    setOpenDelete(false);
  }

  function confirmDelete() {
    setDesignData(
      designData.filter((item) => item.design_id !== selectedIdForDelete)
    );
    setOpenDelete(false);
    setSelectedIdForDelete("");
  }

  function viewHandler(row) {
    setWtDetails(row.design_weights);
    setOpen(true);
  }

  let handleClose = () => {
    setOpen(false);
    setWtDetails([]);
  };

  function hadelExport(e) {
    axios
      .get(
        Config.getCommonUrl() + `api/exhibitionMaster/csv/${dataToBeView.id}`
      )
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          let downloadUrl = response.data.url;
          window.open(downloadUrl);
          setLoading(false);
        } else {
          dispatch(Actions.showMessage({message: response.data.message,variant:"error",}));
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/exhibitionMaster/csv/${dataToBeView.id}`,
        });
      });
  }

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
              <Grid item xs={12} sm={6} md={6} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-32 pt-16 pb-8 text-18 font-700">
                    Add Exibation
                  </Typography>
                </FuseAnimate>

                {/* <BreadcrumbsHelper /> */}
              </Grid>

              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                key="2"
                style={{ textAlign: "right" }}
              >
                <div className="btn-back">
                  {" "}
                  <img src={Icones.arrow_left_pagination} alt="" />
                  <Button
                    id="btn-back"
                    className=""
                    size="small"

                    onClick={(event) => {
                      isView ? History.push('/dashboard/mobappadmin/exhibitionmaster', { page: dataToBeView.page, search: dataToBeView.search, apiData: dataToBeView.apiData, count: dataToBeView.count }) : History.goBack()
                    }}

                  >
                    Back
                  </Button>
                </div>
              </Grid>
            </Grid>

            {loading && <Loader />}

            <div className="main-div-alll">
              <div className="w-full flex flex-row flex-wrap  ">
                <div className="add-textfiled-Tgrid add-textfiled">
                  <p>Exhibition Name</p>
                  <TextField
                    placeholder="Exhibition Name"
                    name="exhiName"
                    value={exhiName}
                    error={exhiNameErr.length > 0 ? true : false}
                    helperText={exhiNameErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    required
                    fullWidth
                    disabled={isView}
                  />
                </div>
                <div className="add-textfiled-Tgrid add-textfiled">
                  <p>Start Date</p>
                  <TextField
                    placeholder="Start Date"
                    name="startDate"
                    // disabled={isViewOnly}
                    value={startDate}
                    type="date"
                    variant="outlined"
                    fullWidth
                    error={startDtErr.length > 0 ? true : false}
                    helperText={startDtErr}
                    onChange={(e) => handleInputChange(e)}
                    format="yyyy/MM/dd"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={isView}
                  />
                </div>
                <div className=" add-textfiled-Tgrid add-textfiled">
                  <p>End Date</p>
                  <TextField
                    placeholder="End Date"
                    name="endDate"
                    // disabled={isViewOnly}
                    value={endDate}
                    type="date"
                    variant="outlined"
                    fullWidth
                    error={endDtErr.length > 0 ? true : false}
                    helperText={endDtErr}
                    onChange={(e) => handleInputChange(e)}
                    format="yyyy/MM/dd"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={isView}
                  />
                </div>
                <div className="add-textfiled-Tgrid add-textfiled"></div>
                <div className="add-textfiled-Tgrid add-textfiled"></div>
                <div className="add-textfiled-Tgrid add-textfiled ">
                  {!isView && (
                    <div className="flex flex-row float-right  ">
                      <Button
                        aria-placeholder="Register"
                        id="btn-save"
                        onClick={(e) => {
                          handleClear(e);
                        }}
                      >
                        Clear
                      </Button>
                      <Button
                        className="ml-3"
                        id="btn-save"
                        onClick={handleClick}
                      >
                        Import
                      </Button>
                      <div className="mt-3">
                        {" "}
                        <a
                          href={sampleFile}
                          download="Exhibition.csv"
                          className="ml-3"
                          style={{ color: "#415BD4" }}
                        >
                          Download Sample{" "}
                        </a>
                        <input
                          type="file"
                          id="fileinput"
                          // accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                          accept=".csv"
                          ref={hiddenFileInput}
                          onChange={handlefilechange}
                          style={{ display: "none" }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {isView && (
                <div style={{ float: "right" }}>
                  <Button
                    variant="contained"
                    className={clsx(classes.button)}
                    onClick={(e) => {
                      hadelExport(e);
                    }}
                    size="small"
                  >
                    Export
                  </Button>
                </div>
              )}
              <div className="flex flex-row justify-between">
                <h4 className="mt-8 ml-8">Products</h4>
                <div
                  style={{ borderRadius: "7px !important", marginLeft: "20px" }}
                  component="form"
                  className={clsx(classes.search)}
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
                    aria-placeholder="search"
                  >
                    <SearchIcon />
                  </IconButton>
                </div>
              </div>
              <div className="  mt-8 department-tbl-mt-dv">
                <Paper className={classes.tabroot} id="department-tbl-fix ">
                  <div className="table-responsive ">

                  {isView === true ? <TablePagination
                      labelRowsPerPage=''
                      component="div"
                      count={count}
                      rowsPerPage={10}
                      page={page}
                      backIconButtonProps={{
                        'aria-label': 'Previous Page',
                      }}
                      nextIconButtonProps={{
                        'aria-label': 'Next Page',
                      }}
                      onPageChange={handleChangePage}
                    /> : ""}

                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          {!isView && (
                            <TableCell className={classes.tableRowPad}>
                              <input
                                type="checkbox"
                                className="form-check-input"
                                checked={MasterChecked}
                                id="mastercheck"
                                onChange={(e) => onMasterCheck(e)}
                              />
                            </TableCell>
                          )}
                          <TableCell className={classes.tableRowPad}>
                            Catagory
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Desing No
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Barcode
                          </TableCell>
                          {/* <TableCell className={classes.tableRowPad} align="left">
                                                            Gross Wt
                                                        </TableCell>
                                                        <TableCell className={classes.tableRowPad} align="left">
                                                            Net Wt
                                                        </TableCell> */}
                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Image
                          </TableCell>

                          <TableCell
                            className={classes.tableRowPad}
                            align="left"
                          >
                            Actions
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {designData
                          .filter(
                            (temp) =>
                              temp.Category.category_name
                                .toLowerCase()
                                .includes(searchData.toLowerCase()) ||
                              temp.design_no
                                .toLowerCase()
                                .includes(searchData.toLowerCase())
                            //      ||
                            // temp.client_contact_name
                            //     .toLowerCase()
                            //     .includes(searchData.toLowerCase()) ||
                            // temp.client_contact_number
                            //     .toLowerCase()
                            //     .includes(searchData.toLowerCase()) ||
                            // temp.client_contact_email
                            //     .toLowerCase()
                            //     .includes(searchData.toLowerCase()) ||
                            // temp.address
                            //     .toLowerCase()
                            //     .includes(searchData.toLowerCase())
                          )
                          .map((row, index) => (
                            <TableRow key={index}>
                              {/* component="th" scope="row" */}
                              {!isView && (
                                <TableCell className={classes.tableRowPad}>
                                  <input
                                    type="checkbox"
                                    checked={row.selected}
                                    className="form-check-input"
                                    id="rowcheck{user.id}"
                                    onChange={(e) => onItemCheck(e, row)}
                                  />
                                </TableCell>
                              )}
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row?.Category?.category_name}
                              </TableCell>

                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row.design_no}
                              </TableCell>
                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                {row?.exhibition_design_barcode}
                              </TableCell>

                              {/* <TableCell align="left"
                                              className={classes.tableRowPad}
                                                >
                                              gross wt
                                           </TableCell>

                                           <TableCell
                                           align="left"
                                           className={classes.tableRowPad}
                                           >
                                           net wt
                                           </TableCell> */}

                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                <img
                                  src={row.image_file}
                                  height={50}
                                  width={50}
                                />
                                {/* {row.ExhibitionMasterRetailers.length}  onClick={()=>{setModalView(3); setImage(row.image_file)}}*/}
                              </TableCell>

                              <TableCell
                                align="left"
                                className={classes.tableRowPad}
                              >
                                <IconButton
                                  style={{ padding: "0" }}
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    viewHandler(row);
                                  }}
                                >
                                  <Icon
                                    className="mr-8"
                                    style={{ color: "dodgerblue" }}
                                  >
                                    visibility
                                  </Icon>
                                </IconButton>
                                {!isView && (
                                  <IconButton
                                    style={{ padding: "0" }}
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      ev.stopPropagation();
                                      deleteHandler(row.design_id);
                                    }}
                                  >
                                    <Icon
                                      className="mr-8"
                                      style={{ color: "red" }}
                                    >
                                      delete
                                    </Icon>
                                  </IconButton>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>

                    {isView === true ?
                      <TablePagination
                        labelRowsPerPage=''
                        component="div"
                        // count={apiData.length}
                        count={count}
                        rowsPerPage={10}
                        page={page}
                        backIconButtonProps={{
                          'aria-label': 'Previous Page',
                        }}
                        nextIconButtonProps={{
                          'aria-label': 'Next Page',
                        }}
                        onPageChange={handleChangePage}
                      // onChangeRowsPerPage={handleChangeRowsPerPage}
                      /> : ""
                    }

                  </div>
                </Paper>
              </div>
            </div>
            <div className="mr-10  ">
              {!isView && (
                <Button
                  id="btn-save"
                  className=" float-right"
                  aria-placeholder="Register"
                  // disabled={isView}
                  // type="submit"
                  onClick={(e) => {
                    handleFormSubmit(e);
                  }}
                >
                  Save
                </Button>
              )}
            </div>

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
              <div
                style={modalStyle}
                className={clsx(classes.paper, "rounded-8")}
              >
                <h5 className="popup-head p-20">
                  Weight Details
                  <IconButton
                    style={{ position: "absolute", top: "0", right: "0" }}
                    onClick={handleClose}
                  >
                    <Icon>
                      <img src={Icones.cross} alt="" />
                    </Icon>{" "}
                  </IconButton>
                </h5>
                <div className="pl-32 pr-32 pb-10 pt-10 custom_stocklist_dv">
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          className={classes.tableRowPad}
                          align="center"
                        >
                          Karat
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="center"
                        >
                          Gross Weight
                        </TableCell>
                        <TableCell
                          className={classes.tableRowPad}
                          align="center"
                        >
                          Net Weight
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {wtDetails.map((row, index) => (
                        <TableRow key={index}>
                          <TableCell
                            align="center"
                            className={classes.tableRowPad}
                          >
                            {row.karat}
                          </TableCell>

                          <TableCell
                            align="center"
                            className={classes.tableRowPad}
                          >
                            {row.gross_weight}
                          </TableCell>
                          <TableCell
                            align="center"
                            className={classes.tableRowPad}
                          >
                            {row.net_weight}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </Modal>

            <Dialog
              open={openDelete}
              onClose={handleCloseDelete}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Alert!!!"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this record?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDelete} color="primary">
                  Cancel
                </Button>
                <Button onClick={confirmDelete} color="primary" autoFocus>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AddExhibition;
