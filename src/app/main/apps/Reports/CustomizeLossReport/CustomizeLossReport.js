import React, { useState, useEffect } from "react";
import { Typography, TextField, TableFooter, Box } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { FuseAnimate } from "@fuse";
// import BreadcrumbsHelper from "app/main/BreadCrubms/BreadcrumbsHelper";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import axios from "axios";
import Config from "app/fuse-configs/Config";
import * as Actions from "app/store/actions";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Select, { createFilter } from "react-select";
import moment from "moment";
import NavbarSetting from "app/main/NavbarSetting/NavbarSetting";
import handleError from "app/main/ErrorComponent/ErrorComponent";
import * as XLSX from "xlsx";
import Loader from "app/main/Loader/Loader";
import jsPDF from "jspdf";
import "jspdf-autotable";
import HelperFunc from "../../SalesPurchase/Helper/HelperFunc";

const useStyles = makeStyles((theme) => ({
  root: {},
  tableRowPad: {
    padding: 7,
    fontSize: "1.2rem",
  },
  tableFooter: {
    padding: 7,
    backgroundColor: "#E3E3E3",
  },
}));

const CustomizeLossReport = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    NavbarSetting("Factory Report", dispatch);
  }, []);

  const selectStyles = {
    input: (base) => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit",
      },
    }),
  };

  const [department, setDepartment] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);

  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [toDtErr, setToDtErr] = useState("");

  const [fromDate, setFromDate] = useState(moment().startOf("month").format("YYYY-MM-DD"));
  const [fromDtErr, setFromDtErr] = useState("");

  const [workStationList, setWorkStationList] = useState([]);
  const [workStationListArr, setWorkStationListArr] = useState([]);

  const [processList, setProcessList] = useState([]);
  const [processNameArr, setProcessNameArr] = useState([]);

  const [orderNo, setOrderNo] = useState([]);
  const [selectedOrderNo, setSelectedOrderNo] = useState([]);

  const [customizedLossData, setCustomizedLossData] = useState([]);
  const [customizesLossSummaryData, setCustomizesLossSummaryData] = useState([]);

  const [selectedKtArr, setsSelectedKtArr] = useState([]);
  
  const ktArr = [
    { value: 91.8 },
    { value: 83.5 },
    { value: 75.1 },
    { value: 58.5 },
  ];

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    var today = moment().format("YYYY-MM-DD"); //new Date();

    if (name === "fromDate") {
      setFromDate(value);
      // fromDtValidation()
      let dateVal = moment(value).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD");
      if (dateVal <= today && minDateVal < dateVal) {
        setFromDtErr("");
      } else {
        setFromDtErr("Enter Valid Date");
      }
    } else if (name === "toDate") {
      setToDate(value);
      // toDtValidation()
      let dateVal = moment(value).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD");
      if (dateVal <= today && minDateVal < dateVal) {
        setToDtErr("");
      } else {
        setToDtErr("Enter Valid Date");
      }
    }
  }

  function fromDtValidation() {
    const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
    if (!fromDate || dateRegex.test(fromDate) === false) {
      var today = moment().format("YYYY-MM-DD"); //new Date();
      let dateVal = moment(fromDate).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD");
      if (dateVal <= today && minDateVal < dateVal) {
        return true;
      } else {
        setFromDtErr("Enter Valid Date!");
        return false;
      }
    }
    return true;
  }


  function toDtValidation() {
    const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
    if (!toDate || dateRegex.test(toDate) === false) {
      var today = moment().format("YYYY-MM-DD"); //new Date();
      let dateVal = moment(toDate).format("YYYY-MM-DD"); //new Date(value);
      let minDateVal = moment(new Date("01/01/1900")).format("YYYY-MM-DD"); //new Date("01/01/1900");
      if (dateVal <= today && minDateVal < dateVal) {
        return true;
      } else {
        setToDtErr("Enter Valid Date!");
        return false;
      }
    }
    return true;
  }

