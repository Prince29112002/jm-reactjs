import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import {
  Box,
  Button,
  Checkbox,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton,
  Icon,
  FormControlLabel,
  Radio,
  FormControl,
  RadioGroup,
  Modal,
} from "@material-ui/core";
import { FuseAnimate } from "@fuse";
import Axios from "axios";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import Config from "app/fuse-configs/Config";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Autocomplete from "@material-ui/lab/Autocomplete";
import handleError from "app/main/ErrorComponent/ErrorComponent";
// import BreadcrumbsHelper from "app/main/BreadCrubms/BreadcrumbsHelper";
// import { Delete, KeyboardBackspace } from "@material-ui/icons";
import History from "@history";
import HelperFunc from "../../../../SalesPurchase/Helper/HelperFunc";
import { useReactToPrint } from "react-to-print";
// import { MergePrint } from "./MergePrint/MergePrint";
import moment from "moment";
import LotSummary from "../../LotPrint/LotSummary";
import LotDesign from "../../LotPrint/LotDesign";
import IssueToWorkerPrint from "../../ProductionComp/IssueToWorkerPrint/IssueToWorkerPrint";
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
  actionBtn: {
    background: "#1fd319",
    color: "#FFFFFF",
    width: "100%",
    borderRadius: "10px",
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
  tablePad: {
    padding: 0,
  },
  tableRowPad: {
    padding: 7,
  },
  modal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    padding: 12,
    background: "#03113b",
    color: "#FFFFFF",
  },
  modalBody: {
    padding: 20,
  },
}));

