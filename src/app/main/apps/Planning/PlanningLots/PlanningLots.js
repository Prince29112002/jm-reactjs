import React, { useState, useEffect } from "react";
import { Button, FormControl, FormControlLabel, Grid, Icon, IconButton, InputBase, Modal, Paper, Radio, RadioGroup, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import Axios from "axios";
import Config from "app/fuse-configs/Config";
import { useDispatch } from "react-redux";
import * as Actions from 'app/store/actions';
import handleError from "app/main/ErrorComponent/ErrorComponent";
import moment from "moment";
import * as XLSX from "xlsx";
import { useReactToPrint } from "react-to-print";
import Loader from "app/main/Loader/Loader";
import LotTransfer from "../Components/LotTransfer";
import LotSummary from "../../Production/ProductionMain/LotPrint/LotSummary";
import LotDesign from "../../Production/ProductionMain/LotPrint/LotDesign";


const useStyles = makeStyles((theme) => ({
  root: {},
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    outline: "none",
  },
  actionBtn: {
    background: "#1fd319",
    color: "#FFFFFF",
    width: "100%",
    borderRadius: "10px",
  },
  modalContainer: {
    paddingBlock: "20px",
    background: "rgba(0,0,0,0)",
    justifyContent: "space-between",
  },
  modal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBody: {
    padding: 20,
  },
  title: {
    padding: 10,
    background: "#000000",
    color: "#FFFFFF",
  },
  
  tabroot:{
    overflowY:"auto"
  },
  table: {
    minWidth: 1500,
  },
  tableRowPad: {
    padding: 7,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
    width: "260px",
    height: "37px",
    color: "#CCCCCC",
    opacity: 1,
    letterSpacing: "0.06px",
    font: "normal normal normal 14px/17px Inter",
  },
  search: {
    display: "flex",
    border: "1px solid #cccccc",
    float: "right",
    height: "38px",
    width: "260px",
    borderRadius: "7px !important",
    background: "#FFFFFF 0% 0% no-repeat padding-box",
    opacity: 1,
    padding: "2px 4px",
    alignItems: "center",
  },
  iconButton: {
    width: "19px",
    height: "19px",
    opacity: 1,
    color: "#CCCCCC",
  },
  searchBox: {
    padding: 6,
    fontSize: "12pt",
    borderColor: "darkgray",
    borderWidth: 1,
    borderRadius: 5,
    width: "50%",
  },
  button: {
    textTransform: "none",
    backgroundColor: "cornflowerblue",
    color: "white",
  },
  
}));


