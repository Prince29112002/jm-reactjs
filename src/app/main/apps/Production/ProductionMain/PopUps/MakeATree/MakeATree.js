import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import {
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import { FuseAnimate } from "@fuse";
import BreadcrumbsHelper from "app/main/BreadCrubms/BreadcrumbsHelper";
import { Delete, KeyboardBackspace } from "@material-ui/icons";
import History from "@history";
import Axios from "axios";
import Config from "app/fuse-configs/Config";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { Icon, IconButton } from "@material-ui/core";
import { useReactToPrint } from "react-to-print";
import { MakeATreePrint } from "./MakeATreePrint/MakeATreePrint";
import HelperFunc from "app/main/apps/SalesPurchase/Helper/HelperFunc";
import { Autocomplete } from "@material-ui/lab";
import DesignZoomModal from "../../ProductionComp/DesignZoomModal/DesignZoomModal";
import { HtmlPrintAddApi } from "app/main/apps/Production/ProductionMain/Helper/HtmlPrintAdd";
import ReactDOM from "react-dom";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  bredcrumbTitle: {
    fontWeight: "700",
    fontSize: "18px",
    marginBottom: 12,
    paddingLeft: 16,
  },
  modalContainer: {
    paddingBlock: "20px",
    background: "rgba(0,0,0,0)",
    justifyContent: "space-between",
  },
  customList: {
    listStyleType: "square",
  },
  notavAilableList: {
    paddingBlock: 3,
  },
  scroll: {
    overflowX: "auto",
  },
  table: {
    minWidth: 900,
  },
  tableRowPad: {
    padding: 7,
  },
}));