const Merge = () => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const department_id = window.localStorage.getItem("SelectedDepartment");
  const [lotNumberSearch, setLotNumberSearch] = useState("");
  const [selectedLotNumber, setSelectedLotNumber] = useState("");
  const [lotApiData, setLotApiData] = useState([]);
  const [apiDataArray, setApiDataArray] = useState([]);
  const [selectedDesignArr, setSelectedDesignArr] = useState([]);
  const [transferArray, setTransferArray] = useState([]);
  const [designSearch, setDesignSearch] = useState("");
  const [transferSearch, setTransferSearch] = useState("");
  const [createdLot, setCreatedLot] = useState([]);
  const [workstationId, setWorkstationId] = useState("");

  const [printObj, setPrintObj] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const [voucherPrintType, setVoucherPrintType] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [printObjMultiple, setPrintObjMultiple] = useState([]);
  const [printObjCreLot, setPrintObjCreLot] = useState([]);
  // const [modalOpen, setModalOpen] = useState(false);
  const [isView, setIsView] = useState(false); //for view Only

  const componentRef = React.useRef(null);

  const onBeforeGetContentResolve = React.useRef(null);

  const componentRefDesign = React.useRef(null);
  const componentRefSummary = React.useRef(null);
  const componentRefMergeLot = React.useRef(null);

  useEffect(() => {
    if (printObjCreLot.length > 0) {
      handleMergLotPrint();
    }
  }, [printObjCreLot]);

  const handleAfterPrintLot = () => {
    const componentInstance = (
      <IssueToWorkerPrint
        ref={componentRefMergeLot}
        printObj={printObjCreLot}
        from="Merge For"
      />
    );
    const containerDiv = document.createElement("div");
    ReactDOM.render(componentInstance, containerDiv);
    const printedContent = containerDiv.innerHTML;
    console.log("Printed HTML content:", printedContent);
    HtmlPrintAddApi(dispatch, printedContent, printObjCreLot);
    ReactDOM.unmountComponentAtNode(containerDiv);
    containerDiv.remove();
    History.goBack();
  };

  const handleAfterPrintSummary = () => {};

  const handleAfterPrintDesign = () => {};

  const handleBeforePrint = React.useCallback(() => {
    console.log("`onBeforePrint` called"); // tslint:disable-line no-console
  }, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
    console.log("`onBeforeGetContent` called"); // tslint:disable-line no-console
    // setLoading(true);
    // setText("Loading new text...");

    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        // setLoading(false);
        // setText("New, Updated Text!");
        resolve();
      }, 10);
    });
  }, []); //setText

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
    //eslint-disable-next-line
  }, [componentRef.current]);

  const reactToPrintContentSummary = React.useCallback(() => {
    return componentRefSummary.current;
    //eslint-disable-next-line
  }, [componentRefSummary.current]);

  const reactToPrintContentDesign = React.useCallback(() => {
    return componentRefDesign.current;
    //eslint-disable-next-line
  }, [componentRefDesign.current]);

  const reactToPrintContentCreLot = React.useCallback(() => {
    return componentRefMergeLot.current;
    //eslint-disable-next-line
  }, [componentRefMergeLot.current]);

  function getDateAndTime() {
    const currentDate = new Date();
    return moment(currentDate).format("DD-MM-YYYY h:mm A");
  }

  const handleLotDesignPrint = useReactToPrint({
    content: reactToPrintContentDesign,
    documentTitle: "Merge_Lot_Design_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrintDesign,
    // removeAfterPrint: true
  });

  const handleLotSummaryPrint = useReactToPrint({
    content: reactToPrintContentSummary,
    documentTitle: "Merge_Lot_Summary_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrintSummary,
    // removeAfterPrint: true
  });

  const handleMergLotPrint = useReactToPrint({
    content: reactToPrintContentCreLot,
    documentTitle: "Split_Lot_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrintLot,
    // removeAfterPrint: true
  });

  function handleChange(e) {
    const isSelected = parseFloat(e.target.value);
    console.log(e.target.value);
    setVoucherPrintType(isSelected);
  }

  function handlePrint() {
    console.log(voucherPrintType);
    if (voucherPrintType === 0) {
      handleLotSummaryPrint();
    } else {
      handleLotDesignPrint();
    }
  }

  const handleSetPrint = (id) => {
    console.log(id);
    handlePrintLot(id);
    setOpen(true);
  };

  useEffect(() => {
    NavbarSetting("Production", dispatch);
  }, []);
  useEffect(() => {
    clearData();
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

  useEffect(() => {
    if (selectedLotNumber) {
      getAddToLotListing();
    }
  }, [selectedLotNumber]);

  const handleLotSelect = (value) => {
    const filteredArray = lotApiData.filter((item) => item.number === value);
    if (filteredArray.length > 0) {
      const isNumberInArray = apiDataArray.some((obj) => obj.number === value);
      if (!isNumberInArray) {
        setSelectedLotNumber(value);
      } else {
        dispatch(
          Actions.showMessage({
            message: "This lot already added",
            variant: "error",
          })
        );
      }
    }
  };

  function getProductData(sData) {
    Axios.get(
      Config.getCommonUrl() +
        `api/production/lot/number/searching?department_id=${department_id}&number=${sData}`
    )
      .then(function (response) {
        if (response.data.success === true && response.data.data.length > 0) {
          setLotApiData(response.data.data);
        } else {
          setLotApiData([]);
          dispatch(Actions.showMessage({ message: "No Lot found" }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/production/lot/number/searching?department_id=${department_id}&number=${sData}`,
        });
      });
  }

  function getAddToLotListing() {
    const body = {
      number: selectedLotNumber,
      department_id: department_id,
    };
    Axios.post(Config.getCommonUrl() + `api/production/lot/number`, body)
      .then(function (response) {
        if (response.data.success) {
          const dataArr = response.data.data;
          console.log(response.data.data);
          if (workstationId === "") {
            setWorkstationId(dataArr.workstation_id);
            setApiDataArray([...apiDataArray, dataArr]);
          } else {
            if (workstationId === dataArr.workstation_id) {
              setApiDataArray([...apiDataArray, dataArr]);
            } else {
              dispatch(
                Actions.showMessage({
                  message: "Workstation is not same",
                  variant: "error",
                })
              );
            }
          }
        }
        // if (response.data.success) {
        //   console.log(response.data.data);
        //
        //   setApiDataArray([...apiDataArray, dataArr]);
        // } else {
        //   setApiDataArray([...apiDataArray]);
        //   dispatch(
        //     Actions.showMessage({
        //       message: response.data.message,
        //       variant: "error",
        //     })
        //   );
        // }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/production/lot/number`,
        });
      });
  }

  function clearData() {
    setApiDataArray([]);
    setSelectedLotNumber("");
    setTransferArray([]);
    setCreatedLot([]);
    setWorkstationId("");
  }

  const handleDesignSelect = (e) => {
    const arrData = [...selectedDesignArr];
    const newValue = JSON.parse(e.target.value);
    let newSelectDesign;
    const isObjectInArray = arrData.some(
      (obj) => JSON.stringify(obj) === e.target.value
    );
    if (isObjectInArray) {
      newSelectDesign = arrData.filter((s) => s.id !== newValue.id);
    } else {
      newSelectDesign = [...arrData, newValue];
    }
    setSelectedDesignArr(newSelectDesign);
  };

  const validatelotCategory = () => {
    const arrData = [...selectedDesignArr];
    let categoryName;
    let categoryId;
    for (const item of arrData) {
      const lotProductCategory = item.LotProductCategory;
      if (categoryName === undefined && categoryId === undefined) {
        categoryName = lotProductCategory.category_name;
        categoryId = lotProductCategory.id;
      } else {
        if (
          categoryName !== lotProductCategory.category_name ||
          categoryId !== lotProductCategory.id
        ) {
          dispatch(
            Actions.showMessage({
              message: "Selected all lot must belong to same category",
              variant: "error",
            })
          );
          return false;
        }
      }
    }
    return true;
  };

  const validatePurity = () => {
    const arrData = [...selectedDesignArr];
    let purity;
    for (const item of arrData) {
      if (purity === undefined) {
        purity = item.purity;
      } else {
        if (purity !== item.purity) {
          dispatch(
            Actions.showMessage({
              message: "Selected all lot must have same purity",
              variant: "error",
            })
          );
          return false;
        }
      }
    }
    return true;
  };

  const validateBaseNum = () => {
    const arrData = [...selectedDesignArr];
    let lotNumber;

    for (const item of arrData) {
      if (lotNumber === undefined) {
        lotNumber = item.number.split(".")[0];
      } else {
        if (lotNumber !== item.number.split(".")[0]) {
          dispatch(
            Actions.showMessage({
              message: "Selected all lot must have same base lot number",
              variant: "error",
            })
          );
          return false;
        }
      }
    }
    return true;
  };

  const validateSelectedNum = () => {
    const arrData = [...selectedDesignArr];
    if (arrData.length <= 1) {
      dispatch(
        Actions.showMessage({
          message: "For merging lot select more than one lot number",
          variant: "error",
        })
      );
      return false;
    }
    return true;
  };

  const handleTransfer = () => {
    if (selectedDesignArr.length === 0) {
      dispatch(
        Actions.showMessage({ message: "Please Select Lot", variant: "error" })
      );
    } else {
      transferClick();
    }
  };

  const transferClick = () => {
    if (
      validateSelectedNum() &&
      validatelotCategory() &&
      validatePurity() &&
      validateBaseNum()
    ) {
      const filteredMainarr = apiDataArray.filter((mainObj) => {
        // Check if the object is not in selectedDesignArr
        return !selectedDesignArr.some(
          (subObj) => JSON.stringify(subObj) === JSON.stringify(mainObj)
        );
      });
      setApiDataArray(filteredMainarr);
      setTransferArray(selectedDesignArr);
      setSelectedDesignArr([]);
    }
  };

  const deleteTransfer = (item) => {
    const remaining = transferArray.filter((s) => s.id !== item.id);
    const designArr = [...apiDataArray];
    designArr.push(item);
    setApiDataArray(designArr);
    setTransferArray(remaining);
  };

  const validateScanlot = () => {
    if (transferArray.length === 0 && apiDataArray.length === 0) {
      dispatch(Actions.showMessage({ message: "Please scan lot", }));
      return false;
    }
    return true;
  };

  const validateTransfer = () => {
    if (transferArray.length === 0) {
      dispatch(Actions.showMessage({ message: "Please transfer design" }));
      return false;
    }
    return true;
  };

  const createSubLot = (isOnlySave) => {
    if (validateScanlot() && validateTransfer()) {
      createSubLotApi(isOnlySave);
    }
  };

  const createSubLotApi = (isOnlySave) => {
    const designIds = [];
    transferArray.map((item) => {
      designIds.push(item.id);
    });
    const body = {
      department_id: department_id,
      selectedLotIds: designIds,
    };
    Axios.post(Config.getCommonUrl() + `api/production/mergeLot`, body)
      .then(function (response) {
        dispatch(Actions.showMessage({ message: response.data.message }));
        if (response.data.success) {
          const apiData = response.data.data.lot;
          const actNum = response.data.data.activityNumber;
          setCreatedLot([...createdLot, apiData]);
          // setPrintObj([...printObj, response.data.data.lot]);
          // setPrintObj([...createdLot, response.data.data.lot]);
          if (isOnlySave === 0) {
            handleMergeLotPrint(apiData.id, actNum);
          }
        }
        setTransferArray([]);
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/production/mergeLot`,
          body,
        });
      });
  };
  function handleMergeLotPrint(lotId, actNumber) {
    const body = {
      lot_id: lotId,
      activityNumber: actNumber,
    };
    Axios.post(
      Config.getCommonUrl() + `api/productionPrintVoucher/merge/lot/print`,
      body
    )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setModalOpen(false);
          const datas = setPrintObjCreLot([response.data.data]);
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
          api: `api/productionPrintVoucher/merge/lot/print`,
          body,
        });
      });
  }
  function handlePrintLot(id) {
    Axios.get(
      Config.getCommonUrl() + `api/productionPrintVoucher/planAndlot/${id}`
    )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setModalOpen(false);
          // CreatedLot();
          // getPlanningLots()
          // planningLotsList()
          setPrintObj(response.data.data);
          setPrintObjMultiple(response.data.MultipleData);
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
          api: `api/productionPrintVoucher/planAndlot/${id}`,
        });
      });
  }

  return (
    <>
      <Box className={classes.model} style={{ overflowY: "auto" }}>
        <Grid container className={classes.modalContainer}>
          <Grid item xs={12} sm={4} md={3} key="1">
            <FuseAnimate delay={300}>
              <Typography className="pl-28 pb-16 pt-16 text-18 font-700">
                Merge
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
              <Grid item xs={12} style={{ marginBottom: 16 }}>
                <Grid item className="packing-slip-input">
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
            </Grid>
            {console.log(apiDataArray)}
            <Grid item>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
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
                            {HelperFunc.getTotalOfFieldNoDecimal(
                              apiDataArray,
                              "pcs"
                            )}
                            Pcs
                          </span>
                          )
                        </Typography>
                      </Grid>
                      <Grid item>
                        <TextField
                          variant="outlined"
                          placeholder="Scan / Search"
                          value={designSearch}
                          onChange={(e) => setDesignSearch(e.target.value)}
                        />
                      </Grid>
                    </Grid>

                    <TableContainer
                      className={classes.scroll}
                      style={{ maxHeight: 400, overflowY: "auto" }}
                    >
                      <Table className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell
                              className={classes.tableRowPad}
                              width="40px"
                            ></TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              width="110px"
                            >
                              Lot No
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              width="110px"
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
                              className={classes.tableRowPad}
                              width="80px"
                            >
                              Net Weight
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              width="70px"
                            >
                              Status
                            </TableCell>
                            {/* <TableCell
                            className={classes.tableRowPad}
                            width="70px"
                          >
                          </TableCell> */}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {apiDataArray.length === 0 ? (
                            <TableRow>
                              <TableCell
                                className={classes.tableRowPad}
                                align="center"
                                colSpan={9}
                              >
                                <div style={{ textAlign: "center" }}>
                                  No Data
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : (
                            apiDataArray
                              .filter(
                                (temp) =>
                                  temp.number
                                    .toLowerCase()
                                    .includes(designSearch.toLowerCase()) ||
                                  temp.LotProductCategory?.category_name
                                    .toLowerCase()
                                    .includes(designSearch.toLowerCase()) ||
                                  temp.pcs
                                    .toString()
                                    .toLowerCase()
                                    .includes(designSearch.toLowerCase()) ||
                                  temp.stone_pcs
                                    .toString()
                                    .toLowerCase()
                                    .includes(designSearch.toLowerCase()) ||
                                  temp.total_gross_wgt
                                    .toString()
                                    .toLowerCase()
                                    .includes(designSearch.toLowerCase()) ||
                                  temp.total_stone_weight
                                    .toString()
                                    .toLowerCase()
                                    .includes(designSearch.toLowerCase()) ||
                                  temp.total_net_wgt
                                    .toString()
                                    .toLowerCase()
                                    .includes(designSearch.toLowerCase())
                              )
                              .map((item, i) => (
                                <TableRow key={i}>
                                  <TableCell className={classes.tableRowPad}>
                                    <Checkbox
                                      style={{
                                        padding: 0,
                                        color: "#415bd4",
                                      }}
                                      color="primary"
                                      checked={
                                        selectedDesignArr.some(
                                          (obj) =>
                                            JSON.stringify(obj) ===
                                            JSON.stringify(item)
                                        )
                                          ? true
                                          : false
                                      }
                                      onChange={handleDesignSelect}
                                      value={JSON.stringify(item)}
                                    />
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {item.number}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {item?.LotProductCategory?.category_name}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {item?.pcs}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {item?.stone_pcs}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {item?.total_gross_wgt}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {item?.total_stone_weight}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {item?.total_net_wgt}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    Casted
                                  </TableCell>
                                </TableRow>
                              ))
                          )}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell
                              className={classes.tableRowPad}
                            ></TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                            ></TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                            ></TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                            ></TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                            ></TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                            ></TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                            ></TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                            ></TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <Button
                                variant="contained"
                                size="small"
                                style={{
                                  background: "#DFAD08",
                                  color: "#FFFFFF",
                                  textTransform: "capitalize",
                                }}
                                // disabled={
                                //   selectedDesignArr.length === 0 ? true : false
                                // }
                                onClick={handleTransfer}
                              >
                                Transfer
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </TableContainer>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box style={{ marginBottom: 16 }}>
                    <Grid
                      container
                      justifyContent="space-between"
                      alignItems="center"
                      style={{ padding: 10, background: "#e3e3e3" }}
                    >
                      <Grid item>
                        <Typography style={{ fontWeight: 700 }}>
                          Selected Items(
                          <span>
                            {HelperFunc.getTotalOfFieldNoDecimal(
                              transferArray,
                              "pcs"
                            )}
                            Pcs
                          </span>
                          )
                        </Typography>
                      </Grid>
                      <Grid item>
                        <TextField
                          variant="outlined"
                          placeholder="Scan / Search"
                          value={transferSearch}
                          onChange={(e) => setTransferSearch(e.target.value)}
                        />
                      </Grid>
                    </Grid>

                    <TableContainer
                      className={classes.scroll}
                      style={{ maxHeight: 400, overflowY: "auto" }}
                    >
                      <Table className={classes.table}>
                        <TableHead>
                          <TableRow>
                            <TableCell
                              className={classes.tableRowPad}
                              width="40px"
                            ></TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              width="110px"
                            >
                              Lot No
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              width="110px"
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
                              className={classes.tableRowPad}
                              width="80px"
                            >
                              Net Weight
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              width="70px"
                            >
                              Status
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {transferArray.length === 0 ? (
                            <TableRow>
                              <TableCell
                                className={classes.tableRowPad}
                                align="center"
                                colSpan={9}
                              >
                                <div style={{ textAlign: "center" }}>
                                  No Data
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : (
                            transferArray
                              .filter(
                                (temp) =>
                                  temp.number
                                    .toLowerCase()
                                    .includes(transferSearch.toLowerCase()) ||
                                  temp.LotProductCategory?.category_name
                                    .toLowerCase()
                                    .includes(transferSearch.toLowerCase()) ||
                                  temp.pcs
                                    .toString()
                                    .toLowerCase()
                                    .includes(transferSearch.toLowerCase()) ||
                                  temp.stone_pcs
                                    .toString()
                                    .toLowerCase()
                                    .includes(transferSearch.toLowerCase()) ||
                                  temp.total_gross_wgt
                                    .toString()
                                    .toLowerCase()
                                    .includes(transferSearch.toLowerCase()) ||
                                  temp.total_stone_weight
                                    .toString()
                                    .toLowerCase()
                                    .includes(transferSearch.toLowerCase()) ||
                                  temp.total_net_wgt
                                    .toString()
                                    .toLowerCase()
                                    .includes(transferSearch.toLowerCase())
                              )
                              .map((item, i) => (
                                <TableRow key={i}>
                                  <TableCell className={classes.tableRowPad}>
                                    <IconButton
                                      style={{ padding: "0" }}
                                      tabIndex="-1"
                                      onClick={() => deleteTransfer(item)}
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
                                    {item.number}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {item?.LotProductCategory?.category_name}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {item?.pcs}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {item?.stone_pcs}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {item?.total_gross_wgt}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {item?.total_stone_weight}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {item?.total_net_wgt}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    Casted
                                  </TableCell>
                                </TableRow>
                              ))
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                  <Grid container spacing={1} style={{ marginBottom: 16 }}>
                    <Grid
                      item
                      xs={12}
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: 16,
                        alignItems: "center",
                      }}
                    >
                      <Button
                        id="btn-all-production"
                        variant="contained"
                        style={{
                          color: "#FFFFFF",
                          marginTop: 15,
                          display: "block",
                          marginRight: 15,
                        }}
                        onClick={() => createSubLot(1)}
                      >
                        Merge Lot
                      </Button>
                      <Button
                        id="btn-all-production"
                        variant="contained"
                        style={{
                          color: "#FFFFFF",
                          marginTop: 15,
                          display: "block",
                        }}
                        onClick={() => createSubLot(0)}
                    >
                      Merge Lot & Print
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} style={{ marginBottom: 16 }}>
              <Typography style={{ paddingBlock: 10, fontSize: 18 }}>
                Created Lot
              </Typography>

              <TableContainer
                className={classes.scroll}
                style={{ maxHeight: 400, overflowY: "auto" }}
              >
                <Table
                  className={`${classes.table}`}
                  style={{ minWidth: "900px" }}
                >
                  <TableHead className={classes.tablehead}>
                    <TableRow>
                      <TableCell className={classes.tableRowPad} width="160px">
                        Lot Number
                      </TableCell>
                      <TableCell className={classes.tableRowPad} width="190px">
                        Lot Category
                      </TableCell>
                      <TableCell className={classes.tableRowPad} width="70px">
                        Purity
                      </TableCell>
                      <TableCell className={classes.tableRowPad} width="70px">
                        Lot Pcs
                      </TableCell>
                      <TableCell className={classes.tableRowPad} width="70px">
                        Stone Pcs
                      </TableCell>
                      <TableCell className={classes.tableRowPad} width="130px">
                        Gross Weight
                      </TableCell>
                      <TableCell className={classes.tableRowPad} width="130px">
                        Stone Weight
                      </TableCell>
                      <TableCell className={classes.tableRowPad} width="120px">
                        Net Weight
                      </TableCell>
                      <TableCell className={classes.tableRowPad} width="80px">
                        Status
                      </TableCell>
                      <TableCell className={classes.tableRowPad}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {createdLot.length === 0 ? (
                      <TableRow>
                        <TableCell
                          className={classes.tableRowPad}
                          align="center"
                          colSpan={10}
                        >
                          <div style={{ textAlign: "center" }}>No Data</div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      createdLot.map((item, i) => {
                        console.log(item);
                        return (
                          <TableRow key={i}>
                            <TableCell className={classes.tableRowPad}>
                              {item?.number}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {item?.LotProductCategory?.category_name}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {item?.purity}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {item?.pcs}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {item?.stone_pcs}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {item?.total_gross_wgt}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {item?.total_stone_weight}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {item?.total_net_wgt}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              Casted
                            </TableCell>
                            <TableCell>
                              <Grid
                                item
                                xs={12}
                                style={{
                                  display: "flex",
                                }}
                              >
                                <Button
                                  variant="contained"
                                  style={{
                                    color: "#FFFFFF",
                                    background: "#1FD319",
                                    fontWeight: "700",
                                    marginRight: 5,
                                  }}
                                  onClick={() => handleSetPrint(item.id)}
                                >
                                  Print
                                </Button>
                              </Grid>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            <Grid
              item
              xs={12}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              {/* <Button
              onClick={handlePrint}
              style={{
                fontWeight: "700",
                color: "#FFFFFF",
                background: "#1FD319",
                marginRight: 10,
              }}
            >
              Print
            </Button> */}

              {/* <Button
              style={{
                fontWeight: "700",
                color: "#FFFFFF",
                background: "#1FD319",
              }}
            >
              Save
            </Button> */}
            </Grid>
          </Box>

          <div>
            <Modal open={open} onClose={handleClose} className={classes.modal}>
              <div style={{ width: 500, background: "#FFFFFF" }}>
                <Typography
                  variant="h6"
                  className={classes.title}
                  style={{ textAlign: "center", position: "relative" }}
                >
                  Voucher Format
                  <IconButton
                    style={{
                      padding: "0",
                      position: "absolute",
                      right: "5px",
                      top: "16px",
                      fontSize: "22px",
                    }}
                    onClick={handleClose}
                  >
                    <Icon className="mr-8" style={{ color: "#ffffff" }}>
                      close
                    </Icon>
                  </IconButton>
                </Typography>

                <Grid container className={classes.modalBody} spacing={2}>
                  <FormControl>
                    <RadioGroup
                      className="packingslip-table-main"
                      // defaultValue={0}
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={voucherPrintType}
                      onChange={(e) => handleChange(e)}
                    >
                      <FormControlLabel
                        value={0}
                        control={<Radio />}
                        label="Lot Summary"
                      />
                      <FormControlLabel
                        value={1}
                        control={<Radio />}
                        label="Lot Design"
                      />
                    </RadioGroup>
                  </FormControl>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      className={classes.actionBtn}
                      onClick={handlePrint}
                    >
                      Print
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </Modal>
          </div>

          {/* <div style={{ display: "none" }}>
        <MergePrint ref={componentRef} printObj={printObj} />
      </div> */}

          <div style={{ display: "none" }}>
            <LotSummary
              ref={componentRefSummary}
              printObj={printObj}
              getDateAndTime={getDateAndTime()}
            ></LotSummary>
          </div>
          <div style={{ display: "none" }}>
            <LotDesign
              ref={componentRefDesign}
              printObj={printObjMultiple}
            ></LotDesign>
          </div>
          <div style={{ display: "none" }}>
        <IssueToWorkerPrint
          ref={componentRefMergeLot}
          printObj={printObjCreLot}
          from="Merge For"
        />
      </div>
        </div>
      </Box>
    </>
  );
};

export default Merge;
