import React, { useState, useEffect, useContext } from "react";
import { Typography, TextField, Icon, IconButton } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import { useDispatch } from "react-redux";
import { FuseAnimate } from "@fuse";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Select, { createFilter } from "react-select";
import History from "@history";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { CSVLink } from "react-csv";
import AppContext from "app/AppContext";
import Loader from "../../../Loader/Loader";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
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
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    height: "100%",
  },
  table: {
    // minWidth: 650,
  },
  tableRowPad: {
    padding: 7,
  },
  tableFooter: {
    padding: 7,
    backgroundColor: "#E3E3E3",
  },
  selectBox: {
    marginLeft: "0.5rem",
    width: "10%",
    display: "inline-block",
  },
}));

const RecFromHallmark = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [remark, setRemark] = useState("");

  const [reqNumber, setReqNumber] = useState("");
  const [reqNumberErr, setReqNumberErr] = useState("");

  const [selectedClient, setSelectedClient] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedHmStation, setSelectedHmStation] = useState("");

  const [rejectPcs, setRejectPcs] = useState([]);
  const [scrapingPcs, setScrapingPcs] = useState([]);
  const [passPcs, setPassPcs] = useState([]);
  const [allPcsList, setAllPcsList] = useState([]);

  const [downLoadData, setDownloadData] = useState([]);
  const hiddenFileInput = React.useRef(null);
  const appContext = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const { selectedDepartment } = appContext;

  const [grossWgtReject, setGrossWgtReject] = useState(0);
  const [netWgtReject, setNetWgtReject] = useState(0);
  const [pcsReject, setPcsReject] = useState(0);

  const [grossWgtScap, setGrossWgtScap] = useState(0);
  const [netWgtScap, setNetWgtScap] = useState(0);
  const [pcsScap, setPcsScap] = useState(0);
  const [newGrossScap, setNewGrossScap] = useState(0);
  const [newNetScap, setNewNetScap] = useState(0);
  const [scrapFine, setScrapFine] = useState(0);

  const [passGrossWgt, setPassGrossWgt] = useState(0);
  const [passNetWgt, setPassNetWgt] = useState(0);
  const [passPcsTotal, setPassPcsTotal] = useState(0);
  const [passFine, setPassFine] = useState(0);

  const [allGrossWgt, setAllGrossWgt] = useState(0);
  const [allPcsTotal, setAllPcsTotal] = useState(0);
  const [allNetWgt, setAllNetWgt] = useState(0);
  const [allFineTotal, setAllFineTotal] = useState(0);
  const [slipId, setSlipId] = useState("");
  const [edit, setEdit] = useState(false);
  const [fileUploadStatus, setFileUploadStatus] = useState(false);
  const [issueId, setIssueId] = useState("");
  const [issueStatusId, setIssueStatusId] = useState("");
  const [totalCornetFine, setTotalCornetFine] = useState(0);
  const [stockList, setStockList] = useState([]);
  const [cornetArr, setCornetArr] = useState([
    {
      stockCode: "",
      purity: "",
      weight: "",
      fine: 0,
      errors: {},
    },
  ]);

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
    NavbarSetting("Hallmark", dispatch);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (reqNumber && reqNumber.length > 2) {
        getReceiveSlipData(reqNumber);
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
  }, [reqNumber]);

  useEffect(() => {
    if (reqNumber && reqNumber.length > 2) {
      getReceiveSlipData(reqNumber);
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (issueId) {
      getStockCodeMetal();
      if (issueStatusId === 2 && !edit) {
        getUploadIsuueData();
        getCornetData();
      }
    }
  }, [issueId, issueStatusId]);

  useEffect(() => {
    if (fileUploadStatus) {
      getUploadIsuueData();
    }
  }, [fileUploadStatus]);

  useEffect(() => {
    if (edit && issueId && issueStatusId === 2) {
      getUploadIsuueData();
      getCornetData();
    }
  }, [edit, issueId, issueStatusId]);

  useEffect(() => {
    if (props.location.state) {
      setEdit(true);
      setReqNumber(props.location.state.reqId);
      setReqNumberErr("");
    }
  }, [dispatch]);

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 7000);
    }
  }, [loading]);

  function getStockCodeMetal() {
    axios
      .get(Config.getCommonUrl() + "api/stockname/metal")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          const stockData = response.data.data;
          setStockList(stockData);
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
        handleError(error, dispatch, { api: "api/stockname/metal" });
      });
  }

  function getCornetData() {
    axios
      .get(Config.getCommonUrl() + `api/hallmarkissue/cornet/get/${issueId}`)
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          if (response.data.data.length > 0) {
            const tempData = response.data.data;
            let cornetTotalFine = 0;
            const arrData = tempData.map((item) => {
              cornetTotalFine += parseFloat(item.fine);
              return {
                stockCode: {
                  value: item.stock_code_id,
                  label: item.StockCodeDetails.stock_code,
                },
                purity: item.StockCodeDetails.purity,
                weight: item.weight,
                fine: parseFloat(item.fine),
                errors: {},
              };
            });
            setCornetArr(arrData);
            setTotalCornetFine(cornetTotalFine);
          } else {
            setCornetArr([
              {
                stockCode: "",
                purity: "",
                weight: "",
                fine: 0,
                errors: {},
              },
            ]);
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
          api: `api/hallmarkissue/cornet/get/${issueId}`,
        });
      });
  }

  function getReceiveSlipData(reqNumber) {
    setLoading(true);
    axios
      .get(
        Config.getCommonUrl() +
          `api/hallmarkissue/hallmark/slip/${reqNumber}/${
            selectedDepartment.value.split("-")[1]
          }`
      )
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          const tempData = response.data.data;
          setIssueId(tempData.id);
          setIssueStatusId(tempData.issue_status);
          setSelectedClient({
            value: tempData.client_id,
            label: tempData.Client.name,
          });
          setSelectedCompany({
            value: tempData.firm_id,
            label: tempData.Company.company_name,
          });
          setSelectedHmStation({
            value: tempData.station,
            label: tempData.HallmarkIssueStation.name,
          });
          callSlipApiDownload(response.data.PackingSlipArr);
          setSlipId(response.data.PackingSlipArr);
          setRemark(tempData.remark);
          setLoading(false);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
          setLoading(false);
        }
      })
      .catch(function (error) {
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/hallmarkissue/hallmark/slip/${reqNumber}/${
            selectedDepartment.value.split("-")[1]
          }`,
        });
      });
  }

  function callSlipApiDownload(arrId) {
    const body = {
      packing_slip_id: arrId,
    };
    axios
      .post(
        Config.getCommonUrl() + "api/packingslip/packingSlip/array/data",
        body
      )
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          const arrData = [];
          response.data.data.map((temp) => {
            temp.productData.map((item) => {
              arrData.push({
                PKG_NO: item.packing_slip_no,
                Packet_Catg: item.category_name,
                BARCODE: '=""' + item.barcode + '""', //item.barcode,
                KT: item.karat,
                Pcs: item.pcs,
                GR_WT: item.gross_wgt,
                NR_WT: item.net_wgt,
                HUID: "",
                "Issue Type": "",
                "Hallmark Job Card No": "",
              });
            });
          });
          setDownloadData(arrData);
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
          api: "api/packingslip/packingSlip/array/data",
          body: body,
        });
      });
  }

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === "reqNumber") {
      setReqNumber(value);
      setReqNumberErr("");
    }
  };

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handlefilechange = (event) => {
    event.preventDefault();
    if (reqNumber && selectedClient) {
      const file = event.target.files;
      const formData = new FormData();
      for (let i = 0; i < file.length; i++) {
        formData.append("file", file[i]);
      }
      uploadFileApi(formData);
    } else {
      dispatch(
        Actions.showMessage({
          message: "Please Enter Request Number",
          variant: "error",
        })
      );
    }
  };

  const uploadFileApi = (formData) => {
    setLoading(true);
    const body = formData;
    axios
      .post(
        Config.getCommonUrl() +
          `api/hallmarkIssue/hallmark/issuecheck/${issueId}`,
        body
      )
      .then((response) => {
        console.log(response);
        if (response.data.success === true) {
          dispatch(
            Actions.showMessage({
              message: "File upload successfully",
              variant: "success",
            })
          );
          setFileUploadStatus(true);
        } else {
          let downloadUrl = response.data.url;
          window.open(downloadUrl);
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
          document.getElementById("fileinput").value = "";
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/hallmarkIssue/hallmark/issuecheck/${issueId}`,
          body: body,
        });
        document.getElementById("fileinput").value = "";
      });
  };

  function getUploadIsuueData() {
    setLoading(true);
    axios
      .get(
        Config.getCommonUrl() +
          `api/hallmarkissue/receive/upload/list/${reqNumber}/${
            selectedDepartment.value.split("-")[1]
          }`
      )
      .then(function (response) {
        console.log(response);
        if (response.data.success === true) {
          const arrData = response.data.data;

          let passGross = 0;
          let passNet = 0;
          let pcsPass = 0;
          let passFine = 0;

          let rejectGross = 0;
          let rejectNet = 0;
          let pcsForReject = 0;

          let scrapingGross = 0;
          let scrapingNet = 0;
          let pcsForScrap = 0;
          let newGrossTotal = 0;
          let newNetTotal = 0;
          let fineTotal = 0;

          let grossAllTotal = 0;
          let netAllTotal = 0;
          let pcsAllTotal = 0;
          let fineTotalPcs = 0;

          arrData.map((item) => {
            if (item.issue_type === 1) {
              item.finePass = (item.net_wt * item.purity) / 100;
              passPcs.push(item);
              passGross += parseFloat(item.gross_wt);
              passNet += parseFloat(item.net_wt);
              pcsPass += parseFloat(item.pcs);
              passFine += parseFloat(item.finePass);
              setPassGrossWgt(passGross);
              setPassNetWgt(passNet);
              setPassPcsTotal(pcsPass);
              setPassFine(passFine);
            } else if (item.issue_type === 2) {
              let newNwgt = item.new_net_wgt ? parseFloat(item.new_net_wgt) : 0;
              item.fine = (newNwgt * item.purity) / 100;
              scrapingPcs.push(item);
              scrapingGross += parseFloat(item.gross_wt);
              scrapingNet += parseFloat(item.net_wt);
              pcsForScrap += parseFloat(item.pcs);
              newGrossTotal += item.new_gross_wgt
                ? parseFloat(item.new_gross_wgt)
                : 0;
              newNetTotal += item.new_net_wgt
                ? parseFloat(item.new_net_wgt)
                : 0;
              fineTotal += item.fine ? parseFloat(item.fine) : 0;
              setGrossWgtScap(scrapingGross);
              setNetWgtScap(scrapingNet);
              setPcsScap(pcsForScrap);
              setNewNetScap(newNetTotal);
              setScrapFine(fineTotal);
              setNewGrossScap(newGrossTotal);
            } else if (item.issue_type === 3) {
              rejectPcs.push(item);
              rejectGross += parseFloat(item.gross_wt);
              rejectNet += parseFloat(item.net_wt);
              pcsForReject += parseFloat(item.pcs);
              setGrossWgtReject(rejectGross);
              setNetWgtReject(rejectNet);
              setPcsReject(pcsForReject);
            }
            item.allFine = (item.net_wt * item.purity) / 100;
            allPcsList.push(item);
            grossAllTotal += parseFloat(item.gross_wt);
            netAllTotal += parseFloat(item.net_wt);
            pcsAllTotal += parseFloat(item.pcs);
            fineTotalPcs += parseFloat(item.allFine);
            setAllGrossWgt(grossAllTotal);
            setAllNetWgt(netAllTotal);
            setAllPcsTotal(pcsAllTotal);
            setAllFineTotal(fineTotalPcs);

            setRejectPcs(rejectPcs);
            setScrapingPcs(scrapingPcs);
            setPassPcs(passPcs);
            setAllPcsList(allPcsList);
          });
          setLoading(false);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/hallmarkissue/receive/upload/list/${reqNumber}/${
            selectedDepartment.value.split("-")[1]
          }`,
        });
      });
  }

  const handleStockChange = (stock, index) => {
    const dataArr = [...cornetArr];

    dataArr[index].stockCode = stock;
    dataArr[index].purity = stock.purity;
    if (dataArr[index].errors.stockCode) {
      dataArr[index].errors.stockCode = "";
    }
    setCornetArr(dataArr);
  };

  const onChangeHandle = (e, index) => {
    if (validateStockPurity(index)) {
      const value = e.target.value;
      const dataArr = [...cornetArr];
      let cornetTotalFine = 0;

      dataArr[index].weight = value;
      if (!isNaN(value) && value !== "" && value > 0 && value.length < 8) {
        dataArr[index].fine = (value * dataArr[index].purity) / 100;
        if (dataArr[index].errors.weight) {
          dataArr[index].errors.weight = "";
        }
      } else {
        dataArr[index].errors["weight"] = "Enter valid weight";
      }

      setCornetArr(dataArr);
      dataArr.map((item) => {
        cornetTotalFine += item.fine;
      });
      setTotalCornetFine(cornetTotalFine);
    }
  };

  const validateStockPurity = (index) => {
    const dataArr = [...cornetArr];
    if (dataArr[index].stockCode === "") {
      dataArr[index].errors["stockCode"] = "Please select stock";
      setCornetArr(dataArr);
      return false;
    } else {
      return true;
    }
  };

  const validateWeight = (index) => {
    const dataArr = [...cornetArr];
    if (dataArr[index].weight === "") {
      dataArr[index].errors["weight"] = "Enter valid weight";
      setCornetArr(dataArr);
      return false;
    } else {
      return true;
    }
  };

  function validateRequest() {
    if (reqNumber === "") {
      setReqNumberErr("Please Enter Request Number");
      return false;
    }
    return true;
  }

  const changeGrossNet = (event, id) => {
    const arrData = [...scrapingPcs];
    const name = event.target.name;
    const value = event.target.value;

    let newGrossTotal = 0;
    let newNetTotal = 0;
    let fineTotal = 0;

    arrData.map((data) => {
      if (data.barcode == id) {
        if (name === "newGross") {
          if (!isNaN(value)) {
            data.new_gross_wgt = value;
          }
        } else if (name === "newNet") {
          if (!isNaN(value)) {
            data.new_net_wgt = value;
            data.fine = (data.purity * value) / 100;
          }
        }
      }
      newGrossTotal += data.new_gross_wgt ? parseFloat(data.new_gross_wgt) : 0;
      newNetTotal += data.new_net_wgt ? parseFloat(data.new_net_wgt) : 0;
      fineTotal += data.fine ? parseFloat(data.fine) : 0;
    });
    setNewGrossScap(newGrossTotal);
    setScrapingPcs(arrData);
    setNewNetScap(newNetTotal);
    setScrapFine(fineTotal);
  };

  const addNewRow = (index) => {
    if (
      validateRequest() &&
      validateStockPurity(index) &&
      validateWeight(index)
    ) {
      setCornetArr([
        ...cornetArr,
        {
          stockCode: "",
          purity: "",
          weight: "",
          fine: 0,
          errors: {},
        },
      ]);
    }
  };

  const removeRow = (idToRemove) => {
    if (idToRemove !== 0) {
      const arrData = [...cornetArr];
      let cornetTotalFine = 0;
      const filteredArr = arrData.filter((item, i) => i !== idToRemove);
      setCornetArr(filteredArr);
      filteredArr.map((item) => {
        cornetTotalFine += item.fine;
      });
      setTotalCornetFine(cornetTotalFine);
    } else {
      if (!cornetArr[idToRemove + 1]) {
        setCornetArr([
          {
            stockCode: "",
            purity: "",
            weight: "",
            fine: 0,
            errors: {},
          },
        ]);
        setTotalCornetFine(0);
      } else {
        const arrData = [...cornetArr];
        let cornetTotalFine = 0;
        const filteredArr = arrData.filter((item, i) => i !== idToRemove);
        setCornetArr(filteredArr);
        filteredArr.map((item) => {
          cornetTotalFine += item.fine;
        });
        setTotalCornetFine(cornetTotalFine);
      }
    }
  };

  const validatecornetArr = () => {
    const dataArr = [...cornetArr];
    let flag = true;
    dataArr.map((item, index) => {
      if (item.stockCode === "") {
        dataArr[index].errors["stockCode"] = "Please select stock";
        flag = false;
      } else if (item.weight === "") {
        dataArr[index].errors["weight"] = "Enter valid weight";
        flag = false;
      }
    });
    setCornetArr(dataArr);
    return flag;
  };

  function validateNewWeight() {
    if (scrapingPcs.length > 0) {
      const dataArr = [...scrapingPcs];
      let flag = true;
      dataArr.map((item, index) => {
        if (item.new_gross_wgt === "") {
          dispatch(
            Actions.showMessage({
              message: `Enter new gross weight for ${item.barcode} stock code`,
            })
          );
          flag = false;
        } else if (item.new_net_wgt === "") {
          dispatch(
            Actions.showMessage({
              message: `Enter new net weight for ${item.barcode} stock code`,
            })
          );
          flag = false;
        }
      });
      setCornetArr(dataArr);
      return flag;
    } else {
      return true;
    }
  }

  const onSaveHallmark = (e) => {
    e.preventDefault();
    // if (validateRequest() && validatecornetArr() && validateEmptyError()) {
    if (validateRequest() && validateNewWeight()) {
      callAddFromHallmark();
    }
  };
  const validateEmptyError = () => {
    let flag = true;
    cornetArr.map((item) => {
      if (!errorCheck(item.errors)) {
        flag = false;
      }
    });
    return flag;
  };

  const errorCheck = (error) => {
    let valid = true;
    Object.values(error).forEach((val) => val.length > 0 && (valid = false));
    return valid;
  };

  const callAddFromHallmark = () => {
    if (cornetArr[0].weight !== "") {
      var corData = cornetArr.map((item) => {
        return {
          hallmark_issue_id: issueId,
          stock_code_id: item.stockCode.value,
          weight: item.weight,
          fine: item.fine,
        };
      });
    } else {
      var corData = [];
    }
    if (scrapingPcs.length > 0) {
      var data = scrapingPcs.map((item) => {
        return {
          id: item.id,
          new_gross_wgt: item.new_gross_wgt,
          new_net_wgt: item.new_net_wgt,
        };
      });
    } else {
      var data = [];
    }
    const body = {
      product_id: data,
      cornet: corData,
      slip_id: slipId,
      department_id: selectedDepartment.value.split("-")[1],
      remark: remark,
    };
    axios
      .put(
        Config.getCommonUrl() +
          `api/hallmarkissue/scrap/weight/update/new/weight/${issueId}`,
        body
      )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          History.push("/dashboard/hallmark");
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
          api: `api/hallmarkissue/scrap/weight/update/new/weight/${issueId}`,
          body: body,
        });
      });
  };

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container table-width-mt">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20">
            <Grid
              className="recfrom-full-width pb-8"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={6} sm={6} md={6} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Receive For Hallmarking
                  </Typography>
                </FuseAnimate>
              </Grid>

              <Grid
                item
                xs={6}
                sm={6}
                md={6}
                key="2"
                style={{ textAlign: "right" }}
              >
                {/* <Button
                  variant="contained"
                  className={classes.button}
                  size="small"
                  onClick={(event) => {
                    History.goBack();
                  }}
                >
                  Back
                </Button> */}
                <div className="btn-back mt-1">
                  {" "}
                  <img src={Icones.arrow_left_pagination} alt="" />
                  <Button
                    id="btn-back"
                    className=""
                    size="small"
                    onClick={(event) => {
                      History.goBack();
                    }}
                  >
                    Back
                  </Button>
                </div>

                <Button
                  id="btn-save"
                  variant="contained"
                  className="mr-8"
                  size="small"
                  onClick={onSaveHallmark}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
            {loading && <Loader />}
            <div
              className="pb-32 pt-32 pl-16 pr-20 main-div-alll"
              style={{ marginBottom: "10%", height: "90%" }}
            >
              <Grid container spacing={3}>
                <Grid item lg={2} md={4} xs={4} style={{ padding: 5 }}>
                  <label>Request no</label>
                  <TextField
                    className=""
                    placeholder="Request no"
                    name="reqNumber"
                    value={reqNumber}
                    error={reqNumberErr.length > 0 ? true : false}
                    helperText={reqNumberErr}
                    disabled={edit ? true : false}
                    onChange={(e) => handleInputChange(e)}
                    variant="outlined"
                    fullWidth
                  />
                </Grid>

                <Grid item lg={3} md={4} xs={4} style={{ padding: 5 }}>
                  <label>Party name</label>
                  <Select
                    classes={classes}
                    styles={selectStyles}
                    filterOption={createFilter({ ignoreAccents: false })}
                    value={selectedClient}
                    isDisabled
                    placeholder="Party name"
                  />
                </Grid>

                <Grid item lg={3} md={4} xs={4} style={{ padding: 5 }}>
                  <label>Firm name</label>
                  <Select
                    classes={classes}
                    styles={selectStyles}
                    filterOption={createFilter({ ignoreAccents: false })}
                    value={selectedCompany}
                    isDisabled
                    placeholder="Firm name"
                  />
                </Grid>

                <Grid item lg={3} md={4} xs={4} style={{ padding: 5 }}>
                  <label>Hallmark station</label>
                  <Select
                    classes={classes}
                    styles={selectStyles}
                    filterOption={createFilter({ ignoreAccents: false })}
                    value={selectedHmStation}
                    isDisabled
                    placeholder="Hallmark station"
                  />
                </Grid>

                {downLoadData.length > 0 ? (
                  <IconButton
                    style={{ padding: "0", height: "100%" }}
                    className="ml-0  mt-5"
                  >
                    <CSVLink
                      data={
                        downLoadData.length > 0
                          ? downLoadData
                          : "No data available"
                      }
                      filename={"Receive_Hallmark_list.csv"}
                    >
                      <Icon
                        className="mr-8 download-icone"
                        style={{ color: "dodgerblue" }}
                      >
                        <img src={Icones.download_green} alt="" />
                      </Icon>
                    </CSVLink>
                  </IconButton>
                ) : (
                  ""
                )}

                <Grid item xs={1} style={{ padding: 6 }}>
                  <Button
                    id="btn-save"
                    variant="contained"
                    color="primary"
                    className="mt-20"
                    aria-label="Register"
                    onClick={handleClick}
                  >
                    Upload
                  </Button>
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
              <Grid container spacing={3}>
                <Grid
                  className="mt-16"
                  item
                  lg={7}
                  md={7}
                  sm={12}
                  xs={12}
                  style={{ padding: 6 }}
                >
                  <div className={classes.root}>
                    <div className={classes.root}>
                      <label className="mt-16">
                        <b>Hallmark Rejection Pieces (Type - 3)</b>
                      </label>

                      <div className="my-16">
                        <Paper className={classes.tabroot}>
                          <div
                            id="inner-createpacket-tbl-dv"
                            className={
                              rejectPcs.length >= 5
                                ? `table-responsive hallmarkrejection-firsttabel`
                                : `table-responsive`
                            }
                          >
                            <MaUTable className={classes.table}>
                              <TableHead>
                                <TableRow>
                                  <TableCell className={classes.tableRowPad}>
                                    Stock Code
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    Pieces
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    Hmark Cate
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    Gross Weight
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    Net Weight
                                  </TableCell>
                                  <TableCell
                                    className={classes.tableRowPad}
                                  ></TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {rejectPcs.map((row, i) => (
                                  <TableRow key={i}>
                                    <TableCell className={classes.tableRowPad}>
                                      {row.barcode}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {row.pcs}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {row.product_category}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {row.gross_wt}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {row.net_wt}
                                    </TableCell>
                                    <TableCell
                                      className={classes.tableRowPad}
                                    ></TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                              <TableFooter>
                                <TableRow>
                                  <TableCell
                                    className={classes.tableFooter}
                                  ></TableCell>
                                  <TableCell className={classes.tableFooter}>
                                    <b>{pcsReject}</b>
                                  </TableCell>
                                  <TableCell
                                    className={classes.tableFooter}
                                  ></TableCell>
                                  <TableCell className={classes.tableFooter}>
                                    <b>{grossWgtReject.toFixed(3)}</b>
                                  </TableCell>
                                  <TableCell className={classes.tableFooter}>
                                    <b>{netWgtReject.toFixed(3)}</b>
                                  </TableCell>
                                  <TableCell className={classes.tableFooter}>
                                    <TextField
                                      placeholder="Remark"
                                      value={remark}
                                      onChange={(e) =>
                                        setRemark(e.target.value)
                                      }
                                      inputProps={{
                                        className: "all-Search-box-data",
                                      }}
                                    />
                                  </TableCell>
                                </TableRow>
                              </TableFooter>
                            </MaUTable>
                          </div>
                        </Paper>
                      </div>

                      <label className="mt-16">
                        <b>Scraping Pieces (Type - 2)</b>
                      </label>

                      <div className="my-16">
                        <Paper className={classes.tabroot}>
                          <div
                            id="inner-createpacket-tbl-dv"
                            className={
                              scrapingPcs.length >= 5
                                ? `table-responsive hallmarkrejection-firsttabel`
                                : `table-responsive`
                            }
                          >
                            <MaUTable className={classes.table}>
                              <TableHead>
                                <TableRow>
                                  <TableCell className={classes.tableRowPad}>
                                    Stock Code
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    Purity
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    Pieces
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    Hmark Cate
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    Gross Weight
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    Net Weight
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    New Gross Weight
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    New Net Weight
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    Fine
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {scrapingPcs.map((row, i) => (
                                  <TableRow key={i}>
                                    <TableCell className={classes.tableRowPad}>
                                      {row.barcode}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {row.purity}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {row.pcs}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {row.product_category}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {row.gross_wt}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {row.net_wt}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      <TextField
                                        name="newGross"
                                        placeholder="0"
                                        onChange={(e) =>
                                          changeGrossNet(e, row.barcode)
                                        }
                                        value={
                                          row.new_gross_wgt
                                            ? row.new_gross_wgt
                                            : ""
                                        }
                                      />
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      <TextField
                                        name="newNet"
                                        placeholder="0"
                                        onChange={(e) =>
                                          changeGrossNet(e, row.barcode)
                                        }
                                        value={
                                          row.new_net_wgt ? row.new_net_wgt : ""
                                        }
                                      />
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {row.fine ? row.fine.toFixed(3) : 0}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                              <TableFooter>
                                <TableRow>
                                  <TableCell
                                    className={classes.tableFooter}
                                  ></TableCell>
                                  <TableCell
                                    className={classes.tableFooter}
                                  ></TableCell>
                                  <TableCell className={classes.tableFooter}>
                                    <b>{pcsScap}</b>
                                  </TableCell>
                                  <TableCell
                                    className={classes.tableFooter}
                                  ></TableCell>
                                  <TableCell className={classes.tableFooter}>
                                    <b>{grossWgtScap.toFixed(3)}</b>
                                  </TableCell>
                                  <TableCell className={classes.tableFooter}>
                                    <b>{netWgtScap.toFixed(3)}</b>
                                  </TableCell>
                                  <TableCell className={classes.tableFooter}>
                                    <b>{newGrossScap.toFixed(3)}</b>
                                  </TableCell>
                                  <TableCell className={classes.tableFooter}>
                                    <b>{newNetScap.toFixed(3)}</b>
                                  </TableCell>
                                  <TableCell className={classes.tableFooter}>
                                    <b>{scrapFine.toFixed(3)}</b>
                                  </TableCell>
                                </TableRow>
                              </TableFooter>
                            </MaUTable>
                          </div>
                        </Paper>
                      </div>
                      <label className="mt-16">
                        <b>Pass Pieces (Type - 1)</b>
                      </label>
                      <div className="my-16">
                        <Paper className={classes.tabroot}>
                          <div
                            id="inner-createpacket-tbl-dv"
                            className={
                              passPcs.length >= 5
                                ? `table-responsive hallmarkrejection-firsttabel`
                                : `table-responsive`
                            }
                          >
                            <MaUTable className={classes.table}>
                              <TableHead>
                                <TableRow>
                                  <TableCell className={classes.tableRowPad}>
                                    Stock Code
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    Pieces
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    Hmark Cate
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    Gross Weight
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    Net Weight
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    Fine
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {passPcs.map((row, i) => (
                                  <TableRow key={i}>
                                    <TableCell className={classes.tableRowPad}>
                                      {row.barcode}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {row.pcs}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {row.product_category}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {row.gross_wt}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {row.net_wt}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {row.finePass.toFixed(3)}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                              <TableFooter>
                                <TableRow>
                                  <TableCell
                                    className={classes.tableFooter}
                                  ></TableCell>
                                  <TableCell className={classes.tableFooter}>
                                    <b>{passPcsTotal}</b>
                                  </TableCell>
                                  <TableCell
                                    className={classes.tableFooter}
                                  ></TableCell>
                                  <TableCell className={classes.tableFooter}>
                                    <b>{passGrossWgt.toFixed(3)}</b>
                                  </TableCell>
                                  <TableCell className={classes.tableFooter}>
                                    <b>{passNetWgt.toFixed(3)}</b>
                                  </TableCell>
                                  <TableCell className={classes.tableFooter}>
                                    <b>{passFine.toFixed(3)}</b>
                                  </TableCell>
                                </TableRow>
                              </TableFooter>
                            </MaUTable>
                          </div>
                        </Paper>
                      </div>
                    </div>
                  </div>
                </Grid>

                <Grid
                  className="mt-16"
                  item
                  lg={5}
                  md={5}
                  sm={12}
                  xs={12}
                  style={{ padding: 6 }}
                >
                  <div className={classes.root}>
                    <label>Total Pieces</label>

                    <div className="my-16">
                      <Paper className={classes.tabroot}>
                        <div
                          id="inner-createpacket-tbl-dv"
                          className={
                            allPcsList.length > 3
                              ? `table-responsive totalpcs-tabel-dv`
                              : `table-responsive`
                          }
                        >
                          <MaUTable className={classes.table}>
                            <TableHead>
                              <TableRow>
                                <TableCell className={classes.tableRowPad}>
                                  Stock Code
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Pieces
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Hmark Cate
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Gross Weight
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Net Weight
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Fine
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {allPcsList.map((row, i) => (
                                <TableRow key={i}>
                                  <TableCell className={classes.tableRowPad}>
                                    {row.barcode}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {row.pcs}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {row.product_category}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {row.gross_wt}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {row.net_wt}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {row.allFine.toFixed(3)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            <TableFooter>
                              <TableRow>
                                <TableCell
                                  className={classes.tableFooter}
                                ></TableCell>
                                <TableCell className={classes.tableFooter}>
                                  <b>{allPcsTotal}</b>
                                </TableCell>
                                <TableCell
                                  className={classes.tableFooter}
                                ></TableCell>
                                <TableCell className={classes.tableFooter}>
                                  <b>{allGrossWgt.toFixed(3)}</b>
                                </TableCell>
                                <TableCell className={classes.tableFooter}>
                                  <b>{allNetWgt.toFixed(3)}</b>
                                </TableCell>
                                <TableCell className={classes.tableFooter}>
                                  <b>{allFineTotal.toFixed(3)}</b>
                                </TableCell>
                              </TableRow>
                            </TableFooter>
                          </MaUTable>
                        </div>
                      </Paper>
                    </div>

                    <label className="mt-16">Cornet Details</label>

                    <div className="mt-16 cornet_main_dv">
                      <Paper className={classes.tabroot}>
                        <div
                          id="inner-createpacket-tbl-dv"
                          className={
                            cornetArr.length > 3
                              ? `table-responsive cornet_main_tbel_dv totalpcs-tabel-dv`
                              : `table-responsive`
                          }
                          style={{ overflowX: "inherit" }}
                        >
                          <MaUTable className={classes.table}>
                            <TableHead>
                              <TableRow>
                                <TableCell className={classes.tableRowPad}>
                                  Stock Code
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  purity
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Weight
                                </TableCell>
                                <TableCell className={classes.tableRowPad}>
                                  Fine
                                </TableCell>
                                <TableCell
                                  className={classes.tableRowPad}
                                ></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {cornetArr.map((row, i) => (
                                <TableRow key={i}>
                                  <TableCell className={classes.tableRowPad}>
                                    <label className="pl-2">Stock code</label>
                                    <Select
                                      filterOption={createFilter({
                                        ignoreAccents: false,
                                      })}
                                      className={classes.selectBox}
                                      classes={classes}
                                      styles={selectStyles}
                                      options={stockList.map((suggestion) => ({
                                        value: suggestion.stock_name_code.id,
                                        label:
                                          suggestion.stock_name_code.stock_code,
                                        purity:
                                          suggestion.stock_name_code.purity,
                                      }))}
                                      value={row.stockCode}
                                      onChange={(e) => {
                                        handleStockChange(e, i);
                                      }}
                                      placeholder="Stock Code"
                                    />
                                    {/* <span style={{ color: "red" }}>
                                        {row.errors.stockCode ? row.errors.stockCode : ""}
                                      </span> */}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    <TextField value={row.purity} />
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    <TextField
                                      value={row.weight}
                                      onChange={(e) => onChangeHandle(e, i)}
                                    />
                                    {/* <span style={{ color: "red" }}>
                                        {row.errors.weight ? row.errors.weight : ""}
                                      </span> */}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {row.fine.toFixed(3)}
                                  </TableCell>
                                  <TableCell className={classes.tableRowPad}>
                                    {cornetArr[i + 1] ? (
                                      <>
                                        <IconButton
                                          onClick={() => removeRow(i)}
                                          style={{ padding: "0" }}
                                          tabIndex="-1"
                                        >
                                          <Icon style={{ color: "red" }}>
                                            delete
                                          </Icon>
                                        </IconButton>
                                      </>
                                    ) : (
                                      <>
                                        <IconButton
                                          onClick={() => removeRow(i)}
                                          style={{ padding: "0" }}
                                          tabIndex="-1"
                                        >
                                          <Icon className="mr-8 delete-icone">
                                            <img
                                              src={Icones.delete_red}
                                              alt=""
                                            />
                                          </Icon>
                                        </IconButton>
                                        <IconButton
                                          className="plus_icon_recfrom_dv"
                                          onClick={() => addNewRow(i)}
                                          style={{ padding: "0" }}
                                        >
                                          <Icon style={{}}>add</Icon>
                                        </IconButton>
                                      </>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                            <TableFooter>
                              <TableRow>
                                <TableCell
                                  className={classes.tableFooter}
                                ></TableCell>
                                <TableCell
                                  className={classes.tableFooter}
                                ></TableCell>
                                <TableCell
                                  className={classes.tableFooter}
                                ></TableCell>
                                <TableCell className={classes.tableFooter}>
                                  <b>{totalCornetFine.toFixed(3)}</b>
                                </TableCell>
                                <TableCell
                                  className={classes.tableFooter}
                                ></TableCell>
                              </TableRow>
                            </TableFooter>
                          </MaUTable>
                        </div>
                      </Paper>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </FuseAnimate>
    </div>
  );
};

export default RecFromHallmark;
