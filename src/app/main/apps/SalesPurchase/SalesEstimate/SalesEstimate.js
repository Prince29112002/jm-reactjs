import React, { useState, useEffect, useRef } from "react";
import { Typography, TextField, Modal, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Icon, IconButton } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Select, { createFilter } from "react-select";
import History from "@history";
import Button from "@material-ui/core/Button";
import CategoryWiseList from "./Components/CategoryWiseList";
import TagWiseList from "./Components/TagWiseList";
import PackingSlipWiseList from "./Components/PackingSlipWiseList";
import PacketWiseList from "./Components/PacketWiseList";
import BillOfMaterial from "./Components/BillOfMaterial";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Loader from "app/main/Loader/Loader";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import moment from "moment";
import { useDispatch } from "react-redux";
import Autocomplete from "@material-ui/lab/Autocomplete";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import { useReactToPrint } from "react-to-print";
import { SalesEstimstePrintCom } from "./PrintComponent/SalesEstimatePrintCom";
import { SalesEstimateSubPrint } from "./PrintComponent/SalesEstimateSubPrint";
import { SalesEstimateSub2Print } from "./PrintComponent/SalesEstimateSub2Print";
import { CSVLink } from "react-csv";
import * as XLSX from 'xlsx';
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
    backgroundColor: "gray",
    color: "white",
  },
  table: {
    minWidth: 650,
  },
  group: {
    // margin: theme.spacing(1, 0),

    flexDirection: "row",
  },
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


