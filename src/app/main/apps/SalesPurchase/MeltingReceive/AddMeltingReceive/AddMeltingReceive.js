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
import Select, { createFilter } from "react-select";
import BreadcrumbsHelper from "app/main/BreadCrubms/BreadcrumbsHelper";
import React, { useEffect, useState } from "react";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import { useDispatch } from "react-redux";
import Loader from "app/main/Loader/Loader";
import moment from "moment";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import HelperFunc from "../../Helper/HelperFunc";
import History from "@history";
import clsx from 'clsx';
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    // height: "100%",
    minHeight: "250px",
  },
  table: {
    // tableLayout: "auto",
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
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "gray",
    color: "white",
    background:"gray"
  },
}));


const AddMeltingReceive = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    NavbarSetting("Sales", dispatch);
  }, []);

  const [fromDtErr, setFromDtErr] = useState("");
  const [fromDate, setFromDate] = useState(
    moment().subtract(1, "months").format("YYYY-MM-DD")
  );

  const [voucherNumber, setVoucherNumber] = useState("");
  const [jobworkerName, setJobworkerName] = useState("");
  const [jobworkerId, setJobworkerId] = useState("");

  const [docFile, setDocFile] = useState("");
  const [docIds, setDocIds] = useState([]);

  const [meltingIssuedVoucher, setMeltingIssuedVoucher] = useState([]);
  const [selectedIssuedVoucher, setSelectedIssuedVoucher] = useState("");
  const [metalIssueDetailData, setMetalIssueDetailData] = useState([]);

  const [goldvarient, setGoldvarient] = useState([]);
  const [lot, setLot] = useState([]);
  const [barcode, setBarcode] = useState([]);
  const [alloy, setAlloy] = useState([]);

  const [lossInFine, setLossInFine] = useState("");
  const [lossInFinePer, setLossInFinePer] = useState("");

  const [allTypesMetalData, setAllTypesMetalData] = useState([]);
  const [meltingIssueReturnData, setMeltingIssueReturnData] = useState([]);

  const [totalWeight, setTotalWeight] = useState(0);

  const [allTypesMetalTableData, setAllTypesMetalTableData] = useState([
    {
      stockCode: "",
      stockType: "",
      weight: "",
      purity: "",
      fine: "",
      errors: {
        weight: null,
      },
    },
  ]);
  const [meltingIssueReturnTableData, setMeltingIssueReturnTableData] =
    useState([
      {
        stockCode: "",
        desc: "",
        addInPcs: "",
        addInWgt: "",
        rejPcs: "",
        rejWgt: "",
        errors: {
          addInPcs: null,
          addInWgt: null,
          rejPcs: null,
          rejWgt: null,
        },
      },
    ]);

  useEffect(() => {
    const MetalTableDataFiltered = allTypesMetalTableData.filter(
      (arr) => arr.stockCode !== ""
    );
    const issueFine = parseFloat(
      HelperFunc.getTotalOfField(metalIssueDetailData, "fine_gold")
    );
    console.log("allTypesMetalData", metalIssueDetailData);
    console.log("issueFine", issueFine);
    let totalOfMetalFine = parseFloat(
      HelperFunc.getTotalOfField(MetalTableDataFiltered, "fine")
    );
    if (totalOfMetalFine && issueFine > 0) {
      console.log("totalOfMetalFine", totalOfMetalFine);
      let lossInFine = issueFine - totalOfMetalFine;
      setLossInFine(lossInFine.toFixed(3));
      let lossInFinePer = (lossInFine / issueFine) * 100;
      setLossInFinePer(parseFloat(lossInFinePer).toFixed(2));
      console.log("lossInFine", lossInFine);
      console.log("lossInFinePer", lossInFinePer);
    }

    // let totalOfIssueFine =
  }, [allTypesMetalTableData]);

  useEffect(() => {
    const MetalTableDataFiltered = allTypesMetalTableData.filter(
      (arr) => arr.stockCode !== ""
    );
    let totalWeight = parseFloat(
      HelperFunc.getTotalOfField(MetalTableDataFiltered, "weight")
    );
    setTotalWeight(totalWeight);
  }, [allTypesMetalTableData]);

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    var today = moment().format("DD-MM-YYYY");

    if (name === "Date") {
      setFromDate(value);
      let dateVal = moment(value).format("DD-MM-YYYY");
      let minDateVal = moment(new Date("01/01/1900")).format("DD-MM-YYYY");
      // if (dateVal <= today && minDateVal < dateVal) {
      //   setFromDtErr("");
      // } else {
      //   setFromDtErr("Enter Valid Date");
      // }
    } else if (name === "voucherNumber") {
      // setVoucherNumber(value);
      // setVoucherNumErr("");
    }
  }

  function handleInputChangeIssuedVoucher(value) {
    setSelectedIssuedVoucher(value.value);
      }

  useEffect(() => {
    getVoucherNumber();
  }, []);

  function getVoucherNumber() {
    axios.get(Config.getCommonUrl() + "api/meltingIssueReturn/get/voucher")
      .then(function (response) {
        if (response.data.success === true) {
          let responseData = response.data.data;
          console.log(response.data.data);
          setVoucherNumber(responseData.voucherNo);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/meltingIssueReturn/get/voucherr",
        });
      });
  }

  useEffect(() => {
    getMeltingIssuedVoucherData();
  }, [window.localStorage.getItem("SelectedDepartment")]);
  // Melting Issue Details Get API
  function getMeltingIssuedVoucherData() {
    axios.get(
      Config.getCommonUrl() +
        `api/meltingIssueReturn/Voucher/MeltingIssue?department_id=${window.localStorage.getItem(
          "SelectedDepartment"
        )}`
    )
      .then(function (response) {
        if (response.data.success === true) {
          if (response.data.data === undefined) {
            setMeltingIssuedVoucher([]);
          } else {
            setMeltingIssuedVoucher(response.data.data);
                      }
          console.log(response);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/meltingIssueReturn/Voucher/MeltingIssue?department_id=${window.localStorage.getItem(
            "SelectedDepartment"
          )}`,
        });
      });
  }

  useEffect(() => {
    if (selectedIssuedVoucher) {
      getMetalIssueDetailData();
    }
  }, [selectedIssuedVoucher]);

  //
  function getMetalIssueDetailData() {
    axios.get(
      Config.getCommonUrl() + `api/meltingIssue/${selectedIssuedVoucher}`
    )
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          console.log("MetalIssueDetailData", response.data.data.meltingIssues);
          setMetalIssueDetailData(response.data.data.meltingIssues);
          setJobworkerName(response.data.data.jobworker?.name)
          setJobworkerId(response.data.data.jobworker?.id)
          console.log(
            "setGoldvarient",
            response.data.data.meltingIssues.filter((item) => item.is_lbs === 2)
          );
          console.log(
            "setLot",
            response.data.data.meltingIssues.filter((item) => item.is_lbs === 0)
          );
          console.log(
            "setBarcode",
            response.data.data.meltingIssues.filter((item) => item.is_lbs === 1)
          );
          console.log(
            "setAlloy",
            response.data.data.meltingIssues.filter((item) => item.is_lbs === 3)
          );
          setGoldvarient(
            response.data.data.meltingIssues.filter((item) => item.is_lbs === 2)
          );
          setLot(
            response.data.data.meltingIssues.filter((item) => item.is_lbs === 0)
          );
          setBarcode(
            response.data.data.meltingIssues.filter((item) => item.is_lbs === 1)
          );
          setAlloy(
            response.data.data.meltingIssues.filter((item) => item.is_lbs === 3)
          );
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/meltingIssue/${selectedIssuedVoucher}`,
        });
      });
  }

  useEffect(() => {
    // if (selectedDepartmentData) {
    getallTypesMetalData();
    // }
  }, []);

  function getallTypesMetalData() {
    axios.get(Config.getCommonUrl() + `api/stockname/metal`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log("allTypesMetalData", response.data.data);
          setAllTypesMetalData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/stockname/metal`,
        });
      });
  }

  function postMeltingReceiveData() {
    const allTypesMetalFilterTableData = allTypesMetalTableData.filter(
      (arr) => arr.stockCode !== ""
    );
    const MetalReceiveFilterTableData = meltingIssueReturnTableData.filter(
      (arr) => arr.stockCode !== ""
    );

    const allTypesMetalFilterdedTableData = allTypesMetalFilterTableData.map(
      (data) => ({
        stock_name_code_id: data.stockCode.data.stock_name_code.id,
        stock_name: data.stockType,
        weight: parseFloat(data.weight),
        purity: parseFloat(data.purity),
        finegold: parseFloat(data.fine),
      })
    );
    const MetalReceiveTableData = MetalReceiveFilterTableData.map((data) => ({
      is_other_material: 1,
      stock_name_code_id: data.stockCode.data.id,
      weight: parseFloat(data.addInWgt),
      pcs: parseFloat(data.addInPcs),
    }));
    const payload = {
      department_id: parseInt(
        window.localStorage.getItem("SelectedDepartment")
      ),
      issue_voucher_id: selectedIssuedVoucher,
      voucher_no: voucherNumber,
      jobworker_id: jobworkerId ? jobworkerId : 1,
      return_date: fromDate,
      loss_fine_percentage: lossInFinePer,
      returnDetails: [
        ...allTypesMetalFilterdedTableData,
        ...MetalReceiveTableData,
      ],
    };
    axios.post(Config.getCommonUrl() + "api/meltingIssueReturn", payload)
      .then(function (response) {
        if (response.data.success === true) {
          dispatch(Actions.showMessage({ message: response.data.message }));
            History.goBack();
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        console.log(error);
        handleError(error, dispatch, {
          api: "api/meltingIssueReturn",
          body: payload,
        });
      });
  }

  useEffect(() => {
    meltingIssueReceiveData();
  }, []);

  function meltingIssueReceiveData() {
    axios.get(Config.getCommonUrl() + `api/meltingIssueReturn/stone/read`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log("meltingIssueReturnData", response.data.data);
          setMeltingIssueReturnData(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/meltingIssueReturn/stone/read`,
        });
      });
  }

  function handleMetalOptionSelect(option, i) {
    console.log(option);
    const MetalData = [...allTypesMetalTableData];
    MetalData[i].stockCode = option;
    MetalData[i].stockType = option.data.stock_name;
    MetalData[i].weight = "";
    MetalData[i].purity = option.data.stock_name_code.purity;
    MetalData[i].fine = "";
    setAllTypesMetalTableData(MetalData);

    if (allTypesMetalTableData.length - i === 1) {
      setAllTypesMetalTableData([
        ...MetalData,
        {
          stockCode: "",
          stockType: "",
          weight: "",
          purity: "",
          fine: "",
          errors: {
            weight: null,
          },
        },
      ]);
    }

    console.log("option allTypesMetalData", allTypesMetalData);
    console.log("table allTypesMetalTableData", allTypesMetalTableData);
  }

  function handleChangeWeight(i, e) {
    const updatedMetalData = [...allTypesMetalTableData];
    updatedMetalData[i][e.target.name] = e.target.value;
    // let availablewgt = parseFloat(updatedMetalData[i].availablewgt);

    let name = e.target.name;
    let value = e.target.value;
    console.log(e.target.value);

    if (name === "weight") {
      updatedMetalData[i].weight = value;
      updatedMetalData[i].errors.weight = null;
      if (
        updatedMetalData[i].weight !== "" &&
        updatedMetalData[i].purity !== ""
      ) {
        updatedMetalData[i].fine = parseFloat(
          (parseFloat(updatedMetalData[i].weight) *
            parseFloat(updatedMetalData[i].purity)) /
            100
        ).toFixed(3);
      }
      if (value == 0) {
        updatedMetalData[i].errors.weight = "Enter Weight";
      }
      // else if (value > availablewgt) {
      //   updatedMetalData[i].errors.weight = "Enter valid Weight";
      // }
      if (value === "" || value === "0") {
        updatedMetalData[i].fine = "";
      }
    }
    setAllTypesMetalTableData(updatedMetalData);
  }

  function deleteMetalHandler(index) {
    const updatedMetalTableData = [...allTypesMetalTableData];
    updatedMetalTableData.splice(index, 1);
    setAllTypesMetalTableData(updatedMetalTableData);
    console.log(updatedMetalTableData);
  }

  function handleOtherMaterialOption(option, i) {
    const MetaltingReturnData = [...meltingIssueReturnTableData];
    MetaltingReturnData[i].stockCode = option;
    MetaltingReturnData[i].desc =
      option.data.stock_name_code.stock_description.description;
    MetaltingReturnData[i].addInPcs = "";
    MetaltingReturnData[i].addInWgt = "";
    MetaltingReturnData[i].rejPcs = "";
    MetaltingReturnData[i].rejWgt = "";
    setMeltingIssueReturnTableData(MetaltingReturnData);
    console.log(MetaltingReturnData);
    console.log("option", option);

    if (meltingIssueReturnTableData.length - i === 1) {
      setMeltingIssueReturnTableData([
        ...MetaltingReturnData,
        {
          stockCode: "",
          desc: "",
          addInPcs: "",
          addInWgt: "",
          rejPcs: "",
          rejWgt: "",
          errors: {
            addInPcs: null,
            addInWgt: null,
            rejPcs: null,
            rejWgt: null,
          },
        },
      ]);
    }
  }

  function deleteMetalingReturnHandler(index) {
    const updatedMeltingReturnTableData = [...meltingIssueReturnTableData];
    updatedMeltingReturnTableData.splice(index, 1);
    setMeltingIssueReturnTableData(updatedMeltingReturnTableData);
  }

  function handleChangeAddPcs(i, e) {
    const updatedMeltingReturnlData = [...meltingIssueReturnTableData];
    updatedMeltingReturnlData[i][e.target.name] = e.target.value;

    let name = e.target.name;
    let value = parseInt(e.target.value);

    if (name === "addInPcs") {
      updatedMeltingReturnlData[i].addInPcs = value;
      // updatedMeltingReturnlData[i].errors.addInPcs = null;

      // if (value == 0) {
      //   updatedMeltingReturnlData[i].errors.addInPcs = "Enter Pcs";
      // }
    }
    setMeltingIssueReturnTableData(updatedMeltingReturnlData);
  }
  function handleChangeAddWeight(i, e) {
    const updatedMeltingReturnlData = [...meltingIssueReturnTableData];
    updatedMeltingReturnlData[i][e.target.name] = e.target.value;

    let name = e.target.name;
    let value = e.target.value;

    if (name === "addInWgt") {
      updatedMeltingReturnlData[i].addInWgt = value;
      // updatedMeltingReturnlData[i].errors.addInWgt = null;

      // if (value == 0) {
      //   updatedMeltingReturnlData[i].errors.addInWgt = "Enter Weight";
      // }
    }
    setMeltingIssueReturnTableData(updatedMeltingReturnlData);
  }
  function handleChangeRejPcs(i, e) {
    const updatedMeltingReturnlData = [...meltingIssueReturnTableData];
    updatedMeltingReturnlData[i][e.target.name] = e.target.value;

    let name = e.target.name;
    let value = parseInt(e.target.value);

    if (name === "rejPcs") {
      updatedMeltingReturnlData[i].rejPcs = value;
      // updatedMeltingReturnlData[i].errors.rejPcs = null;

      // if (value == 0) {
      //   updatedMeltingReturnlData[i].errors.rejPcs = "Enter Pcs";
      // }
    }
    setMeltingIssueReturnTableData(updatedMeltingReturnlData);
  }
  function handleChangeRejWgt(i, e) {
    const updatedMeltingReturnlData = [...meltingIssueReturnTableData];
    updatedMeltingReturnlData[i][e.target.name] = e.target.value;

    let name = e.target.name;
    let value = e.target.value;

    if (name === "rejWgt") {
      updatedMeltingReturnlData[i].rejWgt = value;
      // updatedMeltingReturnlData[i].errors.rejWgt = null;

      // if (value == 0) {
      //   updatedMeltingReturnlData[i].errors.rejWgt = "Enter Weight";
      // }
    }
    setMeltingIssueReturnTableData(updatedMeltingReturnlData);
  }


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
                    Add Melting Receive
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
                    // format="DD-MM-YYYY"
                    inputProps={{
                      max: moment().format("YYYY-MM-DD"),
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                  <p>Voucher Number</p>
                  <TextField
                    placeholder="Voucher Number"
                    autoFocus
                    name="voucherNumber"
                    value={voucherNumber}
                    // error={voucherNumErr.length > 0 ? true : false}
                    // helperText={voucherNumErr}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                  <p>Issued Voucher</p>
                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    fullWidth
                    options={meltingIssuedVoucher.map((suggestion) => ({
                      value: suggestion.id,
                      label: suggestion.voucher_no,
                    }))}
                    onChange={handleInputChangeIssuedVoucher}
                    placeholder="Issued Voucher"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3} lg={2}>
                  <p>Jobworker Name</p>
                  <TextField
                    placeholder="Jobworker Name"
                    autoFocus
                    value={jobworkerName}
                    variant="outlined"
                    fullWidth
                    disabled
                  />
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
              </Grid>
              <h3 style={{ marginTop: "20px", marginBottom: "10px" }}>
                Metal Issue Details
              </h3>
              {goldvarient.length !== 0 ? (
                <>
                  <h4 style={{ marginBottom: "10px" }}>
                    Stock Code / Gold Variant
                  </h4>
                  <Paper
                    className={classes.tabroot}
                    style={{ minHeight: "auto", marginBottom: "20px" }}
                  >
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableHeadPad}>
                            Date
                          </TableCell>
                          <TableCell className={classes.tableHeadPad}>
                            Variant Code
                          </TableCell>
                          <TableCell className={classes.tableHeadPad}>
                            Variant Name
                          </TableCell>
                          <TableCell className={classes.tableHeadPad}>
                            Gross Weight
                          </TableCell>
                          <TableCell className={classes.tableHeadPad}>
                            NetWeight
                          </TableCell>
                          <TableCell className={classes.tableHeadPad}>
                            Calc. Purity
                          </TableCell>
                          <TableCell className={classes.tableHeadPad}>
                            Fine
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {goldvarient.map((data, i) => (
                          <TableRow key={i}>
                            <TableCell className={classes.tableCellPad}>
                              {moment
                                .utc(data.created_at)
                                .local()
                                .format("DD-MM-YYYY")}
                            </TableCell>
                            <TableCell className={classes.tableCellPad}>
                              {data.StockNameCode
                                ? data.StockNameCode.stock_code
                                : ""}
                            </TableCell>
                            <TableCell className={classes.tableCellPad}>
                              {data.StockNameCode
                                ? data.StockNameCode.stock_name_code
                                    .billing_name
                                : ""}
                            </TableCell>
                            <TableCell className={classes.tableCellPad}>
                              {data.gross_weight}
                            </TableCell>
                            <TableCell className={classes.tableCellPad}>
                              {data.net_weight}
                            </TableCell>
                            <TableCell className={classes.tableCellPad}>
                              {data.purity}
                            </TableCell>
                            <TableCell className={classes.tableCellPad}>
                              {data.fine_gold}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>
                </>
              ) : null}

              {lot.length !== 0 ? (
                <>
                  <h4 style={{ marginBottom: "10px" }}>Lot</h4>
                  <Paper
                    className={classes.tabroot}
                    style={{ minHeight: "auto", marginBottom: "20px" }}
                  >
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableHeadPad}>
                            Date
                          </TableCell>
                          <TableCell className={classes.tableHeadPad}>
                            Lot
                          </TableCell>
                          <TableCell className={classes.tableHeadPad}>
                            Variant Name
                          </TableCell>
                          <TableCell className={classes.tableHeadPad}>
                            Gross Weight
                          </TableCell>
                          <TableCell className={classes.tableHeadPad}>
                            NetWeight
                          </TableCell>
                          <TableCell className={classes.tableHeadPad}>
                            Calc. Purity
                          </TableCell>
                          <TableCell className={classes.tableHeadPad}>
                            Fine
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {lot.map((data, i) => (
                          <TableRow key={i}>
                            <TableCell className={classes.tableCellPad}>
                              {moment
                                .utc(data.created_at)
                                .local()
                                .format("DD-MM-YYYY")}
                            </TableCell>
                            <TableCell className={classes.tableCellPad}>
                              {data.StockNameCode
                                ? data.StockNameCode.stock_code
                                : ""}
                            </TableCell>
                            <TableCell className={classes.tableCellPad}>
                              {data.StockNameCode
                                ? data.StockNameCode.stock_name_code
                                    .billing_name
                                : ""}
                            </TableCell>
                            <TableCell className={classes.tableCellPad}>
                              {data.gross_weight}
                            </TableCell>
                            <TableCell className={classes.tableCellPad}>
                              {data.net_weight}
                            </TableCell>
                            <TableCell className={classes.tableCellPad}>
                              {data.purity}
                            </TableCell>
                            <TableCell className={classes.tableCellPad}>
                              {data.fine_gold}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>
                </>
              ) : null}

              {barcode.length !== 0 ? (
                <>
                  <h4 style={{ marginBottom: "10px" }}>Barcode</h4>
                  <Paper
                    className={classes.tabroot}
                    style={{ minHeight: "auto", marginBottom: "20px" }}
                  >
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableHeadPad}>
                            Date
                          </TableCell>
                          <TableCell className={classes.tableHeadPad}>
                            Barcode
                          </TableCell>
                          <TableCell className={classes.tableHeadPad}>
                            Variant Name
                          </TableCell>
                          <TableCell className={classes.tableHeadPad}>
                            Gross Weight
                          </TableCell>
                          <TableCell className={classes.tableHeadPad}>
                            NetWeight
                          </TableCell>
                          <TableCell className={classes.tableHeadPad}>
                            Calc. Purity
                          </TableCell>
                          <TableCell className={classes.tableHeadPad}>
                            Fine
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {barcode.map((data, i) => (
                          <TableRow key={i}>
                            <TableCell className={classes.tableCellPad}>
                              {moment
                                .utc(data.created_at)
                                .local()
                                .format("DD-MM-YYYY")}
                            </TableCell>
                            <TableCell className={classes.tableCellPad}>
                              {data.StockNameCode
                                ? data.StockNameCode.stock_code
                                : ""}
                            </TableCell>
                            <TableCell className={classes.tableCellPad}>
                              {data.StockNameCode
                                ? data.StockNameCode.stock_name_code
                                    .billing_name
                                : ""}
                            </TableCell>
                            <TableCell className={classes.tableCellPad}>
                              {data.gross_weight}
                            </TableCell>
                            <TableCell className={classes.tableCellPad}>
                              {data.net_weight}
                            </TableCell>
                            <TableCell className={classes.tableCellPad}>
                              {data.purity}
                            </TableCell>
                            <TableCell className={classes.tableCellPad}>
                              {data.fine_gold}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>
                </>
              ) : null}

              {alloy.length !== 0 ? (
                <>
                  <h4 style={{ marginBottom: "10px" }}>Alloy</h4>
                  <Paper
                    className={classes.tabroot}
                    style={{ minHeight: "auto", marginBottom: "20px" }}
                  >
                    <Table className={classes.table}>
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tableHeadPad}>
                            Date
                          </TableCell>
                          <TableCell className={classes.tableHeadPad}>
                            Varient
                          </TableCell>
                          <TableCell className={classes.tableHeadPad}>
                            Variant Name
                          </TableCell>
                          <TableCell className={classes.tableHeadPad}>
                            Gross Weight
                          </TableCell>
                          <TableCell className={classes.tableHeadPad}>
                            NetWeight
                          </TableCell>
                          <TableCell className={classes.tableHeadPad}>
                            Calc. Purity
                          </TableCell>
                          <TableCell className={classes.tableHeadPad}>
                            Fine
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {alloy.map((data, i) => (
                          <TableRow key={i}>
                            <TableCell className={classes.tableCellPad}>
                              {moment
                                .utc(data.created_at)
                                .local()
                                .format("DD-MM-YYYY")}
                            </TableCell>
                            <TableCell className={classes.tableCellPad}>
                              {data.StockNameCode
                                ? data.StockNameCode.stock_code
                                : ""}
                            </TableCell>
                            <TableCell className={classes.tableCellPad}>
                              {data.StockNameCode
                                ? data.StockNameCode.stock_name_code
                                    .billing_name
                                : ""}
                            </TableCell>
                            <TableCell className={classes.tableCellPad}>
                              {data.gross_weight}
                            </TableCell>
                            <TableCell className={classes.tableCellPad}>
                              {data.net_weight}
                            </TableCell>
                            <TableCell className={classes.tableCellPad}>
                              {data.purity}
                            </TableCell>
                            <TableCell className={classes.tableCellPad}>
                              {data.fine_gold}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Paper>
                </>
              ) : null}
              {/* <h3 style={{ marginTop: "20px", marginBottom: "10px" }}>
          Other Materials
        </h3>
        <Paper className={classes.tabroot} style={{ minHeight: "auto" }}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell className={classes.tableHeadPad}>
                  Varient wise Details
                </TableCell>
                <TableCell className={classes.tableHeadPad}>
                  Stock Code
                </TableCell>
                <TableCell className={classes.tableHeadPad}>Pieces</TableCell>
                <TableCell className={classes.tableHeadPad}>Weight</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper> */}
              <h3 style={{ marginTop: "20px", marginBottom: "10px" }}>
                Receive Details
              </h3>
              <Paper className={classes.tabroot}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell width="50px" align="center"></TableCell>
                      <TableCell className={classes.tableHeadPad}>
                        Varient
                      </TableCell>
                      <TableCell className={classes.tableHeadPad}>
                        Varient Name
                      </TableCell>
                      <TableCell className={classes.tableHeadPad}>
                        Weight
                      </TableCell>
                      <TableCell className={classes.tableHeadPad}>
                        Purity
                      </TableCell>
                      <TableCell className={classes.tableHeadPad}>
                        Fine
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {allTypesMetalTableData.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell
                          className={classes.tableCellPad}
                          align="center"
                        >
                          <IconButton
                            style={{ padding: "0" }}
                            onClick={(ev) => {
                              ev.preventDefault();
                              if (allTypesMetalTableData.length - 1 !== i) {
                                deleteMetalHandler(i);
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
                            filterOption={createFilter({
                              ignoreAccents: false,
                            })}
                            placeholder="Metal"
                            fullWidth
                            options={allTypesMetalData
                              .filter((array) =>
                                allTypesMetalTableData.every(
                                  (item) =>
                                    !(
                                      item.stockCode?.value ===
                                        array.stock_name_code.stock_code &&
                                      item.stockCode.label ===
                                        array.stock_name_code.stock_code
                                    )
                                )
                              )
                              .map((data) => ({
                                value: data.stock_name_code.stock_code,
                                label: data.stock_name_code.stock_code,
                                data: data,
                              }))}
                            value={item.stockCode}
                            onChange={(e) => handleMetalOptionSelect(e, i)}
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="varientname"
                            disabled
                            variant="outlined"
                            fullWidth
                            value={item.stockType}
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="weight"
                            variant="outlined"
                            onChange={(e) => {
                              handleChangeWeight(i, e);
                            }}
                            error={
                              item.errors !== undefined
                                ? item.errors.weight
                                  ? true
                                  : false
                                : false
                            }
                            helperText={
                              item.errors !== undefined
                                ? item.errors.weight
                                : ""
                            }
                            fullWidth
                            value={item.weight}
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="purity"
                            disabled
                            variant="outlined"
                            fullWidth
                            value={item.purity || ""}
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="fine"
                            disabled
                            variant="outlined"
                            fullWidth
                            value={item.fine}
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
                          value={totalWeight !== NaN ? totalWeight : ""}
                          disabled
                        />
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </Paper>
              <Grid container>
                <Grid
                  item
                  xs={12}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    columnGap: "10px",
                    marginTop: "20px",
                  }}
                >
                  <label style={{ fontSize: "16px", fontWeight: "700" }}>
                    Loss in fine :{" "}
                  </label>
                  <TextField
                    variant="outlined"
                    name="lossfine"
                    disabled
                    value={lossInFine}
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    columnGap: "10px",
                    marginTop: "10px",
                  }}
                >
                  <label style={{ fontSize: "16px", fontWeight: "700" }}>
                    Loss in fine(%) :{" "}
                  </label>
                  <TextField
                    variant="outlined"
                    name="lossfineper"
                    disabled
                    value={lossInFinePer}
                  />
                </Grid>
              </Grid>
              <h3 style={{ marginTop: "20px", marginBottom: "10px" }}>
                Other Material Received
              </h3>
              <Paper className={classes.tabroot}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        width="50px"
                        align="center"
                        className={classes.tableHeadPad}
                      ></TableCell>
                      <TableCell className={classes.tableHeadPad}></TableCell>
                      <TableCell className={classes.tableHeadPad}></TableCell>
                      {/* <TableCell className={classes.tableHeadPad}></TableCell>
                <TableCell className={classes.tableHeadPad}></TableCell> */}
                      <TableCell
                        className={classes.tableHeadPad}
                        colSpan={2}
                        align="center"
                      >
                        Add in Stock
                      </TableCell>
                      <TableCell
                        className={clsx(classes.tableHeadPad, "centertext")}
                        colSpan={2}
                        align="center"
                      >
                        Reject Stock
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className={classes.tableHeadPad}></TableCell>
                      <TableCell className={classes.tableHeadPad}>
                        Stock Code
                      </TableCell>
                      <TableCell className={classes.tableHeadPad}>
                        Desc
                      </TableCell>
                      {/* <TableCell className={classes.tableHeadPad}>Pcs.</TableCell>
                <TableCell className={classes.tableHeadPad}>Weight</TableCell> */}
                      <TableCell
                        className={classes.tableHeadPad}
                        align="center"
                      >
                        Pcs
                      </TableCell>
                      <TableCell
                        className={classes.tableHeadPad}
                        align="center"
                      >
                        Wgt
                      </TableCell>
                      <TableCell
                        className={classes.tableHeadPad}
                        align="center"
                      >
                        Pcs
                      </TableCell>
                      <TableCell
                        className={classes.tableHeadPad}
                        align="center"
                      >
                        Wgt
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {meltingIssueReturnTableData.map((data, i) => (
                      <TableRow key={i}>
                        <TableCell
                          className={classes.tableCellPad}
                          align="center"
                        >
                          <IconButton
                            style={{ padding: "0" }}
                            onClick={(ev) => {
                              ev.preventDefault();
                              if (
                                meltingIssueReturnTableData.length - 1 !==
                                i
                              ) {
                                deleteMetalingReturnHandler(i);
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
                            filterOption={createFilter({
                              ignoreAccents: false,
                            })}
                            placeholder="Stock Code"
                            fullWidth
                            options={meltingIssueReturnData
                              .filter((array) =>
                                meltingIssueReturnTableData.every(
                                  (item) =>
                                    !(
                                      item.stockCode?.value ===
                                        array.stock_name_code.stock_code &&
                                      item.stockCode.label ===
                                        array.stock_name_code.stock_code
                                    )
                                )
                              )
                              .map((data) => ({
                                value: data.stock_name_code.stock_code,
                                label: data.stock_name_code.stock_code,
                                data: data,
                              }))}
                            // value={item.stockCode}
                            onChange={(e) => handleOtherMaterialOption(e, i)}
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="desc"
                            disabled
                            variant="outlined"
                            fullWidth
                            value={data.desc}
                          />
                        </TableCell>
                        {/* <TableCell className={classes.tableInput}>
                  <TextField
                    name="pcs"
                    disabled
                    variant="outlined"
                    fullWidth
                    // value={item.purity || ""}
                  />
                </TableCell>
                <TableCell className={classes.tableInput}>
                  <TextField
                    name="weight"
                    disabled
                    variant="outlined"
                    fullWidth
                    // value={item.purity || ""}
                  />
                </TableCell> */}
                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="addInPcs"
                            variant="outlined"
                            fullWidth
                            onChange={(e) => {
                              handleChangeAddPcs(i, e);
                            }}
                            // error={
                            //   data.errors !== undefined
                            //     ? data.errors.addInPcs
                            //       ? true
                            //       : false
                            //     : false
                            // }
                            // helperText={
                            //   data.errors !== undefined ? data.errors.addInPcs : ""
                            // }
                            value={data.addInPcs}
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="addInWgt"
                            variant="outlined"
                            fullWidth
                            onChange={(e) => {
                              handleChangeAddWeight(i, e);
                            }}
                            // error={
                            //   data.errors !== undefined
                            //     ? data.errors.addInWgt
                            //       ? true
                            //       : false
                            //     : false
                            // }
                            // helperText={
                            //   data.errors !== undefined ? data.errors.addInWgt : ""
                            // }
                            value={data.addInWgt}
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="rejPcs"
                            variant="outlined"
                            fullWidth
                            onChange={(e) => {
                              handleChangeRejPcs(i, e);
                            }}
                            // error={
                            //   data.errors !== undefined
                            //     ? data.errors.rejPcs
                            //       ? true
                            //       : false
                            //     : false
                            // }
                            // helperText={
                            //   data.errors !== undefined ? data.errors.rejPcs : ""
                            // }
                            value={data.rejPcs}
                          />
                        </TableCell>
                        <TableCell className={classes.tableInput}>
                          <TextField
                            name="rejWgt"
                            variant="outlined"
                            fullWidth
                            onChange={(e) => {
                              handleChangeRejWgt(i, e);
                            }}
                            // error={
                            //   data.errors !== undefined
                            //     ? data.errors.rejWgt
                            //       ? true
                            //       : false
                            //     : false
                            // }
                            // helperText={
                            //   data.errors !== undefined ? data.errors.rejWgt : ""
                            // }
                            value={data.rejWgt}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
              <Grid container>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    className="mt-16"
                    style={{
                      backgroundColor: "#415bd4",
                      border: "none",
                      color: "white",
                      marginLeft: "auto",
                      display: "block",
                    }}
                    onClick={() => postMeltingReceiveData()}
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

export default AddMeltingReceive;
