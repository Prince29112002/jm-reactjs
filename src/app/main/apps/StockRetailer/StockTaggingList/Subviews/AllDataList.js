import React, { useState, useEffect, useRef } from "react";
import { Checkbox, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import TableFooter from "@material-ui/core/TableFooter";
import * as Actions from "app/store/actions";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import HelperFunc from "app/main/apps/SalesPurchase/Helper/HelperFunc";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import Loader from "../../../../Loader/Loader";
import clsx from "clsx";
import Button from "@material-ui/core/Button";
// import LotViewPopUp from "../PopUps/LotViewPopUp";
import { TextField } from "@material-ui/core";
import { Icon, IconButton } from "@material-ui/core";
import useSortableData from "../Subviews/useSortableData";
// import SplitDataView from "../PopUps/SplitDataView";
import GroupMerging from "../../../Tagging/GroupMerging/GroupMerging";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
// import VoucherPopup from "../PopUps/VoucherPopup";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import Icones from "assets/fornt-icons/Mainicons";
import Modal from "@material-ui/core/Modal";

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
  modalpaper: {
    position: "absolute",
    width: 500,
    zIndex: 1,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: "none",
  },
  tabroot: {
    overflowX: "auto",
    overflowY: "auto",
    height: "calc(100vh - 280px)",
  },
  table: {
    minWidth: 1500,
  },
  tableRowPad: {
    padding: 7,
  },
  button: {
    margin: 5,
    textTransform: "none",
    backgroundColor: "#415BD4",
    color: "#FFFFFF",
    borderRadius: 7,
    letterSpacing: "0.06px",
  },
  // centerHeading :{
  //     textAlign:'center',
  //     display:'block !important'
  //     // text-align: center;
  //     // display: block;
  // },
  padding: {
    paddingBottom: "30px !important",
  },
  hoverClass: {
    // backgroundColor: "#fff",
    "&:hover": {
      // backgroundColor: "#999",
      cursor: "pointer",
    },
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

const AllDataList = ({
  authAccessArr,
  props,
  allData,
  refreshApi,
  pgName,
  flag,
  onselectedBarcodeData,
  modalView,
  clearData
}) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [allStockList, setAllStockList] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [voucPopup, setVouchPopup] = useState(false); //for voucher print view popup
  const [popupData, setPopupData] = useState("");
  const [selectedId, setSelectedId] = useState([]);
  const [open, setOpen] = useState(false);
  const [packetDeleteId, setPacketDeleteId] = useState("");
  // const [selectedLots, setSelectedLots] = useState([]);
  const [afterData, setAfterData] = useState([]);
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
    info: "",
    materialDetails: "",
    previousProcess: "",
    lastVNum: "",
    order_number: "",
    reference_name: "",
    sellprice:"",
  });
  const [stock_name_code_id, set_stock_name_code_id] = useState([]);
  const [modalStyle] = useState(getModalStyle);
  const [modalOpen, setModalOpen] = useState(false);
  const [docFile, setDocFile] = useState("");
  const [imageFileErr, setimageFileErr] = useState("");
  const [Barcode, setBarcode] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedBarcode, setSelectedBarcode] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [saleEditId, setSaleEditId] = useState("")
  const [salePrice, setSalePrice] = useState("")
  const pageName = props.location.pathname;
  
  useEffect(()=> {
    console.log("call by")
    if(clearData){
      setSelectedBarcode([])
    }
  }, [clearData])

  const handleSelectedBarcode = (stockNameCode) => {
    console.log(stockNameCode);
    if (selectedBarcode.length > 21) {
      dispatch(
        Actions.showMessage({
          message:
            "You can select only 22 Barcode",
          variant: "error",
        })
      );
    } else {
      if (selectedBarcode.includes(stockNameCode)) {
        const updatedArray = selectedBarcode.filter(item => item !== stockNameCode)
        setSelectedBarcode(updatedArray);
        onselectedBarcodeData(updatedArray)
        console.log(selectedBarcode);
      } else {
        let updateBarcodeData = [...selectedBarcode, stockNameCode]

        setSelectedBarcode(updateBarcodeData);
        console.log(updateBarcodeData);
        onselectedBarcodeData(updateBarcodeData)
      }
    }
  };

  useEffect(() => {
    if (loading) {
      setTimeout(() => setLoading(false), 1000);
    }
  }, [loading]);

  const handleClick = (element) => {
    // console.log(element);

    if (element.flag !== 1 && element.flag !== 2) {
      // console.log(element.flag)
      setShowPopup(true);
      setPopupData(element);
    } else {
      setShowPopup(false);
      setPopupData("");
    }
  };
  function uploadimag(element) {
    console.log(element);
    setBarcode(element);
    setModalOpen(true);
  }

  const handleSearchData = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    // const searchItem = searchData;
    setSearchData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const { items, requestSort, sortConfig } = useSortableData(allData);

  function imageVAlidation() {
    if (docFile === "") {
      setimageFileErr("Please Select imageFile");
      return false;
    }
    return true;
  }

  function callImageUploadApi() {
    const formData = new FormData();
    formData.append("barcode", Barcode);
    formData.append("image", docFile);
    axios
      .post(
        Config.getCommonUrl() + "retailerProduct/api/stock/barcode/image",
        formData
      )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          dispatch(
            Actions.showMessage({
              message: "image Uploaded",
              variant: "success",
            })
          );
          setModalOpen(false);
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
          api: "retailerProduct/api/stock/barcode/image",
          body: formData,
        });
      });
  }

  function callImageviewApi() {
    if (Barcode) {
      // b
      const formData = new FormData();
      console.log(Barcode);
      formData.append("barcode", Barcode);
      const body = {
        barcode: Barcode,
      };
      axios
        .post(
          Config.getCommonUrl() + "retailerProduct/api/stock/image/barcode",
          body
        )
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            const img = response.data.data;
            setPreviewImage(img.img_path);
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
            api: "retailerProduct/api/stock/image/barcode",
            body: body,
          });
        });
    } else {
      // Handle the case when 'Barcode' is not available
      console.log("Barcode is not available. API call skipped.");
    }
  }

  useEffect(() => {
    // This effect will be triggered when Barcode changes.
    if (Barcode) {
      callImageviewApi(); // Call the API when Barcode is available
    }
  }, [Barcode]);
  function handleModalClose() {
    setModalOpen(false);
    setimageFileErr("")
  }

  const checkforUpdate = (evt) => {
    evt.preventDefault();
    if (imageVAlidation()) {
      callImageUploadApi();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setDocFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const editHandlers = (sId,prices) => {
    setOpenEditModal(true);
    setSaleEditId(sId);
    setSalePrice(prices)
  }
  const handleEditModalClose = () => {
    setOpenEditModal(false);
    setSaleEditId("")
    setSalePrice("")
  }

  const handleFormEdit = (e) => {
    e.preventDefault()
    if(salePrice){
      const body = {
        sales_price: salePrice,
      };
      axios.put(Config.getCommonUrl() + `retailerProduct/api/stock/salesprice/update/${saleEditId}`,body)
        .then((response) => {
          console.log(response);
          if (response.data.success) {
            handleEditModalClose()
            refreshApi()
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
            api: `retailerProduct/api/stock/salesprice/update/${saleEditId}`,
            body: body,
          });
        });
    }
  }

  return (
    <div className="">
      {loading && <Loader />}
      <Paper className={classes.tabroot}>
        <MaUTable className={classes.table}>
          <TableHead>
            <TableRow>
              {(modalView === 2 || modalView === 3 || modalView === 0) && pageName === "/dashboard/stocktaggingretailer" &&
              <TableCell className={clsx(classes.tableRowPad)} width={50}>
                
              </TableCell>}
              <TableCell className={clsx(classes.tableRowPad)}>
                Stock Type
              </TableCell>
              <TableCell className={clsx(classes.tableRowPad)}>
                Stock Code{" "}
              </TableCell>
              <TableCell className={clsx(classes.tableRowPad)}>
                Order No
              </TableCell>
              <TableCell className={clsx(classes.tableRowPad)}>
                Reference Name
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
                Fine
              </TableCell>
              <TableCell className={clsx(classes.tableRowPad)} align="left">
                Other Weight
              </TableCell>
              <TableCell className={clsx(classes.tableRowPad)} align="left">
                Sale Price
              </TableCell>
              <TableCell className={clsx(classes.tableRowPad)}>
                Action
              </TableCell>
            </TableRow>
            <TableRow>
            {(modalView === 2 || modalView === 3 || modalView === 0) && pageName === "/dashboard/stocktaggingretailer" &&
              <TableCell className={classes.tableRowPad} align="right">
                {/* <Checkbox
                  style={{ color: "#415BD4", padding: 0 }}
                  color="primary"
                /> */}
              </TableCell>}
              <TableCell className={classes.tableRowPad}>
                <TextField
                  name="stockType"
                  onChange={handleSearchData}
                  inputProps={{ className: "all-Search-box-data" }}
                />

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
                <TextField
                  name="StockCode"
                  onChange={handleSearchData}
                  inputProps={{ className: "all-Search-box-data" }}
                />

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
                <TextField
                  name="order_number"
                  onChange={handleSearchData}
                  inputProps={{ className: "all-Search-box-data" }}
                />

                <IconButton
                  style={{ padding: "0" }}
                  onClick={() => requestSort("order_number")}
                >
                  <Icon className="mr-8" style={{ color: "#000" }}>
                    {" "}
                    sort{" "}
                  </Icon>

                  {sortConfig &&
                    sortConfig.key === "order_number" &&
                    sortConfig.direction === "ascending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_downward{" "}
                      </Icon>
                    )}
                  {sortConfig &&
                    sortConfig.key === "order_number" &&
                    sortConfig.direction === "descending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_upward{" "}
                      </Icon>
                    )}
                </IconButton>
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                <TextField
                  name="reference_name"
                  onChange={handleSearchData}
                  inputProps={{ className: "all-Search-box-data" }}
                />

                <IconButton
                  style={{ padding: "0" }}
                  onClick={() => requestSort("reference_name")}
                >
                  <Icon className="mr-8" style={{ color: "#000" }}>
                    {" "}
                    sort{" "}
                  </Icon>

                  {sortConfig &&
                    sortConfig.key === "reference_name" &&
                    sortConfig.direction === "ascending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_downward{" "}
                      </Icon>
                    )}
                  {sortConfig &&
                    sortConfig.key === "reference_name" &&
                    sortConfig.direction === "descending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_upward{" "}
                      </Icon>
                    )}
                </IconButton>
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                <TextField
                  name="category"
                  onChange={handleSearchData}
                  inputProps={{ className: "all-Search-box-data" }}
                />

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
                <TextField
                  name="purity"
                  onChange={handleSearchData}
                  inputProps={{ className: "all-Search-box-data" }}
                />

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
                <TextField
                  name="pieces"
                  onChange={handleSearchData}
                  inputProps={{ className: "all-Search-box-data" }}
                />

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
                <TextField
                  name="grossWeight"
                  onChange={handleSearchData}
                  inputProps={{ className: "all-Search-box-data" }}
                />

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
                <TextField
                  name="netWeight"
                  onChange={handleSearchData}
                  inputProps={{ className: "all-Search-box-data" }}
                />

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
                <TextField
                  name="fineGold"
                  onChange={handleSearchData}
                  inputProps={{ className: "all-Search-box-data" }}
                />

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
                <TextField
                  name="otherWeight"
                  onChange={handleSearchData}
                  inputProps={{ className: "all-Search-box-data" }}
                />

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
                <TextField
                  name="sellprice"
                  onChange={handleSearchData}
                  inputProps={{ className: "all-Search-box-data" }}
                />

                <IconButton
                  style={{ padding: "0" }}
                  onClick={() => requestSort("sales_price")}
                >
                  <Icon className="mr-8" style={{ color: "#000" }}>
                    {" "}
                    sort{" "}
                  </Icon>

                  {sortConfig &&
                    sortConfig.key === "sales_price" &&
                    sortConfig.direction === "ascending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_downward{" "}
                      </Icon>
                    )}
                  {sortConfig &&
                    sortConfig.key === "sales_price" &&
                    sortConfig.direction === "descending" && (
                      <Icon className="mr-8" style={{ color: "#000" }}>
                        {" "}
                        arrow_upward{" "}
                      </Icon>
                    )}
                </IconButton>
              </TableCell>
              <TableCell className={classes.tableRowPad}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items
              .filter((temp) => {
                if (searchData.stockType) {
                  return temp.stockType
                    .toLowerCase()
                    .includes(searchData.stockType.toLowerCase());
                } else if (searchData.StockCode) {
                  return temp.stock_name_code
                    .toLowerCase()
                    .includes(searchData.StockCode.toLowerCase());
                } else if (searchData.order_number) {
                  //&& temp.category_name
                  return temp.order_number !== undefined &&
                    temp.order_number !== null
                    ? temp.order_number
                        .toLowerCase()
                        .includes(searchData.order_number.toLowerCase())
                    : null;
                } else if (searchData.reference_name) {
                  //&& temp.category_name
                  return temp.reference_name !== undefined &&
                    temp.reference_name !== null
                    ? temp.reference_name
                        .toLowerCase()
                        .includes(searchData.reference_name.toLowerCase())
                    : null;
                } else if (searchData.category) {
                  //&& temp.category_name
                  return temp.category_name !== undefined &&
                    temp.category_name !== null
                    ? temp.category_name
                        .toLowerCase()
                        .includes(searchData.category.toLowerCase())
                    : null;
                } else if (searchData.pieces) {
                  return temp.pcs !== null
                    ? temp.pcs
                        .toString()
                        .toLowerCase()
                        .includes(searchData.pieces.toLowerCase())
                    : null;
                } else if (searchData.purity) {
                  return temp.purity !== null
                    ? temp.purity
                        .toString()
                        .toLowerCase()
                        .includes(searchData.purity.toLowerCase())
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
                  return temp.hasOwnProperty("fineGold")
                    ? temp.fineGold !== null && temp.fineGold !== ""
                      ? temp.fineGold
                          .toString()
                          .toLowerCase()
                          .includes(searchData.fineGold.toLowerCase())
                      : null
                    : null;
                } else if (searchData.otherWeight) {
                  return temp.other_weight ? temp.other_weight
                    .toString()
                    .toLowerCase()
                    .includes(searchData.otherWeight.toLowerCase()) : null
                }else if (searchData.sellprice) {
                  return temp.sales_price ? temp.sales_price
                    .toString()
                    .toLowerCase()
                    .includes(searchData.sellprice.toLowerCase()) : null
                } else {
                  return temp;
                }
              })
              .map((element, index) => (
                <TableRow key={index}>
                  {(modalView === 2 || modalView === 3 || modalView === 0)&& [
                        "JP Re-Generated Barcode",
                        "Purchase Barcode",
                        "ORD Re-Generated Barcode",
                        "Order Barcode",
                      ].includes(element.stockType) && pageName === "/dashboard/stocktaggingretailer" ?
                  <TableCell className={classes.tableRowPad}>
                    <Checkbox
                      style={{ color: "#415BD4", padding: 0 }}
                      color="primary"
                      checked={selectedBarcode.includes(element.stock_name_code)}
                      onChange={() => handleSelectedBarcode(element.stock_name_code)}
                    />
                  </TableCell> : (modalView === 2 || modalView === 3 || modalView === 0)  && pageName === "/dashboard/stocktaggingretailer" && <TableCell className={classes.tableRowPad}>
                   
                  </TableCell>}
                  <TableCell className={classes.tableRowPad}>
                    {/* Stock Type */}
                    {element.stockType}
                  </TableCell>
                  <TableCell
                    className={clsx(classes.tableRowPad)}
                    // onClick={(e) =>
                    //     handleClick(element)
                    // }
                  >
                    {element.stock_name_code}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {/* Variant */}
                    {element.order_number !== "" ? element.order_number : "-"}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {/* Variant */}
                    {element.reference_name !== ""
                      ? element.reference_name
                      : "-"}
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
                    {element.fineGold ? element.fineGold : "-"}
                  </TableCell>
                  <TableCell
                    className={clsx(classes.tableRowPad, "float-left")}
                  >
                    {element.other_weight ? parseFloat(element.other_weight).toFixed(3) : "-"}
                  </TableCell>
                  <TableCell
                  >
                    {[
                      "JP Re-Generated Barcode",
                      "Purchase Barcode",
                      "ORD Re-Generated Barcode",
                      "Order Barcode",
                    ].includes(element.stockType)  ? <>  {element.sales_price && parseFloat(element.sales_price).toFixed(3)}      <IconButton
                        style={{ padding: "0" }}
                        onClick={(ev) => {
                          ev.preventDefault();
                          ev.stopPropagation();
                          editHandlers(element.stock_name_code,element.sales_price);
                        }}
                      >
                        <Icon
                        style={{ color: "dodgerblue" }}
                      >
                        create
                      </Icon>
                      </IconButton> </> : "-"}
                  </TableCell>
                  <TableCell className={classes.tableRowPad}>
                    {[
                      "JP Re-Generated Barcode",
                      "Purchase Barcode",
                      "ORD Re-Generated Barcode",
                      "Order Barcode",
                    ].includes(element.stockType) &&
                      <>
                      <Button
                        variant="contained"
                        className={classes.button}
                        size="small"
                        onClick={(ev) => {
                          ev.preventDefault();
                          ev.stopPropagation();
                          uploadimag(element.stock_name_code);
                        }}
                      >
                        Upload image
                      </Button>
                      </>
                    }
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          {flag === true && (
            <TableFooter>
              <TableRow>
                <TableCell className={classes.tableRowPad}></TableCell>
                <TableCell className={classes.tableRowPad}></TableCell>
                <TableCell className={classes.tableRowPad}>
                  {/* Stock Type */}
                </TableCell>

                <TableCell className={classes.tableRowPad}>
                  {/* Purity */}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {/* pcs */}
                  {parseFloat(
                    items
                      .filter((item) => item.pcs !== "" && item.pcs !== "-")
                      .map((item) => parseFloat(item.pcs))
                      .reduce(function (a, b) {
                        return parseFloat(a) + parseFloat(b);
                      }, 0)
                  )}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {/* {gross_weight} */}
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
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {/* {net_weight} */}
                  {parseFloat(
                    items
                      .filter((item) => item.net_weight !== "")
                      .map((item) => parseFloat(item.net_weight))
                      .reduce(function (a, b) {
                        return parseFloat(a) + parseFloat(b);
                      }, 0)
                  ).toFixed(3)}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {/* {element.fineGold} */}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {/* {other_weight} */}
                  {parseFloat(
                    items
                      .filter((item) => item.other_weight !== "")
                      .map((item) => parseFloat(item.other_weight))
                      .reduce(function (a, b) {
                        return parseFloat(a) + parseFloat(b);
                      }, 0)
                  ).toFixed(3)}
                </TableCell>
                <TableCell className={classes.tableRowPad}>
                  {/* {element.sales_price} */}
                </TableCell>
              </TableRow>
            </TableFooter>
          )}
        </MaUTable>
      </Paper>
      <Modal
        // disableBackdropClick
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={modalOpen}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleModalClose(false);
          }
        }}
      >
        <div
          style={modalStyle}
          className={clsx(classes.modalpaper, "rounded-8")}
        >
          <h5 className="popup-head p-20">
            Upload image
            <IconButton
              style={{ position: "absolute", top: "3px", right: "6px" }}
              onClick={handleModalClose}
            >
              <Icon>
                <img src={Icones.cross} alt="" />
              </Icon>
            </IconButton>
          </h5>
          <div
            className="pl-32 pr-32 pt-10 pb-10 overflow-y-scroll"
            style={{ height: "40vh", display: "flex", flexDirection: "column" }}
          >
            <p style={{ paddingBottom: "3px" }}>Upload image</p>
            <TextField
              className="mb-16 uploadDoc"
              placeholder="Upload document"
              type="file"
              inputProps={{
                multiple: true,
              }}
              onChange={handleFileChange}
              variant="outlined"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              error={imageFileErr.length > 0 ? true : false}
              helperText={imageFileErr}
            />
            <div style={{ display: "flex", flexBasis: "100%" }}>
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{
                    maxWidth: "70%",
                    marginInline: "auto",
                    display: "block",
                  }}
                />
              )}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                paddingTop: "30px",
              }}
            >
              <Button
                variant="contained"
                className="cancle-button-css"
                onClick={handleModalClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                className="save-button-css"
                onClick={(e) => checkforUpdate(e)}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={openEditModal}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleEditModalClose();
          }
        }}
      >
        <div style={modalStyle} className={clsx(classes.paper, "rounded-8")}>
          <h5 className="popup-head p-5">
           Edit Sale Price
            <IconButton
              style={{ position: "absolute", top: "3px", right: "7px" }}
              onClick={handleEditModalClose}
            >
              <img src={Icones.cross} alt="" />
            </IconButton>
          </h5>
          <div style={{ padding: "30px" }}>
            <p style={{ marginBottom: "10px", paddingLeft: "5px", color: "#242424" }}>Sale Price</p>
            <TextField
              autoFocus
              placeholder="Voucher name"
              name="salePrice"
              value={salePrice}
              onChange={(e) => {
                if(!isNaN(e.target.value)){
                  setSalePrice(e.target.value)
                }
              }}
              variant="outlined"
              fullWidth
            />
            <div
              className="flex flex-row justify-between"
              style={{ paddingTop: "30px" }}
            >
              <Button
                variant="contained"
                className="cancle-button-css"
                onClick={handleEditModalClose}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                className="save-button-css"
                onClick={(e) => handleFormEdit(e)}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AllDataList;
