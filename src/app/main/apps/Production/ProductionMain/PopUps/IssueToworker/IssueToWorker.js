import { FuseAnimate } from "@fuse";
import History from "@history";
import {
  Box,
  Button,
  Checkbox,
  Grid,
  Icon,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@material-ui/core";
import { Add, Delete, KeyboardBackspace, Search } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import BreadcrumbsHelper from "app/main/BreadCrubms/BreadcrumbsHelper";
import React, { useEffect, useState } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Axios from "axios";
import Config from "app/fuse-configs/Config";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Select, { createFilter } from "react-select";
import HelperFunc from "app/main/apps/SalesPurchase/Helper/HelperFunc";
import { useReactToPrint } from "react-to-print";
import IssueToWorkerPrint from "../../ProductionComp/IssueToWorkerPrint/IssueToWorkerPrint";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import DesignZoomModal from "../../ProductionComp/DesignZoomModal/DesignZoomModal";
import IssueToWorkerTreePrint from "../../ProductionComp/IssueToWorkerPrint/IssueToWorkerTreePrint";
import { HtmlPrintAddApi } from "app/main/apps/Production/ProductionMain/Helper/HtmlPrintAdd";
import ReactDOM from "react-dom";
import { values } from "lodash";
import Icones from "assets/fornt-icons/Mainicons";

const useStyles = makeStyles((theme) => ({
  root: {},
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
  addBtn: {
    display: "block",
    borderRadius: "8px",
    background: "#1E65FD",
    minWidth: "40px",
  },
  addStockTableContainer: {
    fontSize: 14,
    minWidth: 700,
  },
  addTableHead: {
    fontSize: 12,
    lineHeight: 1.5,
    padding: 10,
  },
  scroll: {
    overflowX: "initial",
  },
  setPadding: {
    padding: 8,
  },
  tablePad: {
    padding: 0,
  },
  tableRowPad: {
    padding: 7,
  },
  inputBoxTEST: {
    "& input[type=number]": {
      "-moz-appearance": "textfield",
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
  },
  errorMessage: {
    color: "#f44336",
    position: "absolute",
    bottom: "-7px",
    fontSize: "9px",
    lineHeight: "8px",
  },
}));

const IssueToWorker = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const department_id = window.localStorage.getItem("SelectedDepartment");
  const [apiData, setApiData] = useState([]);
  const [apiDataArray, setApiDataArray] = useState([]);
  const [apiTreeDataArray, setApiTreeDataArray] = useState([]);
  const [lotNo, setLotNo] = useState("");
  const [processLineId, setProcessLineId] = useState("");
  const [processId, setProcessId] = useState("");
  const [purity, setPurity] = useState("");
  const [lotNumberSearch, setLotNumberSearch] = useState("");
  const [treeNumberSearch, setTreeNumberSearch] = useState("");
  const [selectedLotNumber, setSelectedLotNumber] = useState("");
  const [selectedTreeNumber, setSelectedTreeNumber] = useState("");
  const [lotApiData, setLotApiData] = useState([]);
  const [treeApiData, setTreeApiData] = useState([]);
  const [stockCodeList, setStockCodeList] = useState([]);
  const [workStationList, setWorkStationList] = useState([]);
  const [processList, setProcessList] = useState([]);
  const [processLineList, setProcessLineList] = useState([]);
  const [lotDesignList, setLotDesignList] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [transferredRows, setTransferredRows] = useState([]);
  const [designLotSearchData, setDesignLotSearchData] = useState("");
  const [selectedLotSearchData, setSelectedLotSearchData] = useState("");
  const [selectedTreeSearchData, setSelectedTreeSearchData] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [selectedlotId, setSelectedlotId] = useState("");
  const [printObj, setPrintObj] = useState([]);
  const [treePrintObj, setTreePrintObj] = useState([]);
  const [updatedLotId, setUpdatedLotId] = useState([]);
  const [treeOrderDetails, setTreeOrderDetails] = useState([]);
  const [treeNumber, setTreeNumber] = useState("");
  const [lotOrtreeFlag, setLotOrtreeFlag] = useState(0);
  const [addStockData, setAddStockData] = useState([
    {
      lotNo: "",
      batchNo: "",
      stockCode: [],
      purity: "",
      pcs: "",
      weight: "",
      remark: "",
      LotDesigns: [],
      is_batch: "",
      errors: {
        lotNo: "",
        batchNo: "",
        stockCode: "",
        purity: "",
        pcs: "",
        weight: "",
        remark: "",
      },
    },
  ]);

  const [fieldData, setFieldData] = useState({
    workstation: [],
    process: [],
    lotremark: "",
    grossweight: "",
    status: "",
    remark: "",
    errors: {
      workstation: "",
      process: "",
      lotremark: "",
      grossweight: "",
      status: "",
      remark: "",
    },
  });

  useEffect(() => {
    clearData();
    clearTreeData();
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
    const timeout = setTimeout(() => {
      if (treeNumberSearch) {
        getTreeSuggestionData(treeNumberSearch);
      } else {
        setTreeApiData([]);
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
  }, [treeNumberSearch]);

  useEffect(() => {
    if (treeNumberSearch) {
      getTreeSuggestionData();
    }
  }, []);

  useEffect(() => {
    if (lotNumberSearch) {
      getProductData();
    }
  }, []);
  function clearAddMetalAndTransferData() {
    setTransferredRows([]);
    setAddStockData([
      {
        lotNo: "",
        batchNo: "",
        stockCode: [],
        purity: "",
        pcs: "",
        weight: "",
        remark: "",
        LotDesigns: [],
        is_batch: "",
        errors: {
          lotNo: "",
          batchNo: "",
          stockCode: "",
          purity: "",
          pcs: "",
          weight: "",
          remark: "",
        },
      },
    ]);
    setFieldData((prevData) => ({
      ...prevData,
      grossweight: "",
      status: "",
      remark: "",
      errors: {
        ...prevData.errors,
        grossweight: "",
        status: "",
        remark: "",
      },
    }));
  }
  function clearTreeData() {
    setApiTreeDataArray([]);
    setTreeNumber("");
    setTreeOrderDetails([]);
    setSelectedTreeNumber("");
    setSelectedTreeSearchData("");
  }
  function clearData() {
    setApiDataArray([]);
    setFieldData({
      workstation: [],
      process: [],
      lotremark: "",
      grossweight: "",
      status: "",
      remark: "",
      errors: {
        workstation: "",
        process: "",
        lotremark: "",
        grossweight: "",
        status: "",
        remark: "",
      },
    });
    setSelectedLotNumber("");
    setLotDesignList([]);
    setTransferredRows([]);
    setAddStockData([
      {
        lotNo: "",
        batchNo: "",
        stockCode: [],
        purity: "",
        pcs: "",
        weight: "",
        remark: "",
        LotDesigns: [],
        is_batch: "",
        errors: {
          lotNo: "",
          batchNo: "",
          stockCode: "",
          purity: "",
          pcs: "",
          weight: "",
          remark: "",
        },
      },
    ]);
    setLotNo("");
    setProcessId("");
    setPurity("");
    setIsEdit(false);
    setSelectedLotSearchData("");
  }

  const componentRef = React.useRef(null);
  const componentTreeRef = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef(null);

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
    //eslint-disable-next-line
  }, [componentRef.current]);

  const reactToPrintTreeContent = React.useCallback(() => {
    return componentTreeRef.current;
    //eslint-disable-next-line
  }, [componentTreeRef.current]);

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
    const componentInstance = (
      <IssueToWorkerPrint
        ref={componentRef}
        printObj={printObj}
        from="Issue To Workstation For"
      />
    );
    console.log(componentInstance);
    const containerDiv = document.createElement("div");
    ReactDOM.render(componentInstance, containerDiv);
    const printedContent = containerDiv.innerHTML;
    console.log("Printed HTML content:", printedContent);
    HtmlPrintAddApi(dispatch, printedContent, printObj);
    ReactDOM.unmountComponentAtNode(containerDiv);
    containerDiv.remove();
    History.goBack();
  };

  const handleAfterPrintTree = () => {
    const componentInstance = (
      <IssueToWorkerTreePrint ref={componentTreeRef} printObj={treePrintObj} />
    );
    const containerDiv = document.createElement("div");
    ReactDOM.render(componentInstance, containerDiv);
    const printedContent = containerDiv.innerHTML;
    console.log("Printed HTML content:", printedContent);
    HtmlPrintAddApi(dispatch, printedContent, treePrintObj);
    ReactDOM.unmountComponentAtNode(containerDiv);
    containerDiv.remove();
    History.goBack();
  };

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Issue To Workstation_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
  });

  const handleTreePrint = useReactToPrint({
    content: reactToPrintTreeContent,
    documentTitle: "Issue To Workstation_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrintTree,
  });

  useEffect(() => {
    if (printObj.length > 0) {
      handlePrint();
    }
  }, [printObj]);

  useEffect(() => {
    if (treePrintObj.length > 0) {
      handleTreePrint();
    }
  }, [treePrintObj]);

  function getProductData(sData) {
    Axios.get(
      Config.getCommonUrl() +
        `api/production/issueToWorker/lotNumberSearch?department_id=${department_id}&number=${sData}`
    )
      .then(function (response) {
        if (response.data.success) {
          let responseData = response.data.data;
          if (responseData.length > 0) {
            setLotApiData(responseData);
          } else {
            setLotApiData([]);
          }
        } else {
          setLotApiData([]);
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        setLotApiData([]);
        handleError(error, dispatch, {
          api: `api/production/issueToWorker/lotNumberSearch?department_id=${department_id}&number=${sData}`,
        });
      });
  }

  function getTreeSuggestionData(sData) {
    Axios.get(
      Config.getCommonUrl() +
        `api/production/issueToWorker/treeNumberSearch?department_id=${department_id}&number=${sData}`
    )
      .then(function (response) {
        if (response.data.success === true) {
          let responseData = response.data.data;
          if (responseData.length > 0) {
            setTreeApiData(responseData);
          } else {
            setTreeApiData([]);
          }
        } else {
          setTreeApiData([]);
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        setTreeApiData([]);
        handleError(error, dispatch, {
          api: `api/production/issueToWorker/treeNumberSearch?department_id=${department_id}&number=${sData}`,
        });
      });
  }

  useEffect(() => {
    if (selectedLotNumber) {
      getAddToLotListing();
    }
  }, [selectedLotNumber]);
  function getAddToLotListing() {
    const body = {
      number: selectedLotNumber,
      department_id: parseFloat(
        window.localStorage.getItem("SelectedDepartment")
      ),
    };
    Axios.post(Config.getCommonUrl() + `api/production/lot/number`, body)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          if (response.data.data) {
            setLotOrtreeFlag(0);
            clearTreeData();
            if (apiDataArray) {
              const lotNumberExists = apiDataArray.some(
                (item) => item.number === response.data.data.number
              );
              console.log(processId, processLineId);
              if (!lotNumberExists) {
                if (
                  processId === "" &&
                  // processLineId === "" &&
                  purity === ""
                ) {
                  const res = {
                    ...response.data.data,
                    isSplit: false,
                    isSplitEdit: false,
                  };
                  setApiDataArray((prevArray) => [...prevArray, res]);
                  setProcessLineId(response.data.data.process_line_id);
                  setProcessId(response.data.data.process_id);
                  setPurity(response.data.data.purity);
                  processLineset(response.data.data);
                } else if (
                  // processLineId === response.data.data.process_line_id &&
                  processId === response.data.data.process_id &&
                  purity === response.data.data.purity
                ) {
                  const res = {
                    ...response.data.data,
                    isSplit: false,
                    isSplitEdit: false,
                  };
                  setApiDataArray((prevArray) => [...prevArray, res]);
                  setIsEdit(false);
                  clearAddMetalAndTransferData();
                } else {
                  dispatch(
                    Actions.showMessage({
                      message:
                        "Lot Id is not match with selected Process & Purity",
                      variant: "error",
                    })
                  );
                }
                // setApiData(response.data.data);
              } else {
                dispatch(
                  Actions.showMessage({
                    message: "Lot Data is already added",
                    variant: "error",
                  })
                );
              }
            } else {
              if (
                processId == response.data.data.process_line_id &&
                processLineId == response.data.data.process_id
              ) {
                setApiData(response.data.data);
                setApiDataArray((prevArray) => [
                  ...prevArray,
                  response.data.data,
                ]);
              } else {
                dispatch(
                  Actions.showMessage({
                    message: "Lot Id is not match with selected process",
                    variant: "error",
                  })
                );
              }
            }
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
          api: `api/production/lot/number`,
        });
      });
  }
  console.log(apiDataArray, fieldData);
  console.log(addStockData);
  function postUpdateDesign(isPrint) {
    const updatedStockArray = [];
    addStockData
      .filter((data) => data.lotNo !== "")
      .forEach((item) => {
        console.log(item.value);
        const updatedStockItem = {
          lot_id: item.LotDesigns[0].lot_id,
          stock_name_code_id: item.stockCode.value,
          weight: item.weight,
          pcs: item.pcs ? item.pcs : 0,
          purity: item.purity,
        };
        updatedStockArray.push(updatedStockItem);
      });
    console.log(updatedStockArray);
    let LotIdArray = apiDataArray.map((data) => data.id);
    console.log(LotIdArray);
    const updatedLotDesignArr = transferredRows.map((item, i) => {
      return {
        batch_no: item.batch_no,
        design_id: item.design_id,
      };
    });
    const body = {
      lot_id: LotIdArray,
      isSublot: transferredRows.length > 0 ? 1 : 0,
      stockArray: updatedStockArray,
      pcs: HelperFunc.getTotalOfField(transferredRows, "design_pcs"),
      total_gross_wgt: fieldData.grossweight,
      total_net_wgt: fieldData.grossweight,
      total_stone_weight: HelperFunc.getTotalOfField(
        transferredRows,
        "total_stone_weight"
      ),
      stone_pcs: HelperFunc.getTotalOfField(transferredRows, "total_stone_pcs"),
      process_id: fieldData.process.value,
      workstation_id: fieldData.workstation.value,
      lot_remarks: fieldData.remark,
      remark: fieldData.lotremark,
      lotdesignArray: updatedLotDesignArr,
      status: fieldData.status,
      ...(transferredRows.length > 0 && {
        design_gross_weight: HelperFunc.getTotalOfField(
          transferredRows,
          "total_gross_weight"
        ),
        design_stone_weight: HelperFunc.getTotalOfField(
          transferredRows,
          "total_stone_weight"
        ),
        design_net_weight: HelperFunc.getTotalOfField(
          transferredRows,
          "total_net_weight"
        ),
      }),
    };
    Axios.post(
      Config.getCommonUrl() +
        `api/production/issue/worker?department_id=${parseFloat(
          window.localStorage.getItem("SelectedDepartment")
        )}`,
      body
    )
      .then(function (response) {
        if (response.data.success === true) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          clearData();
          if (isPrint === 1) {
            getPrintData(response.data.lot_id, response.data.activityNumber);
          }
          // setUpdatedLotId(response.data.lot_id);
          console.log(response.data.lot_id);
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
          api: `api/production/issue/worker?department_id=${parseFloat(
            window.localStorage.getItem("SelectedDepartment")
          )}&lot_id=${selectedlotId}`,
          body: body,
        });
      });
  }
  function postUpdateTree(isPrint) {
    let treeIdArray = apiTreeDataArray.map((data) => data.id);
    const body = {
      tree_id: treeIdArray,
      process_id: fieldData.process.value,
      workstation_id: fieldData.workstation.value,
      remark: fieldData.lotremark,
    };
    Axios.post(Config.getCommonUrl() + `api/production/tree/issue/worker`, body)
      .then(function (response) {
        if (response.data.success === true) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          console.log(response.data.data);
          clearData();
          clearTreeData();
          const [treeArr] = response.data.tree_id;
          if (isPrint === 1) {
            getTreePrintData(treeArr, response.data.activityNumber);
          }
          // setUpdatedLotId(response.data.lot_id);
          console.log(response.data.lot_id);
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
          api: `api/production/tree/issue/worker`,
          body: body,
        });
      });
  }

  useEffect(() => {
    getWorkStationList();
    getProcessList();
  }, []);

  useEffect(() => {
    getStockCode();
  }, [purity]);

  function getStockCode() {
    Axios.get(
      Config.getCommonUrl() +
        `api/production/issueToWorker/stockList?purity=${purity}&department_id=${window.localStorage.getItem(
          "SelectedDepartment"
        )}`
    )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setStockCodeList(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/production/issueToWorker/stockList?purity=${92.5}&department_id=${window.localStorage.getItem(
            "SelectedDepartment"
          )}`,
        });
      });
  }
  function getWorkStationList() {
    Axios.get(Config.getCommonUrl() + "api/workstation")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setWorkStationList(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/workstation",
        });
      });
  }
  function getProcessList() {
    Axios.get(Config.getCommonUrl() + "api/process")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setProcessList(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: "api/process",
        });
      });
  }
  function getTreePrintData(treelist, actNumber) {
    console.log(treelist);
    const body = {
      tree_id: treelist,
      activityNumber: actNumber,
      // number: selectedLotNumber,
      // department_id: parseFloat(
      //   window.localStorage.getItem("SelectedDepartment")
      // ),
    };
    Axios.post(
      Config.getCommonUrl() + `api/productionPrintvoucher/tree/issue/print`,
      body
    )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          if (response.data.data) {
            console.log(response);
            setTreePrintObj(response.data.data);
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
          api: `api/productionPrintvoucher/tree/issue/print`,
        });
      });
  }

  function getPrintData(lotList, actNumber) {
    const arr = [];
    addStockData.map((item, index) => {
      arr.push({
        stock_name_code_id: item.stockCode,
        weight: item.weight,
        pcs: item.pcs,
      });
    });
    const body = {
      lot_id: lotList,
      stockArray: addStockData,
      activityNumber: actNumber,
    };
    Axios.post(
      Config.getCommonUrl() + `api/productionPrintvoucher/issueToWorker/print`,
      body
    )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          if (response.data.data) {
            console.log(response);
            setPrintObj(response.data.data);
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
          api: `api/productionPrintvoucher/issueToWorker/print`,
        });
      });
  }
  function getTreeListing() {
    const body = {
      tree_number: selectedTreeNumber,
      department_id: parseFloat(
        window.localStorage.getItem("SelectedDepartment")
      ),
    };
    Axios.post(
      Config.getCommonUrl() + `api/production/issueToWorker/treeNumber/Scan`,
      body
    )
      .then(function (response) {
        if (response.data.success) {
          console.log(response.data.data);
          setLotOrtreeFlag(1);
          clearData();
          const receivedObject = response.data.data;
          setApiTreeDataArray((prevState) => [...prevState, receivedObject]);
        } else {
          setApiTreeDataArray([]);
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
          api: `api/production/issueToWorker/treeNumber/Scan`,
          body,
        });
      });
  }
  useEffect(() => {
    if (selectedTreeNumber) {
      getTreeListing();
    }
  }, [selectedTreeNumber]);
  function getTreeLotListing(data) {
    setTreeNumber(data.tree_number);
    setTreeOrderDetails(data.treeOrderDetails);
    // const body = {
    //   tree_number: treeno,
    //   department_id: parseFloat(
    //     window.localStorage.getItem("SelectedDepartment")
    //   ),
    // };
    // Axios.post(Config.getCommonUrl() + `api/production/tree/Details`, body)
    //   .then(function (response) {
    //     if (response.data.success === true) {
    //       if (response.data.data) {
    //         setTreeNumber(response.data.data.tree_number);
    //         setTreeOrderDetails(response.data.data.treeOrderDetails);
    //         console.log(response.data.data);
    //       }
    //     } else {
    //       dispatch(
    //         Actions.showMessage({
    //           message: response.data.message,
    //           variant: "error",
    //         })
    //       );
    //     }
    //   })
    //   .catch((error) => {
    //     handleError(error, dispatch, {
    //       api: `api/production/tree/Details`,
    //     });
    //   });
  }
  const validateScanlot = () => {
    if (apiDataArray.length === 0 && apiTreeDataArray.length === 0) {
      dispatch(
        Actions.showMessage({
          message: "Please Scan Lot Or Tree",
          variant: "error",
        })
      );
      return false;
    }
    return true;
  };

  const validateTransfer = () => {
    if (transferredRows.length === 0) {
      dispatch(
        Actions.showMessage({
          message: "Please Transfer Design",
          variant: "error",
        })
      );
      return false;
    }
    return true;
  };
  const validateWorkStationData = () => {
    let isValid = true;
    const updatedErrors = {
      workstation: "",
      process: "",
      lotremark: "",
      grossweight: "",
      status: "",
      remark: "",
    };

    if (!fieldData.workstation || fieldData.workstation.length === 0) {
      updatedErrors.workstation = "Select a Worker / Work Station";
      isValid = false;
    }
    if (!fieldData.process || fieldData.process.length === 0) {
      updatedErrors.process = "Select a Process";
      isValid = false;
    }
    // if (!fieldData.lotremark) {
    //   updatedErrors.lotremark = "Enter a Remark";
    //   isValid = false;
    // }
    if (transferredRows.length !== 0 && !fieldData.grossweight) {
      updatedErrors.grossweight = "Enter a Gross Weight";
      isValid = false;
    }
    // if (transferredRows.length !== 0 && !fieldData.status) {
    //   updatedErrors.status = "Enter a Status";
    //   isValid = false;
    // }
    setFieldData((prevFieldData) => ({
      ...prevFieldData,
      errors: updatedErrors,
    }));
    return isValid;
  };

  let handleLotSelect = (value) => {
    console.log(value);
    let filteredArray = lotApiData.filter((item) => item.number === value);
    if (filteredArray.length > 0) {
      setSelectedLotNumber(value);
    }
  };
  let handleTreeSelect = (value) => {
    console.log(value);
    let filteredArray = treeApiData.filter(
      (item) => item.tree_number === value
    );
    if (filteredArray.length > 0) {
      setSelectedTreeNumber(value);
    }
  };
  function handleSubmitUpdateDesign(isPrint) {
    if (
      validateScanlot() &&
      addStockValidate() &&
      // validateTransfer() &&
      validateWorkStationData()
    ) {
      if (lotOrtreeFlag === 0) {
        postUpdateDesign(isPrint);
      } else {
        postUpdateTree(isPrint);
      }
    }
  }
  let handleChange = (e, i) => {
    const { name, value } = e.target;
    if (
      (name === "weight" || name === "purity") &&
      !/^\d*\.?\d*$/.test(value)
    ) {
      return;
    }
    const addStockUpdatedData = [...addStockData];
    addStockUpdatedData[i][name] = value;
    addStockUpdatedData[i].errors = {
      ...addStockUpdatedData[i].errors,
      [name]: "",
    };
    setAddStockData(addStockUpdatedData);
  };
  function deleteLotFromList(index, data) {
    const addLotUpdatedData = [...apiDataArray];
    addLotUpdatedData.splice(index, 1);
    setApiDataArray(addLotUpdatedData);
    setSelectedLotNumber("");
    if (lotNo === data.number) {
      setLotNo("");
      setLotDesignList([]);
      setTransferredRows([]);
      setIsEdit(false);
    }
    if (addLotUpdatedData.length === 0) {
      setProcessId("");
      setProcessLineId("");
      setPurity("");
    }
  }
  function deleteTreeFromList(index, data) {
    console.log(data);
    const addTreeUpdatedData = [...apiTreeDataArray];
    addTreeUpdatedData.splice(index, 1);
    setApiTreeDataArray(addTreeUpdatedData);
    setSelectedTreeNumber("");
    if (treeNumber === data.tree_number) {
      setTreeNumber("");
      setTreeOrderDetails([]);
    }
  }
  function deleteLotHandler(index) {
    const addStockUpdatedData = [...addStockData];
    addStockUpdatedData.splice(index, 1);
    setAddStockData(addStockUpdatedData);
  }
  function handleLotOptionSelect(option, i) {
    const addStockUpdatedData = [...addStockData];
    addStockUpdatedData[i].lotNo = option.value;
    addStockUpdatedData[i].LotDesigns = option.data.LotDesigns;
    addStockUpdatedData[i].is_batch = 0;
    addStockUpdatedData[i].purity = option.data.purity;
    setAddStockData(addStockUpdatedData);

    if (addStockData.length - i === 1) {
      setAddStockData([
        ...addStockData,
        {
          lotNo: "",
          batchNo: "",
          stockCode: [],
          purity: "",
          pcs: "",
          weight: "",
          remark: "",
          LotDesigns: [],
          is_batch: "",
          errors: {
            lotNo: "",
            batchNo: "",
            stockCode: "",
            purity: "",
            pcs: "",
            weight: "",
            remark: "",
          },
        },
      ]);
    }
  }
  function handleBatchOptionSelect(option, i) {
    const addStockUpdatedData = [...addStockData];
    addStockUpdatedData[i].batchNo = {
      value: option.value,
      label: option.label,
    };
    addStockUpdatedData[i].is_batch = 1;
    setAddStockData(addStockUpdatedData);
  }
  function handleStockCodeSelect(option, i) {
    console.log(option);
    const addStockUpdatedData = [...addStockData];
    addStockUpdatedData[i].stockCode = option;
    addStockUpdatedData[i].purity = option.data.StockNameCode.purity;
    addStockUpdatedData[i].errors = {
      ...addStockUpdatedData[i].errors,
      stockCode: "",
    };
    setAddStockData(addStockUpdatedData);
  }
  function handleWorkstationSelect(option, i) {
    console.log(option);
    const updatedWorkStation = {
      value: option.value,
      label: option.label,
    };
    setFieldData((prevFieldData) => ({
      ...prevFieldData,
      workstation: updatedWorkStation,
      errors: {
        ...prevFieldData.errors,
        workstation: "",
      },
    }));
  }
  function handleProcessSelect(option, i) {
    console.log(option);
    const updatedProcess = {
      value: option.value,
      label: option.label,
    };
    setFieldData((prevFieldData) => ({
      ...prevFieldData,
      process: updatedProcess,
      errors: {
        ...prevFieldData.errors,
        process: "",
      },
    }));
  }
  function processLineset(data) {
    // setProcessList([]);
    // setFieldData((prevFieldData) => ({
    //   ...prevFieldData,
    //   process: [],
    // }));
    if (processList) {
      const index = processList.findIndex(
        (process) => process.id === data.process_id
      );
      console.log(index);
      if (index !== -1) {
        const nextProcess = processList[index + 1];
        const updatedProcess = {
          value: nextProcess.id,
          label: nextProcess.process_name,
        };
        console.log(updatedProcess);
        setFieldData((prevFieldData) => ({
          ...prevFieldData,
          process: updatedProcess,
        }));
      }
    }
    // find procees from Process Line using ProcessId & ProcessLineId
    if (processLineList) {
      processLineList.forEach((processLine) => {
        if (processLine.id === data.process_line_id) {
          console.log(processLine);
          setProcessList(processLine.process_line);
          const index = processLine.process_line.findIndex(
            (process) => process.process_id === data.process_id
          );

          if (index !== -1 && index < processLine.process_line.length - 1) {
            const nextProcess = processLine.process_line[index + 1];
            const updatedProcess = {
              value: nextProcess.process_main.id,
              label: nextProcess.process_main.process_name,
            };
            setFieldData((prevFieldData) => ({
              ...prevFieldData,
              process: updatedProcess,
            }));
            console.log("Next process:", nextProcess);
          }
        }
      });
    }
  }
  function getItemOfLot(data, index, fromBtn) {
    console.log(data);
    // processLineset(data);
    const arrData = [...apiDataArray];
    arrData.map((item) => {
      if (item.number === data.number) {
        item.isSplit = true;
        getLotDesignList(data.id);
      } else {
        item.isSplit = false;
      }
      item.isSplitEdit = false;
    });
    setLotNo(data.number);
    setApiDataArray(arrData);
    setIsEdit(false);
    setTransferredRows([]);
  }
  function getItemOfLotIsEdit(data) {
    console.log(data);
    // processLineset(data);

    const arrData = [...apiDataArray];
    arrData.map((item) => {
      if (item.number === data.number) {
        item.isSplitEdit = true;
        getLotDesignList(data.id);
      } else {
        item.isSplitEdit = false;
      }
    });
    setLotNo(data.number);
    setSelectedlotId(data.id);
    setApiDataArray(arrData);
    setIsEdit((prev) => !prev);
    setTransferredRows([]);
  }
  const getLotDesignList = (lotId) => {
    Axios.get(
      Config.getCommonUrl() +
        `api/production/lot/design/group?lot_id=${lotId}&department_id=${parseFloat(
          window.localStorage.getItem("SelectedDepartment")
        )}`
    )
      .then(function (response) {
        if (response.data.success) {
          console.log(response.data.data);
          setLotDesignList(response.data.data.LotDesigns);
        } else {
          setLotDesignList([]);
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
          api: `api/production/lot/design/group?lot_id=${lotId}&department_id=${parseFloat(
            window.localStorage.getItem("SelectedDepartment")
          )}`,
        });
      });
  };
  const handleCheckboxChange = (row) => {
    const selectedIndex = selectedRows.indexOf(row);
    if (selectedIndex === -1) {
      setSelectedRows([...selectedRows, row]);
    } else {
      const updatedSelectedRows = [...selectedRows];
      updatedSelectedRows.splice(selectedIndex, 1);
      setSelectedRows(updatedSelectedRows);
    }
  };
  const handleTransfer = () => {
    if (selectedRows.length === 0) {
      dispatch(
        Actions.showMessage({
          message: "Please Select Design",
          variant: "error",
        })
      );
    } else if (lotDesignList.length === selectedRows.length) {
      dispatch(
        Actions.showMessage({
          message: "You can not transfer all design",
          variant: "error",
        })
      );
    } else {
      const updatedLotDesignList = lotDesignList.filter(
        (design) => !selectedRows.includes(design)
      );

      const updatedTransferredRows = [...transferredRows, ...selectedRows];
      setTransferredRows(updatedTransferredRows);
      setLotDesignList(updatedLotDesignList);
      setSelectedRows([]);
    }
    // if (selectedRows.length !== 0) {
    //   const updatedLotDesignList = lotDesignList.filter(
    //     (design) => !selectedRows.includes(design)
    //   );

    //   const updatedTransferredRows = [...transferredRows, ...selectedRows];
    //   setTransferredRows(updatedTransferredRows);
    //   setLotDesignList(updatedLotDesignList);
    //   setSelectedRows([]);
    // }
    // setProductionOrderDesigns((prevDesigns) =>
    //   prevDesigns.filter((design) => !selectedRows.includes(design))
    // );
  };
  const handleDeleteRow = (row) => {
    const updatedRows = transferredRows.filter((r) => r !== row);
    setTransferredRows(updatedRows);

    const updatedLotDesignList = [...lotDesignList, row];
    setLotDesignList(updatedLotDesignList);

    // setProductionOrderDesigns((prevDesigns) => [...prevDesigns, row]);
    setSelectedRows([]);
  };
  const handleSearchLotData = (event) => {
    const { name, value } = event.target;
    if (name === "searchselectedlot") {
      setSelectedLotSearchData(value);
    } else if (name === "searchlotdesign") {
      setDesignLotSearchData(value);
    }
  };
  const handleSearchTreeData = (event) => {
    const { name, value } = event.target;
    if (name === "searchtree") {
      setSelectedTreeSearchData(value);
    }
  };
  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    if (name === "grossweight" && !/^\d*\.?\d*$/.test(value)) {
      return;
    }
    setFieldData((prevData) => ({
      ...prevData,
      [name]: value,
      errors: {
        ...prevData.errors,
        [name]: "",
      },
    }));
  };
  console.log(addStockData);
  function handleSubmitData() {
    console.log(addStockData);
    const updatedStockArray = [];
    const uploadLotArray = [];

    addStockData
      .filter((data) => data.lotNo !== "")
      .forEach((item) => {
        if (item.is_batch === 0) {
          const updatedStockItem = {
            lot_id: item.LotDesigns[0].lot_id,
            weight: item.weight,
            remark: item.remark,
            purity: item.purity,
          };
          updatedStockArray.push(updatedStockItem);
        } else {
          const uploadLotItem = {
            lot_id: item.LotDesigns[0].lot_id,
            design_id: item.batchNo.value,
            batch_number: item.batchNo.label,
            stock_code_id: item.stockCode.value,
            pcs: item.pcs,
            weight: item.weight,
            remark: item.remark,
          };
          uploadLotArray.push(uploadLotItem);
        }
      });
    console.log(updatedStockArray);
    console.log(uploadLotArray);
    // const updatedData = addStockData
    //   .filter((data) => data.lotNo !== "")
    //   .map((item) => {
    //     console.log(item);
    //     if (item.is_batch === 0) {
    //       return {
    //         // is_batch: item.is_batch,
    //         lot_id: item.LotDesigns[0].lot_id,
    //         weight: item.weight,
    //         remark: item.remark,
    //       };
    //     } else {
    //       return {
    //         lot_id: item.LotDesigns[0].lot_id,
    //         design_id: item.batchNo.value,
    //         batch_number: item.batchNo.label,
    //         stock_code_id: item.stockCode.value,
    //         pcs: item.pcs,
    //         weight: item.weight,
    //         remark: item.remark,
    //       };
    //     }
    //   });
    // console.log(updatedData);
    const body = {
      UploadLot: updatedStockArray,
      updatedStock: uploadLotArray,
    };
    Axios.post(Config.getCommonUrl() + `api/production/add`, body)
      .then(function (response) {
        if (response.data.success === true) {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "success",
            })
          );
          setAddStockData([
            {
              lotNo: "",
              batchNo: "",
              stockCode: [],
              purity: "",
              pcs: "",
              weight: "",
              remark: "",
              LotDesigns: [],
              is_batch: "",
              errors: {
                lotNo: "",
                batchNo: "",
                stockCode: "",
                purity: "",
                pcs: "",
                weight: "",
                remark: "",
              },
            },
          ]);
          console.log(response);
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
          api: `api/production/add`,
          body: body,
        });
      });
  }
  const addStockValidate = () => {
    let hasErrors = false;

    const updatedAddStockData = addStockData.map((data) => {
      console.log(data);
      if (data.lotNo) {
        console.log("dasfsadf asdf asdf asdf");
        if (data.stockCode.length === 0) {
          data.errors = {
            ...data.errors,
            stockCode: "Plz Select Stock Code",
          };
          hasErrors = true;
        }
        if (data.purity === "") {
          data.errors = {
            ...data.errors,
            purity: "Plz Enter Purity",
          };
          hasErrors = true;
        }
        if (data.weight === "") {
          data.errors = {
            ...data.errors,
            weight: "Plz Enter Weight",
          };
          hasErrors = true;
        }
        // if (data.remark === "") {
        //   data.errors = {
        //     ...data.errors,
        //     remark: "Plz Enter Remark",
        //   };
        //   hasErrors = true;
        // }
        if (!hasErrors) {
          data.errors = {
            stockCode: "",
            purity: "",
            weight: "",
            pcs: "",
            remark: "",
          };
        }
      }
      return data;
    });

    if (!hasErrors) {
      return true;
    }
    setAddStockData(updatedAddStockData);
  };

  return (
    <>
      {/* <Modal open={openPopup}> */}
      <Box className={classes.model} style={{ overflowY: "auto" }}>
        <Grid container className={classes.modalContainer}>
          <Grid item xs={12} sm={4} md={3} key="1">
            <FuseAnimate delay={300}>
              <Typography className="pl-28 pb-16 pt-16 text-18 font-700">
                Issues to Workstation
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
            <Grid container style={{ marginBottom: 16 }} spacing={2}>
              <Grid
                item
                // xs={12}
                // sm={6}
                // md={4}
                // lg={3}
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
                      placeholder="Search Lot No."
                      variant="outlined"
                      // align="center"
                      style={{
                        padding: 0,
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid
                item
                // xs={12}
                // sm={6}
                // md={4}
                // lg={3}
                className="packing-slip-input"
              >
                {/* <TextField
              id="lot-num"
              variant="outlined"
              value="F23072021002"
              disabled
              style={{ fontWeight: "700", width: "250px" }}
            /> */}
                <Autocomplete
                  id="free-solo-demos"
                  freeSolo
                  disableClearable
                  onChange={(event, newValue) => {
                    handleTreeSelect(newValue);
                  }}
                  onInputChange={(event, newInputValue) => {
                    if (event !== null) {
                      if (event.type === "change")
                        setTreeNumberSearch(newInputValue);
                    } else {
                      setTreeNumberSearch("");
                    }
                  }}
                  value={selectedTreeNumber}
                  options={treeApiData.map((option) => option.tree_number)}
                  fullWidth
                  style={{ width: 200 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Search Tree No."
                      variant="outlined"
                      style={{
                        padding: 0,
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
            {lotOrtreeFlag === 0 && (
              <Box>
                <TableContainer
                  // className={classes.scroll}
                  style={{ marginBottom: 16, overflowX: "auto" }}
                >
                  <Table
                    className={`${classes.table}`}
                    // style={{ minWidth: "900px" }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell
                          width="40px"
                          className={classes.tableRowPad}
                          align="center"
                        ></TableCell>
                        <TableCell
                          width="150px"
                          className={classes.tableRowPad}
                        >
                          Lot Number
                        </TableCell>
                        <TableCell
                          width="190px"
                          className={classes.tableRowPad}
                        >
                          Lot Category
                        </TableCell>
                        <TableCell width="70px" className={classes.tableRowPad}>
                          Purity
                        </TableCell>
                        <TableCell width="90px" className={classes.tableRowPad}>
                          Lot Pcs
                        </TableCell>
                        <TableCell
                          width="100px"
                          className={classes.tableRowPad}
                        >
                          Stone Pcs
                        </TableCell>
                        <TableCell
                          width="130px"
                          className={classes.tableRowPad}
                        >
                          Gross Weight
                        </TableCell>
                        <TableCell
                          width="130px"
                          className={classes.tableRowPad}
                        >
                          Stone Weight
                        </TableCell>
                        <TableCell
                          width="120px"
                          className={classes.tableRowPad}
                        >
                          Net Weight
                        </TableCell>
                        <TableCell className={classes.tableRowPad}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {apiDataArray.length === 0 ? (
                        // <TableRow>
                        //   <TableCell
                        //     className={classes.tableRowPad}
                        //     colSpan={10}
                        //     align="center"
                        //   >
                        //     No Data
                        //   </TableCell>
                        // </TableRow>

                        <TableRow>
                          <TableCell
                            className={classes.tableRowPad}
                            colSpan={10}
                            align="center"
                          >
                            <div style={{ textAlign: "center" }}>No Data</div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        apiDataArray.map((data, index) => {
                          return (
                            <TableRow key={index}>
                              {console.log(lotNo, data.number)}
                              <TableCell className={classes.tableRowPad}>
                                <IconButton
                                  style={{ padding: "0" }}
                                  tabIndex="-1"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    deleteLotFromList(index, data);
                                  }}
                                >
                                  <Icon className="" style={{ color: "red" }}>
                                    delete
                                  </Icon>
                                </IconButton>
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                <span
                                  onClick={(e) =>
                                    getItemOfLot(data, index, false)
                                  }
                                  style={{ color: "blue", cursor: "pointer" }}
                                  disabled={lotNo === data.number}
                                >
                                  {data?.number}
                                </span>
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {data.LotProductCategory?.category_name}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {data?.purity}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {data?.pcs}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {data?.stone_pcs}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {data?.total_gross_wgt}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {data?.total_stone_weight}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {data?.total_net_wgt}
                              </TableCell>
                              {console.log(isEdit, !data.isSplitEdit)}
                              <TableCell className={classes.tableRowPad}>
                                {apiDataArray.length === 1 && (
                                  <Button
                                    size="small"
                                    style={{
                                      background: "#b8a600",
                                      color: "#FFFFFF",
                                      textTransform: "capitalize",
                                    }}
                                    disabled={isEdit && !data.isSplitEdit}
                                    onClick={() => {
                                      getItemOfLotIsEdit(data, index);
                                    }}
                                  >
                                    {data.isSplitEdit && isEdit
                                      ? "Cancel Split"
                                      : "Split"}
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
            {lotOrtreeFlag === 1 && (
              <Box>
                <TableContainer
                  // className={classes.scroll}
                  style={{ marginBottom: 16, overflowX: "auto" }}
                >
                  <Table
                    className={`${classes.table}`}
                    // style={{ minWidth: "900px" }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell
                          width="40px"
                          className={classes.tableRowPad}
                          align="center"
                        ></TableCell>
                        <TableCell
                          width="150px"
                          className={classes.tableRowPad}
                        >
                          Tree Number
                        </TableCell>
                        <TableCell width="70px" className={classes.tableRowPad}>
                          Purity
                        </TableCell>
                        <TableCell
                          width="130px"
                          className={classes.tableRowPad}
                        >
                          Gross Weight
                        </TableCell>
                        <TableCell
                          width="130px"
                          className={classes.tableRowPad}
                        >
                          Stone Weight
                        </TableCell>
                        <TableCell
                          width="120px"
                          className={classes.tableRowPad}
                        >
                          Net Weight
                        </TableCell>
                        <TableCell className={classes.tableRowPad}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {apiTreeDataArray.length === 0 ? (
                        <TableRow>
                          <TableCell
                            className={classes.tableRowPad}
                            colSpan={7}
                            align="center"
                          >
                            <div style={{ textAlign: "center" }}>No Data</div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        apiTreeDataArray.map((data, index) => {
                          console.log(data);
                          return (
                            <TableRow key={index}>
                              {console.log(lotNo, data.number)}
                              <TableCell className={classes.tableRowPad}>
                                <IconButton
                                  style={{ padding: "0" }}
                                  tabIndex="-1"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    deleteTreeFromList(index, data);
                                  }}
                                >
                                  <Icon className="" style={{ color: "red" }}>
                                    delete
                                  </Icon>
                                </IconButton>
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                <span
                                  onClick={(e) => getTreeLotListing(data)}
                                  style={{ color: "blue", cursor: "pointer" }}
                                  // disabled={lotNo === data.number}
                                >
                                  {data?.tree_number}
                                </span>
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {data?.purity}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {data?.totalGrossWeightSum}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {data?.totalStoneWeightSum}
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                {data?.totalNetWeightSum}
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                              ></TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
            {console.log(fieldData)}
            <Grid container spacing={2}>
              <Grid item md={12} lg={7}>
                <Grid container spacing={1} style={{ marginBottom: 16 }}>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={4}
                    style={{ position: "relative" }}
                  >
                    <Typography style={{ fontWeight: "600" }}>
                      Worker / Work Station Name
                    </Typography>
                    <Select
                      filterOption={createFilter({
                        ignoreAccents: false,
                      })}
                      placeholder="Worker / Work Station Name"
                      options={workStationList
                        .filter(
                          (item) =>
                            item.department_id === parseFloat(department_id)
                        )
                        .map((data) => ({
                          value: data.id,
                          label: data.name,
                          data: data,
                        }))}
                      // options={workStationList.map((data) => ({
                      //   value: data.id,
                      //   label: data.name,
                      //   data: data,
                      // }))}
                      value={fieldData.workstation}
                      onChange={(e) => handleWorkstationSelect(e)}
                    />
                    {fieldData.errors.workstation && (
                      <span className={classes.errorMessage}>
                        {fieldData.errors.workstation}
                      </span>
                    )}
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={4}
                    style={{ position: "relative" }}
                  >
                    <Typography style={{ fontWeight: "600" }}>
                      Process
                    </Typography>
                    {console.log(processList)}
                    <Select
                      filterOption={createFilter({
                        ignoreAccents: false,
                      })}
                      placeholder="Process"
                      options={processList.map((data) => ({
                        value: data.id,
                        label: data.process_name,
                        data: data,
                      }))}
                      value={fieldData.process}
                      onChange={(e) => handleProcessSelect(e)}
                    />
                    {fieldData.errors.process && (
                      <span className={classes.errorMessage}>
                        {fieldData.errors.process}
                      </span>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6} md={4} lg={4}>
                    <Typography style={{ fontWeight: "600" }}>
                      Remark
                    </Typography>
                    <TextField
                      fullWidth
                      name="lotremark"
                      variant="outlined"
                      value={fieldData.lotremark}
                      onChange={(e) => handleFieldChange(e)}
                      error={
                        fieldData.errors !== undefined
                          ? fieldData.errors.lotremark
                            ? true
                            : false
                          : false
                      }
                      helperText={
                        fieldData.errors !== undefined
                          ? fieldData.errors.lotremark
                          : ""
                      }
                    />
                  </Grid>
                </Grid>
                <Box
                  style={{
                    pointerEvents:
                      lotOrtreeFlag === 1 || apiDataArray.length > 1
                        ? "none"
                        : "auto",
                    opacity:
                      lotOrtreeFlag === 1 || apiDataArray.length > 1 ? 0.7 : 1,
                  }}
                >
                  <Typography
                    style={{
                      paddingBlock: 5,
                      paddingLeft: 16,
                      background: "#e3e3e3",
                      fontWeight: "700",
                    }}
                  >
                    Add Metal
                  </Typography>
                  <TableContainer className={classes.scroll}>
                    <Table className={classes.addStockTableContainer}>
                      <TableHead>
                        <TableRow>
                          <TableCell
                            className={classes.tableRowPad}
                            width={40}
                            align="center"
                          ></TableCell>
                          <TableCell className={classes.tableRowPad}>
                            Lot No.
                          </TableCell>
                          {/* <TableCell className={classes.tableRowPad}>
                          Design No / Batch No
                        </TableCell> */}
                          <TableCell className={classes.tableRowPad}>
                            Stock Code
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            // width="100px"
                          >
                            Purity
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            // width="100px"
                          >
                            Pcs
                          </TableCell>
                          <TableCell
                            className={classes.tableRowPad}
                            // width="100px"
                          >
                            Weight
                          </TableCell>
                          {/* <TableCell className={classes.tableRowPad}>
                          Remark
                        </TableCell> */}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {addStockData.map((data, index) => {
                          return (
                            <TableRow key={index}>
                              <TableCell
                                style={{
                                  padding: "4px",
                                  textAlign: "center",
                                  border: "1px solid #e6e6e6",
                                  borderBottom: "2px solid #e6e6e6",
                                }}
                              >
                                <IconButton
                                  style={{ padding: "0" }}
                                  tabIndex="-1"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    ev.stopPropagation();
                                    if (addStockData.length - 1 !== index) {
                                      deleteLotHandler(index);
                                    }
                                  }}
                                >
                                  <Icon className="" style={{ color: "red" }}>
                                    delete
                                  </Icon>
                                </IconButton>
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                <Select
                                  filterOption={createFilter({
                                    ignoreAccents: false,
                                  })}
                                  placeholder="Lot No"
                                  options={apiDataArray.map((data) => ({
                                    value: data.number,
                                    label: data.number,
                                    data: data,
                                  }))}
                                  value={
                                    data.lotNo
                                      ? { value: data.lotNo, label: data.lotNo }
                                      : ""
                                  }
                                  onChange={(e) =>
                                    handleLotOptionSelect(e, index)
                                  }
                                />
                              </TableCell>
                              {/* <TableCell className={classes.tablePad}>
                              <Select
                                filterOption={createFilter({
                                  ignoreAccents: false,
                                })}
                                placeholder="Batch No / Design No"
                                options={data.LotDesigns.map((data) => ({
                                  value: data.design_id,
                                  label: data.batch_no,
                                  data: data,
                                }))}
                                value={data.batchNo}
                                onChange={(e) =>
                                  handleBatchOptionSelect(e, index)
                                }
                              />
                            </TableCell> */}
                              <TableCell
                                className={classes.tablePad}
                                style={{ position: "relative" }}
                              >
                                <Select
                                  filterOption={createFilter({
                                    ignoreAccents: false,
                                  })}
                                  placeholder="Stock code"
                                  options={stockCodeList.map((data) => ({
                                    value: data.StockNameCode.id,
                                    label: data.StockNameCode.stock_code,
                                    data: data,
                                  }))}
                                  // isDisabled={!(data.is_batch === 1)}
                                  value={data.stockCode}
                                  onChange={(e) =>
                                    handleStockCodeSelect(e, index)
                                  }
                                />
                                {data.errors !== undefined &&
                                  data.errors.stockCode && (
                                    <span
                                      className={classes.errorMessage}
                                      style={{ bottom: 1 }}
                                    >
                                      {data.errors.stockCode}
                                    </span>
                                  )}
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                <TextField
                                  variant="outlined"
                                  value={data.purity}
                                  name="purity"
                                  disabled
                                  style={{ width: "100%" }}
                                  onChange={(e) => handleChange(e, index)}
                                />
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                <TextField
                                  name="pcs"
                                  variant="outlined"
                                  type="number"
                                  className={classes.inputBoxTEST}
                                  // disabled={!(data.is_batch === 1)}
                                  value={data.pcs}
                                  style={{ width: "100%" }}
                                  onChange={(e) => handleChange(e, index)}
                                  error={
                                    data.errors !== undefined
                                      ? data.errors.pcs
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    data.errors !== undefined
                                      ? data.errors.pcs
                                      : ""
                                  }
                                />
                              </TableCell>
                              <TableCell className={classes.tablePad}>
                                <TextField
                                  name="weight"
                                  variant="outlined"
                                  value={data.weight}
                                  style={{ width: "100%" }}
                                  onChange={(e) => handleChange(e, index)}
                                  error={
                                    data.errors !== undefined
                                      ? data.errors.weight
                                        ? true
                                        : false
                                      : false
                                  }
                                  helperText={
                                    data.errors !== undefined
                                      ? data.errors.weight
                                      : ""
                                  }
                                />
                              </TableCell>
                              {/* <TableCell className={classes.tablePad}>
                              <TextField
                                name="remark"
                                variant="outlined"
                                value={data.remark}
                                style={{ width: "100%" }}
                                onChange={(e) => handleChange(e, index)}
                                error={
                                  data.errors !== undefined
                                    ? data.errors.remark
                                      ? true
                                      : false
                                    : false
                                }
                                helperText={
                                  data.errors !== undefined
                                    ? data.errors.remark
                                    : ""
                                }
                              />
                            </TableCell> */}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {/* <Button
                  variant="contained"
                  style={{
                    background: isEdit ? "#ccc" : "#1FD319",
                    color: "#FFFFFF",
                    marginTop: 15,
                    display: "block",
                    marginLeft: "auto",
                  }}
                  onClick={addStockValidate}
                  disabled={isEdit}
                >
                  Save
                </Button> */}
                </Box>
              </Grid>
              <Grid item md={12} lg={5}>
                {lotOrtreeFlag === 1 && (
                  <Box style={{ marginBottom: 16 }}>
                    <Grid
                      container
                      justifyContent="space-between"
                      alignItems="center"
                      style={{ padding: 10, background: "#e3e3e3" }}
                    >
                      <Grid item>
                        <Typography style={{ fontWeight: 700 }}>
                          Total Lot(<span>{treeOrderDetails.length}</span>)
                        </Typography>
                      </Grid>
                      <Grid item>
                        {treeNumber && (
                          <b
                            style={{
                              padding: 5,
                              background: "#d3d3d3",
                              borderRadius: 7,
                            }}
                          >
                            {treeNumber}
                          </b>
                        )}
                      </Grid>
                      <Grid item>
                        <TextField
                          variant="outlined"
                          name="searchtree"
                          placeholder="Scan / Search"
                          onChange={(e) => handleSearchTreeData(e)}
                        />
                      </Grid>
                    </Grid>
                    <TableContainer style={{ overflowX: "scroll" }}>
                      <Table className={classes.table}>
                        <TableHead>
                          <TableRow>
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
                            <TableCell
                              width="70px"
                              className={classes.tableRowPad}
                            >
                              Status
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {treeOrderDetails.length === 0 ? (
                            <TableRow>
                              <TableCell
                                className={classes.tableRowPad}
                                align="center"
                                colSpan={8}
                              >
                                <div style={{ textAlign: "center" }}>
                                  No Data
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : (
                            treeOrderDetails
                              .filter((temp) => {
                                if (selectedTreeSearchData) {
                                  return (
                                    temp.lotDetailsforTree.number !== null &&
                                    temp.lotDetailsforTree.number !== "" &&
                                    temp.lotDetailsforTree.number
                                      .toLowerCase()
                                      .includes(
                                        selectedTreeSearchData.toLowerCase()
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
                                      {data.lotDetailsforTree.number}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {
                                        data.lotDetailsforTree.ProductCategory
                                          .category_name
                                      }
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {data.pcs ? data.pcs : 0}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {data.stone_pcs ? data.stone_pcs : 0}
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
                )}
                {lotOrtreeFlag === 0 && (
                  <Box style={{ marginBottom: 16 }}>
                    <Grid
                      container
                      justifyContent="space-between"
                      alignItems="center"
                      style={{ padding: 10, background: "#e3e3e3" }}
                    >
                      <Grid item>
                        Item of Lot(<span>{lotDesignList.length}</span>)
                      </Grid>
                      <Grid item>
                        {lotNo && (
                          <b
                            style={{
                              padding: 5,
                              background: "#d3d3d3",
                              borderRadius: 7,
                            }}
                          >
                            {lotNo}
                          </b>
                        )}
                      </Grid>
                      <Grid item>
                        <TextField
                          variant="outlined"
                          name="searchlotdesign"
                          placeholder="Scan / Search"
                          onChange={(e) => handleSearchLotData(e)}
                        />
                      </Grid>
                    </Grid>
                    <TableContainer
                      style={{
                        overflowX: "auto",
                        maxHeight: 400,
                        overflowY: "auto",
                      }}
                    >
                      <Table className={classes.addStockTableContainer}>
                        <TableHead>
                          <TableRow>
                            {/* {isEdit && (
                              <TableCell
                                width="25px"
                                className={classes.tableRowPad}
                                align="center"
                              ></TableCell>
                            )} */}
                             <TableCell
                              width="110px"
                              className={classes.tableRowPad}
                            >
                            </TableCell>
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
                              width="130px"
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
                              width="80px"
                            >
                              No of Stone
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              width="80px"
                            >
                              Gross Weight
                            </TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                              width="80px"
                            >
                              Stone Weight
                            </TableCell>
                            <TableCell
                              width="80px"
                              className={classes.tableRowPad}
                            >
                              Net Weight
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {lotDesignList.length === 0 ? (
                            <TableRow>
                              <TableCell
                                align="center"
                                colSpan={8}
                                className={classes.tableRowPad}
                              >
                                <div style={{ textAlign: "center" }}>
                                  No Data
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : (
                            lotDesignList
                              .filter((temp) => {
                                if (designLotSearchData) {
                                  return (
                                    temp.batch_no !== null &&
                                    temp.batch_no !== "" &&
                                    temp.batch_no
                                      .toLowerCase()
                                      .includes(
                                        designLotSearchData.toLowerCase()
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
                                    {isEdit && (
                                      <TableCell
                                        className={classes.tablePad}
                                        align="center"
                                      >
                                        <Checkbox
                                          style={{
                                            padding: 0,
                                            // paddingRight:"0px",
                                            color: "#415bd4",
                                          }}
                                          color="primary"
                                          checked={selectedRows.includes(data)}
                                          onChange={() =>
                                            handleCheckboxChange(data)
                                          }
                                        />
                                      </TableCell>
                                    )}
                                    <TableCell className={classes.tableRowPad}>
                                      {data.LotDesignData?.variant_number}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {/* <Zoom
                                    wrapStyle={{
                                      width: "500px",
                                      height: "500px",
                                    }}
                                  > */}
                                      <DesignZoomModal
                                        imgPath={
                                          data?.LotDesignData?.image_files[0]
                                            ?.image_file
                                        }
                                      />
                                      {/* <div className="imgModal">
                                    <div className="modal_inner">
                                      <img
                                        alt="design img"
                                        src={
                                          data?.LotDesignData?.image_files[0]
                                            ?.image_file
                                        }
                                      />
                                    </div>
                                    <img
                                      alt="design img"
                                      src={
                                        data?.LotDesignData?.image_files[0]
                                          ?.image_file
                                      }
                                      style={{ height: "50px" }}
                                    />
                                  </div> */}
                                      {/* </Zoom> */}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {data.batch_no}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {data.design_pcs}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {data.design_pcs * data.total_stone_pcs}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {data.total_gross_weight}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {data.total_stone_weight}
                                    </TableCell>
                                    <TableCell className={classes.tableRowPad}>
                                      {data.total_net_weight}
                                    </TableCell>
                                  </TableRow>
                                );
                              })
                          )}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            {isEdit && (
                              <TableCell
                                className={classes.tableRowPad}
                              ></TableCell>
                            )}
                            <TableCell
                              className={classes.tableRowPad}
                            ></TableCell>
                            <TableCell
                              className={classes.tableRowPad}
                            ></TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <b>Total</b>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <b>
                                {parseInt(
                                  HelperFunc?.getTotalOfField(
                                    lotDesignList,
                                    "design_pcs"
                                  )
                                ) || 0}
                              </b>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <b>
                                {parseInt(
                                  HelperFunc?.getTotalOfMultipliedFields(
                                    lotDesignList,
                                    "total_stone_pcs",
                                    "design_pcs"
                                  )
                                ) || 0}
                              </b>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <b>
                                {HelperFunc?.getTotalOfField(
                                  lotDesignList,
                                  "total_gross_weight"
                                ) || 0}
                              </b>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <b>
                                {HelperFunc?.getTotalOfField(
                                  lotDesignList,
                                  "total_stone_weight"
                                ) || 0}
                              </b>
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              <b>
                                {HelperFunc?.getTotalOfField(
                                  lotDesignList,
                                  "total_net_weight"
                                ) || 0}
                              </b>
                            </TableCell>
                          </TableRow>
                          {lotDesignList.length !== 0 && isEdit && (
                            <TableRow>
                              <TableCell
                                className={classes.tableRowPad}
                                colSpan={8}
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
                                  onClick={handleTransfer}
                                >
                                  Transfer
                                </Button>
                              </TableCell>
                            </TableRow>
                          )}
                        </TableFooter>
                      </Table>
                    </TableContainer>
                  </Box>
                )}
                {isEdit && (
                  <>
                    <Box style={{ marginBottom: 16 }}>
                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="center"
                        style={{ padding: 10, background: "#e3e3e3" }}
                      >
                        <Grid item>
                          Selected Items(<span>{transferredRows.length}</span>)
                        </Grid>
                        <Grid item>
                          <TextField
                            variant="outlined"
                            name="searchselectedlot"
                            placeholder="Scan / Search"
                            onChange={(e) => handleSearchLotData(e)}
                          />
                        </Grid>
                      </Grid>
                      <TableContainer style={{ overflowX: "auto" }}>
                        <Table className={classes.addStockTableContainer}>
                          <TableHead>
                            <TableRow>
                            <TableCell
                              width="110px"
                              className={classes.tableRowPad}
                            >
                            </TableCell>
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
                                width="130px"
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
                                width="80px"
                              >
                                No of Stone
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                width="80px"
                              >
                                Gross Weight
                              </TableCell>
                              <TableCell
                                className={classes.tableRowPad}
                                width="80px"
                              >
                                Stone Weight
                              </TableCell>
                              <TableCell
                                width="80px"
                                className={classes.tableRowPad}
                              >
                                Net Weight
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {transferredRows.length === 0 ? (
                              <TableRow>
                                <TableCell
                                  align="center"
                                  colSpan={9}
                                  className={classes.tableRowPad}
                                >
                                  <div style={{ textAlign: "center" }}>
                                    No Data
                                  </div>
                                </TableCell>
                              </TableRow>
                            ) : (
                              transferredRows
                                .filter((temp) => {
                                  if (selectedLotSearchData) {
                                    return (
                                      temp.batch_no !== null &&
                                      temp.batch_no !== "" &&
                                      temp.batch_no
                                        .toLowerCase()
                                        .includes(
                                          selectedLotSearchData.toLowerCase()
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
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        <IconButton
                                          style={{ padding: "0" }}
                                          tabIndex="-1"
                                          onClick={() => handleDeleteRow(data)}
                                        >
                                          <Icon
                                            className=""
                                            style={{ color: "red" }}
                                          >
                                            delete
                                          </Icon>
                                        </IconButton>
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {data.LotDesignData?.variant_number}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        <DesignZoomModal
                                          imgPath={
                                            data?.LotDesignData?.image_files[0]
                                              ?.image_file
                                          }
                                        />
                                        {/* <Zoom>
                                        <img
                                          alt="hmm"
                                          src={
                                            data?.LotDesignData?.image_files[0]
                                              ?.image_file
                                          }
                                          style={{ height: "50px" }}
                                        />
                                      </Zoom> */}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {data.batch_no}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {data.design_pcs}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {data.design_pcs * data.total_stone_pcs}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {data.total_gross_weight}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {data.total_stone_weight}
                                      </TableCell>
                                      <TableCell
                                        className={classes.tableRowPad}
                                      >
                                        {data.total_net_weight}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })
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
                              <TableCell className={classes.tableRowPad}>
                                <b>Total</b>
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                <b>
                                  {parseInt(
                                    HelperFunc?.getTotalOfField(
                                      transferredRows,
                                      "design_pcs"
                                    )
                                  ) || 0}
                                </b>
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                <b>
                                  {parseInt(
                                    HelperFunc?.getTotalOfMultipliedFields(
                                      transferredRows,
                                      "total_stone_pcs",
                                      "design_pcs"
                                    )
                                  ) || 0}
                                </b>
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                <b>
                                  {HelperFunc?.getTotalOfField(
                                    transferredRows,
                                    "total_gross_weight"
                                  ) || 0}
                                </b>
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                <b>
                                  {HelperFunc?.getTotalOfField(
                                    transferredRows,
                                    "total_stone_weight"
                                  ) || 0}
                                </b>
                              </TableCell>
                              <TableCell className={classes.tableRowPad}>
                                <b>
                                  {HelperFunc?.getTotalOfField(
                                    transferredRows,
                                    "total_net_weight"
                                  ) || 0}
                                </b>
                              </TableCell>
                            </TableRow>
                          </TableFooter>
                        </Table>
                      </TableContainer>
                    </Box>
                    <Grid container spacing={1} style={{ marginBottom: 16 }}>
                      <Grid item xs={12} sm={6} md={4} lg={4}>
                        <Typography style={{ fontWeight: "600" }}>
                          Gross Weight
                        </Typography>
                        <TextField
                          fullWidth
                          variant="outlined"
                          name="grossweight"
                          style={{ marginTop: 5 }}
                          value={fieldData.grossweight}
                          onChange={(e) => handleFieldChange(e)}
                          error={
                            fieldData.errors !== undefined
                              ? fieldData.errors.grossweight
                                ? true
                                : false
                              : false
                          }
                          helperText={
                            fieldData.errors !== undefined
                              ? fieldData.errors.grossweight
                              : ""
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={4}>
                        <Typography style={{ fontWeight: "600" }}>
                          Status
                        </Typography>
                        <TextField
                          fullWidth
                          name="status"
                          variant="outlined"
                          style={{ marginTop: 5 }}
                          value={fieldData.status}
                          onChange={(e) => handleFieldChange(e)}
                          error={
                            fieldData.errors !== undefined
                              ? fieldData.errors.status
                                ? true
                                : false
                              : false
                          }
                          helperText={
                            fieldData.errors !== undefined
                              ? fieldData.errors.status
                              : ""
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={4} lg={4}>
                        <Typography style={{ fontWeight: "600" }}>
                          Remark
                        </Typography>
                        <TextField
                          fullWidth
                          name="remark"
                          variant="outlined"
                          style={{ marginTop: 5 }}
                          value={fieldData.remark}
                          onChange={(e) => handleFieldChange(e)}
                        />
                      </Grid>
                    </Grid>
                  </>
                )}
              </Grid>
              <Grid
                item
                xs={12}
                style={{
                  display: "flex",
                  columnGap: 10,
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  id="btn-all-production"
                  variant="contained"
                  style={{
                    color: "#FFFFFF",
                    marginTop: 15,
                    display: "block",
                    marginLeft: "auto",
                  }}
                  onClick={handleSubmitUpdateDesign}
                >
                  Save
                </Button>

                <Button
                  id="btn-all-production"
                  variant="contained"
                  style={{
                    color: "#FFFFFF",
                    marginTop: 15,
                    display: "block",
                    // marginLeft: "auto",
                  }}
                  onClick={() => handleSubmitUpdateDesign(1)}
                  // disabled={isEdit}
                >
                  Save & Print
                </Button>
              </Grid>
            </Grid>
          </Box>
          <div style={{ display: "none" }}>
            <IssueToWorkerPrint ref={componentRef} printObj={printObj} />
          </div>
          <div style={{ display: "none" }}>
            <IssueToWorkerTreePrint
              ref={componentTreeRef}
              printObj={treePrintObj}
            />
          </div>
        </div>
      </Box>
      {/* </Modal> */}
    </>
  );
};

export default IssueToWorker;
