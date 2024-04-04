import React, { useState, useEffect } from "react";
import { AppBar, Modal, Tab, Tabs, Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
import BreadcrumbsHelper from "../../../BreadCrubms/BreadcrumbsHelper";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Button, TextField } from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Icon, IconButton } from "@material-ui/core";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import Loader from "app/main/Loader/Loader";
import MaUTable from "@material-ui/core/Table";

import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Select, { createFilter } from "react-select";

import OtbsampleFile from "app/main/SampleFiles/OpeningTriealBalance/Ledger_Open_Trial_Balance.csv";
import stockDataFile from "app/main/SampleFiles/OpeningTriealBalance/Stock_code_opeening_balance.csv";
import lotTitileFile from "app/main/SampleFiles/OpeningTriealBalance/Load_lot_doirectly.csv";
import BarcodeDataFile from "app/main/SampleFiles/OpeningTriealBalance/Load Barcode wise.csv";
import PackingDataFile from "app/main/SampleFiles/OpeningTriealBalance/Load_Packing_Slip_wise.csv";
import PacketDataFile from "app/main/SampleFiles/OpeningTriealBalance/Load_Packet_wise.csv";

const useStyles = makeStyles((theme) => ({
    root: {},
    table: {
        // minWidth: 650,
    },
    tableRowPad: {
        padding: 7,
    },
    form: {
        marginTop: "3%",
        display: "contents",
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200,
    },

    tableheader: {
        display: "inline-block",
        textAlign: "center",
    },
    paper: {
        position: "absolute",
        // width: 400,
        zIndex: 1,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        // padding: theme.spacing(4),
        outline: "none",
    },
    rateFixPaper: {
        position: "absolute",
        width: 600,
        zIndex: 1,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        // padding: theme.spacing(4),
        outline: "none",
    },

    button: {
        margin: 5,
        textTransform: "none",
        backgroundColor: "#415BD4",
        color: "white",
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


const OpningTriBlan = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [modalStyle] = React.useState(getModalStyle);
  
    const [loading, setLoading] = useState(false);
  
    const [mainModale, setMainModale] = useState(0);
  
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenStock, setModalOpenStock] = useState(false);
    const [modelTitleLot, setModelTitleLot] = useState(false);
    const [modelThreeTabs, setModelthreeTabs] = useState(false);
  
    const [otbFile, setOtbFile] = useState(null);
    const [otbFileErr, setOtbFileErr] = useState("");
    const [otbData, setOtbData] = useState([]);
    const [otbDataErr, setOtbDataErr] = useState("");
    const [stockCodeFile, setStockCodeFile] = useState(null);
    const [StockCodeData, setStockCodeData] = useState([]);
    const [stockCodeErr, setStockCodeErr] = useState("");
  
    const [lotModalViewTabs, setLotModalViewTabs] = useState(0);
    const [lotTitleFile, setLotTitleFile] = useState(null);
    const [lotTitleData, setlotTitleData] = useState([]);
    const [lotTitleBomData, setlotTitleBomData] = useState([]);
    const [lotTitleErr, setlotTitleErr] = useState("");
  
    const [threeTabModeleViewTabs, setThreeTabModeleViewTabs] = useState(0);
    const [threeTabsFile, setThreeTabsFile] = useState(null);
    const [threeTabsErr, setThreeTabsErr] = useState("");
  
    const [threeTabsData, setThreeTabsData] = useState([]);
    const [threeTabsDataTags, setThreeTabsDataTags] = useState([]);
    const [threeTabsDataPacket, setthreeTabsDataPacket] = useState([]);
    const [threeTabsDataPackingDa, setthreeTabsDataPacking] = useState([]);
  
    const [BarcodeFlag, setBarCodeFlage] = useState(false);
    const [packigFlag, setPackingFlag] = useState(false);
    const [PacketeFlag, setPacketFlag] = useState(false);
  
    const [departmentData, setDepartmentData] = useState([]);
    const [selectedDepartmentData, setSelectedDepartmentData] = useState("");
    const [depatmentDataErr, setDepatmentDataErr] = useState("");
  
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
  
    useEffect(() => {
      if (loading) {
        setTimeout(() => setLoading(false), 7000);
      }
    }, [loading]);

    useEffect(() => {
        NavbarSetting('Sales', dispatch)
    }, []);
  
    useEffect(() => {
      getDepartment();
    }, []);
  
    function getDepartment() {
      axios
        .get(Config.getCommonUrl() + "api/admin/getdepartmentlist")
        .then(function (response) {
          if (response.data.success === true) {
            console.log(response);
            let data = response.data.data.filter((s) => s.is_location !== 1);
            setDepartmentData(data);
          } else {
            dispatch(Actions.showMessage({ message: response.data.message }));
          }
        })
        .catch((error) => {
          handleError(error, dispatch, { api: "api/admin/getdepartmentlist" });
        });
    }

    function handleChangePartyType(value) {
      setSelectedDepartmentData(value);
      setDepatmentDataErr("");
    }

    // useEffect(() => {
    //   if (selectedDepartmentData.value === undefined) {
    //     setDepatmentDataErr("Select Department Name!");
    //   }
    // }, [selectedDepartmentData]);
  
    useEffect(() => {
      if (otbData.length === 0) {
        setOtbDataErr("please upload csv file!");
      } else {
        setOtbDataErr("");
      }
    }, [handelOtbFileSave]);
  
    const handleEditClickOtb = (index) => {
      const updatedData = otbData.map((row, i) => {
        if (i === index) {
          return { ...row, isEditable: true };
        } else {
          return { ...row, isEditable: false };
        }
      });
      setOtbData(updatedData);
    };
  
    const handleInputChangeOTb = (event, index) => {
      const { name, value } = event.target;
      const updatedData = otbData.map((row, i) => {
        if (i === index) {
          return { ...row, [name]: value };
        } else {
          return row;
        }
      });
      setOtbData(updatedData);
    };
  
    const handeleClickSaveOtb = (index) => {
      const row = otbData[index];
      console.log(row.credit_amount, row.debit_amount);
  
      if (
        (row.debit_amount !== null &&
          row.debit_amount !== "" &&
          row.debit_amount !== undefined &&
          row.credit_amount !== null &&
          row.credit_amount !== undefined &&
          row.credit_amount !== "") ||
        (row.debit_amount === null && row.credit_amount === null) ||
        (row.debit_amount === "" && row.credit_amount === "" )||
        (row.debit_amount === undefined && row.credit_amount === "" )||
        (row.debit_amount === "" && row.credit_amount === undefined )
      ) {
        dispatch(
          Actions.showMessage({
            message: "Only one amount field should be filled (debit or credit)",
          })
        );
        return;
      }
  
      const updatedData = otbData.map((row, i) => {
        if (i === index) {
          return { ...row, isEditable: false };
        } else {
          return row;
        }
      });
      setOtbData(updatedData);
    };
  
    const handleInputChangeCsvOtb = (e) => {
      setOtbFile(e.target.files);
      setOtbFileErr("");
    };
  
    const handleOtbFileUplod = (e) => {
      e.preventDefault();
      if (otbFile === null) {
        setOtbFileErr("Please choose file");
      } else {
        const formData = new FormData();
        for (let i = 0; i < otbFile.length; i++) {
          formData.append("file", otbFile[i]);
        }
        handelOtbFileSave(formData);
      }
    };
  
    function handleOtbUpdateSave() {
      const body = {
        ledgerArray: otbData.map((data) => ({
          ledger_id: data.ledger_id,
          ledger_name: data.ledger_name,
          head: data.head,
          credit_debit:data.credit_debit,
          group_name: data.group_name,
          credit_amount: data.credit_amount,
          debit_amount: data.debit_amount,
          amount: data.amount,
        })),
      };
      axios
        .post(Config.getCommonUrl() + "api/openTrialBalance/add", body)
        .then(function (response) {
          console.log(response);
          if (response.data.success === true) {
            dispatch(Actions.showMessage({ message: response.data.message }));
            setOtbData([]);
          } else {
            dispatch(Actions.showMessage({ message: response.data.message }));
          }
        })
        .catch((error) => {
          console.log(error);
          handleError(error, dispatch, {
            api: "api/openTrialBalance/add",
            body: body,
          });
        });
    }
  
    function handleFormatModalClose() {
      setModalOpen(false);
      setModalOpenStock(false);
      setModelTitleLot(false);
      setModelthreeTabs(false);
    }
  
    function handelOtbFileSave(formData) {
      setLoading(true);
      const body = formData;
      var api = "api/openTrialBalance/upload/csv";
      axios
        .post(Config.getCommonUrl() + api, body)
        .then((response) => {
          if (response.data.success) {
            setOtbFile("");
            setOtbFileErr("");
            handleFormatModalClose();
            dispatch(
              Actions.showMessage({
                message: "File Uploaded Successfully",
              })
            );
            console.log(response.data.data);
            setOtbData(response.data.data);
          } else {
            document.getElementById("fileinput").value = "";
            let downloadUrl = response.data.url;
            console.log(downloadUrl);
            window.open(downloadUrl);
            setOtbFile("");
            setOtbFileErr("");
            handleFormatModalClose();
            dispatch(Actions.showMessage({ message: response.data.message }));
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
          handleError(error, dispatch, { api: api, body: body });
        });
    }
  
    function getCurrentFinancialYear() {
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth() + 1;
      if (currentMonth >= 4) {
        return currentYear + "-" + (currentYear + 1);
      } else {
        return currentYear - 1 + "-" + currentYear;
      }
    }
    const currentFinancialYear = getCurrentFinancialYear();
  
    //stock code
    const handleInputstockecodeChangea = (e) => {
      setStockCodeFile(e.target.files);
      setStockCodeErr("");
    };
  
    const handleStockeCodeFileUpload = (e) => {
      e.preventDefault();
      if (stockCodeFile === null) {
        setStockCodeErr("Please choose file");
      } else if (selectedDepartmentData.value === undefined) {
        dispatch(Actions.showMessage({ message: "Please Select Department " }));
      } else {
        const formData = new FormData();
        for (let i = 0; i < stockCodeFile.length; i++) {
          formData.append("file", stockCodeFile[i]);
          formData.append("department_id", selectedDepartmentData.value);
        }
        callStockeCodeFileUploadApi(formData);
      }
    };
  
    function callStockeCodeFileUploadApi(formData) {
      setLoading(true);
      const body = formData;
      var api = "api/openTrialBalance/upload/file";
      axios
        .post(Config.getCommonUrl() + api, body)
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            setStockCodeFile("");
            setStockCodeErr("");
            handleFormatModalClose();
            dispatch(
              Actions.showMessage({
                message: "File Uploaded Successfully",
              })
            );
            console.log(response.data.data);
            setStockCodeData(response.data.data);
          } else {
            document.getElementById("fileinputstock").value = "";
            let downloadUrl = response.data.url;
            console.log(downloadUrl);
            window.open(downloadUrl);
            setStockCodeFile("");
            setStockCodeErr("");
            handleFormatModalClose();
            dispatch(Actions.showMessage({ message: response.data.message }));
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
          handleError(error, dispatch, { api: api, body: body });
        });
    }

    function handleStockInHandSave() {
      const body = {
        CsvArray: StockCodeData.map((data) => ({
          voucherNo: data.voucherNo,
          department_id: data.department_id,
          stock_name_code_id: data.stock_name_code_id,
          Stock_Code: data.Stock_Code,
          stock_name: data.stock_name,
          gross_weight: data.gross_weight,
          net_weight: data.net_weight,
          purity: data.purity,
          pcs: data.pcs,
          available_pcs: data.pcs,
        })),
        ledgerArray: otbData.map((data) => ({
          ledger_id: data.ledger_id,
          ledger_name: data.ledger_name,
          head: data.head,
          group_name: data.group_name,
          credit_amount: data.credit_amount,
          debit_amount: data.debit_amount,
          amount: data.amount,
          credit_debit: data.credit_debit,
        })),
      };
      console.log(body);
      axios
        .post(Config.getCommonUrl() + "api/openTrialBalance", body)
        .then(function (response) {
          console.log(response);
          if (response.data.success === true) {
            dispatch(Actions.showMessage({ message: response.data.message }));
            setOtbData([]);
            setStockCodeData([]);
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            dispatch(Actions.showMessage({ message: response.data.message }));
          }
        })
        .catch((error) => {
          console.log(error);
          handleError(error, dispatch, {
            api: "api/openTrialBalance",
            body: body,
          });
        });
    }

    // title
  
    const handleLotTabChange = (event, value) => {
      setLotModalViewTabs(value);
    };

    const handleInputLotTitleeChangea = (e) => {
      setLotTitleFile(e.target.files);
      setlotTitleErr("");
    };

    const handleLotTitleFileUpload = (e) => {
      e.preventDefault();
      if (lotTitleFile === null) {
        setlotTitleErr("Please choose file");
      } else if (selectedDepartmentData.value === undefined) {
        dispatch(Actions.showMessage({ message: "Please Select Department " }));
      } else {
        const formData = new FormData();
        for (let i = 0; i < lotTitleFile.length; i++) {
          formData.append("file", lotTitleFile[i]);
          formData.append("department_id", selectedDepartmentData.value);
        }
        callLottiTleFileUploadApi(formData);
      }
    };

    function callLottiTleFileUploadApi(formData) {
      setLoading(true);
      const body = formData;
      var api = "api/openTrialBalance/createfromexcel/lot";
      axios
        .post(Config.getCommonUrl() + api, body)
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            setStockCodeErr("");
            handleFormatModalClose();
            dispatch(
              Actions.showMessage({
                message: "File Uploaded Successfully",
              })
            );
            console.log(response.data.data);
            setlotTitleData(response.data.data.finalrecord);
            setlotTitleBomData(response.data.data.lotDetail);
          } else {
            document.getElementById("inputlotTitle").value = "";
            let downloadUrl = response.data.url;
            console.log(downloadUrl);
            window.open(downloadUrl);
  
            setStockCodeErr("");
            handleFormatModalClose();
            dispatch(Actions.showMessage({ message: response.data.message }));
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
          handleError(error, dispatch, { api: api, body: body });
        });
      // document.getElementById("inputlotTitle").value = "";
    }

    function handleLotTitleSave() {
      const body = {
        ledgerArray: otbData.map((data) => ({
          ledger_id: data.ledger_id,
          ledger_name: data.ledger_name,
          head: data.head,
          group_name: data.group_name,
          credit_amount: data.credit_amount,
          debit_amount: data.debit_amount,
          amount: data.amount,
        })),
      };
      const formData = new FormData();
  
      for (let i = 0; i < lotTitleFile.length; i++) {
        formData.append("file", lotTitleFile[i]);
        formData.append("department_id", 2);
        formData.append("ledgerArray", JSON.stringify(body));
      }
      axios
        .post(
          Config.getCommonUrl() +
            "api/openTrialBalance/createfromexcel/lot?save=1",
          formData
        )
        .then(function (response) {
          console.log(response);
          if (response.data.success === true) {
            dispatch(Actions.showMessage({ message: response.data.message }));
            setlotTitleData([]);
            setlotTitleBomData([]);
            setOtbData([]);
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            dispatch(Actions.showMessage({ message: response.data.message }));
          }
        })
        .catch((error) => {
          console.log(error);
          handleError(error, dispatch, {
            api: "api/openTrialBalance/createfromexcel/lot?save=1",
            body: formData,
          });
        });
    }
    //threee
  
    const handleThreeetbsChange = (event, value) => {
      setThreeTabModeleViewTabs(value);
    };

    const handleInputThreeTabsChangea = (e) => {
      setThreeTabsFile(e.target.files);
      setlotTitleErr("");
    };

    const handelThreetabsFileupload = (e) => {
      e.preventDefault();
      if (threeTabsFile === null) {
        setThreeTabsErr("Please choose file");
      } else if (selectedDepartmentData.value === undefined) {
        dispatch(Actions.showMessage({ message: "Please Select Department " }));
      } else {
        const formData = new FormData();
        for (let i = 0; i < threeTabsFile.length; i++) {
          formData.append("file", threeTabsFile[i]);
          formData.append("department_id", selectedDepartmentData.value);
          if (packigFlag === true) {
            formData.append("is_packingSlip", 1);
            formData.append("is_packetNo", 1);
          } else if (PacketeFlag === true) {
            formData.append("is_packetNo", 1);
          }
        }
        callThreeTabsFileUploadApi(formData);
      }
    };

    function callThreeTabsFileUploadApi(formData) {
      setLoading(true);
      const body = formData;
      var api = "api/openTrialBalance/createfromexcel";
      axios
        .post(Config.getCommonUrl() + api, body)
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            setThreeTabsErr("");
            handleFormatModalClose();
            setThreeTabsData(response?.data?.data?.OrdersData);
            setThreeTabsDataTags(response?.data?.data?.categoryData);
            setthreeTabsDataPacket(response?.data?.data?.packetData);
            setthreeTabsDataPacking(response?.data?.data?.packingSlipData);
            dispatch(
              Actions.showMessage({
                message: "File Uploaded Successfully",
              })
            );
          } else {
            document.getElementById("threetabs").value = "";
            let downloadUrl = response.data.url;
            console.log(downloadUrl);
            window.open(downloadUrl);
            setThreeTabsFile("");
            setThreeTabsErr("");
            handleFormatModalClose();
            dispatch(Actions.showMessage({ message: response.data.message }));
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
          handleError(error, dispatch, { api: api, body: body });
        });
      // document.getElementById("threetabs").value = "";
    }

    function handelThreetabSave() {
      const formData = new FormData();
      for (let i = 0; i < threeTabsFile.length; i++) {
        formData.append("file", threeTabsFile[i]);
        formData.append("department_id", 2);
        formData.append("ledgerArray", JSON.stringify(otbData));
      }
      if (packigFlag === true) {
        formData.append("is_packingSlip", 1);
        formData.append("is_packetNo", 1);
      } else if (PacketeFlag === true) {
        formData.append("is_packetNo", 1);
      }
  
      axios
        .post(
          Config.getCommonUrl() + "api/openTrialBalance/createfromexcel?save=1",
          formData
        )
        .then(function (response) {
          if (response.data.success === true) {
            dispatch(Actions.showMessage({ message: response.data.message }));
            setThreeTabsData([]);
            setThreeTabsDataTags([]);
            setthreeTabsDataPacking([]);
            setthreeTabsDataPacket([]);
            setOtbData([]);
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            dispatch(Actions.showMessage({ message: response.data.message }));
          }
        })
        .catch((error) => {
          console.log(error);
          handleError(error, dispatch, {
            api: "api/openTrialBalance/createfromexcel?save=1",
            body: formData,
          });
        });
    }


    return (
        <div>
            <div className={clsx(classes.root, props.className, "w-full")}>
                <FuseAnimate animation="transition.slideUpIn" delay={200}>
                    <div className="flex flex-col md:flex-row container">
                         <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1" style={{marginTop: "30px"}}>
                            <Grid
                                className="department-main-dv"
                                container
                                spacing={4}
                                alignItems="stretch"
                                style={{ margin: 0 }}
                            >
                                <Grid item xs={6} sm={6} md={6} key="1" style={{ padding: 0 }}>
                                    <FuseAnimate delay={300}>
                                    <Typography className="pl-28 text-18 font-700">

                                            Opening Trial Balance
                                        </Typography>
                                    </FuseAnimate>

                                    {/* <BreadcrumbsHelper /> */}
                                </Grid>
                            </Grid>

                             <div className="main-div-alll" style={{marginTop: "20px"}}>

                            <div className="flex flex-row justify-end align-middle">
                                <h2 className="mt-8 mr-8">
                                    Current financial year:{currentFinancialYear}
                                </h2>
                                <div className="flex flex-row">
                                    <div style={{ width: "200px" }}>
                                        <Select
                                            filterOption={createFilter({ ignoreAccents: false })}
                                            classes={classes}
                                            // options={departmentData
                                            styles={selectStyles}
                                            options={departmentData.map((item) => ({
                                                value: item.id,
                                                label: item.name,
                                            }))}
                                            value={selectedDepartmentData}
                                            onChange={handleChangePartyType}
                                            placeholder="Department Name"
                                            fullWidth
                                        />
                                        <span style={{ color: "red" }}>
                                            {depatmentDataErr.length > 0 ? depatmentDataErr : ""}
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            textAlign: "right",
                                            // marginRight: "20px",
                                            marginLeft: "10px",
                                        }}
                                        className="flex flex-col"
                                    >
                                        <Button
                                            variant="contained"
                                            className={classes.button}
                                            size="small"
                                            onClick={(event) => {
                                                setModalOpen(true);
                                            }}
                                            style={{
                                                backgroundColor: otbData.length !== 0 ? "#039be5" : "",
                                            }}
                                        >
                                            IMPORT DATA
                                        </Button>
                                        <span style={{ color: "red" }}>
                                            {otbDataErr.length > 0 ? otbDataErr : ""}
                                        </span>
                                        {/* <div>
                      <a
                        href={OtbsampleFile}
                        download="Ledger_Open_Trial_Balance.csv"
                      >
                        Download Sample{" "}
                      </a>
                    </div> */}
                                    </div>
                                </div>
                            </div>
                            {loading && <Loader />}

                            <div className=" mt-56 department-tbl-mt-dv">
                                <Paper className={classes.tabroot} id="department-tbl-fix ">
                                    <div
                                        className="table-responsive new-add_stock_group_tbel"
                                        style={{ maxHeight: "calc(100vh - 200px)" }}
                                    >
                                        <Table className={classes.table}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell
                                                        className={classes.tableRowPad}
                                                        align="left"
                                                    >
                                                        Ledger Name
                                                    </TableCell>
                                                    <TableCell
                                                        className={classes.tableRowPad}
                                                        align="left"
                                                    >
                                                        Head{" "}
                                                    </TableCell>
                                                    <TableCell
                                                        className={classes.tableRowPad}
                                                        align="left"
                                                    >
                                                        Debit
                                                    </TableCell>
                                                    <TableCell
                                                        className={classes.tableRowPad}
                                                        align="left"
                                                    >
                                                        Credit
                                                    </TableCell>

                                                    <TableCell
                                                        className={classes.tableRowPad}
                                                        align="left"
                                                    >
                                                        Action
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow></TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {otbData.map((e, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell>{e.ledger_name}</TableCell>
                                                        <TableCell>{e.head}</TableCell>
                                                        <TableCell>
                                                            {e.isEditable ? (
                                                                <TextField
                                                                    type="text"
                                                                    name="debit_amount"
                                                                    value={e.debit_amount}
                                                                    onChange={(event) =>
                                                                        handleInputChangeOTb(event, i)
                                                                    }
                                                                />
                                                            ) : (
                                                                e.debit_amount
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {e.isEditable ? (
                                                                <TextField
                                                                    type="text"
                                                                    name="credit_amount"
                                                                    value={e.credit_amount}
                                                                    onChange={(event) =>
                                                                        handleInputChangeOTb(event, i)
                                                                    }
                                                                />
                                                            ) : (
                                                                e.credit_amount
                                                            )}
                                                        </TableCell>

                                                        <TableCell>
                                                            {e.isEditable ? (
                                                                <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    onClick={() => handeleClickSaveOtb(i)}
                                                                >
                                                                    Save
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    variant="contained"
                                                                    color="secondary"
                                                                    onClick={() => handleEditClickOtb(i)}
                                                                >
                                                                    Edit
                                                                </Button>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </Paper>
                            </div>
                            <div>
                                <Button
                                    variant="contained"
                                    className={clsx(classes.button, "float-right mr-5")}
                                    size="small"
                                    onClick={(event) => {
                                        handleOtbUpdateSave();
                                    }}
                                    style={{
                                        backgroundColor: otbData.length !== 0 ? "#039be5" : "",
                                    }}
                                >
                                    Save Opening Data{" "}
                                </Button>
                            </div>
                            <div className="mt-10">
                                <h2 >Stock in Hand</h2>
                                <div className="flex justify-between">
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            gap: "60px",
                                            flexWrap: "wrap",
                                            // marginLeft: "20px",
                                        }}
                                    >
                                        {
                                            <div>
                                                <Button
                                                    variant="contained"
                                                    className={clsx(classes.button)}
                                                    size="small"
                                                    onClick={(event) => {
                                                        if (selectedDepartmentData) {
                                                            setModalOpenStock(true);
                                                            setMainModale(1);
                                                        } else {
                                                            setDepatmentDataErr("Select Department Name!");
                                                        }
                                                    }}
                                                    style={{
                                                        backgroundColor: mainModale === 1 ? "#039be5" : "",
                                                    }}
                                                >
                                                    IMPORT STOCK DATA
                                                </Button>
                                            </div>
                                        }
                                        <div>
                                            <Button
                                                variant="contained"
                                                className={classes.button}
                                                size="small"
                                                onClick={(event) => {
                                                    if (selectedDepartmentData) {
                                                        setModelTitleLot(true);
                                                        setMainModale(2);
                                                        setLotModalViewTabs(0);
                                                    } else {
                                                        setDepatmentDataErr("Select Department Name!");
                                                    }
                                                }}
                                                style={{
                                                    backgroundColor: mainModale === 2 ? "#039be5" : "",
                                                }}
                                            >
                                                IMPORT TITLE LOT DATA
                                            </Button>
                                        </div>
                                        <div>
                                            <Button
                                                variant="contained"
                                                className={classes.button}
                                                size="small"
                                                onClick={(event) => {
                                                    if (selectedDepartmentData) {
                                                        setModelthreeTabs(true);
                                                        setMainModale(3);
                                                        setThreeTabModeleViewTabs(0);
                                                        setBarCodeFlage(true);
                                                        setPacketFlag(false);
                                                        setPackingFlag(false);
                                                    } else {
                                                        setDepatmentDataErr("Select Department Name!");
                                                    }
                                                }}
                                                style={{
                                                    backgroundColor:
                                                        mainModale === 3 && BarcodeFlag ? "#039be5" : "",
                                                }}
                                            >
                                                IMPORT BARCODE DATA
                                            </Button>
                                        </div>
                                        <div>
                                            <Button
                                                variant="contained"
                                                className={classes.button}
                                                size="small"
                                                onClick={(event) => {
                                                    if (selectedDepartmentData) {
                                                        setModelthreeTabs(true);
                                                        setMainModale(3);
                                                        setThreeTabModeleViewTabs(0);

                                                        setPackingFlag(true);
                                                        setBarCodeFlage(false);
                                                        setPacketFlag(false);
                                                    } else {
                                                        setDepatmentDataErr("Select Department Name!");
                                                    }
                                                }}
                                                style={{
                                                    backgroundColor:
                                                        mainModale === 3 && packigFlag ? "#039be5" : "",
                                                }}
                                            >
                                                IMPORT PACKING SILP DATA
                                            </Button>
                                        </div>
                                        <div>
                                            <Button
                                                variant="contained"
                                                className={classes.button}
                                                size="small"
                                                onClick={(event) => {
                                                    if (selectedDepartmentData) {
                                                        setModelthreeTabs(true);
                                                        setMainModale(3);
                                                        setThreeTabModeleViewTabs(0);

                                                        setPacketFlag(true);
                                                        setPackingFlag(false);
                                                        setBarCodeFlage(false);
                                                    } else {
                                                        setDepatmentDataErr("Select Department Name!");
                                                    }
                                                }}
                                                style={{
                                                    backgroundColor:
                                                        mainModale === 3 && PacketeFlag ? "#039be5" : "",
                                                }}
                                            >
                                                IMPORT PACKET DATA
                                            </Button>
                                        </div>
                                    </div>
                                    {mainModale === 1 && (
                                        <div className="float-right mr-12 ">
                                            <Button
                                                variant="contained"
                                                // color="primary"
                                                className={classes.button}
                                                aria-label="Register"
                                                onClick={(e) => {
                                                    handleStockInHandSave(e);
                                                }}
                                            >
                                                Save Stock Data
                                            </Button>
                                        </div>
                                    )}
                                    {mainModale === 2 && (
                                        <div className="float-right mr-12 ">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className={classes.button}
                                                aria-label="Register"
                                                onClick={(e) => {
                                                    handleLotTitleSave(e);
                                                }}
                                            >
                                                Save Lot Data
                                            </Button>
                                        </div>
                                    )}
                                    {mainModale === 3 && (
                                        <div className="float-right mr-12 ">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className={classes.button}
                                                aria-label="Register"
                                                onClick={(e) => {
                                                    handelThreetabSave(e);
                                                }}
                                            >
                                                {BarcodeFlag === true && "Save BarCode Data"}
                                                {packigFlag === true && "Save Packing Data"}
                                                {PacketeFlag === true && "Save Packet Data"}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {mainModale === 0 && (
                                <div className="mt-20 flex justify-center align-middle text-center">
                                    <h3>Upload Stock In Hand </h3>
                                </div>
                            )}
                            {mainModale === 1 && (
                                <div
                                    className={` mt-56 department-tbl-mt-dv repairedissue-tabl`}
                                    style={{ marginTop: "20px" }}
                                >
                                    {/* <p>Some content or children or something.</p> */}
                                    <div
                                        className="design_list_tbl table-responsive design_list_blg view_design_list_blg"
                                        style={{
                                            height: "calc(30vh - 100px)",
                                            overflowX: "auto",
                                            overflowY: "auto",
                                            margin: "5px 10px 20px 0px",
                                        }}
                                    >
                                        {" "}
                                        <Table className={classes.table}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell className={classes.tableRowPad}>
                                                        Stock Code
                                                    </TableCell>
                                                    <TableCell
                                                        className={classes.tableRowPad}
                                                        align="left"
                                                    >
                                                        Purity
                                                    </TableCell>
                                                    <TableCell
                                                        className={classes.tableRowPad}
                                                        align="left"
                                                    >
                                                        Gross weight
                                                    </TableCell>
                                                    <TableCell
                                                        className={classes.tableRowPad}
                                                        align="left"
                                                    >
                                                        Net weight
                                                    </TableCell>
                                                    <TableCell className={classes.tableRowPad}>
                                                        Pieces
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {StockCodeData.map((e, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell className={classes.tableRowPad}>
                                                            {e.Stock_Code}
                                                        </TableCell>
                                                        <TableCell className={classes.tableRowPad}>
                                                            {e.purity}
                                                        </TableCell>
                                                        <TableCell className={classes.tableRowPad}>
                                                            {e.gross_weight}
                                                        </TableCell>
                                                        <TableCell className={classes.tableRowPad}>
                                                            {e.net_weight}
                                                        </TableCell>
                                                        <TableCell className={classes.tableRowPad}>
                                                            {e.pcs}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            )}
                            {mainModale === 2 && (
                                <Grid className="salesjobwork-table-main artician_cate_jewellry_tbl  artician_cate_jewellry_blg addsales-jobreturn-domestic-dv ">
                                    <div className="mt-16">
                                        <AppBar position="static"
                            className="add-header-purchase"
                            >
                                            <Tabs
                                                value={lotModalViewTabs}
                                                onChange={handleLotTabChange}
                                            >
                                                <Tab label="Lot Details" />
                                                <Tab label="Bom Details" />
                                            </Tabs>
                                        </AppBar>
                                        {lotModalViewTabs === 0 && (
                                            <div
                                                className="design_list_tbl table-responsive design_list_blg view_design_list_blg"
                                                style={{
                                                    height: "calc(60vh)",
                                                    overflowX: "auto",
                                                    overflowY: "auto",
                                                    margin: "10px 10px 20px 0px",
                                                }}
                                            >
                                                <MaUTable className={classes.table}>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Category
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Billing Category
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Lot No
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Pieces
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Gross Weight
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Net Weight
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Purity
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {lotTitleData.map((e, i) => (
                                                            <TableRow key={i}>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {e.Category}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {e.billingCategoryName}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {e.lotNumber}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {e.pcs}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {e.gross_wt}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {e.net_wt}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {e.purity}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </MaUTable>
                                            </div>
                                        )}
                                        {lotModalViewTabs === 1 && (
                                            <div
                                                className="design_list_tbl table-responsive design_list_blg view_design_list_blg"
                                                style={{
                                                    height: "calc(60vh)",
                                                    overflowX: "auto",
                                                    overflowY: "auto",
                                                    margin: "10px 10px 20px 0px",
                                                }}
                                            >
                                                <MaUTable className={classes.table}>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell className={classes.tableRowPad}>
                                                                lotNumber
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Stock Code
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Design No
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Design Pieces
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Batch No
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Pieces
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Weight
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {lotTitleBomData.map((e, i) => (
                                                            <TableRow key={i}>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {e.number}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {e?.DesignStockCodes?.stock_name_code}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {e?.LotDesignData?.variant_number}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {e.pcs}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {e.batch_no}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {e.weight}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </MaUTable>
                                            </div>
                                        )}
                                    </div>
                                </Grid>
                            )}
                            {mainModale === 3 && (
                                <Grid className="salesjobwork-table-main cate_jewellry_tbl  view addsales-jobreturn-domestic-dv  ">
                                    <div className="">
                                        <AppBar position="static"
                            className="add-header-purchase"
                            >
                                            {mainModale === 3 && BarcodeFlag === true ? (
                                                <Tabs
                                                    value={threeTabModeleViewTabs}
                                                    onChange={handleThreeetbsChange}
                                                >
                                                    <Tab label="Category Wise List" />
                                                    <Tab label="Tag Wise List" />
                                                </Tabs>
                                            ) : null}

                                            {mainModale === 3 && packigFlag === true ? (
                                                <Tabs
                                                    value={threeTabModeleViewTabs}
                                                    onChange={handleThreeetbsChange}
                                                >
                                                    <Tab label="Category Wise List" />
                                                    <Tab label="Tag Wise List" />
                                                    <Tab label="PACKET Wise List" />
                                                    <Tab label="PACKING SLIP Wise List" />
                                                </Tabs>
                                            ) : null}
                                            {mainModale === 3 && PacketeFlag === true ? (
                                                <Tabs
                                                    value={threeTabModeleViewTabs}
                                                    onChange={handleThreeetbsChange}
                                                >
                                                    <Tab label="Category Wise List" />
                                                    <Tab label="Tag Wise List" />
                                                    <Tab label="PACKET Wise List" />
                                                </Tabs>
                                            ) : null}
                                        </AppBar>
                                        {threeTabModeleViewTabs === 0 && (
                                            <div
                                                className="design_list_tbl table-responsive design_list_blg view_design_list_blg"
                                                style={{
                                                    height: "calc(60vh)",
                                                    overflowX: "auto",
                                                    overflowY: "auto",
                                                    margin: "10px 10px 20px 0px",
                                                }}
                                            >
                                                <MaUTable className={classes.table}>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Category
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Billing Category
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Pieces
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Gross Weight
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Net Weight
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Purity
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {threeTabsData.map((row, i) => (
                                                            <TableRow key={i}>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {row.Category}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {row.billingCategoryName}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {row.pcs}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {row.gross_wt}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {row.net_wt}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {row.purity}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </MaUTable>
                                            </div>
                                        )}
                                        {threeTabModeleViewTabs === 1 && (
                                            <div
                                                className="design_list_tbl table-responsive design_list_blg view_design_list_blg"
                                                style={{
                                                    height: "calc(60vh)",
                                                    overflowX: "auto",
                                                    overflowY: "auto",
                                                    margin: "10px 10px 20px 0px",
                                                }}
                                            >
                                                <MaUTable className={classes.table}>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Stock Code
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Design Variant Number
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Billing Category
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Pieces
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Gross Weight
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Net Weight
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Purity
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {threeTabsDataTags.map((row, i) => (
                                                            <TableRow key={i}>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {row.Category}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {row.design_no}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {row.billingCategoryName}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {row.pcs}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {row.gross_wt}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {row.net_wt}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {row.purity}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </MaUTable>
                                            </div>
                                        )}
                                        {threeTabModeleViewTabs === 2 && (
                                            <div
                                                className="design_list_tbl table-responsive design_list_blg view_design_list_blg"
                                                style={{
                                                    height: "calc(60vh)",
                                                    overflowX: "auto",
                                                    overflowY: "auto",
                                                    margin: "10px 10px 20px 0px",
                                                }}
                                            >
                                                <MaUTable className={classes.table}>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Packet No
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Billing Category
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                HSN
                                                            </TableCell>

                                                            <TableCell className={classes.tableRowPad}>
                                                                Pieces
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Gross Weight
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Net Weight
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Purity
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {threeTabsDataPacket?.map((row, i) => (
                                                            <TableRow key={i}>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {row.packet_no}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {row.billingCategoryName}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {row.hsnNumber}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {row.pcs}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {row.gross_wt}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {row.net_wt}
                                                                </TableCell>

                                                                <TableCell className={classes.tableRowPad}>
                                                                    {row.purity}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </MaUTable>
                                            </div>
                                        )}
                                        {threeTabModeleViewTabs === 3 && (
                                            <div
                                                className="design_list_tbl table-responsive design_list_blg view_design_list_blg"
                                                style={{
                                                    height: "calc(60vh)",
                                                    overflowX: "auto",
                                                    overflowY: "auto",
                                                    margin: "10px 10px 20px 0px",
                                                }}
                                            >
                                                <MaUTable className={classes.table}>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Packing Slip No
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Billing Category
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                HSN
                                                            </TableCell>

                                                            <TableCell className={classes.tableRowPad}>
                                                                Pieces
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Gross Weight
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Net Weight
                                                            </TableCell>
                                                            <TableCell className={classes.tableRowPad}>
                                                                Purity
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {threeTabsDataPackingDa.map((row, i) => (
                                                            <TableRow key={i}>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {row.packing_slip_no}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {row.billingCategoryName}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {row.hsnNumber}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {row.pcs}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {row.gross_wt}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {row.net_wt}
                                                                </TableCell>
                                                                <TableCell className={classes.tableRowPad}>
                                                                    {row.purity}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </MaUTable>
                                            </div>
                                        )}
                                    </div>
                                </Grid>
                            )}
                        </div>
                    </div>
                    </div>
                </FuseAnimate>
            </div>
            <div>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={modalOpenStock} // Add the condition here
                    onClose={(_, reason) => {
                        if (reason !== "backdropClick") {
                            handleFormatModalClose();
                        }
                    }}
                >
                    <div style={modalStyle} className={clsx(classes.paper, "rounded-8")}>
                        <h5
                            className="p-20 popup-head"
                            style={{
                                textAlign: "center",
                                backgroundColor: "#415BD4",
                                color: "white",
                            }}
                        >
                            Upload Stock File
                            <IconButton
                                style={{ position: "absolute", top: "0", right: "0" }}
                                onClick={handleFormatModalClose}
                            >
                                <Icon style={{ color: "white" }}>close</Icon>
                            </IconButton>
                        </h5>

                        <div className="p-5 pl-16 pr-16">
                          <p className="popup-labl p-4 ">Upload CSV Excel File</p>

                            <TextField
                                id="fileinputstock"
                                className="mt-16 mb-16"
                                label="Upload CSV Excel File"
                                name="stockcode"
                                type="file"
                                error={stockCodeErr.length > 0 ? true : false}
                                helperText={stockCodeErr}
                                onChange={(e) => handleInputstockecodeChangea(e)}
                                variant="outlined"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <Grid
                                item
                                lg={6}
                                md={6}
                                sm={6}
                                xs={12}
                                style={{ padding: 2 }}
                                className=""
                            >
                                <a
                                    href={stockDataFile}
                                    download="Stock_code_opeening_balance.csv"
                                >
                                    Download Sample{" "}
                                </a>
                            </Grid>

          <div className="flex flex-row justify-between">
              <Button
                variant="contained"
                className="w-155 mt-5 popup-cancel delete-dialog-box-cancle-button"
                onClick={handleFormatModalClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                className=" mt-5 save-button-css"
                onClick={(e) => handleStockeCodeFileUpload(e)}
                >
                upload a file
              </Button>
            </div>
                            
                        </div>
                    </div>
                </Modal>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={modelTitleLot}
                    onClose={(_, reason) => {
                        if (reason !== "backdropClick") {
                            handleFormatModalClose();
                        }
                    }}
                >
                    <div style={modalStyle} className={clsx(classes.paper, "rounded-8")}>
                        <h5
                            className="p-20 popup-head"
                            style={{
                                textAlign: "center",
                                backgroundColor: "#415BD4",
                                color: "white",
                            }}
                        >
                            Upload Lot Title File
                            <IconButton
                                style={{ position: "absolute", top: "0", right: "0" }}
                                onClick={handleFormatModalClose}
                            >
                                <Icon style={{ color: "white" }}>close</Icon>
                            </IconButton>
                        </h5>

                        <div className="p-5 pl-16 pr-16">
                     <p className="popup-labl p-4 ">Upload Lot Title File</p>

                            <TextField
                                id="inputlotTitle"
                                className="mt-16 mb-16"
                                // label="Upload CSV Excel File"
                                name="lottitle"
                                type="file"
                                error={lotTitleErr.length > 0 ? true : false}
                                helperText={lotTitleErr}
                                onChange={(e) => handleInputLotTitleeChangea(e)}
                                variant="outlined"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <Grid
                                item
                                lg={6}
                                md={6}
                                sm={6}
                                xs={12}
                                style={{ padding: 2 }}
                                className=""
                            >
                                <a href={lotTitileFile} download="Load_lot_doirectly.csv">
                                    Download Sample{" "}
                                </a>
                            </Grid>
                            <div className="flex flex-row justify-between">
              <Button
                variant="contained"
                className="w-155 mt-5 popup-cancel delete-dialog-box-cancle-button"
                onClick={handleFormatModalClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                className=" mt-5 save-button-css"
                onClick={(e) => handleLotTitleFileUpload(e)}
                >
                upload a file
              </Button>
            </div>
                            
                        </div>
                    </div>
                </Modal>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={modalOpen}
                    onClose={(_, reason) => {
                        if (reason !== "backdropClick") {
                            handleFormatModalClose();
                        }
                    }}
                >
                    <div style={modalStyle} className={clsx(classes.paper, "rounded-8")}>
                        <h5
                            className="p-20 popup-head"
                            style={{
                                textAlign: "center",
                                backgroundColor: "#415BD4",
                                color: "white",
                            }}
                        >
                            Upload File Open Trial File
                            <IconButton
                                style={{ position: "absolute", top: "0", right: "0" }}
                                onClick={handleFormatModalClose}
                            >
                                <Icon style={{ color: "white" }}>close</Icon>
                            </IconButton>
                        </h5>

                        <div className="p-5 pl-16 pr-16">
                          <p className="popup-labl p-4 ">Upload CSV Excel File</p>

                            <TextField
                                id="fileinput"
                                className="mt-16 mb-16"
                                // label="Upload CSV Excel File"
                                name="otbFile"
                                type="file"
                                error={otbFileErr.length > 0 ? true : false}
                                helperText={otbFileErr}
                                onChange={(e) => handleInputChangeCsvOtb(e)}
                                variant="outlined"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <Grid
                                item
                                lg={6}
                                md={6}
                                sm={6}
                                xs={12}
                                style={{ padding: 2 }}
                                className=""
                            >
                                <a
                                    href={OtbsampleFile}
                                    download="Ledger_Open_Trial_Balance.csv"
                                >
                                    Download Sample{" "}
                                </a>
                            </Grid>
                            <div className="flex flex-row justify-between">
              <Button
                variant="contained"
                className="w-155 mt-5 popup-cancel delete-dialog-box-cancle-button"
                onClick={handleFormatModalClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                className=" mt-5 save-button-css"
                onClick={(e) => handleOtbFileUplod(e)}
                >
                upload a file
              </Button>
            </div>
                            {/* <Button
                                variant="contained"
                                color="primary"
                                className="w-full mx-auto mt-16"
                                style={{
                                    backgroundColor: "#4caf50",
                                    border: "none",
                                    color: "white",
                                }}
                                onClick={(e) => handleOtbFileUplod(e)}
                            >
                                Upload
                            </Button> */}
                        </div>
                    </div>
                </Modal>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={modelThreeTabs}
                    onClose={(_, reason) => {
                        if (reason !== "backdropClick") {
                            handleFormatModalClose();
                        }
                    }}
                >
                    <div style={modalStyle} className={clsx(classes.paper, "rounded-8")}>
                        <h5
                            className="p-20 popup-head"
                            style={{
                                textAlign: "center",
                                backgroundColor: "#415BD4",
                                color: "white",
                            }}
                        >
                            {BarcodeFlag === true && "Upload BarCode File"}
                            {packigFlag === true && "Upload Packing File"}
                            {PacketeFlag === true && "Upload Packet File"}{" "}
                            <IconButton
                                style={{ position: "absolute", top: "0", right: "0" }}
                                onClick={handleFormatModalClose}
                            >
                                <Icon style={{ color: "white" }}>close</Icon>
                            </IconButton>
                        </h5>

                        <div className="p-5 pl-16 pr-16">
                         <p className="popup-labl p-4 ">Upload CSV Excel File</p>

                            <TextField
                                id="threetabs"
                                className="mt-16 mb-16"
                                // label="Upload CSV Excel File"
                                name="otbFile"
                                type="file"
                                error={threeTabsErr.length > 0 ? true : false}
                                helperText={threeTabsErr}
                                onChange={(e) => handleInputThreeTabsChangea(e)}
                                variant="outlined"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />

                            {BarcodeFlag === true && (
                                <Grid
                                    item
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    xs={12}
                                    style={{ padding: 2 }}
                                    className=""
                                >
                                    <a href={BarcodeDataFile} download="Load_Barcode_wise.csv">
                                        Download Sample{" "}
                                    </a>
                                </Grid>
                            )}

                            {packigFlag === true && (
                                <Grid
                                    item
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    xs={12}
                                    style={{ padding: 2 }}
                                    className=""
                                >
                                    <a
                                        href={PackingDataFile}
                                        download="Load_Packing_Slip_wise.csv"
                                    >
                                        Download Sample{" "}
                                    </a>
                                </Grid>
                            )}

                            {PacketeFlag === true && (
                                <Grid
                                    item
                                    lg={6}
                                    md={6}
                                    sm={6}
                                    xs={12}
                                    style={{ padding: 2 }}
                                    className=""
                                >
                                    <a href={PacketDataFile} download="Load_Packet_wise.csv">
                                        Download Sample{" "}
                                    </a>
                                </Grid>
                            )}
      <div className="flex flex-row justify-between">
              <Button
                variant="contained"
                className="w-155 mt-5 popup-cancel delete-dialog-box-cancle-button"
                onClick={handleFormatModalClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                className=" mt-5 save-button-css"
                onClick={(e) => handelThreetabsFileupload(e)}
                >
                upload a file
              </Button>
            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default OpningTriBlan;