const PlanningLots = () => {
const dispatch = useDispatch();
const classes = useStyles();
const [planningLotsList, setPlanningLotsList] = useState([]);
const [isExpert, setIsExpert] = useState(false)

const [page, setPage] = useState(0);
const [count, setCount] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(10);
const [searching, setSearching] = useState(false);

const [searchData, setSearchData] = useState({
  orderNo: "",
  orderDate: "",
  shipingDate: "",
});

  const [filteredArrData, setFilteredArrData] = useState([]);

  const [transferModal, setTransferModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const DepartmentId = localStorage.getItem("SelectedDepartment");

  const [isView, setIsView] = useState(false); //for view Only 

  const componentRefDesign = React.useRef(null);
  const componentRefSummary = React.useRef(null);

  const [printObj, setPrintObj] = useState([]);
  const onBeforeGetContentResolve = React.useRef(null);

  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const [loading, setLoading] = useState(false);

  const handleSetPrint = (id) => {
    console.log(id);
    handlePrintLot(id);
    setOpen(true);
  };

  const [voucherPrintType, setVoucherPrintType] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [printObjMultiple, setPrintObjMultiple] = useState([]);

  const handleAfterPrint = () => {
    //React.useCallback
    console.log("`onAfterPrint` called", isView); // tslint:disable-line no-console
    //resetting after print
    checkAndReset();
  };
  
  function checkAndReset() {
    // console.log("checkAndReset", isView)
    // console.log("isView", isView)
    if (isView === false) {
      console.log("cond true", isView);
      // History.goBack();
      // setVoucherDate(moment().format("YYYY-MM-DD"));
      // setSelectedVendor("");
      // setBalanceRfixData("");
      // setBalRfixViewData([]);
      // setCanEnterVal(false);
      // setOppositeAccSelected("");
      // setPartyVoucherNum("");
      // setFirmName("");
      // setVendorStateId("");
      // setTdsTcsVou("");
      // setLedgerName("");
      // setIs_tds_tcs("");
      // setRateValue("");
      // setLegderAmount("");
      // setFinalAmount("");
      // setAccNarration("");
      // setMetalNarration("");
      // setShortageRfix("");
      // setTempRate("");
      // setAvgeRate("");
      // setTempApiWeight("");
      // setAdjustedRate(false);
      // setPrintObj({
      //   supplierName: "",
      //   supAddress: "",
      //   supplierGstUinNum: "",
      //   supPanNum: "",
      //   supState: "",
      //   supCountry: "",
      //   supStateCode: "",
      //   purcVoucherNum: "",
      //   partyInvNum: "",
      //   voucherDate: moment().format("YYYY-MM-DD"),
      //   placeOfSupply: "",
      //   orderDetails: [],
      //   taxableAmount: "",
      //   sGstTot: "",
      //   cGstTot: "",
      //   iGstTot: "",
      //   roundOff: "",
      //   grossWtTOt: "",
      //   netWtTOt: "",
      //   fineWtTot: "",
      //   totalInvoiceAmt: "",
      //   TDSTCSVoucherNum: "",
      //   legderName: "",
      //   taxAmount: "",
      //   metNarration: "",
      //   accNarration: "",
      //   balancePayable: ""
      // })
      // resetForm();

      // getVoucherNumber();
    }
  }
  const handleBeforePrint = React.useCallback(() => {
    console.log("`onBeforePrint` called"); // tslint:disable-line no-console
  }, []);

  const handleOnBeforeGetContent = React.useCallback(() => {
    console.log("`onBeforeGetContent` called"); // tslint:disable-line no-console
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
  }, []); //setText

  const reactToPrintContentSummary = React.useCallback(() => {
    return componentRefSummary.current;
    //eslint-disable-next-line
  }, [componentRefSummary.current]);

  const reactToPrintContentDesign = React.useCallback(() => {
    return componentRefDesign.current;
    //eslint-disable-next-line
  }, [componentRefDesign.current]);

  function getDateAndTime() {
    const currentDate = new Date();
    return moment(currentDate).format("DD-MM-YYYY h:mm A");
  }

  const handleLotDesignPrint = useReactToPrint({
    content: reactToPrintContentDesign,
    documentTitle: "Planning_Lot_Design_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    // removeAfterPrint: true
  });

  const handleLotSummaryPrint = useReactToPrint({
    content: reactToPrintContentSummary,
    documentTitle: "Planning_Lot_Summary_" + getDateAndTime(),
    onBeforeGetContent: handleOnBeforeGetContent,
    onBeforePrint: handleBeforePrint,
    onAfterPrint: handleAfterPrint,
    // removeAfterPrint: true
  });

  function handleChange(e) {
    const isSelected = parseFloat(e.target.value);
    console.log(e.target.value);
    setVoucherPrintType(isSelected);
  }

  function handlePrint() {
    console.log(voucherPrintType);
    if (voucherPrintType === 0) {
      handleLotSummaryPrint();
    } else {
      handleLotDesignPrint();
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchData && searching) {
        setPlanningLotsList([]);
        setCount(0);
        setPage(0);
        setFilters();
      }
    }, 800);
    return () => {
      clearTimeout(timeout);
    };
  }, [searchData]);


  function handleChangePage(event, newPage) {
    let tempPage = page;
    setPage(newPage);
    if (newPage > tempPage && (newPage + 1) * 10 > planningLotsList.length) {
      setFilters(Number(newPage + 1));
    }
  }
  
  useEffect(() => {
    setFilters();
  }, []);

  function setFilters(tempPageNo) {
    let url = "api/productionPlanning/lot/listing?";
    if (page !== "") {
      if (!tempPageNo) {
        url = url + "page=" + 1;
      } else {
        url = url + "page=" + tempPageNo;
      }
    }
    if (searchData.orderDate !== "") {
      url =
        url +
        "&order_date=" +
        moment(searchData.orderDate).format("DD-MM-YYYY");
    }
    if (searchData.shipingDate !== "") {
      url =
        url +
        "&shipping_date=" +
        moment(searchData.shipingDate).format("DD-MM-YYYY");
    }
    if (searchData.orderNo !== "") {
      url = url + "&order_no=" + searchData.orderNo;
    }
    console.log(url, "---------", tempPageNo);

    if (!tempPageNo) {
      console.log("innnnnnnnnnnnnnn444444");
      getPlanningLots(url);
    } else {
      if (count > planningLotsList.length) {
        getPlanningLots(url);
      }
    }
  }

   function getPlanningLots(url) {
    setLoading(true);
    Axios.get(Config.getCommonUrl() + url)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          // setPlanningLotsList(response.data.data);
          // setFilteredArrData(response.data.data);
          if (planningLotsList.length === 0) {
            console.log("if");
            setPlanningLotsList(response.data.data);
          } else {
            console.log("else", planningLotsList);
            setPlanningLotsList((apiData) => [
              ...apiData,
              ...response.data.data,
            ]);
          }
          setCount(response.data.count);
        } else {
          dispatch(
            Actions.showMessage({
              message: response.data.message,
              variant: "error",
            })
          );
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        handleError(error, dispatch, {
          api: url,
        });
      });
  }

  function handleTransferLot(data) {
    console.log(data);
    setTransferModal(true);
    setSelectedRow(data);
  }

  const exportToExcel = (type, fn, dl) => {
    setIsExpert(true);
    if (planningLotsList.length > 0) {
      const wb = XLSX.utils.book_new();

      // Export the first table
      const tbl1 = document.getElementById("tbl_exporttable_to_xls");
      const ws1 = XLSX.utils.table_to_sheet(tbl1);
      XLSX.utils.book_append_sheet(wb, ws1, "Table 1");

      return dl
        ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
        : XLSX.writeFile(wb, fn || `Planning Lots.${type || "xlsx"}`);
    } else {
      setIsExpert(false);
      dispatch(
        Actions.showMessage({
          message: "Can not Export Empty Data",
          variant: "error",
        })
      );
    }
    setIsExpert(false);
  };

  const handleSearchChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setSearchData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setSearching(true);
  };

 
  // const filteredData = planningLotsList.filter((row) => {
  //   const searchDataLower = searchData.toLowerCase();
  //   const fieldsToSearch = [
  //     "number",
  //     "purity",
  //     "pcs",
  //     "stone_pcs",
  //     "total_gross_wgt",
  //     "total_stone_weight",
  //     "total_net_wgt",
  //     "ProductCategory.category_name",
  //   ];

  //   return fieldsToSearch.some((field) => {
  //     const fieldValue = getNestedFieldValue(row, field);
  //     if (fieldValue !== undefined) {
  //       const fieldValueLower = String(fieldValue).toLowerCase();
  //       return fieldValueLower.includes(searchDataLower);
  //     }
  //     return false;
  //   });
  // });
  // setFilteredArrData(filteredData);

  // Helper function to get nested field value
  function getNestedFieldValue(obj, field) {
    const fieldParts = field.split('.');
    let value = obj;
    for (const part of fieldParts) {
      if (value && value[part] !== undefined) {
        value = value[part];
      } else {
        return undefined;
      }
    }
    return value;
  }
  
  function LotModalOpen() {
    setTransferModal(true);
  }
  
  function LotModalClose() {
    setTransferModal(false);
  }

  function handlePrintLot(id) {
    Axios.get(
      Config.getCommonUrl() + `api/productionPrintVoucher/planAndlot/${id}`
    )
      .then((response) => {
        console.log(response);
        if (response.data.success) {
          setModalOpen(false);
          setPrintObj(response.data.data);
          setPrintObjMultiple(response.data.MultipleData);
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
          api: `api/productionPrintVoucher/planAndlot/${id}`,
        });
      });
  }


  return (
    <>
    <Grid container spacing={2} style={{display:"flex", justifyContent:"flex-end"}}>
   
        <Grid item xs={4} style={{marginTop:"18px"}}>
         <div className={classes.search} component="form">
           <InputBase
              name="orderNo"
               className={classes.input}
               placeholder="Search (By Order No.)"
              inputProps={{ "aria-label": "search" }}
               value={searchData.orderNo}
              onChange={handleSearchChange}
            />
           <IconButton
              type="submit"
               className={classes.iconButton}
               aria-label="search"
             >
             <SearchIcon />
           </IconButton>
          </div>
        </Grid>

         <Grid item xs={3} lg={2}>
           <label>Order Date</label>
           <TextField
             type="date"
             name="orderDate"
             value={searchData.orderDate}
             onChange={handleSearchChange}
             variant="outlined"
             fullWidth
             InputLabelProps={{
               shrink: true,
             }}
           />
         </Grid>

         <Grid item xs={3} lg={2}>
           <label>Shipping Date</label>
           <TextField
             type="date"
             name="shipingDate"
             value={searchData.shipingDate}
             onChange={handleSearchChange}
             variant="outlined"
             fullWidth
             InputLabelProps={{
               shrink: true,
             }}
           />
         </Grid>

          <Grid item xs={2} lg={1} style={{paddingTop:"23px"}}>
          <Button
            variant="contained"
            aria-label="Register"
            onClick={(event) => {
              exportToExcel("xlsx");
            }}
            size="small"
            id="voucher-list-btn"
            className={classes.button}
            style={{ marginBlock: 5 , background: "#415BD4", color:"#FFFFFF"}}
          >
            Download
          </Button>
         </Grid>

    </Grid>

    {loading && <Loader />}

  <div className="mt-16">
    <TablePagination
          labelRowsPerPage=""
          component="div"
          count={count}
          rowsPerPage={10}
          page={page}
          backIconButtonProps={{
            "aria-label": "Previous Page",
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page",
          }}
          onPageChange={handleChangePage}
          style={{ background: "#FFFFFF" }}
        />

<Paper className={classes.tabroot}>
    <Table className={classes.table}>
      <TableHead>
        <TableRow> 

          <TableCell className={classes.tableRowPad}>
           Order Number
          </TableCell>
          <TableCell className={classes.tableRowPad}>
            Lot Number
          </TableCell>
          <TableCell
            className={classes.tableRowPad} align="left">
            Lot Category
          </TableCell>
          <TableCell
            className={classes.tableRowPad} align="left">
            Purity
          </TableCell>
          <TableCell
            className={classes.tableRowPad} align="left">
            Lot Pcs
          </TableCell>
          <TableCell
            className={classes.tableRowPad} align="left">
            Stone Pcs
          </TableCell>
          <TableCell
            className={classes.tableRowPad} align="left">
           Gross weight
          </TableCell>
          <TableCell
            className={classes.tableRowPad} align="left">
            Stone Weight
          </TableCell>
          <TableCell
            className={classes.tableRowPad} align="left">
            Net Weight
          </TableCell>
          <TableCell
            className={classes.tableRowPad} align="left">
           Order Info
          </TableCell> 
          <TableCell
            className={classes.tableRowPad} align="left">
            Current Process
          </TableCell>
          <TableCell
            className={classes.tableRowPad} align="left">
            Status
          </TableCell>
          <TableCell
            className={classes.tableRowPad} align="left">
            Shipping Date
          </TableCell>

           {/* <TableCell
            className={classes.tableRowPad} align="left">
            Start Date
           </TableCell>
           <TableCell
            className={classes.tableRowPad} align="left">
            End Date
          </TableCell> */}

          <TableCell
            className={classes.tableRowPad} align="left" style={{width: "210px", paddingRight: 15, textAlign:"center"}}>
            Action
          </TableCell>

        </TableRow>
      </TableHead>

      <TableBody>
      {planningLotsList
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row,i) => (
            <TableRow key={i}>
              {console.log(row)}
            
              <TableCell className={classes.tableRowPad}  style={{ paddingLeft: 15 }}>
               {row.Production_lot?.order_number}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {row.number}
              </TableCell>
              <TableCell
                align="left"
                className={classes.tableRowPad}
              >
                {row.ProductCategory?.category_name}
              </TableCell>
              <TableCell
                align="left"
                className={classes.tableRowPad}
              >
                {row.purity}
              </TableCell>
              <TableCell
                align="left"
                className={classes.tableRowPad}
              >
             {row.pcs}
              </TableCell>
              <TableCell
                align="left"
                className={classes.tableRowPad}
              >
                {row.stone_pcs}
              </TableCell>
              <TableCell
                align="left"
                className={classes.tableRowPad}
              >
                {row.total_gross_wgt}
              </TableCell>
              <TableCell
                align="left"
                className={classes.tableRowPad}
              >
                {row.total_stone_weight}
              </TableCell>
              <TableCell
                align="left"
                className={classes.tableRowPad}
              >
                {row.total_net_wgt}
              </TableCell>
              <TableCell
                align="left"
                className={classes.tableRowPad}
              >
                {row.order_info === 1 ? "Casted" : "Not Casted"}
              </TableCell>
              <TableCell
                align="left"
                className={classes.tableRowPad}
              >
                {row.ProcessDetails
                    ? row.ProcessDetails.process_name
                    : "-"}
              </TableCell>
              <TableCell
                align="left"
                className={classes.tableRowPad}
              >
                {row.status ? row.status : "-"}
              </TableCell>
              <TableCell
                align="left"
                className={classes.tableRowPad}
              >
                {row.shipping_date
                   ? moment(row.shipping_date).format("DD-MM-YYYY")
                   : "-"}
              </TableCell>

               {/* <TableCell align="left" className={classes.tableRowPad}>
                      {moment.utc(row.created_at).local().format("DD-MM-YYYY")}
                    </TableCell>
                 <TableCell align="left" className={classes.tableRowPad}>
                     {moment.utc(row.created_at).local().format("DD-MM-YYYY")}
                   </TableCell> */}


              <TableCell className={classes.tableRowPad}  style={{ paddingRight: 15 }}>
                  <Button
                       style={{
                        backgroundColor:
                         row.is_transfer === 1 ? "gray" : "#415bd4",
                        color:
                         row.is_transfer === 1 ? "#c5c7cb" : "#FFFFFF",
                       }}
                          variant="contained"
                          aria-label="Register"
                          size="small"
                          disabled={row.is_transfer === 1}
                          onClick={() => handleTransferLot(row)}
                        >
                          {row.is_transfer === 1
                            ? "Transfered"
                            : "Transfer Lot"}
                    </Button>
                    <Button
                          style={{
                            color: "#FFFFFF",
                            background: "#415bd4",
                            marginLeft: "7px",
                          }}
                          variant="contained"
                          aria-label="Register"
                          size="small"
                          onClick={() => handleSetPrint(row.id)}
                        >
                          Print
                     </Button>
              </TableCell>

            </TableRow>
          ))}
      </TableBody>
    </Table>


    <Table className={classes.table} id="tbl_exporttable_to_xls" style={{display: "none"}}>
      <TableHead>
        <TableRow> 

          <TableCell className={classes.tableRowPad}>
           Order Number
          </TableCell>
          <TableCell className={classes.tableRowPad}>
            Lot Number
          </TableCell>
          <TableCell
            className={classes.tableRowPad} align="left">
            Lot Category
          </TableCell>
          <TableCell
            className={classes.tableRowPad} align="left">
            Purity
          </TableCell>
          <TableCell
            className={classes.tableRowPad} align="left">
            Lot Pcs
          </TableCell>
          <TableCell
            className={classes.tableRowPad} align="left">
            Stone Pcs
          </TableCell>
          <TableCell
            className={classes.tableRowPad} align="left">
           Gross weight
          </TableCell>
          <TableCell
            className={classes.tableRowPad} align="left">
            Stone Weight
          </TableCell>
          <TableCell
            className={classes.tableRowPad} align="left">
            Net Weight
          </TableCell>
          <TableCell
            className={classes.tableRowPad} align="left">
           Order Info
          </TableCell> 
          <TableCell
            className={classes.tableRowPad} align="left">
            Current Process
          </TableCell>
          <TableCell
            className={classes.tableRowPad} align="left">
            Status
          </TableCell>
          <TableCell
            className={classes.tableRowPad} align="left">
            Shipping Date
          </TableCell>

        </TableRow>
      </TableHead>

      <TableBody>
      {planningLotsList
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row,i) => (
            <TableRow key={i}>
              {console.log(row)}
            
              <TableCell className={classes.tableRowPad}  style={{ paddingLeft: 15 }}>
               {row.Production_lot?.order_number}
              </TableCell>
              <TableCell className={classes.tableRowPad}>
                {row.number}
              </TableCell>
              <TableCell
                align="left"
                className={classes.tableRowPad}
              >
                {row.ProductCategory?.category_name}
              </TableCell>
              <TableCell
                align="left"
                className={classes.tableRowPad}
              >
                {row.purity}
              </TableCell>
              <TableCell
                align="left"
                className={classes.tableRowPad}
              >
             {row.pcs}
              </TableCell>
              <TableCell
                align="left"
                className={classes.tableRowPad}
              >
                {row.stone_pcs}
              </TableCell>
              <TableCell
                align="left"
                className={classes.tableRowPad}
              >
                {row.total_gross_wgt}
              </TableCell>
              <TableCell
                align="left"
                className={classes.tableRowPad}
              >
                {row.total_stone_weight}
              </TableCell>
              <TableCell
                align="left"
                className={classes.tableRowPad}
              >
                {row.total_net_wgt}
              </TableCell>
              <TableCell
                align="left"
                className={classes.tableRowPad}
              >
                {row.order_info === 1 ? "Casted" : "Not Casted"}
              </TableCell>
              <TableCell
                align="left"
                className={classes.tableRowPad}
              >
                {row.ProcessDetails
                    ? row.ProcessDetails.process_name
                    : "-"}
              </TableCell>
              <TableCell
                align="left"
                className={classes.tableRowPad}
              >
                {row.status ? row.status : "-"}
              </TableCell>
              <TableCell
                align="left"
                className={classes.tableRowPad}
              >
                {row.shipping_date
                   ? moment(row.shipping_date).format("DD-MM-YYYY")
                   : "-"}
              </TableCell>     

            </TableRow>
          ))}
      </TableBody>
    </Table>