const exportToExcel = (type, fn, dl) => {
  if (customizedLossData.length > 0) {
      const wb = XLSX.utils.book_new();
      const tables = [
          document.getElementById("tbl_exporttable_to_xls"),
          document.getElementById("tbl_exporttable_to_xls2"),
      ];

      tables.forEach((table, index) => {
          const ws = XLSX.utils.table_to_sheet(table);
          XLSX.utils.book_append_sheet(wb, ws, `Table${index + 1}`);
      });

      return dl
          ? XLSX.write(wb, { bookType: type, bookSST: true, type: "base64" })
          : XLSX.writeFile(wb, fn || `Customized_Loss.${type || "xlsx"}`);
  } else {
      dispatch(Actions.showMessage({ message: "Can not Export Empty Data" }));
  }
};

  const downloadPDF = () => {
    if (customizedLossData.length > 0) {
      const doc = new jsPDF("l", "pt", "a4");
      doc.autoTableSetDefaults({
        startY: 50,
        margin: { top: 70, right: 10, left: 10 },
        tableWidth: "50%",
        showHead: "everyPage",
        showFoot: "lastPage",
        tableLineWidth: 0.5,
        headStyles: {
          fillColor: [211, 211, 211], 
          textColor: [0, 0, 0], 
        },
        footStyles: {
          fillColor: [211, 211, 211], 
          textColor: [0, 0, 0], 
        },
      });
      const tables = [
        document.getElementById("tbl_exporttable_to_xls"),
        document.getElementById("tbl_exporttable_to_xls2"),
      ];
      let startY = 50;
      tables.forEach((table, index) => {
        if (index > 0) {
          startY += tables[index - 1].offsetHeight - 17; 
        }
        doc.autoTable({
          html: table,
          startY: startY,
        });
      });
      doc.save("Customizes_Loss.pdf");
    }else {
      dispatch(Actions.showMessage({ message: "Can not Download Empty PDF" }));
    }
  };

  useEffect(() => {
    getOrderNumber()
    getProcessData()
    getWorkStationList()
    geDepartment()
  }, [])

  function getOrderNumber() {
    axios
      .get(Config.getCommonUrl() + `api/productionreport/order/number`)
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response.data.data);
          setOrderNo(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, {
          api: `api/productionreport/order/number`,
        });
      });
  }

  function getProcessData() {
    axios
      .get(Config.getCommonUrl() + "api/process")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setProcessList(response.data.data);
        } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/process" });
      });
  }

  function getWorkStationList() {
    axios.get(Config.getCommonUrl() + "api/workstation")
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

  function geDepartment() {
    axios.get(Config.getCommonUrl() + "api/admin/getdepartmentlist")
      .then(function (response) {
        if (response.data.success === true) {
          console.log(response);
          setDepartment(response.data.data)
   } else {
          dispatch(Actions.showMessage({ message: response.data.message }));
        }
      })
      .catch((error) => {
        handleError(error, dispatch, { api: "api/admin/getdepartmentlist" });
      });
  }

  useEffect(() => {
    postCustomizedLoss()
  }, []);

  const loadData = () => {
    postCustomizedLoss()
    // setFilters();
  };


function postCustomizedLoss() {
  const orderNumberArray = selectedOrderNo.map((item) => item.label);
  const purityArray = selectedKtArr.map((item) => item.label);
  const processNameArray = processNameArr.map((item) => item.value);
  const DepartmentIdArray = departmentData.map((item) => item.value)
  const WorkStationIdArray = workStationListArr.map((item) => item.value)
  
  const body = {
    from_date : fromDate,
    to_date : toDate,
    purity : purityArray, 
    department_id : DepartmentIdArray,
    workstation_id : WorkStationIdArray,
    process_id : processNameArray,
    order_number : orderNumberArray,
  };
  axios
    .post(
      Config.getCommonUrl() + `api/productionReport/customize/loss`,
      body
    )
    .then(function (response) {
      if (response.data.success === true) {
        console.log(response.data);
        setCustomizedLossData(response.data.stockCodeSummary)
        setCustomizesLossSummaryData(response.data.workstationProcessSummary)
      } else {
        dispatch(Actions.showMessage({ message: response.data.message }));
      }
    })
    .catch((error) => {
      handleError(error, dispatch, {
        api: `api/productionReport/customize/loss`,
        body: body,
      });
    });
  }

  return (
    <div className={clsx(classes.root, props.className, "w-full")}>
      <FuseAnimate animation="transition.slideUpIn" delay={200}>
        <div className="flex flex-col md:flex-row container table-width-mt">
          <div className="flex flex-1 flex-col min-w-0 makeStyles-root-1 pt-20">
            <Grid
              className="MetalLedStatement-main pb-16"
              container
              spacing={4}
              alignItems="stretch"
              style={{ margin: 0 }}
            >
              <Grid item xs={12} sm={4} md={3} key="1" style={{ padding: 0 }}>
                <FuseAnimate delay={300}>
                  <Typography className="pl-28 pt-16 text-18 font-700">
                    Customize Loss Report
                  </Typography>
                </FuseAnimate>
                {/* <BreadcrumbsHelper /> */}
              </Grid>
            </Grid>

            <div className="main-div-alll">
            <Box style={{ marginInline: 16, marginTop: 16 }}>

            <Grid
                className="metalled-statement-pr"
                container
                spacing={3}
                style={{ padding: 20 }}
              >
              <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
                  <label>Start Date</label>
                <TextField
                //   label="Start Date"
                  name="fromDate"
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
                />
              </Grid>

              <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
                  <label>End Date</label>
                <TextField
                //   label="End Date"
                  name="toDate"
                  value={toDate}
                  error={toDtErr.length > 0 ? true : false}
                  helperText={toDtErr}
                  type="date"
                  onChange={(e) => handleInputChange(e)}
                  variant="outlined"
                  fullWidth
                  format="yyyy/MM/dd"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />

              </Grid>

              <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
                  <label>Select KT</label>
                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    options={ktArr.map((item) => ({
                      value: item.value,
                      label: item.value,
                    }))}
                    value={selectedKtArr}
                    onChange={(e) => setsSelectedKtArr(e)}
                    placeholder="Select KT"
                    isMulti
                  />
             </Grid>

             <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
                  <label>Select Deparment</label>
                <Select
                  filterOption={createFilter({ ignoreAccents: false })}
                  classes={classes}
                  styles={selectStyles}
                  options={department.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                  value={departmentData}
                  onChange={(e) => setDepartmentData(e)}
                  isMulti
                  placeholder="Select Deparment"
                />            
              </Grid>

              <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
                  <label>Select WorkStation</label>
                <Select
                  filterOption={createFilter({ ignoreAccents: false })}
                  classes={classes}
                  styles={selectStyles}
                  options={workStationList.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                  value={workStationListArr}
                  onChange={(e) => setWorkStationListArr(e)}
                  isMulti
                  placeholder="Select WorkStation"
                />
              </Grid>

              <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
                  <label>Select Process</label>
                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    options={processList.map((optn) => ({
                      value: optn.id,
                      label: optn.process_name,
                    }))}
                    value={processNameArr}
                    onChange={(e) => setProcessNameArr(e)}
                    placeholder="Select Process"
                    isMulti
                  />
               </Grid>
             
               <Grid item lg={2} md={4} sm={4} xs={12} style={{ padding: 5 }}>
                  <label>Select Order No</label>
                  <Select
                    filterOption={createFilter({ ignoreAccents: false })}
                    classes={classes}
                    styles={selectStyles}
                    value={selectedOrderNo}
                    onChange={(e) => setSelectedOrderNo(e)}
                    options={orderNo.map((item) => ({
                      value: item.id,
                      label: item.order_number,
                    }))}
                    placeholder="Select Order No"
                    isMulti
                  />
                </Grid>


                <Grid style={{ marginTop: "25px" }}>
                <Button
                   className="load_Data-btn ml-8"
                   variant="contained"
                   aria-label="Register"
                  onClick={loadData}
                >
                  Load Data
                </Button>
              </Grid>
              
              <Grid style={{ marginTop: "25px" }}>
                  <Button
                    className="export_btn"
                    variant="contained"
                    aria-label="Register"
                    onClick={(event) => {
                      exportToExcel("xlsx");
                    }}
                  >
                    Export
                  </Button>
                </Grid>
              
                <Grid style={{ marginTop: "25px" }}>
                <Button
                style={{width: "100%"}}
                  className="export_btn"
                  variant="contained"
                  aria-label="Register"
                  onClick={downloadPDF}
                >
                  Download pdf
                </Button>
              </Grid>
            </Grid>
           
   <Grid container spacing={2} style={{marginTop:"16px"}}>

       <Grid item xs={12} md={6} lg={8}
      >                
          <Table className={classes.table}  
          id="tbl_exporttable_to_xls">
                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableRowPad}>
                        Department 
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Worker Station
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Process
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        KT
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Loss Weight Net
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Loss Weight Fine
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {console.log(customizedLossData)}
                    {customizedLossData.length === 0 ? (                     
                     <TableRow>
                          <TableCell colSpan={6} className={classes.tableRowPad} style={{textAlign:"center"}}>
                            No Data
                          </TableCell>
                      </TableRow>
                     ) : (
                      customizedLossData.map((item, i) => {
                        return (
                          <TableRow key={i}>
                            <TableCell className={classes.tableRowPad}>
                              {item.department_name ? item.department_name : "-"}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                            {item.workstation_name ? item.workstation_name : "-"}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                            {item.process_name ? item.process_name : "-"}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                            {item.purity ? item.purity : "-"}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                            {item.loss_weight_net ? item.loss_weight_net : "-"}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                            {item.loss_weight_fine ? item.loss_weight_fine : "-"}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>

                  <TableFooter>
                  <TableRow >
                     <TableCell className={classes.tableRowPad} style={{fontWeight:650}}>
                      Total 
                     </TableCell>
                     <TableCell className={classes.tableRowPad} style={{fontWeight:650}}></TableCell>
                     <TableCell className={classes.tableRowPad} style={{fontWeight:650}}></TableCell>
                     <TableCell className={classes.tableRowPad} style={{fontWeight:650}}>
                       {Config.numWithComma(
                         HelperFunc.getTotalOfField(customizedLossData, "purity")
                        )} 
                     </TableCell>
                     <TableCell className={classes.tableRowPad} style={{fontWeight:650}}>
                     {Config.numWithComma(
                         HelperFunc.getTotalOfField(customizedLossData, "loss_weight_net")
                        )} 
                     </TableCell>
                      <TableCell className={classes.tableRowPad} style={{fontWeight:650}}>
                      {Config.numWithComma(
                         HelperFunc.getTotalOfField(customizedLossData, "loss_weight_fine")
                        )} 
                      </TableCell>
                 </TableRow>
             </TableFooter>

          </Table> 
      </Grid>

      <Grid item xs={12} md={6} lg={4}
    >
          <Table className={classes.table} id="tbl_exporttable_to_xls2" >

                  <TableHead>
                    <TableRow>
                      <TableCell className={classes.tableRowPad}>
                        Worker Station
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Process
                      </TableCell>
                      <TableCell className={classes.tableRowPad}>
                        Loss Weight Fine 
                      </TableCell>  
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {customizesLossSummaryData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} className={classes.tableRowPad} style={{textAlign:"center"}}>
                          No Data
                        </TableCell>
                      </TableRow>
                     ) : (
                      customizesLossSummaryData.map((item, i) => {
                         return ( 
                          <TableRow key={i}>
                            <TableCell className={classes.tableRowPad}>
                            {item?.workstation_name ? item?.workstation_name : "-"}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                              {item?.process_name ? item?.process_name : "-"}
                            </TableCell>
                            <TableCell className={classes.tableRowPad}>
                            {item?.total_loss_fine ? item?.total_loss_fine : "-"}
                            </TableCell> 
                          </TableRow>
                         );
                      })
                    )} 
                  </TableBody>

                  <TableFooter>
                  <TableRow>
                     <TableCell className={classes.tableRowPad} style={{fontWeight:650}}> Total</TableCell>
                     <TableCell className={classes.tableRowPad} style={{fontWeight:650}}></TableCell>
                     <TableCell className={classes.tableRowPad} style={{fontWeight:650}}>
                     {Config.numWithComma(
                         HelperFunc.getTotalOfField(customizesLossSummaryData, "total_loss_fine")
                        )} 
                     </TableCell>
                 </TableRow>
             </TableFooter>

         </Table>  
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

export default CustomizeLossReport;
