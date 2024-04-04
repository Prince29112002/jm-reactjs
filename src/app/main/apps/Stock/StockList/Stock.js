import React, { useContext, useState, useEffect } from "react";
import {
  AppBar,
  Button,
  Icon,
  IconButton,
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
import AllStockView from "./Subviews/AllStockView";
import { CSVLink } from "react-csv";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import * as XLSX from "xlsx";
import handleError from "app/main/ErrorComponent/ErrorComponent";

const useStyles = makeStyles((theme) => ({
  root: {},

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

const Stock = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [modalView, setModalView] = useState(0);

  const [allData, setAllData] = useState([]);
  const [goldLooseList, setGoldLooseList] = useState([]);
  const [otherLooseList, setOtherLooseList] = useState([]);
  const [packingSLipData, setPackingSlipData] = useState([]);
  const [packetData, setPacketData] = useState([]);
  const [lotData, setLotData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [downloadData, setDownloadData] = useState([]);

  const [departmentWiseStock, setDepartmentWiseStock] = useState([]);
  const [apiData, setApiData] = useState("");

  const [barcodeInStock, setBarcodeInStock] = useState([]);
  const [packectList, sePackectList] = useState([]);

  const [packingList, setPackingList] = useState(0);

  const appContext = useContext(AppContext);
  const { selectedDepartment } = appContext;
  const [loading, setLoading] = useState(true);
  const pageName = props.location.pathname;
  const roleOfUser = localStorage.getItem("permission")
    ? JSON.parse(localStorage.getItem("permission"))
    : null;
  const [authAccessArr, setAuthAccessArr] = useState([]);

  useEffect(() => {
    let arr;
    if (pageName === "/dashboard/stock") {
      arr = roleOfUser
        ? roleOfUser["Tagging"]["Tagging List"]
          ? roleOfUser["Tagging"]["Tagging List"]
          : []
        : [];
    } else {
      arr = roleOfUser
        ? roleOfUser["Stock"]["Stock List"]
          ? roleOfUser["Stock"]["Stock List"]
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
      getStockData(
        `api/stock?is_location=${
          selectedDepartment.is_location
        }&department_id=${selectedDepartment.value.split("-")[1]}`
      );
      if (modalView === 3) {
        getDepartmentWiseStockDetails();
      } else if (modalView === 4) {
        getBarcodeInStock();
      } else if (modalView === 5) {
        getPackList();
      }
    }
  }, [selectedDepartment, modalView]);

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
    if (pageName === `/dashboard/stock`) {
      NavbarSetting("Tagging", dispatch);
    } else {
      NavbarSetting("Stock", dispatch);
    }
  }, []);

  const handleChangeTab = (event, value) => {
    setModalView(value);
  };

  function getStockData(url) {
    setLoading(true);
    axios
      .get(Config.getCommonUrl() + url)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          const tmpAllData = response.data.data;

          const allDataWithType = tmpAllData.map((item) => {
            return {
              ...item,
              type:
                item.stockType === "Barcode"
                  ? 1
                  : item.stockType === "Packet"
                  ? 2
                  : item.stockType === "Packing Slip"
                  ? 3
                  : item.stockType === "Lot"
                  ? 4
                  : null,
            };
          });

          // const Barcode = tmpAllDat

          let tempData = allDataWithType.map((item) => {
            return {
              ...item,
              fineGold:
                item.flag === 1 && item.item_id === 1
                  ? parseFloat(
                      (parseFloat(item.net_weight) * parseFloat(item.purity)) /
                        100
                    ).toFixed(3)
                  : "-",
              pcs: item.flag === 1 && item.item_id === 1 ? "-" : item.pcs,
            };
          });
          let allArr = [];
          let goldLooseArr = [];
          let otherLooseArr = [];
          let packingSlipArr = [];
          let packetArr = [];
          let productArr = [];
          let lotData = [];

          for (let item of tempData) {
            allArr.push(item);

            if (item.flag === 1) {
              goldLooseArr.push(item);
            } else if (item.flag === 2) {
              otherLooseArr.push(item);
            } else if (item.flag === 3) {
              lotData.push(item);
            } else if (item.flag === 4) {
              productArr.push(item);
            } else if (item.flag === 5) {
              packetArr.push(item);
            } else if (item.flag === 6) {
              packingSlipArr.push(item);
            }
          }

          setAllData(allArr);
          setGoldLooseList(goldLooseArr);
          setOtherLooseList(otherLooseArr);
          setPackingSlipData(packingSlipArr);
          setPacketData(packetArr);
          setProductData(productArr);
          setLotData(lotData);

          setLoading(false);

          let tmpDlData = allArr.map((item) => {
            return {
              "Stock Type": item.stockType,
              "Stock Code": item.stock_name_code,
              Category: item.hasOwnProperty("category_name")
                ? item.category_name
                : "",
              Purity: item.purity,
              Pieces: item.pcs,
              "Gross Weight": item.gross_weight,
              "Net Weight": item.net_weight,
              "Fine Gold": item.fineGold,
              "Other Weight": item.other_weight,
              Info: "",
              "Material Details": item.hasOwnProperty("material_detail")
                ? item.material_detail
                : "",
              "Previous Process": item.process,
              "Last Performed Voucher Num": item.voucher_no,
              Transit: item.transit === null ? "-" : item.transit,
            };
          });

          setDownloadData(tmpDlData);
        } else {
          setLoading(false);
          setAllData([]);
          setGoldLooseList([]);
          setOtherLooseList([]);
          setPackingSlipData([]);
          setPacketData([]);
          setProductData([]);
          setLotData([]);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
            })
          );
        }
      })
      .catch(function (error) {
        setLoading(false);
        setAllData([]);
        setGoldLooseList([]);
        setOtherLooseList([]);
        setPackingSlipData([]);
        setPacketData([]);
        setProductData([]);
        setLotData([]);

        handleError(error, dispatch, { api: url });
      });
  }
  function getDepartmentWiseStockDetails() {
    axios
      .get(
        Config.getCommonUrl() +
          `api/stock?is_location=${
            selectedDepartment.is_location
          }&department_id=${selectedDepartment.value.split("-")[1]}`
      )
      .then(function (response) {
        if (response.data.success === true) {
          const apiData = response.data.data;
          console.log(apiData);
          const dynamicKeys = Object.keys(apiData);
          console.log(dynamicKeys);
          const allData = [];
          dynamicKeys.map((key, value) => {
            const obj = apiData[key];
            if (obj.items) {
              obj.items.map((e, index) => {
                allData.push({
                  karat: key,
                  count: index == 0 ? apiData[key].items.length : null,
                  ...e,
                });
              });
            }
          });
          setApiData(response.data.total);
          setDepartmentWiseStock(allData);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/stock?is_location=${
            selectedDepartment.is_location
          }&department_id=${selectedDepartment.value.split("-")[1]}`,
        });
      });
  }

  function getBarcodeInStock() {
    axios
      .get(
        Config.getCommonUrl() +
          "api/stock/departmentwise/barcode/report?department_id=" +
          selectedDepartment.value.split("-")[1]
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          const apiData = response.data.data;
          const dynamicKeys = Object.keys(apiData);
          const allData = [];
          dynamicKeys.map((key, value) => {
            apiData[key].items.map((e, index) => {
              allData.push({
                karat: key,
                count: index == 0 ? apiData[key].items.length : null,
                ...e,
              });
            });
          });
          setBarcodeInStock(allData);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api:
            "api/stock/departmentwise/barcode/report?department_id=" +
            selectedDepartment.value.split("-")[1],
        });
      });
  }
  function getPackList() {
    axios
      .get(
        Config.getCommonUrl() +
          "api/stock/departmentwise/packet/report?department_id=" +
          selectedDepartment.value.split("-")[1]
      )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data);
          const apiData = response.data.data;
          const dynamicKeys = Object.keys(apiData);
          const allData = [];
          dynamicKeys.map((key, value) => {
            const billing_category_name = apiData[key].billing_category_name;
            const packet_no = apiData[key].packet_no;
            apiData[key].packetData.map((e, index) => {
              allData.push({
                karat: key,
                count: index == 0 ? apiData[key].packetData.length : null,
                billing_category_name: billing_category_name,
                packet_no: packet_no,
                ...e,
              });
            });
          });
          sePackectList(allData);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api:
            "api/stock/departmentwise/packet/report?department_id=" +
            selectedDepartment.value.split("-")[1],
        });
      });
  }

  const refreshApi = () => {
    setAllData([]);
    setGoldLooseList([]);
    setOtherLooseList([]);
    setPackingSlipData([]);
    setPacketData([]);
    setProductData([]);
    setLotData([]);
    getStockData(
      `api/stock?is_location=${selectedDepartment.is_location}&department_id=${
        selectedDepartment.value.split("-")[1]
      }`
    );
  };
  const dlData = (data) => {
    let tmpDlData = [];
    if (data.length > 0) {
      tmpDlData = data.map((item) => {
        return {
          "Stock Type": item.element.stockType,
          "Stock Code": item.element.stock_name_code,
          Category: item.element.hasOwnProperty("category_name")
            ? item.element.category_name
            : "",
          Purity: item.element.purity,
          Pieces: item.element.pcs,
          "Gross Weight": item.element.gross_weight,
          "Net Weight": item.element.net_weight,
          "Fine Gold": item.element.fineGold,
          "Other Weight": item.element.other_weight,
          Info: "",
          "Material Details": item.element.hasOwnProperty("material_detail")
            ? item.element.material_detail
            : "",
          "Previous Process": item.element.process,
          "Last Performed Voucher Num": item.element.voucher_no,
          Transit: item.element.transit,
        };
      });
      setDownloadData(tmpDlData);
    } else {
      tmpDlData = allData.map((item) => {
        return {
          "Stock Type": item.stockType,
          "Stock Code": item.stock_name_code,
          Category: item.hasOwnProperty("category_name")
            ? item.category_name
            : "",
          Purity: item.purity,
          Pieces: item.pcs,
          "Gross Weight": item.gross_weight,
          "Net Weight": item.net_weight,
          "Fine Gold": item.fineGold,
          "Other Weight": item.other_weight,
          Info: "",
          "Material Details": item.hasOwnProperty("material_detail")
            ? item.material_detail
            : "",
          "Previous Process": item.process,
          "Last Performed Voucher Num": item.voucher_no,
          Transit: "",
        };
      });
      setDownloadData(tmpDlData);
    }
  };

  const exportToExcel = (type, fn, dl) => {
    if (modalView === 3 && departmentWiseStock.length > 0) {
      const wb = XLSX.utils.book_new();
      const tbl1 = document.getElementById("tbl_exporttable_to_xls3");
      const ws1 = XLSX.utils.table_to_sheet(tbl1);
      XLSX.utils.book_append_sheet(wb, ws1, "Table 1");
      return dl
        ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
        : XLSX.writeFile(
            wb,
            fn || `Department Wise Lot Stock Report.${type || "xlsx"}`
          );
    } else if (modalView === 4 && barcodeInStock.length > 0) {
      const wb = XLSX.utils.book_new();

      const tbl1 = document.getElementById("tbl_exporttable_to_xls4");
      const ws1 = XLSX.utils.table_to_sheet(tbl1);
      XLSX.utils.book_append_sheet(wb, ws1, "Table 1");
      return dl
        ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
        : XLSX.writeFile(
            wb,
            fn || `Department Wise Barcode Stock Report.${type || "xlsx"}`
          );
    } else if (modalView === 5 && packectList.length > 0) {
      const wb = XLSX.utils.book_new();

      const tbl1 = document.getElementById("tbl_exporttable_to_xls5");
      const ws1 = XLSX.utils.table_to_sheet(tbl1);
      XLSX.utils.book_append_sheet(wb, ws1, "Table 1");
      return dl
        ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
        : XLSX.writeFile(
            wb,
            fn || `Department Wise Packet stock Report.${type || "xlsx"}`
          );
    } else if (modalView === 6 && packingList !== 0) {
      const wb = XLSX.utils.book_new();

      const tbl1 = document.getElementById("tbl_exporttable_to_xls6");
      const ws1 = XLSX.utils.table_to_sheet(tbl1);
      XLSX.utils.book_append_sheet(wb, ws1, "Table 1");
      return dl
        ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
        : XLSX.writeFile(
            wb,
            fn || `Department_Wise_Stock_Report6.${type || "xlsx"}`
          );
    } else {
      dispatch(Actions.showMessage({ message: "Can not Export Empty Data" }));
    }
  };

  const calculateTotalGrossWeight = (purity) => {
    let total = 0;
    departmentWiseStock.forEach((element) => {
      if (element.purity === purity) {
        total += element.gross_weight;
      }
    });
    return total;
  };

  const calculateTotalNetWeight = (purity) => {
    let total = 0;
    departmentWiseStock.forEach((element) => {
      if (element.purity === purity) {
        total += element.net_weight;
      }
    });
    return total;
  };

  const calculateTotalOtherWeight = (purity) => {
    let total = 0;
    departmentWiseStock.forEach((element) => {
      if (element.purity === purity) {
        total += element.other_weight;
      }
    });
    return total;
  };
  const calculateTotalPcs = (purity) => {
    let total = 0;
    departmentWiseStock.forEach((element) => {
      if (element.purity === purity) {
        total += element.pcs;
      }
    });
    return total;
  };
  const calculateTotalGrossWeightB = (purity) => {
    let total = 0;
    barcodeInStock.forEach((element) => {
      if (element.purity === purity) {
        total += element.gross_weight;
      }
    });
    return total;
  };
  const calculateTotalNetWeightB = (purity) => {
    let total = 0;
    barcodeInStock.forEach((element) => {
      if (element.purity === purity) {
        total += element.net_weight;
      }
    });
    return total;
  };
  const calculateTotalOtherWeightB = (purity) => {
    let total = 0;
    barcodeInStock.forEach((element) => {
      if (element.purity === purity) {
        total += element.other_weight;
      }
    });
    return total;
  };
  const calculateTotalPcsB = (purity) => {
    let total = 0;
    barcodeInStock.forEach((element) => {
      if (element.purity === purity) {
        total += element.pcs;
      }
    });
    return total;
  };
  const calculateStnoePaceB = (purity) => {
    let total = 0;
    barcodeInStock.forEach((element) => {
      if (element.purity === purity) {
        total += element.stone_pcs;
      }
    });
    return total;
  };
  const calculatePcs = (karat) => {
    let total = 0;
    packectList.map((element) => {
      if (element.karat == karat) {
        total += element.LotDetails.phy_pcs;
      }
    });
    return total;
  };

  const calculategross_wgt = (karat) => {
    let total = 0;
    packectList.map((element) => {
      if (element.karat === karat) {
        total += parseFloat(element.LotDetails.gross_wgt);
      }
    });
    return total;
  };

  const calculatenet_wgt = (karat) => {
    let total = 0;
    packectList.map((element) => {
      if (element.karat === karat) {
        total += parseFloat(element.LotDetails.net_wgt);
      }
    });
    return total;
  };

  const calculatestone_other_weight = (karat) => {
    let total = 0;
    packectList.map((element) => {
      if (element.karat === karat) {
        total += parseFloat(element.LotDetails.stone_other_weight);
      }
    });
    return total;
  };

  // const totalPcsPL = packectList.reduce((total, item) => {
  //   const stoneOtherWeight = parseFloat(item.LotDetails.phy_pcs);
  //   return total + stoneOtherWeight;
  // }, 0);
  // const totalGrossWeightPL = packectList.reduce((total, item) => {
  //   const stoneOtherWeight = parseFloat(item.LotDetails.gross_wgt);
  //   return total + stoneOtherWeight;
  // }, 0);
  // const totalNetWeightPL = packectList.reduce((total, item) => {
  //   const stoneOtherWeight = parseFloat(item.LotDetails.net_wgt);
  //   return total + stoneOtherWeight;
  // }, 0);
  // const totalStoneOtherWeightPL = packectList.reduce((total, item) => {
  //   const stoneOtherWeight = parseFloat(item.LotDetails.stone_other_weight);
  //   return total + stoneOtherWeight;
  // }, 0);


  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container table-width-mt">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1">
            <Grid
              container
              alignItems="center"
              style={{ marginBottom: 20, marginTop: 30, paddingInline: 30 }}
            >
              <Grid item xs={4} sm={4} md={4} lg={5} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    {pageName === `/dashboard/stock`
                      ? "Tagging List"
                      : "Stock List"}
                  </Typography>
                </FuseAnimate>
              </Grid>

              {/* {authAccessArr.includes("Export Stock") && ( */}
                <Grid item xs={8} sm={8} md={8} lg={7} key="2">
                  <Button
                    className="csvbutton"
                    disabled={downloadData.length === 0}
                  >
                    <CSVLink
                    className="csvbuttontext"
                      data={downloadData}
                      filename={
                        (pageName === `/dashboard/stock`
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
                      {/* <Icon
                      style={{
                        color:
                          downloadData.length === 0 ? "gray" : "dodgerblue",
                      }}
                    >
                      get_app
                    </Icon> */}
                      Download
                    </CSVLink>
                  </Button>
                  {props.location.pathname !== "/dashboard/stock/:stock" ||
                    modalView === 0 ||
                    modalView === 1 ||
                    modalView === 2 ||
                    modalView === 6 || (
                      <Grid
                        item
                        style={{ color: "red" }}
                      >
                        <Button
                        className="float-right mr-3"
                           id="btn-save"
                          variant="contained"
                          color="primary"
                          aria-label="Register"
                          onClick={(event) => {
                            exportToExcel("xlsx");
                          }}
                        >
                          Export Report
                        </Button>
                      </Grid>
                    )}
                </Grid>
              {/* )} */}
            </Grid>
            {loading && <Loader />}
            <div className="main-div-alll">
              <div className={classes.root}>
                <Tabs
                  value={modalView}
                  onChange={handleChangeTab}
                  style={{ paddingBottom: 20 }}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  <Tab className={classes.tab} label="All List" />
                  <Tab className={classes.tab} label="Loose Metal" />
                  <Tab className={classes.tab} label="Other Material" />
                  <Tab className={classes.tab} label="Lot List" />
                  <Tab className={classes.tab} label="Barcode List" />
                  <Tab className={classes.tab} label="Packet List" />
                  <Tab className={classes.tab} label="Packing Slip List" />
                </Tabs>
                {modalView === 0 && (
                  <AllStockView
                    authAccessArr={authAccessArr}
                    props={props}
                    allData={allData}
                    refreshApi={refreshApi}
                    dlData={dlData}
                    pgName={pageName}
                    flag={true}
                  />
                )}
                {modalView === 1 && (
                  <AllStockView
                    authAccessArr={authAccessArr}
                    props={props}
                    allData={goldLooseList}
                    refreshApi={refreshApi}
                    dlData={dlData}
                    pgName={pageName}
                    flag={true}
                  />
                )}
                {modalView === 2 && (
                  <AllStockView
                    authAccessArr={authAccessArr}
                    props={props}
                    allData={otherLooseList}
                    refreshApi={refreshApi}
                    dlData={dlData}
                    pgName={pageName}
                    flag={true}
                  />
                )}
                {modalView === 3 && (
                  <AllStockView
                    authAccessArr={authAccessArr}
                    props={props}
                    allData={lotData}
                    refreshApi={refreshApi}
                    dlData={dlData}
                    pgName={pageName}
                    flag={true}
                  />
                )}
                {modalView === 4 && (
                  <AllStockView
                    authAccessArr={authAccessArr}
                    props={props}
                    allData={productData}
                    refreshApi={refreshApi}
                    dlData={dlData}
                    pgName={pageName}
                    flag={true}
                  />
                )}
                {modalView === 5 && (
                  <AllStockView
                    authAccessArr={authAccessArr}
                    props={props}
                    allData={packetData}
                    refreshApi={refreshApi}
                    dlData={dlData}
                    pgName={pageName}
                    flag={true}
                  />
                )}
                {modalView === 6 && (
                  <AllStockView
                    authAccessArr={authAccessArr}
                    props={props}
                    allData={packingSLipData}
                    refreshApi={refreshApi}
                    dlData={dlData}
                    pgName={pageName}
                    flag={true}
                  />
                )}

              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
      {props.location.pathname == "/dashboard/stock/:stock" ? (
        <div className="hidden">
          {modalView === 3 && (
            <div className="ml-16 mr-16 mb-60 ">
              <Table aria-label="simple table" id="tbl_exporttable_to_xls3">
                <TableHead>
                  <TableRow>
                    <TableCell
                      className={classes.tableRowPad}
                      align="center"
                      colSpan={10}
                    >
                      Depatment Wise Lot Stock Details
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.tableRowPad} align="left">
                      Karat Code
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Lot No
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Lot Category
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Source Wcgroup
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Dest Wcgroup
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Pieces
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Gross Weight
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      NET WT
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Stone Weight
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Other Weight
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {departmentWiseStock.map((element, index) => (
                    <>
                      <TableRow key={index}>
                        {element.count && (
                          <TableCell
                            rowSpan={element.count}
                            className={classes.tableRowPad}
                          >
                            {element.karat}
                          </TableCell>
                        )}
                        <TableCell className={classes.tableRowPad}>
                          {element.stock_name_code}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {element.category_name}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {element?.to_department}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {element.from_department}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {element.pcs}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {element.gross_weight}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {element.net_weight}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {element.other_weight}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {element.other_weight}
                        </TableCell>
                      </TableRow>
                      {(index === departmentWiseStock.length - 1 ||
                        element.karat !==
                          departmentWiseStock[index + 1].karat) && (
                        <TableRow key={departmentWiseStock[index + 1]}>
                          <TableCell
                            colSpan={2}
                            align="left"
                            className={classes.tableRowPad}
                          >
                            <b>Total:</b>
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                          ></TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                          ></TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                          ></TableCell>
                          <TableCell>
                            <b> {calculateTotalPcs(element.purity)}</b>
                          </TableCell>
                          <TableCell>
                            <b>
                              {calculateTotalGrossWeight(
                                element.purity
                              ).toFixed(3)}
                            </b>
                          </TableCell>
                          <TableCell>
                            <b>
                              {" "}
                              {calculateTotalNetWeight(element.purity).toFixed(
                                2
                              )}
                            </b>
                          </TableCell>
                          <TableCell>
                            <b>
                              {" "}
                              {calculateTotalOtherWeight(
                                element.purity
                              ).toFixed(3)}
                            </b>
                          </TableCell>
                          <TableCell>
                            <b>
                              {" "}
                              {calculateTotalOtherWeight(
                                element.purity
                              ).toFixed(3)}
                            </b>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}

                  <TableRow>
                    <TableCell
                      colSpan={2}
                      align="left"
                      className={classes.tableRowPad}
                    >
                      <b>Grand Total:</b>
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>{}</TableCell>
                    <TableCell className={classes.tableRowPad}>{}</TableCell>
                    <TableCell className={classes.tableRowPad}>{}</TableCell>
                    <TableCell className={classes.tableRowPad}>
                      <b>{apiData?.grand_total_pcs}</b>
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      <b>
                        {" "}
                        {Number(apiData?.grand_total_gross_wgt).toFixed(3)}
                      </b>
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      <b>{Number(apiData?.grand_total_net_wgt).toFixed(3)}</b>
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      <b> {Number(apiData?.grand_other_weight).toFixed(3)}</b>
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>{}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}

          {modalView === 4 && (
            <div className="ml-16 mr-16 mb-60 ">
              <Table aria-label="simple table" id="tbl_exporttable_to_xls4">
                <TableHead>
                  <TableRow>
                    <TableCell
                      className={classes.tableRowPad}
                      align="center"
                      colSpan={8}
                    >
                      Only Barcode In Stock
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.tableRowPad} align="left">
                      Karat Code
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Stock Code
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Variant Name
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Pieces
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Gross Weight
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      NET WT
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Stn & OthPcs
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Stn & OthWt
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {barcodeInStock.map((element, index) => (
                    <>
                      <TableRow key={index}>
                        {element.count && (
                          <TableCell
                            rowSpan={element.count}
                            className={classes.tableRowPad}
                          >
                            {element.karat}
                          </TableCell>
                        )}
                        <TableCell className={classes.tableRowPad}>
                          {element.stock_name_code}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {element.variant_name}
                        </TableCell>{" "}
                        <TableCell className={classes.tableRowPad}>
                          {element.pcs}
                        </TableCell>{" "}
                        <TableCell className={classes.tableRowPad}>
                          {element.gross_weight}
                        </TableCell>{" "}
                        <TableCell className={classes.tableRowPad}>
                          {element.net_weight}
                        </TableCell>{" "}
                        <TableCell className={classes.tableRowPad}>
                          {element.stone_pcs}
                        </TableCell>
                        <TableCell className={classes.tableRowPad}>
                          {element.other_weight}
                        </TableCell>
                      </TableRow>
                      {(index === barcodeInStock.length - 1 ||
                        element.karat !== barcodeInStock[index + 1].karat) && (
                        <TableRow key={barcodeInStock[index + 1]}>
                          <TableCell
                            colSpan={2}
                            align="left"
                            className={classes.tableRowPad}
                          >
                            <b>Total:</b>
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                          ></TableCell>
                          <TableCell>
                            <b> {calculateTotalPcsB(element.purity)}</b>
                          </TableCell>
                          <TableCell>
                            <b>
                              {calculateTotalGrossWeightB(
                                element.purity
                              ).toFixed(3)}
                            </b>
                          </TableCell>
                          <TableCell>
                            <b>
                              {" "}
                              {calculateTotalNetWeightB(element.purity).toFixed(
                                3
                              )}
                            </b>
                          </TableCell>
                          <TableCell>
                            <b>
                              {" "}
                              {calculateTotalOtherWeightB(
                                element.purity
                              ).toFixed(3)}
                            </b>
                          </TableCell>
                          <TableCell>
                            <b>
                              {" "}
                              {calculateStnoePaceB(element.purity).toFixed(3)}
                            </b>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {modalView === 5 && (
            <div className="ml-16 mr-16 mb-60 ">
              <Table aria-label="simple table" id="tbl_exporttable_to_xls5">
                <TableHead>
                  <TableRow>
                    <TableCell
                      className={classes.tableRowPad}
                      align="center"
                      colSpan={10}
                    >
                      Packet Wise Stock
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className={classes.tableRowPad} align="left">
                      Packet No
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Packet Category
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Stock Code
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Variant Name
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Karat Code{" "}
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Huid
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Pieces
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Gross Wt
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Net Wt
                    </TableCell>
                    <TableCell className={classes.tableRowPad} align="left">
                      Stn & OthWt
                    </TableCell>
                  </TableRow>
                </TableHead>
                {packectList.map((element, index) => (
                  <>
                    <TableRow key={index}>
                      {element.count && (
                        <TableCell
                          rowSpan={element.count}
                          className={classes.tableRowPad}
                        >
                          {element.packet_no}
                        </TableCell>
                      )}
                      {element.count && (
                        <TableCell
                          rowSpan={element.count}
                          className={classes.tableRowPad}
                        >
                          {element.billing_category_name}
                        </TableCell>
                      )}

                      <TableCell className={classes.tableRowPad}>
                        {element?.LotDetails?.BarCodeProduct?.barcode}
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        {element?.LotDetails?.DesignInfo?.variant_number}
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        {element?.LotDetails?.purity}
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        {element.LotDetails?.huid_json}
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        {element?.LotDetails?.phy_pcs}
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        {element?.LotDetails?.gross_wgt}
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        {element?.LotDetails?.net_wgt}
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        {element?.LotDetails?.stone_other_weight}
                      </TableCell>
                    </TableRow>
                    {(index === packectList.length - 1 ||
                      element.karat !== packectList[index + 1].karat) && (
                      <TableRow key={packectList[index + 1]}>
                        <TableCell
                          colSpan={2}
                          align="left"
                          className={classes.tableRowPad}
                        >
                          <b>Total:</b>
                        </TableCell>
                        <TableCell className={classes.tableRowPad}></TableCell>
                        <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                        <TableCell>
                          <b> {calculatePcs(element.karat)}</b>
                        </TableCell>
                        <TableCell>
                          <b> {calculategross_wgt(element.karat)}</b>
                        </TableCell>
                        <TableCell>
                        <b> {calculatenet_wgt(element.karat)}</b>
                        </TableCell>
                        <TableCell>
                          <b> {calculatestone_other_weight(element.karat)}</b>

                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </Table>
            </div>
          )}
          {modalView === 6 && (
            <div className="ml-16 mr-16 mb-60  ">
              <Table aria-label="simple table" id="tbl_exporttable_to_xls6">
                <TableHead>
                  <TableRow>
                    <TableCell
                      className={classes.tableRowPad}
                      align="center"
                      colSpan={10}
                    >
                      Packing Wise Stock
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      className={classes.tableRowPad}
                      align="left"
                    ></TableCell>
                    <TableCell
                      className={classes.tableRowPad}
                      align="left"
                    ></TableCell>
                    <TableCell
                      className={classes.tableRowPad}
                      align="left"
                    ></TableCell>
                    <TableCell
                      className={classes.tableRowPad}
                      align="left"
                    ></TableCell>
                    <TableCell
                      className={classes.tableRowPad}
                      align="left"
                    ></TableCell>
                    <TableCell
                      className={classes.tableRowPad}
                      align="left"
                    ></TableCell>
                    <TableCell
                      className={classes.tableRowPad}
                      align="left"
                    ></TableCell>
                    <TableCell
                      className={classes.tableRowPad}
                      align="left"
                    ></TableCell>
                    <TableCell
                      className={classes.tableRowPad}
                      align="left"
                    ></TableCell>
                    <TableCell
                      className={classes.tableRowPad}
                      align="left"
                    ></TableCell>
                  </TableRow>
                </TableHead>
              </Table>
            </div>
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Stock;