const MakeATree = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [printObj, setPrintObj] = useState("");
  // const [modalOpen, setModalOpen] = useState(false);
  const [isView, setIsView] = useState(false); //for view Only
  const componentRef = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef(null);

  useEffect(() => {
    if (printObj) {
      handlePrint();
    }
  }, [printObj]);

  const handleAfterPrint = () => {
    const componentInstance = (
      <MakeATreePrint ref={componentRef} printObj={printObj} />
    );
    const containerDiv = document.createElement("div");
    ReactDOM.render(componentInstance, containerDiv);
    const printedContent = containerDiv.innerHTML;
    console.log("Printed HTML content:", printedContent);
    HtmlPrintAddApi(dispatch, printedContent, [printObj]);
    ReactDOM.unmountComponentAtNode(containerDiv);
    containerDiv.remove();
    History.goBack()
  };

  const handleBeforePrint = React.useCallback(() => {
    console.log("`onBeforePrint` called");
  }, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
    console.log("`onBeforeGetContent` called");

    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        resolve();
      }, 10);
    });
  }, []); //setText

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
    //eslint-disable-next-line
  }, [componentRef.current]);

  function getDateAndTime() {
    return (
      new Date().getDate() +
      "_" +
      (new Date().getMonth() + 1) +
      "_" +
      new Date().getFullYear() +
      "_" +
      new Date().getHours() +
      ":" +
      new Date().getMinutes()
    );
  }

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Make_A_Tree_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    // removeAfterPrint: true
  });

  const [makeTreeList, setMakeTreeList] = useState([]);
  const [lotDesignList, setLotDesignList] = useState([]);
  const [selectedLot, setSelectedLot] = useState("");
  const [treeWeight, setTreeWeight] = useState("");
  const [treeWeightErr, setTreeWeightErr] = useState("");
  const [designLotSearchData, setDesignLotSearchData] = useState("");
  const [searchByLotSearchData, setSearchByLotSearchData] = useState("");
  const [lotApiData, setLotApiData] = useState([]);
  const [lotNumberSearch, setLotNumberSearch] = useState("");
  const [selectedLotNumber, setSelectedLotNumber] = useState("");

  useEffect(() => {
    clearData();
    getMakeTreeList();
  }, [window.localStorage.getItem("SelectedDepartment")]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (lotNumberSearch) {
        getProductData(lotNumberSearch);
      } else {
        setLotApiData([]);
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
  }, [lotNumberSearch]);
  function getProductData(sData) {
    Axios.get(
      Config.getCommonUrl() +
        `api/production/lot/number/searching?department_id=${window.localStorage.getItem(
          "SelectedDepartment"
        )}&number=${sData}`
    )
      .then(function (response) {
        if (response.data.success === true) {
          let responseData = response.data.data;
          if (responseData.length > 0) {
            setLotApiData(responseData);
          } else {
            setLotApiData([]);
          }
        } else {
          setLotApiData([]);
          // dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/production/lot/number/searching?department_id=${window.localStorage.getItem(
            "SelectedDepartment"
          )}&number=${sData}`,
        });
      });
  }
  function getMakeTreeList() {
    setMakeTreeList([]);
    Axios.get(
      Config.getCommonUrl() +
        `api/production/barcode/find?department_id=${window.localStorage.getItem(
          "SelectedDepartment"
        )}`
    )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setMakeTreeList(response.data.data);
          // setPrintObj(response.data.data)
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/production/barcode/find?department_id=${window.localStorage.getItem(
            "SelectedDepartment"
          )}`,
        });
      });
  }

  function handlePrintAddStock(treeId, actNumber) {
    const body = {
      tree_id: treeId,
      activityNumber: actNumber,
    };
    Axios.post(
      Config.getCommonUrl() + `api/productionPrintVoucher/make/tree/print`,
      body
    )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setPrintObj(response.data.data);
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
          api: `api/productionPrintVoucher/make/tree/print`,
          body: body,
        });
      });
  }

  useEffect(() => {
    if (selectedLotNumber) {
      getScanedBarcode();
    }
  }, [selectedLotNumber]);
  function getScanedBarcode() {
    Axios.get(
      Config.getCommonUrl() +
        `api/production/lot/barcode/department/?number=${selectedLotNumber}&department_id=${window.localStorage.getItem(
          "SelectedDepartment"
        )}`
    )
      .then(function (response) {
        if (response.data.success === true) {
          // console.log(response);
          getMakeTreeList();
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/production/lot/barcode/department/?number=${selectedLotNumber}&department_id=${window.localStorage.getItem(
            "SelectedDepartment"
          )}`,
        });
      });
  }
  function getDesignList(mainLotNo) {
    Axios.get(
      Config.getCommonUrl() +
        `api/production/make/tree/design/?main_lot_number=${mainLotNo}`
    )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setSelectedLot(mainLotNo);
          setLotDesignList(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/production/make/tree/design/?main_lot_number=${mainLotNo}`,
        });
      });
  }
  const deleteLotHandler = (id, index) => {
    console.log(id);
    const body = {
      department_id: parseFloat(
        window.localStorage.getItem("SelectedDepartment")
      ),
      lot_number: [{ main_lot_number: id }],
    };
    console.log(body);
    Axios.post(Config.getCommonUrl() + "api/production/scan/lot/delete", body)
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          if (selectedLot === id) {
            setLotDesignList([]);
            setSelectedLot("");
          }
          dispatch(Actions.showMessage({ message: response.data.message }));
          getMakeTreeList();
          console.log(response);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/production/scan/lot/delete",
          body: body,
        });
      });
  };
  function handleSubmitAddStock(isPrint) {
    const body = {
      department_id: parseFloat(
        window.localStorage.getItem("SelectedDepartment")
      ),
      weight: treeWeight,
      lot_number: makeTreeList,
    };
    Axios.post(Config.getCommonUrl() + `api/production/mack/tree`, body)
      .then(function (response) {
        if (response.data.success === true) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          console.log(response);
          if (isPrint === 1) {
            handlePrintAddStock(
              response.data.tree_id,
              response.data.activityNumber
            );
          } else {
            clearData();
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
          api: `api/production/mack/tree`,
          body: body,
        });
      });
  }
  function clearData() {
    setMakeTreeList([]);
    setLotDesignList([]);
    setTreeWeight("");
    setSelectedLotNumber("");
    setLotNumberSearch("");
  }
  const validateScanlot = () => {
    if (makeTreeList.length === 0) {
      dispatch(
        Actions.showMessage({ message: "Please Scan Lot", variant: "error" })
      );
      return false;
    }
    return true;
  };
  const validateTreeWeightData = () => {
    let isValid = true;
    if (!treeWeight) {
      setTreeWeightErr("Plz Enter Tree Weight");
      isValid = false;
    }
    return isValid;
  };

  function handleSubmit(isPrint) {
    if (validateScanlot() && validateTreeWeightData()) {
      handleSubmitAddStock(isPrint);
    }
  }
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "treeweight" && !/^\d*\.?\d*$/.test(value)) {
      return;
    }
    if (name === "treeweight") {
      setTreeWeight(value);
      setTreeWeightErr("");
    }
  };
  const handleSearchLoginData = (event) => {
    const { name, value } = event.target;
    if (name === "searchByLot") {
      setSearchByLotSearchData(value);
    } else if (name === "searchByLotDesign") {
      setDesignLotSearchData(value);
    }
  };
  // function handleSubmitData() {
  //   console.log("asdfas");
  //   if (makeTreeList.length === 0) {
  //     dispatch(
  //       Actions.showMessage({
  //         message: "Please Enter Data",
  //         variant: "error",
  //       })
  //     );
  //   } else {
  //     handleSubmitAddStock();
  //   }
  // }
  let handleLotSelect = (value) => {
    let filteredArray = lotApiData.filter((item) => item.number === value);
    if (filteredArray.length > 0) {
      setSelectedLotNumber(value);
    }
  };
  return (
    <Box className={classes.model} style={{ overflowY: "auto" }}>
      <Grid container className={classes.modalContainer}>
        <Grid item xs={12} sm={4} md={3} key="1">
          <FuseAnimate delay={300}>
            <Typography className="pl-28 pb-16 pt-16 text-18 font-700">
              Make A Tree
            </Typography>
          </FuseAnimate>
          {/* <BreadcrumbsHelper /> */}
        </Grid>
        <Grid
          item
          sm={8}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingRight: 16,
            columnGap: 10,
          }}
        >
          <div className="btn-back mt-2">
            {" "}
            {/* <img src={Icones.arrow_left_pagination} alt="" /> */}
            <Button
              id="btn-back"
              size="small"
              onClick={(event) => {
                History.goBack();
              }}
            >
              <img
                className="back_arrow"
                src={Icones.arrow_left_pagination}
                alt=""
              />
              Back
            </Button>
          </div>
        </Grid>
      </Grid>
      <div className="main-div-alll ">
        <Box style={{ paddingInline: 16 }}>
          <Grid container>
            <Grid item xs={12}>
              <Grid container spacing={2} style={{ marginBottom: 10 }}>
                {/* <Grid item xs={12} sm={6} md={3} lg={3}>
                <Typography style={{ fontWeight: "600" }}>
                  Tree Number
                </Typography>
                <TextField
                  fullWidth
                  id="work-station-name"
                  variant="outlined"
                  style={{ marginTop: 5 }}
                />
              </Grid> */}
                <Grid item xs={12} sm={6} md={3} lg={3}>
                  <Typography style={{ fontWeight: "600" }}>
                    Tree Weight
                  </Typography>
                  <TextField
                    fullWidth
                    name="treeweight"
                    value={treeWeight}
                    variant="outlined"
                    style={{ marginTop: 5 }}
                    onChange={(e) => handleInputChange(e)}
                    error={
                      treeWeightErr !== undefined
                        ? treeWeightErr
                          ? true
                          : false
                        : false
                    }
                    helperText={
                      treeWeightErr !== undefined ? treeWeightErr : ""
                    }
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              style={{ marginBottom: 16 }}
              className="packing-slip-input"
            >
              <Autocomplete
                id="free-solo-demos"
                freeSolo
                disableClearable
                onChange={(event, newValue) => {
                  handleLotSelect(newValue);
                }}
                onInputChange={(event, newInputValue) => {
                  if (event !== null) {
                    if (event.type === "change")
                      setLotNumberSearch(newInputValue);
                  } else {
                    setLotNumberSearch("");
                  }
                }}
                value={selectedLotNumber}
                options={lotApiData.map((option) => option.number)}
                fullWidth
                style={{ width: 200 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Search Lot Number"
                    variant="outlined"
                    style={{
                      padding: 0,
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={2}>
              <Grid item xs={12} xl={6}>
                <Box style={{ marginBottom: 16 }}>
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    style={{ padding: 10, background: "#e3e3e3" }}
                  >
                    <Grid item>
                      <Typography style={{ fontWeight: 700 }}>
                        Total Lot(<span>{makeTreeList.length}</span>)
                      </Typography>
                    </Grid>
                    <Grid item>
                      <TextField
                        variant="outlined"
                        name="searchByLotDesign"
                        placeholder="Scan / Search"
                        onChange={(e) => handleSearchLoginData(e)}
                      />
                    </Grid>
                  </Grid>
                  <TableContainer className={classes.scroll}>
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            width="30px"
                            className={classes.tableRowPad}
                          ></TableCell>
                          <TableCell
                            width="110px"
                            className={classes.tableRowPad}
                          >
                            Lot No
                          </TableCell>
                          <TableCell
                            width="110px"
                            className={classes.tableRowPad}
                          >
                            Lot Category
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            width="50px"
                          >
                            Pcs
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            width="60px"
                          >
                            No of Stone
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            width="100px"
                          >
                            Gross Weight
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            width="100px"
                          >
                            Stone Weight
                          </TableCell>
                          <TableCell
                            width="80px"
                            className={classes.tableRowPad}
                          >
                            Net Weight
                          </TableCell>
                          <TableCell width="70px">Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {makeTreeList.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={9}
                              align="center"
                              className={classes.tableRowPad}
                            >
                              <div style={{ textAlign: "center" }}>
                                No Data Found
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          makeTreeList
                            .filter((temp) => {
                              console.log(temp);
                              if (searchByLotSearchData) {
                                return (
                                  temp.batch_no !== null &&
                                  temp.batch_no !== "" &&
                                  temp.batch_no
                                    .toLowerCase()
                                    .includes(
                                      searchByLotSearchData.toLowerCase()
                                    )
                                );
                              } else {
                                return temp;
                              }
                            })
                            .map((data, index) => {
                              console.log(data);
                              return (
                                <TableRow key={index}>
                                  <TableCell className={classes.tableRowPad}>
                                    <IconButton
                                      style={{ padding: "0" }}
                                      tabIndex="-1"
                                      onClick={(ev) => {
                                        ev.preventDefault();
                                        ev.stopPropagation();
                                        deleteLotHandler(
                                          data.main_lot_number,
                                          index
                                        );
                                      }}
                                    >
                                      <Icon
                                        className=""
                                        style={{ color: "red" }}
                                      >
                                        delete
                                      </Icon>
                                    </IconButton>
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    <span
                                      style={{
                                        color: "blue",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        getDesignList(data.main_lot_number)
                                      }
                                    >
                                      {data.lot_number}
                                    </span>
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.ProductCategory.category_name}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.pcs}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {parseInt(data.stone_pcs)}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.total_gross_wgt}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.total_stone_weight}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.total_net_wgt}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    Casted
                                  </TableCell>
                                </TableRow>
                              );
                            })
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
                {/* <Box
              // xs={12}
              // style={{ display: "flex", justifyContent: "flex-end" }}
              >
                <Button
                  style={{
                    fontWeight: "700",
                    color: "#FFFFFF",
                    background: "#1FD319",
                    paddingRight: "10px",
                    marginRight: "10px",
                  }}
                  onClick={(e) => {
                    handleSubmitData();
                  }}
                >
                  Save
                </Button>

                <Button
                  onClick={handleOpen}
                  style={{
                    fontWeight: "700",
                    color: "#FFFFFF",
                    background: "#1FD319",
                    marginRight: 10,
                  }}
                >
                  Print
                </Button>
              </Box> */}

                <Grid
                  item
                  xs={12}
                  style={{ display: "flex", justifyContent: "flex-end" }}
                >
                  <Button
                    id="btn-all-production"
                    variant="contained"
                    style={{
                      fontWeight: "700",
                      color: "#FFFFFF",
                      //   background: "#1FD319",
                      marginRight: 10,
                      minWidth: 120,
                    }}
                    onClick={(e) => {
                      handleSubmit();
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    onClick={(e) => {
                      handleSubmit(1);
                    }}
                    id="btn-all-production"
                    variant="contained"
                    style={{
                      fontWeight: "700",
                      color: "#FFFFFF",
                      //   background: "#1FD319",
                      minWidth: 150,
                    }}
                  >
                    Save & Print
                  </Button>
                </Grid>
              </Grid>
              <Grid item xs={12} xl={6}>
                <Box style={{ marginBottom: 16 }}>
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    style={{ padding: 10, background: "#e3e3e3" }}
                  >
                    <Grid item>
                      <Typography style={{ fontWeight: 700 }}>
                        Item of Lot(
                        <span>
                          {parseFloat(
                            HelperFunc.getTotalOfField(lotDesignList, "pcs")
                          )}{" "}
                          Pcs
                        </span>
                        )
                      </Typography>
                    </Grid>
                    {selectedLot && (
                      <Grid item>
                        <b
                          style={{
                            padding: 5,
                            background: "#d3d3d3",
                            borderRadius: 7,
                          }}
                        >
                          {selectedLot}
                        </b>
                      </Grid>
                    )}
                    <Grid item>
                      <TextField
                        variant="outlined"
                        name="searchByLot"
                        placeholder="Scan / Search"
                        onChange={(e) => handleSearchLoginData(e)}
                      />
                    </Grid>
                  </Grid>
                  <TableContainer
                    className={classes.scroll}
                    style={{
                      maxHeight: "calc(100vh - 400px)",
                      overflowY: "auto",
                    }}
                  >
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          {/* <TableCell
                          width="30px"
                          className={classes.tableRowPad}
                        ></TableCell> */}
                          <TableCell
                            width="110px"
                            className={classes.tableRowPad}
                          >
                            Design No
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            width="80px"
                            align="center"
                          >
                            Design
                          </TableCell>
                          <TableCell
                            width="120px"
                            className={classes.tableRowPad}
                          >
                            Batch No
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            width="50px"
                          >
                            Pcs
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            width="60px"
                          >
                            No of Stone
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            width="100px"
                          >
                            Gross Weight
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            width="100px"
                          >
                            Stone Weight
                          </TableCell>
                          <TableCell
                            width="80px"
                            className={classes.tableRowPad}
                          >
                            Net Weight
                          </TableCell>
                          <TableCell width="70px">Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {lotDesignList.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={9}
                              align="center"
                              className={classes.tableRowPad}
                            >
                              <div style={{ textAlign: "center" }}>No Data</div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          lotDesignList
                            .filter((temp) => {
                              console.log(temp);
                              if (designLotSearchData) {
                                return (
                                  temp.batch_no !== null &&
                                  temp.batch_no !== "" &&
                                  temp.batch_no
                                    .toLowerCase()
                                    .includes(designLotSearchData.toLowerCase())
                                );
                              } else {
                                return temp;
                              }
                            })
                            .map((data, index) => {
                              console.log(data);
                              return (
                                <TableRow key={index}>
                                  {/* <TableCell className={classes.tableRowPad}>
                                  <IconButton
                                    style={{ padding: "0" }}
                                    tabIndex="-1"
                                    onClick={(ev) => {
                                      ev.preventDefault();
                                      ev.stopPropagation();
                                      deleteLotHandler(
                                        data.main_lot_number,
                                        index
                                      );
                                    }}
                                  >
                                    <Icon className="" style={{ color: "red" }}>
                                      delete
                                    </Icon>
                                  </IconButton>
                                </TableCell> */}
                                  <TableCell className={classes.tableRowPad}>
                                    {data.LotDesignData.variant_number}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    <DesignZoomModal
                                      imgPath={
                                        data?.LotDesignData?.image_files[0]
                                          ?.image_file
                                      }
                                    />
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.batch_no}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {data.design_pcs}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {parseInt(data.total_stone_pcs)}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {parseFloat(data.gross_weight).toFixed(3)}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {parseFloat(
                                      data.weight * data.total_stone_pcs
                                    ).toFixed(3)}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {parseFloat(data.net_weight).toFixed(3)}
                                  </TableCell>
                                  <TableCell
                                    width="50px"
                                    className={classes.tableRowPad}
                                  >
                                    Casted
                                  </TableCell>
                                </TableRow>
                              );
                            })
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>

              <div style={{ display: "none" }}>
                <MakeATreePrint ref={componentRef} printObj={printObj} />
              </div>
            </Grid>
          </Grid>
        </Box>
      </div>
    </Box>
  );
};

export default MakeATree;
