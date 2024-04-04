import { FuseAnimate } from "@fuse";
import {
  Box,
  Button,
  Grid,
  Icon,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import BreadcrumbsHelper from "app/main/BreadCrubms/BreadcrumbsHelper";
import React, { useContext, useEffect, useRef, useState } from "react";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import { useDispatch } from "react-redux";
import Loader from "app/main/Loader/Loader";
import Select, { createFilter } from "react-select";
import moment from "moment";
import Axios from "axios";
import Config from "app/fuse-configs/Config";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import * as Actions from "app/store/actions";
import AppContext from "app/AppContext";
import HelperFunc from "../../Helper/HelperFunc";
import History from "@history";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    minHeight: "250px",
  },
  table: {
    minWidth: 650,
  },
  tableCellPad: {
    padding: 7,
    // border: "1px solid #d3d3d3",
  },
  tableInput: {
    padding: 0,
  },
  tableHeadPad: {
    padding: "7px",
    // border: "1px solid #d3d3d3",
  },
  tableRowPad: {
    padding: 0,
    // border: "1px solid #d3d3d3",
  },
  modalStyle: {
    background: "#FFFFFF",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#000000",
    position: "absolute",
  },
  rightAlign: {
    textAlign: "right",
  },
}));


const AddMeltingIssue = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    NavbarSetting('Sales', dispatch)
  }, []);

  const [backEntryDays, setBackEnteyDays] = useState(0);
  const [allowedBackDate, setAllowedBackDate] = useState(false); //if true thenn display date
  const [fromDtErr, setFromDtErr] = useState("");
  const [fromDate, setFromDate] = useState(moment().format("YYYY-MM-DD"));
  const [voucherNumber, setVoucherNumber] = useState("");
  const [voucherNumErr, setVoucherNumErr] = useState("");
  const [jobworkerData, setJobworkerData] = useState([]);
  const [selectedJobWorker, setSelectedJobWorker] = useState("");
  const [selectedJobWorkerErr, setSelectedJobWorkerErr] = useState("");
  const [docFile, setDocFile] = useState("");
  const [docIds, setDocIds] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [allTypesStocksData, setAllTypesStocksData] = useState([]);
  const [totalOfAlloy, setTotalOfAlloy] = useState(0);
  const [goldvarient, setGoldvarient] = useState([]);
  const [lot, setLot] = useState([]);
  const [barcode, setBarcode] = useState([]);
  const [alloyData, setAlloyData] = useState([]);
  const [issueTo, setIssueTo] = useState("");
  const [remark, setRemark] = useState("");
  const [totalOfWeight, setTotalOfWeight] = useState("");
  const appContext = useContext(AppContext);
  const { selectedDepartment } = appContext;
  const inputRef = useRef([]);
  const [meltingIssueFilterData, setMeltingIssueFilterData] = useState([]);
  const [totalOfPurity, setTotalOfPurity] = useState(0);
  const [goldTableData, setGoldTableData] = useState([
    {
      stockCode: "",
      variantName: "",
      purity: "",
      gwt: "",
      nwt: "",
      availablewgt: "",
      weight: "",
      fine: "",
      errors: {
        weight: null,
      },
    },
  ]);

  const [lotTableData, setLotTableData] = useState([
    {
      stockCode: "",
      variantName: "",
      purity: "",
      gwt: "",
      nwt: "",
      availablewgt: "",
      weight: "",
      fine: "",
      errors: {
        weight: null,
      },
    },
  ]);

  const [barcodeTableData, setBarcodeTableData] = useState([
    {
      stockCode: "",
      variantName: "",
      purity: "",
      gwt: "",
      nwt: "",
      availablewgt: "",
      weight: "",
      fine: "",
      errors: {
        weight: null,
      },
    },
  ]);

  const [alloyTableData, setAlloyTableData] = useState([
    {
      stockCode: "",
      stockType: "",
      purity: "",
      availablewgt: "",
      weight: "",
      errors: {
        weight: null,
      },
    },
  ]);

  useEffect(() => {
    const goldTableDataFiltered = goldTableData.filter(
      (arr) => arr.stockCode !== ""
    );
    const lotTableDataFiltered = lotTableData.filter(
      (arr) => arr.stockCode !== ""
    );
    const barcodeTableDataFiltered = barcodeTableData.filter(
      (arr) => arr.stockCode !== ""
    );
    const alloyTableDataFiltered = alloyTableData.filter(
      (arr) => arr.stockCode !== ""
    );

    const lbsData = [
      ...goldTableDataFiltered,
      ...lotTableDataFiltered,
      ...barcodeTableDataFiltered,
      ...alloyTableDataFiltered,
    ];

    console.log(lbsData, "lbsData");
    let filteredData = lbsData.filter((item) => item.purity !== null);
    setMeltingIssueFilterData(lbsData);
    let totalOfWeight = parseFloat(
      HelperFunc.getTotalOfField(lbsData, "weight")
    );

    console.log(totalOfWeight, "totalOfWeight");
    setTotalOfWeight(totalOfWeight);
    let totalOfFine = parseFloat(
      HelperFunc.getTotalOfField(filteredData, "fine")
    );

    let totalOfLength = lbsData.length;
    if (totalOfLength > 0) {
      if (totalOfFine !== null && totalOfFine !== 0) {
        let totalOfCalculatedPurity = parseFloat(totalOfFine) / totalOfWeight;
        let calculatePurity = totalOfCalculatedPurity * 100;
        setTotalOfPurity(calculatePurity.toFixed(2));
      }
    }
  }, [goldTableData, lotTableData, barcodeTableData, alloyTableData]);

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    var today = moment().format("YYYY-MM-DD");

    if (name === "Date") {
      setFromDate(value);
      let dateVal = moment(value).format("YYYY-MM-DD");
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD");
      if (dateVal <= today && minDateVal < dateVal) {
        setFromDtErr("");
      } else {
        setFromDtErr("Enter Valid Date");
      }
    } else if (name === "voucherNumber") {
      // setVoucherNumber(value);
      // setVoucherNumErr("");
    }
  }

  function handleJobWorkerChange(value) {
    setSelectedJobWorker(value);
    setSelectedJobWorkerErr("");
  }

  useEffect(() => {
    getJobworkerdata();
  }, []);

  function getJobworkerdata() {
    Axios.get(Config.getCommonUrl() + "api/jobworker/listing/listing")
      .then(function (response) {
        if (response.data.success === true) {
          console.log("jobworker name", response.data.data);
          setJobworkerData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/jobworker/listing/listing" });
      });
  }
  useEffect(() => {
    if (selectedDepartment) {
      setIssueTo(selectedDepartment.label);
    }
  }, [selectedDepartment]);

  useEffect(() => {
    getVoucherNumber();
  }, []);

  function getVoucherNumber() {
    Axios.get(Config.getCommonUrl() + "api/meltingIssue/get/voucher")
      .then(function (response) {
        if (response.data.success === true) {
          let responseData = response.data.data;
          setVoucherNumber(responseData.voucherNo);
          if (response.data.data.allowed_back_date_entry === 1) {
            setAllowedBackDate(true);
            setBackEnteyDays(response.data.data.back_entry_days);
          } else {
            setAllowedBackDate(false);
            setBackEnteyDays(0);
          }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/meltingIssue/get/voucher",
        });
      });
  }

  useEffect(() => {
    // if (selectedDepartmentData) {
    getallTypesStocksData();
    // }
  }, [window.localStorage.getItem("SelectedDepartment")]);

  function getallTypesStocksData() {
    Axios.get(
      Config.getCommonUrl() +
        `api/meltingIssue/get/alltypestock?department_id=${window.localStorage.getItem(
          "SelectedDepartment"
        )}`
    )
      .then(function (response) {
        if (response.data.success === true) {
          setAllTypesStocksData(response.data.data);
          setGoldvarient(response.data.data.filter((item) => item.flag === 1));
          setLot(response.data.data.filter((item) => item.flag === 3));
          setBarcode(response.data.data.filter((item) => item.flag === 4));
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/meltingIssue/get/alltypestock?department_id=${window.localStorage.getItem(
            "SelectedDepartment"
          )}`,
        });
      });
  }

  useEffect(() => {
    getAlloyData();
  }, [window.localStorage.getItem("SelectedDepartment")]);
  // Alloy Get API
  function getAlloyData() {
    Axios.get(
      Config.getCommonUrl() +
        `api/meltingIssue/alloy/read?department_id=${window.localStorage.getItem(
          "SelectedDepartment"
        )}`
    )
      .then(function (response) {
        if (response.data.success === true) {
          console.log("Alloydata", response.data.data);
          setAlloyData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/meltingIssue/alloy/read?${window.localStorage.getItem(
            "SelectedDepartment"
          )}`,
        });
      });
  }

  function postMeltingIssueData() {
    const goldTableDataFiltered = goldTableData.filter(
      (arr) => arr.stockCode !== ""
    );
    const lotTableDataFiltered = lotTableData.filter(
      (arr) => arr.stockCode !== ""
    );
    const barcodeTableDataFiltered = barcodeTableData.filter(
      (arr) => arr.stockCode !== ""
    );
    const alloyTableDataFiltered = alloyTableData.filter(
      (arr) => arr.stockCode !== ""
    );
    if (
      partyNameValidation() &&
      handleDateBlur() &&
      parseFloat(totalOfPurity) !== 0 &&
      goldTableDataFiltered.every((data) => data.weight !== "") &&
      lotTableDataFiltered.every((data) => data.weight !== "") &&
      barcodeTableDataFiltered.every((data) => data.weight !== "") &&
      alloyTableDataFiltered.every((data) => data.weight !== "")
    ) {
      const goldTablePayload = goldTableDataFiltered.map((data) => ({
        stock_name_code_id: data.stockCode.data.stock_name_code_id,
        stock_data_id: data.stockCode.data.id,
        gross_weight: data.gwt,
        net_weight: data.nwt,
        used_weight: data.weight,
        is_lbs: 2,
        purity: data.purity,
        pcs: data.stockCode.data.pcs,
        fine_gold: parseFloat(data.fine),
      }));

      const lotTablePayload = lotTableDataFiltered.map((data) => ({
        stock_data_id: data.stockCode.data.id,
        gross_weight: data.gwt,
        net_weight: data.nwt,
        used_weight: data.weight,
        is_lbs: 0,
        purity: data.purity,
        fine_gold: parseFloat(data.fine),
      }));

      const barcodeTablePayload = barcodeTableDataFiltered.map((data) => ({
        stock_data_id: data.stockCode.data.id,
        gross_weight: data.gwt,
        net_weight: data.nwt,
        used_weight: data.weight,
        is_lbs: 1,
        purity: data.purity,
        fine_gold: parseFloat(data.fine),
      }));

      const alloyTableDataPayload = alloyTableDataFiltered.map((data) => ({
        stock_name_code_id: data.stockCode.data.stock_name_code_id,
        stock_data_id: data.stockCode.data.id,
        availablewgt: data.availablewgt,
        used_weight: data.weight,
        is_lbs: 3,
        purity: data.purity,
      }));

      const payload = {
        voucher_no: voucherNumber,
        jobworker_id: parseInt(selectedJobWorker.value),
        avg_purity: parseFloat(totalOfPurity),
        department_id: parseInt(
          window.localStorage.getItem("SelectedDepartment")
        ),
        ...(allowedBackDate && {
          purchaseCreateDate: fromDate,
        }),
        remark: remark,
        details: [
          ...goldTablePayload,
          ...lotTablePayload,
          ...barcodeTablePayload,
          ...alloyTableDataPayload,
        ],
      };
      Axios.post(Config.getCommonUrl() + "api/meltingIssue", payload)
        .then(function (response) {
          if (response.data.success === true) {
            dispatch(Actions.showMessage({ message: response.data.message }));
            setGoldTableData([
              {
                stockCode: "",
                variantName: "",
                purity: "",
                gwt: "",
                nwt: "",
                availablewgt: "",
                weight: "",
                fine: "",
                errors: {
                  weight: null,
                },
              },
            ]);
            setLotTableData([
              {
                stockCode: "",
                variantName: "",
                purity: "",
                gwt: "",
                nwt: "",
                availablewgt: "",
                weight: "",
                fine: "",
                errors: {
                  weight: null,
                },
              },
            ]);
            setBarcodeTableData([
              {
                stockCode: "",
                variantName: "",
                purity: "",
                gwt: "",
                nwt: "",
                availablewgt: "",
                weight: "",
                fine: "",
                errors: {
                  weight: null,
                },
              },
            ]);

            setAlloyTableData([
              {
                stockCode: "",
                stockType: "",
                purity: "",
                availablewgt: "",
                weight: "",
                errors: {
                  weight: null,
                },
              },
            ]);
            setTotalOfPurity(0);
            setRemark("");
          } else {
            dispatch(Actions.showMessage({ message: response.data.message }));
          }
        })
        .catch((error) => {
          console.log(error);
          handleError(error, dispatch, {
            api: "api/meltingIssue",
            body: payload,
          });
        });
    }
  }

  function handleGoldOptionSelect(option, i) {
    let variantGoldData = [...goldTableData];
    variantGoldData[i].stockCode = option;
    variantGoldData[i].variantName = option.data.stockType;
    variantGoldData[i].purity = option.data.purity;
    variantGoldData[i].gwt = option.data.gross_weight;
    variantGoldData[i].nwt = option.data.net_weight;
    variantGoldData[i].availablewgt = option.data.available_weight;
    variantGoldData[i].weight = "";
    variantGoldData[i].fine = "";
    setGoldTableData(variantGoldData);

    if (!goldTableData[i + 1]) {
      setGoldTableData([
        ...variantGoldData,
        {
          stockCode: "",
          variantName: "",
          purity: "",
          gwt: "",
          nwt: "",
          availablewgt: "",
          weight: "",
          fine: "",
          errors: {
            weight: null,
          },
        },
      ]);
    }
    // }
  }

  function handleLotOptionSelect(option, i) {
    // setSelectedLot(option);
    const lotData = [...lotTableData];
    lotData[i].stockCode = option;
    lotData[i].variantName = option.data.stockType;
    lotData[i].purity = option.data.purity;
    lotData[i].gwt = option.data.gross_weight;
    lotData[i].nwt = option.data.net_weight;
    lotData[i].availablewgt = option.data.net_weight;
    lotData[i].weight = "";
    lotData[i].fine = "";
    setLotTableData(lotData);

    if (lotTableData.length - i === 1) {
      setLotTableData([
        ...lotData,
        {
          stockCode: "",
          variantName: "",
          purity: "",
          gwt: "",
          nwt: "",
          availablewgt: "",
          weight: "",
          fine: "",
          errors: {
            weight: null,
          },
        },
      ]);
    }
  }

  function handleBarcodeOptionSelect(option, i) {
    // setSelectedBarcode(option);
    const BarcodeData = [...barcodeTableData];
    BarcodeData[i].stockCode = option;
    BarcodeData[i].variantName = option.data.stockType;
    BarcodeData[i].purity = option.data.purity;
    BarcodeData[i].gwt = option.data.gross_weight;
    BarcodeData[i].nwt = option.data.net_weight;
    BarcodeData[i].availablewgt = option.data.net_weight;
    BarcodeData[i].weight = "";
    BarcodeData[i].fine = "";
    setBarcodeTableData(BarcodeData);

    if (barcodeTableData.length - i === 1) {
      setBarcodeTableData([
        ...BarcodeData,
        {
          stockCode: "",
          variantName: "",
          purity: "",
          gwt: "",
          nwt: "",
          availablewgt: "",
          weight: "",
          fine: "",
          errors: {
            weight: null,
          },
        },
      ]);
    }
  }

  function handleAlloyOptionSelect(option, i) {
    // setSelectedBarcode(option);
    const AlloyData = [...alloyTableData];
    AlloyData[i].stockCode = option;
    AlloyData[i].stockType = option.data.stockType;
    AlloyData[i].purity = option.data.purity;
    AlloyData[i].availablewgt = option.data.available_weight;
    AlloyData[i].weight = "";
    setAlloyTableData(AlloyData);

    if (alloyTableData.length - i === 1) {
      setAlloyTableData([
        ...AlloyData,
        {
          stockCode: "",
          stockType: "",
          purity: "",
          availablewgt: "",
          weight: "",
          errors: {
            weight: null,
          },
        },
      ]);
    }
  }

  function deleteGoldVarientHandler(index) {
    const updatedGoldTableData = [...goldTableData];
    updatedGoldTableData.splice(index, 1);
    setGoldTableData(updatedGoldTableData);

    console.log(updatedGoldTableData, "updated gold table data");
  }
  function deleteLotHandler(index) {
    const updatedLotTableData = [...lotTableData];
    updatedLotTableData.splice(index, 1);
    setLotTableData(updatedLotTableData);
  }
  function deleteBarcodeHandler(index) {
    const updatedBarcodeTableData = [...barcodeTableData];
    updatedBarcodeTableData.splice(index, 1);
    setBarcodeTableData(updatedBarcodeTableData);
  }
  function deleteAlloyHandler(index) {
    const updatedBarcodeTableData = [...alloyTableData];
    updatedBarcodeTableData.splice(index, 1);
    setAlloyTableData(updatedBarcodeTableData);
  }

  useEffect(() => {
    let totalAlloy = parseFloat(
      HelperFunc.getTotalOfField(alloyTableData, "weight")
    );
    setTotalOfAlloy(totalAlloy);
  }, [alloyTableData]);

  function partyNameValidation() {
    if (selectedJobWorker === "") {
      setSelectedJobWorkerErr("Please Select Job Worker");
      return false;
    }
    return true;
  }

  function handleChangeGold(i, e) {
    const updatedGoldData = [...goldTableData];
    updatedGoldData[i][e.target.name] = e.target.value;
    let availablewgt = parseFloat(updatedGoldData[i].availablewgt);

    let name = e.target.name;
    let value = e.target.value;

    if (name === "weight") {
      updatedGoldData[i].weight = value;
      updatedGoldData[i].errors.weight = null;
      if (
        updatedGoldData[i].weight !== "" &&
        updatedGoldData[i].purity !== ""
      ) {
        updatedGoldData[i].fine = parseFloat(
          (parseFloat(updatedGoldData[i].weight) *
            parseFloat(updatedGoldData[i].purity)) /
          100
        ).toFixed(3);
      }

      if (value == 0) {
        updatedGoldData[i].errors.weight = "Enter Weight";
      } else if (value > availablewgt) {
        updatedGoldData[i].errors.weight = "Enter valid Weight";
      }
      if (value === "" || value === "0") {
        updatedGoldData[i].fine = "";
      }
    }
    setGoldTableData(updatedGoldData);
    console.log(updatedGoldData);
  }

  function handleChangeLot(i, e) {
    const updatedLotData = [...lotTableData];
    updatedLotData[i][e.target.name] = e.target.value;
    let availablewgt = parseFloat(updatedLotData[i].availablewgt);

    let name = e.target.name;
    let value = e.target.value;

    if (name === "weight") {
      updatedLotData[i].weight = value;
      updatedLotData[i].errors.weight = null;
      if (updatedLotData[i].weight !== "" && updatedLotData[i].purity !== "") {
        updatedLotData[i].fine = parseFloat(
          (parseFloat(updatedLotData[i].weight) *
            parseFloat(updatedLotData[i].purity)) /
         100
        ).toFixed(3);
      }
      if (value == 0) {
        updatedLotData[i].errors.weight = "Enter Weight";
      } else if (value > availablewgt) {
        updatedLotData[i].errors.weight = "Enter valid Weight";
      }
      if (value === "" || value === "0") {
        updatedLotData[i].fine = "";
      }
    }
    setLotTableData(updatedLotData);
  }

  function handleChangeBarcode(i, e) {
    const updatedBarcodeData = [...barcodeTableData];
    updatedBarcodeData[i][e.target.name] = e.target.value;
    let availablewgt = parseFloat(updatedBarcodeData[i].availablewgt);

    let name = e.target.name;
    let value = e.target.value;

    if (name === "weight") {
      updatedBarcodeData[i].weight = value;
      updatedBarcodeData[i].errors.weight = null;
      if (
        updatedBarcodeData[i].weight !== "" &&
        updatedBarcodeData[i].purity !== ""
      ) {
        updatedBarcodeData[i].fine = parseFloat(
          (parseFloat(updatedBarcodeData[i].weight) *
            parseFloat(updatedBarcodeData[i].purity)) /
         100
        ).toFixed(3);
      }
      if (value == 0) {
        updatedBarcodeData[i].errors.weight = "Enter Weight";
      } else if (value > availablewgt) {
        updatedBarcodeData[i].errors.weight = "Enter valid Weight";
      }
      if (value === "" || value === "0") {
        updatedBarcodeData[i].fine = "";
      }
    }
    setBarcodeTableData(updatedBarcodeData);
  }
  function handleChangeAlloy(i, e) {
    const updatedAlloyData = [...alloyTableData];
    updatedAlloyData[i][e.target.name] = e.target.value;
    let availablewgt = parseFloat(updatedAlloyData[i].availablewgt);

    let name = e.target.name;
    let value = e.target.value;
    console.log(e.target.value);

    if (name === "useweight") {
      updatedAlloyData[i].weight = value;
      updatedAlloyData[i].errors.weight = null;
      if (value == 0) {
        updatedAlloyData[i].errors.weight = "Enter Weight";
      } else if (value > availablewgt) {
        updatedAlloyData[i].errors.weight = "Enter valid Weight";
      }
    }
    setAlloyTableData(updatedAlloyData);
  }

  function handleSubmit() {
    let hasErrors = false;

    const updatedMeltingIssueFilterData = meltingIssueFilterData.map((data) => {
      // console.log(data);
      let availablewgt = parseFloat(data.availablewgt);
      if (data.weight === "" || data.weight === "0") {
        data.errors = {
          ...data.errors,
          weight: "Enter Weight",
        };
        hasErrors = true;
      } else if (data.weight > availablewgt) {
        data.errors = {
          ...data.errors,
          weight: "Enter valid Weight",
        };
        hasErrors = true;
      } else if (data.weight === "" || data.weight === "0") {
        data.errors = {
          ...data.errors,
          weight: "Enter Weight",
        };
        hasErrors = true;
      } else if (data.weight > availablewgt) {
        data.errors = {
          ...data.errors,
          weight: "Enter valid Weight",
        };
        hasErrors = true;
      } else {
        data.errors = {
          ...data.errors,
          weight: null,
        };
      }
      return data;
    });

    setMeltingIssueFilterData(updatedMeltingIssueFilterData);

    if (!hasErrors) {
      postMeltingIssueData();
    }
  }
  const isDateValid = (inputDate) => {
    const currentDate = moment();
    const minDate = moment()
      .subtract(backEntryDays, "day")
      .format("YYYY-MM-DD");
    const selectedDate = moment(inputDate, "YYYY-MM-DD");

    if (selectedDate.isBefore(minDate) || selectedDate.isAfter(currentDate)) {
      return false;
    }
    return true;
  };

  const handleDateBlur = () => {
    if (!isDateValid(fromDate)) {
      setFromDtErr(
        `Invalid date. Date should be within the last ${backEntryDays} days.`
      );
      return false;
    } else {
      setFromDtErr("");
      return true;
    }
  };


  return (
    <div>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container">
          <div className="flex flex-1 flex-col min-w-0" style={{ marginTop: "30px" }}>
            <Grid
              container
              alignItems="center"
              style={{ paddingInline: "30px" }}
            >
              <Grid item xs={9} sm={9} md={9} key="1">
                <FuseAnimate delay={300}>
                  <Typography className="text-18 font-700">
                    Add Melting Issue
                  </Typography>
                </FuseAnimate>
              </Grid>
              <Grid
                item
                xs={3}
                sm={3}
                md={3}
                key="2"
                style={{ textAlign: "right" }}
              >
                <Button
                  variant="contained"
                  className={classes.button}
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
              </Grid>
            </Grid>

            {loading && <Loader />}
            <div className="main-div-alll" style={{ marginTop: "20px" }}>
            <Box>
              <Grid container spacing={2} alignItems="flex-end">
              {allowedBackDate && (

                <Grid item xs={12} sm={6} md={3} lg={2}>
                  <p>Date</p>
                  <TextField
                    // label="Date"
                    name="Date"
                    value={fromDate}
                    error={fromDtErr.length > 0 ? true : false}
                    helperText={fromDtErr}
                    type="date"
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                    format="yyyy/MM/dd"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      min: moment()
                        .subtract(backEntryDays, "day")
                        .format("YYYY-MM-DD"),
                      max: moment().format("YYYY-MM-DD"),
                    }}
                    onBlur={handleDateBlur}

                  />
                </Grid>
                    )}

                <Grid item xs={12} sm={6} md={3} lg={2}>
                  <p>Voucher Number</p>
                  <TextField
                    // label="Voucher Number"
                    autoFocus
                    name="voucherNumber"
                    value={voucherNumber}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                    disabled
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  lg={2}
                  style={{ position: "relative" }}
                >
                  <p>Jobworker Name</p>
                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    options={jobworkerData.map((suggestion) => ({
                      value: suggestion.id,
                      label: suggestion.name,
                    }))}
                    value={selectedJobWorker}
                    onChange={handleJobWorkerChange}
                    placeholder="Jobworker Name"
                    // isDisabled={isView}
                    blurInputOnSelect
                  />
                  <span
                    style={{ color: "red", position: "absolute", bottom: "-10px" }}
                  >
                    {selectedJobWorkerErr.length > 0 ? selectedJobWorkerErr : ""}
                  </span>
                </Grid>

                <Grid item xs={12} sm={6} md={3} lg={2}>
                  <p>Upload Document</p>
                  <TextField
                    // label="Upload Document"
                    type="file"
                    inputProps={{
                      multiple: true,
                    }}
                    onChange={(e) => setDocFile(e.target.files)}
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                {/* <Grid
            item
            xs={12}
            sm={6}
            md={3}
            lg={2}
            style={{ position: "relative" }}
          >
            <Select
              filterOption={createFilter({ ignoreAccents: false })}
              options={departmentData.map((item) => ({
                value: item.id,
                label: item.name,
                key: item.name,
              }))}
              name="departmentName"
              classes={classes}
              // styles={selectStyles}
              // value={selectedDepartmentData}
              onChange={handleInputChangeDepartment}
              placeholder="Department Name"
              fullWidth
              variant="outlined"
              style={{ height: "37.6px", background: "#ffffff" }}
            />
            <span
              style={{
                color: "red",
                position: "absolute",
                bottom: "-6px",
                fontSize: "9px",
              }}
            >
              {depatmentDataErr.length > 0 ? depatmentDataErr : ""}
            </span>
          </Grid> */}
                <Grid
                  item
                  xs={12}
                  md={12}
                  lg={12}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    textAlign: "right",
                    position: "relative",
                  }}
                >
                  <Grid container>
                    <Grid item xs={12}>
                      <h3
                        style={{
                          fontWeight: "700",
                        }}
                      >
                        Calculated Purity
                      </h3>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        name="calculated purity"
                        variant="outlined"
                        disabled
                        value={totalOfPurity}
                        InputProps={{
                          classes: {
                            input: classes.rightAlign,
                          },
                        }}
                        style={{ maxWidth: "150px", marginLeft: "auto" }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Paper className={classes.tabroot} style={{ marginTop: "20px" }}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell width="50px" align="center"></TableCell>
                      <TableCell className={classes.tableCellPad}>
                        Variant Code
                      </TableCell>
                      <TableCell className={classes.tableCellPad}>
                        Variant Name
                      </TableCell>
                      <TableCell className={classes.tableCellPad}>Purity</TableCell>
                      <TableCell className={classes.tableCellPad}>GWT</TableCell>
                      <TableCell className={classes.tableCellPad}>NWT</TableCell>
                      <TableCell className={classes.tableCellPad}>
                        Available Wgt
                      </TableCell>
                      <TableCell className={classes.tableCellPad}>Weight</TableCell>
                      <TableCell className={classes.tableCellPad}>Fine</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {goldTableData.map((data, i) => (
                      <TableRow key={i}>
                        <TableCell className={classes.tableCellPad} align="center">
                          <IconButton
                            style={{ padding: "0" }}
                            onClick={(ev) => {
                              ev.preventDefault();
                              if (goldTableData.length - 1 !== i) {
                                deleteGoldVarientHandler(i);
                              }
                            }}
                          >
                            <Icon className="" style={{ color: "red" }}>
                              delete
                            </Icon>
                          </IconButton>
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <Select
                            filterOption={createFilter({ ignoreAccents: false })}
                            placeholder="Stock code / Gold variants"
                            options={goldvarient
                              .filter((array) =>
                                goldTableData.every(
                                  (item) =>
                                    !(
                                      item.stockCode?.value ===
                                      array.stock_name_code &&
                                      item.stockCode.label === array.stock_name_code
                                    )
                                )
                              )
                              .map((data) => ({
                                value: data.stock_name_code,
                                label: data.stock_name_code,
                                data: data,
                              }))}
                            value={data.stockCode}
                            onChange={(e) => handleGoldOptionSelect(e, i)}
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="variantName"
                            disabled
                            variant="outlined"
                            value={data.variantName}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="purity"
                            disabled
                            variant="outlined"
                            fullWidth
                            value={data.purity}
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="gwt"
                            disabled
                            variant="outlined"
                            fullWidth
                            value={data.gwt}
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="nwt"
                            disabled
                            variant="outlined"
                            fullWidth
                            value={data.nwt}
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="availablewgt"
                            disabled
                            variant="outlined"
                            fullWidth
                            value={data.availablewgt}
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            variant="outlined"
                            fullWidth
                            name="weight"
                            value={data.weight}
                            onChange={(e) => {
                              handleChangeGold(i, e);
                            }}
                            error={
                              data.errors !== undefined
                                ? data.errors.weight
                                  ? true
                                  : false
                                : false
                            }
                            helperText={
                              data.errors !== undefined ? data.errors.weight : ""
                            }
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="fine"
                            disabled
                            variant="outlined"
                            fullWidth
                            value={data.fine}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
              <Paper className={classes.tabroot} style={{ marginTop: "20px" }}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell width="50px" align="center"></TableCell>
                      <TableCell className={classes.tableCellPad}>Lot</TableCell>
                      <TableCell className={classes.tableCellPad}>
                        Variant Name
                      </TableCell>
                      <TableCell className={classes.tableCellPad}>Purity</TableCell>
                      <TableCell className={classes.tableCellPad}>GWT</TableCell>
                      <TableCell className={classes.tableCellPad}>NWT</TableCell>
                      <TableCell className={classes.tableCellPad}>
                        Available Wgt
                      </TableCell>
                      <TableCell className={classes.tableCellPad}>Weight</TableCell>
                      <TableCell className={classes.tableCellPad}>Fine</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {lotTableData.map((data, i) => (
                      <TableRow key={i}>
                        <TableCell className={classes.tableCellPad} align="center" style={{textAlign:"center"}}>
                          <IconButton
                            style={{ padding: "0" }}
                            onClick={(ev) => {
                              ev.preventDefault();
                              if (lotTableData.length - 1 !== i) {
                                deleteLotHandler(i);
                              }
                            }}
                          >
                            <Icon className="" style={{ color: "red" }}>
                              delete
                            </Icon>
                          </IconButton>
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <Select
                            filterOption={createFilter({ ignoreAccents: false })}
                            placeholder="Lot"
                            options={lot
                              .filter((array) =>
                                lotTableData.every(
                                  (item) =>
                                    !(
                                      item.stockCode?.value ===
                                      array.stock_name_code &&
                                      item.stockCode.label === array.stock_name_code
                                    )
                                )
                              )
                              .map((data) => ({
                                value: data.stock_name_code,
                                label: data.stock_name_code,
                                data: data,
                              }))}
                            value={data.stockCode}
                            onChange={(e) => handleLotOptionSelect(e, i)}
                          />
                        </TableCell>

                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="variantName"
                            disabled
                            variant="outlined"
                            value={data.variantName}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="purity"
                            disabled
                            variant="outlined"
                            fullWidth
                            value={data.purity}
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="gwt"
                            disabled
                            variant="outlined"
                            fullWidth
                            value={data.gwt}
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="nwt"
                            disabled
                            variant="outlined"
                            fullWidth
                            value={data.nwt}
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="availablewgt"
                            disabled
                            variant="outlined"
                            fullWidth
                            value={data.availablewgt}
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            variant="outlined"
                            name="weight"
                            fullWidth
                            // type={isView ? "text" : "number"}
                            value={data.weight || ""}
                            onChange={(e) => {
                              handleChangeLot(i, e);
                            }}
                            // inputRef={(el) => (inputRef.current[i] = el)}
                            error={
                              data.errors !== undefined
                                ? data.errors.weight
                                  ? true
                                  : false
                                : false
                            }
                            helperText={
                              data.errors !== undefined ? data.errors.weight : ""
                            }
                          // disabled={isView}
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="fine"
                            disabled
                            variant="outlined"
                            fullWidth
                            value={data.fine}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>

              <Paper className={classes.tabroot} style={{ marginTop: "20px" }}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell width="50px" align="center"></TableCell>
                      <TableCell className={classes.tableCellPad}>Barcode</TableCell>
                      <TableCell className={classes.tableCellPad}>
                        Variant Name
                      </TableCell>
                      <TableCell className={classes.tableCellPad}>Purity</TableCell>
                      <TableCell className={classes.tableCellPad}>GWT</TableCell>
                      <TableCell className={classes.tableCellPad}>NWT</TableCell>
                      <TableCell className={classes.tableCellPad}>
                        Available Wgt
                      </TableCell>
                      <TableCell className={classes.tableCellPad}>Weight</TableCell>
                      <TableCell className={classes.tableCellPad}>Fine</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {barcodeTableData.map((data, i) => (
                      <TableRow key={i}>
                        <TableCell className={classes.tableCellPad} style={{textAlign:"center"}} align="center">
                          <IconButton
                            style={{ padding: "0" }}
                            onClick={(ev) => {
                              ev.preventDefault();
                              if (barcodeTableData.length - 1 !== i) {
                                deleteBarcodeHandler(i);
                              }
                            }}
                          >
                            <Icon className="" style={{ color: "red" }}>
                              delete
                            </Icon>
                          </IconButton>
                        </TableCell>

                        <TableCell className={classes.tableInput}>
                          <Select
                            filterOption={createFilter({ ignoreAccents: false })}
                            placeholder="Barcode"
                            options={barcode
                              .filter((array) =>
                                barcodeTableData.every(
                                  (item) =>
                                    !(
                                      item.stockCode?.value ===
                                      array.stock_name_code &&
                                      item.stockCode.label === array.stock_name_code
                                    )
                                )
                              )
                              .map((data) => ({
                                value: data.stock_name_code,
                                label: data.stock_name_code,
                                data: data,
                              }))}
                            value={data.stockCode}
                            onChange={(e) => handleBarcodeOptionSelect(e, i)}
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="variantName"
                            disabled
                            variant="outlined"
                            value={data.variantName}
                            fullWidth
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="purity"
                            disabled
                            variant="outlined"
                            fullWidth
                            value={data.purity}
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="gwt"
                            disabled
                            variant="outlined"
                            fullWidth
                            value={data.gwt}
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="nwt"
                            disabled
                            variant="outlined"
                            fullWidth
                            value={data.nwt}
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="availablewgt"
                            disabled
                            variant="outlined"
                            fullWidth
                            value={data.availablewgt}
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            variant="outlined"
                            fullWidth
                            value={data.weight || ""}
                            name="weight"
                            onChange={(e) => {
                              handleChangeBarcode(i, e);
                            }}
                            error={
                              data.errors !== undefined
                                ? data.errors.weight
                                  ? true
                                  : false
                                : false
                            }
                            helperText={
                              data.errors !== undefined ? data.errors.weight : ""
                            }
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="fine"
                            disabled
                            variant="outlined"
                            fullWidth
                            value={data.fine}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>

              <h3 style={{ marginTop: "20px", marginBottom: "10px" }}>
                Other Material(Alloy)
              </h3>

              <Paper className={classes.tabroot} style={{ minHeight: "auto" }}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell width="50px" align="center"></TableCell>
                      <TableCell className={classes.tableHeadPad}>Varient</TableCell>
                      <TableCell className={classes.tableHeadPad}>Name</TableCell>
                      <TableCell className={classes.tableHeadPad}>Purity</TableCell>
                      <TableCell className={classes.tableHeadPad}>
                        Available wgt
                      </TableCell>
                      <TableCell className={classes.tableHeadPad}>
                        Use Weight
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {alloyTableData.map((data, i) => (
                      <TableRow key={i}>
                        <TableCell className={classes.tableCellPad} align="center" style={{textAlign:"center"}}>
                          <IconButton
                            style={{ padding: "0" }}
                            onClick={(ev) => {
                              ev.preventDefault();
                              if (alloyTableData.length - 1 !== i) {
                                deleteAlloyHandler(i);
                              }
                            }}
                          >
                            <Icon className="" style={{ color: "red" }}>
                              delete
                            </Icon>
                          </IconButton>
                        </TableCell>

                        <TableCell className={classes.tableRowPad}>
                          <Select
                            filterOption={createFilter({ ignoreAccents: false })}
                            placeholder="Alloy"
                            options={alloyData
                              .filter((array) =>
                                alloyTableData.every(
                                  (item) =>
                                    !(
                                      item.stockCode?.value ===
                                      array.stock_name_code &&
                                      item.stockCode.label === array.stock_name_code
                                    )
                                )
                              )
                              .map((data) => ({
                                value: data.stock_name_code,
                                label: data.stock_name_code,
                                data: data,
                              }))}
                            value={data.stockCode}
                            onChange={(e) => handleAlloyOptionSelect(e, i)}
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="stockname"
                            disabled
                            variant="outlined"
                            fullWidth
                            value={data.stockType}
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="purity"
                            disabled
                            variant="outlined"
                            fullWidth
                            value={data.purity || ""}
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="availablewgt"
                            disabled
                            variant="outlined"
                            fullWidth
                            value={data.availablewgt}
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="useweight"
                            variant="outlined"
                            value={data.weight || ""}
                            onChange={(e) => {
                              handleChangeAlloy(i, e);
                            }}
                            error={
                              data.errors !== undefined
                                ? data.errors.weight
                                  ? true
                                  : false
                                : false
                            }
                            helperText={
                              data.errors !== undefined ? data.errors.weight : ""
                            }
                            fullWidth
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow style={{backgroundColor: "#EBEEFB"}}>
                      <TableCell
                        colSpan={3}
                        className={classes.tableHeadPad}
                        style={{ fontWeight: 700, fontSize: 16 }}
                      >
                        Total Weight :
                      </TableCell>
                      <TableCell
                        colSpan={3}
                        className={classes.tableHeadPad}
                        style={{ textAlign: "right" }}
                      >
                        <TextField
                          variant="outlined"
                          style={{ maxWidth: "200px" }}
                          InputProps={{
                            classes: {
                              input: classes.rightAlign,
                            },
                          }}
                          value={totalOfWeight}
                          disabled
                        />
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </Paper>
              <Grid container style={{ marginTop: "20px" }} spacing={2}>
                <Grid item xs={12} sm={4} lg={4}>
                  <p>Issue To</p>
                  <TextField
                    name="issueto"
                    disabled
                    variant="outlined"
                    fullWidth
                    // label="Issue To"
                    value={issueTo}
                  />
                </Grid>
                <Grid item xs={12} sm={4} lg={4}>
                  <p>Remarks</p>
                  <TextField
                    name="remarks"
                    variant="outlined"
                    fullWidth
                    placeholder="Remarks"
                    onChange={(e) => setRemark(e.target.value)}
                    value={remark}
                  />
                </Grid>
                <Grid item xs={12} sm={4} lg={4}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      backgroundColor: "#415bd4",
                      border: "none",
                      color: "white",
                      marginLeft: "auto",
                      display: "block",
                    }}
                    onClick={() => handleSubmit()}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Box>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default AddMeltingIssue;