</Paper>

  <LotTransfer
          openModal={transferModal}
          closeModal={LotModalClose}
          rowData={selectedRow}
        />
   </div>

     <div>
        <Modal open={open} onClose={handleClose} className={classes.modal}>
          <div style={{ width: 500, background: "#FFFFFF" }}>
            <Typography
              variant="h6"
              className={classes.title}
              style={{ textAlign: "center", position: "relative", background:"#000000" }}
            >
              Voucher Format
              <IconButton
                style={{
                  padding: "0",
                  position: "absolute",
                  right: "5px",
                  top: "16px",
                  fontSize: "22px",
                }}
                onClick={handleClose}
              >
                <Icon className="mr-8" style={{ color: "#ffffff" }}>
                  close
                </Icon>
              </IconButton>
            </Typography>

            <Grid container className={classes.modalBody} spacing={2}>
              <FormControl>
                <RadioGroup
                  className="packingslip-table-main"
                  // defaultValue={0}
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={voucherPrintType}
                  onChange={(e) => handleChange(e)}
                >
                  <FormControlLabel
                    value={0}
                    control={<Radio />}
                    label="Lot Summary"
                  />
                  <FormControlLabel
                    value={1}
                    control={<Radio />}
                    label="Lot Design"
                  />
                </RadioGroup>
              </FormControl>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  className={classes.actionBtn}
                  onClick={handlePrint}
                >
                  Print
                </Button>
              </Grid>
            </Grid>
          </div>
        </Modal>
      </div>

      <div style={{ display: "none" }}>
        <LotSummary
          ref={componentRefSummary}
          printObj={printObj}
          getDateAndTime={getDateAndTime()}
        ></LotSummary>
      </div>

      <div style={{ display: "none" }}>
        <LotDesign
          ref={componentRefDesign}
          printObj={printObjMultiple}
        ></LotDesign>
      </div>

</>
  )
}

export default PlanningLots