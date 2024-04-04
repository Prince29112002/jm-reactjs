import {
  Box,
  Checkbox,
  Chip,
  Icon,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import {
  Delete,
  Edit,
  FlipCameraAndroid,
  Info,
  Print,
} from "@material-ui/icons";
import { makeStyles, useTheme } from "@material-ui/styles";
import Config from "app/fuse-configs/Config";
import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Select, { createFilter } from "react-select";
import { useReactToPrint } from "react-to-print";
// import EditLot from "../../ProductionSubView/EditLot/EditLot";
import History from "@history";
import clsx from "clsx";
import useSortableData from "app/main/apps/Stock/Components/useSortableData";
import Loader from "app/main/Loader/Loader";
import { ProductionPrintComp } from "../../ProductionComp/ProductionPrintComp/ProductionPrintComp";
import LoaderPopup from "app/main/Loader/LoaderPopup";
import { VoucherPopupPrintCom } from "app/main/apps/Stock/VoucherPopupPrintCom/VoucherPopupPrintCom";

const useStyles = makeStyles((theme) => ({
  root: {},
  waxCreationTable: {
    overflowX: "auto",
  },
  paper: {
    position: "absolute",
    // width: 400,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
  },
  table: {
    minWidth: 2000,
  },
  tableRowPad: {
    padding: 7,
  },
  iconbtn: {
    fontSize: "0.8rem",
    padding: 0,
    "&:hover": {
      background: "transparent",
    },
  },
  iconsize: {
    fontSize: "2rem",
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

const WaxSetting = (props) => {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();

  const [printProduction, setPrintProduction] = useState([]);

  const [printObj, setPrintObj] = useState([]);
  const [printData, setPrintData] = useState([]);
  const [voucherandId, setVoucherandId] = useState({});

  const [isView, setIsView] = useState(false);
  const componentRef = React.useRef(null);
  const onBeforeGetContentResolve = React.useRef(null);
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [StockType, setStockType] = useState("");
  // const HandleDelete = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleAfterPrint = () => {
    console.log("`onAfterPrint` called", isView);
    checkAndReset();
  };
  function checkAndReset() {
    if (isView === false) {
      console.log("cond true", isView);
    }
  }
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
  }, []);

  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
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
    documentTitle: "production_print_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    // removeAfterPrint: true
  });

  function handleOpen(data) {
    setPrintProduction(data);
    handlePrint();
  }

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  const [departmentData, setDepartmentData] = useState([]);
  const [stockListData, setStockListData] = useState([]);
  const [logInSearchData, setLogInSearchData] = useState({
    stockType: "",
    stockCode: "",
    category: "",
    purity: "",
    qty: "",
    treeWeight: "",
    waxWeight: "",
    grossWeight: "",
    stoneWeight: "",
    netWeight: "",
    currentProcess: "",
    nextProcess: "",
    workerName: "",
    transit: "",
    orderInfo: "",
  });
  const [searchData, setSearchData] = useState({
    stockType: "",
    StockCode: "",
    category: "",
    purity: "",
    pieces: "",
    grossWeight: "",
    netWeight: "",
    fineGold: "",
    otherWeight: "",
    info: [],
    materialDetails: "",
    previousProcess: "",
    lastVNum: "",
    workStation: "",
    transit: [],
  });
  const [selectedBarcode, setSelectedBarcode] = useState([]);
  const [selectedArray, setSelectedArray] = useState([]);
  const [processList, setProcessList] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const [loading, setLoading] = useState(true);
  const orderInfoList = [
    {
      id: 0,
      name: "Not Casted",
    },
    {
      id: 1,
      name: "Casted",
    },
  ];
  const transitList = [
    {
      id: 0,
      name: "In",
    },
    {
      id: 1,
      name: "Out",
    },
  ];

  const SelectedEditLot = (data) => {
    History.push("/dashboard/production/editlot", { data: data });
  };

  useEffect(() => {
    if (typeof props.selectedLotData === "function") {
      props.selectedLotData(selectedBarcode, selectedId);
    }
  }, [selectedId]);
  useEffect(() => {
    if (props.departmentId) {
      setSelectedId([]);
      getDepartmentData();
      getStockListData();
    }
  }, [props.departmentId]);
  function getDepartmentData() {
    setLoading(true);
    Axios.get(
      Config.getCommonUrl() +
        `api/production/stock/?department_id=${props.departmentId}`
    )
      .then((response) => {
        if (response.data.success) {
          console.log(response.data.data);
          setDepartmentData(response.data.data);
          props.setRenderApi(false);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: `api/production/stock/?department_id=${props.departmentId}`,
        });
      });
  }
  function getStockListData() {
    Axios.get(
      Config.getCommonUrl() +
        `api/productionStock/stock?department_id=${props.departmentId}`
    )
      .then((response) => {
        if (response.data.success) {
          console.log(response.data.data);
          setStockListData(response.data.data);
          // props.setRenderApi(false);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/productionStock/stock?department_id=${props.departmentId}`,
        });
      });
  }
  useEffect(() => {
    getProcessData();
  }, []);
  function getProcessData(id) {
    // setLoading(true)
    Axios.get(Config.getCommonUrl() + "api/process")
      .then(function (response) {
        if (response.data.success === true) {
          setProcessList(response.data.data);
          const desiredObject = response.data.data.find(
            (item) => item.product_category_id === id
          );
          // if (desiredObject) {
          //   setProcessName({
          //     value: desiredObject.product_category_id,
          //     label: desiredObject.process_line_name,
          //   });
          // }
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
          // setLoading(false)
        }
      })
      .catch((error) => {
        // setLoading(false)
        handleError(error, dispatch, { api: "api/process" });
      });
  }
  const handleSearchLoginData = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    // const searchItem = searchData;
    setLogInSearchData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectAll = () => {
    if (selectedBarcode.length === departmentData.length) {
      // If all rows are selected, unselect all
      setSelectedBarcode([]);
      setSelectedArray([]);
      // setExportTagedData([]);
    } else {
      // Otherwise, select all rows
      const allRowNames = departmentData.map((data) => data.lot_id);
      setSelectedBarcode(allRowNames);
      setSelectedArray(departmentData);
      // setExportTagedData(apiData);
    }
  };
  const handleSelectedBarcode = (obj) => {
    if (selectedBarcode.includes(obj.lot_id)) {
      const updatedArray = selectedBarcode.filter(
        (item) => item !== obj.lot_id
      );
      const updatedObj = selectedArray.filter(
        (item) => item.lot_id !== obj.lot_id
      );
      // const updateExportTagedData = exportTagedData.filter(
      //   (item) => item.NAME !== obj.NAME
      // );
      setSelectedBarcode(updatedArray);
      setSelectedArray(updatedObj);
      // setExportTagedData(updateExportTagedData);
    } else {
      const updateBarcodeData = [...selectedBarcode, obj.lot_id];
      const updateBarcodeObj = [...selectedArray, obj];
      // const updateExportTagedData = [...exportTagedData, obj];

      setSelectedBarcode(updateBarcodeData);
      setSelectedArray(updateBarcodeObj);
      // setExportTagedData(updateExportTagedData);
    }
  };
  const handleCurentProcess = (event) => {
    setLogInSearchData((prevState) => ({
      ...prevState,
      currentProcess: event?.label,
    }));
  };
  const handleNextProcess = (event) => {
    setLogInSearchData((prevState) => ({
      ...prevState,
      nextProcess: event?.label,
    }));
  };
  const handleOrderInfo = (event) => {
    setLogInSearchData((prevState) => ({
      ...prevState,
      orderInfo: event?.id,
    }));
  };
  useEffect(() => {
    if (props.departmentId) {
      setSelectedBarcode([]);
      getDepartmentData();
      setSelectedId([]);
    }
  }, [props.renderApi]);

  const { items, requestSort, sortConfig } = useSortableData(stockListData);
  const handleSearchData = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    // const searchItem = searchData;
    setSearchData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleOrderSearch = (value) => {
    // const searchItem = searchData;
    setSearchData((prevState) => ({
      ...prevState,
      ["info"]: value,
    }));
  };
  const handleTransitSearch = (value) => {
    // const searchItem = searchData;
    setSearchData((prevState) => ({
      ...prevState,
      ["transit"]: value,
    }));
  };

  function handleChecked(event, element) {
    console.log(element);
    let checked = event.target.checked;
    console.log(checked, element);

    if (checked === false) {
      let selected = selectedId.filter(({ ids }) => {
        return ids.some((v) => !element.id.includes(v.stock_id));
      });
      setSelectedId(selected);
      // dlData(selected)
      console.log("in111", selected);
    } else {
      let tmpData = [
        ...selectedId,
        {
          // department_id: element.department_id,
          element: {
            ...element,
            pcs: element.hasOwnProperty("available_pcs")
              ? element.available_pcs
              : element.pcs,
          },
          flag: element.flag,
          isSame: true,
          utilize: element.hasOwnProperty("available_weight")
            ? element.available_weight
            : element.gross_weight,
          utiliseErr: "",
          pcserr: "",
          utilizePcs: element.hasOwnProperty("available_pcs")
            ? element.available_pcs
            : element.pcs,
          is_lot_barcoded: element.is_lot_barcoded,
          ids: element.id.map((data) => {
            return {
              stock_id: data,
            };
          }),
        },
      ];
      setSelectedId(tmpData);
      // dlData(tmpData)
      console.log("in2222", tmpData);
    }
  }
  console.log(selectedId, props.height);

  const handleVoucherClick = (element) => {
    console.log(element);
    setVoucherandId(element);
    setOpen(true);
  };

  const handleStockPrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Production stock-list_Print_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    // removeAfterPrint: true
  });

  function handleStockPrintOpen() {
    PostStockListPrintData();
    setTimeout(() => {
      handleStockPrint();
    }, 1000);
  }

  function PostStockListPrintData() {
    const body = {
      voucher_number: voucherandId.voucher_no,
      stock_ids: voucherandId.id,
    };
    Axios.post(
      Config.getCommonUrl() + `api/productionPrintVoucher/transfer/stock/print`,
      body
    )
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setPrintObj(response.data.data);
          setPrintData(response.data);
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
          api: `api/productionPrintVoucher/transfer/stock/print`,
          body: body,
        });
      });
  }

  return (
    <Box sx={{ width: "100%", paddingTop: "20px" }}>
      {loading && <Loader />}

      <TableContainer
        style={{
          maxHeight: `calc(100vh - (${props.height}px + 110px))`,
          minHeight: 500,
        }}
      >
        <Table
          className={clsx(classes.table, "production_table")}
          style={{
            overflowY: "auto",
            tableLayout: "auto",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell
                className={clsx(classes.tableRowPad)}
                width={40}
              ></TableCell>
              <TableCell className={clsx(classes.tableRowPad)}>
                Stock Type
              </TableCell>
              <TableCell className={clsx(classes.tableRowPad)}>
                Stock Code
              </TableCell>
              <TableCell className={clsx(classes.tableRowPad)}>
                Category
              </TableCell>
              <TableCell className={clsx(classes.tableRowPad)}>
                Purity
              </TableCell>
              <TableCell className={clsx(classes.tableRowPad)}>
                Pieces
              </TableCell>
              <TableCell className={clsx(classes.tableRowPad)}>
                Gross Weight
              </TableCell>
              <TableCell className={clsx(classes.tableRowPad)}>
                Net Weight
              </TableCell>
              <TableCell className={clsx(classes.tableRowPad)}>
                Fine Gold
              </TableCell>
              <TableCell className={clsx(classes.tableRowPad)}>
                Other Weight
              </TableCell>
              <TableCell className={classes.tableRowPad} style={{ width: 120 }}>
                Order Info
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                Workstation Name
              </TableCell>
              <TableCell className={clsx(classes.tableRowPad)}>
                Material Details
              </TableCell>
              <TableCell className={clsx(classes.tableRowPad)}>
                Previous Process
              </TableCell>
              <TableCell className={clsx(classes.tableRowPad)}>
                Last Performed V. Num
              </TableCell>
              <TableCell
                className={clsx(classes.tableRowPad)}
                style={{ width:"10%" }}
              >
                Transit
              </TableCell>
              <TableCell
                className={clsx(classes.tableRowPad)}
                style={{ paddingRight: 28 }}
              >
                Action
              </TableCell>
            </TableRow>
            <TableRow style={{ verticalAlign: "top" }}>
              <TableCell className={classes.tableRowPad}></TableCell>
              <TableCell className={classes.tableRowPad}>
                <TextField name="stockType" onChange={handleSearchData} />

                <IconButton
                  style={{ padding: "0" }}
                  onClick={() => requestSort("stockType")}
                >
                  <Icon className="mr-8" style={{ color: "#000" }}>
                    {" "}
                    sort{" "}
                  </Icon>

                  {sortConfig &&
                    sortConfig.key === "stockType" &&
                    sortConfig.direction === "ascending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_downward{" "}
                      </Icon>
                    )}
                  {sortConfig &&
                    sortConfig.key === "stockType" &&
                    sortConfig.direction === "descending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_upward{" "}
                      </Icon>
                    )}
                </IconButton>
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                <TextField name="StockCode" onChange={handleSearchData} />

                <IconButton
                  style={{ padding: "0" }}
                  onClick={() => requestSort("stock_name_code")}
                >
                  <Icon className="mr-8" style={{ color: "#000" }}>
                    {" "}
                    sort{" "}
                  </Icon>

                  {sortConfig &&
                    sortConfig.key === "stock_name_code" &&
                    sortConfig.direction === "ascending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_downward{" "}
                      </Icon>
                    )}
                  {sortConfig &&
                    sortConfig.key === "stock_name_code" &&
                    sortConfig.direction === "descending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_upward{" "}
                      </Icon>
                    )}
                </IconButton>
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                <TextField name="category" onChange={handleSearchData} />

                <IconButton
                  style={{ padding: "0" }}
                  onClick={() => requestSort("category_name")}
                >
                  <Icon className="mr-8" style={{ color: "#000" }}>
                    {" "}
                    sort{" "}
                  </Icon>

                  {sortConfig &&
                    sortConfig.key === "category_name" &&
                    sortConfig.direction === "ascending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_downward{" "}
                      </Icon>
                    )}
                  {sortConfig &&
                    sortConfig.key === "category_name" &&
                    sortConfig.direction === "descending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_upward{" "}
                      </Icon>
                    )}
                </IconButton>
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                <TextField name="purity" onChange={handleSearchData} />

                <IconButton
                  style={{ padding: "0" }}
                  onClick={() => requestSort("purity")}
                >
                  <Icon className="mr-8" style={{ color: "#000" }}>
                    {" "}
                    sort{" "}
                  </Icon>

                  {sortConfig &&
                    sortConfig.key === "purity" &&
                    sortConfig.direction === "ascending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_downward{" "}
                      </Icon>
                    )}
                  {sortConfig &&
                    sortConfig.key === "purity" &&
                    sortConfig.direction === "descending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_upward{" "}
                      </Icon>
                    )}
                </IconButton>
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                <TextField name="pieces" onChange={handleSearchData} />

                <IconButton
                  style={{ padding: "0" }}
                  onClick={() => requestSort("pcs")}
                >
                  <Icon className="mr-8" style={{ color: "#000" }}>
                    {" "}
                    sort{" "}
                  </Icon>

                  {sortConfig &&
                    sortConfig.key === "pcs" &&
                    sortConfig.direction === "ascending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_downward{" "}
                      </Icon>
                    )}
                  {sortConfig &&
                    sortConfig.key === "pcs" &&
                    sortConfig.direction === "descending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_upward{" "}
                      </Icon>
                    )}
                </IconButton>
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                <TextField name="grossWeight" onChange={handleSearchData} />

                <IconButton
                  style={{ padding: "0" }}
                  onClick={() => requestSort("gross_weight")}
                >
                  <Icon className="mr-8" style={{ color: "#000" }}>
                    {" "}
                    sort{" "}
                  </Icon>

                  {sortConfig &&
                    sortConfig.key === "gross_weight" &&
                    sortConfig.direction === "ascending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_downward{" "}
                      </Icon>
                    )}
                  {sortConfig &&
                    sortConfig.key === "gross_weight" &&
                    sortConfig.direction === "descending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_upward{" "}
                      </Icon>
                    )}
                </IconButton>
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                <TextField name="netWeight" onChange={handleSearchData} />

                <IconButton
                  style={{ padding: "0" }}
                  onClick={() => requestSort("net_weight")}
                >
                  <Icon className="mr-8" style={{ color: "#000" }}>
                    {" "}
                    sort{" "}
                  </Icon>

                  {sortConfig &&
                    sortConfig.key === "net_weight" &&
                    sortConfig.direction === "ascending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_downward{" "}
                      </Icon>
                    )}
                  {sortConfig &&
                    sortConfig.key === "net_weight" &&
                    sortConfig.direction === "descending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_upward{" "}
                      </Icon>
                    )}
                </IconButton>
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                <TextField name="fineGold" onChange={handleSearchData} />

                <IconButton
                  style={{ padding: "0" }}
                  onClick={() => requestSort("fineGold")}
                >
                  <Icon className="mr-8" style={{ color: "#000" }}>
                    {" "}
                    sort{" "}
                  </Icon>

                  {sortConfig &&
                    sortConfig.key === "fineGold" &&
                    sortConfig.direction === "ascending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_downward{" "}
                      </Icon>
                    )}
                  {sortConfig &&
                    sortConfig.key === "fineGold" &&
                    sortConfig.direction === "descending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_upward{" "}
                      </Icon>
                    )}
                </IconButton>
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                <TextField name="otherWeight" onChange={handleSearchData} />

                <IconButton
                  style={{ padding: "0" }}
                  onClick={() => requestSort("other_weight")}
                >
                  <Icon className="mr-8" style={{ color: "#000" }}>
                    {" "}
                    sort{" "}
                  </Icon>

                  {sortConfig &&
                    sortConfig.key === "other_weight" &&
                    sortConfig.direction === "ascending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_downward{" "}
                      </Icon>
                    )}
                  {sortConfig &&
                    sortConfig.key === "other_weight" &&
                    sortConfig.direction === "descending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_upward{" "}
                      </Icon>
                    )}
                </IconButton>
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {/* <TextField name="info" onChange={handleSearchData} /> */}
                <Select
                  placeholder="Order Info"
                  styles={{ selectStyles }}
                  options={orderInfoList.map((group) => ({
                    value: group.id,
                    label: group.name,
                  }))}
                  isClearable
                  value={searchData.info}
                  filterOption={createFilter({ ignoreAccents: false })}
                  onChange={handleOrderSearch}
                />
                <IconButton
                  style={{ padding: "0" }}
                  onClick={() => requestSort("order_info")}
                >
                  <Icon className="mr-8" style={{ color: "#000" }}>
                    {" "}
                    sort{" "}
                  </Icon>

                  {sortConfig &&
                    sortConfig.key === "order_info" &&
                    sortConfig.direction === "ascending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_downward{" "}
                      </Icon>
                    )}
                  {sortConfig &&
                    sortConfig.key === "order_info" &&
                    sortConfig.direction === "descending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_upward{" "}
                      </Icon>
                    )}
                </IconButton>
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                <TextField name="workStation" onChange={handleSearchData} />

                <IconButton
                  style={{ padding: "0" }}
                  onClick={() => requestSort("work_station")}
                >
                  <Icon className="mr-8" style={{ color: "#000" }}>
                    {" "}
                    sort{" "}
                  </Icon>

                  {sortConfig &&
                    sortConfig.key === "work_station" &&
                    sortConfig.direction === "ascending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_downward{" "}
                      </Icon>
                    )}
                  {sortConfig &&
                    sortConfig.key === "work_station" &&
                    sortConfig.direction === "descending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_upward{" "}
                      </Icon>
                    )}
                </IconButton>
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                <TextField name="materialDetails" onChange={handleSearchData} />

                <IconButton
                  style={{ padding: "0" }}
                  onClick={() => requestSort("material_detail")}
                >
                  <Icon className="mr-8" style={{ color: "#000" }}>
                    {" "}
                    sort{" "}
                  </Icon>

                  {sortConfig &&
                    sortConfig.key === "material_detail" &&
                    sortConfig.direction === "ascending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_downward{" "}
                      </Icon>
                    )}
                  {sortConfig &&
                    sortConfig.key === "material_detail" &&
                    sortConfig.direction === "descending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_upward{" "}
                      </Icon>
                    )}
                </IconButton>
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                <TextField name="previousProcess" onChange={handleSearchData} />

                <IconButton
                  style={{ padding: "0" }}
                  onClick={() => requestSort("process")}
                >
                  <Icon className="mr-8" style={{ color: "#000" }}>
                    {" "}
                    sort{" "}
                  </Icon>

                  {sortConfig &&
                    sortConfig.key === "process" &&
                    sortConfig.direction === "ascending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_downward{" "}
                      </Icon>
                    )}
                  {sortConfig &&
                    sortConfig.key === "process" &&
                    sortConfig.direction === "descending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_upward{" "}
                      </Icon>
                    )}
                </IconButton>
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                <TextField name="lastVNum" onChange={handleSearchData} />

                <IconButton
                  style={{ padding: "0" }}
                  onClick={() => requestSort("voucher_no")}
                >
                  <Icon className="mr-8" style={{ color: "#000" }}>
                    {" "}
                    sort{" "}
                  </Icon>

                  {sortConfig &&
                    sortConfig.key === "voucher_no" &&
                    sortConfig.direction === "ascending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_downward{" "}
                      </Icon>
                    )}
                  {sortConfig &&
                    sortConfig.key === "voucher_no" &&
                    sortConfig.direction === "descending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_upward{" "}
                      </Icon>
                    )}
                </IconButton>
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                <Select
                  placeholder="Transit"
                  styles={{ selectStyles }}
                  options={transitList.map((group) => ({
                    value: group.id,
                    label: group.name,
                  }))}
                  isClearable
                  value={searchData.transit}
                  filterOption={createFilter({ ignoreAccents: false })}
                  onChange={handleTransitSearch}
                />
              </TableCell>
              <TableCell className={classes.tableRowPad}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items
              .filter((temp) => {
                console.log(temp);
                console.log(searchData);
                // console.log(temp.order_info, searchData.info);
                // console.log(temp.order_info === searchData.info?.value);
                if (searchData.stockType) {
                  return temp.stockType
                    .toLowerCase()
                    .includes(searchData.stockType.toLowerCase());
                } else if (searchData.StockCode) {
                  return temp.stock_name_code
                    .toLowerCase()
                    .includes(searchData.StockCode.toLowerCase());
                } else if (searchData.category) {
                  //&& temp.category_name
                  return temp.category_name !== undefined &&
                    temp.category_name !== null
                    ? temp.category_name
                        .toLowerCase()
                        .includes(searchData.category.toLowerCase())
                    : null;
                } else if (searchData.purity) {
                  return temp.purity !== null
                    ? temp.purity
                        .toString()
                        .toLowerCase()
                        .includes(searchData.purity.toLowerCase())
                    : null;
                } else if (searchData.pieces) {
                  return temp.pcs !== null
                    ? temp.pcs
                        .toString()
                        .toLowerCase()
                        .includes(searchData.pieces.toLowerCase())
                    : null;
                } else if (searchData.grossWeight) {
                  return temp.gross_weight
                    .toString()
                    .toLowerCase()
                    .includes(searchData.grossWeight.toLowerCase());
                } else if (searchData.netWeight) {
                  return temp.net_weight
                    .toString()
                    .toLowerCase()
                    .includes(searchData.netWeight.toLowerCase());
                } else if (searchData.fineGold) {
                  return temp.fineGold !== null
                    ? temp.fineGold
                        .toString()
                        .toLowerCase()
                        .includes(searchData.fineGold.toLowerCase())
                    : null;
                } else if (searchData.otherWeight) {
                  return temp.other_weight
                    .toString()
                    .toLowerCase()
                    .includes(searchData.otherWeight.toLowerCase());
                } else if (searchData.info && searchData.info.length !== 0) {
                  return temp.hasOwnProperty("order_info") &&
                    temp.order_info !== null &&
                    searchData.info.length !== 0
                    ? temp.order_info === searchData.info.value
                    : null;
                } else if (searchData.workStation) {
                  return temp.hasOwnProperty("work_station") &&
                    temp.work_station !== null
                    ? temp.work_station
                        .toLowerCase()
                        .includes(searchData.workStation.toLowerCase())
                    : null;
                } else if (searchData.materialDetails) {
                  return temp.hasOwnProperty("material_detail") &&
                    temp.material_detail !== null
                    ? temp.material_detail
                        .toLowerCase()
                        .includes(searchData.materialDetails.toLowerCase())
                    : null;
                } else if (searchData.previousProcess) {
                  return temp.process !== null
                    ? temp.process
                        .toLowerCase()
                        .includes(searchData.previousProcess.toLowerCase())
                    : null;
                } else if (searchData.lastVNum) {
                  return temp.voucher_no !== null
                    ? temp.voucher_no
                        .toString()
                        .toLowerCase()
                        .includes(searchData.lastVNum.toLowerCase())
                    : null;
                } else if (
                  searchData.transit &&
                  searchData.transit.length !== 0
                ) {
                  return temp.hasOwnProperty("transit") &&
                    temp.transit !== null &&
                    searchData.transit.length !== 0
                    ? temp.transit
                        .toString()
                        .toLowerCase()
                        .includes(searchData.transit.label.toLowerCase())
                    : null;
                } else {
                  return temp;
                }
              })
              .map((element, index) => {
                console.log(element);
                return (
                  <TableRow key={index}>
                    {console.log(selectedBarcode, selectedId)}
                    <TableCell className={classes.tableRowPad}>
                      <Checkbox
                        name="selectlot"
                        style={{
                          color:
                            element.transit === "Out" ||
                            element.is_issue_for_hallmark == 1
                              ? "#ccc"
                              : "#306ff1",
                          padding: 0,
                        }}
                        onChange={(e) => handleChecked(e, element)}
                        checked={selectedId.some((item) =>
                          element.id.some((id) => item.element.id.includes(id))
                        )}
                        disabled={
                          element.transit === "Out" ||
                          element.is_issue_for_hallmark == 1
                        }
                      />
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {/* Stock Type */}
                      {element.stockType}
                    </TableCell>
                    <TableCell
                      // className={classes.tableRowPad}
                      className={clsx(classes.tableRowPad, classes.hoverClass)}
                      // onClick={(e) =>
                      //     handleClick(element)
                      // }
                    >
                      {element.stock_name_code}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {/* Variant */}
                      {element.hasOwnProperty("category_name")
                        ? element.category_name
                        : "-"}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {/* Purity */}
                      {element.purity}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {element.pcs === null ? "-" : element.pcs}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {parseFloat(element.gross_weight).toFixed(3)}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {parseFloat(element.net_weight).toFixed(3)}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {element.fineGold}
                      {/* {element.flag === 1 && element.item_id === 1 ? parseFloat(parseFloat(element.net_weight) * parseFloat(element.purity) / 100).toFixed(3) : "-"} */}
                    </TableCell>

                    <TableCell className={classes.tableRowPad}>
                      {parseFloat(element.other_weight).toFixed(3)}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {!element.hasOwnProperty("order_info")
                        ? "-"
                        : element.order_info === 0
                        ? "Not casted"
                        : element.order_info !== null
                        ? "Casted"
                        : "-"}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {element.hasOwnProperty("work_station") &&
                      element.work_station !== null
                        ? element.work_station
                        : "-"}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {/* Material Details */}
                      {element.hasOwnProperty("material_detail") &&
                      element.material_detail !== null
                        ? element.material_detail
                        : "-"}
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {/* Previous Process */}
                      {element.process}
                    </TableCell>
                    <TableCell
                      className={classes.tableRowPad}
                    >
                      {/* Last Performed V. Num */}
                      {element.voucher_no}
                    </TableCell>
                    <TableCell className={clsx(classes.tableRowPad, classes.hoverClass)} 
                      onClick={(e) => handleVoucherClick(element)}
                      style={{color:"#1e90ff", cursor:"pointer"}}
                    >
                      {/* Transit */}
                      {element.transit === null ? "- " : element.transit}
                      {element.transfer_voucher !== null ? ` - ${element.transfer_voucher}` : " " }
                    </TableCell>
                    <TableCell className={classes.tableRowPad}>
                      {/* {element.flag === 5 ? <>
                                            {
                                                authAccessArr.includes('Edit Packet') &&  <IconButton
                                                style={{ padding: "0" }}
                                                onClick={(ev) => {
                                                    ev.preventDefault();
                                                    ev.stopPropagation();
                                                    editHandler(element.packet_id,element.stock_name_code);
                                                }}
                                            >
                                                <Icon
                                                    style={{ color: "#000", marginRight: 3 }}
                                                >
                                                    edit
                                                </Icon>
                                            </IconButton>
                                            } 
                                            {
                                                authAccessArr.includes('Delete Packet') && <IconButton
                                                style={{ padding: "0" }}
                                                onClick={(ev) => {
                                                    ev.preventDefault();
                                                    ev.stopPropagation();
                                                    deleteHandler(element.packet_id);
                                                }}
                                            >
                                                    <Icon className="mr-0" style={{ color: "red" }}>
                                                        delete
                                                    </Icon>
                                            </IconButton>
                                            }
                                        </> : 
                                        element.flag === 6 ? <>
                                        {
                                            authAccessArr.includes('Edit Packing Slip') &&   <IconButton
                                            style={{ padding: "0" }}
                                            onClick={(ev) => {
                                                ev.preventDefault();
                                                ev.stopPropagation();
                                                editHandlerSlip(element.packing_slip_id,element.stock_name_code);
                                            }}
                                            disabled={element.is_issue_for_hallmark == 1 ? true : false}
                                        >
                                            <Icon
                                                className="mr-8"
                                                style={element.is_issue_for_hallmark == 1  ? { color: "lightgray" } : { color: "#000" }}
                                            >
                                                edit
                                            </Icon>
                                        </IconButton>
                                        }
                                      </> : ''} */}
                    </TableCell>
                  </TableRow>
                );
              })}
            {items.length === 0 && (
              <TableRow>
                <TableCell
                  className={classes.tableRowPad}
                  align="center"
                  colSpan={17}
                >
                  No Data Available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className={classes.tableRowPad}></TableCell>
              <TableCell className={classes.tableRowPad}>
                {/* Stock Type */}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {/* {element.stock_name_code} */}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {/* Variant */}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {/* Purity */}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {/* {pcs } */}
                <b>
                  {parseFloat(
                    items
                      .filter(
                        (item) =>
                          item.pcs !== "" &&
                          item.pcs !== "-" &&
                          item.pcs !== null
                      )
                      .map((item) => parseFloat(item.pcs))
                      .reduce(function (a, b) {
                        return parseFloat(a) + parseFloat(b);
                      }, 0)
                  )}
                </b>
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {/* {gross_weight} */}
                <b>
                  {parseFloat(
                    items
                      .filter(
                        (item) =>
                          item.gross_weight !== "" && item.gross_weight !== "-"
                      )
                      .map((item) => parseFloat(item.gross_weight))
                      .reduce(function (a, b) {
                        return parseFloat(a) + parseFloat(b);
                      }, 0)
                  ).toFixed(3)}
                </b>
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {/* {net_weight} */}
                <b>
                  {parseFloat(
                    items
                      .filter((item) => item.net_weight !== "")
                      .map((item) => parseFloat(item.net_weight))
                      .reduce(function (a, b) {
                        return parseFloat(a) + parseFloat(b);
                      }, 0)
                  ).toFixed(3)}
                </b>
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {/* {element.fineGold} */}
              </TableCell>

              <TableCell className={classes.tableRowPad}>
                {/* {other_weight} */}
                <b>
                  {parseFloat(
                    items
                      .filter((item) => item.other_weight !== "")
                      .map((item) => parseFloat(item.other_weight))
                      .reduce(function (a, b) {
                        return parseFloat(a) + parseFloat(b);
                      }, 0)
                  ).toFixed(3)}
                </b>
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {/* Info */}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {/* work station name */}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {/* Material Details */}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {/* Previous Process */}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {/* Last Performed V. Num */}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {/* Transit */}
              </TableCell>
              <TableCell className={classes.tableRowPad}></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      {/* 
      <Modal
        style={{ textAlign: "center" }}
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          style={{
            modalStyle,
            background: "white",
            // height: "270px",
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "500px",
            transform: "translate(-50%, -50%)",
            // margin: "100px", // temporary
            borderRadius: "10px",
          }}
        >
          <div>
            <h2
              style={{
                textAlign: "center",
                background: "#F15656",
                height: "70px",
                padding: "20px",
                color: "white",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
                position: "relative",
              }}
            >
              Alert !!
              <IconButton
                onClick={handleClose}
                style={{
                  position: "absolute",
                  color: "white",
                  right: "10px",
                  top: "10px",
                }}
              >
                X
              </IconButton>
            </h2>

            <div
              style={{ fontSize: "20px", padding: "30px", textAlign: "center" }}
            >
              Are you sure you want to Delete this Lot ?
            </div>

            <div
              onClick={handleClose}
              style={{ textAlign: "center", paddingBottom: "25px" }}
            >
              <button
                style={{
                  padding: "12px",
                  fontSize: "15px",
                  width: "120px",
                  background: "none",
                  color: "#F15656",
                  border: "1px solid #F15656",
                  marginRight: "20px",
                }}
              >
                No
              </button>
              <button
                style={{
                  padding: "13px",
                  fontSize: "15px",
                  width: "120px",
                  background: "#20A720",
                  color: "white",
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </Box>
      </Modal> */}

      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
        <div style={modalStyle} className={classes.paper}>
          {loading && <LoaderPopup />}
          <h5
            className="p-5"
            style={{
              textAlign: "center",
              backgroundColor: "black",
              color: "white",
              height: "50px",
            }}
          >
            {/* {props.data.voucher_no} */}
            <IconButton
              style={{ position: "absolute", top: "0", right: "0" }}
              onClick={handleClose}
            >
              <Icon style={{ color: "white" }}>close</Icon>
            </IconButton>
          </h5>
          <div className="p-5 pl-16 pr-16 custom_stocklist_dv">
            <Table 
            // className={classes.table}
            >
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableRowPad} align="center">
                    View
                  </TableCell>
                  <TableCell className={classes.tableRowPad} align="center">
                    Print
                  </TableCell>
                  <TableCell className={classes.tableRowPad} align="center">
                    Trans Details
                  </TableCell>
                  <TableCell className={classes.tableRowPad} align="center">
                    Destination Details
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell align="center" className={classes.tableRowPad}>
                    <IconButton
                      style={{ padding: "0" }}
                      onClick={(ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        // viewHandler();
                      }}
                    >
                      <Icon
                        // className="mr-8"
                        style={{ color: "dodgerblue" }}
                      >
                        visibility
                      </Icon>
                    </IconButton>
                  </TableCell>

                  <TableCell align="center" className={classes.tableRowPad}>
                    <IconButton
                      style={{ padding: "0" }}
                      onClick={(ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        handleStockPrintOpen();
                      }}
                    >
                      <Icon
                        // className="mr-8"
                        style={{ color: "dodgerblue" }}
                      >
                        print
                      </Icon>
                    </IconButton>
                  </TableCell>

                  <TableCell align="left" className={classes.tableRowPad}>
                    {console.log(voucherandId)}
                    Doc Type : 
                    <br /> Doc No : {voucherandId?.transfer_voucher ? voucherandId?.transfer_voucher : "-"}
                    <br /> Doc Date : {voucherandId?.doc_date ? voucherandId?.doc_date : "-"}
                    <br /> Remarks : {voucherandId?.remarks ? voucherandId?.remarks : "-"}
                    <br /> Status :
                  </TableCell>

                  <TableCell align="left" className={classes.tableRowPad}>
                    Department : {voucherandId?.source_department ? voucherandId?.source_department : "-"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </Modal>

      <div style={{ display: "none" }}>
        <ProductionPrintComp ref={componentRef} printObj={printProduction} />
      </div>

      <div style={{ display: "none" }}>
        <VoucherPopupPrintCom
          ref={componentRef}
          printObj={printObj}
          printData={printData}
          StockType={voucherandId.flag}
        />
      </div>
    </Box>
  );
};

export default WaxSetting;