const SalesEstimate = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  // const [modalStyle] = React.useState(getModalStyle);
  const [modalView, setModalView] = useState(0);
  const [fileType, setFileType] = useState("0")
  const [format, setFormat] = useState("0")
  // const [open, setOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);
  const [loading, setLoading] = useState(false);
  const [buttonClick, setButtonClick] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [clientdata, setClientdata] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectClientErr, setSelectClientErr] = useState("");

  const [clientCompanies, setClientCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCompErr, setSelectedCompErr] = useState("");

  const [packingSlipNo, setPackingSlipNo] = useState("");
  const [packingSlipErr, setPackingSlipErr] = useState("");

  const [packingSearch, setPackingSearch] = useState("");
  const [lotArr, setlotArr] = useState([]);

  const [packingSlipApiData, setPackingSlipApiData] = useState([]);

  const [fineGoldTotal, setFineGoldTotal] = useState("");

  const [stateId, setStateId] = useState("");

  const [totalGrossWeight, setTotalGrossWeight] = useState("");
  // const [totalNetWeight, setTotalNetWeight] = useState("");
  // const [amount, setAmount] = useState("");
  const [csvData, setCsvData] = useState("");
  const [packingSlipData, setPackingSlipData] = useState([]); //packing slip wise
  const [packetData, setPacketData] = useState([]); //packet wise Data
  const [productData, setProductData] = useState([]); //category wise Data
  const [billMaterialData, setBillmaterialData] = useState([]); //bill of material Data
  const [tagWiseData, setTagWiseData] = useState([]); //tag wise Data

  const [fineRate, setFineRate] = useState("");
  const [fineRateErr, setFineRateErr] = useState("");
  const [stoneWt, setStoneWt] = useState("");
  const [dataForExcel, setdataForExcel] = useState("")

  const [printObj, setPrintObj] = useState({
      stateId: "",
      supplierName: "",
      supAddress: "",
      supplierGstUinNum: "",
      supPanNum: "",
      supState: "",
      supCountry: "",
      supStateCode: "",
      voucherDate: moment().format("DD-MM-YYYY"),
      placeOfSupply: "",
      orderDetails: [],
      orderDetail: [],
      sumofpurity: [],
      taxableAmount: "",
      sGstTot: "",
      cGstTot: "",
      iGstTot: "",
      roundOff: "",
      grossWtTOt: "",
      netWtTOt: "",
      totalInvoiceAmt: "",
      SelectedClient: "",
      stone_wgt: "",
      pcsTot: "",
      FineTot: "",
      hmTotal: "",
      StoneWt: "",
      amountTot: "",
      PacketTotal: "",
      beadsWgtTot: "",
      finalgrossWgtTot: "",
      sumnoOfPacketTot: "",
      sumbeadsWgtTot: "",
      sumstoneWgtTot: "",
  });

  const handleClick = (event) => {
      // if (selectedLoad === "1") {
      //check if selectedLoad is 1 then check bom selected
  };

  useEffect(() => {
      const timeout = setTimeout(() => {
          if (packingSearch) {
              getPackingSlipData(packingSearch);
          } else {
              setPackingSlipApiData([]);
          }
      }, 800);
      return () => {
          clearTimeout(timeout);
      };
      //eslint-disable-next-line
  }, [packingSearch]);

  useEffect(() => {
    if (props.reportView === "Report") {
      NavbarSetting("Factory Report", dispatch);
    } else if (props.reportView === "Account") {
      NavbarSetting("Accounts", dispatch);
    } else {
      NavbarSetting("Sales", dispatch);
    }
  }, []);

  // wastagePer will be entered manualy in sales and sales return, confirmed with hirenbhai on 25/04/22

  const dispatch = useDispatch();

  const handleChangeTab = (event, value) => {
      setModalView(value);
  };

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
      if (loading) {
          setTimeout(() => setLoading(false), 7000);
      }
  }, [loading]);

  const loadTypeRef = useRef(null)

  useEffect(() => {
      getClientData();
      //eslint-disable-next-line
  }, []);

  const componentRef = React.useRef(null);

  const onBeforeGetContentResolve = React.useRef(null);

  const handleAfterPrint = () => { //React.useCallback
      console.log("`onAfterPrint` called"); // tslint:disable-line no-console
      //resetting after print 
      // checkAndReset()

  };

  const handleBeforePrint = React.useCallback(() => {
      console.log("`onBeforePrint` called"); // tslint:disable-line no-console
  }, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
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
  }, []);//setText

  const reactToPrintContent = React.useCallback(() => {
      return componentRef.current;
      //eslint-disable-next-line
  }, [componentRef.current]);

  function getDateAndTime() {
      return new Date().getDate() + "_" + (new Date().getMonth() + 1) + "_" + new Date().getFullYear() + "_" + new Date().getHours() + ":" + new Date().getMinutes()
  }

  const handlePrint = useReactToPrint({
      content: reactToPrintContent,
      documentTitle: "Sales_Estimate_" + getDateAndTime(),
      onBeforeGetContent: handleOnBeforeGetContent,
      onBeforePrint: handleBeforePrint,
      onAfterPrint: handleAfterPrint,
      // removeAfterPrint: true
  });

  function checkAndReset() {
      History.goBack()
  }

  function getClientData() {
      axios
          .get(Config.getCommonUrl() + "api/client/listing/listing")
          .then(function (response) {
              if (response.data.success === true) {
                  console.log(response);
                  setClientdata(response.data.data);
              }
          })
          .catch(function (error) {
              handleError(error, dispatch, { api: "api/client/listing/listing" })
          });
  }

  function checkforDownload() {
      if (
          partyNameValidation() &&
          clientCompValidation() &&
          FineRateValidaion()
      ) {
          setModalOpen(true)

      } else {
          console.log("else");
      }
  }

  function checkforPrint(num) {
      // handlePrint()
      // ev.preventDefault();
      // resetForm();
      // console.log("handleFormSubmit", formValues);
      if (
          partyNameValidation() &&
          clientCompValidation() &&
          FineRateValidaion()
      ) {
          setButtonClick(num)
          console.log("if");
          handlePrint()
      } else {
          console.log("else");
      }
  }

  function reset() {
      setPackingSlipErr("");
      setStateId("");
      setTotalGrossWeight("");
      setFineGoldTotal("");
  }

  function handlePartyChange(value) {
      setSelectedClient(value);
      setSelectClientErr("");
      setSelectedCompany("");
      setSelectedCompErr("");
      setPackingSlipData([]); //packing slip wise
      setPacketData([]); //packet wise Data
      setProductData([]); //category wise Data
      setBillmaterialData([]); //bill of material Data
      setTagWiseData([]);
      reset();
  setlotArr([]);

      setPrintObj({
          ...printObj,
          SelectedClient: value
      })
      let findIndex = clientdata.findIndex((item) => item.id === value.value);
      if (findIndex > -1) {
          getClientCompanies(value.value, function (response) {
              console.log(response);
              if (response !== null) {
                  setClientCompanies(response);
              } else {
                  setClientCompanies([]);
              }
          });
      }
  }

  function getClientCompanies(clientId, callback) {
      axios
          .get(Config.getCommonUrl() + `api/client/company/listing/listing/${clientId}`)
          .then(function (response) {
              if (response.data.success === true) {
                  console.log(response.data.data);
                  var compData = response.data.data;
                  callback(compData);
              } else {
                  callback(null);
                  dispatch(Actions.showMessage({ message: response.data.message }));
              }
          })
          .catch((error) => {
              callback(null);
              handleError(error, dispatch, { api: `api/client/company/listing/listing/${clientId}` })
          });
  }

  function handleCompanyChange(value) {
      setSelectedCompany(value);
      setSelectedCompErr("");
      setPackingSlipData([]); //packing slip wise
      setPacketData([]); //packet wise Data
      setProductData([]); //category wise Data
      setBillmaterialData([]); //bill of material Data
      setTagWiseData([]);
      setPackingSlipNo("");
      // getVouchers(selectedClient.value, value.value);

      let findIndex = clientCompanies.findIndex(
          (item) => item.id === value.value
      );
      console.log(clientCompanies[findIndex], findIndex);
      if (findIndex > -1) {
          setStateId(clientCompanies[findIndex].state); //setting from selected company

          setPrintObj({
              ...printObj,
              is_tds_tcs: clientCompanies[findIndex].is_tds_tcs,
              stateId: clientCompanies[findIndex].state,
              supplierName: clientCompanies[findIndex].company_name,
              supAddress: clientCompanies[findIndex].address,
              supplierGstUinNum: clientCompanies[findIndex].gst_number,
              supPanNum: clientCompanies[findIndex].pan_number,
              supState: clientCompanies[findIndex].StateName.name,
              supCountry: clientCompanies[findIndex].CountryName.name,
              supStateCode: (clientCompanies[findIndex].gst_number) ? clientCompanies[findIndex].gst_number.substring(0, 2) : '',
              voucherDate: moment().format("DD-MM-YYYY"),
              placeOfSupply: clientCompanies[findIndex].StateName.name,
              orderDetails: [],
              taxableAmount: "",
              sGstTot: "",
              cGstTot: "",
              iGstTot: "",
              roundOff: "",
              grossWtTOt: "",
              netWtTOt: "",
              totalInvoiceAmt: "",
          })
      }
  }

  function partyNameValidation() {
      if (selectedClient === "") {
          setSelectClientErr("Please Select party");
          return false;
      }
      return true;
  }

  function clientCompValidation() {
      if (selectedCompany === "") {
          setSelectedCompErr("Please Select Firm");
          return false;
      }
      return true;
  }

  let handlePackingSlipSelect = (packingSlipNum) => {
      console.log("handlePackingSlipSelect", packingSlipNum);

      let filteredArray = packingSlipApiData.filter(
          (item) => item.barcode === packingSlipNum
      );

      console.log(filteredArray);
      if (filteredArray.length > 0) {
          setPackingSlipApiData(filteredArray);
          // setSelectedVoucher(filteredArray[0].id);
          // setJobWorkerGst(filteredArray[0].JobWorker.hsn_master.gst);
          // setJobWorkerHSN(filteredArray[0].JobWorker.hsn_master.hsn_number);
          setPackingSlipErr("");
          setPackingSlipNo(packingSlipNum);
          if (!lotArr.includes(filteredArray[0].PackingSlip.id)) {
              setlotArr([...lotArr, filteredArray[0].PackingSlip.id]);
              getPackingSlipDetails(filteredArray[0].PackingSlip.id);
            }
          // getPackingSlipDetails(filteredArray[0].PackingSlip.id);
      } else {
          // setSelectedVoucher("");
          setPackingSlipNo("");
          setPackingSlipErr("Please Select Proper Voucher");
      }
  };

  function getPackingSlipDetails(packingSlipNum) {
      axios
          .get(
              Config.getCommonUrl() + `api/packingslip/packingSlip/${packingSlipNum}`
          )
          .then(function (response) {
              if (response.data.success === true) {
                  console.log(response.data.data);
                  let tempPackingSlip = response.data.data.PackingSlip;
                  let tempPacketData = response.data.data.packetData;
                  let tempProductData = response.data.data.productData;
                  let temCategoryData = response.data.data.categoryData;
                  let wastFine = parseFloat(
                      (parseFloat(tempPackingSlip.net_wgt) *
                          parseFloat(tempPackingSlip.wastage)) /
                      100
                  ).toFixed(3);

                  let wastFineAmt = parseFloat(
                      (parseFloat(wastFine) * parseFloat(fineRate)) / 10
                  ).toFixed(3);

                  let tolAmt = parseFloat(
                      parseFloat(wastFineAmt) + parseFloat(tempPackingSlip.other_amt)
                  ).toFixed(3);

                  let labourRate = parseFloat(
                      parseFloat(tolAmt) / parseFloat(tempPackingSlip.net_wgt)
                  ).toFixed(3);


                  let newTemp = {
                      ...tempPackingSlip,
                      hallmark_charges_pcs: parseFloat(
                          parseFloat(tempPackingSlip.hallmark_charges) *
                          parseFloat(tempPackingSlip.phy_pcs)
                      ).toFixed(3),
                      NoOfPacket: tempPacketData.length,
                      billingCategory: tempProductData[0].billing_category_name,
                      wastageFine: wastFine,
                      totalFine: parseFloat(
                          (parseFloat(tempPackingSlip.net_wgt) *
                              parseFloat(tempPackingSlip.purity)) /
                          100 +
                          (parseFloat(tempPackingSlip.net_wgt) *
                              parseFloat(tempPackingSlip.wastage)) /
                          100
                      ).toFixed(3),
                      fineRate: fineRate,
                      amount: parseFloat(
                          (parseFloat(fineRate) * parseFloat(
                              (parseFloat(tempPackingSlip.net_wgt) * parseFloat(tempPackingSlip.purity)) / 100 +
                              (parseFloat(tempPackingSlip.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
                          )) / 10 +
                          parseFloat(tempPackingSlip.other_amt)
                      ).toFixed(3),
                      totalAmount: tolAmt,
                  };

                  setPackingSlipData([...packingSlipData, newTemp]); //packing slip wise
                  // console.log(newTemp);

                  const newTempPacketData = tempPacketData.map((item) => {
                      let wastFine = parseFloat(
                          (parseFloat(item.net_wgt) * parseFloat(newTemp.wastage)) / 100
                      ).toFixed(3);

                      let wastFineAmt = parseFloat(
                          (parseFloat(wastFine) * parseFloat(fineRate)) / 10
                      ).toFixed(3);

                      let tolAmt = parseFloat(
                          parseFloat(wastFineAmt) + parseFloat(item.other_amt)
                      ).toFixed(3);

                      let labourRate = parseFloat(
                          parseFloat(tolAmt) / parseFloat(item.net_wgt)
                      ).toFixed(3);

                      return {
                          ...item,
                          billingCategory: tempProductData[0].billing_category_name,
                          wastage: tempPackingSlip.wastage,
                          wastageFine: wastFine,
                          totalFine: parseFloat(
                              (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
                              (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
                          ).toFixed(3),
                          fineRate: fineRate,
                          amount: parseFloat(
                              (parseFloat(fineRate) * parseFloat(
                                  (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
                                  (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
                              )) / 10 +
                              parseFloat(item.other_amt)
                          ).toFixed(3),
                          hallmark_charges: parseFloat(tempPackingSlip.hallmark_charges).toFixed(3),
                          totalAmount: tolAmt,
                          catRate: parseFloat(
                              (((parseFloat(fineRate) * parseFloat(item.totalFine)) / 10 +
                                  parseFloat(item.other_amt)) /
                                  parseFloat(item.net_wgt)) *
                              10
                          ).toFixed(3),

                      };
                  });

                  setPacketData((packetData) => [...packetData, ...newTempPacketData]);

                  const newTempProductData = temCategoryData.map((item) => {
                      let wastFine = parseFloat(
                          (parseFloat(item.net_wgt) * parseFloat(newTemp.wastage)) / 100
                      ).toFixed(3);

                      let wastFineAmt = parseFloat(
                          (parseFloat(wastFine) * parseFloat(fineRate)) / 10
                      ).toFixed(3);

                      let tolAmt = parseFloat(
                          parseFloat(wastFineAmt) + parseFloat(item.other_amt)
                      ).toFixed(3);

                      let labourRate = parseFloat(
                          parseFloat(tolAmt) / parseFloat(item.net_wgt)
                      ).toFixed(3);

                      let cgstPer =
                          stateId === 12
                              ? parseFloat(parseFloat(tempPacketData[0].gst) / 2).toFixed(3)
                              : "";

                      let sGstPer =
                          stateId === 12
                              ? parseFloat(parseFloat(tempPacketData[0].gst) / 2).toFixed(3)
                              : "";

                      let IGSTper =
                          stateId !== 12 ? parseFloat(tempPacketData[0].gst).toFixed(3) : "";
                      let totalFine = parseFloat(
                          (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
                          (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
                      ).toFixed(3)

                      return {
                          ...item,
                          wastage: tempPackingSlip.wastage,
                          wastageFine: parseFloat(wastFine).toFixed(3),
                          barcode: tempProductData[0].barcode,
                          variant_number: tempProductData[0].variant_number,
                          stone_wgt: tempProductData[0].stone_wgt,
                          beads_wgt: tempProductData[0].beads_wgt,
                          sol_wgt: tempProductData[0].sol_wgt,
                          silver_wgt: tempProductData[0].silver_wgt,
                          other_wgt: tempProductData[0].other_wgt,
                          No_of_Packet: tempPacketData.length,
                          totalFine: totalFine,
                          fineRate: fineRate,
                          amount: parseFloat(
                              (parseFloat(fineRate) * parseFloat(
                                  (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
                                  (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
                              )) / 10 +
                              parseFloat(item.other_amt)
                          ).toFixed(3),
                          hallmark_charges: parseFloat(tempPackingSlip.hallmark_charges).toFixed(3),
                          totalAmount: tolAmt,
                          catRate: parseFloat(
                              (((parseFloat(fineRate) * parseFloat(totalFine)) / 10 +
                                  parseFloat(item.other_amt)) /
                                  parseFloat(item.net_wgt)) *
                              10
                          ).toFixed(3),
                          cgstPer: cgstPer,
                          cgstVal:
                              stateId === 12
                                  ? parseFloat(
                                      (parseFloat(tolAmt) * parseFloat(cgstPer)) / 100
                                  ).toFixed(3)
                                  : "",
                          sGstPer: sGstPer,
                          sGstVal:
                              stateId === 12
                                  ? parseFloat(
                                      (parseFloat(tolAmt) * parseFloat(sGstPer)) / 100
                                  ).toFixed(3)
                                  : "",
                          IGSTper: IGSTper,
                          IGSTVal:
                              stateId !== 12
                                  ? parseFloat(
                                      (parseFloat(tolAmt) * parseFloat(IGSTper)) / 100
                                  ).toFixed(3)
                                  : "",
                      };
                  });
                  // function fineGold(item) {
                  //     return parseFloat(item.totalFine);
                  // }

                  let temp = [...productData, ...newTempProductData];

                  // let tempFineGold = temp
                  //     .filter((item) => item.totalFine !== "")
                  //     .map(fineGold)
                  //     .reduce(function (a, b) {
                  //         // sum all resulting numbers
                  //         return parseFloat(a) + parseFloat(b);
                  //     }, 0);

                  // setFineGoldTotal(parseFloat(tempFineGold).toFixed(3));
                  // console.log("tempFineGold", tempFineGold);

                  setProductData((productData) => [
                      ...productData,
                      ...newTempProductData,
                  ]);

                  const tempTagWise = tempProductData.map((item) => {
                      let wastFine = parseFloat(
                          (parseFloat(item.net_wgt) * parseFloat(newTemp.wastage)) / 100
                      ).toFixed(3);

                      let wastFineAmt = parseFloat(
                          (parseFloat(wastFine) * parseFloat(fineRate)) / 10
                      ).toFixed(3);

                      let tolAmt = parseFloat(
                          parseFloat(wastFineAmt) + parseFloat(item.other_amt)
                      ).toFixed(3);

                      let labourRate = parseFloat(
                          parseFloat(tolAmt) / parseFloat(item.net_wgt)
                      ).toFixed(3);
                      return {
                          ...item,
                          // barcode:tempProductData[0].barcode,     
                          wastage: tempPackingSlip.wastage,
                          // barcode: tempProductData.barcode,
                          wastageFine: parseFloat(
                              (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
                          ).toFixed(3),
                          totalFine: parseFloat(
                              (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
                              (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
                          ).toFixed(3),
                          fineRate: fineRate,
                          amount: parseFloat(
                              (parseFloat(fineRate) * parseFloat(
                                  (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
                                  (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
                              )) / 10 +
                              parseFloat(item.other_amt)
                          ).toFixed(3),
                          hallmark_charges: parseFloat(tempPackingSlip.hallmark_charges).toFixed(3),
                          totalAmount: tolAmt,
                          catRate: parseFloat(
                              (((parseFloat(fineRate) * parseFloat(item.totalFine)) / 10 +
                                  parseFloat(item.other_amt)) /
                                  parseFloat(item.net_wgt)) *
                              10
                          ).toFixed(3)
                      };
                  });

                  setTagWiseData((tagWiseData) => [...tagWiseData, ...tempTagWise]);
                  // console.log(tempTagWise)
                
                  const tempBillMaterial = tempProductData.map((item) => {
                      setStoneWt(item.stone_wgt)
                      setPrintObj({
                          ...printObj,
                          StoneWt: stoneWt
                      })

                      let wastFine = parseFloat(
                          (parseFloat(item.net_wgt) * parseFloat(newTemp.wastage)) / 100
                      ).toFixed(3);

                      let wastFineAmt = parseFloat(
                          (parseFloat(wastFine) * parseFloat(fineRate)) / 10
                      ).toFixed(3);

                      let totalAmt = parseFloat(
                          parseFloat(wastFineAmt) +
                          parseFloat(item.stone_amt) +
                          parseFloat(item.beads_amt) +
                          parseFloat(item.silver_amt) +
                          parseFloat(item.sol_amt) +
                          parseFloat(item.other_amt)
                      ).toFixed(3);

                      return {
                          ...item,
                          metal_wgt:
                              parseFloat(parseFloat(item.gross_wgt) -
                                  (parseFloat(item.stone_wgt) +
                                      parseFloat(item.beads_wgt) +
                                      parseFloat(item.silver_wgt) +
                                      parseFloat(item.sol_wgt) +
                                      parseFloat(item.other_wgt))).toFixed(3),
                          metal_amt: "",
                          stone_wgt: parseFloat(item.stone_wgt).toFixed(3),
                          wastage: tempPackingSlip.wastage,
                          wastageFine: wastFine,
                          totalFine: parseFloat(
                              (parseFloat(item.net_wgt) * parseFloat(item.purity)) / 100 +
                              (parseFloat(item.net_wgt) * parseFloat(tempPackingSlip.wastage)) / 100
                          ).toFixed(3),
                          fineRate: fineRate,
                          hallmark_charges: parseFloat(tempPackingSlip.hallmark_charges).toFixed(3),
                          totalAmount: totalAmt,
                      };
                  });

                  setBillmaterialData((billMaterialData) => [
                      ...billMaterialData.map((item) => {
                          return {
                              ...item,
                              totalAmount: ""
                          }
                      }),
                      ...tempBillMaterial,
                  ]);
                  function amount(item) {
                      return item.totalAmount;
                  }

                  function CGSTval(item) {
                      return item.cgstVal;
                  }

                  function SGSTval(item) {
                      return item.sGstVal;
                  }

                  function IGSTVal(item) {
                      return item.IGSTVal;
                  }

                  function grossWeight(item) {
                      return parseFloat(item.gross_wgt);
                  }
                  function wastagefine(item) {
                      return parseFloat(item.wastageFine);
                  }
                  function netWeight(item) {
                      return parseFloat(item.net_wgt);
                  }
                  function pcs(item) {
                      return parseFloat(item.pcs);
                  }
                  function totalFine(item) {
                      return parseFloat(item.totalFine);
                  }
                  function hallmarkCharges(item) {
                      return parseFloat(item.hallmark_charges);
                  }
                  function AmountTot(item) {
                      return parseFloat(item.totalAmount);
                  }
                  function PacketTot(item) {
                      return parseFloat(item.No_of_Packet);
                  }
                  function beadswgt(item) {
                      return parseFloat(item.beads_wgt);
                  }

                  let totalGrossWeightVal = parseFloat(temp
                      .filter((item) => item.gross_wgt !== "")
                      .map(grossWeight)
                      .reduce(function (a, b) {
                          // sum all resulting numbers
                          return parseFloat(a) + parseFloat(b);
                      }, 0)).toFixed(3);
                  setTotalGrossWeight(totalGrossWeightVal);

                  let totalNetWeightVal = parseFloat(temp
                      .filter((item) => item.net_wgt !== "")
                      .map(netWeight)
                      .reduce(function (a, b) {
                          // sum all resulting numbers
                          return parseFloat(a) + parseFloat(b);
                      }, 0)).toFixed(3);

                  let totalwastageFine = parseFloat(temp
                      .filter((item) => item.wastageFine !== "")
                      .map(wastagefine)
                      .reduce(function (a, b) {
                          // sum all resulting numbers
                          return parseFloat(a) + parseFloat(b);
                      }, 0)).toFixed(3);

                  let tempAmount = temp
                      .filter((item) => item.totalAmount !== "")
                      .map(amount)
                      .reduce(function (a, b) {
                          // sum all resulting numbers
                          return parseFloat(a) + parseFloat(b);
                      }, 0);
                  //tempTotal is amount + gst
                  let tempTotal = 0;
                  let tempCgstVal = 0;
                  let tempSgstVal = 0;
                  let tempIgstVal = 0;
                  if (stateId === 12) {
                      tempCgstVal = temp
                          .filter((item) => item.cgstVal !== "")
                          .map(CGSTval)
                          .reduce(function (a, b) {
                              // sum all resulting numbers
                              return parseFloat(a) + parseFloat(b);
                          }, 0);

                      tempSgstVal = temp
                          .filter((item) => item.sGstVal !== "")
                          .map(SGSTval)
                          .reduce(function (a, b) {
                              // sum all resulting numbers
                              return parseFloat(a) + parseFloat(b);
                          }, 0);
                      console.log("in part", parseFloat(tempCgstVal) + parseFloat(tempSgstVal));

                      tempTotal = parseFloat(parseFloat(tempAmount) + parseFloat(tempCgstVal) + parseFloat(tempSgstVal)).toFixed(3);

                  } else {
                      console.log("else", parseFloat(tempIgstVal).toFixed(3), console.log(temp));
                      tempIgstVal = temp
                          .filter((item) => item.IGSTVal !== "")
                          .map(IGSTVal)
                          .reduce(function (a, b) {
                              // sum all resulting numbers
                              return parseFloat(a) + parseFloat(b);
                          }, 0);
                      tempTotal = parseFloat(
                          parseFloat(tempAmount) + parseFloat(tempIgstVal)
                      ).toFixed(3);
                  }

                  let totalPcs = temp
                      .filter((item) => item.pcs !== "")
                      .map(pcs)
                      .reduce(function (a, b) {
                          // sum all resulting numbers
                          return parseFloat(a) + parseFloat(b);
                      }, 0);

                  let FineTotal = temp
                      .filter((item) => item.totalFine !== "")
                      .map(totalFine)
                      .reduce(function (a, b) {
                          // sum all resulting numbers
                          return parseFloat(a) + parseFloat(b);
                      }, 0);

                  let hallmarkChargesTot = temp
                      .filter((item) => item.hallmark_charges !== "")
                      .map(hallmarkCharges)
                      .reduce(function (a, b) {
                          // sum all resulting numbers
                          return parseFloat(a) + parseFloat(b);
                      }, 0);

                  let totalAmount = temp
                      .filter((item) => item.totalAmount !== "")
                      .map(AmountTot)
                      .reduce(function (a, b) {
                          // sum all resulting numbers
                          return parseFloat(a) + parseFloat(b);
                      }, 0);

                  let no_ofPacket = temp
                      .filter((item) => item.No_of_Packet !== "")
                      .map(PacketTot)
                      .reduce(function (a, b) {
                          // sum all resulting numbers
                          return parseFloat(a) + parseFloat(b);
                      }, 0);

                  let beadswgtTot = temp
                      .filter((item) => item.beads_wgt !== "")
                      .map(beadswgt)
                      .reduce(function (a, b) {
                          // sum all resulting numbers
                          return parseFloat(a) + parseFloat(b);
                      }, 0);


                  let alldata = [...tagWiseData, ...tempTagWise]
                  console.log(alldata,"alldata");
                  let tempDlData = alldata.map((item, index) => {


                      return {

                          "Packing_Slip_number": item.packing_slip_no !== null ? item.packing_slip_no : "",
                          "Packet_No": item.packet_no !== null ? item.packet_no : "",
                          "Category": item.category_name !== null ? item.category_name : "",
                          "Barcode": item.barcode !== null ? item.barcode : "",
                          "Design_No": item.variant_number !== null ? item.variant_number : "",
                          "Purity": item.purity !== null ? item.purity : "",
                          "Pcs": item.pcs !== null ? item.pcs : "",
                          "Size": "",
                          "Gross_Wt": item.gross_wgt !== null ? item.gross_wgt : "",
                          "Net_Wt": item.net_wgt !== null ? item.net_wgt : "",
                          "Wastage_percentage": item.wastage !== null ? item.wastage : "",
                          "Stone_Wt": item.stone_wgt !== null ? parseFloat(item.stone_wgt).toFixed(3) : "",
                          "Beads_Wt": item.beads_wgt !== null ? item.beads_wgt : "",
                          "Solitaire_Wt": item.sol_wgt !== null ? item.sol_wgt : "",
                          "Oth_wt": item.other_wgt !== null ? parseFloat(item.other_wgt).toFixed(3) : "",
                          "HM_Before_Disc": "",
                          "HM_After_Disc": "",
                          "Amount_Before_Discount": "",
                          "Amount_After_Discount": "",
                          "HUID": "",

                      }


                  })

                  var final = [];
                  var tem = '';
                  var temp_total = 0
                  var net_ = 0
                  var Gross_Wt = 0
                  var Stone_Wt = 0
                  var Beads_Wt = 0
                  var Solitaire_Wt = 0
                  var Oth_wt = 0

                  tempDlData.map(j => {
                      if (tem == "") {
                          tem = j.Packet_No
                      } else if (tem != j.Packet_No) {
                          final.push({}, { "Packing_Slip_number": "Total", 
                          "Net_Wt": net_, 
                          "Pcs": temp_total, 
                          "Gross_Wt": Gross_Wt, 
                          "Stone_Wt":parseFloat(Stone_Wt).toFixed(3),
                          "Beads_Wt": Beads_Wt, 
                          "Solitaire_Wt": Solitaire_Wt, 
                          "Oth_wt": parseFloat(Oth_wt).toFixed(3) },
                            {}
                            )
                          tem = j.Packet_No
                          temp_total = 0
                          net_ = 0
                          Gross_Wt = 0
                          Stone_Wt = 0
                          Beads_Wt = 0
                          Solitaire_Wt = 0
                          Oth_wt = 0
                      }
                      temp_total += j.Pcs
                      net_ += parseFloat(j.Net_Wt)
                      Gross_Wt += parseFloat(j.Gross_Wt)
                      Stone_Wt += parseFloat(j.Stone_Wt)
                      Beads_Wt += parseFloat(j.Beads_Wt)
                      Solitaire_Wt += parseFloat(j.Solitaire_Wt)
                      Oth_wt += parseFloat(j.Oth_wt)
                      final.push(j)
                  })
                  final.push({}, { "Packing_Slip_number": "Total", "Net_Wt": net_, "Pcs": temp_total, "Gross_Wt": Gross_Wt, "Stone_Wt": parseFloat(Stone_Wt).toFixed(3), "Beads_Wt": Beads_Wt, "Solitaire_Wt": Solitaire_Wt, "Oth_wt": parseFloat(Oth_wt).toFixed(3) }, {})
                  setCsvData(final);


                  let pdf = final
                  var uniquePurity = []
                  var sum = []
                  var sum1 = []
                  temp.map(j => {
                      if (!uniquePurity.includes(j.purity)) {
                          uniquePurity.push(j.purity)
                          sum[j.purity] = {
                              purity: Number(j.purity), gross_wgt: j.gross_wgt, 
                              stone_wgt: j.stone_wgt, silver_wgt: 0,
                              rubber_wgt: 0, beads_wgt: j.beads_wgt,
                              other_metal_wgt: 0, net_wgt: j.net_wgt,
                              fine_with_wstg: Number(j.totalFine), hallmarkChargesFrontEnd: Number(j.hallmark_charges),
                              trans_amt: Number(j.totalAmount), no_of_packet: j.No_of_Packet,      
                          };
                          sum1.push(sum[j.purity])
                      } else {
                          let tfine = sum[j.purity].fine_with_wstg;
                          let transamtTot = sum[j.purity].trans_amt;
                          let netWtTot = sum[j.purity].net_wgt;
                          let grosswtTot = sum[j.purity].gross_wgt;
                          let hmchargesTot = sum[j.purity].hallmarkChargesFrontEnd;
                          let noOfPacketTot = sum[j.purity].no_of_packet;
                          let stoneWgtTot = sum[j.purity].stone_wgt;
                          let beadsWgt = sum[j.purity].beads_wgt;
                          sum[j.purity].gross_wgt = parseFloat(grosswtTot) + parseFloat(j.gross_wgt);
                          sum[j.purity].fine_with_wstg = parseFloat(tfine) + parseFloat(j.totalFine);
                          sum[j.purity].stone_wgt = parseFloat(stoneWgtTot) + parseFloat(j.stone_wgt);
                          sum[j.purity].trans_amt = parseFloat(transamtTot) + parseFloat(j.totalAmount);
                          sum[j.purity].net_wgt = parseFloat(netWtTot) + parseFloat(j.net_wgt);
                          sum[j.purity].beads_wgt = parseFloat(beadsWgt) + parseFloat(j.beads_wgt);
                          sum[j.purity].hallmarkChargesFrontEnd = parseFloat(hmchargesTot) + parseFloat(j.hallmark_charges);
                          sum[j.purity].no_of_packet = parseFloat(noOfPacketTot) + parseFloat(j.No_of_Packet);
                      }
                  })
                  let noOfPacket = sum1.map(k => k.no_of_packet).reduce((a, b) => a + b)
                  let beadsWgtTot = sum1.map(k => k.beads_wgt).reduce((a, b) => a + b)
                  let stoneWgtTot = sum1.map(k => k.stone_wgt).reduce((a, b) => a + b)

                  let basic_details = {
                      "party": selectedClient.label
                  }
                  let table1_list = temp.map(i => {
                      return {
                          "purity": i.purity !== null ? Number(i.purity) : 0,
                          "billing_category_name": i.billing_category_name !== null ? i.billing_category_name : "",
                          "pcs": i.pcs !== null ? i.pcs : 0,
                          "gross_wgt": i.gross_wgt !== null ? i.gross_wgt : 0,
                          "net_wgt": i.net_wgt !== null ? i.net_wgt : 0,
                          "wastage": i.wastageFine !== null ? Number(i.wastageFine) : 0,
                          "fine_rate": i.totalFine !== null ? Number(i.totalFine) : 0,
                          "hallmarkChargesFrontEnd": i.hallmark_charges !== null ? Number(i.hallmark_charges) : 0,
                          "other_amt": i.totalAmount !== null ? Number(i.totalAmount) : 0,
                      }
                  })
                  let table1_list_total =

                  {
                      "total_pcs": totalPcs !== null ? totalPcs : 0,
                      "total_gross_wgt": totalGrossWeightVal !== null ? Number(totalGrossWeightVal) : 0,
                      "total_net_wgt": totalNetWeightVal !== null ? Number(totalNetWeightVal) : 0,
                      "total_wastage": totalwastageFine !== null ? Number(totalwastageFine) : 0,
                      "total_fine_rate": FineTotal !== null ? FineTotal : 0,
                      "total_hallmarkChargesFrontEnd": hallmarkChargesTot !== null ? hallmarkChargesTot : 0,
                      "total_other_amt": totalAmount !== null ? totalAmount : 0
                  }


                  let table2_list = sum1

                  let table2_list_total =
                  {
                      "total_gross_wgt": totalGrossWeightVal !== null ? Number(totalGrossWeightVal) : 0,
                      "total_stone_wgt": stoneWgtTot !== null ? stoneWgtTot : 0,
                      "total_silver_wgt": 0,
                      "total_rubber_wgt": 0,
                      "total_beads_wgt": beadsWgtTot !== null ? beadsWgtTot : 0,
                      "total_other_metal_wgt": 0,
                      "total_net_wgt": totalNetWeightVal !== null ? Number(totalNetWeightVal) : 0,
                      "total_fine_with_wstg": FineTotal !== null ? FineTotal : 0,
                      "total_hallmarkChargesFrontEnd": hallmarkChargesTot !== null ? hallmarkChargesTot : 0,
                      "total_trans_amt": totalAmount !== null ? totalAmount : 0,
                      "total_no_of_packet": noOfPacket !== null ? noOfPacket : 0
                  }


                  let current = {
                      "fine": Number(FineTotal),
                      "amount": (hallmarkChargesTot + totalAmount),
                  }
                  let closing = {
                      "fine": Number(FineTotal),
                      "amount": totalAmount,
                  }
                  let table3_list = { current, closing }

                  let dataForExcel = { basic_details, table1_list, table1_list_total, table2_list, table2_list_total, table3_list }
                  setdataForExcel(dataForExcel);

                  setPrintObj({
                      ...printObj,
                      orderDetails: temp,
                      orderDetail: pdf,
                      sumofpurity: sum1,
                      taxableAmount: tempAmount ? parseFloat(tempAmount).toFixed(3) : '',
                      sGstTot: stateId === 12 ? parseFloat(tempSgstVal).toFixed(3) : "",
                      cGstTot: stateId === 12 ? parseFloat(tempCgstVal).toFixed(3) : "",
                      iGstTot: stateId !== 12 ? parseFloat(tempIgstVal).toFixed(3) : "",
                      grossWtTOt: parseFloat(totalGrossWeightVal).toFixed(3),
                      netWtTOt: parseFloat(totalNetWeightVal).toFixed(3),
                      pcsTot: totalPcs,
                      FineTot: FineTotal,
                      hmTotal: hallmarkChargesTot,
                      amountTot: totalAmount,
                      PacketTotal: no_ofPacket,
                      beadsWgtTot: beadswgtTot,
                      sumnoOfPacketTot: noOfPacket,
                      sumbeadsWgtTot: beadsWgtTot,
                      sumstoneWgtTot: stoneWgtTot,
                      totalwastageFine: totalwastageFine,
                  })

              } else {
                  dispatch(Actions.showMessage({ message: response.data.message }));
              }
          })
          .catch((error) => {
              handleError(error, dispatch, { api: `api/packingslip/packingSlip/${packingSlipNum}` })
          });
  }

  function getPackingSlipData(sData) {
      axios
          .get(Config.getCommonUrl() + `api/packingslip/search/${sData}/${window.localStorage.getItem("SelectedDepartment")}`)
          .then(function (response) {
              if (response.data.success === true) {
                  console.log(response);
                  if (response.data.data.length > 0) {
                      setPackingSlipApiData(response.data.data);
                  } else {
                      setPackingSlipApiData([]);
                      dispatch(
                          Actions.showMessage({
                              message: "Please Insert Proper Packing Slip No",
                          })
                      );
                  }
              } else {
                  setPackingSlipApiData([]);
                  dispatch(Actions.showMessage({ message: response.data.error.message }));
              }
          })
          .catch((error) => {
              handleError(error, dispatch, { api: `api/packingslip/search/${sData}/${window.localStorage.getItem("SelectedDepartment")}` })

          });
  }

  function ExcelestimateData() {
      var body = {
          dataForExcel: dataForExcel,
      }
      axios.post(Config.getCommonUrl() + "api/packingslip/download/excel", body)
          .then((response) => {
              console.log(response);
              if (response.data.success === true) {
                  let data = response.data.data;
                  if (data.hasOwnProperty("xl_url")) {
                      let downloadUrl = data.xl_url;
                      const link = document.createElement("a");
                      link.setAttribute('target', '_blank');
                      link.href = downloadUrl;
                      link.click();

                  }
              } else {
                  dispatch(Actions.showMessage({ message: response.data.message }));
              }
          })
          .catch((error) => {
              handleError(error, dispatch, {
                  api: "api/packingslip/download/excel", body: body
              })
          })
  }

  function deleteHandler(slipNo) {
      let tempPackingslip = packingSlipData.filter((item) => item.packing_slip_no !== slipNo)
      setPackingSlipData(tempPackingslip);

      let tempPacket = packetData.filter((item) => item.packing_slip_no !== slipNo)
      setPacketData(tempPacket);

      let tempProduct = productData.filter((item) => item.packing_slip_no !== slipNo)
      setProductData(tempProduct);

      let tempBom = billMaterialData.filter((item) => item.packing_slip_no !== slipNo)
      setBillmaterialData(tempBom);

      let tempTag = tagWiseData.filter((item) => item.packing_slip_no !== slipNo)
      setTagWiseData(tempTag);

      function amount(item) {
          return item.totalAmount;
      }

      function CGSTval(item) {
          return item.cgstVal;
      }

      function SGSTval(item) {
          return item.sGstVal;
      }

      function IGSTVal(item) {
          return item.IGSTVal;
      }

      function grossWeight(item) {
          return parseFloat(item.gross_wgt);
      }
      function netWeight(item) {
          return parseFloat(item.net_wgt);
      }
      function pcs(item) {
          return parseFloat(item.pcs);
      }
      function wastagefine(item) {
          return parseFloat(item.wastageFine);
      }
      function totalFine(item) {
          return parseFloat(item.totalFine);
      }
      function hallmarkCharges(item) {
          return parseFloat(item.hallmark_charges);
      }
      function AmountTot(item) {
          return parseFloat(item.totalAmount);
      }

      let totalGrossWeightVal = parseFloat(tempProduct
          .filter((item) => item.gross_wgt !== "")
          .map(grossWeight)
          .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
          }, 0)).toFixed(3);
      setTotalGrossWeight(totalGrossWeightVal);

      let totalNetWeightVal = parseFloat(tempProduct
          .filter((item) => item.net_wgt !== "")
          .map(netWeight)
          .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
          }, 0)).toFixed(3);

      let tempAmount = tempProduct
          .filter((item) => item.totalAmount !== "")
          .map(amount)
          .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
          }, 0);
          let totalPcs = tempProduct
          .filter((item) => item.pcs !== "")
          .map(pcs)
          .reduce(function (a, b) {
              // sum all resulting numbers
              return parseFloat(a) + parseFloat(b);
          }, 0);

          let totalwastageFine = parseFloat(tempProduct
              .filter((item) => item.wastageFine !== "")
              .map(wastagefine)
              .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
              }, 0)).toFixed(3);

              
              let FineTotal = tempProduct
              .filter((item) => item.totalFine !== "")
              .map(totalFine)
              .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
              }, 0);

              let hallmarkChargesTot = tempProduct
                      .filter((item) => item.hallmark_charges !== "")
                      .map(hallmarkCharges)
                      .reduce(function (a, b) {
                          // sum all resulting numbers
                          return parseFloat(a) + parseFloat(b);
                      }, 0);

                      let totalAmount = tempProduct
                      .filter((item) => item.totalAmount !== "")
                      .map(AmountTot)
                      .reduce(function (a, b) {
                          // sum all resulting numbers
                          return parseFloat(a) + parseFloat(b);
                      }, 0);
      //tempTotal is amount + gst
      let tempTotal = 0;
      let tempCgstVal = 0;
      let tempSgstVal = 0;
      let tempIgstVal = 0;
      if (stateId === 12) {
          tempCgstVal = tempProduct
              .filter((item) => item.cgstVal !== "")
              .map(CGSTval)
              .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
              }, 0);

          tempSgstVal = tempProduct
              .filter((item) => item.sGstVal !== "")
              .map(SGSTval)
              .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
              }, 0);
          console.log("in part", parseFloat(tempCgstVal) + parseFloat(tempSgstVal));

          tempTotal = parseFloat(parseFloat(tempAmount) + parseFloat(tempCgstVal) + parseFloat(tempSgstVal)).toFixed(3);

      } else {
          console.log("else", parseFloat(tempIgstVal).toFixed(3), console.log(tempProduct));

          tempIgstVal = tempProduct
              .filter((item) => item.IGSTVal !== "")
              .map(IGSTVal)
              .reduce(function (a, b) {
                  // sum all resulting numbers
                  return parseFloat(a) + parseFloat(b);
              }, 0);
          tempTotal = parseFloat(
              parseFloat(tempAmount) + parseFloat(tempIgstVal)
          ).toFixed(3);
      }

      var uniquePurity = []
                  var sum = []
                  var sum1 = []
                  tempProduct.map(j => {
                      if (!uniquePurity.includes(j.purity)) {
                          uniquePurity.push(j.purity)
                          sum[j.purity] = {
                              purity: Number(j.purity), gross_wgt: j.gross_wgt, 
                              stone_wgt: j.stone_wgt, silver_wgt: 0,
                              rubber_wgt: 0, beads_wgt: j.beads_wgt,
                              other_metal_wgt: 0, net_wgt: j.net_wgt,
                              fine_with_wstg: Number(j.totalFine), hallmarkChargesFrontEnd: Number(j.hallmark_charges),
                              trans_amt: Number(j.totalAmount), no_of_packet: j.No_of_Packet,      
                          };
                          sum1.push(sum[j.purity])
                      } else {
                          let tfine = sum[j.purity].fine_with_wstg;
                          let transamtTot = sum[j.purity].trans_amt;
                          let netWtTot = sum[j.purity].net_wgt;
                          let grosswtTot = sum[j.purity].gross_wgt;
                          let hmchargesTot = sum[j.purity].hallmarkChargesFrontEnd;
                          let noOfPacketTot = sum[j.purity].no_of_packet;
                          let stoneWgtTot = sum[j.purity].stone_wgt;
                          let beadsWgt = sum[j.purity].beads_wgt;
                          sum[j.purity].gross_wgt = parseFloat(grosswtTot) + parseFloat(j.gross_wgt);
                          sum[j.purity].fine_with_wstg = parseFloat(tfine) + parseFloat(j.totalFine);
                          sum[j.purity].stone_wgt = parseFloat(stoneWgtTot) + parseFloat(j.stone_wgt);
                          sum[j.purity].trans_amt = parseFloat(transamtTot) + parseFloat(j.totalAmount);
                          sum[j.purity].net_wgt = parseFloat(netWtTot) + parseFloat(j.net_wgt);
                          sum[j.purity].beads_wgt = parseFloat(beadsWgt) + parseFloat(j.beads_wgt);
                          sum[j.purity].hallmarkChargesFrontEnd = parseFloat(hmchargesTot) + parseFloat(j.hallmark_charges);
                          sum[j.purity].no_of_packet = parseFloat(noOfPacketTot) + parseFloat(j.No_of_Packet);
                      }
                  })

                  let noOfPacket ; 
                  let beadsWgtTot ;
                  let stoneWgtTot ;
                  if (sum1.length > 0) {
                      noOfPacket = sum1.map(k => k.no_of_packet).reduce((a, b) => a + b);
                      beadsWgtTot = sum1.map(k => k.beads_wgt).reduce((a, b) => a + b)
                      stoneWgtTot = sum1.map(k => k.stone_wgt).reduce((a, b) => a + b)
                    } 
                  let basic_details = {
                      "party": selectedClient.label
                  }
                  let table1_list = tempProduct.map(i => {
                      return {
                          "purity": i.purity !== null ? Number(i.purity) : 0,
                          "billing_category_name": i.billing_category_name !== null ? i.billing_category_name : "",
                          "pcs": i.pcs !== null ? i.pcs : 0,
                          "gross_wgt": i.gross_wgt !== null ? i.gross_wgt : 0,
                          "net_wgt": i.net_wgt !== null ? i.net_wgt : 0,
                          "wastage": i.wastageFine !== null ? Number(i.wastageFine) : 0,
                          "fine_rate": i.totalFine !== null ? Number(i.totalFine) : 0,
                          "hallmarkChargesFrontEnd": i.hallmark_charges !== null ? Number(i.hallmark_charges) : 0,
                          "other_amt": i.totalAmount !== null ? Number(i.totalAmount) : 0,
                      }
                  })
                  let table1_list_total =

                  {
                      "total_pcs": totalPcs !== null ? totalPcs : 0,
                      "total_gross_wgt": totalGrossWeightVal !== null ? Number(totalGrossWeightVal) : 0,
                      "total_net_wgt": totalNetWeightVal !== null ? Number(totalNetWeightVal) : 0,
                      "total_wastage": totalwastageFine !== null ? Number(totalwastageFine) : 0,
                      "total_fine_rate": FineTotal !== null ? FineTotal : 0,
                      "total_hallmarkChargesFrontEnd": hallmarkChargesTot !== null ? hallmarkChargesTot : 0,
                      "total_other_amt": totalAmount !== null ? totalAmount : 0
                  }


                  let table2_list = sum1

                  let table2_list_total =
                  {
                      "total_gross_wgt": totalGrossWeightVal !== null ? Number(totalGrossWeightVal) : 0,
                      "total_stone_wgt": stoneWgtTot !== null ? stoneWgtTot : 0,
                      "total_silver_wgt": 0,
                      "total_rubber_wgt": 0,
                      "total_beads_wgt": beadsWgtTot !== null ? beadsWgtTot : 0,
                      "total_other_metal_wgt": 0,
                      "total_net_wgt": totalNetWeightVal !== null ? Number(totalNetWeightVal) : 0,
                      "total_fine_with_wstg": FineTotal !== null ? FineTotal : 0,
                      "total_hallmarkChargesFrontEnd": hallmarkChargesTot !== null ? hallmarkChargesTot : 0,
                      "total_trans_amt": totalAmount !== null ? totalAmount : 0,
                      "total_no_of_packet": noOfPacket !== null ? noOfPacket : 0
                  }


                  let current = {
                      "fine": Number(FineTotal),
                      "amount": (hallmarkChargesTot + totalAmount),
                  }
                  let closing = {
                      "fine": Number(FineTotal),
                      "amount": totalAmount,
                  }
                  let table3_list = { current, closing }

                  let dataForExcel = {basic_details, table1_list, table1_list_total, table2_list, table2_list_total, table3_list }
                  setdataForExcel(dataForExcel);
                  const deleteIndex = []
                  csvData.map((i, index) => {
                      if (i.Packing_Slip_number == slipNo) {
                          deleteIndex.push(index, index + 1, index + 2, index + 3);
                      }
                  })
          
                  const indexSet = new Set(deleteIndex);
          
                  const arrayWithValuesRemoved = csvData.filter((value, i) => !indexSet.has(i));
                  setCsvData(arrayWithValuesRemoved)
      setPrintObj({
          ...printObj,
          orderDetails: tempProduct,
          sumofpurity: sum1,
          taxableAmount: tempAmount ? parseFloat(tempAmount).toFixed(3) : '',
          sGstTot: stateId === 12 ? parseFloat(tempSgstVal).toFixed(3) : "",
          cGstTot: stateId === 12 ? parseFloat(tempCgstVal).toFixed(3) : "",
          iGstTot: stateId !== 12 ? parseFloat(tempIgstVal).toFixed(3) : "",
          pcsTot: totalPcs,
          totalwastageFine: totalwastageFine,
          FineTot: FineTotal,
          hmTotal: hallmarkChargesTot,
          amountTot: totalAmount,
          sumnoOfPacketTot: noOfPacket,
          sumstoneWgtTot: stoneWgtTot,
          sumbeadsWgtTot: beadsWgtTot,
          orderDetail: arrayWithValuesRemoved,
          grossWtTOt: parseFloat(totalGrossWeightVal).toFixed(3),
          netWtTOt: parseFloat(totalNetWeightVal).toFixed(3),
      })
  }

  function handleFormatModalClose() {
      setModalOpen(false);
  }

  function handleInputChange(event) {
      // console.log("callled")
      const target = event.target;
      const value = target.type === "checkbox" ? target.checked : target.value;
      const name = target.name;

      if (name === "fineRate") {
          setFineRate(value);
          setFineRateErr("");
      }
  }

  function FineRateValidaion() {
      // fineRate
      if (fineRate === "") {
          setFineRateErr("Enter Fine Rate");
          return false;
      } else {
          setFineRateErr("");
      }
      return true;
  }

  const downloadExcel = () => {
      const worksheet = XLSX.utils.json_to_sheet(csvData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      XLSX.writeFile(workbook, 'Packing_slip_Details.xlsx');
    };


  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div
            className="flex flex-1 flex-col min-w-0 makeStyles-root-1"
            style={{ marginTop: "30px" }}
          >
            <Grid
              container
              alignItems="center"
              style={{ paddingInline: "30px" }}
            >
              <Grid item xs={9} sm={9} md={8} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    Create Estimate
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper /> */}
              </Grid>

              <Grid
                item
                xs={3}
                sm={3}
                md={4}
                key="2"
                style={{ textAlign: "right" }}
              >
                <div className="btn-back">
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
                            alt=""/>
                  
                    Back
                  </Button>
                </div>
              </Grid>
            </Grid>

            {loading && <Loader />}
            <div className="main-div-alll" style={{ marginTop: "20px" }}>
              <div>
                <Grid container spacing={2} alignItems="center">
                  <Grid item lg={2} md={4} sm={6} xs={12}>
                    <label style={{ paddingBottom: "5px", display: "block" }}>
                      Select party
                    </label>
                    <Select
                      id="view_jewellary_dv"
                      filterOption={createFilter({ ignoreAccents: false })}
                      classes={classes}
                      styles={selectStyles}
                      options={clientdata.map((suggestion) => ({
                        value: suggestion.id,
                        label: suggestion.name,
                      }))}
                      // components={components}
                      value={selectedClient}
                      onChange={handlePartyChange}
                      placeholder="Select party"
                      // isDisabled={isView}
                    />
                    <span style={{ color: "red" }}>
                      {selectClientErr.length > 0 ? selectClientErr : ""}
                    </span>
                  </Grid>

                  <Grid item lg={2} md={4} sm={6} xs={12}>
                    <label style={{ paddingBottom: "5px", display: "block" }}>
                      Select firm
                    </label>
                    <Select
                      id="view_jewellary_dv"
                      filterOption={createFilter({ ignoreAccents: false })}
                      classes={classes}
                      styles={selectStyles}
                      options={clientCompanies
                        // .filter((item) => item.id !== selectedVendor.value)
                        .map((suggestion) => ({
                          value: suggestion.id,
                          label: suggestion.company_name,
                        }))}
                      // components={components}
                      value={selectedCompany}
                      onChange={handleCompanyChange}
                      placeholder="Select firm"
                      // isDisabled={isView}
                    />
                    <span style={{ color: "red" }}>
                      {selectedCompErr.length > 0 ? selectedCompErr : ""}
                    </span>
                  </Grid>

                  <Grid item lg={2} md={4} sm={6} xs={12}>
                    <label style={{ paddingBottom: "5px", display: "block" }}>
                      Fine rate
                    </label>
                    <TextField
                      placeholder="Fine rate"
                      name="fineRate"
                      value={fineRate}
                      error={fineRateErr.length > 0 ? true : false}
                      helperText={fineRateErr}
                      onChange={(e) => handleInputChange(e)}
                      variant="outlined"
                      required
                      fullWidth
                    />
                  </Grid>

                  {/* {(selectedLoad === "0") && ( */}
                  <Grid
                    className="packing-slip-input"
                    item
                    lg={2}
                    md={4}
                    sm={6}
                    xs={12}
                  >
                    <label style={{ paddingBottom: "5px", display: "block" }}>
                      Packing slip no
                    </label>
                    <Autocomplete
                      id="free-solo-demo"
                      freeSolo
                      disableClearable
                      onChange={(event, newValue) => {
                        handlePackingSlipSelect(newValue);
                      }}
                      onInputChange={(event, newInputValue) => {
                        if (event !== null) {
                          if (event.type === "change")
                            // not using this condition because all other data is showing in dropdown
                            setPackingSearch(newInputValue);
                        } else {
                          setPackingSearch("");
                        }
                      }}
                      value={packingSlipNo}
                      disabled={fineRate === ""}
                      options={packingSlipApiData.map(
                        (option) => option.barcode
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          style={{ padding: 0 }}
                          placeholder="Packing slip no"
                        />
                      )}
                    />
                    <span style={{ color: "red" }}>
                      {packingSlipErr.length > 0 ? packingSlipErr : ""}
                    </span>
                  </Grid>

                  {/* )} */}

                  {/* {selectedLoad === "0" && ( */}
                  {/* <Grid item lg={2} md={4} sm={4} xs={12}>
                    <Button
                                        variant="contained"
                                        color="primary"
                                        className="mx-auto"
                                        aria-label="Register"
                                        style={{ width: "100%" }}
                                        // disabled={isView}
                                        onClick={handleClick}
                                    >
                                        Load Packing Slip
                                    </Button>
                  </Grid> */}
                  {/* )} */}
                </Grid>

                {/* {selectedLoad === "0" && ( */}
                <Grid item xs={12} style={{marginTop: "15px"}}>
                  <div className={classes.root}>
                    {/* <AppBar position="static"> */}
                    <Tabs
                      value={modalView}
                      onChange={handleChangeTab}
                      style={{ marginBottom: 20 }}
                      variant="scrollable"
                      scrollButtons="auto"
                    >
                      <Tab className={classes.tab} label="Category Wise List" />
                      <Tab className={classes.tab} label="Tag Wise List" />
                      <Tab className={classes.tab} label="Packet Wise List" />
                      <Tab className={classes.tab} label="Packing Slip Wise List"/>
                      <Tab className={classes.tab} label="Bill Of Material" />
                    </Tabs>
                    {/* </AppBar> */}
                    {modalView === 0 && (
                      <CategoryWiseList productData={productData} />
                    )}
                    {modalView === 1 && (
                      <TagWiseList tagWiseData={tagWiseData} />
                    )}
                    {modalView === 2 && (
                      <PacketWiseList packetData={packetData} />
                    )}
                    {modalView === 3 && (
                      <PackingSlipWiseList
                        packingSlipData={packingSlipData}
                        deleteHandler={deleteHandler}
                        isView={false}
                      />
                    )}
                    {modalView === 4 && (
                      <BillOfMaterial billMaterialData={billMaterialData} />
                    )}
                  </div>
                </Grid>
                {/* )} */}

                {/* <Button
                                    variant="contained"
                                    color="primary"
                                    style={{ float: "right" }}
                                    className="w-224 mx-auto mt-16"
                                    aria-label="Register"
                                    // disabled={isView}
                                    // type="submit"
                                    onClick={(e) => {
                                        handleFormSubmit(e);
                                    }}
                                >
                                    Save
                                </Button> */}
                <Grid
                  xs={12}
                  item
                  style={{
                    marginTop: "20px",
                    justifyContent: "flex-end",
                    display: "flex",
                    columnGap: "20px",
                  }}
                >
                  <Button
                    id="btn-save"
                    variant="contained"
                    aria-label="Register"
                    //   disabled={!isFormValid()}
                    onClick={checkforDownload}
                  >
                    DOWNLOAD PDF/CSV
                  </Button>

                  {/* { fileType === "1" && format === "0" &&
                                <CSVLink data={csvData}
                                    filename={"Create_Estimate.csv"}>
                                    <Button variant="contained"
                                        // color="primary"
                                        style={{ float: "right", backgroundColor: "limegreen" }}
                                        className="w-224 mx-auto mt-16 mr-16"
                                        aria-label="Register"
                                        disabled={csvData.length === 0}
                                       
                                    >
                                        Packing Details Csv
                                    </Button>
                                </CSVLink>} */}

                  {/* <Button
                                    variant="contained"
                                    // color="primary"
                                    style={{ float: "right", backgroundColor: "limegreen" }}
                                    className="w-224 mx-auto mt-16 mr-16"
                                    aria-label="Register"
                                    //   disabled={!isFormValid()}
                                    // type="submit"
                                    onClick={() => checkforPrint(2)}
                                >
                                    Packing Details PDF
                                </Button> */}

                  <Button
                    id="btn-save"
                    variant="contained"
                    aria-label="Register"
                    //   disabled={!isFormValid()}
                    // type="submit"

                    onClick={() => checkforPrint(1)}
                  >
                    Print
                  </Button>
                </Grid>

                <div style={{ display: "none" }}>
                  {buttonClick === 1 && (
                    <SalesEstimstePrintCom
                      ref={componentRef}
                      printObj={printObj}
                    />
                  )}
                  {fileType === "0" && format === "0" && (
                    <SalesEstimateSub2Print
                      ref={componentRef}
                      printObj={printObj}
                    />
                  )}
                  {fileType === "0" && format === "1" && (
                    <SalesEstimateSubPrint
                      ref={componentRef}
                      printObj={printObj}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </FuseAnimate>
      <Modal
        // disableBackdropClick
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={modalOpen}
      >
        <div style={modalStyle} className={classes.paper}>
          <h5
            className="p-5"
            style={{
              textAlign: "center",
              backgroundColor: "#415bd4",
              color: "white",
            }}
          >
            Select Format
            <IconButton
              style={{ position: "absolute", top: "0", right: "0" }}
              onClick={handleFormatModalClose}
            >
              <Icon style={{ color: "white" }}>close</Icon>
            </IconButton>
          </h5>
          <div className="p-5 pl-16 pr-16" style={{ display: "block" }}>
            <FormControl
              id="redio-input-dv"
              component="fieldset"
              className={classes.formControl}
            >
              <FormLabel component="legend">
                <b>File Type</b>
              </FormLabel>
              <RadioGroup
                aria-label="Gender"
                id="radio-row-dv"
                name="filetype"
                className={classes.group}
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
              >
                <FormControlLabel value="0" control={<Radio />} label="PDF" />

                <FormControlLabel value="1" control={<Radio />} label="CSV" />
              </RadioGroup>
            </FormControl>
            {fileType === "0" && (
              <Grid item xs={3} sm={3} md={9} key="5" style={{ padding: 5 }}>
                <FormControl
                  id="redio-input-dv"
                  component="fieldset"
                  className={classes.formControl}
                >
                  <RadioGroup
                    aria-label="Gender"
                    id="radio-row-dv"
                    name="format"
                    className={classes.group}
                    value={format}
                    onChange={(e) => {
                      setFormat(e.target.value);
                    }}
                  >
                    <FormControlLabel
                      value="0"
                      control={<Radio />}
                      label="Packing slip Details PDF"
                    />

                    <FormControlLabel
                      value="1"
                      control={<Radio />}
                      label="Estimate PDF"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            )}

            {fileType === "1" && (
              <Grid item xs={3} sm={3} md={9} key="5" style={{ padding: 5 }}>
                <FormControl
                  id="redio-input-dv"
                  component="fieldset"
                  className={classes.formControl}
                >
                  <RadioGroup
                    aria-label="Gender"
                    id="radio-row-dv"
                    name="format"
                    className={classes.group}
                    value={format}
                    onChange={(e) => {
                      setFormat(e.target.value);
                    }}
                  >
                    <FormControlLabel
                      value="0"
                      control={<Radio />}
                      label="Packing slip Details CSV"
                    />

                    <FormControlLabel
                      value="1"
                      control={<Radio />}
                      label="Estimate Excel"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            )}

            {fileType === "1" && format === "0" ? (
                <Button
                  variant="contained"
                  color="primary"
                  className="w-full mx-auto "
                  style={{
                    backgroundColor: "#415bd4",
                    border: "none",
                    color: "white",
                  }}
                onClick={downloadExcel}
                >
                  Download
                </Button>

            ) : fileType === "1" && format === "1" ? (
              <Button
                variant="contained"
                color="primary"
                className="w-full mx-auto "
                style={{
                  backgroundColor: "#4caf50",
                  border: "none",
                  color: "white",
                }}
                onClick={() => ExcelestimateData()}
              >
                Download
              </Button>
            ) : (

              <Button
                variant="contained"
                color="primary"
                className="w-full mx-auto "
                style={{
                  backgroundColor: "#4caf50",
                  border: "none",
                  color: "white",
                }}
                onClick={checkforPrint}
              >
                Download
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SalesEstimate;
