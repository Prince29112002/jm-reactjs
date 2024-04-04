import React, { useContext, useState, useEffect, useRef } from "react";
import {
  AppBar,
  Box,
  Button,
  Icon,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppContext from "app/AppContext";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import Loader from "app/main/Loader/Loader";
import AllDataList from "./Subviews/AllDataList";
import { CSVLink } from "react-csv";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import * as XLSX from "xlsx";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";
import { repeat } from "lodash";
import QRCode from "react-qr-code";
import brcodelogo from "../../../../../assets/images/Login Vector/brcodelogo.png"
import { TaggingPrint } from "./TaggingPrintComponent/TaggingPrint";
import { useReactToPrint } from "react-to-print";

const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    maxWidth: 516,
    // width: "calc(100% - 30px)",
    width: 516,
    // height: 722,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    // padding: theme.spacing(4),
    outline: "none",
    fontSize: 5
  },
  // button: {
  //   margin: 5,
  //   textTransform: "none",
  //   backgroundColor: "#415BD4",
  //   color: "#FFFFFF",
  //   borderRadius: 7,
  //   letterSpacing: "0.06px",
  // },
  tab: {
    padding: 0,
    minWidth: "auto",
    marginRight: 30,
    textTransform: "capitalize",
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

const StockTaggingList = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [modalStyle] = useState(getModalStyle);

  const [modalView, setModalView] = useState(0);

  const [allData, setAllData] = useState([]);
  const [tabTwoArr, setTabTwoArr] = useState([]);
  const [tabThreeArr, setTabThreeArr] = useState([]);
  const [tabFourArr, setTabFourArr] = useState([]);
  const [downloadData, setDownloadData] = useState([]);
  const [passList, setPassList] = useState([]);

  const appContext = useContext(AppContext);
  const { selectedDepartment } = appContext;
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);

  const pageName = props.location.pathname;
  const roleOfUser = localStorage.getItem("permission")
    ? JSON.parse(localStorage.getItem("permission"))
    : null;
    const myprofileData = localStorage.getItem("myprofile")
    ? JSON.parse(localStorage.getItem("myprofile"))
    : [];
  const [authAccessArr, setAuthAccessArr] = useState([]);
  const [selecteBarcodedData, setSelectedBarcodeData] = useState([]);
  const childRef = useRef();
  const [printData, setPrintData] = useState([]);
  const [clearData, setClearData] = useState(false)

  const handleSelectedBarcodeData = (data) => {
    setSelectedBarcodeData(data);
  };

  useEffect(() => {
    let arr;
    if (pageName === "/dashboard/stocktaggingretailer") {
      arr = roleOfUser
        ? roleOfUser["Tagging-Retailer"]["Tagging List-Retailer"]
          ? roleOfUser["Tagging-Retailer"]["Tagging List-Retailer"]
          : []
        : [];
    } else {
      arr = roleOfUser
        ? roleOfUser["Stock-Retailer"]["Stock List-Retailer"]
          ? roleOfUser["Stock-Retailer"]["Stock List-Retailer"]
          : []
        : [];
    }
    const arrData = [];
    if (arr.length > 0) {
      arr.map((item) => {
        arrData.push(item.name);
      });
    }
    setAuthAccessArr(arrData);
  }, []);

  useEffect(() => {
    if (selectedDepartment !== "") {
      getStockData();
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 3000);
    }
  }, [loading]);

  useEffect(() => {
    return () => {
      console.log("cleaned up");
    };
  }, []);

  useEffect(() => {
    if (pageName === `/dashboard/stocktaggingretailer`) {
      NavbarSetting("Tagging-Retailer", dispatch);
    } else {
      NavbarSetting("Stock-Retailer", dispatch);
    }
  }, []);

  const [printObj, setPrintObj] = useState([]);

  const componentRef = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef(null);

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

  const handleBeforePrint = React.useCallback(() => {}, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
    return new Promise((resolve) => {
      onBeforeGetContentResolve.current = resolve;

      setTimeout(() => {
        // setLoading(false);
        // setText("New, Updated Text!");
        resolve();
      }, 10);
    });
  }, []); //setText

  const handleAfterPrint = () => {
    //React.useCallback
    //resetting after print
    // checkAndReset();
    setClearData(true)
    setModalOpen(false)
    setPrintData([])
    setSelectedBarcodeData([])
  };
  // function checkAndReset() {
  //   if (isView === false) {
  //     History.goBack();
  //   }
  // }

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "QRCode" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
  });
  function checkforPrint() {
    handlePrint();
  }

  function barcodePostApi(tag) {
    console.log(tag);
    // setLoading(true);
    const payload = {
      mydata: selecteBarcodedData,
      tag_format: tag
    };

    axios
      .post(
        Config.getCommonUrl() +
          `retailerProduct/api/tagPrintPendingList/tagging/printer`, payload
      )
      .then(function (response) {
        console.log(response);

        if (response.data.success === true) {
          setPrintData(response.data.data)
          setPrintObj(response.data.data)
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
          api: `retailerProduct/api/tagPrintPendingList/tagging/printer`,
          payload,
        });
      });
  }

  const refreshApi = () => {
    setAllData([]);
    setPassList([]);
    setTabTwoArr([]);
    setTabThreeArr([]);
    setTabFourArr([]);
    getStockData();
  };

  function getStockData() {
    setLoading(true);
    axios
      .get(
        Config.getCommonUrl() +
          `retailerProduct/api/stock?department_id=${
            selectedDepartment.value.split("-")[1]
          }`
      )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          const apiData = response.data.data;
          const allArr = [];
          const lossMetalArr = [];
          const jewelleryArr = [];
          const customArr = [];

          apiData.map((item) => {
            if (item.flag === 1 && item.item_id === 1) {
              item.fineGold = parseFloat(
                (parseFloat(item.net_weight) * parseFloat(item.purity)) / 100
              ).toFixed(3);
            }
            allArr.push(item);
            if (item.flag === 1) {
              lossMetalArr.push(item);
            } else if (item.flag === 2) {
              jewelleryArr.push(item);
            } else if (item.flag === 3) {
              customArr.push(item);
            }
          });

          setAllData(allArr);
          setPassList(allArr);
          setTabTwoArr(lossMetalArr);
          setTabThreeArr(jewelleryArr);
          setTabFourArr(customArr);
          let tmpDlData = allArr.map((item) => {
            return {
              "Stock Type": item.stockType,
              "Stock Code": item.stock_name_code,
              "Order Number" : item.hasOwnProperty("order_number")
              ? item.order_number
              : "",
              "Reference Name" : item.hasOwnProperty("reference_name")
              ? item.reference_name
              : "",
              Category: item.hasOwnProperty("category_name")
                ? item.category_name
                : "",
              Purity: item.purity,
              Pieces: item.pcs,
              "Gross Weight": item.gross_weight,
              "Net Weight": item.net_weight,
              "Fine Gold": item.fineGold,
              "Other Weight": item.other_weight,
              "Sales Price": item.sales_price,
            };
          });

          setDownloadData(tmpDlData);
          setLoading(false);
        } else {
          setLoading(false);
          setAllData([]);
          setPassList([]);
          setTabTwoArr([]);
          setTabThreeArr([]);
          setTabFourArr([]);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
            })
          );
        }
      })
      .catch((error) => {
        setLoading(false);
        setAllData([]);
        setPassList([]);
        setTabTwoArr([]);
        setTabThreeArr([]);
        setTabFourArr([]);
        console.log(error);
        handleError(error, dispatch, {
          api:
            "retailerProduct/api/stock?department_id=" +
            selectedDepartment.value.split("-")[1],
        });
      });
  }

  const handleChangeTab = (event, value) => {
    console.log(value);
    setModalView(value);
    if (value === 0) {
      setPassList(allData);
      const tmpDlData = allData.map((item) => {
        return {
          "Stock Type": item.stockType,
          "Stock Code": item.stock_name_code,
          "Order No": item.hasOwnProperty("order_number")
            ? item.order_number
            : "",
          "Reference Name": item.hasOwnProperty("reference_name")
            ? item.reference_name
            : "",
          Category: item.hasOwnProperty("category_name")
            ? item.category_name
            : "",
          Purity: item.purity,
          Pieces: item.pcs,
          "Gross Weight": item.gross_weight,
          "Net Weight": item.net_weight,
          "Fine Gold": item.fineGold,
          "Other Weight": item.other_weight,
          "Sales Price": item.sales_price,
        };
      });
      setDownloadData(tmpDlData);
    } else if (value === 1) {
      setPassList(tabTwoArr);
      const tmpDlData = tabTwoArr.map((item) => {
        return {
          "Stock Type": item.stockType,
          "Stock Code": item.stock_name_code,
          "Order No": item.hasOwnProperty("order_number")
            ? item.order_number
            : "",
          "Reference Name": item.hasOwnProperty("reference_name")
            ? item.reference_name
            : "",
          Category: item.hasOwnProperty("category_name")
            ? item.category_name
            : "",
          Purity: item.purity,
          Pieces: item.pcs,
          "Gross Weight": item.gross_weight,
          "Net Weight": item.net_weight,
          "Fine Gold": item.fineGold,
          "Other Weight": item.other_weight,
          "Sales Price": item.sales_price,
        };
      });
      setDownloadData(tmpDlData);
    } else if (value === 2) {
      setPassList(tabThreeArr);
      const tmpDlData = tabThreeArr.map((item) => {
        return {
          "Stock Type": item.stockType,
          "Stock Code": item.stock_name_code,
          "Order No": item.hasOwnProperty("order_number")
            ? item.order_number
            : "",
          "Reference Name": item.hasOwnProperty("reference_name")
            ? item.reference_name
            : "",
          Category: item.hasOwnProperty("category_name")
            ? item.category_name
            : "",
          Purity: item.purity,
          Pieces: item.pcs,
          "Gross Weight": item.gross_weight,
          "Net Weight": item.net_weight,
          "Fine Gold": item.fineGold,
          "Other Weight": item.other_weight,
          "Sales Price": item.sales_price,
        };
      });
      setDownloadData(tmpDlData);
    } else if (value === 3) {
      setPassList(tabFourArr);
      const tmpDlData = tabFourArr.map((item) => {
        return {
          "Stock Type": item.stockType,
          "Stock Code": item.stock_name_code,
          "Order No": item.hasOwnProperty("order_number")
            ? item.order_number
            : "",
          "Reference Name": item.hasOwnProperty("reference_name")
            ? item.reference_name
            : "",
          Category: item.hasOwnProperty("category_name")
            ? item.category_name
            : "",

          Purity: item.purity,
          Pieces: item.pcs,
          "Gross Weight": item.gross_weight,
          "Net Weight": item.net_weight,
          "Fine Gold": item.fineGold,
          "Other Weight": item.other_weight,
          "Sales Price": item.sales_price,
        };
      });
      setDownloadData(tmpDlData);
    }
  };

  const handleCreateBarcode = (tag) => {
    setModalOpen(true)
    barcodePostApi(tag)
  }

  function handleModalClose() {
    setClearData(true)
    setModalOpen(false)
    setPrintData([])
    setSelectedBarcodeData([])
  }

  useEffect(()=>{
    if(!modalOpen){
      setClearData(false)
    }
  },[modalOpen])

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container table-width-mt">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1">
            
            <Grid
              container
              alignItems="center"
              style={{ marginBottom: 20, marginTop: 20, paddingInline: 30 }}
            >
              <Grid item xs={8} sm={4} md={4} lg={5} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    {pageName === `/dashboard/stocktaggingretailer`
                      ? "Tagging List"
                      : "Stock List"}
                  </Typography>
                </FuseAnimate>
              </Grid>

              {authAccessArr.includes("Export Stock-Retailer") && (
                <Grid item xs={4} sm={8} md={8} lg={7} key="2">
                  <Button
                    className="csvbutton"
                    disabled={downloadData.length === 0}
                    style={{
                      backgroundColor: downloadData.length === 0 && "#EBEEFB",
                    }}
                  >
                    <CSVLink
                      className="csvbuttontext"
                      data={
                        downloadData.length > 0
                          ? downloadData
                          : "No data available"
                      }
                      filename={
                        (pageName === `/dashboard/stocktaggingretailer`
                          ? "Tagging_data_"
                          : "Stock_data_") +
                        new Date().getDate() +
                        "_" +
                        (new Date().getMonth() + 1) +
                        "_" +
                        new Date().getFullYear() +
                        ".csv"
                      }
                    >
                      Download
                    </CSVLink>
                  </Button>
                </Grid>
              )}
            </Grid>

            {loading && <Loader />}
            <div className="main-div-alll">
              <div className={classes.root}>
                <Grid container justifyContent="space-between" alignItems="center" style={{ paddingBottom: 20 }}>
                  <Grid item>
                    <Tabs
                      value={modalView}
                      onChange={handleChangeTab}
                      // style={{ paddingBottom: 20 }}
                      variant="scrollable"
                      scrollButtons="auto"
                    >
                      <Tab className={classes.tab} label="All List" />
                      <Tab className={classes.tab} label="Loose Metal" />
                      <Tab className={classes.tab} label="Jewellery Purchased" />
                      <Tab className={classes.tab} label="Custom Orders Tag" />
                    </Tabs>
                  </Grid>
                  {(modalView === 2 || modalView === 3 || modalView === 0) && pageName === "/dashboard/stocktaggingretailer" &&
                  (<>
                  <Grid item style={{display: "flex", columnGap: 15}}>
                    <Button
                      variant="contained"
                      color="primary"
                      className="btn-print-save"
                      aria-label="Register"
                      onClick={(e) => {
                        if (selecteBarcodedData.length === 0) {
                          dispatch(
                            Actions.showMessage({
                              message:
                                "Plz select barcode",
                              variant: "error",
                            })
                          );
                        } else {
                          handleCreateBarcode("tag2");
                        }
                      }}
                    >
                      Print Barcode (Only Rs)
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      className="btn-print-save"
                      aria-label="Register"
                      onClick={(e) => {
                        if (selecteBarcodedData.length === 0) {
                          dispatch(
                            Actions.showMessage({
                              message:
                                "Please select barcode",
                              variant: "error",
                            })
                          );
                        } else {
                          handleCreateBarcode("tag1");
                        }
                      }}
                    >
                      Print Barcode (Weight + Rs)
                    </Button>
                  </Grid></>)}
                </Grid>

                <AllDataList
                  authAccessArr={authAccessArr}
                  props={props}
                  allData={passList}
                  refreshApi={refreshApi}
                  pgName={pageName}
                  flag={false}
                  onselectedBarcodeData={handleSelectedBarcodeData} 
                  modalView={modalView}
                  clearData={clearData}
                />
              </div>
            </div>
            <Modal
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={modalOpen}
            >
              {/* {modalOpen && loading ? <Loader /> : ""} */}
              <div style={modalStyle} className={clsx(classes.paper, "rounded-8")}>
              <h5 className="popup-head p-20">
                {/* {isEdit === true
              ? "Edit Category"
              : isView
              ? "View Category"
              : "Add New Category"} */}

                Barcode
                <IconButton
                  style={{ position: "absolute", top: "3px", right: "6px" }}
                  onClick={handleModalClose}
                >
                  <Icon>
                    <img src={Icones.cross} alt="" />
                  </Icon>
                </IconButton>
              </h5>
              <Box style={{paddingTop: 18, paddingInline: 15, height: 722}}>
                <ul 
                className="barcode_print"
                // style={{display: "grid",rowGap: 11, gridTemplateColumns: "repeat(2, 1fr)"}}
                >
                  {
                    printData.map((data, index) => {
                      console.log(data);
                    return(
                      <li style={{width: "50%"}} key={index}>
                        <Grid container className="barcodeitem" style={{width: 153, height: 49, padding: 3, border: "1px solid #cccccc", borderRadius: 7}}>
                          <Grid item xs={6}>
                            { myprofileData.logo &&
                            <img src={myprofileData.logo} alt="QR" width="auto" height="40px" style={{display: "block", verticalAlign: "middle", marginInline: "auto"}} />
                            }
                          </Grid>
                          <Grid item xs={6}>
                            <div>
                              <Grid container alignItems="center">
                                <Grid item xs={6}>
                                  <QRCode 
                                    size={256}
                                    style={{ height: "auto", maxWidth: "calc(100% - 4px)", width: "calc(100% - 4px)", padding: 2 }}
                                    value={JSON.stringify(data.qr)}
                                    viewBox={`0 0 256 256`}
                                  />
                                </Grid>
                                <Grid item xs={6}>
                                  <div>
                                    {data.Gwt && <div><span style={{display: "inline-block", width: "45%"}}>Gwt</span>:<span style={{paddingInline: 0}}>{data.Gwt}</span></div>}
                                    {data.Less && <div><span style={{display: "inline-block", width: "45%"}}>Less</span>:<span style={{paddingInline: 0}}>{data.Less}</span></div>}
                                    {data.Nwt && <div><span style={{display: "inline-block", width: "45%"}}>Nwt</span>:<span style={{paddingInline: 0}}>{data.Nwt}</span></div>}
                                    {data.Rs && <div><span style={{display: "inline-block", width: "45%"}}>Rs</span>:<span style={{paddingInline: 0}}>{data.Rs}</span></div>}
                                  </div>
                                </Grid>
                                <Grid item xs={12}>
                                  <p style={{fontSize: 6, textAlign: "center"}}><span></span>{data.barcode}</p>
                                </Grid>
                              </Grid>
                            </div>
                          </Grid>
                        </Grid>
                      </li>
                    )})
                  }
                  
                  
                </ul>
              </Box>
              <Grid container justifyContent="center" style={{paddingBlock: 20}}>
                <Grid item>
                  <Button
                    variant="contained"
                    className="w-160 mx-auto popup-save"
                    style={{ marginLeft: "20px" }}
                    onClick={checkforPrint}
                  >
                    Print
                  </Button>
                </Grid>
              </Grid>
              </div>
            </Modal>
            <div 
              style={{display: "none"}}
            >
              <TaggingPrint ref={componentRef} printObj={printObj} />
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default StockTaggingList;
